import { Entity, MonsterName } from "./definitions/adventureland";
import { mainTarget } from "./constants/main-target";
import { targetPriority } from "./constants/target-priority";
import { determineDistance } from "./constants/determine-distance";
import { findTarget } from "./constants/find-target";

export class Rogue {
  ticks: number = 1;
  mainTarget = mainTarget;
  minTargetDistance = 100;
  targetPriority = targetPriority;
  attackMode = true;
  filterCriteria: string = "mtype";
  currentTarget: Entity;
  isAttacking: boolean;
  targetMaxRange: number = 4;
  targets: MonsterName[] = ["bee"];
  attacking: boolean;

  mainLoop() {
    character.on("incoming", (data) => {
      this.attack(data.actor);
    });

    setInterval(() => {
      if (!this.attackMode || parent.character.rip) {
        return;
      }
      if (!this.currentTarget || this.currentTarget.dead) {
        this.attacking = false;
      }
      this.detectMainTarget();

      use_hp_or_mp();
      loot();
    }, Math.max(250, parent.character.ping));
  }

  detectMainTarget() {
    const targetList: { target: Entity; distance: number }[] = [];
    try {
      const filtered = Object.keys(parent.entities)
        .filter(
          (key) =>
            parent.entities[key].visible &&
            this.targets.includes(parent.entities[key].mtype) &&
            parent.entities[key].attack < 20 &&
            determineDistance(
              parent.character.x,
              parent.character.y,
              parent.entities[key].x,
              parent.entities[key].y
            ) < this.targetMaxRange
        )
        .reduce((obj, key) => {
          if (Math.floor(Math.random() * 11) % 2 == 0) {
            game_log(`key:${key}`);
            this.attack(key);
          }
          return obj;
        }, {});
    } catch (error) {
      game_log(`main target error: ${error}`);
    }
  }

  attack(targetId?: string): void {
    game_log(`attacking: ${targetId}`);
    this.currentTarget = targetId ? findTarget(targetId) : this.currentTarget;
    if (this.currentTarget) {
      if (
        !is_in_range(this.currentTarget, "attack") &&
        !is_moving(parent.character)
      ) {
        move(this.currentTarget.x, this.currentTarget.y);
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
}
const rogue = new Rogue();
rogue.mainLoop();
