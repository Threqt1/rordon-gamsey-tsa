import { SceneEnums } from "../shared/repository";
import { SceneUtil } from "../shared/util";
import { GrillFoodTexture } from "./textures/grillfood";

export function preloadOrc(scene: Phaser.Scene) {
    GrillFoodTexture.preload(scene)

    SceneUtil.preloadTilemap(scene, SceneEnums.Tilemap.OrcMinigame, "orc/minigame.tmj", "orc/orc.png")
}

export function loadOrc(scene: Phaser.Scene) {
    GrillFoodTexture.load(scene)
}