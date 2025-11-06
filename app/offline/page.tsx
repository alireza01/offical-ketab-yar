import { Button } from '@/components/ui/button'
import { RefreshCw, WifiOff } from 'lucide-react'

export default function OfflinePage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <div className="text-center space-y-6 max-w-md">
                <div className="flex justify-center">
                    <div className="rounded-full bg-gold/10 p-6">
                        <WifiOff className="h-16 w-16 text-gold" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">شما آفلاین هستید</h1>
                    <p className="text-muted-foreground">
                        اتصال اینترنت شما قطع شده است. لطفاً اتصال خود را بررسی کنید.
                    </p>
                </div>

                <div className="space-y-4">
                    <Button
                        onClick={() => window.location.reload()}
                        className="w-full"
                        size="lg"
                    >
                        <RefreshCw className="mr-2 h-5 w-5" />
                        تلاش مجدد
                    </Button>

                    <div className="text-sm text-muted-foreground">
                        <p>💡 نکته: کتاب‌های دانلود شده برای خواندن آفلاین در دسترس هستند</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
