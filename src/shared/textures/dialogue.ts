let PRELOADED = false

export namespace DialogueTexture {
    export const TextureKey = "dialogue"
    export const Frames = {
        Left: TextureKey + "_left",
        Middle: TextureKey + "_middle",
        Right: TextureKey + "_right"
    }

    export function preload(scene: Phaser.Scene) {
        if (PRELOADED) return
        PRELOADED = true
        scene.load.image(Frames.Left, "/img/dialogue/left.png")
        scene.load.image(Frames.Middle, "/img/dialogue/middle.png")
        scene.load.image(Frames.Right, "/img/dialogue/right.png")
    }

    export function load(scene: Phaser.Scene) {
        scene;
    }
}