// Boot Scene - Generate dynamically sized textures

import Phaser from 'phaser';
import { CONFIG, updateConfig } from '../config/GameConfig';

export class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    create(): void {
        // Ensure config is updated for current screen
        updateConfig();
        this.generateTextures();
        this.scene.start('GameScene');
    }

    private generateTextures(): void {
        // Player (ninja)
        const playerSize = Math.round(CONFIG.playerRadius * 2);
        const playerGfx = this.make.graphics({ x: 0, y: 0 });
        const pCenter = playerSize / 2;
        const pRadius = CONFIG.playerRadius - 2;

        playerGfx.fillStyle(0x1a1a1a);
        playerGfx.fillCircle(pCenter, pCenter, pRadius);
        playerGfx.fillStyle(0xcc0000);
        playerGfx.fillRect(pCenter - pRadius, pCenter - pRadius * 0.2, pRadius * 2, Math.max(2, pRadius * 0.35));
        playerGfx.lineStyle(Math.max(1, pRadius * 0.1), 0xcc0000);
        playerGfx.beginPath();
        playerGfx.moveTo(pCenter + pRadius, pCenter);
        playerGfx.lineTo(pCenter + pRadius + pRadius * 0.4, pCenter - pRadius * 0.3);
        playerGfx.stroke();
        playerGfx.fillStyle(0xffffff);
        playerGfx.fillCircle(pCenter - pRadius * 0.3, pCenter, Math.max(2, pRadius * 0.18));
        playerGfx.fillCircle(pCenter + pRadius * 0.3, pCenter, Math.max(2, pRadius * 0.18));
        playerGfx.fillStyle(0x000000);
        playerGfx.fillCircle(pCenter - pRadius * 0.25, pCenter, Math.max(1, pRadius * 0.08));
        playerGfx.fillCircle(pCenter + pRadius * 0.35, pCenter, Math.max(1, pRadius * 0.08));

        playerGfx.generateTexture('player', playerSize, playerSize);
        playerGfx.destroy();

        // Platform
        const platWidth = 64;
        const platHeight = Math.round(CONFIG.platformHeight);
        const platGfx = this.make.graphics({ x: 0, y: 0 });

        platGfx.fillStyle(0x2d2d2d);
        platGfx.fillRect(0, 0, platWidth, platHeight);
        platGfx.fillStyle(0x4a4a4a);
        platGfx.fillRect(0, 0, platWidth, Math.max(2, platHeight * 0.2));
        platGfx.fillStyle(0x252525);
        for (let x = 0; x < platWidth; x += 16) {
            platGfx.fillRect(x, platHeight * 0.25, 1, platHeight * 0.75);
        }

        platGfx.generateTexture('platform', platWidth, platHeight);
        platGfx.destroy();

        // Hook point
        const hookSize = Math.round(CONFIG.hookRadius * 2);
        const hookGfx = this.make.graphics({ x: 0, y: 0 });
        const hCenter = hookSize / 2;

        hookGfx.fillStyle(0xffd700, 0.4);
        hookGfx.fillCircle(hCenter, hCenter, CONFIG.hookRadius);
        hookGfx.fillStyle(0xffd700);
        hookGfx.fillCircle(hCenter, hCenter, CONFIG.hookRadius - 2);
        hookGfx.fillStyle(0xffee88);
        hookGfx.fillCircle(hCenter - 2, hCenter - 2, Math.max(2, CONFIG.hookRadius * 0.3));
        hookGfx.fillStyle(0xffaa00);
        hookGfx.fillCircle(hCenter, hCenter, Math.max(2, CONFIG.hookRadius * 0.3));

        hookGfx.generateTexture('hook', hookSize, hookSize);
        hookGfx.destroy();

        // Scroll collectible
        const scrollW = Math.round(CONFIG.scrollSize);
        const scrollH = Math.round(CONFIG.scrollSize * 1.2);
        const scrollGfx = this.make.graphics({ x: 0, y: 0 });

        scrollGfx.fillStyle(0xf5deb3);
        scrollGfx.fillRoundedRect(2, 0, scrollW - 4, scrollH, 3);
        scrollGfx.fillStyle(0xdaa520);
        scrollGfx.fillRoundedRect(0, 0, scrollW, Math.max(3, scrollH * 0.12), 2);
        scrollGfx.fillRoundedRect(0, scrollH - Math.max(3, scrollH * 0.12), scrollW, Math.max(3, scrollH * 0.12), 2);
        scrollGfx.fillStyle(0x8b7355);
        for (let i = 1; i < 4; i++) {
            scrollGfx.fillRect(scrollW * 0.2, scrollH / 5 * i, scrollW * 0.6, 1);
        }

        scrollGfx.generateTexture('scroll', scrollW, scrollH);
        scrollGfx.destroy();

        // Spike
        const spikeW = Math.round(CONFIG.spikeWidth);
        const spikeH = Math.round(CONFIG.spikeHeight);
        const spikeGfx = this.make.graphics({ x: 0, y: 0 });

        spikeGfx.fillStyle(0x660000);
        spikeGfx.fillTriangle(spikeW / 2, 2, 2, spikeH, spikeW - 2, spikeH);
        spikeGfx.fillStyle(0xcc0000);
        spikeGfx.fillTriangle(spikeW / 2, 0, 0, spikeH, spikeW, spikeH);
        spikeGfx.fillStyle(0xff4444);
        spikeGfx.fillTriangle(spikeW / 2, spikeH * 0.25, spikeW * 0.35, spikeH * 0.7, spikeW * 0.5, spikeH * 0.7);

        spikeGfx.generateTexture('spike', spikeW, spikeH);
        spikeGfx.destroy();

        // Background building
        const buildW = 60;
        const buildH = 150;
        const buildingGfx = this.make.graphics({ x: 0, y: 0 });

        buildingGfx.fillStyle(0x1a1a2e);
        buildingGfx.fillRect(0, 0, buildW, buildH);
        buildingGfx.fillStyle(0x252540);
        for (let y = 8; y < buildH - 15; y += 20) {
            for (let x = 8; x < buildW - 10; x += 18) {
                buildingGfx.fillRect(x, y, 10, 12);
                if (Math.random() > 0.6) {
                    buildingGfx.fillStyle(0x3a3a5a);
                    buildingGfx.fillRect(x + 1, y + 1, 8, 10);
                    buildingGfx.fillStyle(0x252540);
                }
            }
        }

        buildingGfx.generateTexture('building', buildW, buildH);
        buildingGfx.destroy();
    }
}
