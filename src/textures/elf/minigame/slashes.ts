let PRELOADED = false
let LOADED = false

export namespace SlashesTexture {
    export const TextureKey = "slashes"
    export const Animations = {
        Slash1: TextureKey + "-slash-1",
        Slash2: TextureKey + "-slash-2",
        Slash3: TextureKey + "-slash-3",
        Hit1: TextureKey + "-hit-1",
        Hit2: TextureKey + "-hit-2",
        Hit3: TextureKey + "-hit-3"
    }
    export const Frames = {
        Empty: "slash1_5"
    }

    export function preload(scene: Phaser.Scene) {
        if (PRELOADED) return
        PRELOADED = true
        scene.load.atlas(TextureKey, "/textures/slashes.png", "/textures/slashes.json")
    }

    export function load(scene: Phaser.Scene) {
        if (LOADED) return
        LOADED = true
        scene.anims.create({
            key: Animations.Slash1,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 1, end: 5, prefix: "slash1_" }),
            frameRate: 13,
        })
        scene.anims.create({
            key: Animations.Slash2,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 1, end: 5, prefix: "slash2_" }),
            frameRate: 13,
        })
        scene.anims.create({
            key: Animations.Slash3,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 1, end: 5, prefix: "slash3_" }),
            frameRate: 13,
        })
        scene.anims.create({
            key: Animations.Hit1,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 1, end: 5, prefix: "hit1_" }),
            frameRate: 12,
        })
        scene.anims.create({
            key: Animations.Hit2,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 1, end: 5, prefix: "hit2_" }),
            frameRate: 12,
        })
        scene.anims.create({
            key: Animations.Hit3,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 1, end: 5, prefix: "hit3_" }),
            frameRate: 12,
        })
    }
}