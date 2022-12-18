import { Keys } from "../helpers/keys";
import {
	ArcadeGroup,
	ArcadeSprite,
	Container,
	GameGroup,
	GameText,
	GameTextStyle,
	Image,
	SpriteWithDynamicBody,
	TileSprite,
} from "../helpers/types";

export class GameScene extends Phaser.Scene {
	public isGameRunning: boolean = false;
	public gameSpeed: number = 10;
	public respawnTime: number = 0;
	public score: number = 0;
	public highScore: number = 0;
	public scoreText: GameText;
	public highScoreText: GameText;
	public ground: TileSprite;
	public startTrigger: SpriteWithDynamicBody;
	public dino: SpriteWithDynamicBody;
	public dinoState: "up" | "down" = "up";
	public obsticles: ArcadeGroup;
	public environment: GameGroup;
	public gameOverScreen: Container;
	public gameOverText: Image;
	public restartButton: Image;
	public gameTextStyle: GameTextStyle = { color: "#535353", font: "900 35px Courier", resolution: 5 };

	public obsticlesArray: string[] = [
		Keys.Images.Obsticle1,
		Keys.Images.Obsticle2,
		Keys.Images.Obsticle3,
		Keys.Images.Obsticle4,
		Keys.Images.Obsticle5,
		Keys.Images.Obsticle6,
	];

	public get width(): number {
		return this.game.config.width as number;
	}

	public get height(): number {
		return this.game.config.height as number;
	}

	constructor() {
		super(Keys.Scenes.Game);
	}

	public preload(): void {}

	public create(): void {
		this.startTrigger = this.physics.add.sprite(0, 10, "void").setOrigin(0, 1).setImmovable().setAlpha(0);
		this.ground = this.add.tileSprite(0, this.height, 88, 26, Keys.Images.Ground).setOrigin(0, 1);
		this.dino = this.physics.add
			.sprite(0, this.height, Keys.Images.DinoIdle)
			.setBodySize(44, 92)
			.setDepth(1)
			.setCollideWorldBounds(true)
			.setGravityY(5000)
			.setOrigin(0, 1);

		this.scoreText = this.add.text(this.width, 0, "00000", this.gameTextStyle).setOrigin(1, 0).setAlpha(0);

		this.highScoreText = this.add
			.text(this.width, 48, this.highScore.toString().padStart(5, "0"), this.gameTextStyle)
			.setOrigin(1, 0)
			.setAlpha(0);

		this.gameOverScreen = this.add.container(this.width / 2, this.height / 2 - 50).setAlpha(0);
		this.gameOverText = this.add.image(0, 0, Keys.Images.GameOver);
		this.restartButton = this.add.image(0, 80, Keys.Images.Restart).setInteractive();

		this.environment = this.add.group();
		this.environment.addMultiple([
			this.add.image(this.width / 2, 170, Keys.Images.Cloud),
			this.add.image(this.width - 88, 80, Keys.Images.Cloud),
			this.add.image(this.width / 1.3, 100, Keys.Images.Cloud),
		]);

		this.environment.setAlpha(0);

		this.gameOverScreen.add([this.gameOverText, this.restartButton]);

		this.obsticles = this.physics.add.group();

		this.initAnims();
		this.initColliders();
		this.initStartTrigger();
		this.handleInputs();
		this.handleScore();
	}

	public update(time: number, delta: number): void {
		if (!this.isGameRunning) {
			return;
		}

		this.ground.tilePositionX += this.gameSpeed;
		Phaser.Actions.IncX(this.obsticles.getChildren(), -this.gameSpeed);
		Phaser.Actions.IncX(this.environment.getChildren(), -0.5);

		this.respawnTime += delta * this.gameSpeed * 0.08;

		if (this.respawnTime >= 1500) {
			this.placeObsticles();
			this.respawnTime = 0;
		}

		this.obsticles.getChildren().forEach((obsticle: ArcadeSprite) => {
			if (obsticle.getBounds().right < 0) {
				obsticle.destroy();
			}
		});

		this.environment.getChildren().forEach((envObject: Image) => {
			if (envObject.getBounds().right < 0) {
				envObject.x = this.width + 30;
			}
		});

		if (this.dino.body.deltaAbsY() > 0) {
			this.dino.anims.stop();
			this.dino.setTexture(Keys.Sprites.Dino, 0);
		} else {
			this.dinoState === "up" ? this.dino.play(Keys.Animations.DinoRun, true) : this.dino.play(Keys.Animations.DinoDown, true);
		}
	}

