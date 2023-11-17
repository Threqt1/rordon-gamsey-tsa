export namespace TestNPCTextures {
    export const TextureKey = "testNPC"

    export enum Animations {
        Idle = TextureKey + "-idle",
    }

    export function makeAnimations(anims: Phaser.Animations.AnimationManager) {
        anims.create({
            key: TestNPCTextures.Animations.Idle,
            frames: anims.generateFrameNames(TestNPCTextures.TextureKey, { start: 0, end: 5, prefix: "player_", suffix: ".png" }),
            repeat: -1,
            frameRate: 5
        })
    }
}