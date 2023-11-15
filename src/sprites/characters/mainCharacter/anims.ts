import { MainCharacterTextures } from "./textures"

export function createMainCharacterAnimations(anims: Phaser.Animations.AnimationManager) {
    anims.create({
        key: MainCharacterTextures.IdleFront,
        frames: anims.generateFrameNames(MainCharacterTextures.Key, { start: 0, end: 5, prefix: "player_", suffix: ".png" }),
        repeat: -1,
        frameRate: 5
    })

    anims.create({
        key: MainCharacterTextures.IdleSide,
        frames: anims.generateFrameNames(MainCharacterTextures.Key, { start: 6, end: 11, prefix: "player_", suffix: ".png" }),
        repeat: -1,
        frameRate: 5
    })

    anims.create({
        key: MainCharacterTextures.IdleBack,
        frames: anims.generateFrameNames(MainCharacterTextures.Key, { start: 12, end: 17, prefix: "player_", suffix: ".png" }),
        repeat: -1,
        frameRate: 5
    })

    anims.create({
        key: MainCharacterTextures.WalkFront,
        frames: anims.generateFrameNames(MainCharacterTextures.Key, { start: 18, end: 23, prefix: "player_", suffix: ".png" }),
        repeat: -1,
        frameRate: 10
    })

    anims.create({
        key: MainCharacterTextures.WalkSide,
        frames: anims.generateFrameNames(MainCharacterTextures.Key, { start: 24, end: 29, prefix: "player_", suffix: ".png" }),
        repeat: -1,
        frameRate: 10
    })

    anims.create({
        key: MainCharacterTextures.WalkBack,
        frames: anims.generateFrameNames(MainCharacterTextures.Key, { start: 30, end: 35, prefix: "player_", suffix: ".png" }),
        repeat: -1,
        frameRate: 10
    })
}