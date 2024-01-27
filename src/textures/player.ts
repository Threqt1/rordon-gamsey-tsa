let PRELOADED = false
let LOADED = false

export namespace PlayerTexture {
    export const TextureKey = "player"
    export const Animations = {
        IdleFront: TextureKey + "-idle-front",
        IdleRight: TextureKey + "-idle-right",
        IdleLeft: TextureKey + "-idle-left",
        IdleBack: TextureKey + "-idle-back",
        WalkFront: TextureKey + "-walk-front",
        WalkRight: TextureKey + "-walk-right",
        WalkLeft: TextureKey + "-walk-left",
        WalkBack: TextureKey + "-walk-back"
    }

    export function preload(scene: Phaser.Scene) {
        if (PRELOADED) return
        PRELOADED = true
        scene.load.atlas(TextureKey, "/textures/player.png", "/textures/player.json");
    }

    export function load(scene: Phaser.Scene) {
        if (LOADED) return
        LOADED = true
        scene.anims.create({
            key: Animations.IdleFront,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 1, end: 4, prefix: "player_" }),
            repeat: -1,
            frameRate: 5
        })

        scene.anims.create({
            key: Animations.WalkFront,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 5, end: 10, prefix: "player_" }),
            repeat: -1,
            frameRate: 10
        })

        scene.anims.create({
            key: Animations.IdleRight,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 11, end: 14, prefix: "player_" }),
            repeat: -1,
            frameRate: 5
        })

        scene.anims.create({
            key: Animations.WalkRight,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 15, end: 20, prefix: "player_" }),
            repeat: -1,
            frameRate: 10
        })

        scene.anims.create({
            key: Animations.IdleBack,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 21, end: 24, prefix: "player_" }),
            repeat: -1,
            frameRate: 5
        })

        scene.anims.create({
            key: Animations.WalkBack,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 25, end: 30, prefix: "player_" }),
            repeat: -1,
            frameRate: 10
        })

        scene.anims.create({
            key: Animations.IdleLeft,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 31, end: 34, prefix: "player_" }),
            repeat: -1,
            frameRate: 5
        })

        scene.anims.create({
            key: Animations.WalkLeft,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 35, end: 40, prefix: "player_" }),
            repeat: -1,
            frameRate: 10
        })
    }

    export function configurePlayerPhysicsBody(body: Phaser.Physics.Arcade.Body): void {
        body.setSize(10, 16).setOffset(3, 15)
    }
}