'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function DailyQuiz() {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Daily Vocabulary Quiz</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-lg">What does &quot;Eloquent&quot; mean?</p>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              A. Fluent or persuasive in speaking
            </Button>
            <Button variant="outline" className="w-full justify-start">
              B. Quiet and reserved
            </Button>
            <Button variant="outline" className="w-full justify-start">
              C. Confused or unclear
            </Button>
            <Button variant="outline" className="w-full justify-start">
              D. Angry or upset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
