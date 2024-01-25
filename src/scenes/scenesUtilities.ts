import { GUIScene } from ".";

export namespace SceneEnums {
    export enum SceneNames {
        Preloader = "preloader",
        Menu = "menu",
        Game = "game",
        ElfHub = "elfhub",
        ElfMinigame = "elfminigame",
        ElfPostMinigame = "elfpostminigame",
        GoblinMinigame = "goblinminigame",
        GoblinMinigameLevel = "goblinminigamelevel",
        GUI = "gui"
    }
    export enum TilemapNames {
        Game = "game",
        GoblinMinigameLevel1 = "goblinminigame1",
        GoblinMinigameLevel2 = "goblinminigame2",
        GoblinMinigameLevel3 = "goblinminigame3",
        ElfMinigame = "elfminigame",
        ElfHub = "elfhub"
    }
    export enum CollisionCategories {
        MAP = 1,
        INTERACTABLE,
        CONTROLLABLE,
        INTERACTION_ZONE
    }
}

const CAMERA_LERP_X = 0.2
const CAMERA_LERP_Y = 0.2

/**
 * Scales and configures a scene's camera based on the map dimensions and player
 * @param scene The scene which the camera is on
 * @param map The map reference
 * @param player The player reference
 */
export function scaleAndConfigureCamera(scene: Phaser.Scene, map: Phaser.Tilemaps.Tilemap, player?: Phaser.Physics.Arcade.Sprite) {
    const camera = scene.cameras.main;
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
    if (player)
        camera.startFollow(player, true, CAMERA_LERP_X, CAMERA_LERP_Y);
    // Set the zoom based on the smallest dimension
    if (scene.scale.height > scene.scale.width) {
        camera.setZoom(scene.scale.width / map.widthInPixels)
    } else[
        camera.setZoom(scene.scale.height / map.heightInPixels)
    ]
}

const MAPS_PATH = "/maps/tilemaps"
const TILESETS_PATH = "/maps/tilesets"

/**
 * Preload a tilemap into the game
 * @param scene The scene to preload into
 * @param name The name of the tilemap
 * @param mapPath The path to the map JSON file
 * @param tilesetPaths The path to the tileset(s)
 */
export function preloadTilemap(scene: Phaser.Scene, name: SceneEnums.TilemapNames, mapPath: string, ...tilesetPaths: string[]): void {
    for (let i = 0; i < tilesetPaths.length; i++) {
        scene.load.image(`${name}_tileset_${i}`, `${TILESETS_PATH}/${tilesetPaths[i]}`)
    }
    scene.load.tilemapTiledJSON(`${name}_map`, `${MAPS_PATH}/${mapPath}`)
    scene.load.json(`${name}_raw`, `${MAPS_PATH}/${mapPath}`)
}

/**
 * A point object from Tiled
 */
export type PointObject = {
    name: string,
    x: number,
    y: number
}

/**
 * A rectangle object from Tiled
 */
export type RectangleObject = {
    name: string,
    x: number,
    y: number,
    width: number,
    height: number,
    rotation: number
}

/**
 * A loaded and parsed tilemap
 */
type LoadedTilemap = {
    map: Phaser.Tilemaps.Tilemap
    collisionsLayer: Phaser.Tilemaps.TilemapLayer
    playerSpriteDepth: number
    objects: { [key: string]: any }
}

const COLLISION_LAYER_NAME = "collisions"
const PLAYER_LAYER_NAME = "player"
const TILE_MARGIN = 1
const TILE_SPACING = 2

/**
 * Load a preloaded tilemap
 * @param scene The scene to load into
 * @param name The naem of the tilemap
 * @returns The loaded tilemap
 */
