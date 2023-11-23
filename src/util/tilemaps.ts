import { CollisionCategory } from "../enums/collisionCategories"

const MAPS_PATH = "/maps/tilemaps"
const TILESETS_PATH = "/maps/tilesets"

export function PreloadTilemap(scene: Phaser.Scene, name: string, mapPath: string, tilesetPath: string): void {
    scene.load.image(`${name}_tileset`, `${TILESETS_PATH}/${tilesetPath}`)
    scene.load.tilemapTiledJSON(`${name}_map`, `${MAPS_PATH}/${mapPath}`)
    scene.load.json(`${name}_raw`, `${MAPS_PATH}/${mapPath}`)
}

type LoadedTilemap = {
    map: Phaser.Tilemaps.Tilemap
    collisions: Phaser.Tilemaps.TilemapLayer
    playerDepth: number
}

export function LoadTilemap(scene: Phaser.Scene, name: string): LoadedTilemap {
    const tilemap = Phaser.Tilemaps.Parsers.Tiled.ParseJSONTiled(name, scene.cache.json.get(`${name}_raw`), true)!

    const map = scene.make.tilemap({ key: `${name}_map`, tileHeight: tilemap.tileHeight, tileWidth: tilemap.tileWidth })
    map.addTilesetImage(tilemap.tilesets[0].name, `${name}_tileset`, tilemap.tileWidth, tilemap.tileHeight, 1, 2)

    let layers = (tilemap.layers as Phaser.Tilemaps.LayerData[])

    let collisionsLayerName = layers.find(r => r.name.toLowerCase() === "collisions")
    if (!collisionsLayerName) throw new Error(`no collision layer found for ${name}`)
    let playerLayerName = layers.find(r => r.name.toLowerCase() === "player")
    if (!playerLayerName) throw new Error(`no player layer found for ${name}`)

    const collisions = map.createLayer(collisionsLayerName.name, tilemap.tilesets[0].name)!
    collisions.setDepth(0)
    collisions.setCollisionCategory(CollisionCategory.MAP)
    map.setCollisionBetween(1, map.tiles.length, true, undefined, collisions)

    let depth = 0;
    let playerDepth = -1;
    for (let rawLayer of layers) {
        if (rawLayer.name === collisionsLayerName.name) continue;
        depth++;
        if (rawLayer.name === playerLayerName.name) {
            playerDepth = depth
            continue;
        };

        let layer = map.createLayer(rawLayer.name, tilemap.tilesets[0].name)!;
        layer.setDepth(depth)
    }

    return {
        map,
        collisions,
        playerDepth
    }
}