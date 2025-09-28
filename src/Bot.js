const Player = require("./Player.js");
const Battleship = require("./Battleship.js");

module.exports = class Bot extends Player {
    constructor (type, gameboard) {
        super(type, gameboard);

        this.type = 'bot';
    }

	playAMove () {
        // let sunkShipsAndFrozenCoors = this.board.getSunkShipsCoors().concat(Battleship.getFrozenPos(this.board.getSunkShipsCoors()));
        // let unsunkShipsAndFrozenCoors = this.board.getUnsunkShipsCoors().concat(Battleship.getDiagonalPos(this.board.getUnsunkShipsCoors()));

        // let unplayableCoors = sunkShipsAndFrozenCoors.concat(unsunkShipsAndFrozenCoors).concat(this.board.getMissedAttacks());

        let unplayableCoors = [...new Set(this.board.getPlayedCells()
                                .concat(Battleship.getFrozenPos(this.board.getSunkShipsCoors()))
                                .concat(Battleship.getDiagonalPos(this.board.getHits())))];
        
        if (this.board.getUnsunkHitShips().length > 0) {
            let {ship, hits} = this.board.getUnsunkHitShips()[0];


            return Battleship.getPossibleHits(ship, hits, unplayableCoors);
        }

        if (unplayableCoors.length >= 95) {
            unplayableCoors = unplayableCoors.sort((a, b) => a - b);

            for (let i = 0; i < unplayableCoors.length; i++) {
                if (unplayableCoors[i + 1] - unplayableCoors[i] > 1) {

                    return unplayableCoors[i] + 1;
                }
            }
        }

        while (true) {
            let coor = Battleship.getRndNumBwt1And100();

            if (!unplayableCoors.includes(coor)) return coor;
        }
    }
}