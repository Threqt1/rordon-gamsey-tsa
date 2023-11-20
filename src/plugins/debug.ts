import { PluginName } from "../enums/pluginNames";

export default class DebugPlugin extends Phaser.Plugins.ScenePlugin {
    private _debugGraphics: Phaser.GameObjects.Graphics | undefined;
    private _debugLayer: Phaser.Tilemaps.TilemapLayer | undefined;

    constructor(scene: Phaser.Scene, pluginManager: Phaser.Plugins.PluginManager) {
        super(scene, pluginManager, PluginName.DebugPlugin);
    }

    use() {
        var eventEmitter = this.systems!.events

        eventEmitter.on("update", () => this.update())

        eventEmitter.once("destroy", () => eventEmitter.off("update", this.update))
    }

    create(layer: Phaser.Tilemaps.TilemapLayer) {
        this._debugGraphics = this.scene!.add.graphics().setDepth(999)
        this._debugLayer = layer;
    }

    update() {
        if (this._debugLayer === undefined || !this._debugGraphics) return

        const tileColor = new Phaser.Display.Color(105, 210, 231, 200)
        const colldingTileColor = new Phaser.Display.Color(243, 134, 48, 200)
        const faceColor = new Phaser.Display.Color(40, 39, 37, 255)

        this._debugGraphics.clear();

        // Pass in null for any of the style options to disable drawing that component
        this._debugLayer.renderDebug(this._debugGraphics, {
            tileColor: tileColor, // Non-colliding tiles
            collidingTileColor: colldingTileColor, // Colliding tiles
            faceColor: faceColor // Interesting faces, i.e. colliding edges
        });
    }
}