import './style.css'
import { Game, AUTO } from 'phaser';

import GameScene from "./scenes/game"
import PreloaderScene from "./scenes/preloader"
import DebugScenePlugin from './plugins/DebugScenePlugin';
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
        GameScene
    ],
    plugins: {
        scene: [{
            key: PluginNames.DebugPlugin,
            plugin: DebugScenePlugin,
            mapping: PluginKeys.DebugPlugin
        }]
    },
    pixelArt: true
}

new Game(config);