import { PricingClient } from '@/components/pricing/pricing-client'
import { createServerClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

// Agent 1 (SEO): Optimized metadata for search engines
export const metadata: Metadata = {
  title: 'قیمت‌گذاری کتاب‌یار | اشتراک پرمیوم خواندن کتاب دوزبانه | از 266 هزار تومان',
  description: 'اشتراک پرمیوم کتاب‌یار با تخفیف ویژه. خواندن نامحدود کتاب‌های دوزبانه انگلیسی-فارسی، دستیار هوش مصنوعی، یادگیری واژگان. پلن رایگان، ماهانه، 3 ماهه و سالانه.',
  keywords: 'اشتراک کتاب‌یار, قیمت کتاب‌یار, خرید اشتراک, کتاب دوزبانه, یادگیری زبان انگلیسی',
  openGraph: {
    title: 'قیمت‌گذاری کتاب‌یار - اشتراک پرمیوم',
    description: 'خواندن نامحدود کتاب‌های دوزبانه با تخفیف ویژه',
    type: 'website',
    locale: 'fa_IR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'قیمت‌گذاری کتاب‌یار',
    description: 'اشتراک پرمیوم با تخفیف ویژه',
  },
  alternates: {
    canonical: '/subscription',
  },
}

export default async function SubscriptionPage() {
  // Get user's current subscription status if logged in
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  let currentSubscription = null
  if (user) {
    const { data: userData } = await supabase
      .from('users')
      .select('subscription_tier, subscription_expires_at, name')
      .eq('id', user.id)
      .single()

    currentSubscription = userData
  }

  return <PricingClient currentSubscription={currentSubscription} />
}
