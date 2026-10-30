"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { SidebarNav } from "@/components/sidebar-nav"
import { Footer } from "@/components/footer"
import { Send, CheckCircle2, Loader2, Clock, DollarSign, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { submitForm } from "@/lib/forms"

const interestOptions = [
  { value: "acquisition", label: "Platform Acquisition" },
  { value: "whitelabel", label: "Enterprise White-Label" },
  { value: "api", label: "API Access" },
  { value: "integration", label: "Custom Integration" },
  { value: "other", label: "Other" },
]

const features = [
  { icon: Clock, text: "Response within 24 hours" },
  { icon: DollarSign, text: "Enterprise & API pricing available" },
  { icon: Settings, text: "Custom deployments supported" },
]

export default function RequestAccessPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    interest: "",
    useCase: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError("")

    try {
      await submitForm({
        name: formData.name,
        email: formData.email,
        company: formData.company,
        interest: formData.interest,
        useCase: formData.useCase,
        _subject: `Request Access: ${formData.interest || "General"}`,
      })
      setIsSubmitted(true)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "The request didn't go through")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <SidebarNav />
      
      <main className="xl:ml-16">
        <div className="mx-auto max-w-[600px] px-4 py-12">
          {/* Header */}
          <div className="mb-8 text-center">
            <span className="text-xs font-mono text-primary uppercase tracking-widest">Get Started</span>
            <h1 className="mt-3 text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              Request Access
            </h1>
            <p className="mt-4 text-muted-foreground">
              Enterprise deployment, API access, or platform acquisition inquiries.
            </p>
          </div>

          {/* Form */}
          {isSubmitted ? (
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <div className="w-14 h-14 bg-bullish/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7 text-bullish" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Request Submitted</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Thank you for your interest. We'll review your request and get back to you within 24 hours.
              </p>
              <Button
                onClick={() => {
                  setIsSubmitted(false)
                  setFormData({
                    name: "",
                    email: "",
                    company: "",
                    interest: "",
                    useCase: "",
                  })
                }}
                variant="outline"
              >
                Submit Another Request
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 md:p-8">
              {/* Name */}
              <div className="mb-5">
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
              <div className="mb-5">
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

              {/* Company */}
              <div className="mb-5">
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

              {/* Interest */}
              <div className="mb-5">
                <label htmlFor="interest" className="block text-sm font-medium text-foreground mb-1.5">
                  Interest <span className="text-bearish">*</span>
                </label>
                <select
                  id="interest"
                  required
                  value={formData.interest}
                  onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                  className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                >
                  <option value="">Select an option...</option>
                  {interestOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Use Case */}
              <div className="mb-6">
                <label htmlFor="useCase" className="block text-sm font-medium text-foreground mb-1.5">
                  Tell us about your use case <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <textarea
                  id="useCase"
                  rows={4}
                  value={formData.useCase}
                  onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
                  className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none"
                  placeholder="Describe what you're building or how you plan to use CryptoIntel..."
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Request
                  </>
                )}
              </Button>

              {submitError && (
                <p className="mt-3 text-xs text-center text-bearish" role="alert">
                  Couldn&apos;t send your request: {submitError}. Nothing was submitted, try again.
                </p>
              )}

              <p className="mt-4 text-xs text-center text-muted-foreground">
                All inquiries receive a response within 24 hours.
              </p>
            </form>
          )}

          {/* Features */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            {features.map((feature) => (
              <div key={feature.text} className="text-center">
                <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center mx-auto mb-2">
                  <feature.icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
        
        <Footer />
      </main>
    </div>
  )
}
