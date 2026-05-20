import { Router } from "express";
import fs from "fs";
import path from "path";

const router = Router();
const DB_PATH = path.join(process.cwd(), "local_community_posts.json");

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
  rating: number;
  ratingCount: number;
  comments: Comment[];
  createdBy?: string;
}

const defaultPosts: Post[] = [
  {
    id: "post-1",
    title: "Traditions DZ - Custom Algerian Dresses E-Commerce Site Showcase 🌟",
    desc: "Hey guys! I just finished building our online traditional dress shop using Corbit. The speed is incredible on mobile and the custom payment simulation runs flawlessly. I'd love to hear your feedback on the layout! We're planning to add local DZ shipping integrations next week.",
    category: "showcase",
    author: "Amel Bouhired",
    wilaya: "Algiers",
    time: "2h ago",
    votes: 48,
    rating: 4.9,
    ratingCount: 18,
    comments: [
      {
        id: "c-1",
        author: "Khaled Ben",
        wilaya: "Constantine",
        text: "Amazing design! The WebP images load incredibly fast on poor 4G connections here.",
        time: "1h ago"
      },
      {
        id: "c-2",
        author: "Yacine Dev",
        wilaya: "Oran",
        text: "The checkout flow looks extremely clean. Algeria Web Studio did a fantastic job with the custom integrations!",
        time: "30m ago"
      }
    ]
  },
  {
    id: "post-2",
    title: "How to register and map a local .dz domain name?",
    desc: "I am trying to map our official local Algerian `.dz` domain to my Corbit site. Are there any local registrars that offer instant API approval, or do I need to submit an application through Nic.dz / authorized local agents?",
    category: "qa",
    author: "Khaled DZ",
    wilaya: "Constantine",
    time: "5h ago",
    votes: 19,
    rating: 4.2,
    ratingCount: 5,
    comments: [
      {
        id: "c-3",
        author: "Yacine Dev",
        wilaya: "Oran",
        text: "You can register it through accredited local registrars (like Icosnet or Webdialna), then simply enter the DNS records in your Corbit domains dashboard. Changes propagate in under 2 hours locally!",
        time: "4h ago"
      }
    ]
  },
  {
    id: "post-5",
    title: "Chargily e-payment integration simulator guide for DZ Shopify & WooCommerce alternatives 💳",
    desc: "I've compiled a quick checklist for integrating Chargily's local checkout simulation on your custom Corbit sites: 1) Retrieve your API secret keys, 2) Map your webhook response endpoints, 3) Test payments using simulation cards like CIB and Edahabia. Everything is fully operational now!",
    category: "tips",
    author: "Khaled DZ",
    wilaya: "Constantine",
    time: "12h ago",
    votes: 27,
    rating: 5.0,
    ratingCount: 8,
    comments: []
  },
  {
    id: "post-3",
    title: "Tips for optimizing website loading speed for slow 3G/4G ADSL users in southern Algeria ⚡",
    desc: "Here is a quick text guide to make sure your pages load instantly even in low coverage areas: 1) Compress images to WebP inside the editor, 2) Limit the number of external typography imports, 3) Rely on native Tailwind/CSS styling rather than custom heavy scripts. Let me know if you need help!",
    category: "tips",
    author: "Yacine Dev",
    wilaya: "Oran",
    time: "1d ago",
    votes: 32,
    rating: 4.7,
    ratingCount: 11,
    comments: [
      {
        id: "c-4",
        author: "Sofia Alger",
        wilaya: "Algiers",
        text: "Extremely helpful advice! Our southern clients from Ouargla and Adrar reported a massive increase in checkout completions after we applied these exact steps.",
        time: "12h ago"
      }
    ]
  },
  {
    id: "post-6",
    title: "DZ Estate - Oran's first dynamic real-estate map builder showcase 🏢",
    desc: "We just launched our new premium agency website for local real-estate listings in Oran. Relying on glassmorphism panels, interactive filters, and direct WhatsApp integrations. It took less than a day of customization using Corbit's starter templates!",
    category: "showcase",
    author: "Ryma Oran",
    wilaya: "Oran",
    time: "1d ago",
    votes: 23,
    rating: 4.8,
    ratingCount: 6,
    comments: []
  },
  {
    id: "post-7",
    title: "Having issues setting up custom MX records for local .dz mail host?",
    desc: "I am migrating our local business webmail to standard DNS MX configurations. The A-records resolve fine but emails fail to route. Has anyone here configured this on Corbit's DNS page with local Algerian providers?",
    category: "qa",
    author: "Sid Ahmed",
    wilaya: "Algiers",
    time: "2d ago",
    votes: 8,
    rating: 4.0,
    ratingCount: 3,
    comments: []
  },
  {
    id: "post-8",
    title: "Official: Algeria Web Studio creator meetup in Constantine! 🤝",
    desc: "We are excited to announce our next localized creator meetup! We will be hosting live demo workspaces, troubleshooting complex payment setups, and sharing design secrets at our Constantine creator hub. RSVP inside your account page to secure a spot!",
    category: "announcements",
    author: "Corbit Team",
    wilaya: "Constantine",
    time: "2d ago",
    votes: 38,
    rating: 4.9,
    ratingCount: 15,
    comments: []
  },
  {
    id: "post-4",
    title: "Official: Active Creators across all 58 Wilayas & local payment gateway simulation updates 🚀",
    desc: "We are thrilled to announce that Corbit now hosts active, live websites across all 58 Wilayas of Algeria! To support this growth, our local e-commerce checkout sandbox has been fully updated. You can now test complete local cart purchasing seamlessly.",
    category: "announcements",
    author: "Corbit Team",
    wilaya: "Algiers",
    time: "3d ago",
    votes: 95,
    rating: 5.0,
    ratingCount: 42,
    comments: []
  }
];

