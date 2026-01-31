"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, Shield, Zap, Users, Building, Laptop, Star, MessageSquare, Clock, UserCheck, Megaphone, Search, Lock } from "lucide-react"
// ... (skip lines until FeatureCard usage)

<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
  <FeatureCard
    icon={<MessageSquare className="h-10 w-10 text-primary" />}
    title="Public Issue Discussions"
    desc="Engage with the community. Comment on shared issues, offer solutions, and see how others are resolving similar problems."
    delay={0.1}
  />
  <FeatureCard
    icon={<Clock className="h-10 w-10 text-secondary-foreground" />}
    title="Real-time Timeline"
    desc="Track your complaint's journey step-by-step: Reported → Viewed → Assigned → In Progress → Resolved."
    delay={0.2}
  />
  <FeatureCard
    icon={<UserCheck className="h-10 w-10 text-primary" />}
    title="Admin Assignment"
    desc="Wardens can instantly assign tasks to specific staff members (Electrician, Plumber) for accountability."
    delay={0.3}
  />
  <FeatureCard
    icon={<Megaphone className="h-10 w-10 text-foreground" />}
    title="Hostel Announcements"
    desc="Never miss an update. Get official notices about maintenance schedules, events, and rules directly on your dashboard."
    delay={0.4}
  />
  <FeatureCard
    icon={<Search className="h-10 w-10 text-primary" />}
    title="Lost & Found"
    desc="Lost something? Report it instantly. Found something? List it so the owner can claim it easily."
    delay={0.5}
  />
  <FeatureCard
    icon={<Lock className="h-10 w-10 text-destructive" />}
    title="Secure Reporting"
    desc="Submit private complaints that are visible only to you and the administration for sensitive matters."
    delay={0.6}
  />
