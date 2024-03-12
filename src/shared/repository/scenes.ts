export namespace SceneEnums {
    export enum Name {
        Preloader = "preloader",
        Menu = "menu",
        Initial = "initial",
        ElfHub = "elfhub",
        ElfMinigame = "elfminigame",
        ElfPostMinigame = "elfpostminigame",
        GoblinMinigame = "goblinminigame",
        GoblinMinigameLevel = "goblinminigamelevel",
        GoblinPostMinigame = "goblinpostminigame",
        OrcCutscene1 = "orccutscene1",
        Final = "final",
        GUI = "gui"
    }
    export enum Tilemap {
        GoblinMinigameLevel1 = "goblinminigame1",
        GoblinMinigameLevel2 = "goblinminigame2",
        GoblinMinigameLevel3 = "goblinminigame3",
        ElfMinigame = "elfminigame",
        ElfHub = "elfhub",
        OrcMinigame = "orcminigame",
        GoblinPostMinigame = "goblinpostminigame",
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