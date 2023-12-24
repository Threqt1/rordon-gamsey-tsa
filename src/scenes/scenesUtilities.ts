export namespace SceneEnums {
    export enum SceneNames {
        Preloader = "preloader",
        Menu = "menu",
        Game = "game",
        Minigame = "minigame"
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

export function scaleAndConfigureCamera(scene: Phaser.Scene, map: Phaser.Tilemaps.Tilemap, player?: Phaser.Physics.Arcade.Sprite) {
    const camera = scene.cameras.main;
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
    if (player)
        camera.startFollow(player, true, CAMERA_LERP_X, CAMERA_LERP_Y);
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
    if (scene.scale.height > scene.scale.width) {
        camera.setZoom(scene.scale.width / map.widthInPixels)
    } else[
        camera.setZoom(scene.scale.height / map.heightInPixels)
    ]
}

const MAPS_PATH = "/maps/tilemaps"
const TILESETS_PATH = "/maps/tilesets"

export function preloadTilemap(scene: Phaser.Scene, name: string, mapPath: string, ...tilesetPaths: string[]): void {
    for (let i = 0; i < tilesetPaths.length; i++) {
        scene.load.image(`${name}_tileset_${i}`, `${TILESETS_PATH}/${tilesetPaths[i]}`)
    }
    scene.load.tilemapTiledJSON(`${name}_map`, `${MAPS_PATH}/${mapPath}`)
    scene.load.json(`${name}_raw`, `${MAPS_PATH}/${mapPath}`)
}

type LoadedTilemap = {
    map: Phaser.Tilemaps.Tilemap
    collisionsLayer: Phaser.Tilemaps.TilemapLayer
    playerDepth: number
}

const COLLISION_LAYER_NAME = "collisions"
const PLAYER_LAYER_NAME = "player"

export function loadTilemap(scene: Phaser.Scene, name: string): LoadedTilemap {
    const rawTilemapJSON = Phaser.Tilemaps.Parsers.Tiled.ParseJSONTiled(name, scene.cache.json.get(`${name}_raw`), true)!

    const tilemap = scene.make.tilemap({ key: `${name}_map`, tileHeight: rawTilemapJSON.tileHeight, tileWidth: rawTilemapJSON.tileWidth })
    const tilesetImageNames: string[] = []
    for (let i = 0; i < rawTilemapJSON.tilesets.length; i++) {
        tilemap.addTilesetImage(rawTilemapJSON.tilesets[i].name, `${name}_tileset_${i}`, rawTilemapJSON.tileWidth, rawTilemapJSON.tileHeight, 1, 2)
        tilesetImageNames.push(rawTilemapJSON.tilesets[i].name)
    }

    let rawLayers = (rawTilemapJSON.layers as Phaser.Tilemaps.LayerData[])
    let collisionsLayerName = rawLayers.find(r => r.name.toLowerCase() === COLLISION_LAYER_NAME)
    if (!collisionsLayerName) throw new Error(`no collision layer found for ${name}`)
    let playerLayerName = rawLayers.find(r => r.name.toLowerCase() === PLAYER_LAYER_NAME)
    if (!playerLayerName) throw new Error(`no player layer found for ${name}`)

    const collisionsLayer = tilemap.createLayer(collisionsLayerName.name, tilesetImageNames)!
    collisionsLayer.setDepth(0)
    collisionsLayer.setCollisionCategory(SceneEnums.CollisionCategories.MAP)
    tilemap.setCollisionBetween(1, tilemap.tiles.length, true, undefined, collisionsLayer)

    let depth = 0;
    let playerDepth = -1;
    for (let rawLayer of rawLayers) {
        if (rawLayer.name === collisionsLayerName.name) continue;
        depth++;
        if (rawLayer.name === playerLayerName.name) {
            playerDepth = depth
            continue;
        };

        let layer = tilemap.createLayer(rawLayer.name, tilesetImageNames)!;
        layer.setDepth(depth)
    }

    return {
        map: tilemap,
        collisionsLayer: collisionsLayer,
        playerDepth
    }
}

const DURATION = 500;

export function switchScenesFadeOut(scene: Phaser.Scene, nextScene: SceneEnums.SceneNames) {
    scene.cameras.main.fadeOut(DURATION, 0, 0, 0)
    scene.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
        scene.scene.start(nextScene, { fade: true })
    })
}

export function switchSceneFadeIn(scene: Phaser.Scene) {
    scene.cameras.main.fadeIn(DURATION, 0, 0, 0);
}

export function pct(full: number, pct: number) {
    return full * (pct / 100)
}