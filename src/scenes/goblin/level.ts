import { GOBLIN_MINIGAME_LEVEL_ORDER, GoblinMinigameEvents, GoblinMinigameScene, GoblinMinigameState } from ".";
import { PointObject, RectangleObject, SceneEnums, fadeIn, fadeOut, getGUIScene, loadTilemap, scaleAndConfigureCamera } from "..";
import { GoblinMinigameAlertedDialogue } from "../../dialogue/goblin";
import { Direction } from "../../sprites";
import { Player } from "../../sprites/game";
import { GoblinMinigameNPC, GoblinMinigameStaticPathData, GoblinMinigameDynamicPathData, GoblinMinigamePathType, GoblinMinigamePathInformation, GoblinMinigameObjective } from "../../sprites/goblin";
import { GoblinMinigameLightEmitter, GoblinMinigameLightEmitterType } from "../../sprites/goblin/minigame/lightEmitter";
import { GoblinMinigameTeleporterZone } from "../../sprites/goblin/minigame/zone";
import { PlayerTexture } from "../../textures";

const BONFIRE_LIGHT_RADIUS = 70

/*
TODO:
COMMENTS FOR THIS FILE
*/

type GoblinMinigameObjects = {
    [key: string]: PointObject | RectangleObject | undefined
    entrance_zone: RectangleObject,
    exit_zone?: RectangleObject
    objective?: PointObject
    bonfire?: PointObject
}

export class GoblinMinigameLevelScene extends Phaser.Scene {
    parentScene!: GoblinMinigameScene
    currentLevelIndex!: number
    player!: Player
    npcs!: GoblinMinigameNPC[]
    additionaLights!: GoblinMinigameLightEmitter[]
    map!: Phaser.Tilemaps.Tilemap
    spawnPoint!: Phaser.Geom.Point
    markers!: GoblinMinigameObjects
    playerRay!: Raycaster.Ray
    collisionsLayer!: Phaser.Tilemaps.TilemapLayer

