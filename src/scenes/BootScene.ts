// Boot Scene - Generate placeholder graphics

import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    create(): void {
        this.generateTextures();
        this.scene.start('GameScene');
    }

    private generateTextures(): void {
        // Player (ninja - black circle with red headband)
        const playerGfx = this.make.graphics({ x: 0, y: 0 });
        playerGfx.fillStyle(0x1a1a1a);
        playerGfx.fillCircle(20, 20, 18);
        // Headband
        playerGfx.fillStyle(0xcc0000);
        playerGfx.fillRect(5, 14, 30, 5);
        // Eyes
        playerGfx.fillStyle(0xffffff);
        playerGfx.fillCircle(14, 18, 3);
        playerGfx.fillCircle(26, 18, 3);
        playerGfx.generateTexture('player', 40, 40);
        playerGfx.destroy();

        // Platform (dark gray rooftop)
        const platGfx = this.make.graphics({ x: 0, y: 0 });
        platGfx.fillStyle(0x2d2d2d);
        platGfx.fillRect(0, 0, 64, 40);
        platGfx.fillStyle(0x3d3d3d);
        platGfx.fillRect(0, 0, 64, 8);
        platGfx.generateTexture('platform', 64, 40);
        platGfx.destroy();

        // Hook point (gold circle)
        const hookGfx = this.make.graphics({ x: 0, y: 0 });
        hookGfx.fillStyle(0xffd700);
        hookGfx.fillCircle(12, 12, 10);
        hookGfx.fillStyle(0xffaa00);
        hookGfx.fillCircle(12, 12, 6);
        hookGfx.generateTexture('hook', 24, 24);
        hookGfx.destroy();

        // Scroll collectible (cream rectangle with detail)
        const scrollGfx = this.make.graphics({ x: 0, y: 0 });
        scrollGfx.fillStyle(0xf5deb3);
        scrollGfx.fillRoundedRect(0, 0, 20, 24, 3);
        scrollGfx.fillStyle(0xdaa520);
        scrollGfx.fillRect(2, 4, 16, 2);
        scrollGfx.fillRect(2, 10, 16, 2);
        scrollGfx.fillRect(2, 16, 16, 2);
        scrollGfx.generateTexture('scroll', 20, 24);
        scrollGfx.destroy();

        // Spike (red triangle)
        const spikeGfx = this.make.graphics({ x: 0, y: 0 });
        spikeGfx.fillStyle(0xcc0000);
        spikeGfx.fillTriangle(15, 0, 0, 25, 30, 25);
        spikeGfx.generateTexture('spike', 30, 25);
        spikeGfx.destroy();

        // Background building silhouette
        const buildingGfx = this.make.graphics({ x: 0, y: 0 });
        buildingGfx.fillStyle(0x1a1a2e);
        buildingGfx.fillRect(0, 0, 80, 200);
        buildingGfx.fillStyle(0x252540);
        for (let y = 10; y < 190; y += 25) {
            for (let x = 10; x < 70; x += 20) {
                buildingGfx.fillRect(x, y, 12, 15);
            }
        }
        buildingGfx.generateTexture('building', 80, 200);
        buildingGfx.destroy();
    }
}
