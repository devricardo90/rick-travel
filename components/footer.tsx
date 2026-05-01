"use client";

import { useTranslations } from "next-intl";

import { RickTravelLogo } from "@/components/rick-travel-logo";
import { Link } from "@/i18n/routing";

export default function FooterSection() {
    const t = useTranslations("Footer");

    const columns = [
        {
            title: "Empresa",
            links: [
                { label: t("links.home"), href: "/" },
                { label: t("links.about"), href: "/quem-somos" },
            ],
        },
        {
            title: "Servicos",
            links: [{ label: "Tours", href: "/tours" }],
        },
        {
            title: "Suporte",
            links: [
                { label: t("links.help"), href: "/contato" },
                { label: "Reservas", href: "/reservas" },
            ],
        },
    ];

    return (
        <footer className="border-t border-white/8 bg-[#071826] py-14 md:py-18">
            <div className="mx-auto max-w-6xl px-5 lg:px-6">
                <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" aria-label="Rick Travel - Pagina inicial" className="block w-fit">
                            <RickTravelLogo variant="full" size="md" />
                        </Link>
                        <p className="mt-4 max-w-[260px] text-sm leading-7 text-white/62">
                            Experiencias no Rio de Janeiro com operacao mais clara, segura e personalizada.
                        </p>
                    </div>

                    {columns.map((column) => (
                        <div key={column.title}>
                            <h3 className="mb-4 text-sm font-semibold text-white">{column.title}</h3>
                            <ul className="space-y-3">
                                {column.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-white/58 transition-colors duration-150 hover:text-white"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="my-10 border-t border-white/8" />

                <div className="flex items-center justify-center">
                    <span className="text-center text-sm text-white/50">
                        &copy; {new Date().getFullYear()} <strong className="text-white">Rick Travel</strong>. {t("copyright")}
                    </span>
                </div>
            </div>
        </footer>
    );
}
