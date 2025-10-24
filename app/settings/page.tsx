import { SettingsTabs } from '@/components/settings/settings-tabs'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'تنظیمات | کتاب‌یار',
  description: 'تنظیمات حساب کاربری',
}

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">تنظیمات</h1>
      <SettingsTabs />
    </div>
  )
}
