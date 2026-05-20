import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useTranslation } from "@/lib/i18n";
import { motion } from "framer-motion";
import { Users, Globe, Target, Shield } from "lucide-react";

export default function About() {
  const { t } = useTranslation();

  const values = [
    { icon: Globe, title: "about.values.1.title", desc: "about.values.1.desc" },
    { icon: Users, title: "about.values.2.title", desc: "about.values.2.desc" },
    { icon: Target, title: "about.values.3.title", desc: "about.values.3.desc" },
    { icon: Shield, title: "about.values.4.title", desc: "about.values.4.desc" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <main className="flex-1 pb-24">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 overflow-hidden border-b bg-muted/20">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[120px] rounded-full" />
          </div>
          
          <div className="container max-w-4xl text-center space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold tracking-tight"
            >
              {t("about.hero.title")}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg md:text-xl text-muted-foreground leading-relaxed"
            >
              {t("about.hero.subtitle")}
            </motion.p>
          </div>
        </section>

        {/* Mission & Stats */}
        <section className="py-24 container max-w-5xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold">{t("about.mission.title")}</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {t("about.mission.desc1")}
              </p>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {t("about.mission.desc2")}
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 gap-6"
            >
              {[
                { label: t("about.stat.1.label"), val: t("about.stat.1.val") },
                { label: t("about.stat.2.label"), val: t("about.stat.2.val") },
                { label: t("about.stat.3.label"), val: t("about.stat.3.val") },
                { label: t("about.stat.4.label"), val: t("about.stat.4.val") },
              ].map((stat, i) => (
                <div key={i} className="bg-card border rounded-2xl p-6 text-center shadow-sm">
                  <div className="text-3xl font-bold text-primary mb-2">{stat.val}</div>
                  <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-24 bg-muted/30 border-y">
          <div className="container max-w-5xl">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl font-bold">{t("about.values.title")}</h2>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {values.map((v, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-card border rounded-2xl p-8 space-y-4 hover:border-primary/30 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <v.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold">{t(v.title)}</h3>
                  <p className="text-muted-foreground leading-relaxed">{t(v.desc)}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
