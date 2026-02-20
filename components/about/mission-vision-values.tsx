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
        <section className="py-16 md:py-24 bg-zinc-50 dark:bg-zinc-900/30">
            <div className="mx-auto max-w-6xl px-6">
                <div className="grid gap-8 md:grid-cols-3">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white dark:bg-background rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <h3 className="text-xl font-semibold mb-3 text-foreground">{t(`${item.id}.title`)}</h3>

                            {item.id === 'values' ? (
                                <ul className="text-sm list-disc list-inside text-muted-foreground space-y-2">
                                    <li>{t('values.item1')}</li>
                                    <li>{t('values.item2')}</li>
                                    <li>{t('values.item3')}</li>
                                    <li>{t('values.item4')}</li>
                                </ul>
                            ) : (
                                <p className="text-sm text-muted-foreground leading-relaxed">
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
