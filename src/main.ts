import './style.css'

import { Game } from 'phaser';
import { PreloaderScene, MenuScene, GameScene, GUIScene } from './scenes';
import { ElfMinigameScene } from './scenes/elf';
import { DebugPlugin, SpritesPlugin, PluginEnums } from './plugins';
import PhaserRaycaster from "phaser-raycaster"
import { GoblinMinigameScene } from './scenes/goblin';


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
        ElfMinigameScene,
        GoblinMinigameScene,
        GUIScene
    ],
    plugins: {
        scene: [{
            key: PluginEnums.PluginNames.RaycasterPlugin,
            plugin: PhaserRaycaster,
            mapping: PluginEnums.PluginKeys.RaycasterPlugin
        },
        {
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
    antialias: false
}

/*
add cleanup for scenes
add VFX, screen shake, particles
add points, timing, transition level
dialogue
*/

new Game(config);