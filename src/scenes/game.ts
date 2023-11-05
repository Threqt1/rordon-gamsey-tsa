import { Scene } from "phaser"
import { SceneNames } from "../enums/sceneNames"
import { LoadTilemap } from "../util/tilemaps"

enum Direction {
    FRONT,
    BACK,
    RIGHT,
    LEFT
}

export default class GameScene extends Scene {
    private cursorKeys!: Phaser.Types.Input.Keyboard.CursorKeys
    private character!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
    private direction: Direction = Direction.FRONT
    private map!: Phaser.Tilemaps.Tilemap
    private collisions!: Phaser.Tilemaps.TilemapLayer

    constructor() {
        super(SceneNames.Game)
    }

    preload() {
        this.cursorKeys = this.input.keyboard!.createCursorKeys()
    }

    create() {
        let { collisions, map, playerDepth } = LoadTilemap(this as Scene, "test")

        this.map = map;
        this.collisions = collisions

        // this.debug.create(this.collisions)

        this.character = this.physics.add.sprite(30, 130, "character")
        this.character.setDepth(playerDepth)

        let camera = this.cameras.main;
        camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
        camera.startFollow(this.character, true, 1, 1);
        camera.setZoom(5)

        this.physics.add.collider(this.character, this.collisions!)

        this.anims.create({
            key: "character_idle_front",
            frames: this.anims.generateFrameNames("character", { start: 0, end: 5, prefix: "player_", suffix: ".png" }),
            repeat: -1,
            frameRate: 5
        })

        this.anims.create({
            key: "character_idle_side",
            frames: this.anims.generateFrameNames("character", { start: 6, end: 11, prefix: "player_", suffix: ".png" }),
            repeat: -1,
            frameRate: 5
        })

        this.anims.create({
            key: "character_idle_back",
            frames: this.anims.generateFrameNames("character", { start: 12, end: 17, prefix: "player_", suffix: ".png" }),
            repeat: -1,
            frameRate: 5
        })

        this.anims.create({
            key: "character_walk_front",
            frames: this.anims.generateFrameNames("character", { start: 18, end: 23, prefix: "player_", suffix: ".png" }),
            repeat: -1,
            frameRate: 10
        })

        this.anims.create({
            key: "character_walk_side",
            frames: this.anims.generateFrameNames("character", { start: 24, end: 29, prefix: "player_", suffix: ".png" }),
            repeat: -1,
            frameRate: 10
        })

        this.anims.create({
            key: "character_walk_back",
            frames: this.anims.generateFrameNames("character", { start: 30, end: 35, prefix: "player_", suffix: ".png" }),
            repeat: -1,
            frameRate: 10
        })
    }

    update() {
        if (!this.character || !this.cursorKeys) return

        const speed = 50;
        let velX = 0;
        let velY = 0;

        if (this.cursorKeys.down.isDown) {

            velY = speed;
            this.direction = Direction.FRONT
        } else if (this.cursorKeys.up.isDown) {
            velY = -speed
            this.direction = Direction.BACK
        }

        if (this.cursorKeys.right.isDown) {
            velX = speed
            this.direction = Direction.RIGHT
        } else if (this.cursorKeys.left.isDown) {
            velX = -speed
            this.direction = Direction.LEFT
        }

        this.character.setVelocity(velX, velY);

        switch (this.direction) {
            case Direction.FRONT:
                if (velX == 0 && velY == 0) {
                    this.character.anims.play("character_idle_front", true)
                } else {
                    this.character.anims.play("character_walk_front", true)
                }
                break;
            case Direction.BACK:
                if (velX == 0 && velY == 0) {
                    this.character.anims.play("character_idle_back", true)
                } else {
                    this.character.anims.play("character_walk_back", true)
                }
                break;
            case Direction.RIGHT:
                this.character.setFlipX(false);
                if (velX == 0 && velY == 0) {
                    this.character.anims.play("character_idle_side", true)
                } else {
                    this.character.anims.play("character_walk_side", true)
                }
                break;
            case Direction.LEFT:
                this.character.setFlipX(true);
                if (velX == 0 && velY == 0) {
                    this.character.anims.play("character_idle_side", true)
                } else {
                    this.character.anims.play("character_walk_side", true)
                }
                break;
        }
    }
}