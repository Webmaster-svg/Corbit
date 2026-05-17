import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegister } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import { Loader2, Globe, CheckCircle2 } from "lucide-react";

export default function Register() {
  const { setToken } = useAuth();
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const registerMutation = useRegister({
    mutation: {
      onSuccess: (data) => {
        setToken(data.token);
        setLocation("/dashboard");
      },
      onError: (err: any) => {
        setError(err?.data?.error || "Something went wrong. Please try again.");
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    registerMutation.mutate({ data: { name, email, password } });
  };

  const perks = [
    "Free plan forever — no credit card required",
    "5 professional templates included",
    "Custom domain support",
    "Mobile-optimized sites out of the box",
  ];

  return (
    <div className="min-h-screen flex">
      <motion.div
        className="flex-1 flex items-center justify-center p-8 bg-background order-2 lg:order-1"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-2">
            <Link href="/" className="text-xl font-bold inline-flex items-center gap-2 text-foreground lg:hidden mb-6">
              <Globe className="w-5 h-5 text-primary" />
              SiteCraft
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
            <p className="text-muted-foreground">Start building for free. No credit card needed.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-3 text-sm">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Amira Bensalem"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                data-testid="input-name"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                data-testid="input-email"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                data-testid="input-password"
                className="h-11"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-11 text-base font-medium"
              disabled={registerMutation.isPending}
              data-testid="button-submit"
            >
              {registerMutation.isPending ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating account...</>
              ) : (
                "Create free account"
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>

      <motion.div
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-12 flex-col justify-between relative overflow-hidden order-1 lg:order-2"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-32 right-20 w-72 h-72 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute bottom-32 left-10 w-80 h-80 rounded-full bg-blue-400/20 blur-3xl" />
        </div>
        <div className="relative">
          <Link href="/" className="text-white font-bold text-2xl flex items-center gap-2">
            <Globe className="w-6 h-6" />
            SiteCraft
          </Link>
        </div>
        <div className="relative space-y-8">
          <h2 className="text-4xl font-bold text-white leading-tight">
            Everything you need to grow online
          </h2>
          <ul className="space-y-4">
            {perks.map((perk) => (
              <li key={perk} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-300">{perk}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
