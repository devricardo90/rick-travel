'use client'

import { useTranslations } from 'next-intl'

const items = [
    { id: 'mission' },
    { id: 'vision' },
    { id: 'values' },
]

export function MissionVisionValues() {
    const t = useTranslations('AboutPage')

    return (
        <section className="py-16 md:py-24">
            {/* Separador visual sutil */}
            <div className="mx-auto max-w-6xl px-6">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.02em] text-white">
                        Nossos Princípios
                    </h2>
                    <p className="mt-3 text-white/60 text-base">
                        O que nos guia em cada experiência
                    </p>
                </div>

                <div className="grid gap-6 md:gap-8 md:grid-cols-3">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="surface-dark p-8 transition-all duration-300 hover:bg-white/[0.07]"
                        >
                            {/* Bullet verde decorativo */}
                            <div className="mb-4 h-1 w-8 rounded-full bg-emerald-500/70" />

                            <h3 className="text-xl font-semibold text-white mb-3">
                                {t(`${item.id}.title`)}
                            </h3>

                            {item.id === 'values' ? (
                                <ul className="space-y-2.5">
                                    {['item1', 'item2', 'item3', 'item4'].map((val) => (
                                        <li key={val} className="flex items-start gap-2.5 text-white/70 text-sm leading-relaxed">
                                            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500/70" />
                                            {t(`values.${val}`)}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-white/70 text-sm leading-relaxed">
                                    {t(`${item.id}.description`)}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
