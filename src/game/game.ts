export class Game extends Phaser.Scene {
	public image: Phaser.GameObjects.Image;

	constructor() {
		super("game");
	}

	public preload(): void {
		this.load.image("logo", "assets/phaser3-logo.png");
	}
	public create(): void {
		this.image = this.add.image(400, 300, "logo");
	}
	public update(): void {
		this.image.rotation += 0.01;
	}
}
