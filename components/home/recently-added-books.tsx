import { Card } from '@/components/ui/card'

export function RecentlyAddedBooks() {
    return (
        <section className="py-12">
            <div className="container">
                <h2 className="text-3xl font-bold mb-6">Recently Added</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Card key={i} className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                            <div className="aspect-[2/3] bg-muted rounded-md mb-2" />
                            <h3 className="font-semibold text-sm line-clamp-2">Book Title {i}</h3>
                            <p className="text-xs text-muted-foreground">Author Name</p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
