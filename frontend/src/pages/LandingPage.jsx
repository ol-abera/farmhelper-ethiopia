import { Link } from 'react-router-dom'
import {
  Sprout, ClipboardList, Wallet, BarChart3, WifiOff, Globe2,
  ArrowRight, CheckCircle2, Leaf, MapPin
} from 'lucide-react'

const features = [
  {
    icon: ClipboardList,
    title: 'Farm records',
    description: 'Keep clear records of every field: size, planting date, seed variety, and notes — all in one place.',
  },
  {
    icon: Wallet,
    title: 'Expense tracking',
    description: 'Record seeds, fertilizer, labour, and other costs so you always know what you have spent.',
  },
  {
    icon: BarChart3,
    title: 'Harvest & sales',
    description: 'Log harvest quantities and sales. See total revenue and estimated profit from your recorded data.',
  },
  {
    icon: WifiOff,
    title: 'Works offline',
    description: 'Create and edit records without internet. Changes sync when you are back online.',
  },
  {
    icon: Globe2,
    title: 'Three languages',
    description: 'Use English, Afaan Oromoo, or Amharic. Switch language anytime.',
  },
  {
    icon: Sprout,
    title: 'Built for Ethiopia',
    description: 'Designed for smallholder farmers in Oromia and beyond, with mobile-first, low-bandwidth use in mind.',
  },
]

const steps = [
  { step: '1', title: 'Create your account', text: 'Register with your name, contact, and location.' },
  { step: '2', title: 'Add your farms', text: 'Record fields, crop, area, and planting dates.' },
  { step: '3', title: 'Track expenses & harvests', text: 'Log costs and production as the season progresses.' },
  { step: '4', title: 'See your progress', text: 'View totals, charts, and estimated profit on your dashboard.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream text-charcoal">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-beige/80 bg-cream/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-forest text-white">
              <Leaf className="h-5 w-5" />
            </div>
            <div>
              <span className="font-semibold text-forest">FarmHelper</span>
              <span className="ml-1 text-sm text-muted">Ethiopia</span>
            </div>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <a href="#features" className="text-muted hover:text-forest transition">Features</a>
            <a href="#how" className="text-muted hover:text-forest transition">How it works</a>
            <a href="#offline" className="text-muted hover:text-forest transition">Offline</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="rounded-lg px-3 py-2 text-sm font-medium text-forest hover:bg-beige transition"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-forest transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-forest via-primary to-fresh opacity-95" />
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="max-w-2xl">
            <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-sm text-white/90 backdrop-blur">
              <MapPin className="h-3.5 w-3.5" />
              Built for Ethiopian smallholder farmers
            </p>
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
              Manage your farm. Understand your progress. Grow with confidence.
            </h1>
            <p className="mt-5 text-lg text-white/90 leading-relaxed">
              FarmHelper Ethiopia helps farmers keep track of their crops, expenses, harvests and sales — all in one simple place.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-amber px-6 py-3.5 text-base font-semibold text-charcoal shadow-lg hover:brightness-105 transition"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-6 py-3.5 text-base font-medium text-white backdrop-blur hover:bg-white/20 transition"
              >
                Explore Features
              </a>
            </div>
          </div>

          {/* Dashboard preview card */}
          <div className="mt-14 max-w-lg rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-white/90">Dashboard preview</span>
              <span className="rounded-full bg-fresh/30 px-2 py-0.5 text-xs text-white">Demo</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Farms', value: '3' },
                { label: 'Area (ha)', value: '4.2' },
                { label: 'Expenses', value: '12,400 ETB' },
                { label: 'Sales', value: '28,000 ETB' },
              ].map((s) => (
                <div key={s.label} className="rounded-xl bg-white/15 p-3">
                  <p className="text-xs text-white/70">{s.label}</p>
                  <p className="mt-0.5 text-lg font-semibold text-white">{s.value}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-white/60">Sample numbers for illustration only. Your data stays private.</p>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold text-forest sm:text-3xl">
            Simple tools for better farming decisions
          </h2>
          <p className="mt-4 text-muted leading-relaxed">
            Many smallholder farmers in Ethiopia manage seasons from memory or paper notebooks.
            FarmHelper gives you a clear digital record of what you planted, what you spent, and what you earned —
            so you can plan the next season with confidence.
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-beige/50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-forest sm:text-3xl">What you can do</h2>
          <p className="mt-2 text-muted">Core features designed for real farms and real conditions.</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-beige bg-cream p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-forest">{f.title}</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-forest sm:text-3xl">How it works</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.step} className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-forest text-sm font-bold text-white">
                  {s.step}
                </div>
                <h3 className="mt-4 font-semibold text-forest">{s.title}</h3>
                <p className="mt-1 text-sm text-muted">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Languages & offline */}
      <section id="offline" className="bg-forest py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">Languages you use</h2>
              <p className="mt-3 text-white/80">
                Switch between English, Afaan Oromoo, and Amharic. Navigation, forms, and messages are translated.
              </p>
              <ul className="mt-6 space-y-2">
                {['English', 'Afaan Oromoo', 'አማርኛ (Amharic)'].map((lang) => (
                  <li key={lang} className="flex items-center gap-2 text-white/90">
                    <CheckCircle2 className="h-4 w-4 text-fresh" />
                    {lang}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">Designed for unreliable internet</h2>
              <p className="mt-3 text-white/80">
                Open the app offline, view saved records, and create new ones on your device.
                When you reconnect, pending changes are synchronized. Clear indicators show what is waiting to sync.
              </p>
              <p className="mt-4 text-sm text-white/60">
                Offline support is being expanded. Core farm record creation offline is a priority.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-forest sm:text-3xl">
            Start managing your farm today
          </h2>
          <p className="mt-3 text-muted">
            Free to try. Built for farmers who want clearer records and better decisions.
          </p>
          <Link
            to="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-md hover:bg-forest transition"
          >
            Create free account
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-beige bg-beige/40 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-primary" />
            <span className="font-medium text-forest">FarmHelper Ethiopia</span>
          </div>
          <p className="text-sm text-muted">
            Better farming decisions, one step at a time.
          </p>
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} FarmHelper Ethiopia. Portfolio project.
          </p>
        </div>
      </footer>
    </div>
  )
}
