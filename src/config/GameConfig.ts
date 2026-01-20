// ============= GAME CONFIGURATION =============
// All tunable constants in one place for easy tweaking

export const CONFIG = {
    // === MOVEMENT ===
    baseSpeed: 140,              // Initial horizontal speed (px/s)
    speedRampPerSecond: 1.5,     // Speed increase per second
    maxSpeed: 380,               // Maximum horizontal speed
    gravityY: 1000,              // Gravity strength

    // === GRAPPLE ===
    maxGrappleDistance: 380,     // Max distance to attach to hook
    minForwardDistance: 25,      // Hook must be this far ahead of player
    minRopeLength: 50,           // Minimum rope length
    maxRopeLength: 300,          // Maximum rope length
    ropeDamping: 0.997,          // Damping (closer to 1 = less damping, better swing)
    ropeStiffness: 0.15,         // How quickly rope corrects distance
    swingBoostOnRelease: 1.2,    // Velocity multiplier on release

    // === CAMERA ===
    cameraLookAhead: 160,        // Camera leads player by this much
    playerScreenX: 0.25,         // Player position (0-1 from left)
    cameraSmoothX: 0.12,         // Camera lerp speed X
    cameraSmoothY: 0.08,         // Camera lerp speed Y

    // === LEVEL GENERATION ===
    spawnAheadDistance: 1100,    // Spawn platforms this far ahead
    despawnBehindDistance: 600,  // Remove platforms this far behind
    platformMinLength: 180,      // Minimum platform width
    platformMaxLength: 350,      // Maximum platform width
    platformHeight: 40,          // Platform thickness
    gapMin: 140,                 // Minimum gap between platforms
    gapMax: 260,                 // Maximum gap between platforms
    hookHeightMin: 110,          // Min height above platform for hooks
    hookHeightMax: 220,          // Max height above platform for hooks
    hooksPerPlatformMin: 2,      // Minimum hooks per platform
    hooksPerPlatformMax: 3,      // Maximum hooks per platform

    // === DIFFICULTY RAMP ===
    difficultyRampInterval: 15000,  // Ms between difficulty increases
    gapIncreasePerRamp: 20,         // Gap increase per ramp
    speedIncreasePerRamp: 12,       // Speed increase per ramp
    spikeChanceStart: 0.1,          // Initial spike probability
    spikeChanceMax: 0.4,            // Maximum spike probability
    spikeChanceIncreasePerRamp: 0.04,

    // === COLLECTIBLES ===
    scrollValue: 100,            // Points per scroll
    distanceScoreMultiplier: 0.1, // Points per pixel traveled
    scrollSpawnChance: 0.7,      // Chance to spawn scroll per platform

    // === BOUNDS ===
    killY: 800,                  // Y position that triggers death
    groundY: 480,                // Base ground level for platforms
    platformYVariation: 50,      // Random Y offset for platforms

    // === VISUALS ===
    playerRadius: 18,            // Player circle radius
    hookRadius: 10,              // Hook point radius
    scrollSize: 20,              // Scroll collectible size
    spikeWidth: 30,              // Spike base width
    spikeHeight: 25,             // Spike height
};

// Type export for TypeScript
export type GameConfig = typeof CONFIG;
