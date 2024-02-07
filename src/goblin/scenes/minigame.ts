import { GoblinLevelScene } from "."
import { SceneEnums } from "../../game/repository"
import { SceneUtil } from "../../game/util"
import { MinigameDialogue } from "../dialogue"

let BASE_MASK_DEPTH = 100
let NPC_LIGHT_MASK_DEPTH = 101
let PLAYER_LIGHT_MASK_DEPTH = 102
let CAUGHT_TIME_DELAY = 500
let BASE_LAYER_OPACITY = 0.6
let PLAYER_LIGHT_LAYER_OPACITY = 0.45

// The order of the levels in the goblin minigame
export const LEVEL_ORDER = [
    SceneEnums.Tilemap.GoblinMinigameLevel1,
    SceneEnums.Tilemap.GoblinMinigameLevel2,
    SceneEnums.Tilemap.GoblinMinigameLevel3
]

/**
 * All possible events for the game
 */
export enum Events {
    ALERT = "alert",
    CAUGHT = "caught",
    DEAD = "dead",
    SWITCH_LEVELS = "switch_levels"
}

/**
 * All possible states of the game
 */
export enum GameState {
    NORMAL,
    ALERTED
}

/**
 * Scene for the goblin minigame
 */
export class GoblinMinigameScene extends Phaser.Scene {
    currentLevelIndex!: number
    music!: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound
    /**
     * Area visible to the player
     */
    playerVisibleArea!: Phaser.GameObjects.Graphics
    playerVisibleAreaMask!: Phaser.Display.Masks.GeometryMask
    /**
     * Area visible to the NPCs
     */
    npcVisibleArea!: Phaser.GameObjects.Graphics
    currentLevel!: GoblinLevelScene
    state!: GameState
    gameInProgress!: boolean
    gameResetting!: boolean
    gameEvents!: Phaser.Events.EventEmitter

    constructor() {
        super(SceneEnums.Name.GoblinMinigame)
    }

    create() {
        this.currentLevelIndex = 0

        this.music = this.sound.add(SceneEnums.Music.GoblinNeutral)
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.music.stop()
        })
        this.music.play("", {
            loop: true,
        })

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

        this.state = GameState.NORMAL
        this.gameInProgress = false
        this.gameResetting = false
        this.gameEvents = new Phaser.Events.EventEmitter()

        // Once the change mode signal is heard, change game mode to alerted
        this.gameEvents.once(Events.ALERT, () => {
            this.state = GameState.ALERTED
            this.music.stop()
            this.music = this.sound.add(SceneEnums.Music.GoblinAlerted)
            this.music.play({
                loop: true,
                rate: 1.5
            })
            this.currentLevel.updateLevel()
        })
        //Once the player is caught, end the game
        this.gameEvents.on(Events.CAUGHT, () => {
            this.resetGame()
        })
        //Once the player is dead, end the game
        this.gameEvents.on(Events.DEAD, () => {
            this.resetGame()
        })
        //Listen for level change events
        this.gameEvents.on(Events.SWITCH_LEVELS, (newLevelIndex: number) => {
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
            if (this.scene.isActive(SceneEnums.Name.GoblinMinigameLevel)) {
                this.scene.stop(SceneEnums.Name.GoblinMinigameLevel)
            }
            this.scene.launch(SceneEnums.Name.GoblinMinigameLevel, {
                parent: this,
                levelIndex
            })
            this.scene.moveAbove(SceneEnums.Name.GoblinMinigameLevel, SceneEnums.Name.GoblinMinigame)
            this.currentLevel = this.scene.get(SceneEnums.Name.GoblinMinigameLevel) as GoblinLevelScene
            this.currentLevel.events.once(Phaser.Scenes.Events.CREATE, () => {
                this.gameInProgress = true
                SceneUtil.fadeIn(this)
            })
        }

        this.gameInProgress = false
        if (shouldFadeOut) {
            SceneUtil.fadeOut(this, afterFadeOutFunctionality)
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
        SceneUtil.fadeOut(this, () => {
            this.currentLevel.resetPlayerPosition()
            this.time.delayedCall(CAUGHT_TIME_DELAY, () => {
                SceneUtil.fadeIn(this, () => {
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
        SceneUtil.fadeOut(this, () => {
            this.currentLevel.scene.stop()
            this.scene.stop()
            let dialogueEventEmitter = new Phaser.Events.EventEmitter()
            SceneUtil.getGUIScene(this).dialogue.start(this, MinigameDialogue.End.Dialogue, dialogueEventEmitter, this.data, () => {
                SceneUtil.fadeSceneTransition(this, SceneEnums.Name.Final)
            })
        })
    }
}