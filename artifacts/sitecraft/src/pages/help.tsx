import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useTranslation } from "@/lib/i18n";
import { motion } from "framer-motion";
import { Search, HelpCircle, MessageCircle, BookOpen, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export default function HelpCenter() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <main className="flex-1 pb-24">
        <section className="bg-primary/5 py-20 border-b">
          <div className="container max-w-3xl text-center space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{t("help.hero.title")}</h1>
              <p className="text-lg text-muted-foreground">{t("help.hero.subtitle")}</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative max-w-xl mx-auto"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                className="w-full pl-12 pr-4 h-14 text-lg rounded-2xl bg-card shadow-sm border-primary/20 focus-visible:ring-primary/30" 
                placeholder={t("help.search.placeholder")}
              />
            </motion.div>
          </div>
        </section>

        <section className="container max-w-5xl py-20">
          <div className="grid md:grid-cols-3 gap-6 mb-20">
            {[
              { icon: BookOpen, title: "help.card.1.title", desc: "help.card.1.desc" },
              { icon: MessageCircle, title: "help.card.2.title", desc: "help.card.2.desc" },
              { icon: Mail, title: "help.card.3.title", desc: "help.card.3.desc" },
            ].map((card, i) => (
              <motion.a 
                href="#"
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="bg-card border rounded-2xl p-6 hover:shadow-md hover:border-primary/40 transition-all flex flex-col items-center text-center space-y-3"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                  <card.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg">{t(card.title)}</h3>
                <p className="text-sm text-muted-foreground">{t(card.desc)}</p>
              </motion.a>
            ))}
          </div>

          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">{t("help.faq.title")}</h2>
              <p className="text-muted-foreground">{t("help.faq.subtitle")}</p>
            </div>
            
            <Accordion type="single" collapsible className="w-full space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <AccordionItem key={i} value={`item-${i}`} className="bg-card border rounded-xl px-6 data-[state=open]:border-primary/40 transition-colors">
                  <AccordionTrigger className="text-left font-semibold py-4 hover:no-underline">
                    {t(`help.faq.${i}.q`)}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                    {t(`help.faq.${i}.a`)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
