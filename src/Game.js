const Ship = require("./Ship.js");
const Gameboard = require("./Gameboard.js");
const Player = require("./Player.js");
const Bot = require("./Bot.js");

module.exports = class Game {
    players = {};
    turn = 1;
    winner;
    botsTurn;

    constructor (matchtype) {
        this.players.first = new Player('human', new Gameboard());
        if (matchtype === 'computer') {
            this.players.second = new Bot(matchtype, new Gameboard());
        } else {
             this.players.second = new Player(matchtype, new Gameboard());
        }
    }

    getFirstPlayer () {
        return this.players.first;
    }

    getSecondPlayer () {
        return this.players.second;
    }

    addShip (firstOrSecond, shipCoors) {
        this.players[firstOrSecond].getBoard().add(new Ship(...shipCoors));
    }

    strike (coors) {
        if (this.winner) {
            console.log('The game has ended. The winner was player ' + this.winner);

            return;
        }

        if (this.turn === 1) {
            let hit = this.players.first.getBoard().attack(coors);

            if (hit === 0) return 0;

            if (hit) {
                if (this.players.first.getBoard().areAllShipsSunk()) this.winner = 1;

                return hit;
            } else {
                this.turn = 2;

                if (this.players.second.getType() === 'bot') {
                    this.strike(this.players.second.playAMove());
                }

                return hit;
            }
        } else if (this.turn === 2) {
            let hit = this.players.second.getBoard().attack(coors);

            if (hit === 0) return 0;

            if (hit) {
                if (this.players.second.getBoard().areAllShipsSunk()) {
                    this.winner = 2;

                    if (this.players.second.getType() === 'bot') {
                        this.botsTurn(coors, hit);
                    }
                    
                    return hit;    
                } 
            }

            if (this.players.second.getType() === 'bot') {
                this.botsTurn(coors, hit);
            }

            if (hit) {
                if (this.players.second.getType() === 'bot') {
                    this.strike(this.players.second.playAMove());
                }

                return hit;
            } else {
                this.turn = 1;

                return hit;
            }
        }
    }

    onBotsTurn (callback) {
        this.botsTurn = callback;
    }

    whoseTurn () {return this.turn};

    getWinner () {return this.winner};
}