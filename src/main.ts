import './style.css'
import { Game, AUTO } from 'phaser';

import GameScene from "./scenes/game"
import PreloaderScene from "./scenes/preloader"

const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: true
    }
  },
  scene: [
    PreloaderScene,
    GameScene
  ],
  pixelArt: true
}

new Game(config);