'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { BookOpen } from 'lucide-react'

export function ContinueReading() {
    return (
        <section className="py-12">
            <div className="container">
                <h2 className="text-3xl font-bold mb-6">Continue Reading</h2>
                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <BookOpen className="h-12 w-12 text-[#D4AF37]" />
                        <div className="flex-1">
                            <h3 className="font-semibold">No books in progress</h3>
                            <p className="text-sm text-muted-foreground">Start reading to see your progress here</p>
                        </div>
                        <Button className="bg-[#D4AF37] hover:bg-[#C9A961]">Browse Library</Button>
                    </div>
                </Card>
            </div>
        </section>
    )
}
