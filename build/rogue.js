window.bots=function(t){var e={};function a(r){if(e[r])return e[r].exports;var n=e[r]={i:r,l:!1,exports:{}};return t[r].call(n.exports,n,n.exports,a),n.l=!0,n.exports}return a.m=t,a.c=e,a.d=function(t,e,r){a.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},a.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},a.t=function(t,e){if(1&e&&(t=a(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(a.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)a.d(r,n,function(e){return t[e]}.bind(null,n));return r},a.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return a.d(e,"a",e),e},a.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},a.p="",a(a.s=2)}([function(t,e,a){"use strict";a.d(e,"a",(function(){return r}));const r=(t,e)=>100*t/e},,function(t,e,a){"use strict";a.r(e),a.d(e,"Rogue",(function(){return n}));var r=a(0);class n{constructor(){this.parentCharacter=parent.character,this.hpPotion="hpot0",this.mpPotion="mpot0",this.potsMinimum=50,this.potsToBuy=1e3;const t=get_socket();this.socketListener(t),parent.$("head").append("<style>\n    #gamelog {\n      height: 50vh !important;\n    }\n    .gamentry {\n      font-size: 0.8em !important;\n      line-height: inherit !important;\n    }\n    \n    <style>")}mainLoop(){setInterval(()=>{game_log("ping:"+this.parentCharacter.ping),this.isParty=!!this.parentCharacter.party,this.restoration(),this.getTargeting(),this.move(),this.attack()},Math.max(250,this.parentCharacter.ping))}purchasePotions(){game_log("in purchase pots");try{if(this.parentCharacter.items.length&&this.parentCharacter.gold&&this.parentCharacter.gold>1e4){game_log("looking for hpPotion in inventory");const t=this.parentCharacter.items.find(t=>t.name==this.hpPotion);game_log("looking for mpPotion in inventory");const e=this.parentCharacter.items.find(t=>t.name==this.mpPotion);t&&t.q<this.potsMinimum?(buy(this.hpPotion,this.potsToBuy),game_log("buying hp potions")):game_log("enough hp potion"),e&&e.q<this.potsMinimum?(buy(this.mpPotion,this.potsToBuy),game_log("buying mp potions")):game_log("enough mp potions")}else game_log("Not enough cash")}catch{game_log("purchase pots fucked out")}}getTargeting(){game_log("get Targeting");try{this.isParty?(game_log("is party looking for leader: "+this.parentCharacter.party),this.leader=get_player(this.parentCharacter.party),this.parentCharacter.party==this.parentCharacter.name?(game_log("is leader - targetting"),this.currentTarget=get_nearest_monster({})):(game_log("not leader, attacking leader target"),this.currentTarget=get_target_of(this.leader))):(game_log("not party"),this.currentTarget=get_nearest_monster({}))}catch{game_log("get targetting fucked out")}}attack(){this.currentTarget&&(is_on_cooldown("attack")||(set_message("attacking"),attack(this.currentTarget).then(t=>{game_log("ping after attack callback: "+this.parentCharacter.ping),reduce_cooldown("attack",.95*this.parentCharacter.ping)})))}move(){(!this.lastMoveStamp||(new Date).getTime()-this.lastMoveStamp.getTime()>250)&&(this.parentCharacter.moving||!this.leader||this.leader.name===this.parentCharacter.name||is_in_range(this.leader,"attack")?this.leader||!this.currentTarget||this.parentCharacter.moving||is_in_range(this.currentTarget,"attack")||(set_message("moving"),xmove(this.currentTarget.real_x,this.currentTarget.real_y),this.lastMoveStamp=new Date):(set_message("moving"),xmove(this.leader.real_x,this.leader.real_y),this.lastMoveStamp=new Date))}socketListener(t){t?(t.on("drop",t=>{game_log("socket drop"),distance(this.parentCharacter,t)>800||parent.socket.emit("open_chest",{id:t.id})}),t.on("incoming",t=>{game_log("incoming!");const e=this.parentCharacter[t.actor];e.eta<=50&&can_attack(e)&&attack(e)})):set_message("socket disconnected")}restoration(){try{Object(r.a)(this.parentCharacter.hp,this.parentCharacter.max_hp)<85&&(game_log("hp % "+Object(r.a)(this.parentCharacter.hp,this.parentCharacter.max_hp)),(!this.lastHpStamp||(new Date).getTime()-this.lastHpStamp.getTime()>5e3)&&(set_message("restoringHP"),use("use_hp"))),Object(r.a)(this.parentCharacter.mp,this.parentCharacter.max_mp)<85&&(game_log("mp % "+Object(r.a)(this.parentCharacter.mp,this.parentCharacter.max_mp)),(!this.lastMpStamp||(new Date).getTime()-this.lastMpStamp.getTime()>5e3)&&(set_message("restoringMP"),use("use_mp")))}catch{game_log("something here fucked up")}}}(new n).mainLoop()}]);