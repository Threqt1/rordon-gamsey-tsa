import { fadeOut, fadeSceneTransition, getGUIScene } from ".."
import { SceneEnums, fadeIn } from "../scenesUtilities"
import { GoblinMinigameEndDialogue } from "../../dialogue/goblin"
import { GoblinMinigameLevelScene } from "."

let BASE_MASK_DEPTH = 100
let NPC_LIGHT_MASK_DEPTH = 101
let PLAYER_LIGHT_MASK_DEPTH = 102
let CAUGHT_TIME_DELAY = 500
let BASE_LAYER_OPACITY = 0.6
let PLAYER_LIGHT_LAYER_OPACITY = 0.45

// The order of the levels in the goblin minigame
export const GOBLIN_MINIGAME_LEVEL_ORDER = [SceneEnums.TilemapNames.GoblinMinigameLevel1, SceneEnums.TilemapNames.GoblinMinigameLevel2, SceneEnums.TilemapNames.GoblinMinigameLevel3]

/**
 * All possible events for the game
 */
export enum GoblinMinigameEvents {
    ALERT = "alert",
    CAUGHT = "caught",
    DEAD = "dead",
    SWITCH_LEVELS = "switch_levels"
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
    currentLevelIndex!: number
    /**
     * Area visible to the player
     */
    playerVisibleArea!: Phaser.GameObjects.Graphics
    playerVisibleAreaMask!: Phaser.Display.Masks.GeometryMask
    /**
     * Area visible to the NPCs
     */
    npcVisibleArea!: Phaser.GameObjects.Graphics
    currentLevel!: GoblinMinigameLevelScene
    state!: GoblinMinigameState
    gameInProgress!: boolean
    gameResetting!: boolean
    gameEvents!: Phaser.Events.EventEmitter

    constructor() {
        super(SceneEnums.SceneNames.GoblinMinigame)
    }

    create() {
        this.currentLevelIndex = 0

        // Create the graphics that will represent the area the player can see
        this.playerVisibleArea = this.add.graphics().removeFromDisplayList()
        // Create a mask with the player visible area
        this.playerVisibleAreaMask = new Phaser.Display.Masks.GeometryMask(this, this.playerVisibleArea)
        let playerVisibleAreaMaskInverse = new Phaser.Display.Masks.GeometryMask(this, this.playerVisibleArea)
        playerVisibleAreaMaskInverse.setInvertAlpha(true)

        // Create the first layer of graphics which dims the entire map
        this.add.graphics({ fillStyle: { color: 0x000000, alpha: BASE_LAYER_OPACITY } })
            .setDepth(BASE_MASK_DEPTH)
            .fillRect(0, 0, this.scale.canvas.width, this.scale.canvas.height)
        // Add second layer which represents the area the NPCs can see
        // Put the player area mask on it so only the light that the player can see
        // is rendered
        this.npcVisibleArea = this.add.graphics()
            .setDepth(NPC_LIGHT_MASK_DEPTH)
            .setMask(this.playerVisibleAreaMask)
            .fillRect(0, 0, this.scale.canvas.width, this.scale.canvas.height)
        // Add the final layer, where everything the player can see will be displayed
        // Apply the inverse of player mask because we want to hide this layer
        // Wherever the mask has visible pixels (the fill is just a greater dim)
        this.add.graphics({ fillStyle: { color: 0x000000, alpha: PLAYER_LIGHT_LAYER_OPACITY } })
            .setDepth(PLAYER_LIGHT_MASK_DEPTH)
            .setMask(playerVisibleAreaMaskInverse)
            .fillRect(0, 0, this.scale.canvas.width, this.scale.canvas.height)

        this.state = GoblinMinigameState.NORMAL
        this.gameInProgress = false
        this.gameResetting = false
        this.gameEvents = new Phaser.Events.EventEmitter()

        // Once the change mode signal is heard, change game mode to alerted
        this.gameEvents.once(GoblinMinigameEvents.ALERT, () => {
            this.state = GoblinMinigameState.ALERTED
            this.currentLevel.updateLevel()
        })
        //Once the player is caught, end the game
        this.gameEvents.on(GoblinMinigameEvents.CAUGHT, () => {
            this.resetGame()
        })
        //Once the player is dead, end the game
        this.gameEvents.on(GoblinMinigameEvents.DEAD, () => {
            this.resetGame()
        })
        //Listen for level change events
        this.gameEvents.on(GoblinMinigameEvents.SWITCH_LEVELS, (newLevelIndex: number) => {
            if (newLevelIndex < 0) {
                return this.endGame()
            }
            this.currentLevelIndex = newLevelIndex
            this.launchNewLevel(this.currentLevelIndex)
        })

        this.launchNewLevel(0, false)
    }

