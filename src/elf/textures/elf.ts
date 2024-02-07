let PRELOADED = false
let LOADED = false

export namespace ElfTexture {
    export const TextureKey = "elf"
    export const Animations = {
        IdleFront: TextureKey + "-idle-front",
        IdleSide: TextureKey + "-idle-side",
        WalkFront: TextureKey + "-walk-front",
        WalkSide: TextureKey + "-walk-side"
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
            key: Animations.IdleFront,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 1, end: 4, prefix: "elf_" }),
            repeat: -1,
            frameRate: 3
        })
        scene.anims.create({
            key: Animations.WalkFront,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 5, end: 10, prefix: "elf_" }),
            repeat: -1,
            frameRate: 5
        })
        scene.anims.create({
            key: Animations.IdleSide,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 11, end: 14, prefix: "elf_" }),
            repeat: -1,
            frameRate: 3
        })
        scene.anims.create({
            key: Animations.WalkSide,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 15, end: 20, prefix: "elf_" }),
            repeat: -1,
            frameRate: 5
        })
    }
}