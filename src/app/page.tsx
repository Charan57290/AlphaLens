"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Activity, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, BookOpen, Download, HelpCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AgentState } from "@/types/agent";


export default function AlphaLensDashboard() {
  const [ticker, setTicker] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AgentState | null>(null);
  const [error, setError] = useState("");
  const [eli15Mode, setEli15Mode] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const exportToPDF = () => {
    window.print();
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker) return;

    setLoading(true);
    setError("");
    setData(null);

    try {
      const response = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch research data");
      }

      const result = await response.json();
      setData(result);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <Activity size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight">AlphaLens AI</span>
          </div>
          {data && (
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => { setData(null); setTicker(""); setEli15Mode(false); }} className="glass-panel hover:bg-white/10 transition-colors mr-2">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Search
              </Button>
              <Button variant="outline" size="sm" onClick={() => setEli15Mode(!eli15Mode)} className="glass-panel hover:bg-primary/10 transition-colors">
                <HelpCircle className="w-4 h-4 mr-2" />
                {eli15Mode ? "Show Expert Mode" : "Explain Like I'm 15"}
              </Button>
              <Button size="sm" onClick={exportToPDF} disabled={isExporting} className="bg-primary text-black hover:bg-primary/90 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                <Download className="w-4 h-4 mr-2" />
                {isExporting ? "Exporting..." : "Export PDF"}
              </Button>
            </div>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search Hero */}
        <AnimatePresence mode="wait">
          {!data && !loading && (
            <motion.div
              key="hero"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto mt-20 text-center"
            >
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-gradient-to-br from-white via-white/90 to-white/40 bg-clip-text text-transparent drop-shadow-sm">
                Investment Research <br/> <span className="text-primary drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">Agent</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-12 font-medium max-w-xl mx-auto leading-relaxed">
                Six specialized AI agents working together to analyze financials, news, risks, and economic moats to deliver a clear investment thesis.
              </p>
              <form onSubmit={handleSearch} className="relative group max-w-xl mx-auto">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 via-emerald-500/50 to-primary/50 rounded-3xl blur opacity-25 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative flex items-center glass-panel rounded-2xl p-2 shadow-2xl">
                  <Search className="absolute left-6 w-5 h-5 text-white/50" />
                  <input
                    type="text"
                    placeholder="Enter ticker (e.g. AAPL, NVDA)"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value.toUpperCase())}
                    className="w-full h-14 pl-14 pr-32 bg-transparent border-none rounded-xl focus:outline-none focus:ring-0 text-xl font-medium uppercase text-white placeholder:text-white/30 transition-all"
                  />
                  <Button type="submit" className="absolute right-3 h-12 rounded-xl px-8 bg-primary text-black hover:bg-primary/90 font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                    Research
                  </Button>
                </div>
                {error && <p className="text-red-400 mt-6 bg-red-500/10 border border-red-500/20 rounded-lg p-3 backdrop-blur-md">{error}</p>}
              </form>
            </motion.div>
          )}

          {/* Loading State */}
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mt-24 flex flex-col items-center"
            >
              <div className="relative w-32 h-32 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl animate-pulse"></div>
                <div className="absolute inset-4 rounded-full border border-primary/30 blur-sm animate-spin" style={{ animationDuration: '3s' }}></div>
                <div className="absolute inset-8 rounded-full bg-primary/10 blur-md animate-pulse" style={{ animationDuration: '2s' }}></div>
                <Activity className="w-10 h-10 text-primary animate-pulse relative z-10 drop-shadow-[0_0_10px_rgba(16,185,129,1)]" />
              </div>
              <p className="mt-8 text-xl font-medium text-primary animate-pulse drop-shadow-sm">
                Agents are building your thesis...
              </p>
              <div className="flex flex-wrap justify-center gap-3 mt-6 max-w-md">
                {["Synthesizing Financials", "Evaluating Moat", "Scraping News", "Risk Assessment"].map((step, i) => (
                  <Badge key={i} variant="outline" className="animate-pulse border-primary/30 bg-primary/5 backdrop-blur-md text-primary px-4 py-1.5 rounded-full" style={{ animationDelay: `${i * 0.3}s` }}>
                    {step}
                  </Badge>
                ))}
              </div>
            </motion.div>
          )}

          {/* Dashboard Data */}
          {data && (
            <motion.div
              id="dashboard-content"
              key="dashboard"
              className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-2"
            >
              {/* Left Column: Company & Moat */}
              <div className="lg:col-span-2 space-y-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 20 }}>
                  <Card className="glass-panel transition-all duration-300 hover:scale-[1.01] hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                    <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-3xl font-bold flex items-center gap-3">
                          {data.companyInfo?.name} <Badge variant="outline" className="border-primary/50 text-primary">{data.ticker}</Badge>
                        </CardTitle>
                        <CardDescription className="text-base mt-2">
                          {eli15Mode ? "What this company does in simple terms." : data.companyInfo?.industry}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="leading-relaxed">
                      {eli15Mode ? "This company sells popular products and makes a lot of money." : data.companyInfo?.overview}
                    </p>
                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                        <h4 className="font-semibold mb-2 text-sm text-primary">{eli15Mode ? "How they make money" : "Revenue Streams"}</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {data.companyInfo?.revenueStreams.slice(0,3).map((r, i) => <li key={i}>{r}</li>)}
                        </ul>
                      </div>
                      <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                        <h4 className="font-semibold mb-2 text-sm text-primary">{eli15Mode ? "Who they are fighting against" : "Competitors"}</h4>
                        <div className="flex flex-wrap gap-2">
                          {data.companyInfo?.competitors.slice(0,3).map((c, i) => (
                            <Badge key={i} variant="secondary" className="bg-white/10">{c}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}>
                  <Tabs defaultValue="financials" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-card border border-white/10 p-1 rounded-xl glass-panel">
                    <TabsTrigger value="financials" className="data-[state=active]:bg-primary data-[state=active]:text-black rounded-lg">{eli15Mode ? "Money Stats" : "Financial Health"}</TabsTrigger>
                    <TabsTrigger value="risks" className="data-[state=active]:bg-primary data-[state=active]:text-black rounded-lg">{eli15Mode ? "What could go wrong" : "Risk Assessment"}</TabsTrigger>
                    <TabsTrigger value="moat" className="data-[state=active]:bg-primary data-[state=active]:text-black rounded-lg">{eli15Mode ? "Secret Sauce" : "Economic Moat"}</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="financials" className="mt-4">
                    <Card className="glass-panel transition-all duration-300 hover:scale-[1.01] hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                      <CardHeader>
                        <CardTitle className="text-primary">{eli15Mode ? "Money Breakdown" : "Financial Analysis"}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {Object.entries(data.financialHealth || {}).filter(([k]) => k !== 'overallScore').map(([key, metric]: any, index) => (
                            <motion.div 
                              key={key} 
                              initial={{ opacity: 0, scale: 0.8 }} 
                              animate={{ opacity: 1, scale: 1 }} 
                              transition={{ delay: 0.4 + index * 0.1, type: "spring", stiffness: 200 }}
                              className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col items-center text-center">
                              <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                              <span className="text-lg font-bold text-white">{metric.value}</span>
                              <div className="w-full mt-3 flex items-center gap-2">
                                <Progress value={metric.score * 10} className="h-1.5 [&>div]:bg-primary" />
                                <span className="text-xs font-mono text-primary">{metric.score}/10</span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="risks" className="mt-4">
                    <Card className="glass-panel transition-all duration-300 hover:scale-[1.01] hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                      <CardHeader>
                        <CardTitle className="text-primary">{eli15Mode ? "Things to worry about" : "Identified Risks"}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[300px] pr-4">
                          <div className="space-y-4">
                            {data.riskAssessment?.risks.map((risk, i) => (
                              <div key={i} className="flex gap-4 p-4 rounded-xl bg-black/40 border border-white/5">
                                <div className="mt-1">
                                  {risk.severity === "High" ? <AlertTriangle className="text-red-500 w-5 h-5 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]" /> :
                                   risk.severity === "Medium" ? <AlertTriangle className="text-yellow-500 w-5 h-5 drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]" /> :
                                   <CheckCircle className="text-green-500 w-5 h-5 drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]" />}
                                </div>
                                <div>
                                  <h4 className="font-semibold text-white">{risk.riskType}</h4>
                                  <p className="text-sm text-muted-foreground mt-1">{risk.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="moat" className="mt-4">
                    <Card className="glass-panel transition-all duration-300 hover:scale-[1.01] hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                      <CardHeader>
                        <CardTitle className="text-primary">{eli15Mode ? "Are they protected from competitors?" : "Economic Moat"}</CardTitle>
                        <CardDescription>{eli15Mode ? "What makes them special" : "Competitive advantage analysis"}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between mb-6 p-4 rounded-xl bg-black/40 border border-white/5">
                          <span className="font-medium text-white">Moat Rating</span>
                          <Badge variant={data.moatAnalysis?.economicMoat === "Wide" ? "default" : "secondary"} className={`text-sm px-3 py-1 ${data.moatAnalysis?.economicMoat === "Wide" ? "bg-primary text-black" : "bg-white/10 text-white"}`}>
                            {data.moatAnalysis?.economicMoat} Moat
                          </Badge>
                        </div>
                        <p className="text-sm leading-relaxed mb-6">{data.moatAnalysis?.summary}</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
                </motion.div>
              </div>

              {/* Right Column: Decision & Debate */}
              <div className="space-y-6">
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 20 }}>
                  <Card className={`glass-panel transition-all duration-300 hover:scale-[1.01] hover:-translate-y-1 relative overflow-hidden ${
                      data.decision?.recommendation === "BUY" ? "shadow-[0_0_40px_rgba(34,197,94,0.15)] border-green-500/30" :
                      data.decision?.recommendation === "WATCH" ? "shadow-[0_0_40px_rgba(16,185,129,0.15)] border-primary/30" : "shadow-[0_0_40px_rgba(239,68,68,0.15)] border-red-500/30"
                    }`}>
                    <div className={`absolute top-0 left-0 w-1 h-full ${
                      data.decision?.recommendation === "BUY" ? "bg-green-500 shadow-[0_0_15px_rgba(34,197,94,1)]" :
                      data.decision?.recommendation === "WATCH" ? "bg-primary shadow-[0_0_15px_rgba(16,185,129,1)]" : "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,1)]"
                    }`} />
                    <CardHeader>
                      <CardTitle>{eli15Mode ? "Should I buy?" : "Final Verdict"}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                      <div className={`text-5xl font-black tracking-tighter mb-2 ${
                          data.decision?.recommendation === "BUY" ? "text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]" :
                          data.decision?.recommendation === "WATCH" ? "text-primary drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" : "text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                      }`}>
                        {data.decision?.recommendation}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground mb-6">
                        <span>{eli15Mode ? "How sure am I?" : "Confidence"}</span>
                        <span className="font-mono text-white font-semibold">
                          {(data.decision?.confidence ?? 0) <= 1 ? ((data.decision?.confidence ?? 0) * 100).toFixed(0) : data.decision?.confidence}%
                        </span>
                      </div>
                      <Progress value={(data.decision?.confidence ?? 0) <= 1 ? (data.decision?.confidence ?? 0) * 100 : data.decision?.confidence} className={`h-2 w-full max-w-[200px] ${
                        data.decision?.recommendation === "BUY" ? "[&>div]:bg-green-500" :
                        data.decision?.recommendation === "WATCH" ? "[&>div]:bg-primary" : "[&>div]:bg-red-500"
                      }`} />
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 20 }}>
                  <Card className="glass-panel transition-all duration-300 hover:scale-[1.01] hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-primary">
                        <BookOpen className="w-5 h-5" /> {eli15Mode ? "The Good vs The Bad" : "Bull vs Bear Debate"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="p-4 rounded-xl bg-black/40 border border-green-500/20">
                        <h4 className="font-semibold text-green-400 flex items-center gap-2 mb-3">
                          <TrendingUp className="w-4 h-4" /> {eli15Mode ? "The Good" : "Bull Case"}
                        </h4>
                        <ul className="space-y-2 text-sm text-white/80">
                          {data.decision?.bullCase.map((c, i) => (
                            <li key={i} className="flex gap-2"><span className="text-green-500">•</span> {c}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-4 rounded-xl bg-black/40 border border-red-500/20">
                        <h4 className="font-semibold text-red-400 flex items-center gap-2 mb-3">
                          <TrendingDown className="w-4 h-4" /> {eli15Mode ? "The Bad" : "Bear Case"}
                        </h4>
                        <ul className="space-y-2 text-sm text-white/80">
                          {data.decision?.bearCase.map((c, i) => (
                            <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 + i * 0.1 }} className="flex gap-2"><span className="text-red-500">•</span> {c}</motion.li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 20 }}>
                  <Card className="glass-panel transition-all duration-300 hover:scale-[1.01] hover:-translate-y-1 border-primary/30 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                    <CardHeader>
                      <CardTitle className="text-lg text-primary">{eli15Mode ? "What would make me change my mind?" : "What Could Change My Decision?"}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 text-sm text-white/90">
                        {data.decision?.whatCouldChange.map((c, i) => (
                          <li key={i} className="flex gap-3 items-start p-3 rounded-lg bg-primary/5 border border-primary/10">
                            <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 text-xs font-bold drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">?</div>
                            <span className="mt-0.5">{c}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
