import { SceneEnums } from "../shared/repository";
import { SceneUtil } from "../shared/util";
import { GrillFoodTexture } from "./textures/grillfood";

export function preloadOrc(scene: Phaser.Scene) {
    GrillFoodTexture.preload(scene)

    SceneUtil.preloadTilemap(scene, SceneEnums.Tilemap.OrcMinigame, "orc/minigame.tmj", "orc/orc.png")
    SceneUtil.preloadTilemap(scene, SceneEnums.Tilemap.OrcHub, "orc/hub.tmj", "elf/2.png", "goblin/cutscene.png", "orc/hub.png")
}

export function loadOrc(scene: Phaser.Scene) {
    GrillFoodTexture.load(scene)
}