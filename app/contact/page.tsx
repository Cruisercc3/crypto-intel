"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { SidebarNav } from "@/components/sidebar-nav"
import { Footer } from "@/components/footer"
import { Send, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { submitForm } from "@/lib/forms"

const subjects = [
  { value: "general", label: "General Inquiry" },
  { value: "acquisition", label: "Platform Acquisition" },
  { value: "docs", label: "Request Documentation" },
  { value: "enterprise", label: "Enterprise / White-Label" },
  { value: "support", label: "Technical Support" },
  { value: "other", label: "Other" },
]

function ContactForm() {
  const searchParams = useSearchParams()
  const typeParam = searchParams.get("type")
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: typeParam === "docs" ? "docs" : typeParam === "acquisition" ? "acquisition" : "general",
    building: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const isDocsRequest = formData.subject === "docs"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    setSubmitError("")
    try {
      await submitForm({
        name: formData.name,
        email: formData.email,
        company: formData.company,
        subject: formData.subject,
        building: formData.building,
        message: formData.message,
        _subject: `Contact: ${subjects.find(s => s.value === formData.subject)?.label ?? formData.subject}`,
      })
      setIsSubmitted(true)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "The message didn't go through")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <div className="w-12 h-12 bg-bullish/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-6 h-6 text-bullish" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Message Sent</h2>
        <p className="text-sm text-muted-foreground mb-6">
          {isDocsRequest 
            ? "We'll send the documentation package to your email shortly."
            : "We'll get back to you as soon as possible."}
        </p>
        <Button
          onClick={() => {
            setIsSubmitted(false)
            setFormData({
              name: "",
              email: "",
              company: "",
              subject: "general",
              building: "",
              message: "",
            })
          }}
          variant="outline"
        >
          Send Another Message
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 md:p-8">
      <div className="grid md:grid-cols-2 gap-5">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
            Name <span className="text-bearish">*</span>
          </label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            placeholder="Your name"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
            Email <span className="text-bearish">*</span>
          </label>
          <input
            type="email"
            id="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            placeholder="you@example.com"
          />
        </div>

        {/* Company (optional) */}
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-foreground mb-1.5">
            Company <span className="text-muted-foreground font-normal">(optional)</span>
          </label>
          <input
            type="text"
            id="company"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            placeholder="Your company"
          />
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-1.5">
            Subject <span className="text-bearish">*</span>
          </label>
          <select
            id="subject"
            required
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          >
            {subjects.map((subject) => (
              <option key={subject.value} value={subject.value}>
                {subject.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* What are you building (optional, shown for docs request) */}
      {isDocsRequest && (
        <div className="mt-5">
          <label htmlFor="building" className="block text-sm font-medium text-foreground mb-1.5">
            What are you building? <span className="text-muted-foreground font-normal">(optional)</span>
          </label>
          <input
            type="text"
            id="building"
            value={formData.building}
            onChange={(e) => setFormData({ ...formData, building: e.target.value })}
            className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            placeholder="Crypto news app, trading platform, etc."
          />
        </div>
      )}

      {/* Message */}
      <div className="mt-5">
        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1.5">
          Message <span className="text-bearish">*</span>
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none"
          placeholder={isDocsRequest 
            ? "Let us know if you have any specific questions about the platform..."
            : "How can we help you?"}
        />
      </div>

      {/* Submit */}
      <div className="mt-6">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              {isDocsRequest ? "Request Documentation" : "Send Message"}
            </>
          )}
        </Button>
        {submitError && (
          <p className="mt-3 text-xs text-bearish" role="alert">
            Couldn&apos;t send your message: {submitError}. Nothing was sent, try again.
          </p>
        )}
      </div>
    </form>
  )
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <SidebarNav />
      
      <main className="xl:ml-16">
        <div className="mx-auto max-w-[800px] px-4 py-12">
          {/* Header */}
          <div className="mb-8">
            <span className="text-xs font-mono text-primary uppercase tracking-widest">Contact</span>
            <h1 className="mt-2 text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              Get in Touch
            </h1>
            <p className="mt-3 text-muted-foreground">
              Interested in acquiring the platform, requesting documentation, or have questions? Reach out below.
            </p>
          </div>

          {/* Form */}
          <Suspense fallback={
            <div className="bg-card border border-border rounded-lg p-8 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          }>
            <ContactForm />
          </Suspense>

          {/* Direct Contact */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Or email directly at{" "}
              <a href="mailto:hello@cryptointel.dev" className="text-primary hover:text-primary/80 transition-colors">
                hello@cryptointel.dev
              </a>
            </p>
          </div>
        </div>
        
        <Footer />
      </main>
    </div>
  )
}
