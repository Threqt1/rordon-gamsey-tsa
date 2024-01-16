import { Direction } from "../..";
import { GoblinMinigameState, GoblinMinigameEvents, GoblinMinigameLevelScene } from "../../../scenes/goblin";
import { GoblinTexture } from "../../../textures/goblin";

const BOUNDING_BOX_DIMENSION = 60
const RAY_CONE_DEG = 60
const SWEEPING_DURATION = 750 * 2
const SWEEPING_PAUSE = 500
const SWEEPING_ANGLE = 15
const NPC_SPEED = 20
const LIGHT_COLOR = 0xffffff
const LIGHT_OPACITY = 0.09
const ALERTED_SPIN_DURATION = 5000

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
    pathInformation: GoblinMinigamePathInformation
    currentPathType?: GoblinMinigamePathType
    currentPathPoints: Phaser.Math.Vector2[]
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
    state: GoblinMinigameState

    constructor(scene: GoblinMinigameLevelScene, x: number, y: number, pathInformation: GoblinMinigamePathInformation) {
        this.scene = scene
        this.sprite = scene.add.follower(new Phaser.Curves.Path(), x, y, GoblinTexture.TextureKey);
        this.speed = NPC_SPEED
        this.pathInformation = pathInformation
        this.currentPathPoints = []
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
            duration: ALERTED_SPIN_DURATION,
            onUpdate: (info) => {
                this.ray.setAngleDeg(info.getValue())
            },
            paused: true
        }
        this.alertedTween = scene.tweens.add(alertedTweenInfo)
        this.state = GoblinMinigameState.NORMAL

        scene.physics.world.enableBody(this.sprite, Phaser.Physics.Arcade.DYNAMIC_BODY);
        let body = this.sprite.body as Phaser.Physics.Arcade.Body
        body.pushable = false
        GoblinTexture.configureGoblinPhysicsBody(body)

        this.sprite.play(GoblinTexture.Animations.IdleFront, true);
    }

    /**
     * Read the current game state and update NPC accordingly
     */
    updateState(newState: GoblinMinigameState): void {
        this.state = newState
        this.sprite.stopFollow()
        if (this.state === GoblinMinigameState.NORMAL) {
            this.speed = NPC_SPEED
            this.alertedTween.pause()
            this.executePathData(this.pathInformation.normal)
        } else {
            this.speed = NPC_SPEED * 2
            this.alertedTween.resume()
            this.executePathData(this.pathInformation.alerted)
        }
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

        // Don't modify angles in alerted state because of the tween
        if (this.state === GoblinMinigameState.NORMAL) {
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
        this.boundingBox.setPosition(this.sprite.x, this.sprite.y)

        this.ray.setOrigin(this.sprite.x, this.sprite.y)

        if (this.currentPathType === GoblinMinigamePathType.DYNAMIC) {
            this.ray.castCone()
        }

        for (let slice of this.ray.slicedIntersections) {
            this.scene.parentScene.npcVisibleArea.fillStyle(LIGHT_COLOR, LIGHT_OPACITY).fillTriangleShape(slice)
        }

        if (this.ray.overlap(this.scene.parentScene.currentLevel.player.sprite).length > 0) {
            this.scene.parentScene.gameEvents.emit(GoblinMinigameEvents.CAUGHT)
        }

        // Do an additional cast with the cone rotated 180 degree to
        // get the rotating cones effect if alerted
        if (this.state === GoblinMinigameState.ALERTED) {
            this.ray.setAngleDeg(Phaser.Math.RadToDeg(this.ray.angle) - 180)

            this.ray.castCone()

            if (this.ray.overlap(this.scene.parentScene.currentLevel.player.sprite).length > 0) {
                this.scene.parentScene.gameEvents.emit(GoblinMinigameEvents.CAUGHT)
            }

            for (let slice of this.ray.slicedIntersections) {
                this.scene.parentScene.npcVisibleArea.fillStyle(LIGHT_COLOR, LIGHT_OPACITY).fillTriangleShape(slice)
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