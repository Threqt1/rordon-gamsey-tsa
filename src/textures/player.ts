export namespace PlayerTexture {
    export const TextureKey = "player"
    export const Animations = {
        IdleFront: TextureKey + "-idle-front",
        IdleSide: TextureKey + "-idle-side",
        IdleBack: TextureKey + "-idle-back",
        WalkFront: TextureKey + "-walk-front",
        WalkSide: TextureKey + "-walk-side",
        WalkBack: TextureKey + "-walk-back"
    }

    export function preload(scene: Phaser.Scene) {
        scene.load.atlas(TextureKey, "/textures/player.png", "/textures/player.json");
    }

    export function load(scene: Phaser.Scene) {
        scene.anims.create({
            key: Animations.IdleFront,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 0, end: 5, prefix: "player_", suffix: ".png" }),
            repeat: -1,
            frameRate: 5
        })

        scene.anims.create({
            key: Animations.IdleSide,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 6, end: 11, prefix: "player_", suffix: ".png" }),
            repeat: -1,
            frameRate: 5
        })

        scene.anims.create({
            key: Animations.IdleBack,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 12, end: 17, prefix: "player_", suffix: ".png" }),
            repeat: -1,
            frameRate: 5
        })

        scene.anims.create({
            key: Animations.WalkFront,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 18, end: 23, prefix: "player_", suffix: ".png" }),
            repeat: -1,
            frameRate: 10
        })

        scene.anims.create({
            key: Animations.WalkSide,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 24, end: 29, prefix: "player_", suffix: ".png" }),
            repeat: -1,
            frameRate: 10
        })

        scene.anims.create({
            key: Animations.WalkBack,
            frames: scene.anims.generateFrameNames(TextureKey, { start: 30, end: 35, prefix: "player_", suffix: ".png" }),
            repeat: -1,
            frameRate: 10
        })
    }
}