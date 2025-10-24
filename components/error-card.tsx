"use client"

import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface ErrorCardProps {
  title?: string
  description?: string
  error?: Error
  reset?: () => void
}

export function ErrorCard({ 
  title = "خطایی رخ داده است", 
  description = "متأسفانه مشکلی پیش آمده است. لطفاً دوباره تلاش کنید.",
  error,
  reset 
}: ErrorCardProps) {
  return (
    <div className="flex min-h-[400px] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <CardTitle>{title}</CardTitle>
          </div>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        {error && (
          <CardContent>
            <div className="rounded-md bg-muted p-3">
              <p className="text-sm text-muted-foreground font-mono">
                {error.message}
              </p>
            </div>
          </CardContent>
        )}
        {reset && (
          <CardFooter>
            <Button onClick={reset} className="w-full">
              تلاش مجدد
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
