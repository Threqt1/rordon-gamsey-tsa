import { SceneEnums, loadTilemap, scaleAndConfigureCamera, sceneFadeDialogueSwitch } from ".."
import { EndDialogue } from "../../dialogue/elf/minigame"
import { Player } from "../../sprites/game"
import { GoblinNPC } from "../../sprites/goblin/npc"

let BACKUP_GAME_MASK_DEPTH = 100
let GAME_MASK_DEPTH = 101
let PLAYER_MASK_DEPTH = 102

export class GoblinMinigameScene extends Phaser.Scene {
    player!: Player
    litAreaGraphics!: Phaser.GameObjects.Graphics
    litAreaMask!: Phaser.Display.Masks.GeometryMask
    playerAreaGraphics!: Phaser.GameObjects.Graphics
    playerAreaMask!: Phaser.Display.Masks.GeometryMask
    playerRay!: Raycaster.Ray
    npcs!: GoblinNPC[]
    gameEnded!: boolean


    constructor() {
        super(SceneEnums.SceneNames.GoblinMinigame)
    }

    create() {
        let { collisionsLayer: collisions, map, playerDepth } = loadTilemap(this, SceneEnums.TilemapNames.GoblinMinigame)

        this.sprites.initialize(map)

        const createRaycasterSettings = (raycaster: Raycaster) => {
            raycaster.mapGameObjects(collisions, false, {
                collisionTiles: [151]
            })
        }

        let raycaster = this.raycaster.createRaycaster()
        createRaycasterSettings(raycaster)
        this.playerRay = raycaster.createRay()
        this.playerRay.autoSlice = true

        this.playerAreaGraphics = this.add.graphics().removeFromDisplayList()
        this.playerAreaMask = new Phaser.Display.Masks.GeometryMask(this, this.playerAreaGraphics)
        this.playerAreaMask.setInvertAlpha(true)
        let playerAreaMaskInverse = new Phaser.Display.Masks.GeometryMask(this, this.playerAreaGraphics)
        this.add.graphics({ fillStyle: { color: 0x000000, alpha: 1 } })
            .setDepth(PLAYER_MASK_DEPTH)
            .setMask(this.playerAreaMask)
            .fillRect(0, 0, this.scale.canvas.width, this.scale.canvas.height)
        this.litAreaGraphics = this.add.graphics().removeFromDisplayList()
        this.litAreaMask = new Phaser.Display.Masks.GeometryMask(this, this.litAreaGraphics)
        this.litAreaMask.setInvertAlpha(true)
        this.add.graphics({ fillStyle: { color: 0x000000, alpha: 0.6 } })
            .setDepth(GAME_MASK_DEPTH)
            .setMask(this.litAreaMask)
            .fillRect(0, 0, this.scale.canvas.width, this.scale.canvas.height)

        this.player = new Player(this, 30, 130)
        this.player.sprite.setDepth(playerDepth)

        let points = [new Phaser.Math.Vector2(100, 130), new Phaser.Math.Vector2(100, 150), new Phaser.Math.Vector2(150, 150), new Phaser.Math.Vector2(150, 130)]
        let npc = new GoblinNPC(this, points, 100, 130, this.litAreaGraphics, createRaycasterSettings)
        npc.sprite.setDepth(playerDepth)

        let points2 = [new Phaser.Math.Vector2(100, 40), new Phaser.Math.Vector2(100, 80), new Phaser.Math.Vector2(150, 80), new Phaser.Math.Vector2(150, 40)]
        let npc2 = new GoblinNPC(this, points2, 100, 40, this.litAreaGraphics, createRaycasterSettings)
        npc2.sprite.setDepth(playerDepth)

        this.npcs = [npc, npc2]

        this.sprites.addGameControllables(this.player)
        this.sprites.addPhysicsBodies(this.player.sprite)
        this.sprites.addPhysicsBodies(...this.npcs.map(r => r.sprite))

        scaleAndConfigureCamera(this, map, this.player.sprite)

        this.sprites.makeCollisionsWithLayer(collisions)

        this.gameEnded = false
        for (let npc of this.npcs) {
            npc.sprite.setMask(playerAreaMaskInverse)
            npc.start()
        }
    }

    update() {
        if (this.gameEnded) return
        this.playerAreaGraphics.clear()
        this.litAreaGraphics.clear()

        this.playerRay.setOrigin(this.player.sprite.x, this.player.sprite.y)
        this.playerRay.castCircle()

        for (let slice of this.playerRay.slicedIntersections) {
            this.playerAreaGraphics.fillTriangleShape(slice)
        }

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
        sceneFadeDialogueSwitch(this, SceneEnums.SceneNames.Menu, EndDialogue)
    }
}