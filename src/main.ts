import './style.css'
import { Game } from 'phaser';

import { PreloaderScene, MenuScene, MinigameScene } from './scenes';
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
            //debug: true
        }
    },
    scene: [
        PreloaderScene,
        MenuScene,
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
add cleanup for scenes
add VFX, screen shake, particles
add points, timing, transition level
dialogue
*/

new Game(config);