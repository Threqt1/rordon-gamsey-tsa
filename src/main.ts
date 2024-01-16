import './style.css'

import { Game } from 'phaser';
import PhaserRaycaster from "phaser-raycaster"
import { PreloaderScene, MenuScene, GameScene, GUIScene } from './scenes';
import { ElfHubScene, ElfMinigameScene } from './scenes/elf';
import { GoblinMinigameScene } from './scenes/goblin';
import { SpritesPlugin, PluginEnums } from './plugins';


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
        GUIScene,
        ElfHubScene

    ],
    plugins: {
        scene: [{
            key: PluginEnums.PluginNames.RaycasterPlugin,
            plugin: PhaserRaycaster,
            mapping: PluginEnums.PluginKeys.RaycasterPlugin
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

new Game(config);