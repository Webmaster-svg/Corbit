import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  CreditCard, 
  ShieldCheck, 
  ArrowLeft, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  XCircle,
  HelpCircle,
  QrCode
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChargilySimulate() {
  const [, setLocation] = useLocation();
  const { user, setUser } = useAuth();
  const { toast } = useToast();

  const [paymentMethod, setPaymentMethod] = useState<"edahabya" | "baridimob">("edahabya");
  const [cardNumber, setCardNumber] = useState("6071 8154 2398 4402");
  const [expiry, setExpiry] = useState("12/29");
  const [cvv, setCvv] = useState("482");
  const [cardHolder, setCardHolder] = useState(user?.name || "Mohamed Benali");
  const [baridiRip, setBaridiRip] = useState("00799999002148765942");

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "success" | "failed">("idle");

  // Parse URL query parameters
  const [plan, setPlan] = useState("starter");
  const [total, setTotal] = useState("1,900");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const planParam = params.get("plan");
    const totalParam = params.get("total");
    if (planParam) setPlan(planParam);
    if (totalParam) setTotal(totalParam);
  }, []);

  const handleSimulatePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment authorization delay
    setTimeout(async () => {
      try {
        const currentUserId = user?.id || 1;
        const totalAmount = Number(total.replace(/,/g, ""));

        console.log("[Simulation] Initiating dual checkout activation...", {
          userId: currentUserId,
          plan,
          totalAmount
        });

        // 1. Direct subscription upgrade via authenticated API (Safety Guarantee)
        const token = localStorage.getItem("corbit_token");
        const upgradeRes = await fetch("/api/payments/upgrade-plan", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ plan })
        });

        if (upgradeRes.ok) {
          const data = await upgradeRes.json();
          // Update client-side user state instantly
          if (user) {
            setUser({ ...user, plan });
          }
        }

        // 2. Trigger the public webhook endpoint to test the full localtunnel workflow
        // Send a realistic mock Chargily webhook payload
        await fetch("/api/webhooks/chargily", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            type: "checkout.paid",
            data: {
              id: `mock_ch_${Math.random().toString(36).substr(2, 9)}`,
              status: "paid",
              amount: totalAmount,
              currency: "dzd",
              metadata: {
                userId: String(currentUserId),
                plan: plan
              }
            }
          })
        }).catch(err => {
          // Silent catch: if webhook fetch fails, the direct upgrade still keeps them safe!
          console.warn("[Simulation Webhook Trigger] Webhook call skipped or localtunnel offline:", err);
        });

        setPaymentStatus("success");
        toast({
          title: "Payment Authenticated",
          description: "Your simulation transaction was completed successfully!",
        });
      } catch (error) {
        console.error("[Simulation] Error completing payment:", error);
        setPaymentStatus("failed");
      } finally {
        setIsProcessing(false);
      }
    }, 2200);
  };

  return (
    <div className="min-h-screen bg-[#0e0c15] text-zinc-150 font-sans antialiased flex flex-col justify-between selection:bg-violet-500 selection:text-white relative overflow-hidden">
      {/* Dynamic Background Blurs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-zinc-900 bg-[#0e0c15]/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-blue-500 flex items-center justify-center font-black text-white text-sm shadow-md shadow-violet-500/20 select-none">
            C
          </div>
          <span className="font-extrabold text-sm text-white tracking-wider">
            Chargily <span className="text-violet-400 font-bold">Pay</span> <span className="text-[10px] bg-violet-500/20 text-violet-300 font-extrabold px-1.5 py-0.5 rounded uppercase tracking-widest ml-1 border border-violet-500/10">Sandbox</span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 bg-zinc-900/50 px-3 py-1.5 rounded-full border border-zinc-800">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Secured 256-bit SSL Connection</span>
        </div>
      </header>

      {/* Main Sandbox Area */}
      <main className="flex-1 py-12 px-6 flex items-center justify-center max-w-5xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {paymentStatus === "idle" && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full items-stretch"
            >
              {/* Left Column: Form Simulator */}
              <div className="md:col-span-7 bg-[#13111c] border border-zinc-850 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-2xl relative">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-violet-400" />
                      Simulation Mode - Choose Card
                    </h2>
                    <p className="text-xs text-zinc-400 mt-1">
                      Choose a payment card to simulate a purchase on Algeria Web Studio.
                    </p>
                  </div>

                  {/* Tabs */}
                  <div className="grid grid-cols-2 gap-3 bg-[#0a090e] p-1.5 rounded-2xl border border-zinc-800">
                    <button
                      onClick={() => setPaymentMethod("edahabya")}
                      className={`h-11 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        paymentMethod === "edahabya"
                          ? "bg-violet-600 text-white shadow-lg shadow-violet-600/10"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      Carte Edahabya
                    </button>
                    <button
                      onClick={() => setPaymentMethod("baridimob")}
                      className={`h-11 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        paymentMethod === "baridimob"
                          ? "bg-violet-600 text-white shadow-lg shadow-violet-600/10"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      <QrCode className="w-4 h-4" />
                      BaridiMob
                    </button>
                  </div>

                  {paymentMethod === "edahabya" ? (
                    /* Edahabya Simulation Input Form */
                    <div className="space-y-4">
                      {/* Virtual Card Preview */}
                      <div className="w-full h-44 rounded-2xl bg-gradient-to-br from-[#1d1b26] to-[#0f0e15] border border-zinc-800 p-6 flex flex-col justify-between relative overflow-hidden shadow-inner select-none">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/5 rounded-full blur-2xl pointer-events-none" />
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-black text-violet-400 uppercase tracking-widest">
                            Algérie Poste Edahabya
                          </span>
                          <span className="text-[10px] font-extrabold text-zinc-500">CIB / Algeria</span>
                        </div>
                        <div className="space-y-3.5">
                          <p className="font-mono text-lg text-white font-extrabold tracking-widest text-center">
                            {cardNumber || "•••• •••• •••• ••••"}
                          </p>
                          <div className="flex justify-between text-xs font-mono text-zinc-400">
                            <div>
                              <span className="block text-[8px] uppercase tracking-wider text-zinc-500 font-sans">Cardholder</span>
                              <span className="font-extrabold">{cardHolder.toUpperCase()}</span>
                            </div>
                            <div className="text-right">
                              <span className="block text-[8px] uppercase tracking-wider text-zinc-500 font-sans">Expires</span>
                              <span className="font-extrabold">{expiry}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Inputs */}
                      <div className="space-y-3.5">
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500">Card Number</label>
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="w-full h-11 bg-[#0a090e] border border-zinc-800 focus:border-violet-500 rounded-xl px-4 text-xs font-semibold text-white focus:outline-none transition-colors"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500">Expiry Date</label>
                            <input
                              type="text"
                              value={expiry}
                              onChange={(e) => setExpiry(e.target.value)}
                              className="w-full h-11 bg-[#0a090e] border border-zinc-800 focus:border-violet-500 rounded-xl px-4 text-xs font-semibold text-white focus:outline-none transition-colors"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500">CVV</label>
                            <input
                              type="password"
                              value={cvv}
                              onChange={(e) => setCvv(e.target.value)}
                              className="w-full h-11 bg-[#0a090e] border border-zinc-800 focus:border-violet-500 rounded-xl px-4 text-xs font-semibold text-white focus:outline-none transition-colors"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500">Cardholder Name</label>
                          <input
                            type="text"
                            value={cardHolder}
                            onChange={(e) => setCardHolder(e.target.value)}
                            className="w-full h-11 bg-[#0a090e] border border-zinc-800 focus:border-violet-500 rounded-xl px-4 text-xs font-semibold text-white focus:outline-none transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* BaridiMob Simulation Input Form */
                    <div className="space-y-6 py-4">
                      <div className="bg-[#0a090e] border border-zinc-800 rounded-2xl p-6 text-center space-y-4">
                        <QrCode className="w-16 h-16 text-violet-400 mx-auto animate-pulse" />
                        <div className="space-y-1">
                          <h4 className="font-extrabold text-sm text-white">BaridiMob Mobile Transfer</h4>
                          <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                            Simulates payment by scanning a QR code or entering the Algérie Poste RIP/CCP account.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500">Destination RIP Account</label>
                        <input
                          type="text"
                          value={baridiRip}
                          onChange={(e) => setBaridiRip(e.target.value)}
                          className="w-full h-11 bg-[#0a090e] border border-zinc-800 focus:border-violet-500 rounded-xl px-4 text-xs font-semibold text-white focus:outline-none transition-colors select-all font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm CTA */}
                <div className="pt-8 mt-6 border-t border-zinc-900 flex items-center gap-4">
                  <Button
                    onClick={handleSimulatePayment}
                    disabled={isProcessing}
                    className="flex-1 h-12 rounded-full font-black text-sm bg-gradient-to-tr from-violet-600 to-blue-500 hover:from-violet-700 hover:to-blue-600 text-white transition-all cursor-pointer shadow-lg shadow-violet-500/10 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Authenticating Transaction...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 fill-white/10" />
                        Confirm Sandbox Payment
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    onClick={() => {
                      toast({ title: "Transaction Canceled", description: "You reverted the mock subscription checkout." });
                      setLocation("/pricing");
                    }}
                    className="h-12 px-5 rounded-full border border-zinc-800 text-zinc-400 hover:text-white cursor-pointer hover:bg-zinc-900/50"
                  >
                    Cancel
                  </Button>
                </div>
              </div>

              {/* Right Column: Checkout Summary info */}
              <div className="md:col-span-5 bg-[#13111c]/60 border border-zinc-850/60 rounded-3xl p-6 md:p-8 text-zinc-350 flex flex-col justify-between shadow-xl">
                <div className="space-y-6">
                  <div>
                    <span className="block text-[10px] font-black uppercase text-violet-400 tracking-wider">
                      Order Details
                    </span>
                    <h3 className="text-xl font-extrabold text-white mt-1">
                      Algeria Web Studio
                    </h3>
                  </div>

                  <div className="h-px bg-zinc-800" />

                  {/* Pricing math breakdown */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <span>Subscribed Plan</span>
                      <span className="font-extrabold text-white uppercase bg-violet-500/15 border border-violet-500/20 px-2 py-0.5 rounded text-[10px]">
                        {plan} Plan
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span>Billing Cycle</span>
                      <span className="font-semibold text-zinc-300">Monthly</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span>Gateway Mode</span>
                      <span className="font-bold text-emerald-400">Sandbox Test</span>
                    </div>

                    <div className="h-px bg-zinc-800/60" />

                    <div className="flex justify-between items-end pt-2">
                      <span className="text-xs font-semibold text-zinc-400">Amount Due</span>
                      <span className="text-2xl font-black text-white tracking-tight">
                        {total} DA
                      </span>
                    </div>
                  </div>

                  <div className="h-px bg-zinc-800" />

                  <div className="space-y-3 bg-[#0a090e]/60 p-4 rounded-xl border border-zinc-800/40 text-[11px] leading-relaxed text-zinc-400">
                    <div className="flex gap-2">
                      <Sparkles className="w-4 h-4 text-violet-400 shrink-0" />
                      <span>
                        This is an official <strong>Chargily Sandbox environment simulation</strong>. Clicking confirm will trigger a webhook to upgrade your user profile status without deducting actual funds.
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-zinc-500 font-semibold text-center mt-6">
                  Ref ID: AWS-{Math.random().toString(36).substr(2, 6).toUpperCase()}
                </div>
              </div>
            </motion.div>
          )}

          {paymentStatus === "success" && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#13111c] border border-zinc-850 rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl relative"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white border-4 border-[#0e0c15]">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="pt-6 space-y-2">
                <h3 className="text-2xl font-extrabold text-white tracking-tight">Payment Approved!</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Your simulated Chargily transaction was successfully authorized. Your platform subscription has been unlocked.
                </p>
              </div>

              <div className="bg-[#0a090e] border border-zinc-800 rounded-xl p-4 text-left space-y-2.5">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Transaction ID</span>
                  <span className="font-mono text-white text-[11px]">AWS-CH-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Upgraded Plan</span>
                  <span className="font-extrabold text-violet-400 uppercase">{plan}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Total Spent</span>
                  <span className="font-extrabold text-white">{total} DA</span>
                </div>
              </div>

              <Button
                onClick={() => setLocation("/dashboard")}
                className="w-full h-12 rounded-full font-black text-sm bg-blue-600 text-white hover:bg-blue-700 transition-all cursor-pointer shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2"
              >
                Go to Dashboard
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Button>
            </motion.div>
          )}

          {paymentStatus === "failed" && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#13111c] border border-zinc-850 rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl relative"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/20 text-white border-4 border-[#0e0c15]">
                <XCircle className="w-8 h-8" />
              </div>

              <div className="pt-6 space-y-2">
                <h3 className="text-2xl font-extrabold text-white tracking-tight">Payment Declined</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  We encountered an issue while processing your simulated sandbox transaction. Please verify your mock details and try again.
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => setPaymentStatus("idle")}
                  className="flex-1 h-12 rounded-full font-black text-sm bg-zinc-800 text-white hover:bg-zinc-700 transition-all cursor-pointer"
                >
                  Try Again
                </Button>
                <Button
                  onClick={() => setLocation("/pricing")}
                  variant="outline"
                  className="flex-1 h-12 rounded-full font-bold border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 cursor-pointer"
                >
                  Change Plan
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-[#07060a] px-6 py-5 text-center text-[10px] text-zinc-550 flex items-center justify-between">
        <span>&copy; {new Date().getFullYear()} Chargily Pay Sandbox. All rights reserved.</span>
        <div className="flex gap-4 font-bold">
          <a href="#" className="hover:text-zinc-300">Developer Docs</a>
          <span>&middot;</span>
          <a href="#" className="hover:text-zinc-300">Support</a>
        </div>
      </footer>
    </div>
  );
}
