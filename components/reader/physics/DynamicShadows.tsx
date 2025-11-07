'use client'

import { useMemo } from 'react'
import { PHYSICS_CONFIG, type PhysicsTheme } from './physics-config'

interface DynamicShadowsProps {
    curlProgress: number
    theme: PhysicsTheme
    direction: 'next' | 'prev'
}

export function DynamicShadows({ curlProgress, theme, direction }: DynamicShadowsProps) {
    const themeConfig = PHYSICS_CONFIG.themes[theme]

    const shadowStyle = useMemo(() => {
        const intensity = curlProgress * themeConfig.shadowOpacity
        const gradientDirection = direction === 'next' ? 'to left' : 'to right'
        const gradientStart = direction === 'next' ? 100 - curlProgress * 100 : curlProgress * 100

        // Use theme-specific shadow color
        const shadowColor =
            theme === 'sepia'
                ? `rgba(95, 75, 50, ${intensity})`
                : theme === 'dark'
                    ? `rgba(0, 0, 0, ${intensity})`
                    : `rgba(0, 0, 0, ${intensity})`

        return {
            background: `linear-gradient(
        ${gradientDirection},
        transparent ${gradientStart}%,
        ${shadowColor} 100%
      )`,
            transition: `background ${PHYSICS_CONFIG.timing.shadowTransition}ms ease-out`,
        }
    }, [curlProgress, theme, direction, themeConfig])

    const curlGradientStyle = useMemo(() => {
        const { curlShadowStart, curlShadowMid, curlHighlight } = themeConfig

        // Theme-specific curl gradient colors
        const curlColors = {
            light: {
                start: `rgba(0, 0, 0, ${curlShadowStart})`,
                mid: `rgba(0, 0, 0, ${curlShadowMid})`,
                highlight: `rgba(255, 255, 255, ${curlHighlight})`,
            },
            sepia: {
                start: `rgba(95, 75, 50, ${curlShadowStart})`,
                mid: `rgba(95, 75, 50, ${curlShadowMid})`,
                highlight: `rgba(255, 250, 230, ${curlHighlight})`,
            },
            dark: {
                start: `rgba(0, 0, 0, ${curlShadowStart})`,
                mid: `rgba(0, 0, 0, ${curlShadowMid})`,
                highlight: `rgba(212, 175, 55, ${curlHighlight})`,
            },
        }

        const colors = curlColors[theme]

        return {
            background: `linear-gradient(
        90deg,
        ${colors.start} 0%,
        ${colors.mid} 50%,
        ${colors.highlight} 100%
      )`,
            opacity: curlProgress * PHYSICS_CONFIG.visual.curlIntensity,
        }
    }, [curlProgress, theme, themeConfig])

    return (
        <>
            {/* Shadow on back page */}
            <div className="physics-shadow-layer" style={shadowStyle} />

            {/* Curl gradient on turning page */}
            <div className="physics-curl-gradient" style={curlGradientStyle} />
        </>
    )
}
