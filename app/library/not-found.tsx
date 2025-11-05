import { Button } from "@/components/ui/button"
import { BookX, Home, Search, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="container py-12 min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center justify-center text-center max-w-md">
        {/* Icon (Agent 3 - Psychology) */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gold-500/20 rounded-full blur-2xl" />
          <div className="relative bg-gradient-to-br from-gold-500/10 to-gold-600/10 mb-4 flex size-20 items-center justify-center rounded-full border-2 border-gold-500/20">
            <BookX className="text-gold-600 size-10" />
          </div>
        </div>

        <h1 className="mb-3 text-4xl font-bold">404</h1>
        <h2 className="mb-2 text-2xl font-bold">صفحه یافت نشد</h2>
        <p className="text-muted-foreground mb-8 max-w-md leading-relaxed">
          متأسفانه صفحه مورد نظر شما یافت نشد. شاید حذف شده یا آدرس اشتباه است.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button
            asChild
            className="bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-700 hover:to-gold-600"
          >
            <Link href="/library">
              <Search className="w-4 h-4 ml-2" />
              جستجو در کتابخانه
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">
              <Home className="w-4 h-4 ml-2" />
              صفحه اصلی
            </Link>
          </Button>
        </div>

        {/* Quick Links (Agent 3 - UX) */}
        <div className="mt-8 pt-6 border-t border-border w-full">
          <p className="text-sm text-muted-foreground mb-3">صفحات پرطرفدار:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/library?genre=fiction">
                <TrendingUp className="w-3 h-3 ml-1" />
                داستانی
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/library?genre=classic">
                کلاسیک
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/library?genre=self-help">
                خودیاری
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
