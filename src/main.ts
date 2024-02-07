import './style.css'

import { Game } from 'phaser';
import PhaserRaycaster from "phaser-raycaster"
import { PreloaderScene, MenuScene, GameScene, GUIScene } from './scenes';
import { ElfHubScene, ElfMinigameScene, ElfPostMinigameScene } from './scenes/elf';
import { GoblinMinigameScene, GoblinMinigameLevelScene } from './scenes/goblin';
import { FinalScene } from './scenes/final';
import { PluginEnums } from './game/repository';
import { AnimatedTilesPlugin, SpritesPlugin } from './game/systems';

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
            key: PluginEnums.Name.RaycasterPlugin,
            plugin: PhaserRaycaster,
            mapping: PluginEnums.Key.RaycasterPlugin
        },
        {
            key: PluginEnums.Name.SpritePlugin,
            plugin: SpritesPlugin.Plugin,
            mapping: PluginEnums.Key.SpritePlugin
        },
        {
            key: PluginEnums.Name.AnimatedTilesPlugin,
            plugin: AnimatedTilesPlugin,
            mapping: PluginEnums.Key.AnimatedTilesPlugin
        }]
    },
    pixelArt: true,
    antialias: false
}

new Game(config);