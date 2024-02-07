export namespace SceneEnums {
    export enum Name {
        Preloader = "preloader",
        Menu = "menu",
        Game = "game",
        ElfHub = "elfhub",
        ElfMinigame = "elfminigame",
        ElfPostMinigame = "elfpostminigame",
        GoblinMinigame = "goblinminigame",
        GoblinMinigameLevel = "goblinminigamelevel",
        Final = "final",
        GUI = "gui"
    }
    export enum Tilemap {
        Game = "game",
        GoblinMinigameLevel1 = "goblinminigame1",
        GoblinMinigameLevel2 = "goblinminigame2",
        GoblinMinigameLevel3 = "goblinminigame3",
        ElfMinigame = "elfminigame",
        ElfHub = "elfhub",
        Final = "final"
    }
    export enum Music {
        Main = "main",
        ElfNeutral = "elfneutral",
        ElfMinigame = "elfminigame",
        GoblinNeutral = "goblinneutral",
        GoblinAlerted = "goblinalerted",
        Final = "final"
    }
    export enum CollisionCategory {
        MAP = 1,
        INTERACTABLE,
        CONTROLLABLE,
        INTERACTION_ZONE
    }
}