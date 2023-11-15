import { Physics, Scene } from "phaser"
import { SceneNames } from "../enums/sceneNames"
import { LoadTilemap } from "../util/tilemaps"
import MainCharacter from "../sprites/characters/mainCharacter/sprite"
import { MainCharacterTextures } from "../sprites/characters/mainCharacter/textures"
import { Interactable } from "../extensions"

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
    private others!: Phaser.Physics.Arcade.StaticGroup

    constructor() {
        super(SceneNames.Game)
    }

    preload() {
        this.cursorKeys = this.input.keyboard!.createCursorKeys()
    }

    create() {
        MainCharacter.loadAnimations(this.anims)

        let { collisions, map, playerDepth } = LoadTilemap(this as Scene, "test")

        this.map = map;
        this.collisions = collisions
        this.others = this.physics.add.staticGroup()

        this.others.add(this.add.mainCharacter(100, 150))
        this.others.add(this.add.mainCharacter(160, 150))
        this.others.add(this.add.mainCharacter(160, 200))
        this.others.add(this.add.mainCharacter(100, 200))

        //this.debug.create(this.collisions)

        this.character = this.physics.add.sprite(30, 130, MainCharacterTextures.Key)
        this.character.setDepth(playerDepth)
        this.others.setDepth(playerDepth)

        let camera = this.cameras.main;
        camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
        camera.startFollow(this.character, true, 1, 1);
        camera.setZoom(5)

        this.physics.add.collider(this.character, this.collisions!)
        this.physics.add.collider(this.character, this.others)
    }

    lastInteractViewed: Interactable | null = null;

    update() {
        let closest = this.physics.closest(this.character, this.others.getChildren()) as Phaser.Types.Physics.Arcade.SpriteWithStaticBody & Interactable | null
        if (closest != null) {
            if (this.lastInteractViewed != null) this.lastInteractViewed.setInteractableButton(false)
            if (Phaser.Math.Distance.Between(this.character.x, this.character.y, closest.x, closest.y) < 40) {
                closest.setInteractableButton(true)
                this.lastInteractViewed = closest
            } else {
                this.lastInteractViewed = null
            }
        }
        // if (closest != this.lastInteractViewed && this.lastInteractViewed != null) {
        //     this.lastInteractViewed.setInteractableButton(false)
        // }
        // if (closest != null) {
        //     if (Phaser.Math.Distance.Between(this.character.x, this.character.y, closest.x, closest.y) < 40) {
        //         closest.setInteractableButton(true)
        //         this.lastInteractViewed = closest;
        //     } else {
        //         this.lastInteractViewed = null;
        //     }
        // }

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
                    this.character.anims.play(MainCharacterTextures.IdleFront, true)
                } else {
                    this.character.anims.play(MainCharacterTextures.WalkFront, true)
                }
                break;
            case Direction.BACK:
                if (velX == 0 && velY == 0) {
                    this.character.anims.play(MainCharacterTextures.IdleBack, true)
                } else {
                    this.character.anims.play(MainCharacterTextures.WalkBack, true)
                }
                break;
            case Direction.RIGHT:
                this.character.setFlipX(false);
                if (velX == 0 && velY == 0) {
                    this.character.anims.play(MainCharacterTextures.IdleSide, true)
                } else {
                    this.character.anims.play(MainCharacterTextures.WalkSide, true)
                }
                break;
            case Direction.LEFT:
                this.character.setFlipX(true);
                if (velX == 0 && velY == 0) {
                    this.character.anims.play(MainCharacterTextures.IdleSide, true)
                } else {
                    this.character.anims.play(MainCharacterTextures.WalkSide, true)
                }
                break;
        }
    }
}