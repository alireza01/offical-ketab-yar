'use client'

import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import {
  Activity,
  ArrowUpRight,
  BookMarked,
  BookOpen,
  Cookie,
  Crown,
  Heart,
  HelpCircle,
  Library,
  Mail,
  MessageCircle,
  PenTool,
  Rocket,
  Shield,
  Sparkles,
  Target
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { FaGithub, FaInstagram, FaXTwitter } from 'react-icons/fa6'

export function SiteFooter() {
  const [showBanana, setShowBanana] = useState(false)

  const handleIconClick = () => {
    if (!showBanana) {
      setShowBanana(true)
    }
  }
  const footerLinks = {
    product: [
      { label: 'کتابخانه', href: '/library', icon: Library },
      { label: 'قیمت‌گذاری', href: '/subscription', icon: Crown },
      { label: 'راهنما', href: '/guide', icon: BookMarked },
    ],
    company: [
      { label: 'درباره ما', href: '/about', icon: Target },
      { label: 'تماس با ما', href: '/contact', icon: Mail },
      { label: 'وبلاگ', href: '/blog', icon: PenTool },
      { label: 'فرصت‌های شغلی', href: '/careers', icon: Rocket },
    ],
    legal: [
      { label: 'حریم خصوصی', href: '/privacy', icon: Shield },
      { label: 'کوکی‌ها', href: '/cookies', icon: Cookie },
    ],
    support: [
      { label: 'مرکز راهنمایی', href: '/help', icon: HelpCircle },
      { label: 'پشتیبانی', href: '/support', icon: MessageCircle },
      { label: 'وضعیت سرویس', href: '/status', icon: Activity },
    ],
  }

  const socialLinks = [
    { icon: FaXTwitter, href: 'https://twitter.com', label: 'X (Twitter)', color: 'hover:bg-blue-500/10 hover:text-blue-500 hover:border-blue-500/50' },
    { icon: FaInstagram, href: 'https://instagram.com', label: 'Instagram', color: 'hover:bg-pink-500/10 hover:text-pink-500 hover:border-pink-500/50' },
    { icon: FaGithub, href: 'https://github.com', label: 'Github', color: 'hover:bg-purple-500/10 hover:text-purple-500 hover:border-purple-500/50' },
  ]

  return (
    <footer className="relative border-t bg-gradient-to-b from-background via-muted/30 to-muted/50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gold-400/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container relative mx-auto px-4 py-16 pb-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="col-span-1 md:col-span-2"
          >
            <Link href="/" className="group inline-flex items-center gap-3 mb-6">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gold-600 to-gold-400 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative w-12 h-12 bg-gradient-to-br from-gold-600 to-gold-400 rounded-xl flex items-center justify-center shadow-xl">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
              </motion.div>
              <div>
                <span className="block text-2xl font-bold bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 bg-clip-text text-transparent group-hover:from-gold-500 group-hover:to-gold-300 transition-all">
                  کتاب‌یار
                </span>
                <span className="block text-xs text-muted-foreground">همراه هوشمند مطالعه</span>
              </div>
            </Link>

            <p className="text-muted-foreground mb-6 leading-relaxed max-w-sm">
              پلتفرم مطالعه هوشمند با AI برای یادگیری زبان انگلیسی. تجربه‌ای متفاوت در دنیای کتاب‌ها.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon
                return (
                  <motion.div
                    key={social.label}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      className={`relative group overflow-hidden transition-all duration-300 ${social.color}`}
                      asChild
                    >
                      <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
                        <Icon className="h-4 w-4 relative z-10 transition-transform group-hover:scale-110" />
                      </a>
                    </Button>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([key, links], sectionIndex) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
            >
              <h4 className="font-bold text-foreground mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-gold-600 to-gold-400 rounded-full" />
                {key === 'product' && 'محصول'}
                {key === 'company' && 'شرکت'}
                {key === 'legal' && 'قانونی'}
                {key === 'support' && 'پشتیبانی'}
              </h4>
              <ul className="space-y-3">
                {links.map((link, index) => {
                  const LinkIcon = link.icon
                  return (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold-600 transition-all duration-300"
                      >
                        <LinkIcon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                        <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                        <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </motion.li>
                  )
                })}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Divider with gradient */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center">
            <div className="bg-background px-4">
              <Sparkles className="h-5 w-5 text-gold-500" />
            </div>
          </div>
        </div>

        {/* Bottom Bar - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col items-center justify-center gap-4 text-center pb-4 px-4"
        >
          {/* Made with Love */}
          <motion.div
            className="flex items-center gap-2 text-sm text-muted-foreground justify-center"
            whileHover={{ scale: 1.05 }}
          >
            <span>ساخته شده با</span>
            <motion.button
              onClick={handleIconClick}
              className="cursor-pointer focus:outline-none inline-flex items-center justify-center"
              whileTap={{ scale: 0.8, rotate: 15 }}
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {showBanana ? (
                <span className="text-2xl inline-block drop-shadow-[0_0_12px_rgba(255,193,7,0.6)]">
                  🍌
                </span>
              ) : (
                <Heart className="h-4 w-4 fill-red-500 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
              )}
            </motion.button>
            <span>برای عاشقان کتاب</span>
          </motion.div>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground text-center leading-relaxed">
            <span className="inline-block">© {new Date().getFullYear()} کتاب‌یار.</span>
            <span className="text-gold-600/70 mx-2">•</span>
            <span className="inline-block">تمامی حقوق محفوظ است.</span>
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
