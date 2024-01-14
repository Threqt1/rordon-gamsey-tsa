import { Direction } from "../..";
import { GameState, GoblinMinigameScene } from "../../../scenes/goblin";
import { PlayerTexture } from "../../../textures";

const FOV = 60
const SWEEPING_DURATION = 750 * 2
const SWEEPING_PAUSE = 500
const SWEEPING_ANGLE = 15

export class GoblinNPC {
    scene: GoblinMinigameScene
    sprite: Phaser.GameObjects.PathFollower
    speed: number
    endPause: number
    fullPath: Phaser.Math.Vector2[]
    currentPathPosition: number
    ray: Raycaster.Ray
    litAreaGraphics: Phaser.GameObjects.Graphics
    direction!: Direction
    stopped: boolean
    fov: Phaser.GameObjects.Rectangle
    state: GameState
    alertedTween: Phaser.Tweens.Tween

    constructor(scene: GoblinMinigameScene, points: Phaser.Math.Vector2[], x: number, y: number, litAreaGraphics: Phaser.GameObjects.Graphics, createRaycasterSettings: (arg0: Raycaster) => void) {
        this.scene = scene
        this.sprite = scene.add.follower(new Phaser.Curves.Path(), x, y, PlayerTexture.TextureKey);
        scene.physics.world.enableBody(this.sprite, Phaser.Physics.Arcade.DYNAMIC_BODY);
        (this.sprite.body as Phaser.Physics.Arcade.Body).pushable = false
        this.fullPath = points
        this.speed = 20
        this.endPause = 1000
        this.currentPathPosition = 0
        this.sprite.play(PlayerTexture.Animations.IdleFront, true);
        this.fov = scene.add.rectangle(x, y, FOV * 2, FOV * 2)
        let raycaster = scene.raycaster.createRaycaster()
        createRaycasterSettings(raycaster)
        raycaster.mapGameObjects(this.fov, true)
        this.ray = raycaster.createRay()
        this.ray.setConeDeg(FOV)
        this.ray.autoSlice = true;
        this.ray.enablePhysics();
        this.ray.setCollisionRange(1000);
        this.litAreaGraphics = litAreaGraphics
        this.stopped = false
        this.state = GameState.NORMAL
        let alertedTweenInfo: Phaser.Types.Tweens.TweenBuilderConfig = {
            targets: { value: 0 },
            value: 360,
            repeat: -1,
            duration: 5000,
            onUpdate: (info) => {
                this.ray.setAngleDeg(info.getValue())
            },
            paused: true
        }
        this.alertedTween = scene.tweens.add(alertedTweenInfo)
    }

    start() {
        this.startNextSegment()
    }

    stop() {
        this.stopped = true
        this.alertedTween.destroy()
        this.sprite.stopFollow()
    }

    startNextSegment() {
        if (this.stopped) return
        let nextPathPosition = this.currentPathPosition + 1 >= this.fullPath.length ? 0 : this.currentPathPosition + 1
        let currentSegment = new Phaser.Curves.Line(this.fullPath[this.currentPathPosition], this.fullPath[nextPathPosition])
        let currentPath = new Phaser.Curves.Path(this.fullPath[this.currentPathPosition].x, this.fullPath[this.currentPathPosition].y).lineTo(this.fullPath[nextPathPosition])
        this.direction = this.getCurrentDirection(currentSegment)

        if (this.state === GameState.NORMAL) {
            switch (this.direction) {
                case Direction.UP:
                    this.ray.setAngleDeg(-90)
                    break;
                case Direction.LEFT:
                    this.ray.setAngleDeg(-180)
                    break;
                case Direction.RIGHT:
                    this.ray.setAngleDeg(0)
                    break;
                case Direction.DOWN:
                    this.ray.setAngleDeg(90)
                    break;
            }
        }

        this.sprite.setPath(currentPath)
        this.sprite.startFollow({
            duration: currentSegment.getLength() / this.speed * 1000,
            onComplete: () => {
                this.currentPathPosition = nextPathPosition
                if (this.state === GameState.NORMAL) {
                    this.midSegmentPause()
                } else {
                    this.startNextSegment()
                }
            }
        })

        this.playWalkAnimation(this.direction)
    }

    setState(state: GameState) {
        this.state = state
        if (this.state === GameState.NORMAL) {
            this.speed /= 2;
            this.alertedTween.pause()
        } else {
            this.speed *= 2
            this.alertedTween.resume()
        }
    }

