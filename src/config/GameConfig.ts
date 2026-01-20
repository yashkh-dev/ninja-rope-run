// ============= GAME CONFIGURATION =============
// Optimized for 1080p portrait mobile display (sharp visuals)

// Helper to detect portrait mode
export const isPortrait = (): boolean => window.innerHeight > window.innerWidth;

// Get game dimensions (1080p base for sharp rendering)
export const getGameDimensions = () => {
    if (isPortrait()) {
        const aspectRatio = window.innerHeight / window.innerWidth;
        return { width: 1080, height: Math.round(1080 * aspectRatio) };
    }
    return { width: 1920, height: 1080 };
};

// Dynamic config that adapts to screen orientation
export const getConfig = () => {
    const dims = getGameDimensions();
    const portrait = isPortrait();
    const width = dims.width;
    const height = dims.height;

    return {
        // === MOVEMENT ===
        baseSpeed: 200,                      // Initial horizontal speed (px/s)
        speedRampPerSecond: 2,               // Speed increase per second
        maxSpeed: 500,                       // Maximum horizontal speed
        gravityY: 1400,                      // Gravity strength

        // === GRAPPLE ===
        maxGrappleDistance: portrait ? 500 : 550,       // Max distance to attach to hook
        minForwardDistance: 40,              // Hook must be this far ahead of player
        minRopeLength: 80,                   // Minimum rope length
        maxRopeLength: portrait ? 420 : 480,            // Maximum rope length
        ropeDamping: 0.997,                  // Damping
        ropeStiffness: 0.15,                 // How quickly rope corrects distance
        swingBoostOnRelease: 1.2,            // Velocity multiplier on release

        // === CAMERA ===
        cameraLookAhead: portrait ? 180 : 280,          // Camera leads player by this much
        playerScreenX: portrait ? 0.35 : 0.25,          // Player position (0-1 from left)
        cameraSmoothX: 0.12,                 // Camera lerp speed X
        cameraSmoothY: 0.08,                 // Camera lerp speed Y

        // === LEVEL GENERATION ===
        spawnAheadDistance: portrait ? 1400 : 1800,     // Spawn platforms this far ahead
        despawnBehindDistance: 900,          // Remove platforms this far behind
        platformMinLength: portrait ? 220 : 300,        // Minimum platform width
        platformMaxLength: portrait ? 400 : 550,        // Maximum platform width
        platformHeight: 60,                  // Platform thickness
        gapMin: portrait ? 180 : 220,                   // Minimum gap between platforms
        gapMax: portrait ? 320 : 420,                   // Maximum gap between platforms
        hookHeightMin: portrait ? 160 : 180,            // Min height above platform for hooks
        hookHeightMax: portrait ? 320 : 360,            // Max height above platform for hooks
        hooksPerPlatformMin: 2,              // Minimum hooks per platform
        hooksPerPlatformMax: portrait ? 4 : 3,          // Maximum hooks per platform

        // === DIFFICULTY RAMP ===
        difficultyRampInterval: 15000,       // Ms between difficulty increases
        gapIncreasePerRamp: 35,              // Gap increase per ramp
        speedIncreasePerRamp: 20,            // Speed increase per ramp
        spikeChanceStart: 0.1,               // Initial spike probability
        spikeChanceMax: 0.4,                 // Maximum spike probability
        spikeChanceIncreasePerRamp: 0.04,

        // === COLLECTIBLES ===
        scrollValue: 100,                    // Points per scroll
        distanceScoreMultiplier: 0.1,        // Points per pixel traveled
        scrollSpawnChance: 0.7,              // Chance to spawn scroll per platform

        // === BOUNDS ===
        killY: height + 200,                 // Y position that triggers death
        groundY: height * (portrait ? 0.7 : 0.75),      // Base ground level for platforms
        platformYVariation: 100,             // Random Y offset for platforms

        // === VISUALS ===
        playerRadius: 28,                    // Player circle radius
        hookRadius: 16,                      // Hook point radius
        scrollSize: 32,                      // Scroll collectible size
        spikeWidth: 45,                      // Spike base width
        spikeHeight: 40,                     // Spike height
        ropeWidth: 4,                        // Rope line width

        // === SCREEN INFO ===
        isPortrait: portrait,
        screenWidth: width,
        screenHeight: height
    };
};

// Static CONFIG
export let CONFIG = getConfig();

// Function to update config
export const updateConfig = () => {
    CONFIG = getConfig();
    return CONFIG;
};

export type GameConfig = ReturnType<typeof getConfig>;
