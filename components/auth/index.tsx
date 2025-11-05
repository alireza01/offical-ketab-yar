'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

export function LoginForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    return (
        <Card className="p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Login</h2>
            <form className="space-y-4">
                <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                    />
                </div>
                <div>
                    <label className="text-sm font-medium">Password</label>
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                    />
                </div>
                <Button type="submit" className="w-full bg-[#D4AF37] hover:bg-[#C9A961]">
                    Login
                </Button>
            </form>
        </Card>
    )
}

export function RegisterForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')

    return (
        <Card className="p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Create Account</h2>
            <form className="space-y-4">
                <div>
                    <label className="text-sm font-medium">Name</label>
                    <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                    />
                </div>
                <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                    />
                </div>
                <div>
                    <label className="text-sm font-medium">Password</label>
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                    />
                </div>
                <Button type="submit" className="w-full bg-[#D4AF37] hover:bg-[#C9A961]">
                    Create Account
                </Button>
            </form>
        </Card>
    )
}
