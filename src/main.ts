import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { GameScene } from './scenes/GameScene';

// Calculate base dimensions for 1080p quality on portrait mobile
const getGameDimensions = () => {
  const isPortrait = window.innerHeight > window.innerWidth;
  if (isPortrait) {
    // Portrait: 1080 width base, height scales with aspect ratio for sharp mobile display
    const aspectRatio = window.innerHeight / window.innerWidth;
    return { width: 1080, height: Math.round(1080 * aspectRatio) };
  } else {
    // Landscape: 1920x1080
    return { width: 1920, height: 1080 };
  }
};

const dims = getGameDimensions();

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  parent: 'game-container',
  backgroundColor: '#1a1a2e',
  scale: {
    mode: Phaser.Scale.FIT,
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
