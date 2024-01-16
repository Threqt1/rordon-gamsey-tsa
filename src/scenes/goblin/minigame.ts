import { PointObject, SceneEnums, fadeOut, fadeSceneTransition, getGUIScene, loadTilemap, scaleAndConfigureCamera } from ".."
import { GoblinMinigameEndDialogue } from "../../dialogue/goblin"
import { Player } from "../../sprites/game"
import { GoblinMinigameObjective, GoblinMinigameNPC } from "../../sprites/goblin"
import { FruitsTexture } from "../../textures/elf"

let BASE_MASK_DEPTH = 100
let NPC_LIGHT_MASK_DEPTH = 101
let PLAYER_LIGHT_MASK_DEPTH = 102

type GoblinMinigameObjects = {
    [key: string]: PointObject
}

/**
 * All possible events for the game
 */
export enum GoblinMinigameEvents {
    ALERT = "alert",
    CAUGHT = "caught"
}

/**
 * All possible states of the game
 */
export enum GoblinMinigameState {
    NORMAL,
    ALERTED
}

/**
 * Scene for the goblin minigame
 */
export class GoblinMinigameScene extends Phaser.Scene {
    collisionsLayer!: Phaser.Tilemaps.TilemapLayer
    player!: Player
    npcs!: GoblinMinigameNPC[]
    /**
     * Area visible to the player
     */
    playerVisibleArea!: Phaser.GameObjects.Graphics
    /**
     * Area visible to the NPCs
     */
    npcVisibleArea!: Phaser.GameObjects.Graphics
    playerRay!: Raycaster.Ray
    state!: GoblinMinigameState
    gameEnded!: boolean
    gameEvents!: Phaser.Events.EventEmitter

    constructor() {
        super(SceneEnums.SceneNames.GoblinMinigame)
    }

    preload() {
        FruitsTexture.preload(this)
    }

    /**
     * Configure a given raycaster
     * @param raycaster The raycaster to configure
     */
    createRaycasterSettings(raycaster: Raycaster): void {
        raycaster.mapGameObjects(this.collisionsLayer, false, {
            collisionTiles: [41]
        })
    }

