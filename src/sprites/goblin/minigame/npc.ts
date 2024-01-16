import { Direction } from "../..";
import { GoblinMinigameState, GoblinMinigameScene, GoblinMinigameEvents } from "../../../scenes/goblin";
import { PlayerTexture } from "../../../textures";

const BOUNDING_BOX_DIMENSION = 60
const RAY_CONE_DEG = 60
const SWEEPING_DURATION = 750 * 2
const SWEEPING_PAUSE = 500
const SWEEPING_ANGLE = 15
const NPC_SPEED = 20
const LIGHT_COLOR = 0xffffff
const LIGHT_OPACITY = 0.3

export class GoblinMinigameNPC {
    scene: GoblinMinigameScene
    sprite: Phaser.GameObjects.PathFollower
    speed: number
    pathPoints: Phaser.Math.Vector2[]
    currentPathIndex: number
    /**
     * The box that limits raycasting to a certain distance around the player
     */
    boundingBox: Phaser.GameObjects.Rectangle
    ray: Raycaster.Ray
    direction: Direction
    stopped: boolean
    /**
     * Tween that animates cones when the game state is
     * alerted
     */
    alertedTween: Phaser.Tweens.Tween

    constructor(scene: GoblinMinigameScene, pathPoints: Phaser.Math.Vector2[], x: number, y: number) {
        this.scene = scene
        this.sprite = scene.add.follower(new Phaser.Curves.Path(), x, y, PlayerTexture.TextureKey);
        this.speed = NPC_SPEED
        this.pathPoints = pathPoints
        this.currentPathIndex = 0

        this.boundingBox = scene.add.rectangle(x, y, BOUNDING_BOX_DIMENSION * 2, BOUNDING_BOX_DIMENSION * 2)
        let raycaster = scene.raycaster.createRaycaster()
        scene.createRaycasterSettings(raycaster)
        raycaster.mapGameObjects(this.boundingBox, true)
        this.ray = raycaster.createRay()
        this.ray.setConeDeg(RAY_CONE_DEG)
        this.ray.autoSlice = true;
        this.ray.enablePhysics();
        this.ray.setCollisionRange(1000);

        this.direction = Direction.UP
        this.stopped = false
        // Tweens the angle of the ray from 0 to 360, looping as well
        // Starts off paused
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

        scene.physics.world.enableBody(this.sprite, Phaser.Physics.Arcade.DYNAMIC_BODY);
        (this.sprite.body as Phaser.Physics.Arcade.Body).pushable = false

        this.sprite.play(PlayerTexture.Animations.IdleFront, true);
    }

    /**
     * Starts the NPC
     */
    start(): void {
        this.startNextPathSegment()
    }

    /**
     * Start the next segment of the path
     */
    startNextPathSegment(): void {
        if (this.stopped) return
        let nextPathIndex = this.currentPathIndex + 1
        if (nextPathIndex >= this.pathPoints.length) {
            nextPathIndex = 0
        }
        // Create a new path, starting at the current position and ending in the next position
        let currentPath = new Phaser.Curves.Path(this.pathPoints[this.currentPathIndex].x, this.pathPoints[this.currentPathIndex].y)
            .lineTo(this.pathPoints[nextPathIndex])
        // Create a line using the starting and ending points of the path
        let currentSegment = new Phaser.Curves.Line(this.pathPoints[this.currentPathIndex], this.pathPoints[nextPathIndex])
        this.direction = this.getCurrentDirection(currentSegment)

        // Don't modify angles in alerted state because of the tween
        if (this.scene.state === GoblinMinigameState.NORMAL) {
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
            // Make duration based on speed
            duration: currentSegment.getLength() / this.speed * 1000,
            onComplete: () => {
                this.currentPathIndex = nextPathIndex
                // If the game's on normal state, have the pause and sweep behavior
                if (this.scene.state === GoblinMinigameState.NORMAL) {
                    this.pauseAndSweep()
                } else {
                    this.startNextPathSegment()
                }
            }
        })