	private handleInputs() {
		this.restartButton.on(Keys.MouseEvents.PointerDown, () => {
			this.dino.setVelocityY(0);
			this.dino.body.setSize(this.dino.body.width, 92);
			this.dino.body.offset.y = 0;
			this.resume();
			this.obsticles.clear(true, true);
			this.gameOverScreen.setAlpha(0);
		});

		this.input.keyboard.on(Keys.KeydownEvents.Space, () => {
			if (!this.dino.body.onFloor() || this.dino.body.velocity.x > 0) {
				return;
			}

			this.dinoState = "up";
			this.dino.setVelocityY(-1600);
			this.sound.play(Keys.Audio.Jump);
			this.dino.setTexture(Keys.Sprites.Dino, 0);
		});

		this.input.keyboard.on(Keys.KeydownEvents.ArrowDown, () => {
			if (!this.dino.body.onFloor()) {
				return;
			}

			this.dinoState = "down";
			this.dino.body.setSize(this.dino.body.width, 58);
			this.dino.body.offset.y = 34;
		});

		this.input.keyboard.on(Keys.KeyupEvents.ArrowDown, () => {
			this.dinoState = "up";
			this.dino.body.setSize(this.dino.body.width, 92);
			this.dino.body.offset.y = 0;
		});

		this.input.keyboard.on(Keys.KeydownEvents.P, () => {
			this.isGameRunning ? this.pause() : this.resume();
		});
	}

	private initStartTrigger(): void {
		this.physics.add.overlap(
			this.startTrigger,
			this.dino,
			() => {
				if (this.startTrigger.y === 10) {
					this.startTrigger.body.reset(0, this.height);
					return;
				}

				this.startTrigger.disableBody(true, true);
				const width = this.width;

				const startEvent = this.time.addEvent({
					delay: 1000 / 60,
					loop: true,
					callbackScope: this,
					callback: () => {
						this.dino.setVelocityX(80);
						this.dino.play(Keys.Animations.DinoRun, true);

						if (this.ground.width < width) {
							this.ground.width += 34;
						}

						if (this.ground.width >= width) {
							this.ground.width = width;
							this.isGameRunning = true;
							this.dino.setVelocity(0);
							startEvent.remove();
							this.scoreText.setAlpha(1);
							this.environment.setAlpha(1);
						}
					},
				});
			},
			null,
			this
		);
	}

	private initAnims(): void {
		this.anims.create({
			key: Keys.Animations.DinoRun,
			frames: this.anims.generateFrameNumbers(Keys.Sprites.Dino, { start: 2, end: 3 }),
			frameRate: 10,
			repeat: -1,
		});

		this.anims.create({
			key: Keys.Animations.DinoDown,
			frames: this.anims.generateFrameNumbers(Keys.Sprites.DinoDown, { start: 0, end: 1 }),
			frameRate: 10,
			repeat: -1,
		});

		this.anims.create({
			key: Keys.Animations.EnemyFlies,
			frames: this.anims.generateFrameNumbers(Keys.Sprites.EnemyBird, { start: 0, end: 1 }),
			frameRate: 6,
			repeat: -1,
		});
	}

	private placeObsticles(): void {
		const obsticleNum = Math.floor(Math.random() * 7) + 1;
		const distance = Phaser.Math.Between(600, 900);
		let obsticle: ArcadeSprite;

		if (obsticleNum > 6) {
			const enemyHeight = [22, 50];
			obsticle = this.obsticles.create(
				this.width + distance,
				this.height - enemyHeight[Math.floor(Math.random() * 2)],
				Keys.Sprites.EnemyBird
			);
			obsticle.play(Keys.Animations.EnemyFlies, true);
			obsticle.body.setSize(obsticle.body.width, obsticle.body.height / 1.5);
		} else {
			obsticle = this.obsticles.create(this.width + distance, this.height, this.obsticlesArray[obsticleNum - 1]);
			obsticle.body.offset.y = 10;
		}

		obsticle.setOrigin(0, 1).setImmovable();
	}

	private initColliders(): void {
		this.physics.add.collider(
			this.dino,
			this.obsticles,
			() => {
				this.sound.play(Keys.Audio.Hit);
				this.pause();
				this.dino.setTexture(Keys.Images.DinoHurt);
				this.respawnTime = 0;
				this.gameSpeed = 10;
				this.gameOverScreen.setAlpha(1);

				if (this.score > this.highScore) {
					this.highScore = this.score;
					this.highScoreText.setAlpha(1);
					this.highScoreText.setText("HI " + this.highScore.toString().padStart(5, "0"));
				}

				this.score = 0;
			},
			null,
			true
		);
	}

	private handleScore(): void {
		this.time.addEvent({
			delay: 1000 / 10,
			loop: true,
			callbackScope: this,
			callback: () => {
				if (!this.isGameRunning) {
					return;
				}

				this.score++;
				this.gameSpeed += 0.01;

				if (this.score % 100 === 0) {
					this.sound.play(Keys.Audio.Reach);

					this.tweens.add({
						targets: this.scoreText,
						duration: 100,
						repeat: 3,
						alpha: 0,
						yoyo: true,
					});
				}

				this.scoreText.setText(this.score.toString().padStart(5, "0"));
			},
		});
	}

	private pause(): void {
		this.physics.pause();
		this.isGameRunning = false;
		this.anims.pauseAll();
	}

	private resume(): void {
		this.physics.resume();
		this.isGameRunning = true;
		this.anims.resumeAll();
	}
}
