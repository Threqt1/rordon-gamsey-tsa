let PRELOADED = false
let LOADED = false

export namespace SlashesTexture {
    export const TextureKey = "slashes"
    export const Animations = {
        SideStraight: TextureKey + "-slash-1",
        Vertical: TextureKey + "-slash-2",
        Diagonal: TextureKey + "-slash-3",
        SideCurved: TextureKey + "-slash-4"
        // Hit1: TextureKey + "-hit-1",
        // Hit2: TextureKey + "-hit-2",
        // Hit3: TextureKey + "-hit-3"
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
        scene.anims.create({
            key: Animations.SideStraight,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 1, end: 9, prefix: "slash_" }),
            frameRate: 30,
        })
        scene.anims.create({
            key: Animations.Vertical,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 10, end: 17, prefix: "slash_" }),
            frameRate: 30,
        })
        scene.anims.create({
            key: Animations.SideCurved,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 18, end: 26, prefix: "slash_" }),
            frameRate: 30,
        })
        scene.anims.create({
            key: Animations.Diagonal,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 27, end: 36, prefix: "slash_" }),
            frameRate: 30,
        })
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