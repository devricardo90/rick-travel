'use client';

import { Link } from '@/i18n/routing'
import { RickTravelLogo } from '@/components/rick-travel-logo'
import { Menu } from 'lucide-react'
import React from 'react'
import { useScroll } from 'motion/react'
import { cn } from '@/lib/utils'
import { ThemeToggleButton } from './ThemeToggleButton'
import { AuthStatus } from '@/components/auth-status'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useTranslations } from 'next-intl'
import dynamic from 'next/dynamic'

const MobileMenu = dynamic(() => import('@/components/mobile-menu'), { ssr: false })

export const HeroHeader = () => {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)
  const { scrollYProgress } = useScroll()
  const t = useTranslations('Navigation')

  const menuItems = [
    { name: t('home'), href: '/' },
    { name: t('about'), href: '/quem-somos' },
    { name: t('tours'), href: '/tours' },
    { name: t('contact'), href: '/contato' },
  ]

  React.useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      setScrolled(latest > 0.05)
    })
    return () => unsubscribe()
  }, [scrollYProgress])

  return (
    <header>
      <nav
        className={cn(
          "fixed z-50 w-full transition-all duration-300",
          scrolled ? "pt-0" : "pt-2"
        )}
      >
        <div
          className={cn(
            'mx-auto max-w-7xl px-5 transition-all duration-300 lg:px-12 lg:rounded-[28px]',
            scrolled
              ? [
                'bg-[#f7f8fa]/88 py-2 shadow-[0_12px_30px_rgba(16,32,51,0.08)] backdrop-blur-xl dark:bg-[#0b2233]/82',
                'border-b border-black/5 dark:border-white/10 lg:border lg:border-black/5 dark:lg:border-white/10',
              ].join(' ')
              : 'lg:bg-transparent'
          )}
        >
          <div className="relative flex items-center justify-between py-3 lg:py-4">
            <Link
              href="/"
              aria-label="Rick Travel - Página inicial"
              className="relative z-50 flex items-center"
            >
              <RickTravelLogo variant="full" size="sm" />
            </Link>

            <button
              onClick={() => setMenuOpen(true)}
              aria-label={t('openMenu')}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              className="touch-target relative z-50 rounded-lg text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:text-white/80 lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="hidden lg:flex lg:items-center lg:gap-8">
              <ul className="flex gap-7 text-sm font-medium">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="rounded-sm text-slate-700 transition-colors duration-200 hover:text-slate-950 dark:text-white/74 dark:hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-4 border-l border-light-border/90 pl-6 dark:border-white/10">
                <AuthStatus />
                <div className="flex items-center gap-2">
                  <ThemeToggleButton />
                  <LanguageSwitcher />
                </div>
              </div>
            </div>
          </div>
        </div>

        <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      </nav>
    </header>
  )
}
