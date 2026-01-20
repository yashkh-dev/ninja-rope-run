// Level Spawner - Procedural platform, hook, scroll, and spike generation

import Phaser from 'phaser';
import { CONFIG } from '../config/GameConfig';
import { GameManager } from './GameManager';
import { GrappleSystem } from './GrappleSystem';
import type { HookPoint } from './GrappleSystem';

interface Platform {
    container: Phaser.GameObjects.Container;
    x: number;
    width: number;
    hooks: HookPoint[];
    scrolls: Phaser.GameObjects.Sprite[];
    spikes: Phaser.GameObjects.Sprite[];
}

export class LevelSpawner {
    private scene: Phaser.Scene;
    private grappleSystem: GrappleSystem;

    private platforms: Platform[] = [];
    private rightmostEdge: number = 0;
    private platformY: number = CONFIG.groundY;

    constructor(scene: Phaser.Scene, grappleSystem: GrappleSystem) {
        this.scene = scene;
        this.grappleSystem = grappleSystem;
    }

    public spawnInitialPlatforms(startX: number): void {
        // Spawn starting platform (longer, no gaps)
        this.rightmostEdge = startX - 100;
        this.spawnPlatform(300, false); // Long safe starting platform

        // Spawn a few more ahead
        for (let i = 0; i < 5; i++) {
            this.spawnPlatform();
        }
    }

    public update(cameraX: number): void {
        // Spawn platforms ahead
        while (this.rightmostEdge < cameraX + CONFIG.spawnAheadDistance) {
            this.spawnPlatform();
        }

        // Despawn platforms behind
        this.platforms = this.platforms.filter(platform => {
            if (platform.x + platform.width < cameraX - CONFIG.despawnBehindDistance) {
                this.destroyPlatform(platform);
                return false;
            }
            return true;
        });
    }

