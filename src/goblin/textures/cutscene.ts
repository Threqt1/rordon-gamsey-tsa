let PRELOADED = false
let LOADED = false

export namespace CutsceneTexture {
    export const TextureKey = "minecart"
    export const Frames = {
        Minecart: "minecart_1"
    }

    export function preload(scene: Phaser.Scene) {
        if (PRELOADED) return
        PRELOADED = true
        scene.load.atlas(TextureKey, "/textures/minecart.png", "/textures/minecart.json");
    }

    export function load(scene: Phaser.Scene) {
        if (LOADED) return
        LOADED = true
        scene;
    }
}