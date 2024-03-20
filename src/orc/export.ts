import { SceneEnums } from "../shared/repository";
import { SceneUtil } from "../shared/util";
import { GrillFoodTexture, OrcTexture, OrcMinecartTexture } from "./textures";

export function preloadOrc(scene: Phaser.Scene) {
    GrillFoodTexture.preload(scene)
    OrcTexture.preload(scene)
    OrcMinecartTexture.preload(scene)

    SceneUtil.preloadTilemap(scene, SceneEnums.Tilemap.OrcMinigame, "orc/minigame.tmj", "orc/orc.png")
    SceneUtil.preloadTilemap(scene, SceneEnums.Tilemap.OrcHub, "orc/hub.tmj", "elf/2.png", "goblin/cutscene.png", "orc/hub.png")

    scene.load.audio(SceneEnums.Music.OrcMinigame, "/music/orcminigame.mp3")
}

export function loadOrc(scene: Phaser.Scene) {
    GrillFoodTexture.load(scene)
    OrcTexture.load(scene)
    OrcMinecartTexture.load(scene)
}