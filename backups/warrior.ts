import { Character } from "./character";
import { MonsterName, Entity } from "./definitions/adventureland";
import {
  transferItemsToMerchant,
  sellUnwantedItems,
  transferGoldToMerchant,
} from "./trade";
import { TargetPriorityList } from "./definitions/bots";
import {
  getCooldownMS,
  calculateDamageRange,
  isAvailable,
  findItems,
  getEntities,
} from "./functions";
import { targetPriority } from "./constants/target-priority";
import { mainTarget } from "./constants/main-target";

const DIFFICULT = 10;
const MEDIUM = 20;
const EASY = 30;
const SPECIAL = 500;

class Warrior extends Character {
  targetPriority: TargetPriorityList = targetPriority;
  mainTarget: MonsterName = mainTarget;

  constructor() {
    super();
    this.itemsToKeep.push(
      // Weapons
      "basher",
      "bataxe",
      "candycanesword",
      "carrotsword",
      "fireblade",
      "fsword",
      "sword",
      "swordofthedead",
      "wblade",
      "woodensword",

      // Shields
      "mshield",
      "shield",
      "sshield",
      "xshield"
    );
  }

  async run() {
    await super.run();
    this.agitateLoop();
    this.chargeLoop();
    this.hardshellLoop();
    this.cleaveLoop();
    this.stompLoop();
    this.warcryLoop();
    this.tauntLoop();
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
  protected scareLoop(): void {
    try {
      const targets = getEntities({
        isAttackingUs: true,
        isRIP: false,
        isMonster: true,
      });
      let wantToScare = false;
      if (targets.length >= 4) {
        wantToScare = true;
      } else if (targets.length && !this.targetPriority[targets[0].mtype]) {
        wantToScare = true;
      } else if (targets.length && parent.character.c.town) {
        wantToScare = true;
      } else {
        for (const target of targets) {
          if (distance(target, parent.character) > target.range) continue; // They're out of range
          if (
            calculateDamageRange(target, parent.character)[1] *
              6 *
              target.frequency <=
            parent.character.hp
          )
            continue; // We can tank a few of their shots
          // if (this.targets[target.mtype]) continue

          wantToScare = true;
          break;
        }
      }
      if (
        !isAvailable("scare") || // On cooldown
        !wantToScare
      ) {
        // Can't be easily killed
        setTimeout(() => {
          this.scareLoop();
        }, getCooldownMS("scare"));
        return;
      }

      if (parent.character.slots.orb.name == "jacko") {
        // We have a jacko equipped
        use_skill("scare");
        reduce_cooldown("scare", Math.min(...parent.pings));
      } else {
        // Check if we have a jacko in our inventory
        const items = findItems("jacko");
        if (items.length) {
          const jackoI = items[0].index;
          equip(jackoI); // Equip the jacko
          use_skill("scare"); // Scare the monsters away
          reduce_cooldown("scare", Math.min(...parent.pings));
        }
      }
    } catch (error) {
      console.error(error);
    }
    setTimeout(() => {
      this.scareLoop();
    }, getCooldownMS("scare"));
  }

  // TODO: Improve.
  agitateLoop(): void {
    try {
      if (isAvailable("agitate")) {
        let inAgitateCount = 0;
        let dps = 0;
        let dpsLimit = 500;
        const priests = getEntities({ isCtype: "priest", isPartyMember: true });
        for (const priest of priests) {
          if (distance(parent.character, priest) > priest.range) continue; // Priest is out of range
          dpsLimit += (priest.attack * 0.9 * priest.frequency) / 2;
        }

        // TODO: Improve getEntities to add isTargetingOtherPlayer
        // const entities = getEntities({isMonster: true, isRIP: false, isat})

        for (const id in parent.entities) {
          const e = parent.entities[id];
          if (e.type != "monster") continue;
          if (e.rip) continue;

          // You can't agitate monsters that are attacking other players, so don't count them
          if (e.target && !parent.party_list.includes(e.target)) continue;

          const d = distance(parent.character, e);
          if (d > G.skills["agitate"].range) continue; // Out of range

          if (!this.targetPriority[e.mtype]) {
            // Something we don't want is here
            inAgitateCount = 10;
            dps = 9999;
            break;
          }

          inAgitateCount++;
          dps += calculateDamageRange(e, parent.character)[1] * e.frequency;
        }
        if (inAgitateCount > 0 && inAgitateCount <= 3 && dps < dpsLimit) {
          use_skill("agitate");
          reduce_cooldown("agitate", Math.min(...parent.pings));
        }
      }
    } catch (error) {
      console.error(error);
    }
    setTimeout(() => {
      this.agitateLoop();
    }, getCooldownMS("agitate"));
  }

  warcryLoop(): void {
    if (isAvailable("warcry")) {
      // Check if there are at least two party members nearby
      let count = 0;
      for (const member of parent.party_list) {
        const e = parent.entities[member];
        if (!e) continue;
        if (e.ctype == "merchant") continue;

        if (distance(parent.character, e) < G.skills["warcry"].range) {
          count += 1;
        }
        if (count == 2) {
          use_skill("warcry");
          reduce_cooldown("warcry", Math.min(...parent.pings));
          break;
        }
      }
    }
    setTimeout(() => {
      this.warcryLoop();
    }, getCooldownMS("warcry"));
  }

  stompLoop(): void {
    // Stomp monsters with high HP
    const attackingTargets = getEntities({ isAttackingUs: true, isRIP: false });
    if (isAvailable("stomp") && attackingTargets.length) {
      if (
        attackingTargets[0].hp > 25000 &&
        distance(parent.character, attackingTargets[0]) < parent.character.range
      ) {
        use_skill("stomp");
        reduce_cooldown("stomp", Math.min(...parent.pings));
      }
    }
    setTimeout(() => {
      this.stompLoop();
    }, getCooldownMS("stomp"));
  }

  cleaveLoop(): void {
    const wanted: Entity[] = [];
    const unwanted: Entity[] = [];
    for (const e of getEntities({
      isMonster: true,
      isRIP: false,
      isWithinDistance: G.skills.cleave.range,
    })) {
      if (
        parent.character.attack < calculateDamageRange(parent.character, e)[0]
      ) {
        unwanted.push(e);
        continue;
      }
      if (!this.targetPriority[e.mtype]) {
        unwanted.push(e);
        continue;
      }
      if (this.wantToAttack(e, "cleave")) {
        wanted.push(e);
      }
    }

    let unwantedDamage = 0;
    for (const e of unwanted) {
      unwantedDamage += calculateDamageRange(e, parent.character)[1];
    }

    if (isAvailable("cleave") && wanted.length > 3 && unwantedDamage < 1000) {
      use_skill("cleave");
      reduce_cooldown("cleave", Math.min(...parent.pings));
    }
    setTimeout(() => {
      this.cleaveLoop();
    }, getCooldownMS("cleave"));
  }

  chargeLoop(): void {
    if (isAvailable("charge")) use_skill("charge");
    setTimeout(() => {
      this.chargeLoop();
    }, getCooldownMS("charge"));
  }

  hardshellLoop(): void {
    const targets = getEntities({ isAttackingUs: true, isRIP: false });
    if (
      isAvailable("hardshell") &&
      targets.length && // We have a target
      distance(targets[0], parent.character) <= targets[0].range && // In range of their attacks
      parent.character.hp <
        calculateDamageRange(targets[0], parent.character)[1] * 5
    ) {
      // Not a lot of HP remaining
      use_skill("hardshell");
      reduce_cooldown("hardshell", Math.min(...parent.pings));
    }
    setTimeout(() => {
      this.hardshellLoop();
    }, getCooldownMS("hardshell"));
  }

  async tauntLoop(): Promise<void> {
    try {
      let dps = 0;
      let dpsLimit = 500;
      const priests = getEntities({ isCtype: "priest", isPartyMember: true });
      for (const priest of priests) {
        if (distance(parent.character, priest) > priest.range) continue; // Priest is out of range
        dpsLimit += (priest.attack * 0.9 * priest.frequency) / 2;
      }
      const attackingUs = getEntities({
        isAttackingUs: true,
        isRIP: false,
        isMonster: true,
      });
      for (const e of attackingUs) {
        // Entity is attacking us directly
        dps += calculateDamageRange(e, parent.character)[1] * e.frequency;
      }
      if (dps < dpsLimit && attackingUs.length < 3) {
        const attackingParty = getEntities({
          isAttackingParty: true,
          isAttackingUs: false,
          isMonster: true,
          isRIP: false,
          isWithinDistance: G.skills.taunt.range,
        });
        for (const e of attackingParty) {
          // Entity is attacking a party member
          if (!this.wantToAttack(e, "taunt")) continue;
          const damage =
            calculateDamageRange(e, parent.character)[1] * e.frequency;
          if (dps + damage > dpsLimit) continue;

          await use_skill("taunt", e);
          reduce_cooldown("taunt", Math.min(...parent.pings));
          setTimeout(() => {
            this.tauntLoop();
          }, getCooldownMS("taunt"));
          return;
        }

        const notAttacking = getEntities({
          isAttackingParty: false,
          isMonster: true,
          isRIP: false,
          isWithinDistance: G.skills.taunt.range,
        });
        for (const e of notAttacking) {
          // Entity isn't attacking anyone in our party
          if (!this.wantToAttack(e, "taunt")) continue;
          const damage =
            calculateDamageRange(e, parent.character)[1] * e.frequency;
          if (dps + damage > dpsLimit) continue;

          const d = distance(parent.character, e);
          if (
            d > parent.character.range &&
            e.range > parent.character.range * 4
          )
            continue; // Monsters won't come close enough to let us attack them
          // NOTE: The "4" is a magic number. I noticed monsters come to about 1/5 their range when you aggro them

          await use_skill("taunt", e);
          reduce_cooldown("taunt", Math.min(...parent.pings));
          setTimeout(() => {
            this.tauntLoop();
          }, getCooldownMS("taunt"));
          return;
        }
      }
    } catch (error) {
      console.error(error);
    }
    setTimeout(() => {
      this.tauntLoop();
    }, getCooldownMS("taunt"));
  }
}

const warrior = new Warrior();
export { warrior };
