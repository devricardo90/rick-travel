import React from 'react'
import { SVGProps } from 'react'

interface TourismIconProps extends SVGProps<SVGSVGElement> {
    height?: number
}

/**
 * Ícone de Entretenimentos
 * Representa atividades de lazer e entretenimento (máscara de teatro)
 */
export function EntretenimentosIcon({ height = 20, ...props }: TourismIconProps) {
    const width = (height * 24) / 20
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
            className={props.className}
        >
            {/* Máscara de teatro/entretenimento */}
            <path
                d="M12 2C8 2 4 4 4 8C4 10 5.5 11.5 7 12L7 16C7 17.5 8.5 19 10 19H14C15.5 19 17 17.5 17 16V12C18.5 11.5 20 10 20 8C20 4 16 2 12 2Z"
                fill="currentColor"
                fillOpacity="1"
            />
            {/* Olhos */}
            <ellipse cx="9" cy="8" rx="1.5" ry="1.8" fill="currentColor" fillOpacity="0.3" />
            <ellipse cx="15" cy="8" rx="1.5" ry="1.8" fill="currentColor" fillOpacity="0.3" />
            {/* Sorriso */}
            <path
                d="M10 11Q12 13 14 11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
                strokeOpacity="0.6"
            />
        </svg>
    )
}

/**
 * Ícone de Visitações
 * Representa pontos turísticos e monumentos (obelisco/monumento)
 */
export function VisitacoesIcon({ height = 20, ...props }: TourismIconProps) {
    const width = (height * 24) / 20
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
            className={props.className}
        >
            {/* Monumento/ponto turístico */}
            <rect x="9" y="8" width="6" height="8" fill="currentColor" fillOpacity="1" />
            <polygon points="6,8 12,2 18,8" fill="currentColor" fillOpacity="1" />
            {/* Base */}
            <rect x="7" y="16" width="10" height="2" rx="1" fill="currentColor" fillOpacity="1" />
            {/* Porta/entrada */}
            <rect x="10.5" y="11" width="3" height="4" rx="0.5" fill="currentColor" fillOpacity="0.3" />
        </svg>
    )
}

/**
 * Ícone de Atividades Esportivas
 * Representa esportes e atividades físicas (futebol/volei)
 */
export function AtividadesEsportivasIcon({ height = 20, ...props }: TourismIconProps) {
    const width = (height * 24) / 20
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
            className={props.className}
        >
            {/* Bola esportiva */}
            <circle cx="12" cy="10" r="6" fill="currentColor" fillOpacity="1" />
            {/* Linhas da bola (padrão hexágono) */}
            <path
                d="M12 4 L15.5 7 L15.5 13 L12 16 L8.5 13 L8.5 7 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.8"
                strokeOpacity="0.3"
            />
            <path
                d="M6 10 L18 10 M12 4 L12 16"
                stroke="currentColor"
                strokeWidth="0.8"
                strokeOpacity="0.3"
                strokeLinecap="round"
            />
        </svg>
    )
}

/**
 * Ícone de Tours Guiados
 * Representa passeios guiados e grupos turísticos (guia com bandeira e turistas)
 */
export function ToursGuiadosIcon({ height = 20, ...props }: TourismIconProps) {
    const width = (height * 30) / 20
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 30 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
            className={props.className}
        >
            {/* Guia com bandeira */}
            <circle cx="10" cy="8" r="3.5" fill="currentColor" fillOpacity="1" />
            <rect x="7" y="11.5" width="6" height="5" rx="1" fill="currentColor" fillOpacity="1" />
            {/* Bandeira/megafone do guia */}
            <path
                d="M14 5.5 L14 13.5 L20.5 9.5 Z"
                fill="currentColor"
                fillOpacity="1"
            />
            <line x1="14" y1="9.5" x2="14" y2="11.5" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.4" />
            {/* Grupo de turistas */}
            <circle cx="23" cy="9.5" r="2.8" fill="currentColor" fillOpacity="0.75" />
            <circle cx="26.5" cy="11.5" r="2.3" fill="currentColor" fillOpacity="0.75" />
            <rect x="21" y="12.5" width="5" height="4" rx="0.5" fill="currentColor" fillOpacity="0.75" />
            <rect x="24.5" y="13.5" width="4" height="3.5" rx="0.5" fill="currentColor" fillOpacity="0.75" />
        </svg>
    )
}

/**
 * Ícone de Turismo Urbano
 * Representa cidade e pontos urbanos (skyline de edifícios)
 */
export function TurismoUrbanoIcon({ height = 20, ...props }: TourismIconProps) {
    const width = (height * 30) / 20
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 30 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
            className={props.className}
        >
            {/* Skyline de edifícios */}
            <rect x="2" y="13" width="3.5" height="5" rx="0.5" fill="currentColor" fillOpacity="1" />
            <rect x="6.5" y="11" width="3.5" height="7" rx="0.5" fill="currentColor" fillOpacity="1" />
            <rect x="11" y="9" width="3.5" height="9" rx="0.5" fill="currentColor" fillOpacity="1" />
            <rect x="15.5" y="12" width="3.5" height="6" rx="0.5" fill="currentColor" fillOpacity="1" />
            <rect x="20" y="10" width="3.5" height="8" rx="0.5" fill="currentColor" fillOpacity="1" />
            <rect x="24.5" y="8" width="3.5" height="10" rx="0.5" fill="currentColor" fillOpacity="1" />
            {/* Janelas iluminadas */}
            <rect x="3" y="14.5" width="1" height="1.2" rx="0.2" fill="currentColor" fillOpacity="0.3" />
            <rect x="7.5" y="12.5" width="1" height="1.2" rx="0.2" fill="currentColor" fillOpacity="0.3" />
            <rect x="12" y="10.5" width="1" height="1.2" rx="0.2" fill="currentColor" fillOpacity="0.3" />
            <rect x="16.5" y="13.5" width="1" height="1.2" rx="0.2" fill="currentColor" fillOpacity="0.3" />
            <rect x="21" y="11.5" width="1" height="1.2" rx="0.2" fill="currentColor" fillOpacity="0.3" />
            <rect x="25.5" y="9.5" width="1" height="1.2" rx="0.2" fill="currentColor" fillOpacity="0.3" />
        </svg>
    )
}

