import { LoadingBar } from '@/components/ui/loading-bar'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Landing Page Loading State
 * Agent 1 (SEO): SSG page with premium skeleton
 * Agent 3 (Psychology): Engaging loading experience matching actual home layout
 */
export default function Loading() {
  return (
    <>
      <LoadingBar />

      <div className="min-h-screen">
        {/* Desktop Layout */}
        <div className="hidden md:block">
          {/* Hero Section */}
          <section className="relative min-h-[100vh] overflow-hidden bg-gradient-to-br from-gold-100/40 via-background to-gold-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
            <div className="container relative mx-auto px-4 sm:px-6 pt-32 pb-20 md:pt-40 md:pb-32">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left content */}
                <div className="space-y-8 text-center lg:text-right">
                  {/* Badge */}
                  <Skeleton className="h-10 w-64 mx-auto lg:mx-0 rounded-full" shimmer />

                  {/* Heading */}
                  <div className="space-y-4">
                    <Skeleton className="h-20 w-80 mx-auto lg:mx-0" shimmer />
                    <Skeleton className="h-12 w-96 mx-auto lg:mx-0" shimmer />
                  </div>

                  {/* Description */}
                  <div className="space-y-3 max-w-xl mx-auto lg:mx-0">
                    <Skeleton className="h-6 w-full" shimmer />
                    <Skeleton className="h-6 w-full" shimmer />
                    <Skeleton className="h-6 w-3/4" shimmer />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-4 justify-center lg:justify-start">
                    <Skeleton className="h-14 w-56 rounded-lg" shimmer />
                    <Skeleton className="h-14 w-48 rounded-lg" shimmer />
                  </div>

                  {/* Trust indicators */}
                  <div className="flex gap-6 justify-center lg:justify-start pt-4">
                    <Skeleton className="h-12 w-32" shimmer />
                    <Skeleton className="h-12 w-32" shimmer />
                  </div>
                </div>

                {/* Right content - Book showcase */}
                <div className="relative hidden lg:block">
                  <div className="relative w-full aspect-square max-w-2xl mx-auto">
                    <Skeleton className="absolute top-0 right-0 w-48 h-64 rounded-lg rotate-6" shimmer />
                    <Skeleton className="absolute top-20 left-0 w-56 h-72 rounded-lg -rotate-6" shimmer />
                    <Skeleton className="absolute bottom-0 right-1/4 w-52 h-68 rounded-lg rotate-3" shimmer />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Continue Reading Section */}
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="mb-8">
                <Skeleton className="h-8 w-48 mb-2" shimmer />
                <Skeleton className="h-5 w-64" shimmer />
              </div>
              <div className="grid grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-[2/3] w-full rounded-lg" shimmer />
                    <Skeleton className="h-4 w-full" shimmer />
                    <Skeleton className="h-3 w-2/3" shimmer />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Recently Added Books */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="mb-8">
                <Skeleton className="h-8 w-48 mb-2" shimmer />
                <Skeleton className="h-5 w-64" shimmer />
              </div>
              <div className="grid grid-cols-6 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-[2/3] w-full rounded-lg" shimmer />
                    <Skeleton className="h-4 w-full" shimmer />
                    <Skeleton className="h-3 w-2/3" shimmer />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Highest Rated Books */}
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="mb-8">
                <Skeleton className="h-8 w-48 mb-2" shimmer />
                <Skeleton className="h-5 w-64" shimmer />
              </div>
              <div className="grid grid-cols-6 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-[2/3] w-full rounded-lg" shimmer />
                    <Skeleton className="h-4 w-full" shimmer />
                    <Skeleton className="h-3 w-2/3" shimmer />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Most Read Books */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="mb-8">
                <Skeleton className="h-8 w-48 mb-2" shimmer />
                <Skeleton className="h-5 w-64" shimmer />
              </div>
              <div className="grid grid-cols-6 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-[2/3] w-full rounded-lg" shimmer />
                    <Skeleton className="h-4 w-full" shimmer />
                    <Skeleton className="h-3 w-2/3" shimmer />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-gradient-to-br from-gold-100/40 via-background to-gold-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
            <div className="container mx-auto px-4 text-center">
              <Skeleton className="h-12 w-96 mx-auto mb-4" shimmer />
              <Skeleton className="h-6 w-[600px] mx-auto mb-8" shimmer />
              <Skeleton className="h-14 w-48 mx-auto rounded-lg" shimmer />
            </div>
          </section>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* Hero Section */}
          <section className="relative min-h-[80vh] overflow-hidden bg-gradient-to-br from-gold-100/40 via-background to-gold-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
            <div className="container relative mx-auto px-4 pt-24 pb-16">
              <div className="space-y-6 text-center">
                {/* Badge */}
                <Skeleton className="h-9 w-56 mx-auto rounded-full" shimmer />

                {/* Heading */}
                <div className="space-y-3">
                  <Skeleton className="h-14 w-64 mx-auto" shimmer />
                  <Skeleton className="h-10 w-72 mx-auto" shimmer />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Skeleton className="h-5 w-full" shimmer />
                  <Skeleton className="h-5 w-full" shimmer />
                  <Skeleton className="h-5 w-3/4 mx-auto" shimmer />
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-3">
                  <Skeleton className="h-12 w-full rounded-lg" shimmer />
                  <Skeleton className="h-12 w-full rounded-lg" shimmer />
                </div>

                {/* Trust indicators */}
                <div className="flex gap-4 justify-center pt-4">
                  <Skeleton className="h-10 w-28" shimmer />
                  <Skeleton className="h-10 w-28" shimmer />
                </div>
              </div>
            </div>
          </section>

          {/* Continue Reading */}
          <section className="py-12 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="mb-6">
                <Skeleton className="h-7 w-40 mb-2" shimmer />
                <Skeleton className="h-4 w-48" shimmer />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="aspect-[2/3] w-full rounded-lg" shimmer />
                    <Skeleton className="h-3 w-full" shimmer />
                    <Skeleton className="h-3 w-2/3" shimmer />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Recently Added */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="mb-6">
                <Skeleton className="h-7 w-40 mb-2" shimmer />
                <Skeleton className="h-4 w-48" shimmer />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="aspect-[2/3] w-full rounded-lg" shimmer />
                    <Skeleton className="h-3 w-full" shimmer />
                    <Skeleton className="h-3 w-2/3" shimmer />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Highest Rated */}
          <section className="py-12 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="mb-6">
                <Skeleton className="h-7 w-40 mb-2" shimmer />
                <Skeleton className="h-4 w-48" shimmer />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="aspect-[2/3] w-full rounded-lg" shimmer />
                    <Skeleton className="h-3 w-full" shimmer />
                    <Skeleton className="h-3 w-2/3" shimmer />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Most Read */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="mb-6">
                <Skeleton className="h-7 w-40 mb-2" shimmer />
                <Skeleton className="h-4 w-48" shimmer />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="aspect-[2/3] w-full rounded-lg" shimmer />
                    <Skeleton className="h-3 w-full" shimmer />
                    <Skeleton className="h-3 w-2/3" shimmer />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 bg-gradient-to-br from-gold-100/40 via-background to-gold-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
            <div className="container mx-auto px-4 text-center">
              <Skeleton className="h-10 w-72 mx-auto mb-3" shimmer />
              <Skeleton className="h-5 w-full mb-6" shimmer />
              <Skeleton className="h-12 w-40 mx-auto rounded-lg" shimmer />
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