function loadPosts(): Post[] {
  try {
    if (fs.existsSync(DB_PATH)) {
      return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
    }
  } catch (e) {
    console.error("Error reading community posts file, using defaults:", e);
  }
  return defaultPosts;
}

function savePosts(posts: Post[]) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(posts, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing community posts file:", e);
  }
}

// GET all posts
router.get("/community/posts", (req, res) => {
  res.json(loadPosts());
});

// CREATE new post
router.post("/community/posts", (req, res) => {
  const { title, desc, category, author, wilaya, rating, createdBy } = req.body;
  if (!title || !desc || !category || !author || !wilaya) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const posts = loadPosts();
  const newPost: Post = {
    id: `post-${Date.now()}`,
    title,
    desc,
    category,
    author,
    wilaya,
    time: "Just now",
    votes: 1,
    rating: Number(rating) || 5,
    ratingCount: 1,
    comments: [],
    createdBy: createdBy || author
  };

  posts.unshift(newPost);
  savePosts(posts);
  res.status(201).json(newPost);
});

// UPVOTE / TOGGLE VOTE post
router.post("/community/posts/:id/vote", (req, res) => {
  const { id } = req.params;
  const { isVoted } = req.body;

  const posts = loadPosts();
  const post = posts.find(p => p.id === id);
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  post.votes = isVoted ? post.votes + 1 : Math.max(0, post.votes - 1);
  savePosts(posts);
  res.json(post);
});

// RATE post (star rating)
router.post("/community/posts/:id/rate", (req, res) => {
  const { id } = req.params;
  const { rating: newRate, previousUserRating } = req.body;

  if (typeof newRate !== "number" || newRate < 1 || newRate > 5) {
    return res.status(400).json({ error: "Invalid rating value" });
  }

  const posts = loadPosts();
  const post = posts.find(p => p.id === id);
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  const currentTotalScore = post.rating * post.ratingCount;
  let updatedCount = post.ratingCount;
  let updatedTotalScore = currentTotalScore;

  if (previousUserRating && previousUserRating > 0) {
    updatedTotalScore = currentTotalScore - previousUserRating + newRate;
  } else {
    updatedCount += 1;
    updatedTotalScore = currentTotalScore + newRate;
  }

  post.rating = Number((updatedTotalScore / updatedCount).toFixed(1));
  post.ratingCount = updatedCount;

  savePosts(posts);
  res.json(post);
});

// CREATE comment on post
router.post("/community/posts/:id/comments", (req, res) => {
  const { id } = req.params;
  const { author, wilaya, text } = req.body;
  if (!text || !author || !wilaya) {
    return res.status(400).json({ error: "Missing required comment fields" });
  }

  const posts = loadPosts();
  const post = posts.find(p => p.id === id);
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  const newComment: Comment = {
    id: `comment-${Date.now()}`,
    author,
    wilaya,
    text,
    time: "Just now"
  };

  post.comments.push(newComment);
  savePosts(posts);
  res.status(201).json(newComment);
});

// DELETE post
router.delete("/community/posts/:id", (req, res) => {
  const { id } = req.params;
  const posts = loadPosts();
  const nextPosts = posts.filter(p => p.id !== id);
  if (posts.length === nextPosts.length) {
    return res.status(404).json({ error: "Post not found" });
  }
  savePosts(nextPosts);
  res.json({ success: true });
});

export default router;
