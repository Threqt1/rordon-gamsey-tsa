import { Scene } from "phaser"
import { SceneNames } from "../enums/sceneNames"
import { LoadTilemap } from "../util/tilemaps"
import Player from "../sprites/player/sprite"
import TestNPC from "../sprites/testNPC/sprite"
import { Interactable } from "../extensions"

export default class GameScene extends Scene {
    private player!: Player
    private map!: Phaser.Tilemaps.Tilemap
    private collisions!: Phaser.Tilemaps.TilemapLayer
    private interactables!: Interactable[]
    private npcSprites!: Phaser.Physics.Arcade.StaticGroup
    private interactionZones!: Phaser.Physics.Arcade.Group

    constructor() {
        super(SceneNames.Game)
    }

    create() {
        let { collisions, map, playerDepth } = LoadTilemap(this as Scene, "test")

        this.map = map;
        this.collisions = collisions
        this.npcSprites = this.physics.add.staticGroup()
        this.interactionZones = this.physics.add.group()
        this.interactables = []

        let npc = new TestNPC(this, 100, 150)
        this.interactables.push(npc)
        this.npcSprites.add(npc)
        this.interactionZones.add(npc.getInteractableZone())

        // this.others.add(MainCharacter.register(this, 100, 150))
        // this.others.add(MainCharacter.register(this, 160, 150))
        // this.others.add(MainCharacter.register(this, 160, 200))
        // this.others.add(MainCharacter.register(this, 100, 200))

        //this.debug.create(this.collisions)

        this.player = new Player(this, 30, 130)
        this.player.setDepth(playerDepth)
        this.npcSprites.setDepth(playerDepth)

        let camera = this.cameras.main;
        camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
        camera.startFollow(this.player, true, 1, 1);
        camera.setZoom(5)

        this.physics.add.collider(this.player, this.collisions!)
        this.physics.add.collider(this.player, this.npcSprites!)
        this.physics.add.overlap(this.player, this.interactionZones!)
    }

    // lastInteractViewed: Interactable | null = null;

    update() {
        this.player.control(this.input)
        for (let interactable of this.interactables) {
            interactable.interact(this.input)
        }
        // let closest = this.physics.closest(this.character, this.others.getChildren()) as Phaser.Types.Physics.Arcade.SpriteWithStaticBody & Interactable | null
        // if (closest != null) {
        //     if (this.lastInteractViewed != null) this.lastInteractViewed.setInteractableButton(false)
        //     if (Phaser.Math.Distance.Between(this.character.x, this.character.y, closest.x, closest.y) < 40) {
        //         closest.setInteractableButton(true)
        //         this.lastInteractViewed = closest
        //     } else {
        //         this.lastInteractViewed = null
        //     }
        // }

        // if (!this.character || !this.cursorKeys) return

        // const speed = 50;
        // let velX = 0;
        // let velY = 0;

        // if (this.cursorKeys.down.isDown) {

        //     velY = speed;
        //     this.direction = Direction.FRONT
        // } else if (this.cursorKeys.up.isDown) {
        //     velY = -speed
        //     this.direction = Direction.BACK
        // }

        // if (this.cursorKeys.right.isDown) {
        //     velX = speed
        //     this.direction = Direction.RIGHT
        // } else if (this.cursorKeys.left.isDown) {
        //     velX = -speed
        //     this.direction = Direction.LEFT
        // }
    }
}