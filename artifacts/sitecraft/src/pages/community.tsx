import { useState, useMemo, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useTranslation } from "@/lib/i18n";
import { Link } from "wouter";
import { useAuth } from "@/lib/auth";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, Users, Heart, ArrowRight, Search, Plus, 
  ThumbsUp, MapPin, Calendar, Sparkles, X, Send, Award, Star, User, Lock, Trash2, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Comment {
  id: string;
  author: string;
  wilaya: string;
  text: string;
  time: string;
}

interface Post {
  id: string;
  title: string;
  desc: string;
  category: "showcase" | "qa" | "tips" | "announcements";
  author: string;
  wilaya: string;
  time: string;
  votes: number;
  voted: boolean;
  comments: Comment[];
  rating: number;
  ratingCount: number;
  userRating: number; // 0 if not rated by current user
  createdBy?: string;
}

export default function Community() {
  const { t, language } = useTranslation();
  const { isAuthenticated, user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("" );
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [newCommentTexts, setNewCommentTexts] = useState<Record<string, string>>({});
  const [focusedCommentPostId, setFocusedCommentPostId] = useState<string | null>(null);
  
  // Track user-specific votes and ratings in localStorage to give instant UI feedback
  const [votedPostIds, setVotedPostIds] = useState<Record<string, boolean>>({});
  const [ratedPosts, setRatedPosts] = useState<Record<string, number>>({});
  const [myCreatedPostIds, setMyCreatedPostIds] = useState<string[]>([]);
  const [postToDeleteId, setPostToDeleteId] = useState<string | null>(null);

  // YouTube-Style Creator Box State (collapsed / expanded)
  const [isPostBoxExpanded, setIsPostBoxExpanded] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostDesc, setNewPostDesc] = useState("");
  const [newPostCategory, setNewPostCategory] = useState<"showcase" | "qa" | "tips" | "announcements">("showcase");
  const [newPostAuthor, setNewPostAuthor] = useState("");
  const [newPostWilaya, setNewPostWilaya] = useState("");
  const [newPostRating, setNewPostRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  const isRTL = language === "ar";

  // Fetch posts from persistent API backend database
  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/community/posts");
      if (res.ok) {
        const data = await res.json();
        
        // Enrich backend posts with local vote/rate states from localStorage
        const enriched = data.map((post: any) => ({
          ...post,
          voted: votedPostIds[post.id] || false,
          userRating: ratedPosts[post.id] || 0
        }));
        setPosts(enriched);
      }
    } catch (e) {
      console.error("Failed to load community posts from backend database:", e);
    } finally {
      setIsLoading(false);
    }
  };

  // Load local votes/ratings cache and fetch posts
  useEffect(() => {
    const cachedVotes = localStorage.getItem("corbit_community_votes");
    const cachedRates = localStorage.getItem("corbit_community_rates");
    const cachedMyPosts = localStorage.getItem("corbit_community_my_posts");
    
    const parsedVotes = cachedVotes ? JSON.parse(cachedVotes) : {};
    const parsedRates = cachedRates ? JSON.parse(cachedRates) : {};
    const parsedMyPosts = cachedMyPosts ? JSON.parse(cachedMyPosts) : [];
    
    setVotedPostIds(parsedVotes);
    setRatedPosts(parsedRates);
    setMyCreatedPostIds(parsedMyPosts);
  }, []);

  // Pre-fill user name inside Post Creator Box if logged in
  useEffect(() => {
    if (user?.name) {
      setNewPostAuthor(user.name);
    }
  }, [user]);

  // Trigger load when cache state is set
  useEffect(() => {
    fetchPosts();
  }, [votedPostIds, ratedPosts]);

  // Filter & Search Logic
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesCategory = activeCategory === "all" || post.category === activeCategory;
      const matchesSearch = searchQuery === "" || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.wilaya.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [posts, activeCategory, searchQuery]);

  // Vote Handler (sends update to backend DB & persists locally)
  const handleVote = async (id: string) => {
    const isCurrentlyVoted = votedPostIds[id] || false;
    const nextVotedState = !isCurrentlyVoted;

    // Upvote client-side instantly for butter-smooth visual response
    setPosts(prev => prev.map(post => {
      if (post.id === id) {
        return {
          ...post,
          votes: nextVotedState ? post.votes + 1 : Math.max(0, post.votes - 1),
          voted: nextVotedState
        };
      }
      return post;
    }));

    // Update LocalStorage cache
    const updatedVotes = { ...votedPostIds, [id]: nextVotedState };
    setVotedPostIds(updatedVotes);
    localStorage.setItem("corbit_community_votes", JSON.stringify(updatedVotes));

    try {
      // Persist to Express backend DB
      await fetch(`/api/community/posts/${id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVoted: nextVotedState })
      });
    } catch (e) {
      console.error("Failed to persist vote to backend database:", e);
    }
  };

  // Interactive Live Rating Handler (sends update to backend DB & persists locally)
  const handleRatePost = async (postId: string, newRate: number) => {
    const previousUserRating = ratedPosts[postId] || 0;

    // Recalculate client-side instantly for premium visual response
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const currentTotalScore = post.rating * post.ratingCount;
        let updatedCount = post.ratingCount;
        let updatedTotalScore = currentTotalScore;

        if (previousUserRating > 0) {
          updatedTotalScore = currentTotalScore - previousUserRating + newRate;
        } else {
          updatedCount += 1;
          updatedTotalScore = currentTotalScore + newRate;
        }

        return {
          ...post,
          rating: Number((updatedTotalScore / updatedCount).toFixed(1)),
          ratingCount: updatedCount,
          userRating: newRate
        };
      }
      return post;
    }));

    // Update LocalStorage cache
    const updatedRates = { ...ratedPosts, [postId]: newRate };
    setRatedPosts(updatedRates);
    localStorage.setItem("corbit_community_rates", JSON.stringify(updatedRates));

    try {
      // Persist rating to Express backend DB
      await fetch(`/api/community/posts/${postId}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: newRate, previousUserRating })
      });
    } catch (e) {
      console.error("Failed to persist rating to backend database:", e);
    }
  };

  // Toggle Comments Expand
  const toggleComments = (postId: string) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  // Submit Comment Handler (sends update to backend DB)
  const handleAddComment = async (postId: string) => {
    const text = newCommentTexts[postId]?.trim();
    if (!text) return;

    const author = "Algeria Web Studio";
    const wilaya = "Algiers";

    // Append client-side instantly for butter-smooth visual response
    const tempId = `comment-temp-${Date.now()}`;
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const newComment: Comment = {
          id: tempId,
          author,
          wilaya,
          text,
          time: "Just now"
        };
        return {
          ...post,
          comments: [...post.comments, newComment]
        };
      }
      return post;
    }));

    setNewCommentTexts(prev => ({
      ...prev,
      [postId]: ""
    }));
    setFocusedCommentPostId(null);

    try {
      // Persist comment to Express backend DB
      const res = await fetch(`/api/community/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author, wilaya, text })
      });
      if (res.ok) {
        // Reload all posts to ensure matching IDs and exact order sync
        fetchPosts();
      }
    } catch (e) {
      console.error("Failed to persist comment to backend database:", e);
    }
  };

  // Delete Post Handler (only for authorized user posts)
  const handleDeletePost = (postId: string) => {
    setPostToDeleteId(postId);
  };

  const confirmDeletePost = async () => {
    if (!postToDeleteId) return;
    const targetId = postToDeleteId;
    setPostToDeleteId(null);

    // Instantly remove from client-side state for snappy UI
    setPosts(prev => prev.filter(post => post.id !== targetId));

    try {
      await fetch(`/api/community/posts/${targetId}`, {
        method: "DELETE"
      });
    } catch (e) {
      console.error("Failed to delete post from database:", e);
    }
  };

  // Create Post Submit Handler (sends update to backend DB)
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostDesc.trim() || !newPostAuthor.trim() || !newPostWilaya.trim()) return;

    const newPostData = {
      title: newPostTitle,
      desc: newPostDesc,
      category: newPostCategory,
      author: newPostAuthor,
      wilaya: newPostWilaya,
      rating: newPostRating,
      createdBy: user?.email || user?.name || "Algeria Web Studio"
    };

    // Prepend client-side instantly for butter-smooth visual response
    const tempId = `post-temp-${Date.now()}`;
    const clientTempPost: Post = {
      id: tempId,
      ...newPostData,
      time: "Just now",
      votes: 1,
      voted: true,
      rating: newPostRating,
      ratingCount: 1,
      userRating: newPostRating,
      comments: []
    };
    setPosts([clientTempPost, ...posts]);
    setIsPostBoxExpanded(false);

    // Save vote & rate cache for this new post instantly
    const updatedVotes = { ...votedPostIds, [tempId]: true };
    const updatedRates = { ...ratedPosts, [tempId]: newPostRating };
    setVotedPostIds(updatedVotes);
    setRatedPosts(updatedRates);
    localStorage.setItem("corbit_community_votes", JSON.stringify(updatedVotes));
    localStorage.setItem("corbit_community_rates", JSON.stringify(updatedRates));

    // Also register the temp ID in local created list for instant deletion access
    const tempMyPosts = [...myCreatedPostIds, tempId];
    setMyCreatedPostIds(tempMyPosts);
    localStorage.setItem("corbit_community_my_posts", JSON.stringify(tempMyPosts));

    // Reset Form States
    setNewPostTitle("");
    setNewPostDesc("");
    setNewPostCategory("showcase");
    setNewPostAuthor("");
    setNewPostWilaya("");
    setNewPostRating(5);

    try {
      // Persist post to Express backend DB
      const res = await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPostData)
      });
      if (res.ok) {
        const createdPost = await res.json();
        // Update user votes/rates cache to map the real server ID instead of the temp client ID
        const finalVotes = { ...votedPostIds, [createdPost.id]: true };
        const finalRates = { ...ratedPosts, [createdPost.id]: newPostRating };
        
        // Remove tempId entries and map real server IDs using safe type assertion
        const cleanedVotes = { ...finalVotes };
        delete (cleanedVotes as any)[tempId];

        const cleanedRates = { ...finalRates };
        delete (cleanedRates as any)[tempId];

        setVotedPostIds(cleanedVotes);
        setRatedPosts(cleanedRates);
        localStorage.setItem("corbit_community_votes", JSON.stringify(cleanedVotes));
        localStorage.setItem("corbit_community_rates", JSON.stringify(cleanedRates));

        // Save real server ID in local created list and delete the tempId entry
        const finalMyPosts = [...myCreatedPostIds.filter(id => id !== tempId), createdPost.id];
        setMyCreatedPostIds(finalMyPosts);
        localStorage.setItem("corbit_community_my_posts", JSON.stringify(finalMyPosts));

        fetchPosts();
      }
    } catch (e) {
      console.error("Failed to save post to backend database:", e);
    }
  };

  // Category tags styling
  const getCategoryStyles = (category: string) => {
    switch (category) {
      case "showcase":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "qa":
        return "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20";
      case "tips":
        return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
      case "announcements":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
      default:
        return "bg-slate-500/10 text-slate-600 border-slate-500/20";
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "showcase": return t("community.filter.showcase");
      case "qa": return t("community.filter.qa");
      case "tips": return t("community.filter.tips");
      case "announcements": return t("community.filter.announcements");
      default: return category;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans antialiased" dir={isRTL ? "rtl" : "ltr"}>
      <Navbar />
      
      <main className="flex-1 pb-24">
        
        {/* ── HERO HEADER ── */}
        <section className="relative py-16 overflow-hidden border-b bg-gradient-to-b from-accent/30 via-background to-background">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-10 left-1/4 w-72 h-72 rounded-full bg-indigo-500/5 blur-3xl" />
            <div className="absolute bottom-10 right-1/4 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
          </div>
          
          <div className="container max-w-6xl text-center space-y-5">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold px-4 py-1.5 rounded-full border border-primary/20 text-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {t("community.badge")}
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight"
            >
              {t("community.title")}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto"
            >
              {t("community.subtitle")}
            </motion.p>
          </div>
        </section>

        {/* ── FORUM MAIN INTERFACE ── */}
        <section className="container max-w-6xl mt-10 px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT / CENTER COLUMN - FEEDS & FILTER (8cols) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* ── YOUTUBE-STYLE RICH POST CREATOR BOX ── */}
              <div className="bg-card border border-border/50 rounded-2xl p-4 md:p-5 shadow-sm space-y-4">
                <div className="flex gap-3">
                  {/* Left Avatar circle */}
                  <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                    {isAuthenticated ? <User className="w-5 h-5" /> : <Lock className="w-5 h-5 text-muted-foreground/60" />}
                  </div>
                  
                  {/* Right editable section */}
                  <div className="flex-1 space-y-4">
                    {!isAuthenticated ? (
                      <div>
                        {!isPostBoxExpanded ? (
                          <div className="relative">
                            <input 
                              type="text"
                              placeholder="Log in or register to publish a post..."
                              onClick={() => setIsPostBoxExpanded(true)}
                              className="w-full h-10 bg-transparent text-sm border-b border-border/55 focus:outline-none focus:border-foreground transition-colors cursor-pointer text-muted-foreground/60"
                              readOnly
                            />
                          </div>
                        ) : (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="bg-accent/30 rounded-xl p-4 text-center border border-border/40 space-y-3"
                          >
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary">
                              <Lock className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                              <h4 className="font-bold text-sm text-foreground">Join the Algeria Web Studio Community! 🚀</h4>
                              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                                Log in or register an account to publish showcase posts, ask questions, write comments, upvote, and rate other creators' projects.
                              </p>
                            </div>
                            <div className="flex justify-center gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => setIsPostBoxExpanded(false)}
                                className="px-4 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground rounded-full hover:bg-accent/40 transition-colors"
                              >
                                Cancel
                              </button>
                              <Link href="/login">
                                <Button size="sm" className="rounded-full px-5 py-1 text-xs font-bold shadow-sm">
                                  Log In / Register
                                </Button>
                              </Link>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    ) : (
                      <>
                        {!isPostBoxExpanded ? (
                          <div className="relative">
                            <input 
                              type="text"
                              placeholder="Share an update, request feedback, or ask a question..."
                              onClick={() => setIsPostBoxExpanded(true)}
                              className="w-full h-10 bg-transparent text-sm border-b border-border/55 focus:outline-none focus:border-foreground transition-colors cursor-pointer text-muted-foreground"
                              readOnly
                            />
                          </div>
                        ) : (
                          <motion.form 
                            onSubmit={handleCreatePost}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="space-y-4"
                          >
                            {/* Title Underlined Input */}
                            <div className="relative">
                              <input 
                                type="text"
                                required
                                placeholder="Title of your post..."
                                value={newPostTitle}
                                onChange={(e) => setNewPostTitle(e.target.value)}
                                className="w-full h-10 bg-transparent text-base font-bold border-b border-border/50 focus:outline-none focus:border-primary transition-colors py-1 text-foreground"
                              />
                            </div>

                            {/* Author details & Wilaya side-by-side */}
                            <div className="grid grid-cols-2 gap-4">
                              <input 
                                type="text"
                                required
                                placeholder="Your Name (e.g. Khaled DZ)"
                                value={newPostAuthor}
                                onChange={(e) => setNewPostAuthor(e.target.value)}
                                className="w-full h-9 bg-transparent text-xs border-b border-border/50 focus:outline-none focus:border-primary transition-colors text-foreground"
                              />
                              <input 
                                type="text"
                                required
                                placeholder="Your Wilaya (e.g. Constantine)"
                                value={newPostWilaya}
                                onChange={(e) => setNewPostWilaya(e.target.value)}
                                className="w-full h-9 bg-transparent text-xs border-b border-border/50 focus:outline-none focus:border-primary transition-colors text-foreground"
                              />
                            </div>

                            {/* Category selection */}
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                              <span className="text-[10px] font-bold text-muted-foreground uppercase mr-2">Category:</span>
                              {(["showcase", "qa", "tips", "announcements"] as const).map(cat => (
                                <button
                                  key={cat}
                                  type="button"
                                  onClick={() => setNewPostCategory(cat)}
                                  className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                                    newPostCategory === cat 
                                      ? "bg-foreground text-background border-foreground"
                                      : "bg-accent/40 border-border/50 text-muted-foreground hover:text-foreground"
                                  }`}
                                >
                                  {getCategoryLabel(cat)}
                                </button>
                              ))}
                            </div>

                            {/* Star Rating Picker */}
                            <div className="flex items-center gap-2.5 pt-1.5 border-t border-border/30">
                              <span className="text-xs font-semibold text-muted-foreground">Rating:</span>
                              <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((starValue) => {
                                  const isStarred = starValue <= (hoverRating || newPostRating);
                                  return (
                                    <button
                                      key={starValue}
                                      type="button"
                                      onClick={() => setNewPostRating(starValue)}
                                      onMouseEnter={() => setHoverRating(starValue)}
                                      onMouseLeave={() => setHoverRating(0)}
                                      className="transition-transform hover:scale-110 active:scale-95 focus:outline-none"
                                    >
                                      <Star 
                                        className={`w-5 h-5 transition-all duration-150 ${
                                          isStarred 
                                            ? "text-amber-400 fill-amber-400 filter drop-shadow-[0_0_2px_rgba(245,158,11,0.5)]" 
                                            : "text-muted-foreground/30 hover:text-amber-300"
                                        }`}
                                      />
                                    </button>
                                  );
                                })}
                              </div>
                              <span className="text-[10px] font-bold text-amber-500 ml-1">{(hoverRating || newPostRating)} / 5</span>
                            </div>

                            {/* Description Textarea Underlined */}
                            <div className="relative">
                              <textarea 
                                required
                                rows={3}
                                placeholder="Write details about your project or questions..."
                                value={newPostDesc}
                                onChange={(e) => setNewPostDesc(e.target.value)}
                                className="w-full bg-transparent text-xs border-b border-border/50 focus:outline-none focus:border-primary transition-colors py-2 text-foreground resize-none"
                              />
                            </div>

                            {/* Bottom Actions Row (Cancel & Post) */}
                            <div className="flex justify-end gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => setIsPostBoxExpanded(false)}
                                className="px-4 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground rounded-full hover:bg-accent/40 transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="px-5 py-1.5 text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-sm transition-all"
                              >
                                Post
                              </button>
                            </div>
                          </motion.form>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Controls bar (Search & Filter Tags) */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                
                {/* Category Toggles Slider */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none w-full sm:w-auto">
                  {[
                    { id: "all", label: t("community.all") },
                    { id: "showcase", label: t("community.filter.showcase") },
                    { id: "qa", label: t("community.filter.qa") },
                    { id: "tips", label: t("community.filter.tips") },
                    { id: "announcements", label: t("community.filter.announcements") }
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all shrink-0 ${
                        activeCategory === cat.id 
                          ? "bg-foreground text-background border-foreground shadow-sm" 
                          : "bg-card border-border/50 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Inline Search input */}
                <div className="relative w-full sm:w-64">
                  <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
                  <Input 
                    type="text"
                    placeholder={t("community.search")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`h-9 w-full bg-card border border-border/50 focus-visible:ring-primary rounded-full text-xs ${isRTL ? 'pr-9 pl-4' : 'pl-9 pr-4'}`}
                  />
                </div>
              </div>

              {/* Dynamic Posts Feed */}
              <div className="space-y-4">
                {isLoading ? (
                  /* Premium Loading Skeletons */
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="bg-card border border-border/50 rounded-2xl p-6 space-y-4 animate-pulse">
                        <div className="flex justify-between items-center">
                          <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-accent" />
                            <div className="space-y-2">
                              <div className="h-2.5 w-24 bg-accent rounded" />
                              <div className="h-2 w-16 bg-accent rounded" />
                            </div>
                          </div>
                          <div className="h-4 w-12 bg-accent rounded-full" />
                        </div>
                        <div className="space-y-2">
                          <div className="h-3.5 w-3/4 bg-accent rounded" />
                          <div className="h-3 w-full bg-accent rounded" />
                          <div className="h-3 w-5/6 bg-accent rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {filteredPosts.length === 0 ? (
                      <motion.div 
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-card border rounded-2xl p-12 text-center text-muted-foreground"
                      >
                        <MessageSquare className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
                        <p className="text-sm">No community posts found matching your filters.</p>
                      </motion.div>
                    ) : (
                      filteredPosts.map(post => {
                        return (
                          <motion.article 
                            key={post.id}
                            layout
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="bg-card border border-border/50 rounded-2xl p-5 md:p-6 shadow-sm hover:border-border transition-colors flex flex-col space-y-4"
                          >
                            {/* Header Details */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs text-primary uppercase">
                                  {post.author.slice(0, 2)}
                                </div>
                                <div>
                                  <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                    {post.author}
                                    {post.author === "Corbit Team" && (
                                      <span className="bg-primary/20 text-primary text-[8px] font-bold px-1 py-0.5 rounded uppercase flex items-center gap-0.5">
                                        <Award className="w-2.5 h-2.5" /> Team
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                                    <MapPin className="w-3 h-3 flex-shrink-0" />
                                    {post.wilaya} • {post.time}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {/* Average Stars Rating Indicator Badge */}
                                <div className="flex items-center gap-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                                  <Star className="w-3 h-3 fill-current" />
                                  <span>{post.rating}</span>
                                  <span className="text-muted-foreground/60 font-normal">({post.ratingCount})</span>
                                </div>
                                
                                <span className={`text-[10px] font-bold border px-2.5 py-1 rounded-full uppercase tracking-wider ${getCategoryStyles(post.category)}`}>
                                  {getCategoryLabel(post.category)}
                                </span>
                              </div>
                            </div>

                            {/* Title & Desc */}
                            <div className="space-y-2">
                              <h3 className="font-bold text-base md:text-lg text-foreground hover:text-primary transition-colors cursor-pointer">
                                {post.title}
                              </h3>
                              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                                {post.desc}
                              </p>
                            </div>

                            {/* Rating and Actions Row */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-border/40 pt-4">
                              
                              {/* Static Star Rating Visual (Non-editable) */}
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground font-medium">Rating:</span>
                                <div className="flex items-center gap-0.5">
                                  {[1, 2, 3, 4, 5].map((starValue) => {
                                    const isActive = starValue <= Math.round(post.rating);
                                    return (
                                      <Star 
                                        key={starValue}
                                        className={`w-4 h-4 transition-all duration-150 ${
                                          isActive 
                                            ? "text-amber-400 fill-amber-400 filter drop-shadow-[0_0_1px_rgba(245,158,11,0.5)]" 
                                            : "text-muted-foreground/30"
                                        }`}
                                      />
                                    );
                                  })}
                                </div>
                                <span className="text-[10px] text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded ml-0.5">{post.rating} / 5</span>
                              </div>

                              {/* Standard Interaction Buttons */}
                              <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
                                {/* Upvotes Button */}
                                <button 
                                  onClick={() => handleVote(post.id)}
                                  className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg transition-all ${
                                    post.voted 
                                      ? "bg-primary/10 text-primary font-bold border border-primary/25" 
                                      : "hover:bg-accent hover:text-foreground"
                                  }`}
                                >
                                  <ThumbsUp className={`w-3.5 h-3.5 ${post.voted ? 'fill-current' : ''}`} />
                                  <span>{post.votes}</span>
                                </button>

                                {/* Comments Toggle Button */}
                                <button 
                                  onClick={() => toggleComments(post.id)}
                                  className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-accent hover:text-foreground transition-all ${
                                    expandedComments[post.id] ? "bg-accent text-foreground font-bold" : ""
                                  }`}
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                  <span>{post.comments.length} {t("community.comments.title")}</span>
                                </button>

                                {/* Delete Button (User posts only) */}
                                {isAuthenticated && (myCreatedPostIds.includes(post.id) || (user?.name && post.author === user.name) || (user?.email && post.createdBy === user.email)) && (
                                  <button 
                                    onClick={() => handleDeletePost(post.id)}
                                    className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-red-500 hover:bg-red-500/10 hover:text-red-600 transition-all font-semibold"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Delete</span>
                                  </button>
                                )}
                              </div>

                            </div>

                            {/* COMMENTS AREA (Toggled/Expanded) */}
                            {expandedComments[post.id] && (
                              <div className="border-t border-border/40 pt-4 space-y-4 bg-accent/10 -mx-5 -mb-5 p-5 md:-mx-6 md:-mb-6 md:p-6 rounded-b-2xl">
                                
                                {/* Comment List */}
                                {post.comments.length > 0 && (
                                  <div className="space-y-4">
                                    {post.comments.map(comment => (
                                      <div key={comment.id} className="flex gap-3 items-start text-xs text-muted-foreground leading-normal">
                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                                          comment.author === "Algeria Web Studio" 
                                            ? "bg-primary/10 border border-primary/20 text-primary" 
                                            : "bg-slate-500/10 text-foreground"
                                        }`}>
                                          {comment.author === "Algeria Web Studio" ? (
                                            <User className="w-3.5 h-3.5" />
                                          ) : (
                                            <span className="font-bold text-[10px] uppercase">{comment.author.slice(0, 2)}</span>
                                          )}
                                        </div>
                                        <div className="space-y-1">
                                          <div className="flex items-center gap-2">
                                            <span className="font-bold text-foreground text-[11px]">{comment.author}</span>
                                            <span className="text-[10px] text-muted-foreground/60">{comment.wilaya} • {comment.time}</span>
                                          </div>
                                          <p className="text-foreground text-[11px] leading-relaxed">
                                            {comment.text}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* ── YOUTUBE-STYLE INTEGRATED COMMENT INPUT ── */}
                                {!isAuthenticated ? (
                                  <div className="flex items-center gap-3 bg-accent/25 border border-border/30 rounded-xl p-3 text-xs text-muted-foreground mt-2">
                                    <Lock className="w-4 h-4 text-primary shrink-0" />
                                    <div className="flex-1 flex items-center justify-between">
                                      <span>Log in to join the conversation and comment on this post.</span>
                                      <Link href="/login">
                                        <button className="text-[11px] font-bold text-primary hover:underline focus:outline-none">
                                          Sign In
                                        </button>
                                      </Link>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex gap-3 items-start pt-2 border-t border-border/20 mt-2">
                                    {/* Left User avatar */}
                                    <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                                      <User className="w-3.5 h-3.5" />
                                    </div>
                                    
                                    {/* Right expanding comment box */}
                                    <div className="flex-1 space-y-2.5">
                                      <div className="relative">
                                        <input 
                                          type="text"
                                          placeholder={t("community.comments.placeholder")}
                                          value={newCommentTexts[post.id] || ""}
                                          onChange={(e) => setNewCommentTexts(prev => ({
                                            ...prev,
                                            [post.id]: e.target.value
                                          }))}
                                          onFocus={() => setFocusedCommentPostId(post.id)}
                                          className="w-full bg-transparent text-xs border-b border-border/60 focus:outline-none focus:border-foreground transition-colors py-1 text-foreground"
                                        />
                                        {/* Animated bottom expansion line */}
                                        <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-primary scale-x-0 transition-transform origin-center duration-200 ${focusedCommentPostId === post.id ? 'scale-x-100' : ''}`} />
                                      </div>

                                      {/* Youtube cancel/comment actions drawer */}
                                      {focusedCommentPostId === post.id && (
                                        <motion.div 
                                          initial={{ opacity: 0, y: -5 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          className="flex justify-end gap-2"
                                        >
                                          <button 
                                            onClick={() => {
                                              setNewCommentTexts(prev => ({ ...prev, [post.id]: "" }));
                                              setFocusedCommentPostId(null);
                                            }}
                                            className="px-3 py-1.5 text-[10px] font-bold text-muted-foreground hover:text-foreground rounded-full hover:bg-accent transition-colors"
                                          >
                                            Cancel
                                          </button>
                                          <button 
                                            onClick={() => handleAddComment(post.id)}
                                            disabled={!newCommentTexts[post.id]?.trim()}
                                            className={`px-4 py-1.5 text-[10px] font-bold rounded-full transition-all ${
                                              newCommentTexts[post.id]?.trim() 
                                                ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer" 
                                                : "bg-accent text-muted-foreground/50 cursor-not-allowed"
                                            }`}
                                          >
                                            Comment
                                          </button>
                                        </motion.div>
                                      )}
                                    </div>
                                  </div>
                                )}

                              </div>
                            )}

                          </motion.article>
                        );
                      })
                    )}
                  </AnimatePresence>
                )}
              </div>

            </div>

            {/* RIGHT COLUMN - SIDEBAR DETAILS (4cols) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Trending Wilayas representation */}
              <div className="bg-card border border-border/50 rounded-2xl p-5 space-y-4 shadow-sm">
                <h3 className="font-bold text-sm tracking-tight text-foreground flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-primary" />
                  {t("community.trending")}
                </h3>
                
                <div className="space-y-2.5">
                  {[
                    { name: t("wilaya.alger"), count: "1,429 creators", prc: 100 },
                    { name: t("wilaya.oran"), count: "892 creators", prc: 65 },
                    { name: t("wilaya.constantine"), count: "614 creators", prc: 45 },
                    { name: t("wilaya.blida"), count: "481 creators", prc: 35 },
                    { name: t("wilaya.setif"), count: "394 creators", prc: 28 }
                  ].map((wil, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-foreground">{wil.name}</span>
                        <span className="text-muted-foreground">{wil.count}</span>
                      </div>
                      <div className="w-full bg-accent rounded-full h-1.5">
                        <div 
                          className="bg-primary h-1.5 rounded-full" 
                          style={{ width: `${wil.prc}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Algerian Support / Creator guidelines */}
              <div className="bg-gradient-to-br from-primary/5 via-blue-500/5 to-background border border-border/40 rounded-2xl p-5 space-y-3.5 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-foreground">Algerian Creator Guidelines 🇩🇿</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Welcome to the official Corbit Algeria community board! Share tips on business registration, local hosting setups, payment integrations, or post showcase links of your beautiful sites. Keep it constructive!
                </p>
                <div className="flex gap-2 text-[10px] font-bold text-primary">
                  <span className="bg-primary/10 px-2 py-0.5 rounded">#SupportDz</span>
                  <span className="bg-primary/10 px-2 py-0.5 rounded">#SiteBuilder</span>
                </div>
              </div>

            </div>

          </div>
        </section>

      </main>

      {/* GORGEOUS GLASSMORPHIC CONFIRMATION MODAL */}
      <AnimatePresence>
        {postToDeleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPostToDeleteId(null)}
              className="absolute inset-0 bg-black/40"
            />
            
            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-background dark:bg-[#0B101B] border border-border/40 max-w-[425px] w-full rounded-2xl p-8 shadow-2xl flex flex-col items-center text-center relative overflow-hidden z-10"
            >
              {/* Glowing Danger Icon */}
              <div className="w-14 h-14 rounded-full border border-red-500/20 bg-red-500/10 flex items-center justify-center mb-6 relative shrink-0">
                <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full" />
                <AlertTriangle className="w-6 h-6 text-red-500 relative z-10" />
              </div>

              {/* Title & Description */}
              <div className="space-y-3 mb-8 w-full flex flex-col items-center">
                <h3 className="text-2xl font-bold text-foreground dark:text-white tracking-tight">
                  Delete Community Post?
                </h3>
                <p className="text-[15px] text-muted-foreground dark:text-slate-400 leading-relaxed max-w-[320px]">
                  Are you sure you want to delete this post? This action is permanent and cannot be undone. It will be removed from our servers.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex w-full sm:flex-row flex-col gap-3">
                <button
                  onClick={() => setPostToDeleteId(null)}
                  className="flex-1 h-12 rounded-full font-medium border border-border dark:border-white/10 bg-background dark:bg-transparent hover:bg-accent dark:hover:bg-white/5 text-foreground dark:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeletePost}
                  className="flex-1 h-12 rounded-full font-semibold bg-[#ff3b4b] hover:bg-[#ff3b4b]/90 text-white border-none shadow-[0_0_20px_rgba(255,59,75,0.3)] hover:shadow-[0_0_25px_rgba(255,59,75,0.4)] transition-all cursor-pointer"
                >
                  Delete Post
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
