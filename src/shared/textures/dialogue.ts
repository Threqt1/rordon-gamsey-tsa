let PRELOADED = false

export namespace DialogueTexture {
    export const TextureKey = "dialogue"
    export const Frames = {
        Box: TextureKey + "_box"
    }

    export function preload(scene: Phaser.Scene) {
        if (PRELOADED) return
        PRELOADED = true
        scene.load.image(Frames.Box, "/img/dialogue.png")
    }

    export function load(scene: Phaser.Scene) {
        scene;
    }
}