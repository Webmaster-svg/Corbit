import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { useTranslation } from "@/lib/i18n";
import { motion } from "framer-motion";
import { Loader2, Globe } from "lucide-react";

export default function Login() {
  const { t } = useTranslation();
  const { setToken, setUser } = useAuth();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginMutation = useLogin({
    mutation: {
      onSuccess: (data) => {
        setToken(data.token);
        setUser({ 
          name: email.split("@")[0], 
          email, 
          plan: "Pro Plan" 
        });
        setLocation("/");
      },
      onError: () => {
        setError(t("login.error"));
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate({ data: { email, password } });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel - branding */}
      <motion.div
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/90 via-primary to-blue-700 p-12 flex-col justify-between relative overflow-hidden"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-blue-300/30 blur-3xl" />
        </div>
        <div className="relative">
          <Link href="/" className="text-white font-bold text-2xl flex items-center gap-2">
            <Globe className="w-6 h-6" />
            Corbit
          </Link>
        </div>
        <div className="relative space-y-6">
          <h2 className="text-4xl font-bold text-white leading-tight">
            {t("auth.hero.title")}
          </h2>
          <p className="text-blue-100 text-lg leading-relaxed">
            {t("auth.hero.desc")}
          </p>
          <div className="flex gap-4">
            {[
              { count: t("stats.v1"), label: t("stats.l1") },
              { count: t("stats.v2"), label: t("stats.l2") },
              { count: t("stats.v3"), label: t("stats.l3") },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur rounded-xl p-4 flex-1">
                <div className="text-2xl font-bold text-white">{stat.count}</div>
                <div className="text-blue-200 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Right panel - form */}
      <motion.div
        className="flex-1 flex items-center justify-center p-8 bg-background"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center lg:text-left space-y-2">
            <Link href="/" className="text-xl font-bold inline-flex items-center gap-2 text-foreground lg:hidden mb-6">
              <Globe className="w-5 h-5 text-primary" />
              Corbit
            </Link>
            <h1 className="text-2xl font-bold text-foreground">{t("login.title")}</h1>
            <p className="text-muted-foreground">{t("login.desc")}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-3 text-sm">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.email.label")}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t("auth.email.placeholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                data-testid="input-email"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("auth.password.label")}</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                data-testid="input-password"
                className="h-11"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-11 text-base font-medium"
              disabled={loginMutation.isPending}
              data-testid="button-submit"
            >
              {loginMutation.isPending ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t("login.loading")}</>
              ) : (
                t("login.submit")
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            {t("login.no_account")}{" "}
            <Link href="/register" className="text-primary font-medium hover:underline">
              {t("login.start_free")}
            </Link>
          </p>

          <div className="border-t pt-6 text-center">
            <p className="text-xs text-muted-foreground">
              {t("auth.demo")} <span className="font-mono bg-muted px-1.5 py-0.5 rounded">demo@getcorbit.com</span> / <span className="font-mono bg-muted px-1.5 py-0.5 rounded">password123</span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
