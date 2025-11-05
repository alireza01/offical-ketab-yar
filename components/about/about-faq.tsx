'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const faqs = [
    {
        question: 'How does Ketab-Yar work?',
        answer: 'Ketab-Yar is a bilingual reading platform that lets you read books in both English and Persian simultaneously, helping you learn while enjoying great literature.'
    },
    {
        question: 'Is there a free trial?',
        answer: 'Yes! You can read preview pages of any book for free. Premium membership unlocks full access to our entire library.'
    },
    {
        question: 'Can I download books for offline reading?',
        answer: 'Premium members can download books securely for offline reading through our PWA app.'
    },
    {
        question: 'How does the vocabulary system work?',
        answer: 'Click any word to see its definition and save it to your personal vocabulary list. Free users can save up to 20 words, premium users have unlimited storage.'
    }
]

export function AboutFAQ() {
    return (
        <section className="py-16 bg-muted/50">
            <div className="container">
                <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
                <div className="grid gap-6 max-w-3xl mx-auto">
                    {faqs.map((faq, index) => (
                        <Card key={index}>
                            <CardHeader>
                                <CardTitle className="text-xl">{faq.question}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{faq.answer}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
