import { Entity, MonsterName, IPosition } from "./definitions/adventureland";
import { mainTarget } from "./constants/main-target";
import { targetPriority } from "./constants/target-priority";
import { determineDistance } from "./constants/determine-distance";
import { findTarget } from "./constants/find-target";

export class Paladin {
  constructor() {
    const socket = get_socket();
    socket.on("*", (data) => {
      game_log(`data: ${data}`);
    });
  }
  ticks: number = 1;
  mainTarget = mainTarget;
  minTargetDistance = 100;
  targetPriority = targetPriority;
  attackMode = true;
  filterCriteria: string = "mtype";
  currentTarget: Entity;
  isAttacking: boolean;
  targetMaxRange: number = 10;
  targets: MonsterName[] = ["goo"];
  attacking: boolean;
  testSocket;

  mainLoop() {
    parent.socket.on("drop", (data) => {
      game_log(data);
    });
    character.on("incoming", (data) => {
      game_log("incoming-damage");
      this.attack(data.actor);
    });
    game.on("*", (data) => {
      game_log(data);
    });

    setInterval(() => {
      if (!this.attackMode || parent.character.rip) {
        return;
      }

      this.detectMainTarget();

      use_hp_or_mp();
      // loot();
    }, Math.max(5000, parent.character.ping));
  }

  detectMainTarget() {
    if (!this.currentTarget) {
      let targetList: Entity[] = [];
      try {
        const filtered = Object.keys(parent.entities)
          .filter(
            (key) =>
              parent.entities[key].visible &&
              this.targets.includes(parent.entities[key].mtype) &&
              parent.entities[key].attack < 20 &&
              determineDistance(
                parent.character.real_x,
                parent.character.real_y,
                parent.entities[key].real_x,
                parent.entities[key].real_y
              ) < this.targetMaxRange
          )
          .map((key, index) => {
            // targetList.push([
            //   parent.entities[key].id,
            //   this.mathRound(
            //     determineDistance(
            //       parent.character.real_x,
            //       parent.character.real_y,
            //       parent.entities[key].real_x,
            //       parent.entities[key].real_y
            //     )
            //   ),
            // ]);
            // game_log(`targetList: ${targetList}`);
            targetList[index] = parent.entities[key];
          });

        // show_json(targetList);

        // show_json(
        //   `sorted TargetList: ${targetList.sort((a, b) =>
        //     a[1] > b[1] ? 1 : -1
        //   )}`
        // );
      } catch (error) {
        game_log(`main target error: ${error}`);
      }
    }
  }

  attack(target: Entity): void {
    this.currentTarget = target ? findTarget(target.id) : this.currentTarget;
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

  moveLoop() {
    if (can_move_to(this.currentTarget.real_x, this.currentTarget.real_y))
      game_log(`moving to target`);
    xmove(
      parent.character.real_x +
        (this.currentTarget.real_x - parent.character.real_x),
      parent.character.real_y +
        (this.currentTarget.real_y - parent.character.real_y)
    );
  }

  mathRound(number: number): number {
    return Math.round((number + Number.EPSILON) * 100) / 100;
  }
}
const paladin = new Paladin();
paladin.mainLoop();
