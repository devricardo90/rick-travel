import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Rick Travel — City Tour no Rio",
  description: "Guia credenciado Cadastur. PT/EN/ES.",
  authors: [{ name: "Rick Travel" }],
  keywords: ["turismo", "rio de janeiro", "city tour", "cadastur", "guia turístico"],
  openGraph: {
    title: "Rick Travel — City Tour no Rio",
    description: "Guia credenciado Cadastur. PT/EN/ES.",
    locale: "pt_BR",
    type: "website",
     title: 'Rick Travel | City Tour no Rio de Janeiro',
    description:
      'Descubra o Rio de Janeiro com passeios exclusivos e guias credenciados.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'City Tour no Rio de Janeiro - Rick Travel',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rick Travel | City Tour no Rio',
    description:
      'Passeios exclusivos no Rio de Janeiro com guias credenciados.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

interface RootLayoutProps {
  readonly children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}