import { PricingClient } from '@/components/pricing/pricing-client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'قیمت‌گذاری | کتاب‌یار',
  description: 'پلن‌های اشتراک کتاب‌یار - انتخاب بهترین پلن برای شما',
}

export default function SubscriptionPage() {
  return <PricingClient />
}
