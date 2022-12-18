import "phaser";
import { Game } from "./game/game";
import { Gameconfig } from "./game/helpers/types";

const config: Gameconfig = {
	width: 800,
	height: 600,
	parent: "thegame",
	scene: Game,
};

new Phaser.Game(config);
