"use client"

import { useEffect, useState } from "react"
import { InstallPrompt } from "./install-prompt"

export function PWAWrapper({ children }: { children: React.ReactNode }) {
    const [isOnline, setIsOnline] = useState(true)

    useEffect(() => {
        // Handle online/offline status
        const handleOnline = () => setIsOnline(true)
        const handleOffline = () => setIsOnline(false)

        setIsOnline(navigator.onLine)

        window.addEventListener("online", handleOnline)
        window.addEventListener("offline", handleOffline)

        return () => {
            window.removeEventListener("online", handleOnline)
            window.removeEventListener("offline", handleOffline)
        }
    }, [])

    return (
        <>
            {children}
            <InstallPrompt />
            {!isOnline && (
                <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-destructive text-destructive-foreground px-4 py-2 rounded-lg shadow-lg text-sm">
                    شما آفلاین هستید
                </div>
            )}
        </>
    )
}
