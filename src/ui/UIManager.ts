// UI Manager - HUD and Game Over panel
// Optimized for 1080p portrait mobile display

import Phaser from 'phaser';
import { GameManager } from '../systems/GameManager';

export class UIManager {
    private scene: Phaser.Scene;

    // HUD elements
    private scoreText!: Phaser.GameObjects.Text;
    private bestText!: Phaser.GameObjects.Text;
    private scrollText!: Phaser.GameObjects.Text;

    // Game Over panel
    private gameOverContainer!: Phaser.GameObjects.Container;
    private finalScoreText!: Phaser.GameObjects.Text;
    private finalBestText!: Phaser.GameObjects.Text;

    private onRetry: () => void;

    constructor(scene: Phaser.Scene, onRetry: () => void) {
        this.scene = scene;
        this.onRetry = onRetry;

        this.createHUD();
        this.createGameOverPanel();
    }

    // Get font sizes scaled for 1080p base
    private getFontSizes() {
        const baseWidth = 1080;
        const scale = this.scene.scale.width / baseWidth;

        return {
            score: Math.round(48 * scale),
            best: Math.round(32 * scale),
            scroll: Math.round(40 * scale),
            title: Math.round(64 * scale),
            button: Math.round(44 * scale),
            panel: Math.round(40 * scale)
        };
    }

    private createHUD(): void {
        const { width } = this.scene.scale;
        const fonts = this.getFontSizes();
        const padding = Math.round(width * 0.04);

        // Score (top center)
        this.scoreText = this.scene.add.text(width / 2, padding, 'Score: 0', {
            fontSize: `${fonts.score}px`,
            fontFamily: 'Arial, sans-serif',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(100);

        // Best score (top right)
        this.bestText = this.scene.add.text(width - padding, padding, `Best: ${GameManager.bestScore}`, {
            fontSize: `${fonts.best}px`,
            fontFamily: 'Arial, sans-serif',
            color: '#ffd700',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(1, 0).setScrollFactor(0).setDepth(100);

        // Scroll count (top left)
        this.scrollText = this.scene.add.text(padding, padding, '📜 0', {
            fontSize: `${fonts.scroll}px`,
            fontFamily: 'Arial, sans-serif',
            color: '#f5deb3',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0, 0).setScrollFactor(0).setDepth(100);
    }

    private createGameOverPanel(): void {
        const { width, height } = this.scene.scale;
        const fonts = this.getFontSizes();

        // Scale panel size based on 1080p reference
        const scale = width / 1080;
        const panelWidth = Math.round(600 * scale);
        const panelHeight = Math.round(500 * scale);
        const halfW = panelWidth / 2;
        const halfH = panelHeight / 2;

        this.gameOverContainer = this.scene.add.container(width / 2, height / 2);
        this.gameOverContainer.setScrollFactor(0);
        this.gameOverContainer.setDepth(200);
        this.gameOverContainer.setVisible(false);

        // Background panel with gradient effect
        const bg = this.scene.add.graphics();
        bg.fillStyle(0x000000, 0.92);
        bg.fillRoundedRect(-halfW, -halfH, panelWidth, panelHeight, 24 * scale);
        bg.lineStyle(6 * scale, 0xffd700);
        bg.strokeRoundedRect(-halfW, -halfH, panelWidth, panelHeight, 24 * scale);
        this.gameOverContainer.add(bg);

        // Title
        const title = this.scene.add.text(0, -halfH + 70 * scale, 'GAME OVER', {
            fontSize: `${fonts.title}px`,
            fontFamily: 'Arial, sans-serif',
            color: '#ff4444',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        this.gameOverContainer.add(title);

        // Score
        this.finalScoreText = this.scene.add.text(0, -20 * scale, 'Score: 0', {
            fontSize: `${fonts.score}px`,
            fontFamily: 'Arial, sans-serif',
            color: '#ffffff'
        }).setOrigin(0.5);
        this.gameOverContainer.add(this.finalScoreText);

        // Best
        this.finalBestText = this.scene.add.text(0, 50 * scale, 'Best: 0', {
            fontSize: `${fonts.panel}px`,
            fontFamily: 'Arial, sans-serif',
            color: '#ffd700'
        }).setOrigin(0.5);
        this.gameOverContainer.add(this.finalBestText);

        // Retry button - larger and more prominent
        const btnWidth = Math.round(320 * scale);
        const btnHeight = Math.round(100 * scale);
        const retryBtn = this.scene.add.container(0, halfH - 100 * scale);

        // Button shadow
        const btnShadow = this.scene.add.graphics();
        btnShadow.fillStyle(0x2E7D32, 1);
        btnShadow.fillRoundedRect(-btnWidth / 2 + 4, -btnHeight / 2 + 4, btnWidth, btnHeight, 16 * scale);
        retryBtn.add(btnShadow);

        // Button background
        const btnBg = this.scene.add.graphics();
        btnBg.fillStyle(0x4CAF50);
        btnBg.fillRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 16 * scale);
        btnBg.lineStyle(4 * scale, 0x81C784);
        btnBg.strokeRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 16 * scale);
        retryBtn.add(btnBg);

        const btnText = this.scene.add.text(0, 0, '🔄 RETRY', {
            fontSize: `${fonts.button}px`,
            fontFamily: 'Arial, sans-serif',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        retryBtn.add(btnText);

        retryBtn.setSize(btnWidth, btnHeight);
        retryBtn.setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.scene.tweens.add({
                    targets: retryBtn,
                    scale: 0.95,
                    duration: 50,
                    yoyo: true,
                    onComplete: () => {
                        this.hideGameOver();
                        this.onRetry();
                    }
                });
            })
            .on('pointerover', () => retryBtn.setScale(1.05))
            .on('pointerout', () => retryBtn.setScale(1));

        this.gameOverContainer.add(retryBtn);
    }

    public update(): void {
        if (GameManager.phase === 'PLAYING') {
            this.scoreText.setText(`Score: ${GameManager.score}`);
            this.scrollText.setText(`📜 ${GameManager.scrollsCollected}`);
            this.bestText.setText(`Best: ${GameManager.bestScore}`);
        }
    }

    public showGameOver(): void {
        this.finalScoreText.setText(`Score: ${GameManager.score}`);
        this.finalBestText.setText(`Best: ${GameManager.bestScore}`);

        // Check if new best
        if (GameManager.score >= GameManager.bestScore) {
            this.finalBestText.setText('🏆 NEW BEST! 🏆');
            this.finalBestText.setColor('#00ff00');
        } else {
            this.finalBestText.setColor('#ffd700');
        }

        this.gameOverContainer.setVisible(true);
        this.gameOverContainer.setScale(0);

        this.scene.tweens.add({
            targets: this.gameOverContainer,
            scale: 1,
            duration: 300,
            ease: 'Back.easeOut'
        });
    }

    public hideGameOver(): void {
        this.gameOverContainer.setVisible(false);
    }

    public destroy(): void {
        this.scoreText.destroy();
        this.bestText.destroy();
        this.scrollText.destroy();
        this.gameOverContainer.destroy();
    }
}