</div>
import { motion } from "framer-motion"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse delay-1000" />
      </div>

      <header className="px-6 lg:px-10 h-20 flex items-center border-b border-white/10 backdrop-blur-xl fixed top-0 w-full z-50 bg-white/50 dark:bg-black/50 supports-[backdrop-filter]:bg-white/10">
        <Link className="flex items-center justify-center gap-2 group" href="#">
          <div className="bg-primary w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-lg group-hover:scale-105 transition-transform">R</div>
          <span className="text-2xl font-bold text-foreground">ResiLink</span>
        </Link>
        <nav className="ml-auto flex gap-6 sm:gap-8">
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="/login">
            Login
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="/signup">
            Sign Up
          </Link>
        </nav>
      </header>

      <main className="flex-1 pt-20 z-10 relative">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-48 relative">
          <div className="container px-4 md:px-6 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center space-y-8 text-center"
            >
              <div className="space-y-4 max-w-4xl">
                <Badge className="mb-4 animate-in fade-in zoom-in duration-500">🏆 Voted #1 Hostel Management App</Badge>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl/none">
                  Smart Living for <br />
                  <span className="text-primary">Modern Campuses</span>
                </h1>
                <p className="mx-auto max-w-[800px] text-lg md:text-xl text-muted-foreground leading-relaxed">
                  Transform your hostel experience with ResiLink. Instant issue reporting, seamless communication,
                  and real-time updates—all in one beautiful app.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/login">
                  <Button className="h-14 px-10 text-lg rounded-full shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:scale-105 transition-all duration-300">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline" className="h-14 px-10 text-lg rounded-full glass hover:bg-white/20 border-white/20">
                    See Functionality
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats / Trust Section */}
        <section className="w-full py-12 border-y border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <StatCard number="50+" label="Partner Colleges" />
              <StatCard number="12k+" label="Active Students" />
              <StatCard number="98%" label="Issue Resolution" />
              <StatCard number="24/7" label="Support System" />
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="w-full py-24 bg-gradient-to-b from-transparent to-primary/5">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-5xl mb-4">Everything you need</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Built for students, wardens, and administrators to work in perfect harmony.</p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<MessageSquare className="h-10 w-10 text-primary" />}
                title="Public Issue Discussions"
                desc="Engage with the community. Comment on shared issues, offer solutions, and see how others are resolving similar problems."
                delay={0.1}
              />
              <FeatureCard
                icon={<Clock className="h-10 w-10 text-blue-500" />}
                title="Real-time Timeline"
                desc="Track your complaint's journey step-by-step: Reported → Viewed → Assigned → In Progress → Resolved."
                delay={0.2}
              />
              <FeatureCard
                icon={<UserCheck className="h-10 w-10 text-purple-500" />}
                title="Admin Assignment"
                desc="Wardens can instantly assign tasks to specific staff members (Electrician, Plumber) for accountability."
                delay={0.3}
              />
              <FeatureCard
                icon={<Megaphone className="h-10 w-10 text-yellow-500" />}
                title="Hostel Announcements"
                desc="Never miss an update. Get official notices about maintenance schedules, events, and rules directly on your dashboard."
                delay={0.4}
              />
              <FeatureCard
                icon={<Search className="h-10 w-10 text-orange-500" />}
                title="Lost & Found"
                desc="Lost something? Report it instantly. Found something? List it so the owner can claim it easily."
                delay={0.5}
              />
              <FeatureCard
                icon={<Lock className="h-10 w-10 text-red-500" />}
                title="Secure Reporting"
                desc="Submit private complaints that are visible only to you and the administration for sensitive matters."
                delay={0.6}
              />
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="w-full py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 -skew-y-3 transform origin-top-left scale-110 z-0" />
          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-5xl mb-4">Trusted by Top Campuses</h2>
              <p className="text-muted-foreground text-lg">See how leading institutions are revolutionizing student living.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <SuccessCard
                quote="ResiLink slashed our maintenance response time by 60%. The students absolutely love the transparency."
                author="Dr. A. Sharma"
                role="Dean of Student Affairs, IIT Bombay"
                delay={0.1}
              />
              <SuccessCard
                quote="Finally, a system that actually works. No more lost complaints or endless follow-ups. It's a game changer."
                author="Sarah Jenkins"
                role="Chief Warden, NIT Trichy"
                delay={0.2}
              />
              <SuccessCard
                quote="The analytics dashboard gives us insights we never had before. We can predict maintenance needs before they happen."
                author="Prof. R. Kumar"
                role="Director, BITS Pilani"
                delay={0.3}
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="rounded-3xl bg-primary p-8 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-white/10 backdrop-blur-3xl opacity-20" />
              <div className="relative z-10 space-y-6">
                <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">Ready to upgrade your campus?</h2>
                <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                  Join thousands of students and administrators experiencing the future of hostel management today.
                </p>
                <div className="pt-4">
                  <Link href="/login">
                    <Button className="h-14 px-10 text-lg rounded-full bg-white text-primary hover:bg-white/90 hover:scale-105 transition-all shadow-xl font-bold">
                      Get Started Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-8 w-full shrink-0 items-center px-4 md:px-6 border-t border-white/10 bg-muted/20">
        <p className="text-xs text-muted-foreground">© 2024 ResiLink. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-6 sm:gap-8">
          <Link className="text-xs text-muted-foreground hover:underline underline-offset-4 hover:text-primary transition-colors" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs text-muted-foreground hover:underline underline-offset-4 hover:text-primary transition-colors" href="#">
            Privacy
          </Link>
          <Link className="text-xs text-muted-foreground hover:underline underline-offset-4 hover:text-primary transition-colors" href="#">
            Contact
          </Link>
        </nav>
      </footer>
    </div>
  )
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary ${className}`}>
      {children}
    </span>
  )
}

function FeatureCard({ icon, title, desc, delay }: { icon: React.ReactNode, title: string, desc: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      viewport={{ once: true }}
      className="flex flex-col items-center text-center space-y-4 p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 hover:bg-white/10 transition-all hover:-translate-y-1 shadow-sm hover:shadow-lg"
    >
      <div className="p-4 bg-background rounded-full shadow-sm ring-1 ring-black/5 dark:ring-white/10">
        {icon}
      </div>
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {desc}
      </p>
    </motion.div>
  )
}

function StatCard({ number, label }: { number: string, label: string }) {
  return (
    <div className="space-y-2">
      <h4 className="text-4xl md:text-5xl font-extrabold text-primary">{number}</h4>
      <p className="text-sm md:text-base text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
    </div>
  )
}

function SuccessCard({ quote, author, role, delay }: { quote: string, author: string, role: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
      viewport={{ once: true }}
      className="p-8 rounded-2xl bg-background border border-border shadow-lg space-y-4 relative"
    >
      <div className="absolute top-6 left-6 text-6xl text-primary/20 font-serif leading-none">"</div>
      <div className="flex gap-1 mb-2">
        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />)}
      </div>
      <p className="text-lg font-medium italic relative z-10 text-foreground/80">
        {quote}
      </p>
      <div className="pt-4 border-t border-border/50">
        <p className="font-bold text-primary">{author}</p>
        <p className="text-xs text-muted-foreground">{role}</p>
      </div>
    </motion.div>
  )
}
