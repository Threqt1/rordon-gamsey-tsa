import { FinalScene } from "../../scenes/final";
import { FoodTexture } from "../../textures";

const WALK_TO_TABLE_DURATION = 5000
const FOOD_TO_TABLE_DURATION = 1000
const FOOD_SCALE = 0.8

export type FinalNPCTexture = {
    key: string,
    food: string,
    idleFrontAnimation: (sprite: Phaser.GameObjects.PathFollower) => void,
    moveRightAnimation: (sprite: Phaser.GameObjects.PathFollower) => void,
    idleRightAnimation: (sprite: Phaser.GameObjects.PathFollower) => void,
    moveLeftAnimation: (sprite: Phaser.GameObjects.PathFollower) => void,
}

export enum FinalNPCEvents {
    NPC_REACHED_TABLE = "npcReachedTable",
    FOOD_REACHED_TABLE = "foodReachedTable",
    NPC_REACHED_START = "npcReachedStart"
}

export class FinalNPC {
    scene: FinalScene
    sprites: Phaser.GameObjects.GameObject[]
    sprite: Phaser.GameObjects.PathFollower
    food: Phaser.GameObjects.PathFollower
    texture: FinalNPCTexture
    spriteEvents: Phaser.Events.EventEmitter

    constructor(scene: FinalScene, x: number, y: number, texture: FinalNPCTexture, depth: number) {
        this.scene = scene
        this.sprite = scene.add.follower(new Phaser.Curves.Path(), x, y, texture.key).setDepth(depth)
        this.food = scene.add.follower(new Phaser.Curves.Path(), this.sprite.x, this.sprite.y - this.sprite.height, FoodTexture.TextureKey, texture.food)
            .setScale(FOOD_SCALE)
            .setDepth(depth)
        this.food.setY(this.food.y - this.food.displayHeight / 4)

        this.sprites = [this.sprite, this.food]
        this.texture = texture
        this.spriteEvents = new Phaser.Events.EventEmitter()

        this.texture.idleFrontAnimation(this.sprite)
    }

    moveSpriteToTable() {
        let startPosition = this.scene.markers.SpawnLocation
        let endPosition = this.scene.markers.EndLocation

        this.sprite.setPosition(startPosition.x, this.sprite.y)
        let path = new Phaser.Curves.Path(startPosition.x, this.sprite.y)
            .lineTo(endPosition.x, this.sprite.y)
        this.sprite.setPath(path)

        this.sprite.startFollow({
            // length of path / speed
            duration: WALK_TO_TABLE_DURATION,
            onComplete: () => {
                this.texture.idleRightAnimation(this.sprite)
                this.spriteEvents.emit(FinalNPCEvents.NPC_REACHED_TABLE)
            },
            onUpdate: () => {
                this.food?.setX(this.sprite.x)
            }
        })

        this.texture.moveRightAnimation(this.sprite)
    }

    moveFoodToTable() {
        let startPosition = this.scene.markers.EndLocation
        let endPosition = this.scene.markers.FoodLocation

        this.food.setPosition(startPosition.x, this.food.y)
        let path = new Phaser.Curves.Path(startPosition.x, this.food.y)
            .quadraticBezierTo(endPosition.x, endPosition.y - this.food.displayHeight / 2, startPosition.x, endPosition.y - this.food.displayHeight / 2)
        this.food.setPath(path)

        this.food.startFollow({
            duration: FOOD_TO_TABLE_DURATION,
            onComplete: () => {
                this.spriteEvents.emit(FinalNPCEvents.FOOD_REACHED_TABLE)
            }
        })
    }

    moveSpriteToStart(xOffset: number) {
        let startPosition = this.scene.markers.EndLocation
        let endPosition = this.scene.markers.SpawnLocation

        this.sprite.setPosition(startPosition.x, this.sprite.y)
        let path = new Phaser.Curves.Path(startPosition.x, this.sprite.y)
            .lineTo(endPosition.x + xOffset, this.sprite.y)
        this.sprite.setPath(path)

        this.sprite.startFollow({
            // length of path / speed
            duration: WALK_TO_TABLE_DURATION,
            onComplete: () => {
                this.texture.idleFrontAnimation(this.sprite)
                this.spriteEvents.emit(FinalNPCEvents.NPC_REACHED_START)
            }
        })

        this.texture.moveLeftAnimation(this.sprite)
    }
}