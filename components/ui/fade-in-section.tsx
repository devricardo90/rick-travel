'use client';

import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface FadeInSectionProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
}

/**
 * Componente wrapper que aplica animação fade-in ao entrar no viewport
 * Respeita automaticamente a preferência de movimento reduzido do usuário
 */
export function FadeInSection({
    children,
    className,
    delay = 0,
    duration = 0.6
}: FadeInSectionProps) {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
                duration,
                delay,
                ease: [0.25, 0.1, 0.25, 1] // Custom cubic-bezier easing
            }}
        >
            {children}
        </motion.div>
    );
}
