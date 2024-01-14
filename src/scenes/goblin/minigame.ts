import { PointObject, SceneEnums, fadeOut, fadeSceneTransition, getGUIScene, loadTilemap, scaleAndConfigureCamera } from ".."
import { EndDialogue } from "../../dialogue/goblin/minigame"
import { Player } from "../../sprites/game"
import { GoblinObjective } from "../../sprites/goblin/minigame"
import { GoblinNPC } from "../../sprites/goblin/minigame/npc"
import { FruitsTexture } from "../../textures/elf/minigame"

let BASE_MASK_DEPTH = 100
let GAME_MASK_DEPTH = 101
let PLAYER_MASK_DEPTH = 102

type GoblinMinigameObjects = {
    [key: string]: PointObject
}

export enum GameState {
    NORMAL,
    ALERTED
}

export class GoblinMinigameScene extends Phaser.Scene {
    player!: Player
    litAreaGraphics!: Phaser.GameObjects.Graphics
    litAreaMask!: Phaser.Display.Masks.GeometryMask
    playerAreaGraphics!: Phaser.GameObjects.Graphics
    playerAreaMask!: Phaser.Display.Masks.GeometryMask
    playerRay!: Raycaster.Ray
    npcs!: GoblinNPC[]
    gameEnded!: boolean
    gameEvents!: Phaser.Events.EventEmitter
    gameState!: GameState

    constructor() {
        super(SceneEnums.SceneNames.GoblinMinigame)
    }

    preload() {
        FruitsTexture.preload(this)
    }

    create() {
        FruitsTexture.load(this)

        let { collisionsLayer: collisions, map, playerSpriteDepth: playerDepth, objects } = loadTilemap(this, SceneEnums.TilemapNames.GoblinMinigame)

        const markers: GoblinMinigameObjects = objects as GoblinMinigameObjects

        this.sprites.initialize(map)

        this.gameState = GameState.NORMAL

        this.gameEvents = new Phaser.Events.EventEmitter()
        this.gameEvents.on("mode", () => {
            this.gameState = GameState.ALERTED
            this.updateNPCs()
        })
        this.gameEvents.once("found", () => {
            this.endGame()
        })

        const createRaycasterSettings = (raycaster: Raycaster) => {
            raycaster.mapGameObjects(collisions, false, {
                collisionTiles: [41]
            })
        }

        let raycaster = this.raycaster.createRaycaster()
        createRaycasterSettings(raycaster)
        this.playerRay = raycaster.createRay()
        this.playerRay.autoSlice = true

        this.playerAreaGraphics = this.add.graphics().removeFromDisplayList()
        this.playerAreaMask = new Phaser.Display.Masks.GeometryMask(this, this.playerAreaGraphics)
        this.playerAreaMask.setInvertAlpha(true)
        let playerAreaMaskInverse = new Phaser.Display.Masks.GeometryMask(this, this.playerAreaGraphics)
        this.add.graphics({ fillStyle: { color: 0x000000, alpha: 0.45 } })
            .setDepth(PLAYER_MASK_DEPTH)
            .setMask(this.playerAreaMask)
            .fillRect(0, 0, this.scale.canvas.width, this.scale.canvas.height)
        this.litAreaGraphics = this.add.graphics({ fillStyle: { color: 0x000000, alpha: 0.6 } })
            .setDepth(GAME_MASK_DEPTH)
            .setMask(playerAreaMaskInverse)
            .fillRect(0, 0, this.scale.canvas.width, this.scale.canvas.height)
        this.add.graphics({ fillStyle: { color: 0x000000, alpha: 0.65 } })
            .setDepth(BASE_MASK_DEPTH)
            .fillRect(0, 0, this.scale.canvas.width, this.scale.canvas.height)

        this.player = new Player(this, 470, 155)
        this.player.sprite.setDepth(playerDepth)

        let objective = new GoblinObjective(this, 100, 50)
        objective.sprite.setDepth(playerDepth)
        objective.sprite.setMask(playerAreaMaskInverse)

        let npcMap: { [key: string]: Phaser.Math.Vector2[] } = {}
        for (let [key, point] of Object.entries(markers)) {
            let splitKey = key.split("_")
            let npcNumber = splitKey[1]
            let pointNumber = parseInt(splitKey[2])
            if (!npcMap[npcNumber]) npcMap[npcNumber] = []
            npcMap[npcNumber][pointNumber] = new Phaser.Math.Vector2(point.x, point.y)
        }

        this.npcs = []

        for (let points of Object.values(npcMap)) {
            points = points.filter(r => r !== undefined)
            let npc = new GoblinNPC(this, points, points[0].x, points[0].y, this.litAreaGraphics, createRaycasterSettings)
            npc.sprite.setDepth(playerDepth)
            this.npcs.push(npc)
        }

        this.sprites.addGameControllables(this.player)
        this.sprites.addInteractables(objective)
        this.sprites.addInteractingBodies(this.player.sprite)
        this.sprites.addPhysicsBodies(this.player.sprite, objective.sprite)
        this.sprites.addPhysicsBodies(...this.npcs.map(r => r.sprite))

        scaleAndConfigureCamera(this, map, this.player.sprite)

        this.sprites.makeCollisionsWithLayer(collisions)

        this.gameEnded = false
        for (let npc of this.npcs) {
            npc.sprite.setMask(playerAreaMaskInverse)
            npc.start()
        }
    }

    updateNPCs() {
        for (let npc of this.npcs) {
            npc.setState(this.gameState)
        }
    }

    update() {
        if (this.gameEnded) return
        this.playerAreaGraphics.clear()
        this.litAreaGraphics.clear()

        this.playerRay.setOrigin(this.player.sprite.x, this.player.sprite.y)
        this.playerRay.castCircle()

        for (let slice of this.playerRay.slicedIntersections) {
            this.playerAreaGraphics.fillTriangleShape(slice)
        }

        for (let npc of this.npcs) {
            npc.drawLight()
        }
    }

    endGame() {
        this.gameEnded = true
        this.sprites.setGameControllable(false)
        for (let npc of this.npcs) {
            npc.stop()
        }
        fadeOut(this, () => {
            getGUIScene(this).dialogue.start(this, EndDialogue, () => {
                fadeSceneTransition(this, SceneEnums.SceneNames.GUI)
            })
        })
    }
}