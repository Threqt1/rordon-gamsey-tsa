import { SceneEnums, loadTilemap, scaleAndConfigureCamera } from ".."
import { Player, NPC } from "../../sprites/game"

export class GoblinMinigameScene extends Phaser.Scene {
    ray!: Raycaster.Ray
    player!: Player
    lightMaskGraphics!: Phaser.GameObjects.Graphics


    constructor() {
        super(SceneEnums.SceneNames.GoblinMinigame)
    }

    create() {
        let { collisionsLayer: collisions, map, playerDepth } = loadTilemap(this, "goblin minigame")

        this.sprites.initialize(map)

        this.player = new Player(this, 30, 130)

        this.sprites.addGameControllables(this.player)
        this.sprites.addSprites(this.player.sprite)
        this.sprites.physicsBodies.setDepth(playerDepth)

        scaleAndConfigureCamera(this, map, this.player.sprite)

        this.sprites.makeCollisionsWithLayer(collisions)

        let raycaster = this.raycaster.createRaycaster()
        raycaster.mapGameObjects(collisions, false, {
            collisionTiles: [151]
        })
        this.ray = raycaster.createRay({
            origin: {
                x: 30,
                y: 130
            }
        })

        this.lightMaskGraphics = this.add.graphics({ fillStyle: { color: 0xffffff, alpha: 0 } })
        let mask = new Phaser.Display.Masks.GeometryMask(this, this.lightMaskGraphics).setInvertAlpha()
        this.add.graphics({ fillStyle: { color: 0x000000, alpha: 0.6 } })
            .setDepth(100)
            .setMask(mask)
            .fillRect(0, 0, this.scale.canvas.width, this.scale.canvas.height)
    }

    update() {
        this.lightMaskGraphics.clear()

        this.ray.setOrigin(this.player.sprite.x, this.player.sprite.y)

        let intersections = this.ray.castCircle()

        this.lightMaskGraphics.fillPoints(intersections)
    }
}