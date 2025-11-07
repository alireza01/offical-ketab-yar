/**
 * Physics Page Turn Configuration
 * Agent 2 (Performance): Optimized for 60fps
 * Agent 3 (Psychology): Tuned for natural feel
 */

export const PHYSICS_CONFIG = {
    // Spring physics parameters
    spring: {
        tension: 280,
        friction: 60,
        mass: 1,
        clamp: false,
    },

    // Gesture thresholds
    gesture: {
        flipThreshold: 0.5, // 50% of screen width
        velocityThreshold: 0.5, // Minimum velocity for quick flip
        dragThreshold: 10, // Minimum drag distance to start
    },

    // Animation timing
    timing: {
        animationDuration: 600, // ms
        snapBackDuration: 300, // ms
        shadowTransition: 100, // ms
    },

    // Visual parameters
    visual: {
        maxRotation: 180, // degrees
        shadowBlur: 20, // px
        shadowSpread: 10, // px
        curlIntensity: 0.3, // 0-1
    },

    // Performance
    performance: {
        throttleInterval: 16, // ms (60fps)
        enableGPU: true,
        enableHaptics: true,
    },

    // Theme-specific shadow intensities - EXACT COLORS FROM READER
    themes: {
        light: {
            // Light mode: #faf8f3 background, #2a2a2a text
            backgroundColor: '#faf8f3',
            textColor: '#2a2a2a',
            shadowOpacity: 0.15,
            highlightOpacity: 0.8,
            curlShadowStart: 0.05,
            curlShadowMid: 0.15,
            curlHighlight: 0.3,
            shadowColor: 'rgba(0, 0, 0, 0.15)',
            highlightColor: 'rgba(255, 255, 255, 0.8)',
        },
        sepia: {
            // SEPIA MODE - DEFAULT & MOST SPECIAL: #f4ecd8 background, #5f4b32 text
            backgroundColor: '#f4ecd8',
            textColor: '#5f4b32',
            shadowOpacity: 0.2,
            highlightOpacity: 0.7,
            curlShadowStart: 0.08,
            curlShadowMid: 0.18,
            curlHighlight: 0.4,
            shadowColor: 'rgba(95, 75, 50, 0.2)',
            highlightColor: 'rgba(255, 250, 230, 0.7)',
        },
        dark: {
            // Dark mode: #0f0e0c background, #f5f5f5 text
            backgroundColor: '#0f0e0c',
            textColor: '#f5f5f5',
            shadowOpacity: 0.6,
            highlightOpacity: 0.3,
            curlShadowStart: 0.3,
            curlShadowMid: 0.5,
            curlHighlight: 0.2,
            shadowColor: 'rgba(0, 0, 0, 0.6)',
            highlightColor: 'rgba(212, 175, 55, 0.3)',
        },
    },
} as const

export type PhysicsTheme = keyof typeof PHYSICS_CONFIG.themes
