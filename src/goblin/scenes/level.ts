import { GoblinMinigame } from ".";
import { SceneEnums } from "../../game/repository";
import { Player } from "../../game/sprites/player";
import { PlayerTexture } from "../../game/textures";
import { SceneUtil, SpriteUtil } from "../../game/util";
import { MinigameDialogue } from "../dialogue";
import { MinigameSprites } from "../sprites";

const BONFIRE_LIGHT_RADIUS = 70

/*
TODO:
COMMENTS FOR THIS FILE
*/

type Markers = {
    [key: string]: SceneUtil.PointObject | SceneUtil.RectangleObject | undefined
    entrance_zone: SceneUtil.RectangleObject,
    exit_zone?: SceneUtil.RectangleObject
    objective?: SceneUtil.PointObject
    bonfire?: SceneUtil.PointObject
}

export class GoblinLevelScene extends Phaser.Scene {
    parentScene!: GoblinMinigame.Scene
    currentLevelIndex!: number
    player!: Player
    npcs!: MinigameSprites.NPC.Sprite[]
    additionaLights!: MinigameSprites.LightEmitter.Sprite[]
    map!: Phaser.Tilemaps.Tilemap
    spawnPoint!: Phaser.Geom.Point
    markers!: Markers
    playerRay!: Raycaster.Ray
    collisionsLayer!: Phaser.Tilemaps.TilemapLayer

    constructor() {
        super(SceneEnums.Name.GoblinMinigameLevel)
    }

    /**
     * Configure a given raycaster
     * @param raycaster The raycaster to configure
     */
    createRaycasterSettings(raycaster: Raycaster): void {
        raycaster.mapGameObjects(this.collisionsLayer, false, {
            collisionTiles: [73]
        })
    }

    create(config: { parentScene: GoblinMinigame.Scene, levelIndex: number }) {
        this.parentScene = config.parentScene
        this.currentLevelIndex = config.levelIndex
        this.additionaLights = []
        /* MAP LOADING */
        let { collisionsLayer, map, playerSpriteDepth, objects } = SceneUtil.loadTilemap(this, GoblinMinigame.LEVEL_ORDER[config.levelIndex])
        this.map = map
        this.markers = objects as Markers
        this.collisionsLayer = collisionsLayer

        this.sprites.initialize(map)

        /* SPRITES LOADING */
        this.npcs = this.parseAndCreateNPCs(this.markers)
        this.player = new Player(this, 0, 0)
        this.sprites.controllables.push(this.player)
        this.sprites.physicsBodies.add(this.player.sprite)
        this.sprites.interactingBodies.add(this.player.sprite)

        for (let npc of this.npcs) {
            npc.makeCollisionsWithPlayer(this.player)
        }

        this.updateTeleportAndSpawn()

        // If theres an objective marker, add that too
        if (this.markers.objective !== undefined) {
            let objective = new MinigameSprites.Objective(this, this.markers.objective.x, this.markers.objective.y)
            this.sprites.addInteractables(objective)
            this.sprites.physicsBodies.add(objective.sprite)
        }

        // Make the bonfire, if any
        if (this.markers.bonfire !== undefined) {
            let sprite = this.add.sprite(this.markers.bonfire.x, this.markers.bonfire.y, PlayerTexture.TextureKey).setVisible(false)
            this.additionaLights.push(new MinigameSprites.LightEmitter.Sprite(this, sprite, MinigameSprites.LightEmitter.EmitterType.CIRCLE, this.add.polygon(
                sprite.x,
                sprite.y,
                new Phaser.Geom.Circle(BONFIRE_LIGHT_RADIUS, BONFIRE_LIGHT_RADIUS, BONFIRE_LIGHT_RADIUS).getPoints(36),
                undefined,
                1
            )))
        }

        // Initialize all voids and their zones
        for (let [key, _rectangleObject] of Object.entries(this.markers)) {
            if (!key.toLowerCase().startsWith("void")) continue
            let rectangleObject = _rectangleObject as SceneUtil.RectangleObject
            let zone = this.add.zone(rectangleObject.x, rectangleObject.y, rectangleObject.width, rectangleObject.height).setOrigin(0, 0);
            this.physics.world.enable(zone, Phaser.Physics.Arcade.DYNAMIC_BODY);
            (zone.body as Phaser.Physics.Arcade.Body).setImmovable(true)
            this.physics.add.collider(zone, this.player.sprite, () => {
                this.parentScene.gameEvents.emit(GoblinMinigame.Events.DEAD)
            })
        }

        this.sprites.physicsBodies.setDepth(playerSpriteDepth)
        this.sprites.makeCollisionsWithLayer(collisionsLayer)

        // Configure camera
        SceneUtil.scaleAndConfigureCamera(this, map, this.player.sprite)
        SceneUtil.scaleAndConfigureCamera(this.parentScene, this.map, this.player.sprite)

        // Configure raycaster
        let raycaster = this.raycaster.createRaycaster()
        this.createRaycasterSettings(raycaster)
        this.playerRay = raycaster.createRay()
        this.playerRay.autoSlice = true

        for (let npc of this.npcs) {
            npc.updateState(this.parentScene.state)
        }
    }

