import './style.css'

import { Game } from 'phaser';
import PhaserRaycaster from "phaser-raycaster"
import { PreloaderScene, MenuScene, GameScene, GUIScene } from './scenes';
import { ElfHubScene, ElfMinigameScene, ElfPostMinigameScene } from './scenes/elf';
import { GoblinMinigameScene, GoblinMinigameLevelScene } from './scenes/goblin';
import { SpritesPlugin, PluginEnums, AnimatedTiles } from './plugins';
import { FinalScene } from './scenes/final';

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
        ElfMinigameScene,
        ElfPostMinigameScene,
        GoblinMinigameScene,
        GoblinMinigameLevelScene,
        GUIScene,
        ElfHubScene,
        FinalScene

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
        },
        {
            key: PluginEnums.PluginNames.AnimatedTilesPlugin,
            plugin: AnimatedTiles,
            mapping: PluginEnums.PluginKeys.AnimatedTilesPlugin
        }]
    },
    pixelArt: true,
    antialias: false
}

new Game(config);