import { Entity, MonsterName } from "./definitions/adventureland";
import { mainTarget } from "./constants/main-target";
import { targetPriority } from "./constants/target-priority";
import { findTarget } from "./constants/find-target";

import state from "./public/js/store/state";
import store from "./public/js/store/index";

export class Warrior {
  constructor() {
    const socket = get_socket();
    game_log("in constructor");
    socket.on("entities", (data) => {
      game_log("new entity");
      this.processSocketData(data, "entity");
    });
    game.on("event", (data) => {
      game_log("new event");
      this.processSocketData(data, "event");
    });
  }
  state = state;
  store = store;
  ticks: number = 1;
  mainTarget = mainTarget;
  minTargetDistance = 100;
  targetPriority = targetPriority;
  attackMode = true;
  filterCriteria: string = "mtype";
  currentTarget: Entity;
  isAttacking: boolean;
  targetMaxRange: number = 4;
  targets: MonsterName[] = ["goo"];
  attacking: boolean;

  mainLoop() {
    game_log("main loop");

    character.on("incoming", (data) => {
      this.attack(data.actor);
    });

    setInterval(() => {
      // console.log(state.entities);

      state.entities.forEach((entity) => {
        console.log(entity);
        const entityId = Object.keys(entity)[0];
        console.log(`entityId:${entityId}`);

        const record = state.entities[entityId];
        console.log(`record: ${record}`);
      });
      if (!this.attackMode || parent.character.rip) {
        return;
      }

      this.detectMainTarget();

      use_hp_or_mp();
      loot();
    }, Math.max(1000, parent.character.ping));
  }

  detectMainTarget() {
    // if (!this.currentTarget) {
    //   let targetList: { target: Entity; distance: number }[] = [];
    //   try {
    //     const filtered = Object.keys(parent.entities)
    //       .filter(
    //         (key) =>
    //           parent.entities[key].visible &&
    //           this.targets.includes(parent.entities[key].mtype) &&
    //           parent.entities[key].attack < 20 &&
    //           determineDistance(
    //             parent.character.real_x,
    //             parent.character.real_y,
    //             parent.entities[key].real_x,
    //             parent.entities[key].real_y
    //           ) < this.targetMaxRange
    //       )
    //       .reduce((obj, key) => {
    //         show_json(obj);
    //         setTimeout(() => {
    //           show_json(key);
    //         }, 5000);
    //         if (this.currentTarget) {
    //           this.attack(targetList[0].target.id);
    //         }
    //         return obj;
    //       }, {});
    //   } catch (error) {
    //     game_log(`main target error: ${error}`);
    //   }
    // }
  }

  attack(targetId?: string): void {
    this.currentTarget = targetId ? findTarget(targetId) : this.currentTarget;
    if (this.currentTarget) {
      game_log(`attacking: ${this.currentTarget.id}`);
      if (
        !is_in_range(this.currentTarget, "attack") &&
        !is_moving(parent.character)
      ) {
        this.moveLoop();
      } else if (can_attack(this.currentTarget)) {
        set_message("Attacking");
        attack(this.currentTarget).then(
          (data) => {
            game_log("success attack");
            reduce_cooldown("attack", Math.max(250, parent.character.ping));
          },
          (error) => {
            game_log(`error: ${error.reason}`);
          }
        );
      }
    }
  }

  moveLoop() {
    if (can_move_to(this.currentTarget.real_x, this.currentTarget.real_y))
      xmove(
        parent.character.real_x +
          (this.currentTarget.real_x - parent.character.real_x),
        parent.character.real_y +
          (this.currentTarget.real_y - parent.character.real_y)
      );
  }

  allDocuments(): void {
    show_json(state);
  }

  processSocketData(data, type) {
    if (type == "entity") {
      data.monsters.forEach((monster) => {
        game_log(`incoming monsterId: ${monster.id}`);
        game_log(`current entities in state: ${state.entities.length}`);
        const record = state.entities[monster.id];
        if (!record) {
          game_log(`new record adding ${monster.id}`);
          this.store.dispatch("addItem", { [monster.id]: monster });
        } else {
          game_log(`exsists, updating ${monster.id}`);
          this.store.dispatch("updateItem", { [monster.id]: monster });
        }
      });
    } else {
      game_log(`incoming event: ${data.id}`);
      this.store.dispatch("addEvent", { [data.id]: data });
    }

    // game_log(`incoming event: ${monster.id}`);
    // game_log(`current entities in state: ${state.entities.length}`);
    // const record = state.entities[monster.id];
    // if (!record) {
    //   game_log(`new record adding ${monster.id}`);
    //   this.store.dispatch("addItem", { [monster.id]: monster });
    // } else {
    //   game_log(`exsists, updating ${monster.id}`);
    //   this.store.dispatch("updateItem", { [monster.id]: monster });
    // }
  }
}

const warrior = new Warrior();
warrior.mainLoop();
