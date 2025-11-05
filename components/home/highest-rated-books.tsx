import { Card } from '@/components/ui/card'
import { Star } from 'lucide-react'

export function HighestRatedBooks() {
    return (
        <section className="py-12 bg-muted/50">
            <div className="container">
                <h2 className="text-3xl font-bold mb-6">Highest Rated</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Card key={i} className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                            <div className="aspect-[2/3] bg-muted rounded-md mb-2" />
                            <h3 className="font-semibold text-sm line-clamp-2">Top Book {i}</h3>
                            <div className="flex items-center gap-1 mt-1">
                                <Star className="h-3 w-3 fill-[#D4AF37] text-[#D4AF37]" />
                                <span className="text-xs">4.8</span>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
