'use client';

import { Link } from '@/i18n/routing'
import { RickTravelLogo } from '@/components/rick-travel-logo'
import { Menu, X } from 'lucide-react'
import React from 'react'
import { useScroll, motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'
import { ThemeToggleButton } from './ThemeToggleButton'
import { AuthStatus } from '@/components/auth-status'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useTranslations } from 'next-intl'

export const HeroHeader = () => {
  const [menuState, setMenuState] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)
  const { scrollYProgress } = useScroll()
  const t = useTranslations('Navigation')

  // Lock body scroll when menu is open
  React.useEffect(() => {
    if (menuState) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [menuState])

  React.useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      setScrolled(latest > 0.05)
    })
    return () => unsubscribe()
  }, [scrollYProgress])

  const menuItems = [
    { name: t('home'), href: '/' },
    { name: t('about'), href: '/quem-somos' },
    { name: t('tours'), href: '/tours' },
    { name: t('contact'), href: '/contato' },
  ]

  return (
    <header>
      <nav
        data-state={menuState && 'active'}
        className={cn(
          "fixed z-50 w-full transition-all duration-300",
          scrolled ? "pt-0" : "pt-2"
        )}
      >
        <div
          className={cn(
            'mx-auto max-w-7xl px-6 transition-all duration-300 lg:px-12 lg:rounded-3xl',
            scrolled ? 'bg-background/80 backdrop-blur-md border-b lg:border-none lg:shadow-sm py-2' : 'lg:bg-transparent'
          )}
        >
          <div className="relative flex items-center justify-between py-3 lg:py-4">
            <Link
              href="/"
              aria-label="Rick Travel - Página inicial"
              className="relative z-50 flex items-center"
              onClick={() => setMenuState(false)}
            >
              <RickTravelLogo variant="full" size="sm" />
            </Link>

            <button
              onClick={() => setMenuState(!menuState)}
              aria-label={menuState ? t('closeMenu') : t('openMenu')}
              aria-expanded={menuState}
              aria-controls="mobile-navigation"
              className="touch-target relative z-50 lg:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-lg"
            >
              <div className="relative h-6 w-6">
                <motion.div
                  animate={menuState ? { rotate: 180, opacity: 0 } : { rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0"
                >
                  <Menu className="h-6 w-6" />
                </motion.div>
                <motion.div
                  initial={{ rotate: -180, opacity: 0 }}
                  animate={menuState ? { rotate: 0, opacity: 1 } : { rotate: -180, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0"
                >
                  <X className="h-6 w-6" />
                </motion.div>
              </div>
            </button>

            {/* Desktop Menu */}
            <div className="hidden lg:flex lg:items-center lg:gap-8">
              <ul className="flex gap-8 text-sm font-medium">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="text-muted-foreground hover:text-primary transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary rounded-sm"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-4 border-l pl-6">
                <AuthStatus />
                <div className="flex items-center gap-2">
                  <ThemeToggleButton />
                  <LanguageSwitcher />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Fullscreen Menu */}
        <AnimatePresence>
          {menuState && (
            <motion.div
              id="mobile-navigation"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 flex flex-col bg-background/98 backdrop-blur-xl lg:hidden"
            >
              <div className="flex flex-1 flex-col items-center justify-center space-y-8 px-6 pt-20">
                <ul className="flex flex-col items-center space-y-6 text-center">
                  {menuItems.map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMenuState(false)}
                        className="block py-2 text-3xl font-bold tracking-tight text-foreground/90 hover:text-primary active:scale-95 transition-all focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary rounded-md"
                      >
                        {item.name}
                      </Link>
                    </motion.li>
                  ))}
                </ul>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col items-center gap-6 pt-8"
                >
                  <div className="w-full h-px bg-border/50 max-w-[200px]" />
                  <AuthStatus />
                  <div className="flex items-center gap-6">
                    <div className="scale-125">
                      <ThemeToggleButton />
                    </div>
                    <div className="scale-125">
                      <LanguageSwitcher />
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
