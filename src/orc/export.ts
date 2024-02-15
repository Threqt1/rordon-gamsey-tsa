import { SceneEnums } from "../shared/repository";
import { SceneUtil } from "../shared/util";

export function preloadOrc(scene: Phaser.Scene) {
    SceneUtil.preloadTilemap(scene, SceneEnums.Tilemap.OrcMinigame, "orc/minigame.tmj", "orc/orc.png")
}

export function loadOrc(scene: Phaser.Scene) {
    scene;
}