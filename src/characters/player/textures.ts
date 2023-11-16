export namespace PlayerTextures {
    export const TextureKey = "mainCharacter"

    export enum Animations {
        IdleFront = "mainCharacter-idle-front",
        IdleSide = "mainCharacter-idle-side",
        IdleBack = "mainCharacter-idle-back",
        WalkFront = "mainCharacter-walk-front",
        WalkSide = "mainCharacter-walk-side",
        WalkBack = "mainCharacter-walk-back"
    }

    export function makeAnimations(anims: Phaser.Animations.AnimationManager) {
        anims.create({
            key: PlayerTextures.Animations.IdleFront,
            frames: anims.generateFrameNames(PlayerTextures.TextureKey, { start: 0, end: 5, prefix: "player_", suffix: ".png" }),
            repeat: -1,
            frameRate: 5
        })

        anims.create({
            key: PlayerTextures.Animations.IdleSide,
            frames: anims.generateFrameNames(PlayerTextures.TextureKey, { start: 6, end: 11, prefix: "player_", suffix: ".png" }),
            repeat: -1,
            frameRate: 5
        })

        anims.create({
            key: PlayerTextures.Animations.IdleBack,
            frames: anims.generateFrameNames(PlayerTextures.TextureKey, { start: 12, end: 17, prefix: "player_", suffix: ".png" }),
            repeat: -1,
            frameRate: 5
        })

        anims.create({
            key: PlayerTextures.Animations.WalkFront,
            frames: anims.generateFrameNames(PlayerTextures.TextureKey, { start: 18, end: 23, prefix: "player_", suffix: ".png" }),
            repeat: -1,
            frameRate: 10
        })

        anims.create({
            key: PlayerTextures.Animations.WalkSide,
            frames: anims.generateFrameNames(PlayerTextures.TextureKey, { start: 24, end: 29, prefix: "player_", suffix: ".png" }),
            repeat: -1,
            frameRate: 10
        })

        anims.create({
            key: PlayerTextures.Animations.WalkBack,
            frames: anims.generateFrameNames(PlayerTextures.TextureKey, { start: 30, end: 35, prefix: "player_", suffix: ".png" }),
            repeat: -1,
            frameRate: 10
        })
    }
}