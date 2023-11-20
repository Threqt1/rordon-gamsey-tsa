import './style.css'
import { Game, AUTO } from 'phaser';

import { GameScene, PreloaderScene, MenuScene, MinigameScene } from './scenes';
import { DebugScenePlugin, SpritesScenePlugin } from './plugins';
import { PluginKey, PluginName } from './enums/pluginNames';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.WEBGL,
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
        GameScene,
        MinigameScene
    ],
    plugins: {
        scene: [{
            key: PluginName.DebugPlugin,
            plugin: DebugScenePlugin,
            mapping: PluginKey.DebugPlugin
        },
        {
            key: PluginName.SpritePlugin,
            plugin: SpritesScenePlugin,
            mapping: PluginKey.SpritePlugin
        }]
    },
    pixelArt: true,
}

/*
sprites - register animations, enums for all animations to play, textures
controllers - logic for the character, moving, interacting, etc
    - Controllable Interface - can be moved and controlled
    - Interactable Interface - can be interacted with
*/

new Game(config);