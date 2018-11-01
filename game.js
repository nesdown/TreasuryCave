//TODO: fix slow uploadment of regenerated world sources.
//DONE: fixed bad blocks overlay process.
import Phaser from 'phaser';
import dataLinker from './start';

const testMode = false;
window.gmFreezd = true;
window.cll300 = false;
let added300 = false;
let shouldConfirmLeave = true;

setTimeout(updateMoney, 1000);

window.config = {
  type: Phaser.CANVAS,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

import {
  outerCreate,
  outerPreload,
  outerUpdate,
  outerRender,
} from './my-stuff';

let clickCnt = 0;
let clickBlocked = false;
var game = null;

const STONE_CRACKS = 2;
const STONE_BREAK_TIME = 400;
const luckPrices = [100, 300, 600, 1200, 2400];
const eqPrices = [300, 900, 1800, 3600, 7200];
const hpPrices = [500, 1000, 3500, 7000, 10000];
let crackTextures = [];

let stoneLife = STONE_CRACKS;

var _language = window.language ? window.language : 'ru';
var lang = {};

var url = 'assets/translation-' + _language + '.json';

$('#submit-form, #disclaimer').on('click', function(e) {
  e.preventDefault();
  setTimeout(() => {
    $('#submit-form-start').on('click', function(e) {
      e.preventDefault();
      $(this).blur();
      fetch(url, { method: 'GET' })
        .then(data => data.json())
        .then(data => {
          lang = data;
          game = new Phaser.Game(config);
          // game.pause();
          $('canvas').css('display', 'block')
            .on('click', function(e) {
              e.stopPropagation();
            });

        });

    });
  }, 100);

});

// window.onbeforeunload = function(e) {
//   if (shouldConfirmLeave) {
//     e.returnValue = 'Are u sure?';
//     return 'are u sure?';
//   }
// }

window.onunload = function() {
  endGame();
}

var money = 0;
var lightnings = 0;

let blocks, goldblocks, rockblocks, groundblocks;
let gold, rock, ground, block;
let hole_coordinates = {
  first: [368, -16],
  second: [368, 48],
  third: [304, 48],
  fourth: [304, 112],
  fifth: [368, 112],
  sixth: [432, 112]
};

let player, stone;
let player_stats = {
  luck: 1,
  equipment: 1,
  hp: 1,
};
let is_digging = false;
let is_regenerated = false;

var background;
const bigFont = '40px \'Helvetica\'';
const smallFont = '15px \'Helvetica\'';
const midFont = '16px \'Helvetica\'';

let money_text;
let lightning_text;

let luckPriceText, equipmentPriceText, hpPriceText;
let luckTitleText, equipmentTitleText, hpTitleText;
let luckProgress, equipmentProgress, hpProgress;


const
  priceLuckMultiplier = 100,
  priceEquipmentMultiplier = 300,
  priceHpMultiplier = 500,
  LIGHTNING_PRICE = 100;


function preload() {
  // Import all graphics assets
  this.load.image('background', 'assets/shaht.png');

  // Import block types
  this.load.image('ground', 'assets/ground.png');
  this.load.image('gold', 'assets/gold.png');
  this.load.image('rock', 'assets/rock.png');

  // Add UI elements
  this.load.image('money_stat', 'assets/money-frame.png');
  this.load.image('exp_stat', 'assets/exp-frame.png');

  // other GUI stuff
  // this.load.image('upgrade_frame', 'assets/upgrade-frame.png');
  this.load.image('upgrades', 'assets/upgrades.png');
  this.load.image('plus_button', 'assets/button-pressed.png');
  // this.load.image('lightning', 'assets/lightning.png');
  // this.load.image('coin', 'assets/coin.png');

  this.load.spritesheet('character', 'assets/character3.png', {
    frameWidth: 55, frameHeight: 67
  });

  this.load.spritesheet('plus_button2', 'assets/plus-button.png', {
    frameWidth: 38, frameHeight: 38
  });

  this.load.spritesheet('progress', 'assets/upgrade-progress.png', {
    frameWidth: 85, frameHeight: 38
  });

  this.load.spritesheet('stone', 'assets/stonefall.png', {
    frameWidth: 56, frameHeight: 56
  });

  this.load.image('modal', 'assets/exit-dialog.png');
  this.load.image('modal-bg', 'assets/exit-dialog-bg.png');
  this.load.image('button', 'assets/button.png');

  this.load.image('intro', 'assets/animation_picture.png');
  this.load.spritesheet('walking', 'assets/digger_walk.png', {
    frameWidth: 82, frameHeight: 64
  });

  this.load.image('crack', 'assets/crack.png');

  outerPreload.bind(this)();
}

function create() {
  const intro = this.add.image(400, 300, 'intro');
  intro.depth = 5;
  intro.setInteractive();
  const wdude = this.add.sprite(100, 380, 'walking');
  wdude.depth = 6;

  // intro animation
  this.add.tween({
    targets: wdude,
    ease: 'Sine.linear',
    duration: 2500,
    delay: 0,
    x: {
      getStart: () => 100,
      getEnd: () => 550,
    },
    onComplete: () => {
      wdude.anims.stop();
      wdude.setFrame(2);
      this.add.tween({
        targets: wdude,
        ease: 'Sine.easeOut',
        duration: 500,
        delay: 0,
        x: {
          getStart: () => 550,
          getEnd: () => 630,
        },
        y: {
          getStart: () => 380,
          getEnd: () => 350,
        },
        onComplete: () => {
          this.add.tween({
            targets: wdude,
            ease: 'Sine.easeIn',
            duration: 1000,
            delay: 0,
            x: {
              getStart: () => 630,
              getEnd: () => 630,
            },
            y: {
              getStart: () => 350,
              getEnd: () => 600,
            },
            onComplete: () => {
              wdude.destroy();
              intro.destroy();
              window.gameStarted = true;
              player = this.physics.add.sprite(368, -16, 'character').setOrigin(-0.1, -0.02);
              player.setBounce(0.2);
              player.setCollideWorldBounds(true);

              this.physics.add.collider(player, blocks);
            }
          });
        }
      });
    }
  });

  // Add a background
  background = this.add.image(400, 300, 'background').setInteractive();

  // Here generated a block static group of objects
  blocks = this.physics.add.staticGroup();

  generateLayer();
  deleteOne();

  // Here we create a player
  // player = this.physics.add.sprite(368, -16, 'character').setOrigin(-0.1, -0.02);


  // ---------------------
  // HERE WE DRAW A UI
  // ---------------------
  drawGUI.bind(this)();

  // ---------------------
  // ANIMATIONS ARE SHOWN HERE
  // ---------------------
  this.anims.create({
    key: 'breathe',
    frames: this.anims.generateFrameNumbers('character', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'kick',
    frames: this.anims.generateFrameNumbers('character', { start: 4, end: 6 }),
    frameRate: 15,
    repeat: -1
  });

  this.anims.create({
    key: 'stonefall',
    frames: this.anims.generateFrameNumbers('stone', { start: 0, end: 7 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'walking',
    frames: this.anims.generateFrameNumbers('walking', { start: 0, end: 2 }),
    frameRate: 10,
    repeat: -1
  });
  wdude.anims.play('walking', true);

  // ---------------------
  // MOUSE INPUT CONTROLS HERE
  // ---------------------
  background.on('pointerdown', () => {
    if (!clickBlocked) {
      clickEmitter.bind(this)();
    }
  }, this);
  // this.input.on("pointerdown", clickEmitter, this);

  // throwStone.bind(this)();

  outerCreate.bind(this)();

  // this.scene.resume();
}


function update() {
  // if (!is_digging && player)
  //   player.anims.play('breathe', true);

  if (!added300 && window.cll300) {
    added300 = true;
    money += 150;
    updateMoney();
  }
  // if (!window.gmFreezd) {
  //   console.log('res');
  //   this.scene.resume();
  // }
}

function render() {

}


// This one makes a hole at the beginning of a scene
function deleteOne() {
  blocks.children.iterate(function(child) {
    try {
      // console.log(child.x + " " + child.y);

      if (child.x == hole_coordinates.first[0] && child.y == hole_coordinates.first[1]) {
        child.disableBody(true, true);
        // console.log('deleted 1');
        // return;
      }

      if (child.x == hole_coordinates.second[0] && child.y == hole_coordinates.second[1]) {
        child.disableBody(true, true);
        // console.log('deleted 2');
        // return;
      }

      if (child.x == hole_coordinates.third[0] && child.y == hole_coordinates.third[1]) {
        child.disableBody(true, true);
        // console.log('deleted 3');
        // return;
      }

      if (child.x == hole_coordinates.fourth[0] && child.y == hole_coordinates.fourth[1]) {
        child.disableBody(true, true);
        // console.log('deleted 4');
        // return;
      }

      if (child.x == hole_coordinates.fifth[0] && child.y == hole_coordinates.fifth[1]) {
        child.disableBody(true, true);
        // console.log('deleted 5');
        // return;
      }

      if (child.x == hole_coordinates.sixth[0] && child.y == hole_coordinates.sixth[1]) {
        child.disableBody(true, true);
        // console.log('deleted 6');
        // return;
      }
    }

    catch (error) {
      console.log(error);
    }
  });
}

// This function adds a block to a group with random sprites.
function generateLayer() {
  // generate all blocks
  for (let y = -16; y < 584; y += 64) {
    for (let x = -16; x < 784; x += 64) {
      let rand_seed = Phaser.Math.Between(0, 4000);

      if (rand_seed % 5 == 0) {
        blocks.create(x, y, 'rock').setOrigin(0, 0);
      }

      else if (rand_seed % 4 == 0) {
        blocks.create(x, y, 'gold').setOrigin(0, 0);
      }

      else {
        blocks.create(x, y, 'ground').setOrigin(0, 0);
      }
    }
  }
}


function regenerate_world() {
  // Here we generate a new part of the world
  for (let y = 624; y < 1136; y += 64) {
    for (let x = -16; x < 784; x += 64) {
      const rand_seed = Phaser.Math.Between(0, 4000);

      if (rand_seed % 5 == 0) {
        blocks.create(x, y, 'rock').setOrigin(0, 0);
      } else if (rand_seed % 4 == 0) {
        blocks.create(x, y, 'gold').setOrigin(0, 0);
      } else {
        blocks.create(x, y, 'ground').setOrigin(0, 0);
      }
    }
  }


  // Here we move some blocks up
  blocks.children.iterate(function(platform) {
    // for(let i = 0; i < 20; i++) {
    //   setTimeout(function() { platform.y -= 10; platform.body.y -= 10;  player.y -= 10;}, 500);
    // }
    if (platform !== undefined) {
      platform.y -= 448;
      platform.body.y -= 448;

      if (platform.y < -16) {
        // dead.disableBody(true, true);
        console.log(blocks.remove(platform, true, true) ? 'block removed' : 'block NOT removed');

        // console.log('A block was removed');
      }

    } else {
      // blocks.remove(platform, true, true);
    }

  })
  player.y -= 700;
  // player.y -= 400;

  // Just a log
  console.log("The world was regenerated anew");

  // Here we delete some blocks upper
  blocks.children.iterate(function(dead) {
    if (dead && dead.y < -16) {
      // dead.disableBody(true, true);
      console.log(blocks.remove(dead, true, true) ? 'block removed' : 'block NOT removed');

      // console.log('A block was removed');
    }
  });

  // drawGUI();
  is_regenerated = true;
}

// GUI drawing
function drawGUI() {
  let textTopOffset = 30;
  let centerX = config.width / 2, centerY = config.height / 2;

  const moneyImg = this.add.image(centerX, centerY, 'money_stat');
  moneyImg.depth = 1;
  // moneyImg.setAlpha(0.3);
  money_text = this.add.text(config.width - 145, textTopOffset, '  0  ',
    { font: bigFont, fill: '#fff' });

  const expImg = this.add.image(centerX, centerY, 'exp_stat');
  expImg.depth = 1;

  lightning_text = this.add.text(40, textTopOffset, '  0  ',
    { font: bigFont, fill: '#fff' });

  this.add.image(centerX, centerY, 'upgrades').depth = 1;
  // this.add.image(476 / 2, config.height - 140 / 2, 'upgrade_frame');

  // let coinImg = this.add.image(config.width - 280, 55, 'coin')
  // coinImg.scaleX = coinImg.scaleY = 0.5;

  // let lightningImg = this.add.image(275, 55, 'lightning');
  // lightningImg.scaleX = lightningImg.scaleY = 0.5;
  // console.log(this.add);

  const luckBtn = makeSprButton(this.add.sprite(211, 347, 'plus_button2'), function() {
    if ((money >= +luckPriceText.text || testMode) && player_stats.luck < 6) {
      console.log('luck improved!!!');
      money -= luckPrices[player_stats.luck - 1];
      player_stats.luck++;
      updateMoney();
    }
  });

  const equipBtn = makeSprButton(this.add.sprite(211, 452, 'plus_button2'), function() {
    if ((money >= +equipmentPriceText.text || testMode) && player_stats.equipment < 6) {
      console.log('player equipment improved!!!');
      money -= eqPrices[player_stats.equipment - 1];
      player_stats.equipment++;
      updateMoney();
    }
  });

  const hpBtn = makeSprButton(this.add.sprite(211, 557, 'plus_button2'), function() {
    if ((money >= +hpPriceText.text || testMode) && player_stats.hp < 6) {
      console.log('1 hp added!!!');
      money -= hpPrices[player_stats.hp - 1];
      player_stats.hp++;
      updateMoney();
    }
  });


  luckPriceText = this.add.text(52, 349, '0',
    { font: smallFont, fill: '#fff' });

  equipmentPriceText = this.add.text(52, 454, '0',
    { font: smallFont, fill: '#fff' });

  hpPriceText = this.add.text(52, 560, '0',
    { font: smallFont, fill: '#fff' });

  luckTitleText = this.add.text(105, 303, lang.upgrades.luck,
    { font: smallFont, fill: '#fff' });
  equipmentTitleText = this.add.text(105, 408, lang.upgrades.equipment,
    { font: smallFont, fill: '#fff' });
  hpTitleText = this.add.text(105, 513, lang.upgrades.hp,
    { font: smallFont, fill: '#fff' });

  luckPriceText.depth = equipmentPriceText.depth = hpPriceText.depth =
    money_text.depth = lightning_text.depth = 2;

  luckProgress = this.add.sprite(147, 348, 'progress');
  equipmentProgress = this.add.sprite(147, 453, 'progress');
  hpProgress = this.add.sprite(147, 558, 'progress');

  luckProgress.depth = equipmentProgress.depth = hpProgress.depth =
    luckTitleText.depth = equipmentTitleText.depth = hpTitleText.depth = 2;

  // luckPriceText = null;
  updateMoney.bind(this)();
}

// setting up button from image
function makeButton(button, callback, args) {
  button
    .setInteractive()
    .setAlpha(0.8)
    .on('pointerover', function() {
      this.setAlpha(1);
    })
    .on('pointerout', function() {
      this.setAlpha(0.8);
    })
    .on('pointerdown', function() {
      background.input.enabled = false;
    })
    .on('pointerup', function(e) {
      callback.apply(this, args);
      background.input.enabled = true;
    });

  return button;
}

function makeSprButton(button, callback, args) {
  button
    .setInteractive()
    .on('pointerover', function() {
      this.setFrame(1);
    })
    .on('pointerout', function() {
      this.setFrame(0);
    })
    .on('pointerdown', function() {
      this.setFrame(2);
      background.input.enabled = false;
      this.scaleX = this.scaleY = 0.9;
    })
    .on('pointerup', function(e) {
      callback.apply(this, args);
      this.setFrame(1);
      background.input.enabled = true;
      this.scaleX = this.scaleY = 1;
    }).depth = 2;

  return button;
}

function clickEmitter() {
  clickCnt++;

  clickBlocked = true;
  setTimeout(() => {
    clickBlocked = false;
  }, STONE_BREAK_TIME);
  // throw stone if needed
  if (clickCnt >= 400) {
    const rnd = Math.random() > 0.6667;
    if (rnd) {
      throwStone.bind(this)();
    }
    clickCnt = 0;
  }

  is_digging = true;
  player.anims.stop(null, true);
  player.anims.play('kick', true);

  setTimeout(() => {
    // console.log(player.x + " " + parseInt(player.y));
    stoneLife--;


    blocks.children.iterate((child) => {
      const dsBlock = (x, y) => {
        if (child.x == 368 + x && (child.y == (parseInt(player.y) + 65 + y) ||
          child.y == (parseInt(player.y) + 66 + y))) {
          if (stoneLife > 0) {
            const crTex = this.add.image(x + 368, y + player.y + 65, 'crack');
            crTex.setOrigin(0, 0);
            crackTextures.push(crTex);
          } else {
            crackTextures.forEach((tex) => tex.destroy());
            crackTextures = [];

            const addition = Phaser.Math.Between(0, 3) * player_stats.luck;
            money += addition;
            if (addition > 0 && money % 200 === 0) {
              lightnings++;
            }

            child.disableBody(true, false);
            this.add.tween({
              targets: child,
              ease: 'Sine.easeInOut',
              duration: 500,
              delay: 0,
              alpha: {
                getStart: () => 1,
                getEnd: () => 0
              },
              onComplete: () => {
                child.destroy();
              }
            });
          }
          return;
        }
      };


      dsBlock(0, 0);
      if (player_stats.equipment > 1) {
        dsBlock(64, 0);
        dsBlock(-64, 0);
      }
      if (player_stats.equipment > 2) {
        dsBlock(0, 64);
      }
      if (player_stats.equipment > 3) {
        dsBlock(-64, 64);
        dsBlock(64, 64);
      }
      if (player_stats.equipment > 4) {
        dsBlock(-128, 0);
        dsBlock(128, 0);
      }
      if (player_stats.equipment > 5) {
        dsBlock(-128, 64);
        dsBlock(128, 64);
      }

      updateMoney();
    });
    if (stoneLife <= 0)
      stoneLife = STONE_CRACKS;

    is_digging = false;
    player.anims.stop(null, true);
    player.anims.play('breathe', true);


    // aaa.play();
    if (player.y > 400 && stoneLife >= STONE_CRACKS) {
      // console.log('Something has to happen!');
      player.anims.stop(null, true);
      if (!is_regenerated)
        setTimeout(() => {
          regenerate_world();
        }, 500);
    }

    else
      is_regenerated = false;

  }, STONE_BREAK_TIME);


  // console.log('A click was emitted');

}

function updateMoney() {
  if (money < 10)
    money_text.setText('  ' + money + '  ');
  else if (money >= 10 && money < 100)
    money_text.setText(' ' + money + ' ');
  else if (money >= 100 && money < 1000)
    money_text.setText(' ' + money + ' ');
  else if (money >= 1000 && money < 10000)
    money_text.setText(' ' + money);
  else
    money_text.setText(money);

  lightning_text.setText(lightnings);

  luckPriceText.setText(player_stats.luck < 6 ?
    luckPrices[player_stats.luck - 1] : '—');
  equipmentPriceText.setText(player_stats.equipment < 6 ?
    eqPrices[player_stats.equipment - 1] : '—');
  hpPriceText.setText(player_stats.hp < 6 ?
    hpPrices[player_stats.hp - 1] : '—');

  luckProgress.setFrame(player_stats.luck - 1);
  equipmentProgress.setFrame(player_stats.equipment - 1);
  hpProgress.setFrame(player_stats.hp - 1);
}

function throwStone() {

  stone = this.physics.add.sprite(368, -16, 'stone').setOrigin(-0.1, -0.02);
  stone.anims.play('stonefall', true);
  stone.setBounce(1);
  this.physics.add.overlap(stone, blocks, function() {
    player_stats.hp--;
    this.add.tween({
      targets: stone,
      ease: 'Sine.easeInOut',
      duration: 1000,
      delay: 0,
      alpha: {
        getStart: () => 1,
        getEnd: () => 0
      },
      onComplete: () => {
        stone.destroy();
      }
    });
    // this.add.tween(stone).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
    if (player_stats.hp <= 0) {
      // DIE!!!!!!
      endGame();
      shouldConfirmLeave = false;

      const modalBg =
        this.add.image(config.width / 2, config.height / 2, 'modal-bg');
      modalBg.setInteractive();
      modalBg.depth = 3;
      const modal =
        this.add.image(config.width / 2, config.height / 2, 'modal');
      modal.setInteractive();
      modal.depth = 4;

      const by = makeButton(this.add.image(400, 330, 'button'), function() {
        window.location.replace('http://globalshield.com.ua/miner/prizes.html');
      });
      const bn = makeButton(this.add.image(400, 380, 'button'), function() {
        // console.log(this.scene);
        // location.reload();
        money = 0;
        for (const i in player_stats) {
          player_stats[i] = 1;
        }
        this.scene.restart();
      }.bind(this));
      by.depth = bn.depth = 5;

      const ttText = this.add.text(400, 228, lang.exitModal.title, {
        font: '36px Helvetica', fill: '#000', fontWeight: '200', align: 'center'
      });
      ttText.setOrigin(0.5, 0.5);
      ttText.depth = 6;

      const yText = this.add.text(400, 328, lang.exitModal.yes, {
        font: bigFont, fill: '#fff',
      });
      yText.setOrigin(0.5, 0.5);
      yText.depth = 6;

      const nText = this.add.text(400, 380, lang.exitModal.no, {
        font: bigFont, fill: '#fff',
      });
      nText.setOrigin(0.5, 0.5);
      nText.depth = 6;


    }
  }, null, this);

  this.physics.add.collider(stone, blocks);
}

function endGame() {
  dataLinker(lightnings);
}
