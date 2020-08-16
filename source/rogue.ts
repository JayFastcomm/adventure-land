import {
  CharacterEntity,
  Entity,
  IPosition,
} from "./definitions/adventureland";

import { percentage } from "./constants/percentage";
import { customStyles } from "./constants/custom-styles";

export class Rogue {
  private parentCharacter: CharacterEntity = parent.character;
  private hpPotion: string = "hpot0";
  private mpPotion: string = "mpot0";
  private potsMinimum: number = 50;
  private potsToBuy: number = 1000;
  private leader: Entity;
  private target: Entity;
  private currentTarget: Entity;
  private lastHpStamp: Date;
  private lastMpStamp: Date;
  private lastMoveStamp: Date;
  private isParty: boolean;

  constructor() {
    const socket: any = get_socket();
    this.socketListener(socket);

    parent.$("head").append(`<style>
    #gamelog {
      height: 50vh !important;
    }
    .gamentry {
      font-size: 0.8em !important;
      line-height: inherit !important;
    }
    
    <style>`);
  }

  mainLoop() {
    setInterval(() => {
      game_log(`ping:${this.parentCharacter.ping}`);
      this.isParty = !!this.parentCharacter.party;

      this.restoration();
      // this.purchasePotions();
      this.getTargeting();
      this.move();
      this.attack();
    }, Math.max(250, this.parentCharacter.ping));
  }

  purchasePotions(): void {
    game_log(`in purchase pots`);
    try {
      if (
        this.parentCharacter.items.length &&
        this.parentCharacter.gold &&
        this.parentCharacter.gold > 10000
      ) {
        game_log(`looking for hpPotion in inventory`);
        const hpPotions = this.parentCharacter.items.find(
          (item) => item.name == this.hpPotion
        );
        game_log(`looking for mpPotion in inventory`);
        const mpPotions = this.parentCharacter.items.find(
          (item) => item.name == this.mpPotion
        );
        if (hpPotions && hpPotions.q < this.potsMinimum) {
          buy(this.hpPotion, this.potsToBuy);
          game_log("buying hp potions");
        } else {
          game_log("enough hp potion");
        }
        if (mpPotions && mpPotions.q < this.potsMinimum) {
          buy(this.mpPotion, this.potsToBuy);
          game_log("buying mp potions");
        } else {
          game_log("enough mp potions");
        }
      } else {
        game_log("Not enough cash");
      }
    } catch {
      game_log("purchase pots fucked out");
    }
  }

  getTargeting(): void {
    game_log("get Targeting");
    try {
      if (this.isParty) {
        game_log(`is party looking for leader: ${this.parentCharacter.party}`);
        this.leader = get_player(this.parentCharacter.party);
        if (this.parentCharacter.party == this.parentCharacter.name) {
          game_log("is leader - targetting");
          this.currentTarget = get_nearest_monster({});
        } else {
          game_log(`not leader, attacking leader target`);
          this.currentTarget = get_target_of(this.leader);
        }
      } else {
        game_log("not party");
        this.currentTarget = get_nearest_monster({});
      }
    } catch {
      game_log("get targetting fucked out");
    }
  }

  attack(): void {
    if (this.currentTarget) {
      if (!is_on_cooldown("attack")) {
        set_message("attacking");
        attack(this.currentTarget).then((data) => {
          game_log(`ping after attack callback: ${this.parentCharacter.ping}`);
          reduce_cooldown("attack", this.parentCharacter.ping * 0.95);
        });
      }
    }
  }

  move() {
    if (
      !this.lastMoveStamp ||
      new Date().getTime() - this.lastMoveStamp.getTime() > 250
    ) {
      if (
        !this.parentCharacter.moving &&
        this.leader &&
        this.leader.name !== this.parentCharacter.name &&
        !is_in_range(this.leader, "attack")
      ) {
        set_message("moving");
        xmove(this.leader.real_x, this.leader.real_y);
        this.lastMoveStamp = new Date();
      } else if (
        !this.leader &&
        this.currentTarget &&
        !this.parentCharacter.moving
      ) {
        if (!is_in_range(this.currentTarget, "attack")) {
          set_message("moving");
          xmove(this.currentTarget.real_x, this.currentTarget.real_y);
          this.lastMoveStamp = new Date();
        }
      }
    }
  }

  socketListener(socket): void {
    if (socket) {
      socket.on("drop", (data: { id: string; chest: string } & IPosition) => {
        game_log("socket drop");
        if (distance(this.parentCharacter, data) > 800) {
          return;
        } else {
          parent.socket.emit("open_chest", { id: data.id });
        }
      });

      socket.on("incoming", (data) => {
        game_log("incoming!");
        const aggressor = this.parentCharacter[data.actor];
        if (aggressor.eta <= 50 && can_attack(aggressor)) {
          attack(aggressor);
        }
      });
    } else {
      set_message("socket disconnected");
    }
  }

  restoration() {
    try {
      if (
        percentage(this.parentCharacter.hp, this.parentCharacter.max_hp) < 85
      ) {
        game_log(
          `hp % ${percentage(
            this.parentCharacter.hp,
            this.parentCharacter.max_hp
          )}`
        );
        if (
          !this.lastHpStamp ||
          new Date().getTime() - this.lastHpStamp.getTime() > 5000
        ) {
          set_message("restoringHP");
          use("use_hp");
        }
      }
      if (
        percentage(this.parentCharacter.mp, this.parentCharacter.max_mp) < 85
      ) {
        game_log(
          `mp % ${percentage(
            this.parentCharacter.mp,
            this.parentCharacter.max_mp
          )}`
        );
        if (
          !this.lastMpStamp ||
          new Date().getTime() - this.lastMpStamp.getTime() > 5000
        ) {
          set_message("restoringMP");
          use("use_mp");
        }
      }
    } catch {
      game_log("something here fucked up");
    }
  }
}

const rogue = new Rogue();
rogue.mainLoop();
