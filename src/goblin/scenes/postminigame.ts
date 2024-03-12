import { SceneEnums } from "../../shared/repository"
import { PlayerTexture } from "../../shared/textures"
import { SceneUtil } from "../../shared/util"
import { CutsceneTexture, GoblinTexture } from "../textures"

const PLAYER_SPEED = 60
const PLAYER_MINECART_OFFSET = 5
const MAX_GOBLINS = 50
const GOBLIN_SPEED = 80
const GOBLIN_MAX_ANGULAR_VELOCITY = 300
const GOBLIN_MAX_SPLINE_OFFSET_Y = 100
const ORC_MINECART_OFFSET = 5
const ORC_MINECART_SPEED = 300

const GOBLIN_SPAWN_DELAY = 2000
const GOBLIN_SPAWN_INTERVAL = 70
const PLAYER_ENTER_PAUSE = 1000
const ORC_RAM_PAUSE = 1000
const END_SCENE_DELAY = 1500

type GoblinPostMinigameMarkers = {
    CaveExit: SceneUtil.PointObject
    MinecartStartPosition: SceneUtil.PointObject
    OrcMinecartStartPosition: SceneUtil.PointObject
}

export class GoblinPostMinigameScene extends Phaser.Scene {
    markers!: GoblinPostMinigameMarkers
    player!: Phaser.GameObjects.PathFollower
    playerMinecart!: Phaser.GameObjects.PathFollower
    goblins!: Phaser.GameObjects.PathFollower[]
    goblinsPaused!: boolean
    depth!: number
    elapsedDt!: number
    playerMinecartInMotion!: boolean

    constructor() {
        super(SceneEnums.Name.GoblinPostMinigame)
    }

    create() {
        let { map, playerSpriteDepth, objects, collisionsLayer } = SceneUtil.loadTilemap(this, SceneEnums.Tilemap.GoblinPostMinigame)
        collisionsLayer = collisionsLayer!
        this.depth = playerSpriteDepth + 1
        this.markers = objects as GoblinPostMinigameMarkers

        this.sprites.initialize(map)

        this.playerMinecart = this.add.follower(new Phaser.Curves.Path(), this.markers.MinecartStartPosition.x, this.markers.MinecartStartPosition.y, CutsceneTexture.TextureKey, CutsceneTexture.Frames.Minecart)
            .setDepth(this.depth)

        let playerPathInitial = new Phaser.Curves.Path(this.markers.CaveExit.x, this.markers.CaveExit.y).lineTo(this.markers.MinecartStartPosition.x, this.markers.MinecartStartPosition.y - PLAYER_MINECART_OFFSET)
        this.player = this.add.follower(playerPathInitial, playerPathInitial.startPoint.x, playerPathInitial.startPoint.y, PlayerTexture.TextureKey)
            .setDepth(this.depth)

        this.goblins = []
        this.goblinsPaused = false
        this.elapsedDt = -GOBLIN_SPAWN_DELAY
        this.playerMinecartInMotion = false

        SceneUtil.scaleAndConfigureCamera(this, map)

        this.player.startFollow({
            duration: playerPathInitial.getLength() / PLAYER_SPEED * 1000,
            onStart: () => {
                this.player.play(PlayerTexture.Animations.WalkRight)
            },
            onComplete: () => {
                this.player.play(PlayerTexture.Animations.IdleFront)
                this.setGoblinPause(true)
                this.time.delayedCall(PLAYER_ENTER_PAUSE, () => {
                    this.createAndStartOrc()
                })
            }
        })
    }

    launchPlayerMinecart() {
        let playerMinecartPath = new Phaser.Curves.Path(this.markers.MinecartStartPosition.x, this.markers.MinecartStartPosition.y)
            .lineTo(this.markers.MinecartStartPosition.x, this.markers.MinecartStartPosition.y + this.sprites.map!.heightInPixels)
        this.player.setPath(playerMinecartPath)
        this.playerMinecart.setPath(playerMinecartPath)
        this.player.startFollow({
            duration: playerMinecartPath.getLength() / ORC_MINECART_SPEED * 1000,
        })
        this.playerMinecart.startFollow({
            duration: playerMinecartPath.getLength() / ORC_MINECART_SPEED * 1000,
        })
    }

