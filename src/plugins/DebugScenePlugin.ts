import { PluginNames } from "../enums/pluginNames";

export default class DebugScenePlugin extends Phaser.Plugins.ScenePlugin {
    private debugGraphics: Phaser.GameObjects.Graphics | undefined;
    private debugLayer: Phaser.Tilemaps.TilemapLayer | undefined;

    constructor(scene: Phaser.Scene, pluginManager: Phaser.Plugins.PluginManager) {
        super(scene, pluginManager, PluginNames.DebugPlugin);
    }

    boot() {
        var eventEmitter = this.systems!.events

        eventEmitter.on("update", () => this.update())

        eventEmitter.once("destroy", () => eventEmitter.off("update", this.update))
    }

    create(layer: Phaser.Tilemaps.TilemapLayer) {
        this.debugGraphics = this.scene!.add.graphics().setDepth(999)
        this.debugLayer = layer;
    }

    update() {
        if (this.debugLayer === undefined || !this.debugGraphics) return

        const tileColor = new Phaser.Display.Color(105, 210, 231, 200)
        const colldingTileColor = new Phaser.Display.Color(243, 134, 48, 200)
        const faceColor = new Phaser.Display.Color(40, 39, 37, 255)

        this.debugGraphics.clear();

        // Pass in null for any of the style options to disable drawing that component
        this.debugLayer.renderDebug(this.debugGraphics, {
            tileColor: tileColor, // Non-colliding tiles
            collidingTileColor: colldingTileColor, // Colliding tiles
            faceColor: faceColor // Interesting faces, i.e. colliding edges
        });
    }
}