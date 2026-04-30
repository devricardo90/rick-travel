"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
    X,
    Home,
    Users,
    Map,
    Phone,
    LogOut,
    Ticket,
    LogIn,
    UserPlus,
    ChevronRight,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { ThemeToggleButton } from "./ThemeToggleButton";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { authClient } from "@/lib/auth-client";

/* ─── Types ─── */
type SessionUser = {
    id: string;
    name: string | null;
    email: string;
    role?: "USER" | "ADMIN";
};

type Props = {
    open: boolean;
    onClose: () => void;
};

/* ─── WaveText: cada letra flutua em onda contínua com GSAP ─── */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function WaveText({
    text,
    className = "",
    color = "inherit",
}: {
    text: string;
    className?: string;
    color?: string;
}) {
    const containerRef = useRef<HTMLSpanElement>(null);
    const tlRef = useRef<gsap.core.Timeline | null>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const spans = container.querySelectorAll<HTMLSpanElement>("[data-char]");

        // Mata timeline anterior para evitar acúmulo
        tlRef.current?.kill();

        tlRef.current = gsap.timeline({ repeat: -1 });

        tlRef.current.to(spans, {
            y: -5,
            duration: 0.4,
            ease: "sine.inOut",
            stagger: {
                each: 0.07,
                yoyo: true,
                repeat: 1,
            },
        });

        return () => {
            tlRef.current?.kill();
        };
    }, [text]);

    return (
        <span ref={containerRef} className={`inline-flex flex-wrap ${className}`} aria-label={text}>
            {text.split("").map((char, i) => (
                <span
                    key={i}
                    data-char
                    style={{
                        display: "inline-block",
                        color,
                        // espaço preservado
                        whiteSpace: char === " " ? "pre" : "normal",
                    }}
                >
                    {char === " " ? "\u00A0" : char}
                </span>
            ))}
        </span>
    );
}

/* ─── Nav items ─── */
function useNavItems() {
    const t = useTranslations("Navigation");
    return [
        { href: "/", icon: <Home size={17} />, title: t("home"), hint: "Página inicial" },
        { href: "/quem-somos", icon: <Users size={17} />, title: t("about"), hint: "Sobre a agência" },
        { href: "/tours", icon: <Map size={17} />, title: t("tours"), hint: "Destinos e pacotes" },
        { href: "/contato", icon: <Phone size={17} />, title: t("contact"), hint: "Suporte e contato" },
    ];
}

/* ─── Item de menu ─── */
function MenuItem({
    icon,
    title,
    hint,
    href,
    onClose,
}: {
    icon: React.ReactNode;
    title: string;
    hint?: string;
    href: string;
    onClose: () => void;
}) {
    const wrapRef = useRef<HTMLDivElement>(null);
    const pressIn = () => wrapRef.current && gsap.to(wrapRef.current, { scale: 0.975, duration: 0.08 });
    const pressOut = () =>
        wrapRef.current && gsap.to(wrapRef.current, { scale: 1, duration: 0.14, ease: "power2.out" });

    return (
        <div
            ref={wrapRef}
            data-item
            onPointerDown={pressIn}
            onPointerUp={pressOut}
            onPointerLeave={pressOut}
        >
            <Link
                href={href}
                onClick={onClose}
                className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left transition-all duration-200 hover:bg-white/10"
            >
                {/* Ícone neutro glass */}
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/5 border border-white/10 text-white/80">
                    {icon}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white tracking-[-0.01em]">{title}</p>
                    {hint && <p className="text-xs text-white/50 mt-0.5">{hint}</p>}
                </div>
                <ChevronRight size={15} className="text-white/30 shrink-0" />
            </Link>
        </div>
    );
}

