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
        OrcMinigame = "orcminigame",
        OrcHub = "orchub",
        Final = "final",
        GUI = "gui"
    }
    export enum Tilemap {
        GoblinMinigameLevel1 = "goblinminigame1",
        GoblinLootroom = "goblinlootroom",
        ElfMinigame = "elfminigame",
        ElfHub = "elfhub",
        OrcMinigame = "orcminigame",
        OrcHub = "orchub",
        GoblinPostMinigame = "goblinpostminigame",
        Final = "final"
    }
    export enum Music {
        Main = "main",
        ElfNeutral = "elfneutral",
        ElfMinigame = "elfminigame",
        GoblinNeutral = "goblinneutral",
        GoblinAlerted = "goblinalerted",
        OrcMinigame = "orcminigame",
        Final = "final"
    }
    export enum CollisionCategory {
        MAP = 1,
        INTERACTABLE,
        CONTROLLABLE,
        INTERACTION_ZONE
    }
}