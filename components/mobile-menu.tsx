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
    ShieldCheck,
    ChevronRight,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
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
                className="flex w-full items-center gap-3 rounded-2xl border border-border/50 bg-muted/40 px-4 py-3 text-left transition-all duration-200 hover:bg-primary/10 hover:border-primary/30"
            >
                {/* Ícone com cor primária */}
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
                    {icon}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{title}</p>
                    {hint && <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>}
                </div>
                <ChevronRight size={15} className="text-muted-foreground/50 shrink-0" />
            </Link>
        </div>
    );
}

/* ─── Main Component ─── */
export default function MobileMenu({ open, onClose }: Props) {
    const overlayRef = useRef<HTMLDivElement>(null);
    const sheetRef = useRef<HTMLDivElement>(null);
    const [user, setUser] = useState<SessionUser | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
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
                    window.location.href = "/";
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

            {/* Bottom Sheet — usa as cores do tema */}
            <div
                ref={sheetRef}
                className="fixed left-3 right-3 bottom-3 z-50 rounded-[26px] border border-border bg-background/95 p-4 opacity-0 shadow-2xl"
                style={{
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                }}
                role="dialog"
                aria-modal="true"
                aria-label="Menu de navegação"
            >
                {/* Handle */}
                <div className="flex justify-center mb-4">
                    <div className="h-1 w-10 rounded-full bg-muted-foreground/20" />
                </div>

                {/* Cabeçalho: saudação animada + botão fechar */}
                <div data-item className="flex items-center justify-between mb-4 px-1">
                    <div className="overflow-hidden">
                        {!authLoading && user ? (
                            <>
                                {/* Label em onda */}
                                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    <WaveText text="Bem-vindo de volta" />
                                </p>
                                {/* Nome em onda com cor primária */}
                                <p className="text-base font-bold text-foreground flex items-center gap-1">
                                    <WaveText text={`Olá, ${user.name ?? "usuário"}`} color="var(--primary)" />
                                    <span>👋</span>
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    <WaveText text="Rick Travel" />
                                </p>
                                <p className="text-base font-bold text-foreground">
                                    <WaveText text="Menu de navegação" />
                                </p>
                            </>
                        )}
                    </div>

                    <button
                        onClick={onClose}
                        className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-muted/50 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        aria-label="Fechar menu"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Separador */}
                <div className="mb-3 h-px bg-border/60" />

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
                <div className="my-3 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                {/* CTAs de auth */}
                {!authLoading && (
                    <>
                        {user ? (
                            /* ── Logado ── */
                            <div className="flex flex-col gap-2">
                                <div className="grid grid-cols-2 gap-2">
                                    {/* Minhas Reservas — cor primária */}
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

                                    {/* Sair — outline */}
                                    <button
                                        data-item
                                        onClick={logout}
                                        onPointerDown={(e) => pressIn(e.currentTarget)}
                                        onPointerUp={(e) => pressOut(e.currentTarget)}
                                        className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
                                    >
                                        <LogOut size={15} />
                                        Sair
                                    </button>
                                </div>

                                {/* Admin */}
                                {user.role === "ADMIN" && (
                                    <Link
                                        data-item
                                        href="/admin"
                                        onClick={onClose}
                                        className="flex items-center justify-center gap-2 rounded-2xl border border-primary/30 bg-primary/10 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary/15"
                                    >
                                        <ShieldCheck size={15} />
                                        Painel Admin
                                    </Link>
                                )}
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
                                    className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:bg-muted"
                                >
                                    <UserPlus size={15} />
                                    Criar conta
                                </Link>
                            </div>
                        )}
                    </>
                )}

                {/* Tema e Idioma */}
                <div className="mt-3 flex items-center justify-center gap-3 rounded-2xl border border-border/60 bg-muted/30 px-5 py-2.5">
                    <ThemeToggleButton />
                    <div className="h-4 w-px bg-border" />
                    <LanguageSwitcher />
                </div>
            </div>
        </>
    );
}
