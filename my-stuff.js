import Ph from 'phaser';

function outerPreload() {
  // console.log(game);
  this.load.image('money', 'assets/money-frame.png');
}

function outerCreate() {
  this.add.image(config.width - 340 + 340 / 2, 125 / 2, 'money');
  player.setBounce(1);
}

function outerUpdate() {

}

function outerRender() {

}

export { outerCreate, outerUpdate, outerRender, outerPreload };
