'use client'

import { Bell, Lock, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createClient } from '@/lib/supabase/client'

interface UserData {
  id: string
  name: string | null
  email: string
}

export function SettingsTabs() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()

      if (authUser) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single()

        setUser(userData)
      }
    }

    getUser()
  }, [supabase])

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string

    const { error } = await supabase
      .from('users')
      .update({ name })
      .eq('id', user?.id)

    if (!error) {
      alert('پروفایل با موفقیت به‌روزرسانی شد')
    }

    setLoading(false)
  }

  return (
    <Tabs defaultValue="profile">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="profile">
          <User className="w-4 h-4 mr-2" />
          پروفایل
        </TabsTrigger>
        <TabsTrigger value="security">
          <Lock className="w-4 h-4 mr-2" />
          امنیت
        </TabsTrigger>
        <TabsTrigger value="notifications">
          <Bell className="w-4 h-4 mr-2" />
          اعلان‌ها
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle>اطلاعات پروفایل</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">نام</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={user?.name || ''}
                  placeholder="نام خود را وارد کنید"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">ایمیل</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={user?.email || ''}
                  disabled
                />
              </div>
              <div>
                <Button type="submit" disabled={loading}>
                  {loading ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="security">
        <Card>
          <CardHeader>
            <CardTitle>امنیت حساب</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Button variant="outline">تغییر رمز عبور</Button>
            </div>
            <div>
              <Button variant="destructive">حذف حساب کاربری</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <CardTitle>تنظیمات اعلان‌ها</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              تنظیمات اعلان‌ها به زودی اضافه خواهد شد
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
