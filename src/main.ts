import './style.css'
import { Game, AUTO } from 'phaser';

import { GameScene, PreloaderScene, MenuScene } from './scenes';
import { DebugPlugin } from './plugins';
import { PluginKeys, PluginNames } from './enums/pluginNames';

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
        MenuScene,
        GameScene
    ],
    plugins: {
        scene: [{
            key: PluginNames.DebugPlugin,
            plugin: DebugPlugin,
            mapping: PluginKeys.DebugPlugin
        }]
    },
    pixelArt: true
}

new Game(config);