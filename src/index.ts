import "phaser";
import { Gameconfig } from "./game/helpers/types";
import { GameScene } from "./game/scenes/game.scene";
import { PreloadScene } from "./game/scenes/preload.scene";

const config: Gameconfig = {
	type: Phaser.AUTO,
	width: 1000,
	height: 340,
	pixelArt: true,
	transparent: true,
	parent: "thegame",
	physics: {
		default: "arcade",
		arcade: {
			debug: false,
		},
	},
	scene: [PreloadScene, GameScene],
};

new Phaser.Game(config);
