import {
  CharacterEntity,
  Entity,
  IPosition,
} from "./definitions/adventureland";

import { percentage } from "./constants/percentage";

export class Warrior {
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
  debugMode: boolean;
  mainInterval: any;
  manaCooldownTimeout: boolean;

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
    this.mainInterval = setInterval(() => {
      if (this.parentCharacter.rip) {
        this.logger(
          `You DIED!, clearing mailLoop interval: ${new Date()}`,
          "high"
        );
        clearInterval(this.mainInterval);
      }

      if (
        percentage(this.parentCharacter.mp, this.parentCharacter.max_mp) <= 50
      ) {
        this.manaCooldown();
      }
      loot();
      this.isParty = !!this.parentCharacter.party;

      this.restoration();
      // this.purchasePotions();
      this.getTargeting();
      this.move();
      this.attack();
    }, Math.max(250, this.parentCharacter.ping));
  }

  purchasePotions(): void {
    try {
      if (
        this.parentCharacter.items.length &&
        this.parentCharacter.gold &&
        this.parentCharacter.gold > 10000
      ) {
        this.logger(`looking for hpPotion in inventory`);
        const hpPotions = this.parentCharacter.items.find(
          (item) => item.name == this.hpPotion
        );
        this.logger(`looking for mpPotion in inventory`);
        const mpPotions = this.parentCharacter.items.find(
          (item) => item.name == this.mpPotion
        );
        if (hpPotions && hpPotions.q < this.potsMinimum) {
          buy(this.hpPotion, this.potsToBuy);
          this.logger("buying hp potions");
        } else {
          this.logger("enough hp potion");
        }
        if (mpPotions && mpPotions.q < this.potsMinimum) {
          buy(this.mpPotion, this.potsToBuy);
          this.logger("buying mp potions");
        } else {
          this.logger("enough mp potions");
        }
      } else {
        this.logger("Not enough cash");
      }
    } catch {
      this.logger("purchase pots fucked out");
    }
  }

  getTargeting(): void {
    try {
      if (this.isParty) {
        this.logger(
          `is party looking for leader: ${this.parentCharacter.party}`
        );
        this.leader = get_player(this.parentCharacter.party);
        if (this.parentCharacter.party == this.parentCharacter.name) {
          this.logger("is leader - targetting");
          this.currentTarget = get_nearest_monster({});
        } else {
          this.logger(`not leader, attacking leader target`);
          this.currentTarget = get_target_of(this.leader);
        }
      } else {
        this.logger("not party");
        this.currentTarget = get_nearest_monster({});
      }
    } catch {
      this.logger("get targetting fucked out");
    }
  }

  attack(): void {
    if (this.currentTarget) {
      if (is_in_range(this.currentTarget, "attack")) {
        set_message("attacking");
        if (!is_on_cooldown("attack")) {
          attack(this.currentTarget).then((data) => {
            this.logger(
              `ping after attack callback: ${this.parentCharacter.ping}`
            );
            reduce_cooldown("attack", this.parentCharacter.ping * 0.95);
          });
        }
      } else {
        if (!this.manaCooldownTimeout) {
          if (!is_on_cooldown("charge")) {
            use_skill("charge", this.currentTarget);
          }
        }
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
        this.logger("socket drop");
        // if (distance(this.parentCharacter, data) > 800) {
        //   return;
        // } else {
        //   parent.socket.emit("open_chest", { id: data.id });
        // }
      });

      socket.on("incoming", (data) => {
        this.logger("incoming!");
        // const aggressor = this.parentCharacter[data.actor];
        // if (aggressor.eta <= 50 && can_attack(aggressor)) {
        //   attack(aggressor);
        // }
      });
    } else {
      set_message("socket disconnected");
    }
  }

  restoration() {
    if (!this.manaCooldownTimeout) {
      can_use("regen_hp")
        ? is_on_cooldown("regen_hp")
          ? null
          : use_skill("regen_hp")
        : null;
      can_use("regen_mp")
        ? is_on_cooldown("regen_mp")
          ? null
          : use_skill("regen_mp")
        : null;
    }
    try {
      if (
        percentage(this.parentCharacter.hp, this.parentCharacter.max_hp) < 85
      ) {
        this.logger(
          `hp % ${percentage(
            this.parentCharacter.hp,
            this.parentCharacter.max_hp
          )}`
        );
        if (
          !this.lastHpStamp ||
          new Date().getTime() - this.lastHpStamp.getTime() > 5000
        ) {
          if (!is_on_cooldown("use_hp")) {
            set_message("restoringHP");
            use("use_hp");
          }
        }
      }
      if (
        percentage(this.parentCharacter.mp, this.parentCharacter.max_mp) < 85
      ) {
        this.logger(
          `mp % ${percentage(
            this.parentCharacter.mp,
            this.parentCharacter.max_mp
          )}`
        );
        if (
          !this.lastMpStamp ||
          new Date().getTime() - this.lastMpStamp.getTime() > 5000
        ) {
          if (!is_on_cooldown("use_mp")) {
            set_message("restoringMP");
            use("use_mp");
          }
        }
      }
    } catch {
      this.logger("something here fucked up");
    }
  }

  manaCooldown() {
    this.manaCooldownTimeout = true;
    setTimeout(() => {
      this.manaCooldownTimeout = false;
    }, 10000);
  }

  logger(data: any, priority?: string): void {
    if (priority == "high") {
      return game_log(data);
    }
    if (this.debugMode) {
      game_log(data);
    }
  }
}

const warrior = new Warrior();
warrior.mainLoop();
