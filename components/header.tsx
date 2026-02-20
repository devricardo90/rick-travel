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

// Carrega o MobileMenu apenas no cliente (usa GSAP e refs)
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
            'mx-auto max-w-7xl px-6 transition-all duration-300 lg:px-12 lg:rounded-3xl',
            scrolled
              ? [
                // Light scrolled: branco glass premium
                'bg-white/80 backdrop-blur-xl border-b border-black/5 shadow-[0_10px_25px_rgba(15,23,42,0.08)] py-2',
                // Dark scrolled: navy glass
                'dark:bg-navy-900/80 dark:border-white/10 dark:shadow-[0_10px_25px_rgba(0,0,0,0.25)]',
                'lg:border-b-0 lg:border lg:border-black/5 dark:lg:border-white/10',
              ].join(' ')
              : 'lg:bg-transparent'
          )}
        >
          <div className="relative flex items-center justify-between py-3 lg:py-4">
            {/* Logo */}
            <Link
              href="/"
              aria-label="Rick Travel - Página inicial"
              className="relative z-50 flex items-center"
            >
              <RickTravelLogo variant="full" size="sm" />
            </Link>

            {/* Botão hamburguer mobile */}
            <button
              onClick={() => setMenuOpen(true)}
              aria-label={t('openMenu')}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              className="touch-target relative z-50 lg:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-lg text-slate-700 dark:text-white/80"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Desktop Menu */}
            <div className="hidden lg:flex lg:items-center lg:gap-8">
              <ul className="flex gap-8 text-sm font-medium">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="text-slate-600 hover:text-slate-900 dark:text-white/75 dark:hover:text-white transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary rounded-sm"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-4 border-l border-light-border dark:border-white/10 pl-6">
                <AuthStatus />
                <div className="flex items-center gap-2">
                  <ThemeToggleButton />
                  <LanguageSwitcher />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sheet Menu Mobile */}
        <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      </nav>
    </header>
  )
}
