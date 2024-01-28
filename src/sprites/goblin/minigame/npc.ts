import { Direction } from "../..";
import { GoblinMinigameState, GoblinMinigameEvents, GoblinMinigameLevelScene } from "../../../scenes/goblin";
import { GoblinTexture } from "../../../textures/goblin";
import { Player } from "../../game";
import { GoblinMinigameLightEmitter, GoblinMinigameLightEmitterType } from "./lightEmitter";

const SWEEPING_PAUSE = 500
const NPC_SPEED = 15
const NPC_ALERTED_SPEED_MULTIPLIER = 1.5
const NORMAL_NPC_BOUNDING_BOX = 40
const NORMAL_NPC_SWEEPING_ANGLE = 15
const NORMAL_NPC_SWEEPING_DURATION = 750
const NORMAL_RAY_CONE_DEG = 45
const ALERTED_NPC_BOUNDING_BOX = 50
const ALERTED_NPC_SWEEPING_ANGLE = 30
const ALERTED_NPC_SWEEPING_DURATION = 450
const ALERTED_RAY_CONE_DEG = 60


/**
 * Represents the types of paths
 */
export enum GoblinMinigamePathType {
    // Where the NPC is still, facing a direction
    STATIC,
    // Where the NPC has a path to follow
    DYNAMIC
}

export type GoblinMinigameStaticPathData = {
    type: GoblinMinigamePathType.STATIC,
    point: Phaser.Math.Vector2,
    direction: Direction
}

export type GoblinMinigameDynamicPathData = {
    type: GoblinMinigamePathType.DYNAMIC,
    points: Phaser.Math.Vector2[]
}

/**
 * Path information for Goblin NPCs, different for both the normal and alerted game states
 */
export type GoblinMinigamePathInformation = {
    normal: GoblinMinigameStaticPathData | GoblinMinigameDynamicPathData,
    alerted: GoblinMinigameStaticPathData | GoblinMinigameDynamicPathData
}

export class GoblinMinigameNPC {
    scene: GoblinMinigameLevelScene
    sprite: Phaser.GameObjects.PathFollower
    speed: number
    lightEmitter: GoblinMinigameLightEmitter
    pathInformation: GoblinMinigamePathInformation
    currentPathType?: GoblinMinigamePathType
    currentPathPoints: Phaser.Math.Vector2[]
    currentPathIndex: number
    /**
     * The box that limits raycasting to a certain distance around the player
     */
    boundingBox: Phaser.GameObjects.Rectangle
    //ray: Raycaster.Ray
    direction: Direction
    stopped: boolean
    /**
     * Tween that sweeps the light from left to right
     */
    sweepTween?: Phaser.Tweens.TweenChain
    state: GoblinMinigameState

    constructor(scene: GoblinMinigameLevelScene, x: number, y: number, pathInformation: GoblinMinigamePathInformation) {
        this.scene = scene
        this.sprite = scene.add.follower(new Phaser.Curves.Path(), x, y, GoblinTexture.TextureKey);
        this.speed = NPC_SPEED
        this.pathInformation = pathInformation
        this.currentPathPoints = []
        this.currentPathIndex = 0

        this.boundingBox = scene.add.rectangle(x, y, 0, 0)
        this.lightEmitter = new GoblinMinigameLightEmitter(this.scene, this.sprite, GoblinMinigameLightEmitterType.CONE, this.boundingBox);

        this.direction = Direction.UP
        this.stopped = false
        this.state = GoblinMinigameState.NORMAL

        scene.physics.world.enableBody(this.sprite, Phaser.Physics.Arcade.DYNAMIC_BODY);
        let body = this.sprite.body as Phaser.Physics.Arcade.Body
        body.pushable = false
        GoblinTexture.configureGoblinPhysicsBody(body);

        this.sprite.play(GoblinTexture.Animations.IdleFront, true);
    }

    makeCollisionsWithPlayer(player: Player) {
        this.scene.physics.add.collider(this.sprite, player.sprite, () => {
            this.scene.parentScene.gameEvents.emit(GoblinMinigameEvents.CAUGHT)
        })
    }

    /**
     * Read the current game state and update NPC accordingly
     */
    updateState(newState: GoblinMinigameState): void {
        this.state = newState
        this.sprite.stopFollow()
        if (this.state === GoblinMinigameState.NORMAL) {
            this.speed = NPC_SPEED
            this.updateRaySettings()
            this.executePathData(this.pathInformation.normal)
        } else {
            this.speed = NPC_SPEED * NPC_ALERTED_SPEED_MULTIPLIER
            this.updateRaySettings()
            this.executePathData(this.pathInformation.alerted)
        }
    }

    /**
     * Update the raycaster based on the state
     */
    updateRaySettings(): void {
        if (this.state === GoblinMinigameState.NORMAL) {
            this.lightEmitter.ray.setConeDeg(NORMAL_RAY_CONE_DEG)
            this.boundingBox.setSize(NORMAL_NPC_BOUNDING_BOX * 2, NORMAL_NPC_BOUNDING_BOX * 2)
        } else {
            this.lightEmitter.ray.setConeDeg(ALERTED_RAY_CONE_DEG)
            this.boundingBox.setSize(ALERTED_NPC_BOUNDING_BOX * 2, ALERTED_NPC_BOUNDING_BOX * 2)
        }
    }

