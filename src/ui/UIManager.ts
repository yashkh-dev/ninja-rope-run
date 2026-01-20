// UI Manager - HUD and Game Over panel
// Now with responsive design for portrait screens

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

        // Listen for resize events
        this.scene.scale.on('resize', this.handleResize, this);
    }

    private getFontSizes() {
        const baseSize = Math.min(this.scene.scale.width, this.scene.scale.height);
        const scale = Math.max(0.6, Math.min(1.2, baseSize / 500));

        return {
            score: Math.round(24 * scale),
            best: Math.round(16 * scale),
            scroll: Math.round(20 * scale),
            title: Math.round(32 * scale),
            button: Math.round(22 * scale),
            panel: Math.round(20 * scale)
        };
    }

    private createHUD(): void {
        const { width } = this.scene.scale;
        const fonts = this.getFontSizes();
        const padding = Math.max(10, width * 0.03);

        // Score (top center)
        this.scoreText = this.scene.add.text(width / 2, padding, 'Score: 0', {
            fontSize: `${fonts.score}px`,
            fontFamily: 'Arial, sans-serif',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(100);

        // Best score (top right)
        this.bestText = this.scene.add.text(width - padding, padding, `Best: ${GameManager.bestScore}`, {
            fontSize: `${fonts.best}px`,
            fontFamily: 'Arial, sans-serif',
            color: '#ffd700',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(1, 0).setScrollFactor(0).setDepth(100);

        // Scroll count (top left)
        this.scrollText = this.scene.add.text(padding, padding, '📜 0', {
            fontSize: `${fonts.scroll}px`,
            fontFamily: 'Arial, sans-serif',
            color: '#f5deb3',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0, 0).setScrollFactor(0).setDepth(100);
    }

    private createGameOverPanel(): void {
        const { width, height } = this.scene.scale;
        const fonts = this.getFontSizes();

        // Scale panel size based on screen
        const panelWidth = Math.min(300, width * 0.85);
        const panelHeight = Math.min(280, height * 0.5);
        const halfW = panelWidth / 2;
        const halfH = panelHeight / 2;

        this.gameOverContainer = this.scene.add.container(width / 2, height / 2);
        this.gameOverContainer.setScrollFactor(0);
        this.gameOverContainer.setDepth(200);
        this.gameOverContainer.setVisible(false);

        // Background panel
        const bg = this.scene.add.graphics();
        bg.fillStyle(0x000000, 0.9);
        bg.fillRoundedRect(-halfW, -halfH, panelWidth, panelHeight, 15);
        bg.lineStyle(3, 0xffd700);
        bg.strokeRoundedRect(-halfW, -halfH, panelWidth, panelHeight, 15);
        this.gameOverContainer.add(bg);

        // Title
        const title = this.scene.add.text(0, -halfH + 35, 'GAME OVER', {
            fontSize: `${fonts.title}px`,
            fontFamily: 'Arial, sans-serif',
            color: '#ff4444',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.gameOverContainer.add(title);

        // Score
        this.finalScoreText = this.scene.add.text(0, -20, 'Score: 0', {
            fontSize: `${fonts.score}px`,
            fontFamily: 'Arial, sans-serif',
            color: '#ffffff'
        }).setOrigin(0.5);
        this.gameOverContainer.add(this.finalScoreText);

        // Best
        this.finalBestText = this.scene.add.text(0, 25, 'Best: 0', {
            fontSize: `${fonts.panel}px`,
            fontFamily: 'Arial, sans-serif',
            color: '#ffd700'
        }).setOrigin(0.5);
        this.gameOverContainer.add(this.finalBestText);

        // Retry button
        const btnWidth = Math.min(160, panelWidth * 0.7);
        const btnHeight = 50;
        const retryBtn = this.scene.add.container(0, halfH - 60);

        const btnBg = this.scene.add.graphics();
        btnBg.fillStyle(0x4CAF50);
        btnBg.fillRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 10);
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

    private handleResize(gameSize: Phaser.Structs.Size): void {
        const fonts = this.getFontSizes();
        const padding = Math.max(10, gameSize.width * 0.03);

        // Update HUD positions and sizes
        if (this.scoreText) {
            this.scoreText.setPosition(gameSize.width / 2, padding);
            this.scoreText.setFontSize(fonts.score);
        }
        if (this.bestText) {
            this.bestText.setPosition(gameSize.width - padding, padding);
            this.bestText.setFontSize(fonts.best);
        }
        if (this.scrollText) {
            this.scrollText.setPosition(padding, padding);
            this.scrollText.setFontSize(fonts.scroll);
        }

        // Update game over panel position
        if (this.gameOverContainer) {
            this.gameOverContainer.setPosition(gameSize.width / 2, gameSize.height / 2);
        }
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
        this.scene.scale.off('resize', this.handleResize, this);
        this.scoreText.destroy();
        this.bestText.destroy();
        this.scrollText.destroy();
        this.gameOverContainer.destroy();
    }
}
