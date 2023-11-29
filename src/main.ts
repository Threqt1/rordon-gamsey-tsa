import './style.css'
import { Game } from 'phaser';

import { PreloaderScene, MenuScene, Elf, GameScene } from './scenes';
import { DebugScenePlugin, SpritesScenePlugin } from './plugins';
import { PluginName, PluginKey } from './plugins/pluginsUtilities';

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
        Elf.ElfMinigameScene
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