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

class Paladin extends Character {
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
    // this.manaShieldLoop();
    // this.agitateLoop();
    // this.chargeLoop();
    // this.hardshellLoop();
    // this.cleaveLoop();
    // this.stompLoop();
    // this.warcryLoop();
    // this.tauntLoop();
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
  // protected manaShieldLoop(): void {
  //   if (isAvailable("mshield")) {
  //     use_skill("mshield");
  //     reduce_cooldown("mshield", Math.min(...parent.pings));
  //   }
  //   setTimeout(() => {
  //     this.manaShieldLoop();
  //   }, getCooldownMS("mshield"));
  // }
}

const paladin = new Paladin();
export { paladin };
