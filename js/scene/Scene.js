/** 
 * Represents a scene (interactive slideshow slide of sorts) that transition to another scene.
 * */
export class Scene {
  constructor(
    onSceneEnd = () => { console.log('default end') },
  ) {
    this.onSceneEnd = onSceneEnd;
  }

  /**
   * Initialize the scene
   */
  init() {
    
  }

  cleanup() {
    
  }

  /**
   * Offer a way to end the scene manually.
   */
  endScene() {
    this.onSceneEnd();
  }

}