    midSegmentPause() {
        this.playIdleAnimation(this.direction)
        let currentAngle = Phaser.Math.RadToDeg(this.ray.angle)
        let upwardTween: Phaser.Types.Tweens.TweenBuilderConfig = {
            targets: { value: currentAngle },
            value: currentAngle - SWEEPING_ANGLE,
            duration: SWEEPING_DURATION / 2,
            onUpdate: (tween) => {
                this.ray.setAngleDeg(tween.getValue())
            },
            yoyo: true
        }
        let downwardTween: Phaser.Types.Tweens.TweenBuilderConfig = {
            targets: { value: currentAngle },
            value: currentAngle + SWEEPING_ANGLE,
            duration: SWEEPING_DURATION / 2,
            onUpdate: (tween) => {
                this.ray.setAngleDeg(tween.getValue())
            },
            yoyo: true
        }
        this.scene.tweens.chain({
            tweens: [upwardTween, downwardTween],
            onComplete: () => {
                this.scene.time.delayedCall(SWEEPING_PAUSE, () => {
                    this.startNextSegment()
                })
            }
        })
    }

    playIdleAnimation(direction: Direction) {
        switch (direction) {
            case Direction.UP:
                this.sprite.play(PlayerTexture.Animations.IdleBack, true);
                break;
            case Direction.RIGHT:
                this.sprite.setFlipX(false)
                this.sprite.play(PlayerTexture.Animations.IdleSide, true);
                break;
            case Direction.LEFT:
                this.sprite.setFlipX(true)
                this.sprite.play(PlayerTexture.Animations.IdleSide, true)
                break;
            case Direction.DOWN:
                this.sprite.play(PlayerTexture.Animations.IdleFront, true)
                break;
        }
    }

    playWalkAnimation(direction: Direction) {
        switch (direction) {
            case Direction.UP:
                this.sprite.play(PlayerTexture.Animations.WalkBack, true);
                break;
            case Direction.RIGHT:
                this.sprite.setFlipX(false)
                this.sprite.play(PlayerTexture.Animations.WalkSide, true);
                break;
            case Direction.LEFT:
                this.sprite.setFlipX(true)
                this.sprite.play(PlayerTexture.Animations.WalkSide, true)
                break;
            case Direction.DOWN:
                this.sprite.play(PlayerTexture.Animations.WalkFront, true)
                break;
        }
    }

    getCurrentDirection(line: Phaser.Curves.Line) {
        if (line.p0.x === line.p1.x) {
            if (line.p0.y > line.p1.y) {
                return Direction.UP
            } else {
                return Direction.DOWN
            }
        } else {
            if (line.p0.x > line.p1.x) {
                return Direction.LEFT
            } else {
                return Direction.RIGHT
            }
        }
    }

    drawLight(): void {
        this.fov.setPosition(this.sprite.x, this.sprite.y)

        let xOffset, yOffset;
        if (this.direction === Direction.LEFT) {
            xOffset = -1
        } else if (this.direction === Direction.RIGHT) {
            xOffset = 1
        } else {
            xOffset = 0
        }

        if (this.direction === Direction.UP) {
            yOffset = -1
        } else if (this.direction === Direction.DOWN) {
            yOffset = 1
        } else {
            yOffset = 0
        }

        this.ray.setOrigin(this.sprite.x + (this.sprite.displayWidth / 2 * xOffset), this.sprite.y + (this.sprite.displayHeight / 2 * yOffset))

        if (this.state === GameState.NORMAL) {
            this.ray.castCone()

            for (let slice of this.ray.slicedIntersections) {
                this.litAreaGraphics.fillStyle(0xffffff, 0.3).fillTriangleShape(slice)
            }

            if (this.ray.overlap(this.scene.player.sprite).length > 0) {
                this.scene.gameEvents.emit("found")
            }
        } else {
            this.ray.castCone()

            if (this.ray.overlap(this.scene.player.sprite).length > 0) {
                this.scene.gameEvents.emit("found")
            }

            for (let slice of this.ray.slicedIntersections) {
                this.litAreaGraphics.fillStyle(0xffffff, 0.3).fillTriangleShape(slice)
            }

            this.ray.setAngleDeg(Phaser.Math.RadToDeg(this.ray.angle) - 180)

            this.ray.castCone()

            if (this.ray.overlap(this.scene.player.sprite).length > 0) {
                this.scene.gameEvents.emit("found")
            }

            for (let slice of this.ray.slicedIntersections) {
                this.litAreaGraphics.fillStyle(0xffffff, 0.3).fillTriangleShape(slice)
            }

            this.ray.setAngleDeg(Phaser.Math.RadToDeg(this.ray.angle) + 180)
        }

    }
}