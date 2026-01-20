// UI Manager - HUD and Game Over panel

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

    private createHUD(): void {
        const { width } = this.scene.scale;

        // Score (top center)
        this.scoreText = this.scene.add.text(width / 2, 20, 'Score: 0', {
            fontSize: '24px',
            fontFamily: 'Arial, sans-serif',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(100);

        // Best score (top right)
        this.bestText = this.scene.add.text(width - 20, 20, `Best: ${GameManager.bestScore}`, {
            fontSize: '16px',
            fontFamily: 'Arial, sans-serif',
            color: '#ffd700',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(1, 0).setScrollFactor(0).setDepth(100);

        // Scroll count (top left)
        this.scrollText = this.scene.add.text(20, 20, '📜 0', {
            fontSize: '20px',
            fontFamily: 'Arial, sans-serif',
            color: '#f5deb3',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0, 0).setScrollFactor(0).setDepth(100);
    }

    private createGameOverPanel(): void {
        const { width, height } = this.scene.scale;

        this.gameOverContainer = this.scene.add.container(width / 2, height / 2);
        this.gameOverContainer.setScrollFactor(0);
        this.gameOverContainer.setDepth(200);
        this.gameOverContainer.setVisible(false);

        // Background panel
        const bg = this.scene.add.graphics();
        bg.fillStyle(0x000000, 0.85);
        bg.fillRoundedRect(-150, -120, 300, 240, 15);
        bg.lineStyle(3, 0xffd700);
        bg.strokeRoundedRect(-150, -120, 300, 240, 15);
        this.gameOverContainer.add(bg);

        // Title
        const title = this.scene.add.text(0, -85, 'GAME OVER', {
            fontSize: '32px',
            fontFamily: 'Arial, sans-serif',
            color: '#ff4444',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.gameOverContainer.add(title);

        // Score
        this.finalScoreText = this.scene.add.text(0, -30, 'Score: 0', {
            fontSize: '24px',
            fontFamily: 'Arial, sans-serif',
            color: '#ffffff'
        }).setOrigin(0.5);
        this.gameOverContainer.add(this.finalScoreText);

        // Best
        this.finalBestText = this.scene.add.text(0, 10, 'Best: 0', {
            fontSize: '20px',
            fontFamily: 'Arial, sans-serif',
            color: '#ffd700'
        }).setOrigin(0.5);
        this.gameOverContainer.add(this.finalBestText);

        // Retry button
        const retryBtn = this.scene.add.container(0, 70);

        const btnBg = this.scene.add.graphics();
        btnBg.fillStyle(0x4CAF50);
        btnBg.fillRoundedRect(-80, -25, 160, 50, 10);
        retryBtn.add(btnBg);

        const btnText = this.scene.add.text(0, 0, '🔄 RETRY', {
            fontSize: '22px',
            fontFamily: 'Arial, sans-serif',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        retryBtn.add(btnText);

        retryBtn.setSize(160, 50);
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