    update() {
        for (let light of this.additionaLights) {
            light.emitLight()
        }
    }

    /**
     * Update the active teleportation zone and spawn bbased on state
     */
    updateTeleportAndSpawn(): void {
        let activeTeleporterZone: MinigameSprites.TeleporterZone | undefined;
        // If the state is normal, make the exit zone and spawn in the middle of entrance - trying to progress inward
        if (this.parentScene.state === GoblinMinigame.GameState.NORMAL) {
            let playerX = this.markers.entrance_zone.x + this.markers.entrance_zone.width / 2
            let playerY = this.markers.entrance_zone.y + this.markers.entrance_zone.height / 2
            this.spawnPoint = new Phaser.Geom.Point(playerX, playerY)
            this.player.sprite.setPosition(playerX, playerY)
            if (this.markers.exit_zone !== undefined) {
                activeTeleporterZone = new MinigameSprites.TeleporterZone(this, this.markers.exit_zone, this.currentLevelIndex + 1)
            }
        } else {
            // Otherwise, entrances are exits and exits are entrances - you're trying to escape
            // Except if theres a objective - spawn at the objective otherwise
            if (this.markers.objective) {
                this.spawnPoint = new Phaser.Geom.Point(this.markers.objective.x, this.markers.objective.y);
                this.player.sprite.setPosition(this.spawnPoint.x, this.spawnPoint.y)
            } else if (this.markers.exit_zone) {
                let playerX = this.markers.exit_zone.x + this.markers.exit_zone.width / 2
                let playerY = this.markers.exit_zone.y + this.markers.exit_zone.height / 2
                this.spawnPoint = new Phaser.Geom.Point(playerX, playerY)
                this.player.sprite.setPosition(playerX, playerY)
            }
            activeTeleporterZone = new MinigameSprites.TeleporterZone(this, this.markers.entrance_zone, this.currentLevelIndex - 1)
        }

        if (activeTeleporterZone !== undefined)
            this.sprites.addInteractables(activeTeleporterZone)
    }

    /**
     * Reset the player's position to the spawn
     */
    resetPlayerPosition() {
        this.player.sprite.setPosition(this.spawnPoint.x, this.spawnPoint.y)
    }

    /**
     * Update the level when the game state changes
     */
    updateLevel(): void {
        SceneUtil.fadeOut(this.parentScene, () => {
            this.scene.pause()
            let dialogueEventEmitter = new Phaser.Events.EventEmitter()
            SceneUtil.getGUIScene(this).dialogue.start(this, MinigameDialogue.Alerted.Dialogue, dialogueEventEmitter, this.data, () => {
                this.scene.resume()
                for (let npc of this.npcs) {
                    npc.updateState(this.parentScene.state)
                }
                this.updateTeleportAndSpawn()
                SceneUtil.fadeIn(this.parentScene)
            })
        })
    }

