!function(e){var t={};function r(o){if(t[o])return t[o].exports;var n=t[o]={i:o,l:!1,exports:{}};return e[o].call(n.exports,n,n.exports,r),n.l=!0,n.exports}r.m=e,r.c=t,r.d=function(e,t,o){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(r.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)r.d(o,n,function(t){return e[t]}.bind(null,n));return o},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=0)}([function(e,t,r){"use strict";r.r(t);r(1)},function(e,t){var r={type:Phaser.AUTO,width:800,height:600,physics:{default:"arcade",arcade:{gravity:{y:300},debug:!1}},scene:{preload:function(){this.load.image("background","assets/shaht.png"),this.load.image("ground","assets/ground.png"),this.load.image("gold","assets/gold.png"),this.load.image("rock","assets/rock.png"),this.load.spritesheet("character","assets/character3.png",{frameWidth:55,frameHeight:67})},create:function(){this.add.image(400,300,"background"),o=this.physics.add.staticGroup(),function(){for(let e=-16;e<584;e+=64)for(let t=-16;t<784;t+=64){let r=Phaser.Math.Between(0,4e3);r%5==0?o.create(t,e,"rock").setOrigin(0,0):r%4==0?o.create(t,e,"gold").setOrigin(0,0):o.create(t,e,"ground").setOrigin(0,0)}}(),o.children.iterate(function(e){try{e.x==i.first[0]&&e.y==i.first[1]&&(e.disableBody(!0,!0),console.log("deleted 1")),e.x==i.second[0]&&e.y==i.second[1]&&(e.disableBody(!0,!0),console.log("deleted 2")),e.x==i.third[0]&&e.y==i.third[1]&&(e.disableBody(!0,!0),console.log("deleted 3")),e.x==i.fourth[0]&&e.y==i.fourth[1]&&(e.disableBody(!0,!0),console.log("deleted 4")),e.x==i.fifth[0]&&e.y==i.fifth[1]&&(e.disableBody(!0,!0),console.log("deleted 5")),e.x==i.sixth[0]&&e.y==i.sixth[1]&&(e.disableBody(!0,!0),console.log("deleted 6"))}catch(e){console.log(e)}}),(n=this.physics.add.sprite(368,-16,"character").setOrigin(-.1,-.02)).setBounce(.2),n.setCollideWorldBounds(!0),this.physics.add.collider(n,o),this.anims.create({key:"breathe",frames:this.anims.generateFrameNumbers("character",{start:0,end:3}),frameRate:10,repeat:-1}),this.anims.create({key:"kick",frames:this.anims.generateFrameNumbers("character",{start:4,end:6}),frameRate:10,repeat:-1}),this.input.on("pointerdown",s,this)},update:function(){a||n.anims.play("breathe",!0)}}};new Phaser.Game(r);let o,n,i={first:[368,-16],second:[368,48],third:[304,48],fourth:[304,112],fifth:[368,112],sixth:[432,112]},a=!1;function s(){a=!0,n.anims.stop(null,!0),n.anims.play("kick",!0),setTimeout(function(){console.log(n.x+" "+parseInt(n.y)),o.children.iterate(function(e){368!=e.x||e.y!=parseInt(n.y)+65&&e.y!=parseInt(n.y)+66||e.disableBody(!0,!0)}),a=!1},1e3),console.log("A click was emitted"),n.y>400&&(console.log("Something has to happen!"),o.children.iterate(function(e){e.y-=500,e.body.y-=500,n.y-=500,console.log("The world was regenerated")}))}}]);