import { FinalScene } from "../scenes";
import { FoodTexture } from "../../shared/textures";

const OFFSET = 50
const SPEED = 50
const FOOD_MOVE_DURATION = 1000
const FOOD_SCALE = 0.8

export type Texture = {
    key: string,
    food: string,
    moveRightAnimation: (sprite: Phaser.GameObjects.PathFollower) => void,
    idleRightAnimation: (sprite: Phaser.GameObjects.PathFollower) => void,
}

export enum Events {
    NPC_REACHED_TABLE = "npcReachedTable",
    FOOD_REACHED_TABLE = "foodReachedTable",
    NPC_REACHED_START = "npcReachedStart"
}

export class Sprite {
    scene: FinalScene.Scene
    sprites: Phaser.GameObjects.GameObject[]
    sprite: Phaser.GameObjects.PathFollower
    food: Phaser.GameObjects.PathFollower
    texture: Texture
    spriteEvents: Phaser.Events.EventEmitter

    constructor(scene: FinalScene.Scene, x: number, y: number, texture: Texture, depth: number) {
        this.scene = scene
        this.sprite = scene.add.follower(new Phaser.Curves.Path(), x, y, texture.key).setDepth(depth)
        this.food = scene.add.follower(new Phaser.Curves.Path(), this.sprite.x, this.sprite.y - this.sprite.height, FoodTexture.TextureKey, texture.food)
            .setScale(FOOD_SCALE)
            .setDepth(depth)
        this.food.setY(this.food.y - this.food.displayHeight / 4)

        this.sprites = [this.sprite, this.food]
        this.texture = texture
        this.spriteEvents = new Phaser.Events.EventEmitter()
    }

    moveSpriteToTable() {
        let startPosition = this.scene.markers.SpawnLocation
        let endPosition = this.scene.markers.EndLocation

        this.sprite.setPosition(startPosition.x, this.sprite.y)
        let path = new Phaser.Curves.Path(startPosition.x, this.sprite.y)
            .lineTo(endPosition.x - OFFSET * this.scene.currentOrderIndex, this.sprite.y)
        this.sprite.setPath(path)

        this.sprite.startFollow({
            // length of path / speed
            duration: path.getLength() / SPEED * 1000,
            onComplete: () => {
                this.texture.idleRightAnimation(this.sprite)
                this.spriteEvents.emit(Events.NPC_REACHED_TABLE)
            },
            onUpdate: () => {
                this.food?.setX(this.sprite.x)
            }
        })

        this.texture.moveRightAnimation(this.sprite)
    }

    moveFoodToTable() {
        let endPosition = this.scene.markers.FoodLocation

        let path = new Phaser.Curves.Path(this.food.x, this.food.y)
            .quadraticBezierTo(endPosition.x, endPosition.y - this.food.displayHeight / 2, this.food.x, endPosition.y - this.food.displayHeight / 2)
        this.food.setPath(path)

        this.food.startFollow({
            duration: FOOD_MOVE_DURATION,
            onComplete: () => {
                this.spriteEvents.emit(Events.FOOD_REACHED_TABLE)
            }
        })
    }

    // moveSpriteToStart(xOffset: number) {
    //     let startPosition = this.scene.markers.EndLocation
    //     let endPosition = this.scene.markers.SpawnLocation

    //     this.sprite.setPosition(startPosition.x, this.sprite.y)
    //     let path = new Phaser.Curves.Path(startPosition.x, this.sprite.y)
    //         .lineTo(endPosition.x + xOffset, this.sprite.y)
    //     this.sprite.setPath(path)

    //     this.sprite.startFollow({
    //         // length of path / speed
    //         duration: WALK_TO_TABLE_DURATION,
    //         onComplete: () => {
    //             this.texture.idleFrontAnimation(this.sprite)
    //             this.spriteEvents.emit(Events.NPC_REACHED_START)
    //         }
    //     })

    //     this.texture.moveLeftAnimation(this.sprite)
    // }
}