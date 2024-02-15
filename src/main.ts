import './style.css'

import { Game } from 'phaser';
import PhaserRaycaster from "phaser-raycaster"
import { PluginEnums } from './shared/repository';
import { AnimatedTilesPlugin, SpritesPlugin } from './shared/systems';
import { GUIScene, PreloaderScene } from './shared/scenes';
import { MenuScene } from './shared/scenes/menu';
import { ElfHubScene, ElfMinigameScene, ElfPostMinigameScene } from './elf/scenes';
import { GoblinLevel, GoblinMinigame } from './goblin/scenes';
import { FinalScene } from './final/scenes';
import { OrcMinigameScene } from './orc/scenes';

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
        ElfMinigameScene,
        ElfPostMinigameScene,
        GoblinMinigame.Scene,
        GoblinLevel.Scene,
        GUIScene,
        ElfHubScene.ElfHubScene,
        OrcMinigameScene,
        FinalScene.Scene

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