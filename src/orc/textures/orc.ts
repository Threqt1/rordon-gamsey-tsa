let PRELOADED = false
let LOADED = false

export namespace OrcTexture {
    export const TextureKey = "orc"
    export const Animations = {
        IdleFrontChef: TextureKey + "-idle-front-chef",
        IdleFrontNormal: TextureKey + "-idle-front-normal"
    }

    export function preload(scene: Phaser.Scene) {
        if (PRELOADED) return
        PRELOADED = true
        scene.load.atlas(TextureKey, "/textures/orc.png", "/textures/orc.json");
    }

    export function load(scene: Phaser.Scene) {
        if (LOADED) return
        LOADED = true
        scene.anims.create({
            key: Animations.IdleFrontChef,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 8, end: 11, prefix: "orc_" }),
            repeat: -1,
            frameRate: 3
        })
        scene.anims.create({
            key: Animations.IdleFrontNormal,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 19, end: 22, prefix: "orc_" }),
            repeat: -1,
            frameRate: 3
        })
    }
}