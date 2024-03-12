let PRELOADED = false
let LOADED = false

export namespace GrillFoodTexture {
    export const TextureKey = "grillfood"
    export const Frames = {
        Burger: {
            Unflipped: "burger_1",
            Flipped: "burger_15",
            FlipAnimation: "burger-flip"
        }
    }

    export function preload(scene: Phaser.Scene) {
        if (PRELOADED) return
        PRELOADED = true
        scene.load.atlas(TextureKey, "/textures/burger.png", "/textures/burger.json");
    }

    export function load(scene: Phaser.Scene) {
        if (LOADED) return
        LOADED = true
        scene.anims.create({
            key: Frames.Burger.FlipAnimation,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 1, end: 15, prefix: "burger_" }),
            frameRate: 20
        })
    }
}