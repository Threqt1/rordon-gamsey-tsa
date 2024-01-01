let PRELOADED = false
let LOADED = false

export namespace TorchesTexture {
    export const TextureKey = "torches"
    export const Animations = {

    }
    export const Frames = {
        Empty: "slash_37"
    }

    export function preload(scene: Phaser.Scene) {
        if (PRELOADED) return
        PRELOADED = true
        scene.load.atlas(TextureKey, "/textures/slashes2.png", "/textures/slashes2.json")
    }

    export function load(scene: Phaser.Scene) {
        if (LOADED) return
        LOADED = true
        scene;
        // scene.anims.create({
        //     key: Animations.Hit1,
        //     frames: scene.anims.generateFrameNames(TextureKey, { start: 1, end: 5, prefix: "hit1_" }),
        //     frameRate: 12,
        // })
        // scene.anims.create({
        //     key: Animations.Hit2,
        //     frames: scene.anims.generateFrameNames(TextureKey, { start: 1, end: 5, prefix: "hit2_" }),
        //     frameRate: 12,
        // })
        // scene.anims.create({
        //     key: Animations.Hit3,
        //     frames: scene.anims.generateFrameNames(TextureKey, { start: 1, end: 5, prefix: "hit3_" }),
        //     frameRate: 12,
        // })
    }
}