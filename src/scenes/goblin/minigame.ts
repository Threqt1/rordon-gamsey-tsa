import { SceneEnums, loadTilemap, scaleAndConfigureCamera, sceneFadeDialogueSwitch } from ".."
import { EndDialogue } from "../../dialogue/elf/minigame"
import { Player } from "../../sprites/game"
import { GoblinNPC } from "../../sprites/goblin/npc"

export class GoblinMinigameScene extends Phaser.Scene {
    player!: Player
    litAreaGraphics!: Phaser.GameObjects.Graphics
    litAreaMask!: Phaser.Display.Masks.GeometryMask
    npcs!: GoblinNPC[]
    colorMatrices!: Phaser.FX.ColorMatrix[]
    gameEnded!: boolean


    constructor() {
        super(SceneEnums.SceneNames.GoblinMinigame)
    }

    create() {
        let { collisionsLayer: collisions, map, playerDepth } = loadTilemap(this, SceneEnums.TilemapNames.GoblinMinigame)

        this.sprites.initialize(map)

        let raycaster = this.raycaster.createRaycaster()
        raycaster.mapGameObjects(collisions, false, {
            collisionTiles: [151]
        })

        this.litAreaGraphics = this.add.graphics({ fillStyle: { color: 0xffffff, alpha: 0 } })
        this.litAreaMask = new Phaser.Display.Masks.GeometryMask(this, this.litAreaGraphics)
        this.litAreaMask.setInvertAlpha(true)
        let lightGraphics = this.add.graphics({ fillStyle: { color: 0x000000, alpha: 0.6 } })
            .setDepth(100)
            .setMask(this.litAreaMask)
            .fillRect(0, 0, this.scale.canvas.width, this.scale.canvas.height)

        this.player = new Player(this, 30, 130)
        this.player.sprite.setDepth(playerDepth)

        let points = [new Phaser.Math.Vector2(100, 130), new Phaser.Math.Vector2(100, 150), new Phaser.Math.Vector2(150, 150), new Phaser.Math.Vector2(150, 130)]
        let npc = new GoblinNPC(this, points, 100, 130, raycaster, this.litAreaGraphics)
        npc.sprite.setDepth(playerDepth)

        let points2 = [new Phaser.Math.Vector2(100, 40), new Phaser.Math.Vector2(100, 80), new Phaser.Math.Vector2(150, 80), new Phaser.Math.Vector2(150, 40)]
        let npc2 = new GoblinNPC(this, points2, 100, 40, raycaster, this.litAreaGraphics)
        npc2.sprite.setDepth(playerDepth)

        this.npcs = [npc, npc2]

        this.sprites.addGameControllables(this.player)
        this.sprites.addPhysicsBodies(this.player.sprite)
        this.sprites.addPhysicsBodies(npc.sprite)

        scaleAndConfigureCamera(this, map, this.player.sprite)

        this.sprites.makeCollisionsWithLayer(collisions)

        this.colorMatrices = []
        this.colorMatrices.push(this.player.sprite.postFX.addColorMatrix())
        //this.colorMatrices.push(lightGraphics.postFX.addColorMatrix())
        for (let npc of this.npcs) {
            this.colorMatrices.push(npc.sprite.postFX.addColorMatrix())
        }
        for (let layer of map.layers) {
            if (layer.tilemapLayer != null) this.colorMatrices.push(layer.tilemapLayer.postFX!.addColorMatrix())
        }

        this.gameEnded = false
        for (let npc of this.npcs) {
            npc.start()
        }
    }

    update() {
        if (this.gameEnded) return
        this.litAreaGraphics.clear()
        for (let npc of this.npcs) {
            npc.drawLight()
            if (npc.ray.overlap(this.player.sprite).length > 0) {
                this.endGame()
            }
        }
    }

    endGame() {
        this.gameEnded = true
        this.sprites.setGameControllable(false)
        for (let npc of this.npcs) {
            npc.stop()
        }
        sceneFadeDialogueSwitch(this, SceneEnums.SceneNames.Menu, this.colorMatrices, EndDialogue, () => { return })
    }
}