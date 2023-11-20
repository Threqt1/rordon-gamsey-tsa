import { SceneName } from "../enums/sceneNames";

const DURATION = 500;

export function switchScenesFadeOut(scene: Phaser.Scene, nextScene: SceneName) {
    scene.cameras.main.fadeOut(DURATION, 0, 0, 0)
    scene.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
        scene.scene.start(nextScene, { fade: true })
    })
}

export function switchSceneFadeIn(scene: Phaser.Scene) {
    scene.cameras.main.fadeIn(DURATION, 0, 0, 0);
}