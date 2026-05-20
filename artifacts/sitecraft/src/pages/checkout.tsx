import { useState, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import {
  ArrowLeft, Check, Copy, Upload, CreditCard, Building2,
  ShieldCheck, Sparkles, FileCheck2, Landmark
} from "lucide-react";

// Multi-lingual translations for high fidelity checkout
const localizations: Record<string, any> = {
  en: {
    title: "Checkout & Subscription",
    subtitle: "Complete your subscription using Algeria's preferred payment methods.",
    back: "Back to pricing",
    paymentMethod: "Select Payment Method",
    chargilyTitle: "Chargily Pay (Instant)",
    chargilyDesc: "Pay securely with Edahabya or BaridiMob cards",
    bankTitle: "Bank Transfer / CCP (Manual)",
    bankDesc: "Transfer directly using CCP or Algerian bank account",
    ccpAccount: "CCP Account Number",
    ccpKey: "Key",
    ripIban: "RIP / IBAN Number",
    bankName: "Bank Name",
    bankOwner: "Account Holder",
    uploadProof: "Upload Payment Proof",
    uploadInstruction: "Drag & drop your payment receipt or click to browse (PDF, PNG, JPG)",
    uploadSuccess: "Receipt uploaded successfully! We'll verify and activate your plan shortly.",
    btnChargily: "Pay now with Chargily Pay",
    btnCCP: "Confirm Bank Transfer",
    orderSummary: "Order Summary",
    selectedPlan: "Selected Plan",
    billingCycle: "Billing",
    monthly: "Monthly",
    trialActive: "14 Days Trial Active (No payment now)",
    subtotal: "Subtotal",
    discount: "Discount (20% off)",
    total: "Total Due",
    secureNote: "Secure 256-bit encrypted checkout",
    copied: "Copied!",
    copyBtn: "Copy",
    algeriePoste: "Algérie Poste",
    platformOwner: "Algeria Web Studio LLC",
    receiptRequired: "Please upload your receipt first to confirm transfer."
  },
  fr: {
    title: "Paiement & Abonnement",
    subtitle: "Complétez votre abonnement avec les moyens de paiement algériens.",
    back: "Retour aux tarifs",
    paymentMethod: "Choisir le moyen de paiement",
    chargilyTitle: "Chargily Pay (Instantané)",
    chargilyDesc: "Payez en toute sécurité avec votre carte Edahabya ou BaridiMob",
    bankTitle: "Virement Bancaire / CCP (Manuel)",
    bankDesc: "Transférez directement via CCP ou virement bancaire algérien",
    ccpAccount: "Numéro de Compte CCP",
    ccpKey: "Clé",
    ripIban: "Numéro RIP / IBAN",
    bankName: "Nom de la Banque",
    bankOwner: "Titulaire du Compte",
    uploadProof: "Téléverser le reçu de paiement",
    uploadInstruction: "Faites glisser votre reçu ou cliquez pour parcourir (PDF, PNG, JPG)",
    uploadSuccess: "Reçu envoyé avec succès ! Nous allons vérifier et activer votre plan.",
    btnChargily: "Payer avec Chargily Pay",
    btnCCP: "Confirmer le Virement Bancaire",
    orderSummary: "Résumé de la commande",
    selectedPlan: "Plan sélectionné",
    billingCycle: "Facturation",
    monthly: "Mensuelle",
    trialActive: "Essai de 14 jours actif (aucun paiement requis)",
    subtotal: "Sous-total",
    discount: "Réduction (-20%)",
    total: "Total à payer",
    secureNote: "Paiement sécurisé et chiffré en 256-bits",
    copied: "Copié !",
    copyBtn: "Copier",
    algeriePoste: "Algérie Poste",
    platformOwner: "Algeria Web Studio S.A.R.L",
    receiptRequired: "Veuillez d'abord charger votre reçu pour confirmer le transfert."
  },
  ar: {
    title: "الدفع والاشتراك",
    subtitle: "أكمل اشتراكك باستخدام وسائل الدفع الجزائرية المفضلة لديك.",
    back: "العودة إلى الأسعار",
    paymentMethod: "اختر طريقة الدفع",
    chargilyTitle: "شارجيلي باي (فوري)",
    chargilyDesc: "ادفع بأمان باستخدام بطاقة الذهبية أو بريديموب",
    bankTitle: "حوالة بريدية / بنكية (يدوي)",
    bankDesc: "قم بالتحويل مباشرة عبر حساب CCP أو الحساب البنكي الجزائري",
    ccpAccount: "رقم حساب CCP",
    ccpKey: "المفتاح",
    ripIban: "رقم الـ RIP / IBAN",
    bankName: "اسم البنك",
    bankOwner: "صاحب الحساب",
    uploadProof: "تحميل وصل الدفع",
    uploadInstruction: "اسحب وأسقط وصل الدفع أو انقر للتصفح (PDF, PNG, JPG)",
    uploadSuccess: "تم تحميل الوصل بنجاح! سنقوم بمراجعته وتفعيل اشتراكك قريباً.",
    btnChargily: "ادفع الآن بواسطة شارجيلي باي",
    btnCCP: "تأكيد التحويل البنكي",
    orderSummary: "ملخص الطلب",
    selectedPlan: "الباقة المختارة",
    billingCycle: "دورة الفوترة",
    monthly: "شهرياً",
    trialActive: "الفترة التجريبية نشطة 14 يوماً (لا يوجد دفع الآن)",
    subtotal: "المجموع الفرعي",
    discount: "الخصم (خصم 20%)",
    total: "المجموع الإجمالي",
    secureNote: "دفع آمن ومشفر بالكامل 256-بت",
    copied: "تم النسخ!",
    copyBtn: "نسخ",
    algeriePoste: "بريد الجزائر",
    platformOwner: "شركة استوديو ويب الجزائر ش.ذ.م.م",
    receiptRequired: "يرجى تحميل الوصل أولاً لتأكيد عملية التحويل."
  }
};

export default function Checkout() {
  const { language } = useTranslation();
  const tLocal = localizations[language] || localizations["en"];
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Read current query param
  const queryParams = new URLSearchParams(window.location.search);
  const selectedPlanKey = queryParams.get("plan") || "free";

  const [paymentMethod, setPaymentMethod] = useState<"chargily" | "bank">("chargily");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Plan Details Resolution
  const planInfo = {
    free: {
      name: language === "ar" ? "مجاني" : language === "fr" ? "Gratuit" : "Free",
      price: 0,
      priceLabel: language === "ar" ? "مجاناً" : language === "fr" ? "Gratuit" : "Free",
      trial: false
    },
    starter: {
      name: language === "ar" ? "البداية" : language === "fr" ? "Starter" : "Starter",
      price: 1900,
      priceLabel: language === "ar" ? "1,900 د.ج" : language === "fr" ? "1 900 DA" : "1,900 DA",
      trial: true
    },
    pro: {
      name: language === "ar" ? "احترافي" : language === "fr" ? "Pro" : "Pro",
      price: 5900,
      priceLabel: language === "ar" ? "5,900 د.ج" : language === "fr" ? "5 900 DA" : "5,900 DA",
      trial: false
    }
  }[selectedPlanKey as "free" | "starter" | "pro"] || {
    name: "Starter",
    price: 1900,
    priceLabel: "1,900 DA",
    trial: true
  };

  // Math variables
  const isStarter = selectedPlanKey === "starter";
  const isPro = selectedPlanKey === "pro";
  const subtotal = planInfo.price;
  const discount = isPro ? subtotal * 0.20 : 0;
  const total = subtotal - discount;

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    toast({
      title: tLocal.copied,
      description: `${fieldId} copied to clipboard successfully.`,
      duration: 2000
    });
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFile(e.target.files[0]);
    }
  };

  const handleCheckoutSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (selectedPlanKey === "free") {
        toast({
          title: "Plan Activated!",
          description: language === "ar" ? "تم تفعيل باقتك المجانية بنجاح!" : language === "fr" ? "Plan gratuit activé avec succès!" : "Your free plan has been successfully activated!",
        });
        setLocation("/dashboard");
        return;
      }
      if (paymentMethod === "chargily") {
        toast({
          title: "Redirecting...",
          description: "Connecting to secure Chargily Gateway for Edahabya/BaridiMob payment...",
        });
        // Redirect to premium sandbox Chargily simulator portal
        window.location.href = `/chargily-simulate?plan=${selectedPlanKey}&total=${total}`;
      } else {
        if (!receiptFile) {
          toast({
            title: "Receipt Required",
            description: tLocal.receiptRequired,
            variant: "destructive"
          });
          return;
        }
        toast({
          title: "Order Confirmed!",
          description: tLocal.uploadSuccess,
        });
        setLocation("/dashboard");
      }
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Navbar />
      <main className="flex-1 py-12 md:py-20">
        <div className="container px-6 max-w-6xl mx-auto">
          {/* Back btn */}
          <Link href="/pricing">
            <span className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-zinc-900 transition-colors mb-8 cursor-pointer group">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 rtl:group-hover:translate-x-1 rtl:rotate-180" />
              {tLocal.back}
            </span>
          </Link>

          {/* Heading */}
          <div className="space-y-3 mb-12">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              {tLocal.title}
            </h1>
            <p className="text-zinc-505 dark:text-zinc-400 text-sm max-w-xl">
              {tLocal.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: Payment Methods / Setup */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 md:p-8 space-y-6 shadow-sm">
                {selectedPlanKey === "free" ? (
                  // Free Plan details panel
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2 text-center py-6">
                      <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 mx-auto">
                        <Check className="w-6 h-6" />
                      </div>
                      <h4 className="font-extrabold text-lg text-zinc-900 dark:text-white pt-2">
                        {language === "ar" ? "باقة مجانية تماماً" : language === "fr" ? "Plan Entièrement Gratuit" : "Entirely Free Plan"}
                      </h4>
                      <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
                        {language === "ar" 
                          ? "استمتع بمميزات الباقة المجانية بدون أي رسوم أو الحاجة لإدخال بيانات بطاقة الدفع الخاصة بك."
                          : language === "fr"
                          ? "Profitez des avantages du plan gratuit sans aucun frais et sans avoir à saisir vos coordonnées bancaires."
                          : "Enjoy all benefits of our free tier lifetime. No credit card or bank details required."}
                      </p>
                    </div>

                    <div className="h-px bg-zinc-200 dark:bg-zinc-800" />

                    <div className="space-y-3.5 bg-zinc-50/50 dark:bg-zinc-900/50 p-5 rounded-2xl border border-zinc-150 dark:border-zinc-800">
                      <span className="block text-[10px] font-black uppercase text-zinc-400 tracking-wider mb-2">
                        {language === "ar" ? "المميزات المضمنة" : language === "fr" ? "Caractéristiques Incluses" : "Included Features"}
                      </span>
                      <div className="flex items-center gap-2 text-xs font-bold text-zinc-650 dark:text-zinc-300">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{language === "ar" ? "1 مشروع نشط" : language === "fr" ? "1 Projet Actif" : "1 Active Project"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-zinc-650 dark:text-zinc-300">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{language === "ar" ? "مساحة تخزين 500 ميجابايت" : language === "fr" ? "Stockage de 500 Mo" : "500 MB Storage"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-zinc-650 dark:text-zinc-350">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{language === "ar" ? "دعم مجاني (بوت دردشة)" : language === "fr" ? "Support Normal (Chatbot)" : "Normal support (Chatbot)"}</span>
                      </div>
                    </div>

                    <div className="h-px bg-zinc-200 dark:bg-zinc-800" />

                    {/* Instant Free Activation Action */}
                    <Button
                      onClick={handleCheckoutSubmit}
                      disabled={isSubmitting}
                      className="w-full h-12 rounded-full font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all cursor-pointer shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? "Activating..." : (language === "ar" ? "تفعيل الباقة المجانية" : language === "fr" ? "Activer le Plan Gratuit" : "Activate Free Plan")}
                    </Button>
                  </motion.div>
                ) : (
                  // Paid Plans panel (Starter / Pro)
                  <>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                      {tLocal.paymentMethod}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Option 1: Chargily Pay */}
                      <div
                        onClick={() => setPaymentMethod("chargily")}
                        className={`cursor-pointer border rounded-2xl p-5 flex items-start gap-4 transition-all duration-200 select-none ${
                          paymentMethod === "chargily"
                            ? "border-blue-600 bg-blue-600/5 ring-2 ring-blue-600/10"
                            : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 bg-zinc-50/50 dark:bg-zinc-900/50"
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 shrink-0">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <div className="font-bold text-sm text-zinc-800 dark:text-white flex items-center gap-1.5">
                            {tLocal.chargilyTitle}
                            <span className="text-[9px] font-black bg-blue-600 text-white px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                              FAST
                            </span>
                          </div>
                          <p className="text-xs text-zinc-505 leading-relaxed">
                            {tLocal.chargilyDesc}
                          </p>
                        </div>
                      </div>

                      {/* Option 2: Bank Transfer / CCP */}
                      <div
                        onClick={() => setPaymentMethod("bank")}
                        className={`cursor-pointer border rounded-2xl p-5 flex items-start gap-4 transition-all duration-200 select-none ${
                          paymentMethod === "bank"
                            ? "border-blue-600 bg-blue-600/5 ring-2 ring-blue-600/10"
                            : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 bg-zinc-50/50 dark:bg-zinc-900/50"
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-650 shrink-0">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <div className="font-bold text-sm text-zinc-800 dark:text-white">
                            {tLocal.bankTitle}
                          </div>
                          <p className="text-xs text-zinc-505 leading-relaxed">
                            {tLocal.bankDesc}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* DYNAMIC SUBSECTION PANEL */}
                    {paymentMethod === "chargily" ? (
                      // Chargily Details Panel
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-6"
                      >
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                          <div className="space-y-1">
                            <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                              Gateway Partner
                            </div>
                            <div className="font-extrabold text-base text-zinc-800 dark:text-white">
                              Chargily Payment Gateway
                            </div>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <div className="h-7 px-3 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-white font-extrabold text-[9px] flex items-center justify-center shadow-sm select-none border border-amber-600/20">
                              EDAHABYA
                            </div>
                            <div className="h-7 px-3 rounded-full bg-red-600 text-white font-extrabold text-[9px] flex items-center justify-center shadow-sm select-none border border-red-700/20">
                              BARIDIMOB
                            </div>
                          </div>
                        </div>

                        <div className="h-px bg-zinc-200 dark:bg-zinc-800" />
                        <p className="text-xs text-zinc-500 leading-relaxed">
                          {language === "ar"
                            ? "تأكيد الدفع فوري وتلقائي. بمجرد إتمام المعاملة، سيتم تفعيل باقتك مباشرة."
                            : language === "fr"
                            ? "Confirmation de paiement instantanée et automatique. Dès la validation, votre plan sera actif."
                            : "Instant and automated transaction confirmation. Once paid, your subscription will be activated."}
                        </p>

                        {/* Pricing Details & math breakdown (Chargily panel) */}
                        <div className="space-y-3 p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850">
                          <div className="flex justify-between text-xs font-bold text-zinc-500">
                            <span>{tLocal.subtotal}</span>
                            <span className="text-zinc-900 dark:text-white">{planInfo.priceLabel}</span>
                          </div>

                          {isPro && (
                            <div className="flex justify-between text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-1.5 rounded-xl border border-emerald-100 dark:border-emerald-900/10">
                              <span>{tLocal.discount}</span>
                              <span>-1,180 DA</span>
                            </div>
                          )}

                          <div className="h-px bg-zinc-150 dark:bg-zinc-850" />

                          <div className="flex justify-between items-baseline pt-1">
                            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-350">
                              {tLocal.total}
                            </span>
                            <span className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">
                              {selectedPlanKey === "free" ? "0 DA" : isPro ? `${(total).toLocaleString()} DA` : planInfo.priceLabel}
                            </span>
                          </div>
                        </div>

                        {/* Main Payment CTA Button */}
                        <Button
                          onClick={handleCheckoutSubmit}
                          disabled={isSubmitting}
                          className="w-full h-12 rounded-full font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all cursor-pointer shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2"
                        >
                          <CreditCard className="w-4 h-4" />
                          {isSubmitting ? "Connecting..." : `${tLocal.btnChargily}`}
                        </Button>
                      </motion.div>
                    ) : (
                      // CCP Bank Transfer Panel
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                      >
                        <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-4">
                          <div className="flex items-center justify-between gap-4">
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                                {tLocal.bankName}
                              </span>
                              <p className="font-extrabold text-sm text-zinc-800 dark:text-white flex items-center gap-2">
                                <Landmark className="w-4 h-4 text-amber-600" />
                                {tLocal.algeriePoste}
                              </p>
                            </div>
                            <span className="text-[9px] font-black uppercase bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded">
                              CCP
                            </span>
                          </div>

                          <div className="h-px bg-zinc-200 dark:bg-zinc-800" />

                          <div className="flex items-center justify-between gap-4">
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                                {tLocal.bankOwner}
                              </span>
                              <p className="font-extrabold text-sm text-zinc-800 dark:text-white">
                                {tLocal.platformOwner}
                              </p>
                            </div>
                          </div>

                          <div className="h-px bg-zinc-200 dark:bg-zinc-800" />

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl p-4 flex items-center justify-between gap-4">
                              <div className="space-y-0.5">
                                <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                                  {tLocal.ccpAccount}
                                </span>
                                <p className="font-black text-sm text-zinc-900 dark:text-white tracking-wider">
                                  0021487659
                                </p>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard("0021487659", tLocal.ccpAccount)}
                                className="h-8 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-2 font-bold flex items-center gap-1 text-[11px]"
                              >
                                <Copy className="w-3.5 h-3.5" />
                                {copiedField === tLocal.ccpAccount ? tLocal.copied : tLocal.copyBtn}
                              </Button>
                            </div>

                            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl p-4 flex items-center justify-between gap-4">
                              <div className="space-y-0.5">
                                <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                                  {tLocal.ccpKey}
                                </span>
                                <p className="font-black text-sm text-zinc-900 dark:text-white tracking-wider">
                                  42
                                </p>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard("42", tLocal.ccpKey)}
                                className="h-8 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-2 font-bold flex items-center gap-1 text-[11px]"
                              >
                                <Copy className="w-3.5 h-3.5" />
                                {copiedField === tLocal.ccpKey ? tLocal.copied : tLocal.copyBtn}
                              </Button>
                            </div>
                          </div>

                          <div className="h-px bg-zinc-200 dark:bg-zinc-800" />

                          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl p-4 flex items-center justify-between gap-4">
                            <div className="space-y-0.5">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                                {tLocal.ripIban}
                              </span>
                              <p className="font-black text-sm text-zinc-900 dark:text-white tracking-wider">
                                00799999002148765942
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard("00799999002148765942", tLocal.ripIban)}
                              className="h-8 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-2 font-bold flex items-center gap-1 text-[11px]"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              {copiedField === tLocal.ripIban ? tLocal.copied : tLocal.copyBtn}
                            </Button>
                          </div>
                        </div>

                        {/* Receipt proof uploader */}
                        <div className="space-y-3">
                          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">
                            {tLocal.uploadProof}
                          </label>
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900 rounded-2xl p-8 text-center cursor-pointer transition-colors space-y-3"
                          >
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleFileChange}
                              accept="image/*,application/pdf"
                              className="hidden"
                            />
                            {receiptFile ? (
                              <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
                                  <FileCheck2 className="w-6 h-6" />
                                </div>
                                <span className="font-bold text-sm text-zinc-800 dark:text-zinc-200">
                                  {receiptFile.name}
                                </span>
                                <span className="text-xs text-zinc-400">
                                  ({(receiptFile.size / 1024 / 1024).toFixed(2)} MB)
                                </span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-2">
                                <Upload className="w-8 h-8 text-zinc-400" />
                                <span className="font-bold text-sm text-zinc-700 dark:text-zinc-300">
                                  {tLocal.uploadInstruction}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Pricing Details & math breakdown (Bank panel) */}
                        <div className="space-y-3 p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850">
                          <div className="flex justify-between text-xs font-bold text-zinc-500">
                            <span>{tLocal.subtotal}</span>
                            <span className="text-zinc-900 dark:text-white">{planInfo.priceLabel}</span>
                          </div>

                          {isPro && (
                            <div className="flex justify-between text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-1.5 rounded-xl border border-emerald-100 dark:border-emerald-900/10">
                              <span>{tLocal.discount}</span>
                              <span>-1,180 DA</span>
                            </div>
                          )}

                          <div className="h-px bg-zinc-150 dark:bg-zinc-850" />

                          <div className="flex justify-between items-baseline pt-1">
                            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-350">
                              {tLocal.total}
                            </span>
                            <span className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">
                              {selectedPlanKey === "free" ? "0 DA" : isPro ? `${(total).toLocaleString()} DA` : planInfo.priceLabel}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Button
                            onClick={handleCheckoutSubmit}
                            disabled={isSubmitting || !receiptFile}
                            className={`w-full h-12 rounded-full font-bold transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 ${
                              receiptFile
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-650 cursor-not-allowed border border-zinc-200 dark:border-zinc-700"
                            }`}
                          >
                            <Check className="w-4 h-4" />
                            {isSubmitting ? "Verifying..." : `${tLocal.btnCCP}`}
                          </Button>
                          {!receiptFile && (
                            <span className="block text-[10px] font-bold text-amber-600 text-center animate-pulse">
                              {language === "ar"
                                ? "يرجى تحميل وصل الدفع أولاً على اليسار للتأكيد"
                                : language === "fr"
                                ? "Veuillez charger le reçu à gauche pour confirmer"
                                : "Please upload receipt on the left to confirm"}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: Order Summary brochure */}
            <div className="lg:col-span-5 sticky top-8">
              {/* Order Summary Box (Plan brochure & inclusions - No prices) */}
              <div className="bg-zinc-900 border border-zinc-850 rounded-3xl p-6 md:p-8 text-white space-y-6 shadow-xl">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                  {tLocal.orderSummary}
                </h3>

                <div className="space-y-4">
                  {/* Selected Plan Details */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="font-extrabold text-xl text-white">
                        {planInfo.name} Plan
                      </p>
                      <p className="text-xs text-zinc-400">
                        {tLocal.billingCycle}: {tLocal.monthly}
                      </p>
                    </div>
                  </div>

                  {/* Free Trial Badge if applicable */}
                  {isStarter && (
                    <div className="bg-white/10 text-white text-[10px] font-black px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5 select-none w-fit">
                      <Sparkles className="w-3.5 h-3.5 fill-white animate-pulse" />
                      <span>{tLocal.trialActive}</span>
                    </div>
                  )}
                </div>

                <div className="h-px bg-zinc-800" />

                {/* Plan Features list in brochure */}
                <div className="space-y-4">
                  <span className="block text-[10px] font-black uppercase text-zinc-500 tracking-wider">
                    {language === "ar" ? "المميزات المضمنة" : language === "fr" ? "Fonctionnalités Incluses" : "Included Features"}
                  </span>
                  <div className="space-y-3">
                    {({
                      free: [
                        language === "ar" ? "1 مشروع نشط" : language === "fr" ? "1 Projet Actif" : "1 Active Project",
                        language === "ar" ? "مساحة تخزين 500 ميجابايت" : language === "fr" ? "Stockage de 500 Mo" : "500 MB Storage",
                        language === "ar" ? "دعم عادي (بوت دردشة)" : language === "fr" ? "Support Normal (Chatbot)" : "Normal support (Chatbot)"
                      ],
                      starter: [
                        language === "ar" ? "3 مشاريع نشطة" : language === "fr" ? "3 Projets Actifs" : "3 Active Projects",
                        language === "ar" ? "مساحة تخزين 2 جيجابايت" : language === "fr" ? "Stockage de 2 Go" : "2 GB Storage",
                        language === "ar" ? "فترة تجريبية 14 يوماً" : language === "fr" ? "Essai Gratuit de 14 Jours" : "14 Days Free Trial",
                        language === "ar" ? "دعم عادي (بوت دردشة)" : language === "fr" ? "Support Normal (Chatbot)" : "Normal support (Chatbot)"
                      ],
                      pro: [
                        language === "ar" ? "مشاريع غير محدودة" : language === "fr" ? "Projets Illimités" : "Unlimited Projects",
                        language === "ar" ? "مساحة تخزين 10 جيجابايت" : language === "fr" ? "Stockage de 10 Go" : "10 GB Storage",
                        language === "ar" ? "خصم 20% للشهر الأول" : language === "fr" ? "Remise de 20% Premier Mois" : "20% First Month Discount",
                        language === "ar" ? "ربط دومين مخصص" : language === "fr" ? "Domaine Personnalisé" : "Custom Domain Connection",
                        language === "ar" ? "الوصول للمجتمع" : language === "fr" ? "Accès à la Communauté" : "Community Access",
                        language === "ar" ? "دعم VIP (دردشة + دعم فني)" : language === "fr" ? "Support VIP (Chat + Live)" : "VIP Support (Chatbot + Live Chat)"
                      ]
                    }[selectedPlanKey as "free" | "starter" | "pro"] || []).map((feat: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2.5 text-xs font-bold text-zinc-300">
                        <Check className="w-4 h-4 text-blue-400 shrink-0 animate-fade-in" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Secure payment pledge footer */}
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 justify-center pt-10">
            <ShieldCheck className="w-4 h-4 text-emerald-500 fill-emerald-500/10" />
            <span>{tLocal.secureNote}</span>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
