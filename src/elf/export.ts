import { SceneEnums } from "../shared/repository";
import { SceneUtil } from "../shared/util";
import { ElfTexture, FruitsTexture, SlashesTexture, TorchesTexture } from "./textures";

export function preloadElf(scene: Phaser.Scene) {
    SceneUtil.preloadTilemap(scene, SceneEnums.Tilemap.ElfMinigame, "elf/minigame.tmj", "elf/1.png", "elf/2.png")
    SceneUtil.preloadTilemap(scene, SceneEnums.Tilemap.ElfHub, "elf/hub.tmj", "elf/2.png", "goblin/goblin.png")

    ElfTexture.preload(scene)
    FruitsTexture.preload(scene)
    SlashesTexture.preload(scene)
    TorchesTexture.preload(scene)

    scene.load.audio(SceneEnums.Music.ElfNeutral, "/music/elfneutral.mp3")
    scene.load.audio(SceneEnums.Music.ElfMinigame, "/music/elfminigame.mp3")
}

export function loadElf(scene: Phaser.Scene) {
    ElfTexture.load(scene)
    FruitsTexture.load(scene)
    SlashesTexture.load(scene)
    TorchesTexture.load(scene)
}