    /**
     * Launch a new level of the Goblin Minigame
     * @param levelIndex The index of the level to start
     * @param shouldFadeOut Whether to fade out at first or not
     */
    launchNewLevel(levelIndex: number, shouldFadeOut: boolean = true): void {
        const afterFadeOutFunctionality = () => {
            if (this.scene.isActive(SceneEnums.SceneNames.GoblinMinigameLevel)) {
                this.scene.stop(SceneEnums.SceneNames.GoblinMinigameLevel)
            }
            this.scene.launch(SceneEnums.SceneNames.GoblinMinigameLevel, {
                parent: this,
                levelIndex
            })
            this.scene.moveAbove(SceneEnums.SceneNames.GoblinMinigameLevel, SceneEnums.SceneNames.GoblinMinigame)
            this.currentLevel = this.scene.get(SceneEnums.SceneNames.GoblinMinigameLevel) as GoblinMinigameLevelScene
            this.currentLevel.events.once(Phaser.Scenes.Events.CREATE, () => {
                this.gameInProgress = true
                fadeIn(this)
            })
        }

        this.gameInProgress = false
        if (shouldFadeOut) {
            fadeOut(this, afterFadeOutFunctionality)
        } else {
            afterFadeOutFunctionality()
        }
    }

    update() {
        this.playerVisibleArea.clear()
        this.npcVisibleArea.clear()
        // Raycast for the player and handle clearing the lit area graphics
        if (!this.gameInProgress) return

        // Cast in a circle and follow the player
        this.currentLevel.playerRay.setOrigin(this.currentLevel.player.sprite.x, this.currentLevel.player.sprite.y)
        this.currentLevel.playerRay.castCircle()

        // Fill all intersections on the player visible area mask
        for (let slice of this.currentLevel.playerRay.slicedIntersections) {
            this.playerVisibleArea.fillTriangleShape(slice)
        }

        // Raycast for all the NPCs
        for (let npc of this.currentLevel.npcs) {
            npc.raycastAndUpdate()
        }
    }

    /**
     * Reset the game, but don't end it
     */
    resetGame(): void {
        if (this.gameResetting) return
        this.gameResetting = true
        this.currentLevel.sprites.setControllable(false)
        fadeOut(this, () => {
            this.currentLevel.resetPlayerPosition()
            this.time.delayedCall(CAUGHT_TIME_DELAY, () => {
                fadeIn(this, () => {
                    this.gameResetting = false
                    this.currentLevel.sprites.setControllable(true)
                })
            })
        })
    }

    /**
     * End the game
     */
    endGame(): void {
        this.gameInProgress = false
        this.currentLevel.sprites.setControllable(false)
        for (let npc of this.currentLevel.npcs) {
            npc.stop()
        }
        fadeOut(this, () => {
            this.currentLevel.scene.stop()
            this.scene.stop()
            let dialogueEventEmitter = new Phaser.Events.EventEmitter()
            getGUIScene(this).dialogue.start(this, GoblinMinigameEndDialogue.Dialogue, dialogueEventEmitter, () => {
                fadeSceneTransition(this, SceneEnums.SceneNames.Menu)
            })
        })
    }
}