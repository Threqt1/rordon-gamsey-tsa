let PRELOADED = false

export namespace ItemsTexture {
    export const TextureKey = "items"
    export const Frames = {
        Pumpkin: {
            Base: "Pumpkin_1",
            Core1: "Pumpkin_2",
            Core2: "Pumpkin_4",
            Core3: "Pumpkin_6",
            Core4: "Pumpkin_8",
            Chunk1: "Pumpkin_3",
            Chunk2: "Pumpkin_5",
            Chunk3: "Pumpkin_7",
            Chunk4: "Pumpkin_9"
        },
        Apple: {
            Base: "Apple_1",
            Core1: "Apple_3",
            Core2: "Apple_5",
            Chunk1: "Apple_2",
            Chunk2: "Apple_4"

        }
    }

    export function preload(scene: Phaser.Scene) {
        if (PRELOADED) return
        PRELOADED = true
        scene.load.atlas(TextureKey, "/textures/items.png", "/textures/items.json")
    }

    export function load(scene: Phaser.Scene) {
        scene;
    }
}