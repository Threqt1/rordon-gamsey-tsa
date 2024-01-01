let PRELOADED = false
let LOADED = false

export namespace TorchesTexture {
    export const TextureKey = "torches"
    export const Animations = {
        Torch1Light: "-torch1-light",
        Torch2Light: "-torch2-light",
        Torch3Light: "-torch3-light",
        Torch4Light: "-torch4-light",
        Torch5Light: "-torch5-light",
        Torch1Idle: "-torch1-idle",
        Torch2Idle: "-torch2-idle",
        Torch3Idle: "-torch3-idle",
        Torch4Idle: "-torch4-idle",
        Torch5Idle: "-torch5-idle",
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
            key: Animations.Torch1Light,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 1, end: 2, prefix: "torch1_" }),
            frameRate: 5
        })
        scene.anims.create({
            key: Animations.Torch2Light,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 1, end: 3, prefix: "torch2_" }),
            frameRate: 5
        })
        scene.anims.create({
            key: Animations.Torch3Light,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 1, end: 4, prefix: "torch3_" }),
            frameRate: 5
        })
        scene.anims.create({
            key: Animations.Torch4Light,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 1, end: 4, prefix: "torch4_" }),
            frameRate: 5
        })
        scene.anims.create({
            key: Animations.Torch5Light,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 1, end: 6, prefix: "torch5_" }),
            frameRate: 5
        })

        scene.anims.create({
            key: Animations.Torch1Idle,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 3, end: 5, prefix: "torch1_" }),
            frameRate: 5,
            repeat: -1
        })
        scene.anims.create({
            key: Animations.Torch2Idle,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 5, end: 7, prefix: "torch2_" }),
            frameRate: 5,
            repeat: -1
        })
        scene.anims.create({
            key: Animations.Torch3Idle,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 7, end: 9, prefix: "torch3_" }),
            frameRate: 5,
            repeat: -1
        })
        scene.anims.create({
            key: Animations.Torch4Idle,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 7, end: 9, prefix: "torch4_" }),
            frameRate: 5,
            repeat: -1
        })
        scene.anims.create({
            key: Animations.Torch5Idle,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 11, end: 13, prefix: "torch5_" }),
            frameRate: 5,
            repeat: -1
        })
    }
}