    /**
     * Play the sweep tween after resetting the previous one
     */
    playSweepTween(callback?: () => void, repeat = false) {
        let sweepingAngle = NORMAL_NPC_SWEEPING_ANGLE
        let sweepingDuration = NORMAL_NPC_SWEEPING_DURATION
        if (this.state === GoblinMinigameState.ALERTED) {
            sweepingAngle = ALERTED_NPC_SWEEPING_ANGLE
            sweepingDuration = ALERTED_NPC_SWEEPING_DURATION
        }

        if (this.sweepTween !== undefined) this.sweepTween.stop()
        let currentAngle = Phaser.Math.RadToDeg(this.lightEmitter.ray.angle)
        let sweepConeUpwardTween: Phaser.Types.Tweens.TweenBuilderConfig = {
            targets: { value: currentAngle },
            value: currentAngle - sweepingAngle,
            duration: sweepingDuration,
            onUpdate: (tween) => {
                this.lightEmitter.ray.setAngleDeg(tween.getValue())
            },
            yoyo: true,
        }
        let sweepConeDownwardTween: Phaser.Types.Tweens.TweenBuilderConfig = {
            targets: { value: currentAngle },
            value: currentAngle + sweepingAngle,
            duration: sweepingDuration,
            onUpdate: (tween) => {
                this.lightEmitter.ray.setAngleDeg(tween.getValue())
            },
            yoyo: true,
        }
        this.sweepTween = this.scene.tweens.chain({
            tweens: [sweepConeUpwardTween, sweepConeDownwardTween],
            onComplete: () => {
                if (callback) callback()
            },
            repeat: repeat ? -1 : 0
        })
    }

    /**
     * Use path data and execute it on the NPC appropriately
     * @param pathData The path data to execute
     */
    executePathData(pathData: GoblinMinigameStaticPathData | GoblinMinigameDynamicPathData): void {
        this.currentPathType = pathData.type
        if (pathData.type === GoblinMinigamePathType.DYNAMIC) {
            this.currentPathIndex = 0
            this.currentPathPoints = pathData.points
            // Reset sprite to first path point
            this.sprite.setPosition(pathData.points[0].x, pathData.points[0].y)
            this.startNextPathSegment()
        } else {
            this.currentPathPoints = []
            // Position sprite on the point and play the appropriate idle animation
            this.sprite.setPosition(pathData.point.x, pathData.point.y)
            // Update to correct idle animation
            this.direction = pathData.direction
            this.playIdleAnimation()
        }
    }

    /**
     * Start the next segment of the path
     */
    startNextPathSegment(): void {
        if (this.stopped || this.currentPathType !== GoblinMinigamePathType.DYNAMIC) return
        let nextPathIndex = this.currentPathIndex + 1
        if (nextPathIndex >= this.currentPathPoints.length) {
            nextPathIndex = 0
        }
        // Create a new path, starting at the current position and ending in the next position
        let currentPath = new Phaser.Curves.Path(this.currentPathPoints[this.currentPathIndex].x, this.currentPathPoints[this.currentPathIndex].y)
            .lineTo(this.currentPathPoints[nextPathIndex])
        // Create a line using the starting and ending points of the path
        let currentSegment = new Phaser.Curves.Line(this.currentPathPoints[this.currentPathIndex], this.currentPathPoints[nextPathIndex])
        this.direction = this.getCurrentDirection(currentSegment)

        switch (this.direction) {
            case Direction.UP:
                this.lightEmitter.ray.setAngleDeg(-90)
                break;
            case Direction.LEFT:
                this.lightEmitter.ray.setAngleDeg(-180)
                break;
            case Direction.RIGHT:
                this.lightEmitter.ray.setAngleDeg(0)
                break;
            case Direction.DOWN:
                this.lightEmitter.ray.setAngleDeg(90)
                break;
        }

        // Update the sweep tween if alerted
        if (this.state === GoblinMinigameState.ALERTED) {
            this.playSweepTween(undefined, true)
        }

        this.sprite.setPath(currentPath)
        this.sprite.startFollow({
            // Make duration based on speed
            duration: currentSegment.getLength() / this.speed * 1000,
            onComplete: () => {
                this.currentPathIndex = nextPathIndex
                // If the game's on normal state, have the pause and sweep behavior
                if (this.state === GoblinMinigameState.NORMAL) {
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
        this.playSweepTween(() => {
            this.scene.time.delayedCall(SWEEPING_PAUSE, () => {
                this.startNextPathSegment()
            })
        })
    }

    /**
     * Play the correct idle animation based on direction
     */
    playIdleAnimation() {
        switch (this.direction) {
            case Direction.UP:
                this.sprite.play(GoblinTexture.Animations.IdleBack, true);
                break;
            case Direction.RIGHT:
                this.sprite.play(GoblinTexture.Animations.IdleRight, true);
                break;
            case Direction.LEFT:
                this.sprite.play(GoblinTexture.Animations.IdleLeft, true)
                break;
            case Direction.DOWN:
                this.sprite.play(GoblinTexture.Animations.IdleFront, true)
                break;
        }
    }

    /**
     * Play the correct walking animation based on direction
     */
    playWalkAnimation() {
        switch (this.direction) {
            case Direction.UP:
                this.sprite.play(GoblinTexture.Animations.WalkBack, true);
                break;
            case Direction.RIGHT:
                this.sprite.play(GoblinTexture.Animations.WalkRight, true);
                break;
            case Direction.LEFT:
                this.sprite.play(GoblinTexture.Animations.WalkLeft, true)
                break;
            case Direction.DOWN:
                this.sprite.play(GoblinTexture.Animations.WalkFront, true)
                break;
        }
    }

    /**
     * Raycast and update intersections/light accordingly
     */
    raycastAndUpdate(): void {
        // Make the bounding box move with the sprite
        if (this.currentPathType === GoblinMinigamePathType.DYNAMIC) {
            this.lightEmitter.emitLight()
        }
    }

    /**
     * Stop the NPC
     */
    stop(): void {
        this.stopped = true
        this.sweepTween?.destroy()
        this.sprite.stopFollow()
    }
}