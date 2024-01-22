import { GoblinMinigameEvents, GoblinMinigameLevelScene } from "../../../scenes/goblin";

export enum GoblinMinigameLightEmitterType {
    CONE,
    CIRCLE
}

const LIGHT_COLOR = 0xffffff
const LIGHT_OPACITY = 0.09

/**
 * A light emitter for the goblin game, usually attached to other objects
 */
export class GoblinMinigameLightEmitter {
    scene: GoblinMinigameLevelScene
    sprite: Phaser.GameObjects.Sprite
    type: GoblinMinigameLightEmitterType
    boundingBox: Phaser.GameObjects.Shape
    ray: Raycaster.Ray

    constructor(scene: GoblinMinigameLevelScene, sprite: Phaser.GameObjects.Sprite, type: GoblinMinigameLightEmitterType, boundingBox: Phaser.GameObjects.Shape) {
        this.scene = scene
        this.sprite = sprite
        this.type = type
        this.boundingBox = boundingBox

        let raycaster = scene.raycaster.createRaycaster()
        scene.createRaycasterSettings(raycaster)
        raycaster.mapGameObjects(this.boundingBox, true)
        this.ray = raycaster.createRay()
        this.ray.autoSlice = true;
        this.ray.enablePhysics();
        this.ray.setCollisionRange(1000);
    }

    /**
     * Emit the light for the light emitter
     */
    emitLight() {
        this.boundingBox.setPosition(this.sprite.x, this.sprite.y)

        this.ray.setOrigin(this.sprite.x, this.sprite.y)

        switch (this.type) {
            case GoblinMinigameLightEmitterType.CONE:
                this.ray.castCone()
                break;
            case GoblinMinigameLightEmitterType.CIRCLE:
                this.ray.castCircle()
                break;
        }

        for (let slice of this.ray.slicedIntersections) {
            this.scene.parentScene.npcVisibleArea.fillStyle(LIGHT_COLOR, LIGHT_OPACITY).fillTriangleShape(slice)
        }

        if (this.ray.overlap(this.scene.player.sprite).length > 0) {
            this.scene.parentScene.gameEvents.emit(GoblinMinigameEvents.CAUGHT)
        }
    }
}