    constructor() {
        super(SceneEnums.SceneNames.GoblinMinigameLevel)
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

    create(config: { parent: GoblinMinigameScene, levelIndex: number }) {
        this.parentScene = config.parent
        this.currentLevelIndex = config.levelIndex
        this.additionaLights = []
        /* MAP LOADING */
        let { collisionsLayer, map, playerSpriteDepth, objects } = loadTilemap(this, GOBLIN_MINIGAME_LEVEL_ORDER[config.levelIndex])
        this.map = map
        this.markers = objects as GoblinMinigameObjects
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
            let objective = new GoblinMinigameObjective(this, this.markers.objective.x, this.markers.objective.y)
            this.sprites.addInteractables(objective)
            this.sprites.physicsBodies.add(objective.sprite)
        }

        // Make the bonfire, if any
        if (this.markers.bonfire !== undefined) {
            let sprite = this.add.sprite(this.markers.bonfire.x, this.markers.bonfire.y, PlayerTexture.TextureKey).setVisible(false)
            this.additionaLights.push(new GoblinMinigameLightEmitter(this, sprite, GoblinMinigameLightEmitterType.CIRCLE, this.add.polygon(
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
            let rectangleObject = _rectangleObject as RectangleObject
            let zone = this.add.zone(rectangleObject.x, rectangleObject.y, rectangleObject.width, rectangleObject.height).setOrigin(0, 0);
            this.physics.world.enable(zone, Phaser.Physics.Arcade.DYNAMIC_BODY);
            (zone.body as Phaser.Physics.Arcade.Body).setImmovable(true)
            this.physics.add.collider(zone, this.player.sprite, () => {
                this.parentScene.gameEvents.emit(GoblinMinigameEvents.DEAD)
            })
        }

        this.sprites.physicsBodies.setDepth(playerSpriteDepth)
        this.sprites.makeCollisionsWithLayer(collisionsLayer)

        // Configure camera
        scaleAndConfigureCamera(this, map, this.player.sprite)
        scaleAndConfigureCamera(this.parentScene, this.map, this.player.sprite)

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
        let activeTeleporterZone: GoblinMinigameTeleporterZone | undefined;
        // If the state is normal, make the exit zone and spawn in the middle of entrance - trying to progress inward
        if (this.parentScene.state === GoblinMinigameState.NORMAL) {
            let playerX = this.markers.entrance_zone.x + this.markers.entrance_zone.width / 2
            let playerY = this.markers.entrance_zone.y + this.markers.entrance_zone.height / 2
            this.spawnPoint = new Phaser.Geom.Point(playerX, playerY)
            this.player.sprite.setPosition(playerX, playerY)
            if (this.markers.exit_zone !== undefined) {
                activeTeleporterZone = new GoblinMinigameTeleporterZone(this, this.markers.exit_zone, this.currentLevelIndex + 1)
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
            activeTeleporterZone = new GoblinMinigameTeleporterZone(this, this.markers.entrance_zone, this.currentLevelIndex - 1)
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
        fadeOut(this.parentScene, () => {
            this.scene.pause()
            let dialogueEventEmitter = new Phaser.Events.EventEmitter()
            getGUIScene(this).dialogue.start(this, GoblinMinigameAlertedDialogue.Dialogue, dialogueEventEmitter, this.data, () => {
                this.scene.resume()
                for (let npc of this.npcs) {
                    npc.updateState(this.parentScene.state)
                }
                this.updateTeleportAndSpawn()
                fadeIn(this.parentScene)
            })
        })
    }

    /**
    * Parse the markers for a level and create/configure the goblin NPCs
    * @param markers The markers for the level
    * @returns The goblin NPCs
    */
    parseAndCreateNPCs(markers: GoblinMinigameObjects): GoblinMinigameNPC[] {
        // Create different maps for each possible type of data
        let normalNPCDynamicData: { [key: string]: Phaser.Math.Vector2[] } = {}
        let normalNPCStaticData: { [key: string]: Omit<GoblinMinigameStaticPathData, "type"> } = {}
        let alertedNPCDynamicData: { [key: string]: Phaser.Math.Vector2[] } = {}
        let alertedNPCStaticData: { [key: string]: Omit<GoblinMinigameStaticPathData, "type"> } = {}
        // Track all the NPC numbers
        let npcNumbers = []
        // Parse markers and assign each point to the appropriate NPC number in the map
        for (let [key, point] of Object.entries(markers)) {
            point = point as PointObject
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
            let normalPathData: GoblinMinigameStaticPathData | GoblinMinigameDynamicPathData;
            if (normalNPCStaticData[npcNumber] !== undefined) {
                normalPathData = {
                    type: GoblinMinigamePathType.STATIC,
                    ...normalNPCStaticData[npcNumber]
                }
            } else {
                normalPathData = {
                    type: GoblinMinigamePathType.DYNAMIC,
                    points: normalNPCDynamicData[npcNumber].filter(r => r !== undefined)
                }
            }

            let alertPathData: GoblinMinigameStaticPathData | GoblinMinigameDynamicPathData;
            if (alertedNPCStaticData[npcNumber] !== undefined) {
                alertPathData = {
                    type: GoblinMinigamePathType.STATIC,
                    ...alertedNPCStaticData[npcNumber]
                }
            } else {
                if (alertedNPCDynamicData[npcNumber] !== undefined) {
                    alertPathData = {
                        type: GoblinMinigamePathType.DYNAMIC,
                        points: alertedNPCDynamicData[npcNumber].filter(r => r !== undefined)
                    }
                } else {
                    alertPathData = normalPathData
                }
            }

            let pathInformation: GoblinMinigamePathInformation = {
                normal: normalPathData,
                alerted: alertPathData
            }
            let npc = new GoblinMinigameNPC(this, 0, 0, pathInformation)
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
    getDirectionFromKeyword(keyword: string): Direction {
        switch (keyword.toLowerCase()) {
            case "n":
                return Direction.UP
            case "e":
                return Direction.RIGHT
            case "w":
                return Direction.LEFT
            case "s":
                return Direction.DOWN
            default:
                return Direction.UP
        }
    }
}