export function loadTilemap(scene: Phaser.Scene, name: SceneEnums.TilemapNames): LoadedTilemap {
    // Get and parse the raw JSON
    const rawTilemapJSON = scene.cache.json.get(`${name}_raw`)
    const mapData = Phaser.Tilemaps.Parsers.Tiled.ParseJSONTiled(name, rawTilemapJSON, true)!
    // Create the base tilemap object
    const tilemap = scene.make.tilemap({ key: `${name}_map`, tileHeight: mapData.tileHeight, tileWidth: mapData.tileWidth })

    //Get all the tilesets in the raw JSON and upload the corresponding image assets for them
    const tilesetImageNames: string[] = []
    for (let i = 0; i < rawTilemapJSON.tilesets.length; i++) {
        tilemap.addTilesetImage(rawTilemapJSON.tilesets[i].name, `${name}_tileset_${i}`, rawTilemapJSON.tileWidth, rawTilemapJSON.tileHeight, TILE_MARGIN, TILE_SPACING)
        tilesetImageNames.push(rawTilemapJSON.tilesets[i].name)
    }

    // FInd the player and collision layers and configure them accordingly
    let rawTileLayers = Phaser.Tilemaps.Parsers.Tiled.ParseTileLayers(rawTilemapJSON, true)
    let collisionsLayerName = rawTileLayers.find(r => r.name.toLowerCase() === COLLISION_LAYER_NAME)
    if (!collisionsLayerName) throw new Error(`no collision layer found for ${name}`)
    let playerLayerName = rawTileLayers.find(r => r.name.toLowerCase() === PLAYER_LAYER_NAME)
    if (!playerLayerName) throw new Error(`no player layer found for ${name}`)
    const collisionsLayer = tilemap.createLayer(collisionsLayerName.name, tilesetImageNames)!
    collisionsLayer.setDepth(0)
    collisionsLayer.setCollisionCategory(SceneEnums.CollisionCategories.MAP)
    tilemap.setCollisionBetween(1, tilemap.tiles.length, true, undefined, collisionsLayer)

    // Configure all the tile layers
    let depth = 0;
    let playerDepth = -1;
    let objects: { [key: string]: any } = {}
    for (let rawLayer of rawTileLayers) {
        if (rawLayer.name === collisionsLayerName.name) continue;
        depth++;
        if (rawLayer.name === playerLayerName.name) {
            playerDepth = depth
            continue;
        };

        let layer = tilemap.createLayer(rawLayer.name, tilesetImageNames)!;
        layer.setDepth(depth)
    }

    // Parse all the object layers
    let rawObjectLayers = Phaser.Tilemaps.Parsers.Tiled.ParseObjectLayers(rawTilemapJSON)
    for (let rawLayer of rawObjectLayers) {
        for (let object of rawLayer.objects) {
            let parsedObject: { [key: string]: any } = Phaser.Tilemaps.Parsers.Tiled.ParseObject(object)
            objects[(parsedObject.name) as string] = parsedObject
        }
    }

    // Initialize animated tiles plugin
    scene.animatedTiles.init(tilemap)

    return {
        map: tilemap,
        collisionsLayer: collisionsLayer,
        playerSpriteDepth: playerDepth,
        objects
    }
}

const DURATION = 500;

/**
 * Fade out the camera in a scene
 * @param scene The scene to fade out the camera on
 * @param callback Code to run when the fade out is complete
 */
export function fadeOut(scene: Phaser.Scene, callback?: () => void): void {
    if (!scene.cameras.main) {
        if (callback) callback()
        return
    }
    scene.cameras.main.fadeOut(DURATION, 0, 0, 0)
    scene.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
        if (callback != undefined) callback()
    })
}

/**
 * Fade in the camera in a scene
 * @param scene The scene to fade in the camera on
 * @param callback Code to run when the fade in is complete
 */
export function fadeIn(scene: Phaser.Scene, callback?: () => void): void {
    if (!scene.cameras.main) {
        if (callback) callback()
        return
    }
    scene.cameras.main.fadeIn(DURATION, 0, 0, 0)
    scene.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE, () => {
        if (callback != undefined) callback()
    })
}

/**
 * Transition between scenes using fade ins/fade outs
 * @param scene The current scene
 * @param nextScene The next scene's name
 */
export function fadeSceneTransition(scene: Phaser.Scene, nextScene: SceneEnums.SceneNames): void {
    fadeOut(scene, () => {
        scene.scene.start(nextScene)
        scene.scene.moveAbove(nextScene, SceneEnums.SceneNames.GUI)
        scene.scene.get(nextScene).events.once(Phaser.Scenes.Events.CREATE, () => {
            fadeIn(scene.scene.get(nextScene))
        })
    })
}

/**
 * A utility method to get the GUI scene
 * @param scene The scene to call from
 * @returns The GUI scene
 */
export function getGUIScene(scene: Phaser.Scene): GUIScene {
    return scene.scene.get(SceneEnums.SceneNames.GUI) as GUIScene
}

/**
 * A utility function to get the percent of something
 * @param full The total amount
 * @param pct The percent to get
 * @returns The pct amount of full
 */
export function pct(full: number, pct: number) {
    return full * (pct / 100)
}