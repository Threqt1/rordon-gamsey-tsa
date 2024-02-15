import { ElfTexture } from "../../elf/textures"
import { SceneEnums } from "../../shared/repository"
import { DialogueSystem } from "../../shared/systems"
import { FoodTexture, PlayerTexture } from "../../shared/textures"
import { SceneUtil } from "../../shared/util"
import { GoblinTexture } from "../../goblin/textures"
import { ElfDialogue, GameDialogue, GoblinDialogue, PlayerDialogue } from "../dialogue"
import { NPC } from "../sprites"

type Markers = {
    SpawnLocation: SceneUtil.PointObject,
    EndLocation: SceneUtil.PointObject,
    FoodLocation: SceneUtil.PointObject
}

type NPCDialogue = {
    table: DialogueSystem.Dialogue,
    food: DialogueSystem.Dialogue
}

enum NPCs {
    Player,
    Elf,
    Goblin
}

const NPC_ORDER = [NPCs.Elf, NPCs.Goblin, NPCs.Player]

const playerTexture: NPC.Texture = {
    key: PlayerTexture.TextureKey,
    food: FoodTexture.Frames.Player,
    moveRightAnimation: (sprite) => {
        sprite.play(PlayerTexture.Animations.WalkRight, true)
    },
    idleRightAnimation: (sprite) => {
        sprite.play(PlayerTexture.Animations.IdleRight, true)
    },
    moveLeftAnimation: (sprite) => {
        sprite.play(PlayerTexture.Animations.WalkLeft, true)
    },
    idleFrontAnimation: (sprite) => {
        sprite.play(PlayerTexture.Animations.IdleFront, true)
    }
}

const playerDialogue: NPCDialogue = {
    table: PlayerDialogue.Table.Dialogue,
    food: PlayerDialogue.Food.Dialogue
}

const elfTexture: NPC.Texture = {
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
    idleFrontAnimation: (sprite) => {
        sprite.setFlipX(false)
        sprite.play(ElfTexture.Animations.IdleFront, true)
    }
}

const elfDialogue: NPCDialogue = {
    table: ElfDialogue.Table.Dialogue,
    food: ElfDialogue.Food.Dialogue
}

const goblinTexture: NPC.Texture = {
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

const goblinDialogue: NPCDialogue = {
    table: GoblinDialogue.Table.Dialogue,
    food: GoblinDialogue.Food.Dialogue
}

const TABLE_DIALOGUE_DELAY = 500
const FOOD_EATING_DELAY = 500
const MOVE_TO_START_DELAY = 100
const END_DIALOGUE_DELAY = 1000
const START_OFFSET = 50
const NPC_SWITCH_DELAY = 1000

export class Scene extends Phaser.Scene {
    markers!: Markers
    npcsCurrentlyAtStart!: number
    currentOrderIndex!: number
    spriteDepth!: number

    constructor() {
        super(SceneEnums.Name.Final)
    }

    create() {
        /* MAP INITIALIZATION */
        let { map, playerSpriteDepth, objects } = SceneUtil.loadTilemap(this, SceneEnums.Tilemap.Final)
        this.markers = objects as Markers

        this.sprites.initialize(map)
        let music = this.sound.add(SceneEnums.Music.Final)
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            music.stop()
        })
        music.play("", {
            loop: true
        })

        /* CAMERA CONFIGURATION*/
        SceneUtil.scaleAndConfigureCamera(this, map)

        this.npcsCurrentlyAtStart = 0
        this.currentOrderIndex = 0
        this.spriteDepth = playerSpriteDepth

        this.cameras.main.alpha = 0

        let dialogueEventEmitter = new Phaser.Events.EventEmitter()
        SceneUtil.getGUIScene(this).dialogue.start(this, GameDialogue.Start.Dialogue, dialogueEventEmitter, this.data, () => {
            SceneUtil.fadeOut(this, () => {
                this.cameras.main.alpha = 1
                this.startNextNPC()
                SceneUtil.fadeIn(this)
            })
        })
    }

    getNPCTexture(npc: NPCs): NPC.Texture {
        switch (npc) {
            case NPCs.Elf:
                return elfTexture
            case NPCs.Goblin:
                return goblinTexture
            case NPCs.Player:
                return playerTexture
        }
    }

    getNPCDialogue(npc: NPCs): NPCDialogue {
        switch (npc) {
            case NPCs.Elf:
                return elfDialogue
            case NPCs.Goblin:
                return goblinDialogue
            case NPCs.Player:
                return playerDialogue
        }
    }

    startNextNPC(): void {
        let npcType = NPC_ORDER[this.currentOrderIndex]
        let texture = this.getNPCTexture(npcType)
        let sprite = new NPC.Sprite(this, this.markers.SpawnLocation.x, this.markers.SpawnLocation.y, texture, this.spriteDepth)
        // Origin doesn't work, just push them up manually
        sprite.sprite.setPosition(this.markers.SpawnLocation.x, this.markers.SpawnLocation.y - sprite.sprite.height / 2)
        SceneUtil.switchCameraFollow(this, sprite.sprite)
        this.moveSpriteToTable(sprite, npcType)
    }

    moveSpriteToTable(sprite: NPC.Sprite, type: NPCs): void {
        sprite.moveSpriteToTable()
        sprite.spriteEvents.once(NPC.Events.NPC_REACHED_TABLE, () => {
            let tableDialogue = this.getNPCDialogue(type).table
            this.time.delayedCall(TABLE_DIALOGUE_DELAY, () => {
                let dialogueEventEmitter = new Phaser.Events.EventEmitter()
                SceneUtil.getGUIScene(this).dialogue.start(this, tableDialogue, dialogueEventEmitter, this.data, () => {
                    this.moveFoodToTable(sprite, type)
                })
            })
        })
    }

    moveFoodToTable(sprite: NPC.Sprite, type: NPCs): void {
        sprite.moveFoodToTable()
        sprite.spriteEvents.once(NPC.Events.FOOD_REACHED_TABLE, () => {
            this.eatFood(sprite, type)
        })
    }

    eatFood(sprite: NPC.Sprite, type: NPCs): void {
        SceneUtil.fadeOut(this, () => {
            this.time.delayedCall(FOOD_EATING_DELAY, () => {
                let foodDialogue = this.getNPCDialogue(type).food
                let dialogueEventEmitter = new Phaser.Events.EventEmitter()
                SceneUtil.getGUIScene(this).dialogue.start(this, foodDialogue, dialogueEventEmitter, this.data, () => {
                    if (type === NPCs.Player) {
                        this.endGame()
                    } else {
                        sprite.food.setVisible(false)
                        SceneUtil.fadeIn(this, () => {
                            this.moveSpriteToStart(sprite)
                        })
                    }
                })
            })
        })
    }

    moveSpriteToStart(sprite: NPC.Sprite) {
        this.time.delayedCall(MOVE_TO_START_DELAY, () => {
            sprite.moveSpriteToStart(this.npcsCurrentlyAtStart * START_OFFSET)
            sprite.spriteEvents.once(NPC.Events.NPC_REACHED_START, () => {
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
            SceneUtil.getGUIScene(this).dialogue.start(this, GameDialogue.End.Dialogue, dialogueEventEmitter, this.data, () => {
                SceneUtil.fadeSceneTransition(this, SceneEnums.Name.Menu)
            })
        })
    }

    update() {
    }
}