    /**
    * Parse the markers for a level and create/configure the goblin NPCs
    * @param markers The markers for the level
    * @returns The goblin NPCs
    */
    parseAndCreateNPCs(markers: Markers): MinigameSprites.NPC.Sprite[] {
        // Create different maps for each possible type of data
        let normalNPCDynamicData: { [key: string]: Phaser.Math.Vector2[] } = {}
        let normalNPCStaticData: { [key: string]: Omit<MinigameSprites.NPC.StaticPathData, "type"> } = {}
        let alertedNPCDynamicData: { [key: string]: Phaser.Math.Vector2[] } = {}
        let alertedNPCStaticData: { [key: string]: Omit<MinigameSprites.NPC.StaticPathData, "type"> } = {}
        // Track all the NPC numbers
        let npcNumbers = []
        // Parse markers and assign each point to the appropriate NPC number in the map
        for (let [key, point] of Object.entries(markers)) {
            point = point as SceneUtil.PointObject
            // key format: {path_type}_{goblin_number}_{path_point_number or direction keyword}
            let splitKey = key.split("_")
            let pathType = splitKey[0].trim().toLowerCase()
            let npcNumber = splitKey[1]
            // If this isn't a valid key continue
            if (isNaN(parseInt(npcNumber))) continue
            let pointNumberOrDirection = splitKey[2];
            let vector2Point = new Phaser.Math.Vector2(point.x, point.y)
            switch (pathType) {
                // normal dynamic
                case "n":
                    if (!normalNPCDynamicData[npcNumber]) normalNPCDynamicData[npcNumber] = []
                    normalNPCDynamicData[npcNumber][parseInt(pointNumberOrDirection)] = vector2Point
                    break;
                // normal static
                case "ns":
                    normalNPCStaticData[npcNumber] = { direction: this.getDirectionFromKeyword(pointNumberOrDirection), point: vector2Point }
                    break;
                // alert dynamic 
                case "a":
                    if (!alertedNPCDynamicData[npcNumber]) alertedNPCDynamicData[npcNumber] = []
                    alertedNPCDynamicData[npcNumber][parseInt(pointNumberOrDirection)] = vector2Point
                    break;
                // alert static
                case "as":
                    alertedNPCStaticData[npcNumber] = { direction: this.getDirectionFromKeyword(pointNumberOrDirection), point: vector2Point }
                    break;
            }

            npcNumbers.push(npcNumber)
        }
        let npcs = []
        // Loop through all NPC numbers, creating path data and initializing goblin NPCs
        for (let npcNumber of npcNumbers) {
            let normalPathData: MinigameSprites.NPC.StaticPathData | MinigameSprites.NPC.DynamicPathData;
            if (normalNPCStaticData[npcNumber] !== undefined) {
                normalPathData = {
                    type: MinigameSprites.NPC.PathType.STATIC,
                    ...normalNPCStaticData[npcNumber]
                }
            } else {
                normalPathData = {
                    type: MinigameSprites.NPC.PathType.DYNAMIC,
                    points: normalNPCDynamicData[npcNumber].filter(r => r !== undefined)
                }
            }

            let alertPathData: MinigameSprites.NPC.StaticPathData | MinigameSprites.NPC.DynamicPathData;
            if (alertedNPCStaticData[npcNumber] !== undefined) {
                alertPathData = {
                    type: MinigameSprites.NPC.PathType.STATIC,
                    ...alertedNPCStaticData[npcNumber]
                }
            } else {
                if (alertedNPCDynamicData[npcNumber] !== undefined) {
                    alertPathData = {
                        type: MinigameSprites.NPC.PathType.DYNAMIC,
                        points: alertedNPCDynamicData[npcNumber].filter(r => r !== undefined)
                    }
                } else {
                    alertPathData = normalPathData
                }
            }

            let pathInformation: MinigameSprites.NPC.PathInformation = {
                normal: normalPathData,
                alerted: alertPathData
            }
            let npc = new MinigameSprites.NPC.Sprite(this, 0, 0, pathInformation)
            npc.sprite.setMask(this.parentScene.playerVisibleAreaMask)
            this.sprites.physicsBodies.add(npc.sprite)
            npcs.push(npc)
        }

        return npcs
    }

    /**
     * Get the direction enum from a keyword
     * @param string The keyword (N E S W)
     * @returns The direction
     */
    getDirectionFromKeyword(keyword: string): SpriteUtil.Direction {
        switch (keyword.toLowerCase()) {
            case "n":
                return SpriteUtil.Direction.UP
            case "e":
                return SpriteUtil.Direction.RIGHT
            case "w":
                return SpriteUtil.Direction.LEFT
            case "s":
                return SpriteUtil.Direction.DOWN
            default:
                return SpriteUtil.Direction.UP
        }
    }
}