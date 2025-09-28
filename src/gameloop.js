const Battleship = require('./Battleship.js');
const cannonExplosion = require('./sounds/cannon-explosion.mp3');
const splashSound = require('./sounds/splash.mp3');
const cannonFire = require('./sounds/cannon-fire.mp3');

const gameLoop = (game) => {
  const explosion = new Audio(cannonExplosion);
  const splash = new Audio(splashSound);
  const cannon = new Audio(cannonFire);
  explosion.volume = cannon.volume = '0.5';
  cannon.currentTime = 0.45;

  document.querySelectorAll('#game .board .box').forEach(box => {
    box.dataset.ship = '';
    if (box.classList.contains('hit')) box.classList.remove('hit');
    if (box.classList.contains('missed')) box.classList.remove('missed');
  });

  document.querySelectorAll('span[data-coor]').forEach(span => span.dataset.coor = '');
  document.querySelectorAll('span').forEach(span => {
    if (span.classList.contains('broken')) span.classList.remove('broken');
  });

  document.querySelectorAll('.board').forEach(board => {
    if (board.classList.contains('gloss')) board.classList.remove('.gloss');
  });

  document.querySelector('#game h2:nth-child(1)').innerText = "";
  document.querySelector('#game h2:nth-child(3)').innerText = "";


  const p1Ships = game.getFirstPlayer().getBoard().getShips();
  const p2Ships = game.getSecondPlayer().getBoard().getShips();

  p1ShipsFlat = [];
  p2ShipsFlat = [];

  p1Ships.forEach(ship => {
      p1ShipsFlat = p1ShipsFlat.concat(ship.getCoors());
  });

  p2Ships.forEach(ship => {
      p2ShipsFlat = p2ShipsFlat.concat(ship.getCoors());
  });

  const p1Spans = document.querySelectorAll('[data-player="1"] span[data-size]');
  const p2Spans = document.querySelectorAll('[data-player="2"] span[data-size]');

  for (let p = 0; p < 20; p++) {
    p1Spans[p].dataset.coor = p2ShipsFlat[p]
  }

  for (let q = 0; q < 20; q++) {
    p2Spans[q].dataset.coor = p1ShipsFlat[q]
  }

  p1ShipsFlat.forEach(ship => document.querySelector(`[data-player="1"] .box[data-box="${ship}"]`).dataset.ship = true);
  p2ShipsFlat.forEach(ship => document.querySelector(`[data-player="2"] .box[data-box="${ship}"]`).dataset.ship = true);

  const onBotsTurn = async (cell, hit) => {
    // document.querySelector('[data-player="2"]').classList.add('active');

    if (hit) {
      explosion.volume = cannon.volume = '0.5';
      cannon.currentTime = 0.45;
      cannon.play();
      explosion.play();

      let badge = document.querySelector(`aside[data-player="1"] span[data-coor="${cell}"]`);

      badge.classList.add('broken');

      let notSunk = true;
      let ship = [];

      if (Number(badge.dataset.size) === 1) {
        ship = [Number(badge.dataset.coor)];
      } else {

        for (child of badge.parentNode.children) {
          ship.push(Number(child.dataset.coor));

          if (!child.classList.contains('broken')) notSunk = false;
        }
      }

      if (notSunk) {
        splash.play();
        Battleship.getFrozenPos(ship).forEach(coor => {
          let box = document.querySelector(`.board[data-player="2"] .box[data-box="${coor}"]`);
          if (!box.classList.contains('hit') && !box.classList.contains('missed') && !ship.includes(coor)) {
            box.classList.add('frozen');
          }
        });
      }

      document.querySelector(`.board[data-player="2"] .box[data-box="${cell}"]`).classList.add('hit');

      if (game.getWinner() === 2) {
        document.querySelector(`.board[data-player="1"]`).classList.remove('active');
        document.querySelector(`.board[data-player="2"]`).classList.add('gloss', 'active');

        document.querySelector('#game h2:nth-child(3)').innerText = "Winner";

        document.querySelectorAll('.board[data-player="2"] .frozen').forEach(box => setInterval(() => box.classList.toggle('green-text'), 800));
      }
    } else {
      explosion.volume = cannon.volume = '0.5';
      cannon.currentTime = 0.45;
      cannon.play();
      document.querySelector(`.board[data-player="2"] .box[data-box="${cell}"]`).classList.add('missed');

      document.querySelector('[data-player="2"]').classList.remove('active');
      document.querySelector('[data-player="1"]').classList.add('active');
    }
  };

  game.onBotsTurn(onBotsTurn);

  oppositeTurn = turn => turn === 1 ? 2 : 1; 

  document.querySelectorAll('.box:not(.hit):not(.missed):not(.frozen)').forEach(box => box.addEventListener('click', async e => {
    if (e.target.classList.contains('hit') || e.target.classList.contains('missed') || e.target.classList.contains('frozen')) return;
    let turn = game.whoseTurn();

    if (game.getWinner()) return;

    if (turn != e.target.parentNode.dataset.player) return;

    await document.querySelector(`.board[data-player="${turn}"]`).classList.remove('active');

    let player = e.target.parentNode.dataset.player;

    if (turn == player) {
      let coors = e.target.dataset.box;

      let hit = game.strike(coors);

      document.querySelector('.board[data-player="'+ game.whoseTurn() +'"]').classList.add('active');

      if (hit !== 0) {
        if (hit) {
          explosion.volume = cannon.volume = '0.5';
          cannon.currentTime = 0.45;
          cannon.play();
          explosion.play();

          let badge = document.querySelector(`aside[data-player="${oppositeTurn(turn)}"] span[data-coor="${coors}"]`);

          badge.classList.add('broken');

          let notSunk = true;
          let ship = [];

          if (Number(badge.dataset.size) === 1) {
            ship = [Number(badge.dataset.coor)];
          } else {

            for (child of badge.parentNode.children) {
              ship.push(Number(child.dataset.coor));

              if (!child.classList.contains('broken')) notSunk = false;
            }
          }

          if (notSunk) {
            splash.play();
            Battleship.getFrozenPos(ship).forEach(coor => {
              let box = document.querySelector(`.board[data-player="${turn}"] .box[data-box="${coor}"]`);
              if (!box.classList.contains('hit') && !box.classList.contains('missed') && !ship.includes(coor)) {
                box.classList.add('frozen');
              }
            });
          }

        	e.target.classList.add('hit');

          if (game.getWinner()) {
            e.target.parentNode.classList.add('gloss');

            document.querySelectorAll(`.board[data-player="${turn}"] .frozen`).forEach(box => setInterval(() => box.classList.toggle('green-text'), 800));

            if (turn == 1) {
              document.querySelector('#game h2:first-child').innerText = "Winner";
            } else {
              document.querySelector('#game h2:nth-child(3)').innerText = "Winner";
            }
          }
        } else {
          explosion.volume = cannon.volume = '0.5';
          cannon.currentTime = 0.45;
          cannon.play();
        	e.target.classList.add('missed');
          if (game.getSecondPlayer().getType() !== 'bot') {
            document.querySelector('.pass-screen').classList.add('active');
            document.querySelector('.pass-screen').innerHTML = `<p>Pass to <span class="orange">player ${game.whoseTurn()}</span> in \n ` + '<span class="ball">2</span> seconds</p>';

            setTimeout(() => {
              document.querySelector('.pass-screen').innerHTML = `<p>Pass to <span class="orange">player ${game.whoseTurn()}</span> in \n ` + '<span class="ball">1</span> second</p>';

              setTimeout(() => document.querySelector('.pass-screen').classList.remove('active'), 1000)
            }, 1000);
          }
        }
      }
    }
  }));
}

module.exports = gameLoop;