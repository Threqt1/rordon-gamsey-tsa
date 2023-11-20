import { SceneName } from "../enums/sceneNames";
import { BaseSprite } from "../sprites/base";
import { MinigameApple } from "../sprites/minigame/items/item1";
import MinigameNPC from "../sprites/minigame/npc";
import MinigamePlayer from "../sprites/minigame/player";
import { switchSceneFadeIn } from "../util/fades";
import { LoadTilemap } from "../util/tilemaps";

let dummy = {
    value: 0
}

export default class MinigameScene extends Phaser.Scene {
    private _item!: MinigameApple
    private _sprites: BaseSprite[] = []
    private _tweens: Phaser.Tweens.Tween[] = []
    private _colorMatrices: Phaser.FX.ColorMatrix[] = []
    private te: boolean = true;

    constructor() {
        super(SceneName.Minigame)
    }

    create(data: { fade: boolean }) {
        let { map, playerDepth } = LoadTilemap(this, "test2")

        for (let layer of map.layers) {
            if (layer.tilemapLayer != null) this._colorMatrices.push(layer.tilemapLayer.postFX?.addColorMatrix())
        }

        let camera = this.cameras.main;
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
        camera.setZoom(this.scale.width / map.widthInPixels)

        let player = new MinigamePlayer(this, 450, 70).setDepth(playerDepth)
        this._sprites.push(player)
        this._colorMatrices.push(player.postFX?.addColorMatrix())

        let npc = new MinigameNPC(this, 30, 70).setDepth(playerDepth)
        this._sprites.push(npc)
        this._colorMatrices.push(npc.postFX?.addColorMatrix())

        this._item = new MinigameApple(this, npc.x + npc.displayWidth + 5, 70).setDepth(playerDepth)
        this._sprites.push(this._item);
        this._colorMatrices.push(this._item.postFX?.addColorMatrix())

        let tween = this.tweens.add({
            targets: this._item,
            x: 450 - npc.displayWidth - 5,
            duration: 5000,
            yoyo: true,
            loop: -1
        })
        let tween2 = this.tweens.add({
            targets: this._item,
            rotation: 360,
            loop: -1,
            duration: 30000
        })
        this._tweens.push(tween)
        this._tweens.push(tween2)

        this.input.on('pointerdown', () => {

            if (this.te) {
                this.tweens.addMultiple(
                    [
                        {
                            targets: this._tweens,
                            timeScale: 0.4,
                            duration: 1000
                        },
                        {
                            targets: this.anims,
                            globalTimeScale: 0.4,
                            duration: 1000
                        },
                        {
                            targets: dummy,
                            value: 0.6,
                            onUpdate: (_, __, ___, curr, ____) => {
                                for (let colorMatrix of this._colorMatrices) {
                                    colorMatrix.grayscale(curr)
                                }
                            },
                            duration: 1000
                        }
                    ]
                )
            } else {
                this.tweens.addMultiple(
                    [{
                        targets: this._tweens,
                        timeScale: 1,
                        duration: 1000
                    },
                    {
                        targets: this.anims,
                        globalTimeScale: 1,
                        duration: 1000
                    },
                    {
                        targets: dummy,
                        value: 0,
                        onUpdate: (_, __, ___, curr, ____) => {
                            for (let colorMatrix of this._colorMatrices) {
                                colorMatrix.grayscale(curr)
                            }
                        },
                        duration: 1000
                    }]
                )
            }
            this.te = !this.te

        });

        if (data !== undefined) {
            if (data.fade) switchSceneFadeIn(this)
        }
        // this.time.timeScale = 0.5;
        // this.physics.world.timeScale = 2;
        // this.tweens.timeScale = 0.5;
    }
}