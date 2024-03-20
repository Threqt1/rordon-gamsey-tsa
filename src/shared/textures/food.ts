let PRELOADED = false

export namespace FoodTexture {
    export const TextureKey = "food"
    export const Frames = {
        Goblin: TextureKey + "_goblin",
        Elf: TextureKey + "_elf",
        Orc: TextureKey + "_orc",
        Player: TextureKey + "_player",
        GoblinMinigame: TextureKey + "_goblin_minigame"
    }

    export function preload(scene: Phaser.Scene) {
        if (PRELOADED) return
        PRELOADED = true
        scene.load.atlas(TextureKey, "/textures/food.png", "/textures/food.json")
    }

    export function load(scene: Phaser.Scene) {
        scene;
    }
}