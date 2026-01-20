// Main Game Scene - Ninja Rope Run

import Phaser from 'phaser';
import { CONFIG } from '../config/GameConfig';
import { GameManager } from '../systems/GameManager';
import { GrappleSystem } from '../systems/GrappleSystem';
import { LevelSpawner } from '../systems/LevelSpawner';
import { UIManager } from '../ui/UIManager';

export class GameScene extends Phaser.Scene {
    // Core objects
    private player!: Phaser.GameObjects.Sprite;
    private velocity: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0);
    private startX: number = 200;

    // Systems
    private grappleSystem!: GrappleSystem;
    private levelSpawner!: LevelSpawner;
    private uiManager!: UIManager;

    // Input
    private isPointerDown: boolean = false;

    // Parallax backgrounds
    private bgFar!: Phaser.GameObjects.TileSprite;
    private bgMid!: Phaser.GameObjects.TileSprite;

    constructor() {
        super({ key: 'GameScene' });
    }

    create(): void {
        // Reset game state
        GameManager.reset();

        // Create backgrounds
        this.createBackgrounds();

        // Create player
        this.createPlayer();

        // Initialize systems
        this.grappleSystem = new GrappleSystem(this, this.player);
        this.levelSpawner = new LevelSpawner(this, this.grappleSystem);
        this.uiManager = new UIManager(this, () => this.restartGame());

        // Spawn initial platforms
        this.levelSpawner.spawnInitialPlatforms(this.startX);

        // Setup input
        this.setupInput();

        // Setup camera
        this.setupCamera();

        // Instructions
        const instructions = this.add.text(
            this.scale.width / 2,
            this.scale.height / 2,
            '👆 HOLD to grapple\n🎯 Release to swing',
            {
                fontSize: '24px',
                fontFamily: 'Arial, sans-serif',
                color: '#ffffff',
                align: 'center',
                stroke: '#000000',
                strokeThickness: 3
            }
        ).setOrigin(0.5).setScrollFactor(0).setDepth(50);

        this.time.delayedCall(2500, () => {
            this.tweens.add({
                targets: instructions,
                alpha: 0,
                duration: 500,
                onComplete: () => instructions.destroy()
            });
        });
    }

    private createBackgrounds(): void {
        const { width, height } = this.scale;

        // Night sky gradient (far background)
        const skyGfx = this.make.graphics({ x: 0, y: 0 });
        skyGfx.fillGradientStyle(0x0f0c29, 0x0f0c29, 0x302b63, 0x24243e, 1);
        skyGfx.fillRect(0, 0, 100, height);
        skyGfx.generateTexture('sky', 100, height);
        skyGfx.destroy();

        this.bgFar = this.add.tileSprite(0, 0, width, height, 'sky');
        this.bgFar.setOrigin(0, 0);
        this.bgFar.setScrollFactor(0);
        this.bgFar.setDepth(-10);

        // City silhouettes (mid background)
        const cityGfx = this.make.graphics({ x: 0, y: 0 });
        cityGfx.fillStyle(0x1a1a2e);
        // Random building shapes
        for (let x = 0; x < 400; x += 50) {
            const bh = 100 + Math.random() * 150;
            cityGfx.fillRect(x, height - bh, 40, bh);
        }
        cityGfx.generateTexture('city', 400, height);
        cityGfx.destroy();

        this.bgMid = this.add.tileSprite(0, 0, width * 2, height, 'city');
        this.bgMid.setOrigin(0, 0);
        this.bgMid.setScrollFactor(0);
        this.bgMid.setDepth(-5);
    }

    private createPlayer(): void {
        this.player = this.add.sprite(this.startX, CONFIG.groundY - 50, 'player');
        this.player.setDepth(10);
        this.velocity.set(CONFIG.baseSpeed, 0);
    }

    private setupInput(): void {
        // Pointer (touch/mouse) input
        this.input.on('pointerdown', () => {
            if (GameManager.phase !== 'PLAYING') return;
            this.isPointerDown = true;
            this.grappleSystem.tryAttach();
        });

        this.input.on('pointerup', () => {
            if (GameManager.phase !== 'PLAYING') return;
            this.isPointerDown = false;

            if (this.grappleSystem.isCurrentlyAttached()) {
                // Apply small boost on release
                this.velocity.scale(CONFIG.swingBoostOnRelease);
                this.grappleSystem.detach();
            }
        });
    }

    private setupCamera(): void {
        // Camera follows player with look-ahead
        this.cameras.main.setBounds(0, 0, Number.MAX_SAFE_INTEGER, this.scale.height);
    }

    update(_time: number, delta: number): void {
        if (GameManager.phase !== 'PLAYING') {
            this.uiManager.update();
            return;
        }

        const dt = delta / 1000;

        // Update game manager (score, difficulty)
        GameManager.update(delta, this.player.x, this.startX);

        // Apply gravity when NOT attached (grapple handles its own gravity as pendulum)
        if (!this.grappleSystem.isCurrentlyAttached()) {
            this.velocity.y += CONFIG.gravityY * dt;
            // Maintain forward velocity when not swinging
            this.velocity.x = Math.max(this.velocity.x, GameManager.currentSpeed);
        }

        // Try to maintain grapple if holding
        if (this.isPointerDown && !this.grappleSystem.isCurrentlyAttached()) {
            this.grappleSystem.tryAttach();
        }

        // Update grapple physics (passes dt for proper pendulum simulation)
        this.velocity = this.grappleSystem.update(this.velocity, dt);

        // Update position
        this.player.x += this.velocity.x * dt;
        this.player.y += this.velocity.y * dt;

        // Platform collision
        const platformCheck = this.levelSpawner.checkPlatformCollision(
            this.player.x,
            this.player.y,
            CONFIG.playerRadius
        );

        if (platformCheck.hit && this.velocity.y > 0) {
            this.player.y = platformCheck.platformY - CONFIG.playerRadius;
            this.velocity.y = 0;
        }

        // Rotate player based on velocity
        if (this.velocity.length() > 10) {
            const targetAngle = Math.atan2(this.velocity.y, this.velocity.x);
            this.player.rotation = Phaser.Math.Angle.RotateTo(
                this.player.rotation,
                targetAngle,
                0.15
            );
        }

        // Update level spawning
        this.levelSpawner.update(this.cameras.main.scrollX);

        // Check scroll collection
        const scrollsCollected = this.levelSpawner.checkScrollCollisions(
            this.player.x,
            this.player.y
        );
        for (let i = 0; i < scrollsCollected; i++) {
            GameManager.collectScroll();
        }

        // Check spike collision
        if (this.levelSpawner.checkSpikeCollisions(this.player.x, this.player.y)) {
            this.triggerDeath();
            return;
        }

        // Check fall death
        if (this.player.y > CONFIG.killY) {
            this.triggerDeath();
            return;
        }

        // Update camera
        this.updateCamera();

        // Update parallax backgrounds
        this.bgMid.tilePositionX = this.cameras.main.scrollX * 0.3;

        // Update UI
        this.uiManager.update();
    }

    private updateCamera(): void {
        const targetX = this.player.x - this.scale.width * CONFIG.playerScreenX + CONFIG.cameraLookAhead;
        const targetY = this.player.y - this.scale.height * 0.5;

        // Smooth camera follow
        this.cameras.main.scrollX += (targetX - this.cameras.main.scrollX) * CONFIG.cameraSmoothX;
        this.cameras.main.scrollY += (targetY - this.cameras.main.scrollY) * CONFIG.cameraSmoothY;

        // Clamp Y
        this.cameras.main.scrollY = Math.max(
            0,
            Math.min(this.cameras.main.scrollY, this.scale.height * 0.3)
        );
    }

    private triggerDeath(): void {
        GameManager.triggerGameOver();

        // Death effect
        this.cameras.main.shake(200, 0.02);
        this.cameras.main.flash(200, 255, 0, 0);

        // Stop player
        this.velocity.set(0, 0);
        this.grappleSystem.detach();

        // Show game over
        this.uiManager.showGameOver();
    }

    private restartGame(): void {
        // Clean up
        this.grappleSystem.destroy();
        this.levelSpawner.destroy();

        // Restart scene
        this.scene.restart();
    }
}
