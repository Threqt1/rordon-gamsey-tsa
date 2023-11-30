let PRELOADED = false
let LOADED = false

export namespace ElvesTexture {
    export const TextureKey = "elf"
    export const Animations = {
        Idle: TextureKey + "-idle",
        IdleAlt: TextureKey + "-idle-alt"
    }

    export function preload(scene: Phaser.Scene) {
        if (PRELOADED) return
        PRELOADED = true
        scene.load.atlas(TextureKey, "/textures/elf.png", "/textures/elf.json");
    }

    export function load(scene: Phaser.Scene) {
        if (LOADED) return
        LOADED = true
        scene.anims.create({
            key: Animations.Idle,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 1, end: 6, prefix: "elf1_" }),
            repeat: -1,
            frameRate: 5
        })

        scene.anims.create({
            key: Animations.IdleAlt,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 1, end: 6, prefix: "elf2_" }),
            repeat: -1,
            frameRate: 5
        })
    }
}