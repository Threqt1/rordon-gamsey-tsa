let PRELOADED = false
let LOADED = false

export namespace TorchesTexture {
    export const TextureKey = "torches"
    export const Animations = {
        Torch1: "-torch1",
        Torch2: "-torch2",
        Torch3: "-torch3",
        Torch4: "-torch4",
        Torch5: "-torch5"
    }
    export const Frames = {
        Torch1: "torch1_1",
        Torch2: "torch2_1",
        Torch3: "torch3_1",
        Torch4: "torch4_1",
        Torch5: "torch5_1"
    }

    export function preload(scene: Phaser.Scene) {
        if (PRELOADED) return
        PRELOADED = true
        scene.load.atlas(TextureKey, "/textures/torches.png", "/textures/torches.json")
    }

    export function load(scene: Phaser.Scene) {
        if (LOADED) return
        LOADED = true
        scene.anims.create({
            key: Animations.Torch1,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 1, end: 2, prefix: "torch1_" }),
            frameRate: 2
        })
        scene.anims.create({
            key: Animations.Torch2,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 1, end: 3, prefix: "torch2_" }),
            frameRate: 2
        })
        scene.anims.create({
            key: Animations.Torch3,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 1, end: 4, prefix: "torch3_" }),
            frameRate: 2
        })
        scene.anims.create({
            key: Animations.Torch4,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 1, end: 4, prefix: "torch4_" }),
            frameRate: 2
        })
        scene.anims.create({
            key: Animations.Torch5,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 1, end: 6, prefix: "torch5_" }),
            frameRate: 2
        })
    }
}