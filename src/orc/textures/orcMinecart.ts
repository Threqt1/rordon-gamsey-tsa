let PRELOADED = false
let LOADED = false

export namespace OrcMinecartTexture {
    export const TextureKey = "orcminecart"
    export const Animations = {
        IdleRight: TextureKey + "-idle-right",
    }

    export function preload(scene: Phaser.Scene) {
        if (PRELOADED) return
        PRELOADED = true
        scene.load.atlas(TextureKey, "/textures/orc_minecart.png", "/textures/orc_minecart.json");
    }

    export function load(scene: Phaser.Scene) {
        if (LOADED) return
        LOADED = true
        scene.anims.create({
            key: Animations.IdleRight,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 0, end: 3, prefix: "orc_minecart_" }),
            repeat: -1,
            frameRate: 3
        })
    }
}