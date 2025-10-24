import { AboutFeatures } from '@/components/about/about-features'
import { AboutHero } from '@/components/about/about-hero'
import { AboutMission } from '@/components/about/about-mission'
import { AboutStats } from '@/components/about/about-stats'
import { AboutTeam } from '@/components/about/about-team'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'درباره ما | کتاب‌یار',
  description: 'کتاب‌یار - همراه هوشمند مطالعه شما',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <AboutHero />
      <AboutStats />
      <AboutMission />
      <AboutFeatures />
      <AboutTeam />
    </div>
  )
}