    private spawnPlatform(forcedWidth?: number, addGap: boolean = true): void {
        // Calculate gap
        let gap = 0;
        if (addGap && this.platforms.length > 0) {
            const gapRange = GameManager.getGapRange();
            gap = Phaser.Math.Between(gapRange.min, gapRange.max);
        }

        // Platform dimensions
        const width = forcedWidth || Phaser.Math.Between(
            CONFIG.platformMinLength,
            CONFIG.platformMaxLength
        );
        const x = this.rightmostEdge + gap;

        // Vary platform Y slightly
        const yVariation = Phaser.Math.Between(-CONFIG.platformYVariation, CONFIG.platformYVariation / 2);
        this.platformY = Phaser.Math.Clamp(
            this.platformY + yVariation,
            CONFIG.groundY - CONFIG.platformYVariation,
            CONFIG.groundY + CONFIG.platformYVariation / 2
        );
        const y = this.platformY;

        // Create container
        const container = this.scene.add.container(x, y);

        // Create platform tiles
        const tileCount = Math.ceil(width / 64);
        for (let i = 0; i < tileCount; i++) {
            const tile = this.scene.add.sprite(i * 64, 0, 'platform');
            tile.setOrigin(0, 0);
            if (i === tileCount - 1) {
                // Crop last tile if needed
                const remainingWidth = width - i * 64;
                tile.setCrop(0, 0, remainingWidth, CONFIG.platformHeight);
            }
            container.add(tile);
        }

        // Create hooks above platform
        const hooks: HookPoint[] = [];
        const hookCount = Phaser.Math.Between(
            CONFIG.hooksPerPlatformMin,
            CONFIG.hooksPerPlatformMax
        );

        for (let i = 0; i < hookCount; i++) {
            const hookX = x + (width / (hookCount + 1)) * (i + 1);
            const hookY = y - Phaser.Math.Between(CONFIG.hookHeightMin, CONFIG.hookHeightMax);

            const hookSprite = this.scene.add.sprite(hookX, hookY, 'hook');
            hookSprite.setDepth(2);

            const hook: HookPoint = { x: hookX, y: hookY, sprite: hookSprite };
            hooks.push(hook);
            this.grappleSystem.registerHook(hook);
        }

        // Add a hook over the gap (between previous platform and this one)
        // This ensures players can always grapple across gaps
        if (gap > 80 && this.platforms.length > 0) {
            const gapHookX = x - gap / 2;
            const gapHookY = y - CONFIG.hookHeightMax - 30;

            const gapHookSprite = this.scene.add.sprite(gapHookX, gapHookY, 'hook');
            gapHookSprite.setDepth(2);

            const gapHook: HookPoint = { x: gapHookX, y: gapHookY, sprite: gapHookSprite };
            hooks.push(gapHook);
            this.grappleSystem.registerHook(gapHook);
        }

        // Maybe spawn scroll
        const scrolls: Phaser.GameObjects.Sprite[] = [];
        if (Math.random() < CONFIG.scrollSpawnChance && hooks.length > 0) {
            // Place scroll near a hook's swing arc
            const refHook = hooks[Math.floor(Math.random() * hooks.length)];
            const scrollX = refHook.x + Phaser.Math.Between(-50, 50);
            const scrollY = refHook.y + Phaser.Math.Between(30, 80);

            const scroll = this.scene.add.sprite(scrollX, scrollY, 'scroll');
            scroll.setDepth(3);
            scroll.setData('collected', false);
            scrolls.push(scroll);

            // Floating animation
            this.scene.tweens.add({
                targets: scroll,
                y: scroll.y - 8,
                duration: 600,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }

        // Maybe spawn spikes
        const spikes: Phaser.GameObjects.Sprite[] = [];
        if (Math.random() < GameManager.getSpikeChance() && this.platforms.length > 1) {
            const spikeX = x + Phaser.Math.Between(30, width - 30);
            const spikeY = y - 12;

            const spike = this.scene.add.sprite(spikeX, spikeY, 'spike');
            spike.setOrigin(0.5, 1);
            spike.setDepth(2);
            spikes.push(spike);
        }

        // Update rightmost edge
        this.rightmostEdge = x + width;

        // Store platform data
        this.platforms.push({
            container,
            x,
            width,
            hooks,
            scrolls,
            spikes
        });
    }

    private destroyPlatform(platform: Platform): void {
        // Unregister hooks
        for (const hook of platform.hooks) {
            this.grappleSystem.unregisterHook(hook);
            hook.sprite.destroy();
        }

        // Destroy scrolls
        for (const scroll of platform.scrolls) {
            scroll.destroy();
        }

        // Destroy spikes
        for (const spike of platform.spikes) {
            spike.destroy();
        }

        // Destroy container
        platform.container.destroy();
    }

    public checkScrollCollisions(playerX: number, playerY: number): number {
        let collected = 0;

        for (const platform of this.platforms) {
            for (const scroll of platform.scrolls) {
                if (scroll.getData('collected')) continue;

                const dist = Phaser.Math.Distance.Between(playerX, playerY, scroll.x, scroll.y);
                if (dist < 35) {
                    scroll.setData('collected', true);
                    collected++;

                    // Collection effect
                    this.scene.tweens.add({
                        targets: scroll,
                        scale: 1.5,
                        alpha: 0,
                        y: scroll.y - 30,
                        duration: 200,
                        onComplete: () => scroll.setVisible(false)
                    });
                }
            }
        }

        return collected;
    }

    public checkSpikeCollisions(playerX: number, playerY: number): boolean {
        for (const platform of this.platforms) {
            for (const spike of platform.spikes) {
                const dist = Phaser.Math.Distance.Between(playerX, playerY, spike.x, spike.y - 12);
                if (dist < 25) {
                    return true;
                }
            }
        }
        return false;
    }

    public checkPlatformCollision(playerX: number, playerY: number, playerRadius: number): { hit: boolean; platformY: number } {
        for (const platform of this.platforms) {
            // Check if player is above this platform
            if (playerX >= platform.x - playerRadius &&
                playerX <= platform.x + platform.width + playerRadius) {
                const platformTop = platform.container.y;

                // Check if falling onto platform
                if (playerY + playerRadius >= platformTop && playerY + playerRadius <= platformTop + 20) {
                    return { hit: true, platformY: platformTop };
                }
            }
        }
        return { hit: false, platformY: 0 };
    }

    public destroy(): void {
        for (const platform of this.platforms) {
            this.destroyPlatform(platform);
        }
        this.platforms = [];
    }
}
