//TODO: fix slow uploadment of regenerated world sources.
//DONE: fixed bad blocks overlay process.
import Phaser from 'phaser';

const testMode = true;

window.config = {
  type: Phaser.AUTO,
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

// Control variables
window.mouse, window.game;
// varmouse = window.mouse;
var game = new Phaser.Game(config);

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

let player;
let player_stats = {
  luck: 1,
  equipment: 1,
  hp: 1,
};
let is_digging = false;
let is_regenerated = false;

var background;
const bigFont = '40px \'Raleway\'';
const smallFont = '15px \'Raleway\'';

let money_text;
let lightning_text;

let luckPriceText, equipmentPriceText, hpPriceText;
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

  outerPreload.bind(this)();
}

function create() {

  // Add a background
  background = this.add.image(400, 300, 'background').setInteractive();

  // Here generated a block static group of objects
  blocks = this.physics.add.staticGroup();

  generateLayer();
  deleteOne();

  // Here we create a player
  player = this.physics.add.sprite(368, -16, 'character').setOrigin(-0.1, -0.02);

  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  this.physics.add.collider(player, blocks);

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
    frameRate: 10,
    repeat: -1
  });


  // ---------------------
  // MOUSE INPUT CONTROLS HERE
  // ---------------------
  background.on('pointerdown', clickEmitter.bind(this), this);
  // this.input.on("pointerdown", clickEmitter, this);

  outerCreate.bind(this)();
}


function update() {

  if (!is_digging)
    player.anims.play('breathe', true);
}

function render() {

}


