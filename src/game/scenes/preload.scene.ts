import { Keys } from "../helpers/keys";

export class PreloadScene extends Phaser.Scene {
	constructor() {
		super(Keys.Scenes.Preload);
	}

	public preload(): void {
		this.load.audio(Keys.Audio.Jump, "assets/jump.mp3");
		this.load.audio(Keys.Audio.Hit, "assets/hit.mp3");
		this.load.audio(Keys.Audio.Reach, "assets/reach.m4a");

		this.load.image(Keys.Images.Ground, "assets/ground.png");
		this.load.image(Keys.Images.DinoIdle, "assets/dino-idle.png");
		this.load.image(Keys.Images.DinoHurt, "assets/dino-hurt.png");
		this.load.image(Keys.Images.Restart, "assets/restart.png");
		this.load.image(Keys.Images.GameOver, "assets/game-over.png");
		this.load.image(Keys.Images.Cloud, "assets/cloud.png");

		this.load.spritesheet(Keys.Sprites.Star, "assets/stars.png", {
			frameWidth: 9,
			frameHeight: 9,
		});

		this.load.spritesheet(Keys.Sprites.Moon, "assets/moon.png", {
			frameWidth: 20,
			frameHeight: 40,
		});

		this.load.spritesheet(Keys.Sprites.Dino, "assets/dino-run.png", {
			frameWidth: 88,
			frameHeight: 94,
		});

		this.load.spritesheet(Keys.Sprites.DinoDown, "assets/dino-down.png", {
			frameWidth: 118,
			frameHeight: 94,
		});

		this.load.spritesheet(Keys.Sprites.EnemyBird, "assets/enemy-bird.png", {
			frameWidth: 92,
			frameHeight: 77,
		});

		this.load.image(Keys.Images.Obsticle1, "assets/cactuses_small_1.png");
		this.load.image(Keys.Images.Obsticle2, "assets/cactuses_small_2.png");
		this.load.image(Keys.Images.Obsticle3, "assets/cactuses_small_3.png");
		this.load.image(Keys.Images.Obsticle4, "assets/cactuses_big_1.png");
		this.load.image(Keys.Images.Obsticle5, "assets/cactuses_big_2.png");
		this.load.image(Keys.Images.Obsticle6, "assets/cactuses_big_3.png");
	}

	public create(): void {
		this.scene.start(Keys.Scenes.Game);
	}
}
