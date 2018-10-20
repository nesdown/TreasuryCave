//TODO: fix slow uploadment of regenerated world sources.
//DONE: fixed bad blocks overlay process.

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

window.outer = {
  create(){},
  update(){},
  render(){}
};

// Control variables
window.mouse, window.game;
// varmouse = window.mouse;
var game = new Phaser.Game(config);
var money = 0;
var luck = 1;
let blocks, goldblocks, rockblocks, groundblocks;
let gold, rock, ground, block;
let hole_coordinates = {
  first : [368, -16],
  second : [368, 48],
  third : [304, 48],
  fourth: [304, 112],
  fifth: [368, 112],
  sixth: [432, 112]
};

let player;
let is_digging = false;
let is_regenerated = false;

function preload() {
  // Import all graphics assets
  this.load.image('background', 'assets/shaht.png');
  this.load.image('ground', 'assets/ground.png');
  this.load.image('gold', 'assets/gold.png');
  this.load.image('rock', 'assets/rock.png');

  this.load.spritesheet('character', 'assets/character3.png', {frameWidth: 55, frameHeight: 67});
}


function create() {
  window.outer.create();

  // Add a background
  this.add.image(400, 300, 'background');

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
   this.input.on("pointerdown", clickEmitter, this);
}


function update() {
  window.outer.update();

  if (!is_digging)
    player.anims.play('breathe', true);
}

function render() {
  window.outer.render();
}


// This one makes a hole at the beginning of a scene
function deleteOne() {
  blocks.children.iterate(function (child) {
    try {
      // console.log(child.x + " " + child.y);

      if(child.x == hole_coordinates.first[0] && child.y == hole_coordinates.first[1]) {
        child.disableBody(true, true);
        console.log('deleted 1');
        // return;
      }

      if(child.x == hole_coordinates.second[0] && child.y == hole_coordinates.second[1]) {
        child.disableBody(true, true);
        console.log('deleted 2');
        // return;
      }

      if(child.x == hole_coordinates.third[0] && child.y == hole_coordinates.third[1]) {
        child.disableBody(true, true);
        console.log('deleted 3');
        // return;
      }

      if(child.x == hole_coordinates.fourth[0] && child.y == hole_coordinates.fourth[1]) {
        child.disableBody(true, true);
        console.log('deleted 4');
        // return;
      }

      if(child.x == hole_coordinates.fifth[0] && child.y == hole_coordinates.fifth[1]) {
        child.disableBody(true, true);
        console.log('deleted 5');
        // return;
      }

      if(child.x == hole_coordinates.sixth[0] && child.y == hole_coordinates.sixth[1]) {
        child.disableBody(true, true);
        console.log('deleted 6');
        // return;
      }
    }

    catch(error) {
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
    platform.y -= 320; platform.body.y -= 320;  player.y -= 320;

    console.log("The world was regenerated anew");
  })
  // player.y -= 400;

  // Here we delete some blocks upper
  blocks.children.iterate(function (dead) {
    if(dead.y < -16) {
      dead.disableBody(true, true);
      // blocks.remove(dead);

      console.log('A block was removed');
    }
  });

  is_regenerated = true;
}




function clickEmitter() {
  is_digging = true;
  player.anims.stop(null, true);
  player.anims.play('kick', true);

  setTimeout(function() {
    console.log(player.x + " " + parseInt(player.y));
    blocks.children.iterate(function (child) {
      if (child.x == 368 && (child.y == (parseInt(player.y) + 65) || child.y == (parseInt(player.y) + 66))) {
        child.disableBody(true, true);
        money += Phaser.Math.Between(0, 3) * luck;
        console.log('You got money: ' + money);
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

  if(player.y > 400) {
    console.log('Something has to happen!');
    if (!is_regenerated)
      regenerate_world();
  }

  else
    is_regenerated = false;
}
