"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Activity, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, BookOpen, Download, HelpCircle } from "lucide-react";
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
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold">
              <Activity size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight">AlphaLens AI</span>
          </div>
          {data && (
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => setEli15Mode(!eli15Mode)}>
                <HelpCircle className="w-4 h-4 mr-2" />
                {eli15Mode ? "Show Expert Mode" : "Explain Like I'm 15"}
              </Button>
              <Button size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export PDF
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
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                Institutional-Grade AI Research
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Six specialized AI agents working together to analyze financials, news, risks, and economic moats to deliver a clear investment thesis.
              </p>
              <form onSubmit={handleSearch} className="relative">
                <div className="relative flex items-center">
                  <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Enter ticker (e.g. AAPL, TSLA, NVDA)"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value.toUpperCase())}
                    className="w-full h-14 pl-12 pr-32 bg-card border border-border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg uppercase transition-all"
                  />
                  <Button type="submit" className="absolute right-2 h-10 rounded-xl px-6">
                    Research
                  </Button>
                </div>
                {error && <p className="text-destructive mt-4">{error}</p>}
              </form>
            </motion.div>
          )}

          {/* Loading State */}
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-20 flex flex-col items-center"
            >
              <div className="w-16 h-16 relative">
                <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin"></div>
                <div className="absolute inset-2 rounded-full border-r-2 border-blue-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              </div>
              <p className="mt-6 text-lg font-medium animate-pulse text-muted-foreground">
                Synthesizing multi-agent research...
              </p>
              <div className="flex gap-2 mt-4">
                {["Researching Company", "Analyzing Financials", "Reading News", "Assessing Risk"].map((step, i) => (
                  <Badge key={i} variant="secondary" className="animate-pulse" style={{ animationDelay: \`\${i * 0.2}s\` }}>
                    {step}
                  </Badge>
                ))}
              </div>
            </motion.div>
          )}

          {/* Dashboard Data */}
          {data && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Left Column: Company & Moat */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-3xl font-bold flex items-center gap-3">
                          {data.companyInfo?.name} <Badge variant="outline">{data.ticker}</Badge>
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
                      <div className="p-4 rounded-xl bg-background/50 border border-border/50">
                        <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Revenue Streams</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {data.companyInfo?.revenueStreams.slice(0,3).map((r, i) => <li key={i}>{r}</li>)}
                        </ul>
                      </div>
                      <div className="p-4 rounded-xl bg-background/50 border border-border/50">
                        <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Competitors</h4>
                        <div className="flex flex-wrap gap-2">
                          {data.companyInfo?.competitors.slice(0,3).map((c, i) => (
                            <Badge key={i} variant="secondary">{c}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Tabs defaultValue="financials" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-card border border-border/50">
                    <TabsTrigger value="financials">Financial Health</TabsTrigger>
                    <TabsTrigger value="risks">Risk Assessment</TabsTrigger>
                    <TabsTrigger value="moat">Economic Moat</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="financials" className="mt-4">
                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle>Financial Analysis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {Object.entries(data.financialHealth || {}).filter(([k]) => k !== 'overallScore').map(([key, metric]: any) => (
                            <div key={key} className="p-4 rounded-xl bg-background/50 border border-border/50 flex flex-col items-center text-center">
                              <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                              <span className="text-lg font-bold">{metric.value}</span>
                              <div className="w-full mt-3 flex items-center gap-2">
                                <Progress value={metric.score * 10} className="h-1.5" />
                                <span className="text-xs font-mono">{metric.score}/10</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="risks" className="mt-4">
                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle>Identified Risks</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[300px] pr-4">
                          <div className="space-y-4">
                            {data.riskAssessment?.risks.map((risk, i) => (
                              <div key={i} className="flex gap-4 p-4 rounded-xl bg-background/50 border border-border/50">
                                <div className="mt-1">
                                  {risk.severity === "High" ? <AlertTriangle className="text-destructive w-5 h-5" /> :
                                   risk.severity === "Medium" ? <AlertTriangle className="text-yellow-500 w-5 h-5" /> :
                                   <CheckCircle className="text-green-500 w-5 h-5" />}
                                </div>
                                <div>
                                  <h4 className="font-semibold">{risk.riskType}</h4>
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
                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle>Economic Moat</CardTitle>
                        <CardDescription>Competitive advantage analysis</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between mb-6 p-4 rounded-xl bg-background/50 border border-border/50">
                          <span className="font-medium">Moat Rating</span>
                          <Badge variant={data.moatAnalysis?.economicMoat === "Wide" ? "default" : "secondary"} className="text-sm px-3 py-1">
                            {data.moatAnalysis?.economicMoat} Moat
                          </Badge>
                        </div>
                        <p className="text-sm leading-relaxed mb-6">{data.moatAnalysis?.summary}</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Right Column: Decision & Debate */}
              <div className="space-y-6">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm relative overflow-hidden">
                  <div className={\`absolute top-0 left-0 w-1 h-full \${
                    data.decision?.recommendation === "BUY" ? "bg-green-500" :
                    data.decision?.recommendation === "WATCH" ? "bg-yellow-500" : "bg-destructive"
                  }\`} />
                  <CardHeader>
                    <CardTitle>Final Verdict</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <div className="text-5xl font-black tracking-tighter mb-2">
                      {data.decision?.recommendation}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-6">
                      <span>Confidence</span>
                      <span className="font-mono text-foreground font-semibold">{data.decision?.confidence}%</span>
                    </div>
                    <Progress value={data.decision?.confidence} className="h-2 w-full max-w-[200px]" />
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-primary" /> Bull vs Bear Debate
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-green-500 flex items-center gap-2 mb-3">
                        <TrendingUp className="w-4 h-4" /> Bull Case
                      </h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {data.decision?.bullCase.map((c, i) => (
                          <li key={i} className="flex gap-2"><span className="text-green-500">•</span> {c}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="w-full h-[1px] bg-border/50" />
                    <div>
                      <h4 className="font-semibold text-destructive flex items-center gap-2 mb-3">
                        <TrendingDown className="w-4 h-4" /> Bear Case
                      </h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {data.decision?.bearCase.map((c, i) => (
                          <li key={i} className="flex gap-2"><span className="text-destructive">•</span> {c}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/50 backdrop-blur-sm bg-primary/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg">What Could Change My Decision?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm">
                      {data.decision?.whatCouldChange.map((c, i) => (
                        <li key={i} className="flex gap-3 items-start">
                          <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 text-xs font-bold">?</div>
                          <span className="mt-0.5">{c}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
