// ============= GAME CONFIGURATION =============
// All tunable constants in one place for easy tweaking
// Now with dynamic scaling for portrait/landscape support

// Helper to detect portrait mode
export const isPortrait = (): boolean => window.innerHeight > window.innerWidth;

// Get scale factor based on screen size (base reference: 800x600)
export const getScaleFactor = (): number => {
    const baseSize = Math.min(800, 600);
    const currentSize = Math.min(window.innerWidth, window.innerHeight);
    return Math.max(0.5, Math.min(1.5, currentSize / baseSize));
};

// Dynamic config that adapts to screen orientation
export const getConfig = () => {
    const scale = getScaleFactor();
    const portrait = isPortrait();
    const width = window.innerWidth;
    const height = window.innerHeight;

    return {
        // === MOVEMENT ===
        baseSpeed: 140 * scale,              // Initial horizontal speed (px/s)
        speedRampPerSecond: 1.5,             // Speed increase per second
        maxSpeed: 380 * scale,               // Maximum horizontal speed
        gravityY: 1000 * scale,              // Gravity strength

        // === GRAPPLE ===
        maxGrappleDistance: (portrait ? 300 : 380) * scale,     // Max distance to attach to hook
        minForwardDistance: 25 * scale,      // Hook must be this far ahead of player
        minRopeLength: 50 * scale,           // Minimum rope length
        maxRopeLength: (portrait ? 250 : 300) * scale,          // Maximum rope length
        ropeDamping: 0.997,                  // Damping (closer to 1 = less damping, better swing)
        ropeStiffness: 0.15,                 // How quickly rope corrects distance
        swingBoostOnRelease: 1.2,            // Velocity multiplier on release

        // === CAMERA ===
        cameraLookAhead: (portrait ? 100 : 160) * scale,        // Camera leads player by this much
        playerScreenX: portrait ? 0.35 : 0.25,         // Player position (0-1 from left)
        cameraSmoothX: 0.12,                 // Camera lerp speed X
        cameraSmoothY: 0.08,                 // Camera lerp speed Y

        // === LEVEL GENERATION ===
        spawnAheadDistance: (portrait ? 800 : 1100) * scale,    // Spawn platforms this far ahead
        despawnBehindDistance: 600 * scale,  // Remove platforms this far behind
        platformMinLength: (portrait ? 120 : 180) * scale,      // Minimum platform width
        platformMaxLength: (portrait ? 250 : 350) * scale,      // Maximum platform width
        platformHeight: 40 * scale,          // Platform thickness
        gapMin: (portrait ? 100 : 140) * scale,                 // Minimum gap between platforms
        gapMax: (portrait ? 180 : 260) * scale,                 // Maximum gap between platforms
        hookHeightMin: (portrait ? 80 : 110) * scale,           // Min height above platform for hooks
        hookHeightMax: (portrait ? 160 : 220) * scale,          // Max height above platform for hooks
        hooksPerPlatformMin: portrait ? 2 : 2,      // Minimum hooks per platform
        hooksPerPlatformMax: portrait ? 4 : 3,      // Maximum hooks per platform (more hooks in portrait)

        // === DIFFICULTY RAMP ===
        difficultyRampInterval: 15000,       // Ms between difficulty increases
        gapIncreasePerRamp: 20 * scale,      // Gap increase per ramp
        speedIncreasePerRamp: 12 * scale,    // Speed increase per ramp
        spikeChanceStart: 0.1,               // Initial spike probability
        spikeChanceMax: 0.4,                 // Maximum spike probability
        spikeChanceIncreasePerRamp: 0.04,

        // === COLLECTIBLES ===
        scrollValue: 100,                    // Points per scroll
        distanceScoreMultiplier: 0.1,        // Points per pixel traveled
        scrollSpawnChance: 0.7,              // Chance to spawn scroll per platform

        // === BOUNDS (dynamic based on screen) ===
        killY: height + 100,                 // Y position that triggers death
        groundY: height * (portrait ? 0.75 : 0.8),              // Base ground level for platforms
        platformYVariation: 50 * scale,      // Random Y offset for platforms

        // === VISUALS ===
        playerRadius: 18 * scale,            // Player circle radius
        hookRadius: 10 * scale,              // Hook point radius
        scrollSize: 20 * scale,              // Scroll collectible size
        spikeWidth: 30 * scale,              // Spike base width
        spikeHeight: 25 * scale,             // Spike height

        // === SCREEN INFO ===
        isPortrait: portrait,
        screenWidth: width,
        screenHeight: height,
        scaleFactor: scale
    };
};

// Static CONFIG for backwards compatibility (will be updated on resize)
export let CONFIG = getConfig();

// Function to update config on resize
export const updateConfig = () => {
    CONFIG = getConfig();
    return CONFIG;
};

// Type export for TypeScript
export type GameConfig = ReturnType<typeof getConfig>;
