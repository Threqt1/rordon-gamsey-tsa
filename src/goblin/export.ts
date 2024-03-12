import { SceneEnums } from "../shared/repository";
import { SceneUtil } from "../shared/util";
import { CutsceneTexture, GoblinTexture } from "./textures";

export function preloadGoblin(scene: Phaser.Scene) {
    SceneUtil.preloadTilemap(scene, SceneEnums.Tilemap.GoblinMinigameLevel1, "goblin/map1.tmj", "goblin/goblin.png")
    SceneUtil.preloadTilemap(scene, SceneEnums.Tilemap.GoblinMinigameLevel2, "goblin/map2.tmj", "goblin/goblin.png")
    SceneUtil.preloadTilemap(scene, SceneEnums.Tilemap.GoblinMinigameLevel3, "goblin/map3.tmj", "goblin/goblin.png")
    SceneUtil.preloadTilemap(scene, SceneEnums.Tilemap.GoblinPostMinigame, "goblin/cutscene.tmj", "elf/2.png", "goblin/cutscene.png")

    GoblinTexture.preload(scene)
    CutsceneTexture.preload(scene)

    scene.load.audio(SceneEnums.Music.GoblinNeutral, "/music/goblinneutral.mp3")
    scene.load.audio(SceneEnums.Music.GoblinAlerted, "/music/goblinalerted.mp3")
}

export function loadGoblin(scene: Phaser.Scene) {
    GoblinTexture.load(scene)
    CutsceneTexture.load(scene)
}