import { Direction } from "..";
import { PlayerTexture } from "../../textures";

export class GoblinNPC {
    scene: Phaser.Scene
    sprite: Phaser.GameObjects.PathFollower
    speed: number
    endPause: number
    fullPath: Phaser.Math.Vector2[]
    currentPathPosition: number

    constructor(scene: Phaser.Scene, points: Phaser.Math.Vector2[], x: number, y: number) {
        this.scene = scene
        this.sprite = scene.add.follower(new Phaser.Curves.Path(), x, y, PlayerTexture.TextureKey);
        scene.physics.world.enableBody(this.sprite, Phaser.Physics.Arcade.DYNAMIC_BODY);
        (this.sprite.body as Phaser.Physics.Arcade.Body).pushable = false

        this.fullPath = points
        this.speed = 20
        this.endPause = 1000
        this.currentPathPosition = 0

        this.sprite.play(PlayerTexture.Animations.IdleFront, true);
    }

    start() {
        this.startNextSegment()
    }

    startNextSegment() {
        let nextPathPosition = this.currentPathPosition + 1 >= this.fullPath.length ? 0 : this.currentPathPosition + 1
        let currentSegment = new Phaser.Curves.Line(this.fullPath[this.currentPathPosition], this.fullPath[nextPathPosition])
        let currentPath = new Phaser.Curves.Path(this.fullPath[this.currentPathPosition].x, this.fullPath[this.currentPathPosition].y).lineTo(this.fullPath[nextPathPosition])
        let direction = this.getCurrentDirection(currentSegment)

        this.sprite.setPath(currentPath)
        this.sprite.startFollow({
            duration: currentSegment.getLength() / this.speed * 1000,
            onComplete: () => {
                this.currentPathPosition = nextPathPosition
                this.playIdleAnimation(direction)
                this.scene.time.delayedCall(this.endPause, () => {
                    this.startNextSegment()
                })
            }
        })

        this.playWalkAnimation(direction)
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
}