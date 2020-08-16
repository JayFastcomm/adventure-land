import { Entity, MonsterName } from "./definitions/adventureland";
import { mainTarget } from "./constants/main-target";
import { targetPriority } from "./constants/target-priority";
import { determineDistance } from "./constants/determine-distance";
import { findTarget } from "./constants/find-target";

export class Warrior {
  ticks: number = 1;
  mainTarget = mainTarget;
  minTargetDistance = 100;
  targetPriority = targetPriority;
  attackMode = true;
  filterCriteria: string = "mtype";
  currentTarget: Entity;
  isAttacking: boolean;
  targetMaxRange: number = 50;
  targets: MonsterName[] = ["bee", "goo"];

  mainLoop() {
    character.on("incoming", (data) => {
      this.attack(data.actor);
    });
    setInterval(() => {
      game_log("##########");
      game_log(`[TICK: ${this.ticks++}`);
      if (!this.attackMode || parent.character.rip) {
        return;
      }
      this.detectMainTarget();

      use_hp_or_mp();
      loot();

      if (this.currentTarget) {
        this.attack();
      }
      game_log("##########");
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
          obj[key] = parent.entities[key];
          return obj;
        }, {});

      if (filtered) {
        Object.keys(filtered).forEach((key) => {
          const distance = determineDistance(
            parent.character.x,
            parent.character.y,
            filtered[key].x,
            filtered[key].y
          );
          targetList.push({
            target: filtered[key],
            distance: distance,
          });
          game_log(`[filtered: target: ${filtered[key].name},
            distance: ${distance}]`);
        });

        const targetObject: {
          target: Entity;
          distance: number;
        } = targetList.find((target) => Math.min(target.distance));

        if (targetObject) {
          game_log(`targetObject: ${targetObject.target}`);
          this.currentTarget = targetObject.target;
          game_log(
            `target decided as: [${
              this.currentTarget && this.currentTarget.id
            }: ${this.currentTarget && this.currentTarget.hp}]`
          );
          game_log(`with a distance of: [${targetObject.distance}]`);
          game_log(`target: [${targetObject.target.name}]`);
        }
      }
    } catch (error) {
      game_log(`main target error: ${error}`);
    }
  }

  attack(targetId?: string): void {
    this.currentTarget = targetId ? findTarget(targetId) : this.currentTarget;
    if (this.currentTarget) {
      if (!is_in_range(this.currentTarget, "attack")) {
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
const warrior = new Warrior();
warrior.mainLoop();
