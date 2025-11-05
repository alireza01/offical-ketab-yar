import Link from 'next/link'

export function SiteFooter() {
    return (
        <footer className="border-t py-12 bg-muted/50">
            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="font-bold text-lg mb-4">Ketab-Yar</h3>
                        <p className="text-sm text-muted-foreground">
                            Smart bilingual book reading platform
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Product</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/library" className="hover:text-[#D4AF37]">Library</Link></li>
                            <li><Link href="/about" className="hover:text-[#D4AF37]">About</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Support</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/help" className="hover:text-[#D4AF37]">Help</Link></li>
                            <li><Link href="/support" className="hover:text-[#D4AF37]">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/privacy" className="hover:text-[#D4AF37]">Privacy</Link></li>
                            <li><Link href="/terms" className="hover:text-[#D4AF37]">Terms</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} Ketab-Yar. All rights reserved.
                </div>
            </div>
        </footer>
    )
}
