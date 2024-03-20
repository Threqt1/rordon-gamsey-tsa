import { ElfTexture } from "../../elf/textures"
import { SceneEnums } from "../../shared/repository"
import { DialogueSystem } from "../../shared/systems"
import { FoodTexture, PlayerTexture } from "../../shared/textures"
import { SceneUtil } from "../../shared/util"
import { GoblinTexture } from "../../goblin/textures"
import { ElfDialogue, GameDialogue, GoblinDialogue, OrcDialogue, PlayerDialogue } from "../dialogue"
import { NPC } from "../sprites"
import { OrcMinecartTexture } from "../../orc/textures"

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
    Goblin,
    Orc
}

const NPC_ORDER = [NPCs.Elf, NPCs.Goblin, NPCs.Orc, NPCs.Player]

const playerTexture: NPC.Texture = {
    key: PlayerTexture.TextureKey,
    food: FoodTexture.Frames.Player,
    moveRightAnimation: (sprite) => {
        sprite.play(PlayerTexture.Animations.WalkRight, true)
    },
    idleRightAnimation: (sprite) => {
        sprite.play(PlayerTexture.Animations.IdleRight, true)
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
    }
}

const goblinDialogue: NPCDialogue = {
    table: GoblinDialogue.Table.Dialogue,
    food: GoblinDialogue.Food.Dialogue
}

const orcTexture: NPC.Texture = {
    key: OrcMinecartTexture.TextureKey,
    food: FoodTexture.Frames.Orc,
    moveRightAnimation: (sprite) => {
        sprite.play(OrcMinecartTexture.Animations.IdleRight, true)
    },
    idleRightAnimation: (sprite) => {
        sprite.play(OrcMinecartTexture.Animations.IdleRight, true)
    }
}

const orcDialogue: NPCDialogue = {
    table: OrcDialogue.Table.Dialogue,
    food: OrcDialogue.Food.Dialogue
}

const START_SPAWN_DELAY = 1000
const FOOD_EATING_DELAY = 500
const TABLE_DIALOGUE_DELAY = 500
const END_DIALOGUE_DELAY = 1000

export class Scene extends Phaser.Scene {
    markers!: Markers
    spriteDepth!: number
    npcSprites!: NPC.Sprite[]
    currentOrderIndex!: number

    constructor() {
        super(SceneEnums.Name.Final)
    }

    create() {
        /* MAP INITIALIZATION */
        let { map, playerSpriteDepth, objects } = SceneUtil.loadTilemap(this, SceneEnums.Tilemap.Final)
        this.spriteDepth = playerSpriteDepth
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

        this.currentOrderIndex = 0
        this.npcSprites = []
        // this.npcsCurrentlyAtStart = 0
        // this.currentOrderIndex = 0
        // this.spriteDepth = playerSpriteDepth

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
            case NPCs.Orc:
                return orcTexture
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
            case NPCs.Orc:
                return orcDialogue
        }
    }

    startNextNPC(): void {
        let npcType = NPC_ORDER[this.currentOrderIndex]
        let texture = this.getNPCTexture(npcType)
        let sprite = new NPC.Sprite(this, this.markers.SpawnLocation.x, this.markers.SpawnLocation.y, texture, this.spriteDepth)
        // Origin doesn't work, just push them up manually
        sprite.sprite.setPosition(this.markers.SpawnLocation.x, this.markers.SpawnLocation.y - sprite.sprite.height / 2)
        if (this.currentOrderIndex === 0) SceneUtil.switchCameraFollow(this, sprite.sprite)
        this.npcSprites.push(sprite)

        this.moveNPCToTable()
    }

    moveNPCToTable(): void {
        let sprite = this.npcSprites[this.currentOrderIndex]
        sprite.moveSpriteToTable()
        if (this.currentOrderIndex == NPC_ORDER.length - 1) {
            sprite.spriteEvents.once(NPC.Events.NPC_REACHED_TABLE, () => {
                this.currentOrderIndex = 0
                this.time.delayedCall(TABLE_DIALOGUE_DELAY, () => {
                    this.startNextNPCTableDialogue()
                })
            })
        } else {
            this.time.delayedCall(START_SPAWN_DELAY, () => {
                this.currentOrderIndex++
                this.startNextNPC()
            })
        }
    }

    startNextNPCTableDialogue(): void {
        let type = NPC_ORDER[this.currentOrderIndex]
        let tableDialogue = this.getNPCDialogue(type).table
        this.time.delayedCall(TABLE_DIALOGUE_DELAY, () => {
            SceneUtil.getGUIScene(this).dialogue.start(this, tableDialogue, new Phaser.Events.EventEmitter(), this.data, () => {
                this.moveFoodToTable()
            })
        })
    }

    moveFoodToTable(): void {
        let sprite = this.npcSprites[this.currentOrderIndex]
        sprite.moveFoodToTable()
        sprite.spriteEvents.once(NPC.Events.FOOD_REACHED_TABLE, () => {
            this.eatFood()
        })
    }

    eatFood(): void {
        let type = NPC_ORDER[this.currentOrderIndex]
        let sprite = this.npcSprites[this.currentOrderIndex]
        SceneUtil.fadeOut(this, () => {
            this.time.delayedCall(FOOD_EATING_DELAY, () => {
                let foodDialogue = this.getNPCDialogue(type).food
                let dialogueEventEmitter = new Phaser.Events.EventEmitter()
                SceneUtil.getGUIScene(this).dialogue.start(this, foodDialogue, dialogueEventEmitter, this.data, () => {
                    if (type === NPCs.Player) {
                        this.endGame()
                    } else {
                        sprite.food.setVisible(false)
                        let nextSprite = this.npcSprites[this.currentOrderIndex + 1]
                        if (nextSprite) {
                            SceneUtil.switchCameraFollow(this, nextSprite.food)
                        }
                        SceneUtil.fadeIn(this, () => {
                            this.currentOrderIndex++
                            this.startNextNPCTableDialogue()
                        })
                    }
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
}