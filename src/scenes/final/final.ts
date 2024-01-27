import { PointObject, SceneEnums, fadeIn, fadeOut, fadeSceneTransition, getGUIScene, loadTilemap, scaleAndConfigureCamera, switchCameraFollow } from ".."
import { Dialogue } from "../../dialogue"
import { FinalElfFoodDialogue, FinalElfTableDialogue, FinalEndDialogue, FinalGoblinFoodDialogue, FinalGoblinTableDialogue, FinalPlayerFoodDialogue, FinalPlayerTableDialogue } from "../../dialogue/final"
import { FinalNPC, FinalNPCEvents, FinalNPCTexture } from "../../sprites/final"
import { FoodTexture, PlayerTexture } from "../../textures"
import { ElfTexture } from "../../textures/elf"
import { GoblinTexture } from "../../textures/goblin"

type FinalMarkers = {
    SpawnLocation: PointObject,
    EndLocation: PointObject,
    FoodLocation: PointObject
}

type FinalNPCDialogue = {
    table: Dialogue.Dialogue,
    food: Dialogue.Dialogue
}

enum FinalNPCs {
    Player,
    Elf,
    Goblin
}

const NPC_ORDER = [FinalNPCs.Elf, FinalNPCs.Goblin, FinalNPCs.Player]

const playerTexture: FinalNPCTexture = {
    key: PlayerTexture.TextureKey,
    food: FoodTexture.Frames.Player,
    moveRightAnimation: (sprite) => {
        sprite.setFlipX(false)
        sprite.play(PlayerTexture.Animations.WalkSide, true)
    },
    idleRightAnimation: (sprite) => {
        sprite.setFlipX(false)
        sprite.play(PlayerTexture.Animations.IdleSide, true)
    },
    moveLeftAnimation: (sprite) => {
        sprite.setFlipX(true)
        sprite.play(PlayerTexture.Animations.WalkSide, true)
    },
    idleFrontAnimation: (sprite) => sprite.play(PlayerTexture.Animations.IdleFront, true)
}

const playerDialogue: FinalNPCDialogue = {
    table: FinalPlayerTableDialogue.Dialogue,
    food: FinalPlayerFoodDialogue.Dialogue
}

const elfTexture: FinalNPCTexture = {
    key: ElfTexture.TextureKey,
    food: FoodTexture.Frames.Elf,
    moveRightAnimation: (sprite) => {
        sprite.setFlipX(false)
        sprite.play(ElfTexture.Animations.WalkSide, true)
    },
    idleRightAnimation: (sprite) => {
        sprite.setFlipX(false)
        sprite.play(ElfTexture.Animations.IdleSide, true)
    },
    moveLeftAnimation: (sprite) => {
        sprite.setFlipX(true)
        sprite.play(ElfTexture.Animations.WalkSide, true)
    },
    idleFrontAnimation: (sprite) => sprite.play(ElfTexture.Animations.IdleFront, true)
}

const elfDialogue: FinalNPCDialogue = {
    table: FinalElfTableDialogue.Dialogue,
    food: FinalElfFoodDialogue.Dialogue
}

const goblinTexture: FinalNPCTexture = {
    key: GoblinTexture.TextureKey,
    food: FoodTexture.Frames.Goblin,
    moveRightAnimation: (sprite) => {
        sprite.play(GoblinTexture.Animations.WalkRight, true)
    },
    idleRightAnimation: (sprite) => {
        sprite.play(GoblinTexture.Animations.IdleRight, true)
    },
    moveLeftAnimation: (sprite) => {
        sprite.play(GoblinTexture.Animations.WalkLeft, true)
    },
    idleFrontAnimation: (sprite) => sprite.play(GoblinTexture.Animations.IdleFront, true)
}

const goblinDialogue: FinalNPCDialogue = {
    table: FinalGoblinTableDialogue.Dialogue,
    food: FinalGoblinFoodDialogue.Dialogue
}

const TABLE_DIALOGUE_DELAY = 500
const FOOD_EATING_DELAY = 500
const MOVE_TO_START_DELAY = 100
const END_DIALOGUE_DELAY = 1000
const START_OFFSET = 50
const NPC_SWITCH_DELAY = 1000

export class FinalScene extends Phaser.Scene {
    markers!: FinalMarkers
    npcsCurrentlyAtStart!: number
    currentOrderIndex!: number
    spriteDepth!: number