/* ─── HelloHeader (bloco de saudação premium) ─── */
function HelloHeader({
    name,
    subtitle = "Bem-vindo ao Rick Travel",
    onClose,
}: {
    name: string;
    subtitle?: string;
    onClose: () => void;
}) {
    // Iniciais do avatar
    const initials = name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl px-4 py-4 mb-3">
            {/* Barra verde decorativa (micro-acento premium) */}
            <div className="mb-3 h-1 w-8 rounded-full bg-emerald-500/70" />

            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    {/* Label estilo referência */}
                    <p className="text-[11px] font-semibold tracking-[0.18em] text-white/55 uppercase">
                        Bem-vindo de volta
                    </p>

                    {/* Avatar + Nome */}
                    <div className="mt-2 flex items-center gap-2.5">
                        {/* Avatar com iniciais */}
                        <div className="h-9 w-9 shrink-0 rounded-full border border-white/10 bg-white/10 grid place-items-center">
                            <span className="text-xs font-bold text-white/80">{initials}</span>
                        </div>

                        <div className="min-w-0">
                            <h2 className="truncate text-base font-semibold tracking-[-0.02em] text-white">
                                Olá, {name} <span className="text-white/80">👋</span>
                            </h2>
                            <p className="truncate text-xs text-white/55">{subtitle}</p>
                        </div>
                    </div>
                </div>

                {/* Botão fechar premium */}
                <button
                    type="button"
                    onClick={onClose}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white/90"
                    aria-label="Fechar menu"
                >
                    <X size={14} />
                </button>
            </div>
        </div>
    );
}

/* ─── GuestHeader (cabeçalho para visitante não autenticado) ─── */
function GuestHeader({ onClose }: { onClose: () => void }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl px-4 py-4 mb-3">
            <div className="flex items-center justify-between">
                <div className="min-w-0">
                    <p className="text-[11px] font-semibold tracking-[0.18em] text-white/55 uppercase">
                        Rick Travel
                    </p>
                    <p className="mt-0.5 text-base font-semibold tracking-[-0.02em] text-white">
                        Navegação
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white/90"
                    aria-label="Fechar menu"
                >
                    <X size={14} />
                </button>
            </div>
        </div>
    );
}