// This one makes a hole at the beginning of a scene
function deleteOne() {
  blocks.children.iterate(function (child) {
    try {
      // console.log(child.x + " " + child.y);

      if (child.x == hole_coordinates.first[0] && child.y == hole_coordinates.first[1]) {
        child.disableBody(true, true);
        console.log('deleted 1');
        // return;
      }

      if (child.x == hole_coordinates.second[0] && child.y == hole_coordinates.second[1]) {
        child.disableBody(true, true);
        console.log('deleted 2');
        // return;
      }

      if (child.x == hole_coordinates.third[0] && child.y == hole_coordinates.third[1]) {
        child.disableBody(true, true);
        console.log('deleted 3');
        // return;
      }

      if (child.x == hole_coordinates.fourth[0] && child.y == hole_coordinates.fourth[1]) {
        child.disableBody(true, true);
        console.log('deleted 4');
        // return;
      }

      if (child.x == hole_coordinates.fifth[0] && child.y == hole_coordinates.fifth[1]) {
        child.disableBody(true, true);
        console.log('deleted 5');
        // return;
      }

      if (child.x == hole_coordinates.sixth[0] && child.y == hole_coordinates.sixth[1]) {
        child.disableBody(true, true);
        console.log('deleted 6');
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
  for (let y = 624; y < 1008; y += 64) {
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


  // Here we move some blocks up
  blocks.children.iterate(function (platform) {
    // for(let i = 0; i < 20; i++) {
    //   setTimeout(function() { platform.y -= 10; platform.body.y -= 10;  player.y -= 10;}, 500);
    // }
    platform.y -= 320; platform.body.y -= 320; player.y -= 320;
  })
  // player.y -= 400;

  // Just a log
  console.log("The world was regenerated anew");

  // Here we delete some blocks upper
  blocks.children.iterate(function (dead) {
    if (dead.y < -16) {
      dead.disableBody(true, true);
      // blocks.remove(dead);

      console.log('A block was removed');
    }
  });

  // drawGUI();
  is_regenerated = true;
}

function drawGUI() {
  let textTopOffset = 32;
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

  const luckBtn = makeSprButton(this.add.sprite(211, 347, 'plus_button2'), function () {
    if ((money >= +luckPriceText.text || testMode) && player_stats.luck < 6) {
      console.log('luck improved!!!');
      money -= player_stats.luck * priceLuckMultiplier;
      player_stats.luck++;
      updateMoney();
    }
  });

  const equipBtn = makeSprButton(this.add.sprite(211, 452, 'plus_button2'), function () {
    if ((money >= +equipmentPriceText.text || testMode) && player_stats.equipment < 6) {
      console.log('player equipment improved!!!');
      money -= player_stats.equipment * priceEquipmentMultiplier;
      player_stats.equipment++;
      updateMoney();
    }
  });

  const hpBtn = makeSprButton(this.add.sprite(211, 557, 'plus_button2'), function () {
    if ((money >= +hpPriceText.text || testMode) && player_stats.hp < 6) {
      console.log('1 hp added!!!');
      money -= player_stats.hp * priceHpMultiplier;
      player_stats.hp++;
      updateMoney();
    }
  });

  const addLightningBtn = makeSprButton(this.add.sprite(50, 100, 'plus_button2'), function () {
    if (money >= LIGHTNING_PRICE) {
      lightnings++;
      money -= LIGHTNING_PRICE;
      console.log('bought lightnings!!!');
      updateMoney();
    } else {
      money_text.setColor('#f00');
      // money_text.colors = ['']
      setTimeout(() => {
        money_text.setColor('#fff');
      }, 500);
    }
  });
  // addLightningBtn.scaleX = addLightningBtn.scaleY = 1.2;


  luckPriceText = this.add.text(52, 349, '0',
    { font: smallFont, fill: '#fff' });

  equipmentPriceText = this.add.text(52, 454, '0',
    { font: smallFont, fill: '#fff' });

  hpPriceText = this.add.text(52, 560, '0',
    { font: smallFont, fill: '#fff' });

  luckPriceText.depth = equipmentPriceText.depth = hpPriceText.depth =
    money_text.depth = lightning_text.depth = 2;

  luckProgress = this.add.sprite(147, 348, 'progress');
  equipmentProgress = this.add.sprite(147, 453, 'progress');
  hpProgress = this.add.sprite(147, 558, 'progress');

  luckProgress.depth = equipmentProgress.depth = hpProgress.depth = 2;

  // luckPriceText = null;
  updateMoney.bind(this)();
}

// setting up button from image
function makeButton(button, callback, args) {
  button
    .setInteractive()
    .setAlpha(0.1)
    .on('pointerover', function () {
      this.setAlpha(1);
    })
    .on('pointerout', function () {
      this.setAlpha(0.1);
    })
    .on('pointerdown', function () {
      background.input.enabled = false;
    })
    .on('pointerup', function (e) {
      callback.apply(this, args);
      background.input.enabled = true;
    });

  return button;
}

function makeSprButton(button, callback, args) {
  button
    .setInteractive()
    .on('pointerover', function () {
      this.setFrame(1);
    })
    .on('pointerout', function () {
      this.setFrame(0);
    })
    .on('pointerdown', function () {
      this.setFrame(2);
      background.input.enabled = false;
      this.scaleX = this.scaleY = 0.9;
    })
    .on('pointerup', function (e) {
      callback.apply(this, args);
      this.setFrame(1);
      background.input.enabled = true;
      this.scaleX = this.scaleY = 1;
    }).depth = 2;

  return button;
}


function clickEmitter() {
  is_digging = true;
  player.anims.stop(null, true);
  player.anims.play('kick', true);

  setTimeout(function () {
    console.log(player.x + " " + parseInt(player.y));
    blocks.children.iterate(function (child) {
      if (child.x == 368 && (child.y == (parseInt(player.y) + 65) || child.y == (parseInt(player.y) + 66))) {
        child.disableBody(true, true);

        // Give him a money!!!
        money += Phaser.Math.Between(0, 3) * player_stats.luck;
        console.log('You got money: ' + money);

        updateMoney();

        return;
      }

      // if (child.x == 368 && child.y == 176)
      //   child.disableBody(true, true);
      //
      // if (child.x == 304 && child.y == 176)
      //   child.disableBody(true, true);
      //
      // if (child.x == 432 && child.y == 176)
      //   child.disableBody(true, true);
    });

    is_digging = false;
  }, 1000);

  console.log('A click was emitted');

  if (player.y > 400) {
    console.log('Something has to happen!');
    if (!is_regenerated)
      regenerate_world();
    // drawGUI.bind(this)();
  }

  else
    is_regenerated = false;
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
    player_stats.luck * priceLuckMultiplier : 'FULL');
  equipmentPriceText.setText(player_stats.equipment < 6 ?
    player_stats.equipment * priceEquipmentMultiplier : 'FULL');
  hpPriceText.setText(player_stats.hp < 6 ?
    player_stats.hp * priceHpMultiplier : 'FULL');

  luckProgress.setFrame(player_stats.luck - 1);
  equipmentProgress.setFrame(player_stats.equipment - 1);
  hpProgress.setFrame(player_stats.hp - 1);
}

function throwStone() {
  player_stats.hp--;
  if (player_stats.hp <= 0) {
    // DIE!!!!!!
    
  }
}