    constructor() {
        super(SceneEnums.SceneNames.Final)
    }

    create() {
        /* MAP INITIALIZATION */
        let { map, playerSpriteDepth, objects } = loadTilemap(this, SceneEnums.TilemapNames.Final)
        this.markers = objects as FinalMarkers

        this.sprites.initialize(map)

        // /* CAMERA CONFIGURATION*/
        scaleAndConfigureCamera(this, map)

        this.npcsCurrentlyAtStart = 0
        this.currentOrderIndex = 0
        this.spriteDepth = playerSpriteDepth

        this.startNextNPC()
    }

    getNPCTexture(npc: FinalNPCs): FinalNPCTexture {
        switch (npc) {
            case FinalNPCs.Elf:
                return elfTexture
            case FinalNPCs.Goblin:
                return goblinTexture
            case FinalNPCs.Player:
                return playerTexture
        }
    }

    getNPCDialogue(npc: FinalNPCs): FinalNPCDialogue {
        switch (npc) {
            case FinalNPCs.Elf:
                return elfDialogue
            case FinalNPCs.Goblin:
                return goblinDialogue
            case FinalNPCs.Player:
                return playerDialogue
        }
    }

    startNextNPC(): void {
        let npcType = NPC_ORDER[this.currentOrderIndex]
        let texture = this.getNPCTexture(npcType)
        let sprite = new FinalNPC(this, this.markers.SpawnLocation.x, this.markers.SpawnLocation.y, texture, this.spriteDepth)
        // Origin doesn't work, just push them up manually
        sprite.sprite.setPosition(this.markers.SpawnLocation.x, this.markers.SpawnLocation.y - sprite.sprite.height / 2)
        switchCameraFollow(this, sprite.sprite)
        this.moveSpriteToTable(sprite, npcType)
    }

    moveSpriteToTable(sprite: FinalNPC, type: FinalNPCs): void {
        sprite.moveSpriteToTable()
        sprite.spriteEvents.once(FinalNPCEvents.NPC_REACHED_TABLE, () => {
            let tableDialogue = this.getNPCDialogue(type).table
            this.time.delayedCall(TABLE_DIALOGUE_DELAY, () => {
                let dialogueEventEmitter = new Phaser.Events.EventEmitter()
                getGUIScene(this).dialogue.start(this, tableDialogue, dialogueEventEmitter, this.data, () => {
                    this.moveFoodToTable(sprite, type)
                })
            })
        })
    }

    moveFoodToTable(sprite: FinalNPC, type: FinalNPCs): void {
        sprite.moveFoodToTable()
        sprite.spriteEvents.once(FinalNPCEvents.FOOD_REACHED_TABLE, () => {
            this.eatFood(sprite, type)
        })
    }

    eatFood(sprite: FinalNPC, type: FinalNPCs): void {
        fadeOut(this, () => {
            this.time.delayedCall(FOOD_EATING_DELAY, () => {
                let foodDialogue = this.getNPCDialogue(type).food
                let dialogueEventEmitter = new Phaser.Events.EventEmitter()
                getGUIScene(this).dialogue.start(this, foodDialogue, dialogueEventEmitter, this.data, () => {
                    if (type === FinalNPCs.Player) {
                        this.endGame()
                    } else {
                        sprite.food.setVisible(false)
                        fadeIn(this, () => {
                            this.moveSpriteToStart(sprite)
                        })
                    }
                })
            })
        })
    }

    moveSpriteToStart(sprite: FinalNPC) {
        this.time.delayedCall(MOVE_TO_START_DELAY, () => {
            sprite.moveSpriteToStart(this.npcsCurrentlyAtStart * START_OFFSET)
            sprite.spriteEvents.once(FinalNPCEvents.NPC_REACHED_START, () => {
                this.time.delayedCall(NPC_SWITCH_DELAY, () => {
                    this.npcsCurrentlyAtStart++
                    this.currentOrderIndex++
                    this.startNextNPC()
                })
            })
        })
    }

    endGame() {
        this.time.delayedCall(END_DIALOGUE_DELAY, () => {
            this.scene.stop()
            let dialogueEventEmitter = new Phaser.Events.EventEmitter()
            getGUIScene(this).dialogue.start(this, FinalEndDialogue.Dialogue, dialogueEventEmitter, this.data, () => {
                console.log("hi")
                fadeSceneTransition(this, SceneEnums.SceneNames.Menu)
            })
        })
    }

    update() {
    }
}