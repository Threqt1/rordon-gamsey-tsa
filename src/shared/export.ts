import { SceneEnums } from "../shared/repository";
import { DialogueTexture, FoodTexture, KeyboardTexture, PlayerTexture } from "./textures";

export function preloadShared(scene: Phaser.Scene) {
    PlayerTexture.preload(scene)
    KeyboardTexture.preload(scene)
    DialogueTexture.preload(scene)
    FoodTexture.preload(scene)

    scene.load.audio(SceneEnums.Music.Main, "/music/main.mp3")
}

export function loadShared(scene: Phaser.Scene) {
    PlayerTexture.load(scene)
    KeyboardTexture.load(scene)
    DialogueTexture.load(scene)
    FoodTexture.load(scene)
}