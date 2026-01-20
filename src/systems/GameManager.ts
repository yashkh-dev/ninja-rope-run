// Game Manager - State machine, score, persistence

import { CONFIG } from '../config/GameConfig';

export type GamePhase = 'PLAYING' | 'GAME_OVER';

class GameManagerClass {
    private static instance: GameManagerClass;

    public phase: GamePhase = 'PLAYING';
    public score: number = 0;
    public bestScore: number = 0;
    public scrollsCollected: number = 0;
    public distanceTraveled: number = 0;
    public currentSpeed: number = CONFIG.baseSpeed;
    public difficultyLevel: number = 0;
    public gameTime: number = 0;

    private constructor() {
        this.loadBestScore();
    }

    public static getInstance(): GameManagerClass {
        if (!GameManagerClass.instance) {
            GameManagerClass.instance = new GameManagerClass();
        }
        return GameManagerClass.instance;
    }

    public reset(): void {
        this.phase = 'PLAYING';
        this.score = 0;
        this.scrollsCollected = 0;
        this.distanceTraveled = 0;
        this.currentSpeed = CONFIG.baseSpeed;
        this.difficultyLevel = 0;
        this.gameTime = 0;
    }

    public update(delta: number, playerX: number, startX: number): void {
        if (this.phase !== 'PLAYING') return;

        this.gameTime += delta;

        // Update distance
        this.distanceTraveled = Math.max(0, playerX - startX);

        // Calculate score
        this.score = Math.floor(
            this.distanceTraveled * CONFIG.distanceScoreMultiplier +
            this.scrollsCollected * CONFIG.scrollValue
        );

        // Speed ramp
        const speedIncrease = (delta / 1000) * CONFIG.speedRampPerSecond;
        this.currentSpeed = Math.min(CONFIG.maxSpeed, this.currentSpeed + speedIncrease);

        // Difficulty ramp
        const newDifficultyLevel = Math.floor(this.gameTime / CONFIG.difficultyRampInterval);
        if (newDifficultyLevel > this.difficultyLevel) {
            this.difficultyLevel = newDifficultyLevel;
            this.currentSpeed = Math.min(
                CONFIG.maxSpeed,
                this.currentSpeed + CONFIG.speedIncreasePerRamp
            );
        }
    }

    public collectScroll(): void {
        this.scrollsCollected++;
    }

    public triggerGameOver(): void {
        this.phase = 'GAME_OVER';
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            this.saveBestScore();
        }
    }

    public getSpikeChance(): number {
        return Math.min(
            CONFIG.spikeChanceMax,
            CONFIG.spikeChanceStart + this.difficultyLevel * CONFIG.spikeChanceIncreasePerRamp
        );
    }

    public getGapRange(): { min: number; max: number } {
        const increase = this.difficultyLevel * CONFIG.gapIncreasePerRamp;
        return {
            min: CONFIG.gapMin + increase * 0.5,
            max: CONFIG.gapMax + increase
        };
    }

    private loadBestScore(): void {
        try {
            const saved = localStorage.getItem('ninja-rope-run-best');
            if (saved) {
                this.bestScore = parseInt(saved, 10) || 0;
            }
        } catch (e) {
            console.warn('Could not load best score');
        }
    }

    private saveBestScore(): void {
        try {
            localStorage.setItem('ninja-rope-run-best', this.bestScore.toString());
        } catch (e) {
            console.warn('Could not save best score');
        }
    }
}

export const GameManager = GameManagerClass.getInstance();
