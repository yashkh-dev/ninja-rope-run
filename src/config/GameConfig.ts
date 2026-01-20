// ============= GAME CONFIGURATION =============
// Dynamic scaling for any mobile screen size

// Helper to detect portrait mode
export const isPortrait = (): boolean => window.innerHeight > window.innerWidth;

// Get scale factor based on screen dimensions
const getScaleFactor = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const baseSize = 400; // Reference base for scaling
    const minDimension = Math.min(window.innerWidth, window.innerHeight) * dpr;
    return minDimension / baseSize;
};

// Dynamic config that adapts to any screen
export const getConfig = () => {
    const portrait = isPortrait();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth * dpr;
    const height = window.innerHeight * dpr;
    const scale = getScaleFactor();

    return {
        // === MOVEMENT (scaled) ===
        baseSpeed: 140 * scale,
        speedRampPerSecond: 1.5 * scale,
        maxSpeed: 350 * scale,
        gravityY: 900 * scale,

        // === GRAPPLE ===
        maxGrappleDistance: (portrait ? 320 : 380) * scale,
        minForwardDistance: 25 * scale,
        minRopeLength: 50 * scale,
        maxRopeLength: (portrait ? 280 : 320) * scale,
        ropeDamping: 0.997,
        ropeStiffness: 0.15,
        swingBoostOnRelease: 1.2,

        // === CAMERA ===
        cameraLookAhead: (portrait ? 100 : 160) * scale,
        playerScreenX: portrait ? 0.35 : 0.25,
        cameraSmoothX: 0.12,
        cameraSmoothY: 0.08,

        // === LEVEL GENERATION ===
        spawnAheadDistance: (portrait ? 800 : 1100) * scale,
        despawnBehindDistance: 600 * scale,
        platformMinLength: (portrait ? 140 : 180) * scale,
        platformMaxLength: (portrait ? 280 : 350) * scale,
        platformHeight: 35 * scale,
        gapMin: (portrait ? 100 : 140) * scale,
        gapMax: (portrait ? 180 : 260) * scale,
        hookHeightMin: (portrait ? 90 : 110) * scale,
        hookHeightMax: (portrait ? 180 : 220) * scale,
        hooksPerPlatformMin: 2,
        hooksPerPlatformMax: portrait ? 4 : 3,

        // === DIFFICULTY RAMP ===
        difficultyRampInterval: 15000,
        gapIncreasePerRamp: 20 * scale,
        speedIncreasePerRamp: 12 * scale,
        spikeChanceStart: 0.1,
        spikeChanceMax: 0.4,
        spikeChanceIncreasePerRamp: 0.04,

        // === COLLECTIBLES ===
        scrollValue: 100,
        distanceScoreMultiplier: 0.1 / scale,
        scrollSpawnChance: 0.7,

        // === BOUNDS ===
        killY: height + 100 * scale,
        groundY: height * (portrait ? 0.72 : 0.78),
        platformYVariation: 50 * scale,

        // === VISUALS (scaled) ===
        playerRadius: 16 * scale,
        hookRadius: 10 * scale,
        scrollSize: 18 * scale,
        spikeWidth: 28 * scale,
        spikeHeight: 24 * scale,
        ropeWidth: Math.max(2, 3 * scale),

        // === SCREEN INFO ===
        isPortrait: portrait,
        screenWidth: width,
        screenHeight: height,
        scaleFactor: scale,
        dpr: dpr
    };
};

// Static CONFIG
export let CONFIG = getConfig();

// Function to update config on resize
export const updateConfig = () => {
    CONFIG = getConfig();
    return CONFIG;
};

export type GameConfig = ReturnType<typeof getConfig>;