/* ─── Main Component ─── */
export default function MobileMenu({ open, onClose }: Props) {
    const overlayRef = useRef<HTMLDivElement>(null);
    const sheetRef = useRef<HTMLDivElement>(null);
    const [user, setUser] = useState<SessionUser | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const locale = useLocale();
    const navItems = useNavItems();

    /* Carrega sessão ao abrir */
    useEffect(() => {
        if (!open) return;
        async function loadSession() {
            try {
                const res = await fetch("/api/auth/get-session", {
                    credentials: "include",
                    cache: "no-store",
                });
                const data = await res.json();
                setUser(data?.session?.user ?? null);
            } catch {
                setUser(null);
            } finally {
                setAuthLoading(false);
            }
        }
        loadSession();
    }, [open]);

    /* GSAP animations */
    useEffect(() => {
        const overlay = overlayRef.current;
        const sheet = sheetRef.current;
        if (!overlay || !sheet) return;

        const items = sheet.querySelectorAll("[data-item]");

        if (open) {
            overlay.style.pointerEvents = "auto";
            sheet.style.pointerEvents = "auto";
            gsap.to(overlay, { opacity: 1, duration: 0.22, ease: "power2.out" });
            gsap.fromTo(
                sheet,
                { y: 52, opacity: 0, scale: 0.97 },
                { y: 0, opacity: 1, scale: 1, duration: 0.38, ease: "power3.out" }
            );
            gsap.fromTo(
                items,
                { y: 14, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.3, ease: "power3.out", stagger: 0.055, delay: 0.1 }
            );
        } else {
            overlay.style.pointerEvents = "none";
            sheet.style.pointerEvents = "none";
            gsap.to(overlay, { opacity: 0, duration: 0.16, ease: "power2.inOut" });
            gsap.to(sheet, { y: 28, opacity: 0, scale: 0.98, duration: 0.2, ease: "power2.in" });
        }
    }, [open]);

    /* Logout */
    async function logout() {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    onClose();
                    window.location.href = `/${locale}`;
                },
            },
        });
    }

    /* Press feedback para botões */
    const pressIn = (el: HTMLElement) => gsap.to(el, { scale: 0.96, duration: 0.08 });
    const pressOut = (el: HTMLElement) =>
        gsap.to(el, { scale: 1, duration: 0.14, ease: "power2.out" });

    return (
        <>
            {/* Overlay com blur */}
            <div
                ref={overlayRef}
                onClick={onClose}
                className="fixed inset-0 z-40 bg-background/60 opacity-0"
                style={{
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    pointerEvents: "none",
                }}
                aria-hidden={!open}
            />

            {/* Bottom Sheet — tema escuro premium */}
            <div
                ref={sheetRef}
                className="fixed left-3 right-3 bottom-3 z-50 rounded-[26px] border border-white/10 p-4 opacity-0 shadow-2xl pointer-events-none"
                style={{
                    background: "rgba(7, 26, 43, 0.96)",
                    backdropFilter: "blur(24px)",
                    WebkitBackdropFilter: "blur(24px)",
                }}
                role="dialog"
                aria-modal="true"
                aria-label="Menu de navegação"
            >
                {/* Handle */}
                <div className="flex justify-center mb-3">
                    <div className="h-1 w-8 rounded-full bg-white/15" />
                </div>

                {/* HelloHeader / GuestHeader */}
                <div data-item>
                    {!authLoading && user ? (
                        <HelloHeader
                            name={user.name ?? "Usuário"}
                            subtitle="Pronto para explorar o Rio?"
                            onClose={onClose}
                        />
                    ) : (
                        <GuestHeader onClose={onClose} />
                    )}
                </div>

                {/* Itens de navegação */}
                <nav className="flex flex-col gap-1.5">
                    {navItems.map((item) => (
                        <MenuItem
                            key={item.href}
                            href={item.href}
                            icon={item.icon}
                            title={item.title}
                            hint={item.hint}
                            onClose={onClose}
                        />
                    ))}
                </nav>

                {/* Separador */}
                <div className="my-3 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* CTAs de auth */}
                {!authLoading && (
                    <>
                        {user ? (
                            /* ── Logado ── */
                            <div className="flex flex-col gap-2">
                                <div className="grid grid-cols-2 gap-2">
                                    {/* Minhas Reservas — verde = CTA principal */}
                                    <Link
                                        data-item
                                        href="/reservas"
                                        onClick={onClose}
                                        onPointerDown={(e) => pressIn(e.currentTarget)}
                                        onPointerUp={(e) => pressOut(e.currentTarget)}
                                        className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
                                    >
                                        <Ticket size={15} />
                                        Minhas reservas
                                    </Link>

                                    {/* Sair — ghost discreta */}
                                    <button
                                        data-item
                                        onClick={logout}
                                        onPointerDown={(e) => pressIn(e.currentTarget)}
                                        onPointerUp={(e) => pressOut(e.currentTarget)}
                                        className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/70 transition-all hover:bg-white/10 hover:text-white"
                                    >
                                        <LogOut size={15} />
                                        Sair
                                    </button>
                                </div>

                                {/* Admin — ghost, sem verde */}
                                {/* {user.role === "ADMIN" && (
                                    <Link
                                        data-item
                                        href="/admin"
                                        onClick={onClose}
                                        className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                                    >
                                        <ShieldCheck size={15} />
                                        Painel Admin
                                    </Link>
                                )} */}
                            </div>
                        ) : (
                            /* ── Deslogado ── */
                            <div className="grid grid-cols-2 gap-2">
                                <Link
                                    data-item
                                    href="/login"
                                    onClick={onClose}
                                    onPointerDown={(e) => pressIn(e.currentTarget)}
                                    onPointerUp={(e) => pressOut(e.currentTarget)}
                                    className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
                                >
                                    <LogIn size={15} />
                                    Login
                                </Link>

                                <Link
                                    data-item
                                    href="/register"
                                    onClick={onClose}
                                    onPointerDown={(e) => pressIn(e.currentTarget)}
                                    onPointerUp={(e) => pressOut(e.currentTarget)}
                                    className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/70 transition-all hover:bg-white/10 hover:text-white"
                                >
                                    <UserPlus size={15} />
                                    Criar conta
                                </Link>
                            </div>
                        )}
                    </>
                )}

                {/* Tema e Idioma */}
                <div className="mt-3 flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-2.5">
                    <ThemeToggleButton />
                    <div className="h-4 w-px bg-white/10" />
                    <LanguageSwitcher />
                </div>
            </div>
        </>
    );
}
