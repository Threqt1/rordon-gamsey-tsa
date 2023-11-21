/**
 * PRIORITY:
 * OBJECT POOLING, REXAMINE TWEENS IF POSSIBLE
 * FIX THE BAD DESIGN
 */

import { SceneName } from "../enums/sceneNames";
import { MinigameApple } from "../sprites/minigame/items/item1";
import MinigameNPC from "../sprites/minigame/npc";
import MinigamePlayer from "../sprites/minigame/player";
import { switchSceneFadeIn } from "../util/fades";
import { LoadTilemap } from "../util/tilemaps";

enum Item {
    APPLE,
    PUMPKIN
}

const LEVELS: Item[][] = [
    [Item.APPLE, Item.APPLE],
]

export default class MinigameScene extends Phaser.Scene {
    private _levelActive: boolean
    private _currentLevel: number
    private _playerDepth!: number
    private _constantColorMatrices: Phaser.FX.ColorMatrix[] = []

    constructor() {
        super(SceneName.Minigame)
        this._levelActive = false
        this._currentLevel = 0;
    }

    create(data: { fade: boolean }) {
        this.sprites.use();

        let { map, playerDepth } = LoadTilemap(this, "test2")

        this._playerDepth = playerDepth

        for (let layer of map.layers) {
            if (layer.tilemapLayer != null) this._constantColorMatrices.push(layer.tilemapLayer.postFX?.addColorMatrix())
        }

        let camera = this.cameras.main;
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
        camera.setZoom(this.scale.width / map.widthInPixels)

        let player = new MinigamePlayer(this, 450, 70)
        let npc = new MinigameNPC(this, 30, 70)

        this.sprites.addSprites(player, npc)
        this.sprites.getBodyGroup().setDepth(playerDepth)
        for (let sprite of this.sprites.getBodies()) {
            this._constantColorMatrices.push(sprite.postFX!.addColorMatrix())
        }

        if (data !== undefined) {
            if (data.fade) switchSceneFadeIn(this)
        }
    }

    private _duration = 500

    private timeTransition(way: boolean, tweens: Phaser.Tweens.Tween[], colorMatrices: Phaser.FX.ColorMatrix[], onDone?: () => void) {
        if (!way) {
            this.tweens.addMultiple(
                [
                    {
                        targets: tweens,
                        timeScale: 0.8,
                        duration: this._duration,
                        onComplete: onDone
                    },
                    {
                        targets: this.anims,
                        globalTimeScale: 0.4,
                        duration: this._duration
                    },
                    {
                        targets: { value: 0 },
                        value: 0.6,
                        onUpdate: (_, __, ___, curr) => {
                            for (let colorMatrix of colorMatrices) {
                                colorMatrix.grayscale(curr)
                            }
                        },
                        duration: this._duration
                    }
                ]
            )
        } else {
            this.tweens.addMultiple(
                [
                    {
                        targets: tweens,
                        timeScale: 1,
                        duration: this._duration,
                        onComplete: onDone
                    },
                    {
                        targets: this.anims,
                        globalTimeScale: 1,
                        duration: this._duration
                    },
                    {
                        targets: { value: 0.6 },
                        value: 0,
                        onUpdate: (_, __, ___, curr) => {
                            for (let colorMatrix of colorMatrices) {
                                colorMatrix.grayscale(curr)
                            }
                        },
                        duration: this._duration
                    }
                ]
            )
        }
    }

    private activateLevel() {
        //add timer delay
        this._levelActive = true;
        let localEmitter = new Phaser.Events.EventEmitter()
        let levelData = LEVELS[this._currentLevel]
        // 110-30
        let yInc = 80 / levelData.length
        let y = 30
        let tweens: Phaser.Tweens.Tween[] = []
        let colorMatrices = [...this._constantColorMatrices]
        let items: MinigameApple[] = []
        for (let i = 0; i < levelData.length; i++) {
            switch (levelData[i]) {
                case Item.APPLE:
                    let apple = new MinigameApple(this, 50, y + yInc * (i + 1), {
                        depth: this._playerDepth,
                        targetX: 450,
                        duration: 5000
                    })
                    tweens.push(...apple.getTweens())
                    colorMatrices.push(apple.getColorMatrix())
                    items.push(apple)
                    apple.getEventEmitter().on("itemComplete", () => {
                        if (i + 1 < items.length) {
                            items[i + 1].activate()
                        } else {
                            localEmitter.emit("done")
                        }
                    })
                    apple.getEventEmitter().on("itemFailed", () => {
                        if (i + 1 < items.length) {
                            items[i + 1].activate()
                        } else {
                            localEmitter.emit("done")
                        }
                    })
                    break;
            }
        }
        for (let i = 0; i < items.length; i++) {
            this.time.delayedCall(400 + (400 * i), () => {
                items[i].start()
                if (i == 0) items[i].activate()
            })
        }
        this.time.delayedCall(600, () => this.timeTransition(false, tweens, colorMatrices))
        localEmitter.on("done", () => {
            for (let tween of tweens) {
                tween.destroy()
            }
            items = []
            this.timeTransition(true, [], this._constantColorMatrices, () => {
                this.time.delayedCall(2000, () => {
                    this._levelActive = false
                })
            })
        })
    }

    update() {
        if (!this._levelActive) {
            this.activateLevel()
        }
    }
}