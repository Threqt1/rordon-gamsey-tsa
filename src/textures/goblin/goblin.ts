let PRELOADED = false
let LOADED = false

export namespace GoblinTexture {
    export const TextureKey = "goblin"
    export const Animations = {
        IdleFront: TextureKey + "-idle-front",
        IdleBack: TextureKey + "-idle-back",
        IdleLeft: TextureKey + "-idle-left",
        IdleRight: TextureKey + "-idle-right",
        WalkFront: TextureKey + "-walk-front",
        WalkBack: TextureKey + "-walk-back",
        WalkLeft: TextureKey + "-walk-left",
        WalkRight: TextureKey + "-walk-right",
    }

    export function preload(scene: Phaser.Scene) {
        if (PRELOADED) return
        PRELOADED = true
        scene.load.atlas(TextureKey, "/textures/goblin.png", "/textures/goblin.json");
    }

    export function load(scene: Phaser.Scene) {
        if (LOADED) return
        LOADED = true
        scene.anims.create({
            key: Animations.IdleFront,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 1, end: 4, prefix: "goblin_" }),
            repeat: -1,
            frameRate: 3
        })
        scene.anims.create({
            key: Animations.WalkFront,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 5, end: 10, prefix: "goblin_" }),
            repeat: -1,
            frameRate: 5
        })
        scene.anims.create({
            key: Animations.IdleRight,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 11, end: 14, prefix: "goblin_" }),
            repeat: -1,
            frameRate: 3
        })
        scene.anims.create({
            key: Animations.WalkRight,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 15, end: 18, prefix: "goblin_" }),
            repeat: -1,
            frameRate: 5
        })
        scene.anims.create({
            key: Animations.IdleBack,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 19, end: 24, prefix: "goblin_" }),
            repeat: -1,
            frameRate: 3
        })
        scene.anims.create({
            key: Animations.WalkBack,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 25, end: 28, prefix: "goblin_" }),
            repeat: -1,
            frameRate: 5
        })
        scene.anims.create({
            key: Animations.IdleLeft,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 29, end: 32, prefix: "goblin_" }),
            repeat: -1,
            frameRate: 3
        })
        scene.anims.create({
            key: Animations.WalkLeft,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 33, end: 36, prefix: "goblin_" }),
            repeat: -1,
            frameRate: 5
        })
    }

    export function configureGoblinPhysicsBody(body: Phaser.Physics.Arcade.Body): void {
        body.setSize(14, 14).setOffset(18, 17)
    }
}