    create() {
        /* TEXTURE LOADING */
        FruitsTexture.load(this)

        /* MAP LOADING */
        let { collisionsLayer, map, playerSpriteDepth: playerDepth, objects } = loadTilemap(this, SceneEnums.TilemapNames.GoblinMinigame)
        const markers: GoblinMinigameObjects = objects as GoblinMinigameObjects

        this.collisionsLayer = collisionsLayer
        this.sprites.initialize(map)

        /* SPRITES LOADING */
        this.player = new Player(this, 470, 155)
        this.player.sprite.setDepth(playerDepth)

        let objective = new GoblinMinigameObjective(this, 100, 50)
        objective.sprite.setDepth(playerDepth)

        this.npcs = []
        let npcMap: { [key: string]: Phaser.Math.Vector2[] } = {}
        // Parse markers and assign each point to the appropriate NPC number in the map
        for (let [key, point] of Object.entries(markers)) {
            // key format: path_{goblin_number}_{path_point_number}
            let splitKey = key.split("_")
            let npcNumber = splitKey[1]
            let pointNumber = parseInt(splitKey[2])
            if (!npcMap[npcNumber]) npcMap[npcNumber] = []
            npcMap[npcNumber][pointNumber] = new Phaser.Math.Vector2(point.x, point.y)
        }
        // Parse the map, creating and initializing the NPC classes
        for (let points of Object.values(npcMap)) {
            // Filter out bad parses
            points = points.filter(r => r !== undefined)
            let npc = new GoblinMinigameNPC(this, points, points[0].x, points[0].y)
            npc.sprite.setDepth(playerDepth)
            this.npcs.push(npc)
        }

        this.sprites.controllables.push(this.player)
        this.sprites.interactables.push(objective)
        this.sprites.interactingBodies.add(this.player.sprite)
        this.sprites.physicsBodies.addMultiple([this.player.sprite, objective.sprite, ...this.npcs.map(r => r.sprite)])
        this.sprites.makeCollisionsWithLayer(collisionsLayer)

        /* CAMERA CONFIGURATION */
        scaleAndConfigureCamera(this, map, this.player.sprite)

        /* VARIABLE INITIALIZATION */

        // Create the graphics that will represent the area the player can see
        this.playerVisibleArea = this.add.graphics().removeFromDisplayList()
        // Create a mask with the player visible area
        let playerVisibleAreaMask = new Phaser.Display.Masks.GeometryMask(this, this.playerVisibleArea)
        let playerVisibleAreaMaskInverse = new Phaser.Display.Masks.GeometryMask(this, this.playerVisibleArea)
        playerVisibleAreaMaskInverse.setInvertAlpha(true)

        // Create the first layer of graphics which dims the entire map
        this.add.graphics({ fillStyle: { color: 0x000000, alpha: 0.65 } })
            .setDepth(BASE_MASK_DEPTH)
            .fillRect(0, 0, this.scale.canvas.width, this.scale.canvas.height)
        // Add second layer which represents the area the NPCs can see
        // Put the player area mask on it so only the light that the player can see
        // is rendered b
        this.npcVisibleArea = this.add.graphics({ fillStyle: { color: 0x000000, alpha: 0.6 } })
            .setDepth(NPC_LIGHT_MASK_DEPTH)
            .setMask(playerVisibleAreaMask)
            .fillRect(0, 0, this.scale.canvas.width, this.scale.canvas.height)
        // Add the final layer, where everything the player can see will be displayed
        // Apply the inverse of player mask because we want to hide this layer
        // Wherever the mask has visible pixels (the fill is just a greater dim)
        this.add.graphics({ fillStyle: { color: 0x000000, alpha: 0.45 } })
            .setDepth(PLAYER_LIGHT_MASK_DEPTH)
            .setMask(playerVisibleAreaMaskInverse)
            .fillRect(0, 0, this.scale.canvas.width, this.scale.canvas.height)

        let raycaster = this.raycaster.createRaycaster()
        this.createRaycasterSettings(raycaster)
        this.playerRay = raycaster.createRay()
        this.playerRay.autoSlice = true

        this.state = GoblinMinigameState.NORMAL
        this.gameEnded = false
        this.gameEvents = new Phaser.Events.EventEmitter()

        // Once the change mode signal is heard, change game mode to alerted
        this.gameEvents.once(GoblinMinigameEvents.ALERT, () => {
            this.state = GoblinMinigameState.ALERTED
            this.updateNPCStates()
        })
        // Once the player is caught, end the game
        this.gameEvents.once(GoblinMinigameEvents.CAUGHT, () => {
            this.endGame()
        })

        // Add the correct mask to every sprite and start NPCs
        objective.sprite.setMask(playerVisibleAreaMask)
        for (let npc of this.npcs) {
            npc.sprite.setMask(playerVisibleAreaMask)
            npc.start()
        }
    }

    /**
     * Update NPCs when the game state changes
     */
    updateNPCStates(): void {
        for (let npc of this.npcs) {
            npc.updateState()
        }
    }

    update() {
        // Raycast for the player and handle clearing the lit area graphics
        if (this.gameEnded) return
        this.playerVisibleArea.clear()
        this.npcVisibleArea.clear()

        // Cast in a circle and follow the player
        this.playerRay.setOrigin(this.player.sprite.x, this.player.sprite.y)
        this.playerRay.castCircle()

        // Fill all intersections on the player visible area mask
        for (let slice of this.playerRay.slicedIntersections) {
            this.playerVisibleArea.fillTriangleShape(slice)
        }

        // Raycast for all the NPCs
        for (let npc of this.npcs) {
            npc.raycastAndUpdate()
        }
    }

    /**
     * End the game
     */
    endGame(): void {
        this.gameEnded = true
        this.sprites.controllablesEnabled = false
        for (let npc of this.npcs) {
            npc.stop()
        }
        fadeOut(this, () => {
            let dialogueEventEmitter = new Phaser.Events.EventEmitter()
            getGUIScene(this).dialogue.start(this, GoblinMinigameEndDialogue.Dialogue, dialogueEventEmitter, () => {
                fadeSceneTransition(this, SceneEnums.SceneNames.GUI)
            })
        })
    }
}