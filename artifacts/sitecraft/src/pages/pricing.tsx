import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Check, Zap } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

const plans = [
  {
    key: "free",
    price: { en: "Free", fr: "Gratuit", ar: "مجاني" },
    priceNum: "0",
    description: "Perfect to start your journey online.",
    features: [
      "1 website",
      "5 templates",
      "100 MB storage",
      "SiteCraft subdomain",
      "Basic analytics",
    ],
    cta: "Get started free",
    popular: false,
    variant: "outline" as const,
  },
  {
    key: "starter",
    price: { en: "Starter", fr: "Starter", ar: "بداية" },
    priceNum: "990",
    currency: "DA",
    period: "/month",
    description: "For growing businesses ready to stand out.",
    features: [
      "3 websites",
      "All templates",
      "500 MB storage",
      "Custom domain",
      "Priority support",
      "Remove SiteCraft branding",
    ],
    cta: "Start Starter",
    popular: false,
    variant: "outline" as const,
  },
  {
    key: "pro",
    price: { en: "Pro", fr: "Pro", ar: "احترافي" },
    priceNum: "2,490",
    currency: "DA",
    period: "/month",
    description: "The complete toolkit for serious businesses.",
    features: [
      "10 websites",
      "All templates + Pro templates",
      "2 GB storage",
      "Custom domain included",
      "E-commerce ready",
      "Advanced analytics",
      "Priority support",
      "White-label option",
    ],
    cta: "Start Pro — Most popular",
    popular: true,
    variant: "default" as const,
  },
  {
    key: "business",
    price: { en: "Business", fr: "Business", ar: "أعمال" },
    priceNum: "7,900",
    currency: "DA",
    period: "/month",
    description: "Unlimited power for agencies and enterprises.",
    features: [
      "Unlimited websites",
      "All templates + custom templates",
      "10 GB storage",
      "Unlimited custom domains",
      "Full e-commerce suite",
      "API access",
      "Dedicated account manager",
      "SLA guarantee",
    ],
    cta: "Contact sales",
    popular: false,
    variant: "outline" as const,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Pricing() {
  const { t, language } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 md:py-28 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent -z-10" />
          <div className="container space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full border border-primary/20"
            >
              <Zap className="w-3.5 h-3.5" />
              Simple, transparent pricing
            </motion.div>
            <motion.h1
              className="text-4xl md:text-6xl font-bold tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {t("pricing.title")}
            </motion.h1>
            <motion.p
              className="text-lg text-muted-foreground max-w-xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Start free. Scale as you grow. Cancel anytime.
            </motion.p>
          </div>
        </section>

        {/* Plans */}
        <section className="pb-24">
          <div className="container">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {plans.map((plan) => (
                <motion.div
                  key={plan.key}
                  variants={itemVariants}
                  className={`relative rounded-2xl border p-6 flex flex-col gap-6 ${
                    plan.popular
                      ? "border-primary bg-primary shadow-xl shadow-primary/20 text-primary-foreground"
                      : "bg-card hover:border-primary/40 transition-colors"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                        MOST POPULAR
                      </span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <h3 className={`font-bold text-lg ${plan.popular ? "text-primary-foreground" : ""}`}>
                      {(plan.price as any)[language] || plan.price.en}
                    </h3>
                    <div className="flex items-baseline gap-1">
                      {plan.priceNum === "0" ? (
                        <span className="text-4xl font-bold">Free</span>
                      ) : (
                        <>
                          <span className="text-4xl font-bold">{plan.priceNum}</span>
                          <span className={`text-sm ${plan.popular ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                            {plan.currency}{plan.period}
                          </span>
                        </>
                      )}
                    </div>
                    <p className={`text-sm ${plan.popular ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                      {plan.description}
                    </p>
                  </div>

                  <ul className="space-y-2.5 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm">
                        <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.popular ? "text-primary-foreground" : "text-primary"}`} />
                        <span className={plan.popular ? "text-primary-foreground/90" : ""}>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href={plan.key === "business" ? "#" : "/register"}>
                    <Button
                      variant={plan.popular ? "secondary" : "outline"}
                      className="w-full font-medium"
                      data-testid={`button-plan-${plan.key}`}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* FAQ / Trust */}
        <section className="py-20 bg-muted/30 border-t">
          <div className="container text-center space-y-4">
            <h2 className="text-2xl font-bold">Questions? We're here.</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Our Algerian support team speaks Arabic, French, and English. Reach us via chat or email — we usually reply within 2 hours.
            </p>
            <Button variant="outline" className="mt-4">Contact support</Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
