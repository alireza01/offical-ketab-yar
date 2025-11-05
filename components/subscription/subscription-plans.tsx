'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

const plans = [
    {
        name: 'Free',
        price: '$0',
        features: ['Limited preview pages', 'Basic features', 'Community support'],
    },
    {
        name: 'Premium',
        price: '$9.99/mo',
        features: ['Full library access', 'AI features', 'Unlimited vocabulary', 'Priority support', 'Download books'],
        popular: true,
    },
]

export function SubscriptionPlans() {
    return (
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {plans.map((plan) => (
                <Card key={plan.name} className={plan.popular ? 'border-primary' : ''}>
                    <CardHeader>
                        <CardTitle>{plan.name}</CardTitle>
                        <CardDescription>
                            <span className="text-3xl font-bold">{plan.price}</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {plan.features.map((feature) => (
                                <li key={feature} className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-primary" />
                                    <span className="text-sm">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" variant={plan.popular ? 'default' : 'outline'}>
                            {plan.name === 'Free' ? 'Current Plan' : 'Upgrade'}
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}
