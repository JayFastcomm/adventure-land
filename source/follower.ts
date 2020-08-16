import {
  CharacterEntity,
  Entity,
  IPosition,
} from "./definitions/adventureland";

import { percentage } from "./constants/precentage";

export class Follower {
  private parent: Window;
  private game = G;
  private parentCharacter: CharacterEntity = parent.character;
  private purchasePots: boolean = true;
  private hpPotion: string = "hpot0";
  private mpPotion: string = "mpot0";
  private potsMinimum: number = 50;
  private potsToBuy: number = 1000;
  private leader: Entity;
  private areLeader: boolean;
  private leaderTarget: Entity;
  private currentTarget: Entity;
  private lastHpStamp: Date;
  private lastMpStamp: Date;

  constructor() {
    const socket: any = get_socket();
    this.socketListener(socket);
  }

  mainLoop() {
    setInterval(() => {
      this.restoration();
      this.purchasePotions();
      //   this.getTargeting();
      this.attackLoop();
    }, Math.max(250, this.parentCharacter.ping));
  }
  // //Purchase Potions
  purchasePotions(): void {
    if (this.parentCharacter.gold && this.parentCharacter.gold > 10000) {
      const hpPotions = this.parentCharacter.items.find(
        (item) => item.name == this.hpPotion
      );
      const mpPotions = this.parentCharacter.items.find(
        (item) => item.name == this.mpPotion
      );

      if (hpPotions && hpPotions.q < this.potsMinimum) {
        buy(this.hpPotion, this.potsToBuy);
        set_message("Buying hp pots.");
      }
      if (mpPotions && mpPotions.q < this.potsMinimum) {
        buy(this.mpPotion, this.potsToBuy);
        set_message("Buying mp pots.");
      }
    } else {
      set_message("Not enough cash");
    }
  }

  getTargeting(): void {
    this.leader = get_player(this.parentCharacter.party);
    this.currentTarget = get_targeted_monster();
    this.leaderTarget = get_target_of(this.leader);
  }

  attackLoop(): void {
    if (!this.currentTarget || this.currentTarget != this.leaderTarget) {
      change_target(this.leaderTarget);
      this.currentTarget = get_targeted_monster();
    }

    if (this.currentTarget && can_attack(this.currentTarget)) {
      attack(this.currentTarget);
    }

    if (!this.parentCharacter.moving && this.leader) {
      xmove(this.leader.real_x, this.leader.real_y);
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
        this.lastHpStamp.getTime() - new Date().getTime() > 5000
      )
        use("use_hp");
      set_message("Drinking HP");
    }
    if (
      !this.lastMpStamp ||
      this.lastMpStamp.getTime() - new Date().getTime() > 5000
    ) {
      use("use_mp");
      set_message("Drinking MP");
    }
  }
}

const follower = new Follower();
follower.mainLoop();
