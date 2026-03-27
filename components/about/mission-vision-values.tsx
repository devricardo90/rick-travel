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
        <section className="section-spacing-sm">
            <div className="mx-auto max-w-7xl px-5 lg:px-12">
                <div className="mx-auto mb-12 max-w-3xl text-center">
                    <div className="inline-flex rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#d8c18f]">
                        Princípios da operação
                    </div>
                    <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-white md:text-4xl">
                        Nossos princípios
                    </h2>
                    <p className="mt-4 text-[15px] leading-7 text-white/62">
                        O que orienta nosso atendimento, nossa forma de operar e a experiência entregue em cada passeio.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="rounded-[28px] border border-white/8 bg-[#0d2436] p-6 shadow-[0_18px_45px_rgba(0,0,0,0.18)] transition-colors duration-300 hover:bg-[#10283c]"
                        >
                            <div className="mb-5 h-1.5 w-10 rounded-full bg-[#d8c18f]/80" />

                            <h3 className="mb-4 text-xl font-semibold tracking-[-0.03em] text-white">
                                {t(`${item.id}.title`)}
                            </h3>

                            {item.id === 'values' ? (
                                <ul className="space-y-3">
                                    {['item1', 'item2', 'item3', 'item4'].map((val) => (
                                        <li key={val} className="flex items-start gap-3 text-sm leading-7 text-white/68">
                                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d8c18f]/80" />
                                            {t(`values.${val}`)}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm leading-7 text-white/68">
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
