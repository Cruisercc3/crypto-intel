import { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { SidebarNav } from "@/components/sidebar-nav"
import { StatsBar } from "@/components/home/stats-bar"
import { Footer } from "@/components/footer"
import { OverallSentiment } from "@/components/analysis/overall-sentiment"
import { AssetSentimentGrid } from "@/components/analysis/asset-sentiment-grid"
import { SentimentHistory } from "@/components/analysis/sentiment-history"
import { UpdatedAt } from "@/components/analysis/updated-at"

export const metadata: Metadata = {
  title: "AI Analysis | CryptoIntel",
  description: "Headline sentiment, the Fear & Greed trend and on-demand AI analysis per asset",
}

export default function AnalysisPage() {
  return (
    <div className="min-h-screen bg-background">
      <StatsBar />
      <Navigation />
      <SidebarNav />

      <main className="xl:ml-16 px-4 py-6">
        <div className="mx-auto max-w-[1600px]">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">AI Analysis</h1>
              <p className="text-sm text-muted-foreground">Headline sentiment, market mood and AI reads per asset</p>
            </div>
            <UpdatedAt />
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <OverallSentiment />
              </div>
              <div className="lg:col-span-2">
                <SentimentHistory />
              </div>
            </div>
            <AssetSentimentGrid />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
