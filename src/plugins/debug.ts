import { PluginEnums } from ".";

const DEBUG_DEPTH = 999

export class DebugPlugin extends Phaser.Plugins.ScenePlugin {
    private debugGraphics: Phaser.GameObjects.Graphics | undefined;
    private debugLayer: Phaser.Tilemaps.TilemapLayer | undefined;

    constructor(scene: Phaser.Scene, pluginManager: Phaser.Plugins.PluginManager) {
        super(scene, pluginManager, PluginEnums.PluginNames.DebugPlugin);
    }

    initialize(layer: Phaser.Tilemaps.TilemapLayer) {
        var eventEmitter = this.systems!.events
        eventEmitter.on("update", () => this.update())
        eventEmitter.once("destroy", () => eventEmitter.off("update", this.update))

        this.debugGraphics = this.scene!.add.graphics().setDepth(DEBUG_DEPTH)
        this.debugLayer = layer;
    }

    update() {
        if (this.debugLayer === undefined || !this.debugGraphics) return

        const tileColor = new Phaser.Display.Color(105, 210, 231, 200)
        const colldingTileColor = new Phaser.Display.Color(243, 134, 48, 200)
        const faceColor = new Phaser.Display.Color(40, 39, 37, 255)

        this.debugGraphics.clear();

        this.debugLayer.renderDebug(this.debugGraphics, {
            tileColor: tileColor,
            collidingTileColor: colldingTileColor,
            faceColor: faceColor
        });
    }
}