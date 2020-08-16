import {
  CharacterEntity,
  Entity,
  IPosition,
} from "./definitions/adventureland";

import { percentage } from "./constants/precentage";

export class Paladin {
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
  }

  mainLoop() {
    game_log("main Loop init");
    setInterval(() => {
      game_log(`[tick: ${new Date().getTime()}]`);
      this.isParty = !!this.parentCharacter.party;
      this.restoration();
      this.purchasePotions();
      this.getTargeting();
      this.move();
      this.attack();
    }, Math.max(5000, this.parentCharacter.ping));
  }

  purchasePotions(): void {
    game_log(`in purchase pots: ${this.parentCharacter.items[0].name}`);
    // if (
    //   this.parentCharacter.items.length &&
    //   this.parentCharacter.gold &&
    //   this.parentCharacter.gold > 10000
    // ) {
    //   game_log(`looking for hpPotion in inventory`);
    //   const hpPotions = this.parentCharacter.items.find(
    //     (item) => item.name == this.hpPotion
    //   );
    //   game_log(`looking for mpPotion in inventory`);
    //   const mpPotions = this.parentCharacter.items.find(
    //     (item) => item.name == this.mpPotion
    //   );
    //   if (hpPotions && hpPotions.q < this.potsMinimum) {
    //     buy(this.hpPotion, this.potsToBuy);
    //     set_message("Buying hp pots.");
    //   }
    //   if (mpPotions && mpPotions.q < this.potsMinimum) {
    //     buy(this.mpPotion, this.potsToBuy);
    //     set_message("Buying mp pots.");
    //   }
    // } else {
    //   set_message("Not enough cash");
    // }
  }

  getTargeting(): void {
    game_log("get Targeting");
    if (this.isParty) {
      game_log(`is party looking for leader: ${this.parentCharacter.party}`);
      // this.leader = get_player(this.parentCharacter.party);
      // this.currentTarget = get_target_of(this.leader);
    } else {
      game_log("not party");
      // this.currentTarget = get_nearest_monster({});
    }
  }

  attack(): void {
    if (this.currentTarget) {
      attack(this.currentTarget);
    }
  }

  move() {
    if (
      !this.lastMoveStamp ||
      new Date().getTime() - this.lastMoveStamp.getTime() > 250
    ) {
      if (!this.parentCharacter.moving && this.leader) {
        xmove(this.leader.real_x, this.leader.real_y);
        this.lastMoveStamp = new Date();
      }
    }
  }

  socketListener(socket): void {
    if (!socket.disconnected) {
      socket.on("drop", (data: { id: string; chest: string } & IPosition) => {
        if (distance(this.parentCharacter, data) > 800) {
          return;
        } else {
          parent.socket.emit("open_chest", { id: data.id });
        }
      });

      socket.on("incoming", (data) => {
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
    if (percentage(this.parentCharacter.hp, this.parentCharacter.max_hp) < 50) {
      if (
        !this.lastHpStamp ||
        new Date().getTime() - this.lastHpStamp.getTime() > 5000
      )
        use("use_hp");
      set_message("Drinking HP");
    }
    if (percentage(this.parentCharacter.mp, this.parentCharacter.max_mp) < 50) {
      if (
        !this.lastMpStamp ||
        new Date().getTime() - this.lastMpStamp.getTime() > 5000
      ) {
        use("use_mp");
        set_message("Drinking MP");
      }
    }
  }
}

const paladin = new Paladin();
paladin.mainLoop();
