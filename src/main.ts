import './style.css'

import { Game } from 'phaser';
import { PreloaderScene, MenuScene, GameScene } from './scenes';
import { ElfMinigameScene } from './scenes/elf';
import { DebugPlugin, SpritesPlugin, PluginEnums } from './plugins';

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
        GameScene,
        ElfMinigameScene
    ],
    plugins: {
        scene: [{
            key: PluginEnums.PluginNames.DebugPlugin,
            plugin: DebugPlugin,
            mapping: PluginEnums.PluginKeys.DebugPlugin
        },
        {
            key: PluginEnums.PluginNames.SpritePlugin,
            plugin: SpritesPlugin,
            mapping: PluginEnums.PluginKeys.SpritePlugin
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