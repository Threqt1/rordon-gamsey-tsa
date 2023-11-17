import './style.css'
import { Game, AUTO } from 'phaser';

import { GameScene, PreloaderScene, MenuScene } from './scenes';
import { DebugScenePlugin, InteractionScenePlugin } from './plugins';
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
            plugin: DebugScenePlugin,
            mapping: PluginKeys.DebugPlugin
        },
        {
            key: PluginNames.InteractionPlugin,
            plugin: InteractionScenePlugin,
            mapping: PluginKeys.InteractionPlugin
        }]
    },
    pixelArt: true
}

/*
sprites - register animations, enums for all animations to play, textures
controllers - logic for the character, moving, interacting, etc
    - Controllable Interface - can be moved and controlled
    - Interactable Interface - can be interacted with
*/

new Game(config);