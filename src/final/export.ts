import { SceneEnums } from "../shared/repository";
import { SceneUtil } from "../shared/util";

export function preloadFinal(scene: Phaser.Scene) {
    SceneUtil.preloadTilemap(scene, SceneEnums.Tilemap.Final, "final/castle.tmj", "final/castle.png")

    scene.load.audio(SceneEnums.Music.Final, "/music/final.mp3")
}

export function loadFinal(scene: Phaser.Scene) {
    scene;
}