module.exports = class Player {
	type;
	board;

	constructor (type, gameboard) {
		this.type = type;
		this.board = gameboard;
	}

	getBoard () {
		return this.board;
	}

	getType () {
		return this.type;
	}
}