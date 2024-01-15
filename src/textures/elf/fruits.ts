let PRELOADED = false

export namespace FruitsTexture {
    export const TextureKey = "fruits"
    export const Frames = {
        Pumpkin: {
            Base: "fruit_4",
            Core1: "fruit_5",
            Core2: "fruit_6",
            Core3: "fruit_7",
            Core4: "fruit_8",
            Chunk1: "fruit_11",
            Chunk2: "fruit_12",
            Chunk3: "fruit_13",
            Chunk4: "fruit_14"
        },
        Apple: {
            Base: "fruit_1",
            Core1: "fruit_2",
            Core2: "fruit_3",
            Chunk1: "fruit_9",
            Chunk2: "fruit_10"

        }
    }

    export function preload(scene: Phaser.Scene) {
        if (PRELOADED) return
        PRELOADED = true
        scene.load.atlas(TextureKey, "/textures/fruits.png", "/textures/fruits.json")
    }

    export function load(scene: Phaser.Scene) {
        scene;
    }
}