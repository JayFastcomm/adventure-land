import { Character } from "./character";
import { MonsterName } from "./definitions/adventureland";
import {
  transferItemsToMerchant,
  sellUnwantedItems,
  transferGoldToMerchant,
} from "./trade";
import { TargetPriorityList, PriorityEntity } from "./definitions/bots";
import { getCooldownMS, isAvailable } from "./functions";
import FastPriorityQueue from "fastpriorityqueue";
import { mainTarget } from "./constants/main-target";
import { targetPriority } from "./constants/target-priority";

class Priest extends Character {
  targetPriority: TargetPriorityList = targetPriority;
  mainTarget: MonsterName = mainTarget;

  constructor() {
    super();
    this.itemsToKeep.push(
      // Weapons
      "pmace",

      // Shields
      "mshield",
      "shield",
      "sshield",
      "xshield"
    );
  }

  async mainLoop(): Promise<void> {
    try {
      transferItemsToMerchant(process.env.MERCHANT, this.itemsToKeep);
      transferGoldToMerchant(process.env.MERCHANT, 100000);
      sellUnwantedItems(this.itemsToSell);

      await super.mainLoop();
    } catch (error) {
      console.error(error);
      setTimeout(async () => {
        this.mainLoop();
      }, 250);
    }
  }

  async run() {
    await super.run();
    this.darkBlessingLoop();
    this.partyHealLoop();
  }

  protected partyHealLoop(): void {
    if (isAvailable("partyheal")) {
      for (const member of parent.party_list) {
        const e = parent.entities[member];
        if (!e) continue;
        if (e.rip) continue;
        if (e.hp / e.max_hp < 0.5) {
          use_skill("partyheal");
          reduce_cooldown("partyheal", Math.min(...parent.pings));
          break;
        }
      }
    }
    setTimeout(() => {
      this.partyHealLoop();
    }, getCooldownMS("partyheal"));
  }

  // protected absorbLoop(): void {

  // }

  protected darkBlessingLoop(): void {
    if (isAvailable("darkblessing")) {
      // Check if there are at least two party members nearby
      let count = 0;
      for (const member of parent.party_list) {
        const e = parent.entities[member];
        if (!e) continue;
        if (e.ctype == "merchant") continue;
        if (e.id == parent.character.id) continue;

        if (distance(parent.character, e) < G.skills["darkblessing"].range) {
          count += 1;
        }
        if (count == 2) {
          use_skill("darkblessing");
          reduce_cooldown("darkblessing", Math.min(...parent.pings));
          break;
        }
      }
    }
    setTimeout(() => {
      this.darkBlessingLoop();
    }, getCooldownMS("darkblessing"));
  }

  protected async attackLoop(): Promise<void> {
    try {
      if (parent.character.c.town) {
        setTimeout(async () => {
          this.attackLoop();
        }, getCooldownMS("attack"));
        return;
      }

      if (
        parent.character.hp <
        parent.character.max_hp - parent.character.attack * 0.9
      ) {
        await heal(parent.character);
        reduce_cooldown("attack", Math.min(...parent.pings));
        setTimeout(async () => {
          this.attackLoop();
        }, getCooldownMS("attack", true));
        return;
      }

      // Heal the party member with the lowest % of hp
      const healTargets = new FastPriorityQueue<PriorityEntity>(
        (x, y) => x.priority > y.priority
      );
      for (const member of parent.party_list || []) {
        const entity = parent.entities[member];
        if (
          entity &&
          distance(parent.character, parent.entities[member]) <
            parent.character.range &&
          !parent.entities[member].rip &&
          parent.entities[member].hp / parent.entities[member].max_hp < 0.9
        ) {
          healTargets.add({
            id: member,
            priority: parent.character.max_hp / parent.character.hp,
          }); // The bigger the discrepancy -- the higher the priority
        }
      }
      if (healTargets.size) {
        await heal(parent.entities[healTargets.poll().id]);
        reduce_cooldown("attack", Math.min(...parent.pings));
        setTimeout(async () => {
          this.attackLoop();
        }, getCooldownMS("attack", true));
        return;
      }
    } catch (error) {
      console.error(error);
      setTimeout(async () => {
        this.attackLoop();
      }, getCooldownMS("attack"));
      return;
    }

    await super.attackLoop();
  }
}

const priest = new Priest();
export { priest };
