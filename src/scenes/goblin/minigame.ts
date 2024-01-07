import { SceneEnums, loadTilemap, scaleAndConfigureCamera } from ".."
import { Player, NPC, Interaction } from "../../sprites/game"
import { GoblinNPC } from "../../sprites/goblin/npc"

export class GoblinMinigameScene extends Phaser.Scene {
    // ray!: Raycaster.Ray
    player!: Player
    // fov!: Phaser.GameObjects.Rectangle
    // lightMaskGraphics!: Phaser.GameObjects.Graphics
    // rayVisualizationGraphics!: Phaser.GameObjects.Graphics


    constructor() {
        super(SceneEnums.SceneNames.GoblinMinigame)
    }

    create() {
        let { collisionsLayer: collisions, map, playerDepth } = loadTilemap(this, SceneEnums.TilemapNames.GoblinMinigame)

        this.sprites.initialize(map)

        this.player = new Player(this, 30, 130)
        this.player.sprite.setDepth(playerDepth)
        let path = new Phaser.Curves.Path(100, 130).lineTo(100, 160).lineTo(150, 160).lineTo(150, 130).lineTo(100, 130)
        let npc = new GoblinNPC(this, path, 100, 130)
        npc.sprite.setDepth(playerDepth)

        this.sprites.addGameControllables(this.player)
        this.sprites.addPhysicsBodies(this.player.sprite)
        this.sprites.addPhysicsBodies(npc.sprite)

        scaleAndConfigureCamera(this, map, this.player.sprite)

        this.sprites.makeCollisionsWithLayer(collisions)

        // this.player = new Player(this, 30, 130)
        // let npc1 = new NPC(this, 100, 150)

        // this.sprites.addGameControllables(this.player)
        // this.sprites.addInteractables(npc1)
        // this.sprites.addSprites(this.player.sprite, npc1.sprite)
        // this.sprites.physicsBodies.setDepth(playerDepth)

        // scaleAndConfigureCamera(this, map, this.player.sprite)

        // this.sprites.makeCollisionsWithLayer(collisions)

        // let raycaster = this.raycaster.createRaycaster()
        // raycaster.mapGameObjects(collisions, false, {
        //     collisionTiles: [151]
        // })

        // this.ray = raycaster.createRay()
        // this.ray.setConeDeg(60);

        // this.lightMaskGraphics = this.add.graphics({ fillStyle: { color: 0xffffff, alpha: 0 } })
        // this.rayVisualizationGraphics = this.add.graphics({ lineStyle: { width: 1, color: 0x00ff00 } }).setDepth(100)
        // let mask = new Phaser.Display.Masks.GeometryMask(this, this.lightMaskGraphics)
        // let invertedMask = new Phaser.Display.Masks.GeometryMask(this, this.lightMaskGraphics)
        // invertedMask.setInvertAlpha(true)
        // this.add.graphics({ fillStyle: { color: 0x000000, alpha: 0.6 } })
        //     .setDepth(100)
        //     .setMask(invertedMask)
        //     .fillRect(0, 0, this.scale.canvas.width, this.scale.canvas.height)
        // npc1.sprite.setMask(mask)
    }

    update() {
        // this.lightMaskGraphics.clear()
        // this.rayVisualizationGraphics.clear()

        // this.ray.setOrigin(this.player.sprite.x, this.player.sprite.y)
        // switch (this.player.direction) {
        //     case Interaction.UP:
        //         this.ray.setAngleDeg(-90)
        //         break;
        //     case Interaction.LEFT:
        //         this.ray.setAngleDeg(-180)
        //         break;
        //     case Interaction.RIGHT:
        //         this.ray.setAngleDeg(0)
        //         break;
        //     case Interaction.DOWN:
        //         this.ray.setAngleDeg(90)
        //         break;
        // }

        // let intersections = this.ray.castCone()

        // for (let intersection of intersections) {
        //     this.rayVisualizationGraphics.strokeLineShape(new Phaser.Geom.Line(this.ray.origin.x, this.ray.origin.y, intersection.x, intersection.y));
        // }

        // intersections.push(new Phaser.Geom.Point(this.player.sprite.x, this.player.sprite.y))

        // this.lightMaskGraphics.fillPoints(intersections)
    }
}