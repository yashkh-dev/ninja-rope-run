# Ninja Rope Run 🥷

A 2D side-scrolling grapple-swing game with rooftop ninja theme. Hold to grapple, release to swing!

## Quick Start

```bash
cd ninja-rope-run
npm install
npm run dev
```

Open `http://localhost:5173` in browser. Works on desktop and mobile.

---

## Controls

| Input | Action |
|-------|--------|
| **Hold** (touch/click) | Grapple to nearest forward hook |
| **Release** | Detach and maintain momentum |

**One-touch gameplay** - just hold and release!

---

## How Grapple Target Selection Works

When you hold input, the system:
1. Finds all hooks **ahead of player** (`hook.x > player.x + minForwardDistance`)
2. Filters to hooks within `maxGrappleDistance`
3. Selects **closest valid hook**
4. Creates rope with clamped length (`minRopeLength` to `maxRopeLength`)

See `src/systems/GrappleSystem.ts` → `tryAttach()` method.

---

## Tuning Parameters

All constants are in **`src/config/GameConfig.ts`**:

### Movement
```typescript
baseSpeed: 150,        // Starting horizontal speed
speedRampPerSecond: 2, // Speed increase per second
maxSpeed: 400,         // Cap on horizontal speed
gravityY: 1200,        // Fall speed
```

### Grapple Feel
```typescript
maxGrappleDistance: 280,  // How far you can grapple
minForwardDistance: 40,   // Hook must be this far ahead
minRopeLength: 80,        // Minimum rope length
maxRopeLength: 220,       // Maximum rope length
ropeDamping: 0.985,       // Swing damping (closer to 1 = less damping)
ropeStiffness: 0.15,      // How quickly rope corrects distance
swingBoostOnRelease: 1.1, // Velocity multiplier on release
```

### Level Generation
```typescript
platformMinLength: 140,  // Min platform width
platformMaxLength: 300,  // Max platform width
gapMin: 180,             // Min gap between platforms
gapMax: 320,             // Max gap between platforms
hookHeightMin: 90,       // Hook height above platform (min)
hookHeightMax: 180,      // Hook height above platform (max)
```

### Difficulty
```typescript
difficultyRampInterval: 12000,  // Ms between difficulty increases
gapIncreasePerRamp: 25,         // Gap increase per difficulty level
spikeChanceStart: 0.15,         // Initial spike probability
spikeChanceMax: 0.45,           // Maximum spike probability
```

---

## Project Structure

```
src/
├── main.ts                 # Phaser config entry point
├── config/
│   └── GameConfig.ts       # ← ALL TUNING CONSTANTS
├── scenes/
│   ├── BootScene.ts        # Asset generation
│   └── GameScene.ts        # Main game loop
├── systems/
│   ├── GameManager.ts      # State, score, persistence
│   ├── GrappleSystem.ts    # Hook selection + rope physics
│   └── LevelSpawner.ts     # Procedural generation
└── ui/
    └── UIManager.ts        # HUD + game over
```

---

## Known Limitations

- Placeholder graphics (circles, rectangles)
- No audio
- Basic rope physics (distance constraint, not full verlet)
- Single hazard type (spikes)

## Next Steps (V1)

- [ ] Better rope physics with verlet integration
- [ ] Swing boost on ideal release angle
- [ ] More hazard types (moving obstacles, gaps)
- [ ] Power-ups (speed boost, magnet scrolls)
- [ ] Character animations
- [ ] Android APK build with Capacitor

---

## License

MIT
