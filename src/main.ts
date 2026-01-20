import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { GameScene } from './scenes/GameScene';

// Dynamic game dimensions that fill the screen
const getGameDimensions = () => {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  // Use device pixel ratio for sharp rendering
  return {
    width: Math.round(window.innerWidth * dpr),
    height: Math.round(window.innerHeight * dpr)
  };
};

const dims = getGameDimensions();

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  parent: 'game-container',
  backgroundColor: '#1a1a2e',
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: dims.width,
    height: dims.height
  },
  render: {
    pixelArt: false,
    antialias: true,
    antialiasGL: true,
    roundPixels: false
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false
    }
  },
  scene: [BootScene, GameScene],
  input: {
    activePointers: 2
  },
  fps: {
    target: 60,
    forceSetTimeOut: true
  }
};

new Phaser.Game(config);