    setGoblinPause(pause: boolean) {
        this.goblinsPaused = pause
        for (let goblin of this.goblins) {
            if (pause) {
                (goblin.body as Phaser.Physics.Arcade.Body).setAngularVelocity(0);
                goblin.setAngle(0)
                goblin.pauseFollow()
            } else {
                (goblin.body as Phaser.Physics.Arcade.Body).setAngularVelocity(Phaser.Math.Between(0, GOBLIN_MAX_ANGULAR_VELOCITY))
                goblin.resumeFollow()
            }
        }
    }

    createAndStartOrc() {
        let orcPath = new Phaser.Curves.Path(this.markers.OrcMinecartStartPosition.x, this.markers.OrcMinecartStartPosition.y)
            .lineTo(this.markers.MinecartStartPosition.x, this.markers.MinecartStartPosition.y)
        let minecart = this.add.follower(orcPath, orcPath.startPoint.x, orcPath.startPoint.y, CutsceneTexture.TextureKey, CutsceneTexture.Frames.Minecart)
            .setDepth(this.depth - 1)
        let orc = this.add.follower(orcPath, orcPath.startPoint.x, orcPath.startPoint.y - ORC_MINECART_OFFSET, PlayerTexture.TextureKey)
            .setDepth(this.depth - 1)
        orc.startFollow({
            duration: orcPath.getLength() / ORC_MINECART_SPEED * 1000,
            onStart: () => {
                orc.play(PlayerTexture.Animations.IdleFront)
            }
        })
        minecart.startFollow({
            duration: orcPath.getLength() / ORC_MINECART_SPEED * 1000,
            onUpdate: (tween) => {
                if (tween.progress >= 0.85 && !this.playerMinecartInMotion) {
                    this.playerMinecartInMotion = true
                    this.launchPlayerMinecart()
                }
            },
            onComplete: () => {
                this.time.delayedCall(ORC_RAM_PAUSE, () => {
                    this.setGoblinPause(false)
                    this.endGame()
                })
            }
        })
    }

    createAndStartGoblin() {
        let goblinPathControlX = Phaser.Math.Between(this.markers.CaveExit.x, this.markers.MinecartStartPosition.x)
        let goblinPathControlY = Phaser.Math.Between(this.markers.MinecartStartPosition.y - GOBLIN_MAX_SPLINE_OFFSET_Y, this.markers.CaveExit.y + GOBLIN_MAX_SPLINE_OFFSET_Y)
        let goblinPath = new Phaser.Curves.Path(this.markers.CaveExit.x, this.markers.CaveExit.y)
            .quadraticBezierTo(this.markers.MinecartStartPosition.x, this.markers.MinecartStartPosition.y, goblinPathControlX, goblinPathControlY)
        let goblin = this.add.follower(goblinPath, goblinPath.startPoint.x, goblinPath.startPoint.y, GoblinTexture.TextureKey)
            .setDepth(this.depth)
        this.physics.world.enable(goblin);
        (goblin.body as Phaser.Physics.Arcade.Body).setAngularVelocity(Phaser.Math.Between(0, GOBLIN_MAX_ANGULAR_VELOCITY))
        goblin.startFollow({
            duration: goblinPath.getLength() / GOBLIN_SPEED * 1000,
            onStart: () => {
                goblin.play(GoblinTexture.Animations.WalkRight)
            },
            onPause: () => {
                goblin.play(GoblinTexture.Animations.IdleRight)
            },
            onResume: () => {
                goblin.play(GoblinTexture.Animations.WalkRight)
            },
            onStop: () => {
                goblin.play(GoblinTexture.Animations.IdleFront)
            }
        })
        return goblin
    }

    update(_: number, dt: number) {
        if (this.elapsedDt >= GOBLIN_SPAWN_INTERVAL && this.goblins.length < MAX_GOBLINS && !this.goblinsPaused) {
            this.elapsedDt -= GOBLIN_SPAWN_INTERVAL
            this.goblins.push(this.createAndStartGoblin())
        }
        this.elapsedDt += dt
    }

    endGame() {
        this.time.delayedCall(END_SCENE_DELAY, () => {
            SceneUtil.fadeSceneTransition(this, SceneEnums.Name.OrcMinigame)
        })
    }
}