        this.playWalkAnimation()
    }

    /**
     * Get the direction a line is facing
     * @param line The line in question
     * @returns The direction
     */
    getCurrentDirection(line: Phaser.Curves.Line): Direction {
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

    /**
     * Pause the NPC, sweeping the cone before resuming
     */
    pauseAndSweep(): void {
        this.playIdleAnimation()
        let currentAngle = Phaser.Math.RadToDeg(this.ray.angle)
        let sweepConeUpwardTween: Phaser.Types.Tweens.TweenBuilderConfig = {
            targets: { value: currentAngle },
            value: currentAngle - SWEEPING_ANGLE,
            duration: SWEEPING_DURATION / 2,
            onUpdate: (tween) => {
                this.ray.setAngleDeg(tween.getValue())
            },
            yoyo: true
        }
        let sweepConeDownwardTween: Phaser.Types.Tweens.TweenBuilderConfig = {
            targets: { value: currentAngle },
            value: currentAngle + SWEEPING_ANGLE,
            duration: SWEEPING_DURATION / 2,
            onUpdate: (tween) => {
                this.ray.setAngleDeg(tween.getValue())
            },
            yoyo: true
        }
        this.scene.tweens.chain({
            tweens: [sweepConeUpwardTween, sweepConeDownwardTween],
            onComplete: () => {
                this.scene.time.delayedCall(SWEEPING_PAUSE, () => {
                    this.startNextPathSegment()
                })
            }
        })
    }

    /**
     * Read the current game state and update NPC accordingly
     */
    updateState() {
        if (this.scene.state === GoblinMinigameState.NORMAL) {
            this.speed = NPC_SPEED
            this.alertedTween.pause()
        } else {
            this.speed = NPC_SPEED * 2
            this.alertedTween.resume()
        }
    }

    /**
     * Play the correct idle animation based on direction
     */
    playIdleAnimation() {
        switch (this.direction) {
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

    /**
     * Play the correct walking animation based on direction
     */
    playWalkAnimation() {
        switch (this.direction) {
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

    /**
     * Raycast and update intersections/light accordingly
     */
    raycastAndUpdate(): void {
        // Make the bounding box move with the sprite
        this.boundingBox.setPosition(this.sprite.x, this.sprite.y)

        // Calculate x and y offsets to place the light in front
        // of the npc sprite not inside of it
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

        let xOrigin = this.sprite.x + (this.sprite.displayWidth / 2 * xOffset)
        let yOrigin = this.sprite.y + (this.sprite.displayHeight / 2 * yOffset)
        this.ray.setOrigin(xOrigin, yOrigin)

        this.ray.castCone()

        for (let slice of this.ray.slicedIntersections) {
            this.scene.npcVisibleArea.fillStyle(LIGHT_COLOR, LIGHT_OPACITY).fillTriangleShape(slice)
        }

        if (this.ray.overlap(this.scene.player.sprite).length > 0) {
            this.scene.gameEvents.emit(GoblinMinigameEvents.CAUGHT)
        }

        // Do an additional cast with the cone rotated 180 degree to
        // get the rotating cones effect if alerted
        if (this.scene.state === GoblinMinigameState.ALERTED) {
            this.ray.setAngleDeg(Phaser.Math.RadToDeg(this.ray.angle) - 180)

            this.ray.castCone()

            if (this.ray.overlap(this.scene.player.sprite).length > 0) {
                this.scene.gameEvents.emit(GoblinMinigameEvents.CAUGHT)
            }

            for (let slice of this.ray.slicedIntersections) {
                this.scene.npcVisibleArea.fillStyle(LIGHT_COLOR, LIGHT_OPACITY).fillTriangleShape(slice)
            }

            this.ray.setAngleDeg(Phaser.Math.RadToDeg(this.ray.angle) + 180)
        }

    }

    /**
     * Stop the NPC
     */
    stop(): void {
        this.stopped = true
        this.alertedTween.destroy()
        this.sprite.stopFollow()
    }
}