// Grapple System - Hook selection and rope physics (pendulum swing)

import Phaser from 'phaser';
import { CONFIG } from '../config/GameConfig';

export interface HookPoint {
    x: number;
    y: number;
    sprite: Phaser.GameObjects.Sprite;
}

export class GrappleSystem {
    private player: Phaser.GameObjects.Sprite;
    private ropeGraphics: Phaser.GameObjects.Graphics;

    private hooks: HookPoint[] = [];
    private attachedHook: HookPoint | null = null;
    private ropeLength: number = 0;
    private isAttached: boolean = false;

    constructor(scene: Phaser.Scene, player: Phaser.GameObjects.Sprite) {
        this.player = player;
        this.ropeGraphics = scene.add.graphics();
        this.ropeGraphics.setDepth(5);
    }

    public registerHook(hook: HookPoint): void {
        this.hooks.push(hook);
    }

    public unregisterHook(hook: HookPoint): void {
        const index = this.hooks.indexOf(hook);
        if (index > -1) {
            this.hooks.splice(index, 1);
        }
        if (this.attachedHook === hook) {
            this.detach();
        }
    }

    public tryAttach(): boolean {
        if (this.isAttached) return true;

        // Find valid hooks (ahead of player, within range)
        const validHooks = this.hooks.filter(hook => {
            // Must be ahead of player
            if (hook.x <= this.player.x + CONFIG.minForwardDistance) return false;

            // Must be within max distance
            const dist = Phaser.Math.Distance.Between(
                this.player.x, this.player.y,
                hook.x, hook.y
            );
            if (dist > CONFIG.maxGrappleDistance) return false;

            // Must be above player (or at similar height)
            if (hook.y > this.player.y + 50) return false;

            return true;
        });

        if (validHooks.length === 0) return false;

        // Sort by distance (closest first)
        validHooks.sort((a, b) => {
            const distA = Phaser.Math.Distance.Between(this.player.x, this.player.y, a.x, a.y);
            const distB = Phaser.Math.Distance.Between(this.player.x, this.player.y, b.x, b.y);
            return distA - distB;
        });

        // Attach to closest valid hook
        this.attachedHook = validHooks[0];
        this.isAttached = true;

        // Calculate rope length (clamped)
        const distance = Phaser.Math.Distance.Between(
            this.player.x, this.player.y,
            this.attachedHook.x, this.attachedHook.y
        );
        this.ropeLength = Phaser.Math.Clamp(
            distance,
            CONFIG.minRopeLength,
            CONFIG.maxRopeLength
        );

        // Visual feedback
        this.attachedHook.sprite.setTint(0x00ff00);

        return true;
    }

    public detach(): Phaser.Math.Vector2 | null {
        if (!this.isAttached || !this.attachedHook) return null;

        this.attachedHook.sprite.clearTint();
        this.isAttached = false;
        this.attachedHook = null;
        this.ropeGraphics.clear();

        return null;
    }

    public isCurrentlyAttached(): boolean {
        return this.isAttached;
    }

    public getAttachedHook(): HookPoint | null {
        return this.attachedHook;
    }

    public update(velocity: Phaser.Math.Vector2, dt: number): Phaser.Math.Vector2 {
        this.ropeGraphics.clear();

        if (!this.isAttached || !this.attachedHook) {
            return velocity;
        }

        // Draw rope
        this.ropeGraphics.lineStyle(4, 0x8B4513);
        this.ropeGraphics.beginPath();
        this.ropeGraphics.moveTo(this.player.x, this.player.y);
        this.ropeGraphics.lineTo(this.attachedHook.x, this.attachedHook.y);
        this.ropeGraphics.strokePath();

        // Vector from hook to player
        const fromHook = new Phaser.Math.Vector2(
            this.player.x - this.attachedHook.x,
            this.player.y - this.attachedHook.y
        );
        const currentDistance = fromHook.length();

        // Normalize the rope direction
        const ropeDir = fromHook.clone().normalize();

        // === PENDULUM PHYSICS ===

        // 1. Apply gravity as tangential component only (creates swing)
        const gravityForce = new Phaser.Math.Vector2(0, CONFIG.gravityY * dt);

        // Project gravity onto rope direction (radial component - creates tension)
        const radialGravity = ropeDir.clone().scale(gravityForce.dot(ropeDir));

        // Tangential component creates the swing motion
        const tangentialGravity = gravityForce.clone().subtract(radialGravity);
        velocity.add(tangentialGravity);

        // 2. Enforce rope length constraint
        if (currentDistance > this.ropeLength) {
            // Remove velocity component that would stretch the rope
            const radialVelocity = ropeDir.clone().scale(velocity.dot(ropeDir));

            // Only remove outward radial velocity (positive dot = moving away from hook)
            if (velocity.dot(ropeDir) > 0) {
                velocity.subtract(radialVelocity);
            }

            // Snap player to rope length
            const correction = currentDistance - this.ropeLength;
            this.player.x -= ropeDir.x * correction;
            this.player.y -= ropeDir.y * correction;
        }

        // 3. Apply damping (slight energy loss)
        velocity.scale(CONFIG.ropeDamping);

        // 4. Ensure minimum forward velocity while swinging
        if (velocity.x < CONFIG.baseSpeed * 0.5) {
            velocity.x = CONFIG.baseSpeed * 0.5;
        }

        return velocity;
    }

    public destroy(): void {
        this.ropeGraphics.destroy();
        this.hooks = [];
        this.attachedHook = null;
        this.isAttached = false;
    }
}
