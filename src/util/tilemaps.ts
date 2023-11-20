import { CollisionCategory } from "../enums/collisionCategories"

const MAPS_PATH = "/maps/tilemaps"
const TILESETS_PATH = "/maps/tilesets"

export function PreloadTilemap(scene: Phaser.Scene, name: string, mapPath: string, tilesheetPath: string): void {
    scene.load.image(`${name}_tileset`, `${TILESETS_PATH}/${tilesheetPath}`)
    scene.load.tilemapTiledJSON(`${name}_map`, `${MAPS_PATH}/${mapPath}`)
    scene.load.json(`${name}_raw`, `${MAPS_PATH}/${mapPath}`)
}

type TilemapJSON = {
    tilewidth: number
    tileheight: number
    tilesets: { name: string }[],
    layers: { name: string }[]
}

type LoadedTilemap = {
    map: Phaser.Tilemaps.Tilemap
    collisions: Phaser.Tilemaps.TilemapLayer
    playerDepth: number
}

export function LoadTilemap(scene: Phaser.Scene, name: string): LoadedTilemap {
    const tilemap: TilemapJSON = scene.cache.json.get(`${name}_raw`)
    if (tilemap.layers.length <= 0 || tilemap.tilesets.length <= 0) throw new Error(`no tilesets or layers found for ${name}`)

    const map = scene.make.tilemap({ key: `${name}_map`, tileHeight: tilemap.tileheight, tileWidth: tilemap.tilewidth })
    const tilesetName = tilemap.tilesets[0].name
    map.addTilesetImage(tilesetName, `${name}_tileset`, tilemap.tilewidth, tilemap.tileheight, 1, 2)

    let collisionsLayerName = tilemap.layers.find(r => r.name.toLowerCase() === "collisions")
    if (!collisionsLayerName) throw new Error(`no collision layer found for ${name}`)
    let playerLayerName = tilemap.layers.find(r => r.name.toLowerCase() === "player")
    if (!playerLayerName) throw new Error(`no player layer found for ${name}`)

    const collisions = map.createLayer(collisionsLayerName.name, tilesetName)!
    collisions.setDepth(0)
    collisions.setCollisionCategory(CollisionCategory.MAP)
    map.setCollisionBetween(1, map.tiles.length, true, undefined, collisions)

    let depth = 0;
    let playerDepth = -1;
    for (let rawLayer of tilemap.layers) {
        if (rawLayer.name === collisionsLayerName.name) continue;
        depth++;
        if (rawLayer.name === playerLayerName.name) {
            playerDepth = depth
            continue;
        };

        let layer = map.createLayer(rawLayer.name, tilesetName)!;
        layer.setDepth(depth)
    }

    return {
        map,
        collisions,
        playerDepth
    }
}