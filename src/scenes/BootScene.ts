// Boot Scene - Generate textures (sized for 1080p canvas)

import Phaser from 'phaser';
import { CONFIG } from '../config/GameConfig';

export class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    create(): void {
        this.generateTextures();
        this.scene.start('GameScene');
    }

    private generateTextures(): void {
        // Player (ninja)
        const playerSize = CONFIG.playerRadius * 2;
        const playerGfx = this.make.graphics({ x: 0, y: 0 });
        const pCenter = playerSize / 2;
        const pRadius = CONFIG.playerRadius - 2;

        // Body
        playerGfx.fillStyle(0x1a1a1a);
        playerGfx.fillCircle(pCenter, pCenter, pRadius);

        // Headband
        playerGfx.fillStyle(0xcc0000);
        playerGfx.fillRect(pCenter - pRadius, pCenter - pRadius * 0.2, pRadius * 2, pRadius * 0.35);

        // Headband tails
        playerGfx.lineStyle(3, 0xcc0000);
        playerGfx.beginPath();
        playerGfx.moveTo(pCenter + pRadius, pCenter - pRadius * 0.05);
        playerGfx.lineTo(pCenter + pRadius + 12, pCenter - 8);
        playerGfx.stroke();

        // Eyes
        playerGfx.fillStyle(0xffffff);
        playerGfx.fillCircle(pCenter - 8, pCenter, 5);
        playerGfx.fillCircle(pCenter + 8, pCenter, 5);

        // Pupils
        playerGfx.fillStyle(0x000000);
        playerGfx.fillCircle(pCenter - 6, pCenter, 2);
        playerGfx.fillCircle(pCenter + 10, pCenter, 2);

        playerGfx.generateTexture('player', playerSize, playerSize);
        playerGfx.destroy();

        // Platform
        const platWidth = 128;
        const platHeight = CONFIG.platformHeight;
        const platGfx = this.make.graphics({ x: 0, y: 0 });

        platGfx.fillStyle(0x2d2d2d);
        platGfx.fillRect(0, 0, platWidth, platHeight);
        platGfx.fillStyle(0x4a4a4a);
        platGfx.fillRect(0, 0, platWidth, 10);
        platGfx.fillStyle(0x252525);
        for (let x = 0; x < platWidth; x += 24) {
            platGfx.fillRect(x, 12, 2, platHeight - 12);
        }

        platGfx.generateTexture('platform', platWidth, platHeight);
        platGfx.destroy();

        // Hook point
        const hookSize = CONFIG.hookRadius * 2;
        const hookGfx = this.make.graphics({ x: 0, y: 0 });
        const hCenter = hookSize / 2;

        hookGfx.fillStyle(0xffd700, 0.4);
        hookGfx.fillCircle(hCenter, hCenter, CONFIG.hookRadius);
        hookGfx.fillStyle(0xffd700);
        hookGfx.fillCircle(hCenter, hCenter, CONFIG.hookRadius - 3);
        hookGfx.fillStyle(0xffee88);
        hookGfx.fillCircle(hCenter - 4, hCenter - 4, 5);
        hookGfx.fillStyle(0xffaa00);
        hookGfx.fillCircle(hCenter, hCenter, 5);

        hookGfx.generateTexture('hook', hookSize, hookSize);
        hookGfx.destroy();

        // Scroll collectible
        const scrollW = CONFIG.scrollSize;
        const scrollH = CONFIG.scrollSize * 1.2;
        const scrollGfx = this.make.graphics({ x: 0, y: 0 });

        scrollGfx.fillStyle(0xf5deb3);
        scrollGfx.fillRoundedRect(3, 0, scrollW - 6, scrollH, 4);
        scrollGfx.fillStyle(0xdaa520);
        scrollGfx.fillRoundedRect(0, 0, scrollW, 6, 3);
        scrollGfx.fillRoundedRect(0, scrollH - 6, scrollW, 6, 3);
        scrollGfx.fillStyle(0x8b7355);
        for (let i = 1; i < 4; i++) {
            scrollGfx.fillRect(8, scrollH / 5 * i, scrollW - 16, 2);
        }

        scrollGfx.generateTexture('scroll', scrollW, scrollH);
        scrollGfx.destroy();

        // Spike
        const spikeW = CONFIG.spikeWidth;
        const spikeH = CONFIG.spikeHeight;
        const spikeGfx = this.make.graphics({ x: 0, y: 0 });

        spikeGfx.fillStyle(0x660000);
        spikeGfx.fillTriangle(spikeW / 2, 3, 3, spikeH, spikeW - 3, spikeH);
        spikeGfx.fillStyle(0xcc0000);
        spikeGfx.fillTriangle(spikeW / 2, 0, 0, spikeH, spikeW, spikeH);
        spikeGfx.fillStyle(0xff4444);
        spikeGfx.fillTriangle(spikeW / 2, spikeH * 0.25, spikeW * 0.35, spikeH * 0.7, spikeW * 0.5, spikeH * 0.7);

        spikeGfx.generateTexture('spike', spikeW, spikeH);
        spikeGfx.destroy();

        // Background building
        const buildW = 120;
        const buildH = 300;
        const buildingGfx = this.make.graphics({ x: 0, y: 0 });

        buildingGfx.fillStyle(0x1a1a2e);
        buildingGfx.fillRect(0, 0, buildW, buildH);
        buildingGfx.fillStyle(0x252540);
        for (let y = 15; y < buildH - 30; y += 35) {
            for (let x = 15; x < buildW - 20; x += 30) {
                buildingGfx.fillRect(x, y, 18, 22);
                if (Math.random() > 0.6) {
                    buildingGfx.fillStyle(0x3a3a5a);
                    buildingGfx.fillRect(x + 2, y + 2, 14, 18);
                    buildingGfx.fillStyle(0x252540);
                }
            }
        }

        buildingGfx.generateTexture('building', buildW, buildH);
        buildingGfx.destroy();
    }
}
