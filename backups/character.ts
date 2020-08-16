import FastPriorityQueue from "fastpriorityqueue";
import {
  Entity,
  IPosition,
  ItemName,
  ItemInfo,
  SlotType,
  MonsterName,
  PositionReal,
  NPCName,
  SkillName,
  CharacterEntity,
  CharacterType,
  TradeSlotType,
} from "./definitions/adventureland";
import {
  findItems,
  getInventory,
  getRandomMonsterSpawn,
  getCooldownMS,
  isAvailable,
  calculateDamageRange,
  isInventoryFull,
  getPartyMemberTypes,
  getVisibleMonsterTypes,
  getEntities,
} from "./functions";
import {
  TargetPriorityList,
  InventoryItemInfo,
  ItemLevelInfo,
  PriorityEntity,
  MovementTarget,
  PartyInfo,
  PlayersInfo,
  NPCInfo,
  MonstersInfo,
} from "./definitions/bots";
import { dismantleItems, buyPots } from "./trade";
// import { AStarSmartMove } from "./astarsmartmove"
import {
  getPartyInfo,
  setPartyInfo,
  getPlayersInfo,
  setPlayersInfo,
  getNPCInfo,
  setNPCInfo,
  getMonstersInfo,
  setMonstersInfo,
} from "./info";
import { NGraphMove } from "./ngraphmove";
import "rxjs";
import { Observable, of } from "rxjs";
import e from "express";
import { store } from "./store/configure-store";

export abstract class Character {
  /** A list of monsters, priorities, and locations to farm. */
  public abstract targetPriority: TargetPriorityList;

  /** The default target if there's nothing else to attack */
  protected abstract mainTarget: MonsterName = "goo";

  actualMainTarget: Entity;

  // protected astar = new AStarSmartMove()
  protected nGraphMove: NGraphMove;

  protected itemsToKeep: ItemName[] = [
    // General
    "computer",
    "tracker",
    // Boosters
    "goldbooster",
    "luckbooster",
    "xpbooster",
    // Healing
    "hpot1",
    "mpot1",
    // Consumables
    /* "candypop", "hotchocolate", */
    // Orbs
    "jacko",
    "lantern",
    "orbg",
    "test_orb",
  ];
  protected itemsToSell: ItemLevelInfo = {
    // Default clothing
    shoes: 2,
    pants: 2,
    coat: 2,
    helmet: 2,
    gloves: 2,
    // Common & useless stuff
    cclaw: 2,
    hpamulet: 1,
    hpbelt: 1,
    ringsj: 1,
    vitearring: 1,
    vitring: 1,
  };
  protected itemsToDismantle: ItemLevelInfo = {};
  protected itemsToExchange: Set<ItemName> = new Set([
    // General exchangables
    "5bucks",
    "gem0",
    "gem1",
    // Seashells for potions
    "seashell",
    // Leather for capes
    "leather",
    // Christmas
    "candycane",
    "mistletoe",
    "ornament",
    // Halloween
    "candy0",
    "candy1",
    // Chinese New Year's
    "redenvelopev3",
    // Easter
    "basketofeggs",
    // Boxes
    "armorbox",
    "bugbountybox",
    "gift0",
    "gift1",
    "mysterybox",
    "weaponbox",
    "xbox",
  ]);
  protected itemsToBuy: Set<ItemName> = new Set([
    // Exchangables
    ...this.itemsToExchange,
    // Belts
    "dexbelt",
    "intbelt",
    "strbelt",
    // Rings
    "ctristone",
    "dexring",
    "intring",
    "ringofluck",
    "strring",
    "suckerpunch",
    "tristone",
    // Earrings
    "dexearring",
    "intearring",
    "lostearring",
    "strearring",
    // Amulets
    "amuletofm",
    "dexamulet",
    "intamulet",
    "snring",
    "stramulet",
    "t2dexamulet",
    "t2intamulet",
    "t2stramulet",
    // Orbs
    "charmer",
    "ftrinket",
    "jacko",
    "orbg",
    "orbofdex",
    "orbofint",
    "orbofsc",
    "orbofstr",
    "rabbitsfoot",
    "talkingskull",
    // Shields
    "t2quiver",
    "lantern",
    "mshield",
    "quiver",
    "sshield",
    "xshield",
    // Capes
    "angelwings",
    "bcape",
    "cape",
    "ecape",
    "stealthcape",
    // Shoes
    /*"eslippers",*/ "hboots",
    "mrnboots",
    "mwboots",
    "shoes1",
    "wingedboots",
    "xboots",
    // Pants
    "hpants",
    "mrnpants",
    "mwpants",
    "pants1",
    "starkillers",
    "xpants",
    // Armor
    "cdragon",
    "coat1",
    "harmor",
    "mcape",
    "mrnarmor",
    "mwarmor",
    "tshirt0",
    "tshirt1",
    "tshirt2",
    "tshirt3",
    "tshirt4",
    "tshirt6",
    "tshirt7",
    "tshirt8",
    "tshirt88",
    "tshirt9",
    "warpvest",
    "xarmor",
    // Helmets
    "eears",
    "fury",
    "helmet1",
    "hhelmet",
    "mrnhat",
    "mwhelmet",
    "partyhat",
    "rednose",
    "xhelmet",
    // Gloves
    "gloves1",
    "goldenpowerglove",
    "handofmidas",
    "hgloves",
    "mrngloves",
    "mwgloves",
    "poker",
    "powerglove",
    "xgloves",
    // Good weapons
    "basher",
    "bataxe",
    "bowofthedead",
    "candycanesword",
    "carrotsword",
    "crossbow",
    "dartgun",
    "firebow",
    "frostbow",
    "froststaff",
    "gbow",
    "harbringer",
    "hbow",
    "merry",
    "oozingterror",
    "ornamentstaff",
    "pmace",
    "t2bow",
    "t3bow",
    "wblade",
    // Things we can exchange / craft with
    "ascale",
    "bfur",
    "cscale",
    "electronics",
    "feather0",
    "fireblade",
    "goldenegg",
    "goldingot",
    "goldnugget",
    "leather",
    "networkcard",
    "platinumingot",
    "platinumnugget",
    "pleather",
    "snakefang",
    // Things to make xbox
    "x0",
    "x1",
    "x2",
    "x3",
    "x4",
    "x5",
    "x6",
    "x7",
    "x8",
    // Things to make easter basket
    "egg0",
    "egg1",
    "egg2",
    "egg3",
    "egg4",
    "egg5",
    "egg6",
    "egg7",
    "egg8",
    // Essences
    "essenceofether",
    "essenceoffire",
    "essenceoffrost",
    "essenceoflife",
    "essenceofnature",
    // Potions & consumables
    "bunnyelixir",
    "candypop",
    "elixirdex0",
    "elixirdex1",
    "elixirdex2",
    "elixirint0",
    "elixirint1",
    "elixirint2",
    "elixirluck",
    "elixirstr0",
    "elixirstr1",
    "elixirstr2",
    "greenbomb",
    "hotchocolate",
    // High level scrolls
    "cscroll3",
    "scroll3",
    "scroll4",
    // Misc. Things
    "bottleofxp",
    "bugbountybox",
    "monstertoken",
    "poison",
    "snakeoil",
  ]);

  /** Set to true to stop movement */
  public holdPosition = false;

  /** Set to true to stop attacks. We might still attack if the target is attacking us. */
  public holdAttack = false;

  public movementTarget: MovementTarget;
  public character$: Observable<CharacterEntity>;

  protected async mainLoop(): Promise<void> {
    setTimeout(async () => {
      loot();
      this.attackLoop();
      this.mainLoop();
    }, Math.max(250, parent.character.ping));
  }

  public async run(): Promise<void> {
    // await this.lootSetup();
    // await this.infoSetup();
    // this.infoLoop();
    // this.healLoop();
    // this.scareLoop();
    // await this.moveSetup();
    // this.moveLoop();
    this.mainLoop();
  }

  protected async lootSetup(): Promise<void> {
    parent.socket.on(
      "drop",
      (data: { id: string; chest: string } & IPosition) => {
        // if (distance(parent.character, data) > 800) return; // Chests over a 800 radius have a penalty as per @Wizard in #feedback (Discord) on 11/26/2019
        // const party: PartyInfo = getPartyInfo();

        // let shouldLoot = true;
        // for (const id of parent.party_list) {
        //   if (id == parent.character.id) continue; // Skip ourself

        //   const partyMember = parent.entities[id];
        //   if (!partyMember) continue;
        //   if (distance(partyMember, data) > 800) continue;
        //   if (!party[id]) continue;

        //   if (["chest3", "chest4"].includes(data.chest)) {
        //     if (parent.character.goldm >= party[id].goldm) continue;
        //   } else {
        //     if (parent.character.luckm >= party[id].luckm) continue;
        //   }

        //   shouldLoot = false;
        //   break;
        // }

        // if (shouldLoot) {
        parent.socket.emit("open_chest", { id: data.id });
        // }
      }
    );
  }

  protected async infoSetup(): Promise<void> {
    // Setup death timers for special monsters
    game.on("hit", (data: { target: string; kill?: boolean }) => {
      if (!data.kill) return; // We only care if the entity dies
      const entity = parent.entities[data.target];

      if (
        entity &&
        entity.mtype &&
        ["fvampire", "greenjr", "jr", "mvampire"].includes(entity.mtype) &&
        G.monsters[entity.mtype].respawn &&
        G.monsters[entity.mtype].respawn > 0
      ) {
        // For >200 second respawn monsters, the variance is from 0.6 to 2.2 of their base time
        // https://discordapp.com/channels/238332476743745536/238332476743745536/729997473484898327
        const wait = G.monsters[entity.mtype].respawn * 2.2 * 1000;

        // DEBUG
        console.info(`Setting respawn timer for ${entity.mtype} for ${wait}ms`);

        setTimeout(async () => {
          // Create a fake entity to appear when the respawn is up
          const info = getMonstersInfo();
          info[entity.mtype] = {
            id: "-1",
            lastSeen: new Date(),
            map: entity.map,
            x: entity.real_x,
            y: entity.real_y,
          };
          setMonstersInfo(info);
        }, wait);
      }
    });
  }

  /**
   * Stores information
   */
  protected async infoLoop(): Promise<void> {
    // Add info about ourselves
    const party: PartyInfo = getPartyInfo();
    party[parent.character.name] = {
      lastSeen: new Date(),
      items: getInventory(),
      attack: parent.character.attack,
      frequency: parent.character.frequency,
      goldm: parent.character.goldm,
      last_ms: parent.character.last_ms,
      luckm: parent.character.luckm,
      map: parent.character.map,
      x: parent.character.real_x,
      y: parent.character.real_y,
      s: parent.character.s,
    };
    setPartyInfo(party);

    // Add info about other players we see
    const players: PlayersInfo = getPlayersInfo();
    let changed = false;
    for (const player of getEntities({
      isPlayer: true,
      isPartyMember: false,
    }) as CharacterEntity[]) {
      players[player.id] = {
        lastSeen: new Date(),
        rip: player.rip,
        map: player.map,
        x: player.real_x,
        y: player.real_y,
        s: player.s,
        ctype: player.ctype,
      };
      changed = true;
    }
    if (changed) setPlayersInfo(players);

    // Add info about NPCs
    const npcs: NPCInfo = getNPCInfo();
    changed = false;
    for (const npc of ["Angel", "Kane"] as NPCName[]) {
      if (!parent.entities[npc]) continue;
      npcs[npc] = {
        lastSeen: new Date(),
        map: parent.entities[npc].map,
        x: parent.entities[npc].real_x,
        y: parent.entities[npc].real_y,
      };
      changed = true;
    }
    if (changed) setNPCInfo(npcs);

    // Add info about Monsters
    const monsters = getMonstersInfo();
    changed = false;
    for (const entity of getEntities({ isMonster: true, isRIP: false })) {
      if (
        ![
          "fvampire",
          "goldenbat",
          "greenjr",
          "jr",
          "mvampire",
          /*"phoenix",*/ "pinkgoo",
          "snowman",
          "wabbit",
        ].includes(entity.mtype)
      )
        continue;
      monsters[entity.mtype] = {
        lastSeen: new Date(),
        id: entity.id,
        x: entity.real_x,
        y: entity.real_y,
        map: entity.map,
      };
      changed = true;
    }
    if (changed) setMonstersInfo(monsters);

    setTimeout(() => {
      this.infoLoop();
    }, 2000);
  }

  public getMonsterHuntTargets(): MonsterName[] {
    const types: MonsterName[] = [];
    let leastTimeRemaining = Number.MAX_VALUE;
    const party: PartyInfo = getPartyInfo();
    for (const memberName of parent.party_list) {
      // NOTE: TODO: Gonna check if not checking parent.entities improves the lagginess when we are between monster hunts.
      // const member = parent.entities[memberName] ? parent.entities[memberName] : this.info.party[memberName]
      const member = party[memberName];
      if (!member) continue; // No information yet
      if (!member.s.monsterhunt || member.s.monsterhunt.c == 0) continue; // Character doesn't have a monster hunt, or it's (almost) finished
      if (!this.targetPriority[member.s.monsterhunt.id]) continue; // Not in our target priority

      // Check if we can co-op
      const coop = this.targetPriority[member.s.monsterhunt.id].coop;
      if (coop) {
        const availableTypes = getPartyMemberTypes();
        const missingTypes = coop.filter((x) => !availableTypes.has(x));
        if (missingTypes.length) continue;
      }

      // TODO: Check if we can do enough damage to complete the monster hunt in the given time

      // Sort by time left.
      // TODO: Improve prioritization. For example, frogs are easy, so do them first
      const timeLeft =
        member.s.monsterhunt.ms - (Date.now() - member.last_ms.getTime());
      if (timeLeft < leastTimeRemaining) {
        leastTimeRemaining = timeLeft;
        types.unshift(member.s.monsterhunt.id);
      } else {
        types.push(member.s.monsterhunt.id);
      }
    }

    return types;
  }

  public shouldSwitchServer(): boolean {
    if (parent.character.ctype == "merchant") return true; // Merchants don't get to decide

    if (!parent.character.s.monsterhunt) return false; // We don't have a monster hunt
    if (parent.character.s.monsterhunt.c == 0) return false; // We have a monster hunt to turn in
    // if (this.getMonsterHuntTargets().length) return false; // There's a monster hunt we could do

    // Doable event monster
    for (const monster in parent.S) {
      if (monster == "grinch") continue; // The grinch is too strong.
      if (
        parent.S[monster as MonsterName].hp /
          parent.S[monster as MonsterName].max_hp >
        0.9
      )
        continue; // Still at a high HP
      if (!parent.S[monster as MonsterName].live) continue;
      if (this.targetPriority[monster as MonsterName]) return false; // We can do an event monster!
    }

    return true;
  }

  protected async attackLoop(): Promise<void> {
    if (parent.character.rip || parent.character.moving) {
      return;
    }
    try {
      const currentTarget = get_nearest_monster({
        mtype: this.mainTarget,
      });
      if (currentTarget && can_attack(currentTarget)) {
        await attack(currentTarget);
        reduce_cooldown("attack", parent.character.ping);
      } else {
        move(
          parent.character.x + (currentTarget.x - parent.character.x) / 2,

          parent.character.y + (currentTarget.y - parent.character.y) / 2
        );
      }
    } catch (error) {
      if (error.reason == "cooldown") {
        setTimeout(async () => {
          this.attackLoop();
        }, Math.min(...parent.pings) - error.remaining);
        return;
      } else if (!["not_found", "disabled"].includes(error.reason)) {
        console.error(error);
      }
      setTimeout(async () => {
        this.attackLoop();
      }, getCooldownMS("attack"));
      return;
    }
    setTimeout(async () => {
      this.attackLoop();
    }, getCooldownMS("attack", true));
  }

  protected scareLoop(): void {
    try {
      const targets = getEntities({
        isAttackingUs: true,
        isMonster: true,
        isRIP: false,
      });
      let wantToScare = false;
      if (targets.length >= 3) {
        // We have 3 or more monsters attacking us
        wantToScare = true;
      } else if (targets.length && parent.character.s.burned) {
        // Scare monsters away if we are burned
        wantToScare = true;
      } else if (targets.length && !this.targetPriority[targets[0].mtype]) {
        // A monster we don't want to attack is targeting us
        wantToScare = true;
      } else if (
        parent.character.c.town && // We're teleporting to town (attacks will disrupt it)
        (targets.length > 1 || // We have things attacking us
          (targets.length == 1 &&
            distance(targets[0], parent.character) -
              targets[0].range -
              targets[0].speed *
                2)) /* The enemy can move to attack us before we can teleport away */
      ) {
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

  protected getMovementLocation(mtype: MonsterName): PositionReal {
    if (!this.targetPriority[mtype]) return; // Not a target we want to move to
    if (
      this.targetPriority[mtype].farmingPosition &&
      this.targetPriority[mtype].holdPositionFarm
    )
      return this.targetPriority[mtype].farmingPosition; // We have a specific position to farm these monsters
    if (getVisibleMonsterTypes().has(mtype)) return; // There's one nearby, we don't need to move
    if (this.targetPriority[mtype].farmingPosition) {
      if (
        distance(parent.character, this.targetPriority[mtype].farmingPosition) <
        parent.character.range
      ) {
        return; // We're nearby killing other things while we wait for whatever it is to respawn
      } else {
        return this.targetPriority[mtype].farmingPosition; // We're not nearby, let's go to the farming position
      }
    }
    if (parent.S[mtype]) {
      if (!parent.S[mtype].live) return; // Not live
      return parent.S[mtype]; // Special monster
    }

    const randomSpawn = getRandomMonsterSpawn(mtype);
    if (randomSpawn) return randomSpawn;
  }

  protected getMovementTarget(): MovementTarget {
    if (parent.character.rip) {
      set_message("RIP");
      return;
    }

    //// Movement targets
    // Finish Monster Hunt -- Visit the monsterhunter and turn it in
    // if (
    //   parent.character.s.monsterhunt &&
    //   parent.character.s.monsterhunt.c == 0
    // ) {
    //   set_message("Finish MH");
    //   return {
    //     target: "monsterhunter",
    //     position: G.maps.main.ref.monsterhunter,
    //     range: 300,
    //   };
    // }

    // Rare Monsters -- Move to monster
    for (const entity of getEntities({ isMonster: true, isRIP: false })) {
      if (
        ![
          "fvampire",
          "goldenbat",
          "greenjr",
          "jr",
          "mvampire",
          "phoenix",
          "pinkgoo",
          "snowman",
          "wabbit",
        ].includes(entity.mtype)
      )
        continue;
      if (!this.targetPriority[entity.mtype]) continue; // Not a target
      set_message(entity.mtype);
      return {
        target: entity.mtype,
        position: entity,
        range: parent.character.range,
      };
    }

    // Special Monsters -- Move to monster
    const party = getPartyInfo();
    const monsters = getMonstersInfo();
    for (const mtype in monsters) {
      if (!this.targetPriority[mtype as MonsterName]) continue; // Not a target we can do

      const info = monsters[mtype as MonsterName];

      const coop = this.targetPriority[mtype as MonsterName].coop;
      if (coop) {
        // Check if other members are available to fight it
        const memberTypes = getPartyMemberTypes();
        const notReady = coop.filter((x) => !memberTypes.has(x));
        if (notReady.length > 0) {
          continue; // We don't have everyone we need to fight, so we're not going to fight it.
        }
      }

      // Update info if we can see it
      const entityInfo = parent.entities[info.id];
      if (entityInfo) {
        info.x = entityInfo.real_x;
        info.y = entityInfo.real_y;
      }

      if (
        distance(parent.character, info) < parent.character.range * 2 &&
        !entityInfo
      ) {
        // We got close to it, but we can't see it...
        delete monsters[mtype as MonsterName];
        setMonstersInfo(monsters);
      } else {
        set_message(`SP ${mtype}`);
        if (
          this.targetPriority[mtype as MonsterName].farmingPosition &&
          this.targetPriority[mtype as MonsterName].holdPositionFarm
        ) {
          return {
            target: mtype as MonsterName,
            position: this.targetPriority[mtype as MonsterName].farmingPosition,
            range: parent.character.range,
          };
        } else {
          return {
            target: mtype as MonsterName,
            position: info,
            range: parent.character.range,
          };
        }
      }
    }

    // Christmas Tree Bonus -- Visit the tree if it's up and we don't have it
    if (G.maps.main.ref.newyear_tree && !parent.character.s.holidayspirit) {
      set_message("Xmas Tree");
      return {
        target: "newyear_tree",
        position: G.maps.main.ref.newyear_tree,
        range: 300,
      };
    }

    // Full Inventory -- Dump on merchant
    if (isInventoryFull()) {
      set_message("Full!");
      return {
        target: "merchant",
        position: { map: "main", x: 60, y: -325 },
        range: 300,
      };
    }

    // Event Monsters -- Move to monster
    for (const mtype in parent.S) {
      if (!parent.S[mtype as MonsterName].live) continue; // Not alive
      if (!this.targetPriority[mtype as MonsterName]) continue; // Not a target
      set_message(mtype);
      return {
        target: mtype as MonsterName,
        position: parent.S[mtype as MonsterName],
        range: parent.character.range,
      };
    }

    // Monster Hunts -- Move to monster
    const monsterHuntTargets: MonsterName[] = this.getMonsterHuntTargets();
    for (const potentialTarget of monsterHuntTargets) {
      const coop = this.targetPriority[potentialTarget].coop;
      if (coop) {
        // Check if other members are fighting it, too
        const readyMembers = new Set<CharacterType>();
        for (const memberName of parent.party_list) {
          if (!party[memberName] || !party[memberName].monsterHuntTargets)
            continue;
          if (party[memberName].monsterHuntTargets[0] != potentialTarget)
            continue;

          readyMembers.add(parent.party[memberName].type);
        }
        const notReady = coop.filter((x) => !readyMembers.has(x));
        if (notReady.length == 0) {
          set_message(`MH ${potentialTarget}`);
          return {
            target: potentialTarget,
            position: this.getMovementLocation(potentialTarget),
          };
        }
      } else {
        set_message(`MH ${potentialTarget}`);
        return {
          target: potentialTarget,
          position: this.getMovementLocation(potentialTarget),
        };
      }
    }

    const nodes = [];
    this.nGraphMove.graph.forEachNode((node) => {
      nodes.push(node.id, node.data);
    });

    // Monster Hunts -- New monster hunt
    // if (!parent.character.s.monsterhunt) {
    //   set_message("New MH");
    //   return {
    //     target: "monsterhunter",
    //     position: G.maps.main.ref.monsterhunter,
    //     range: 300,
    //   };
    // }

    // TODO: Kane and Angel

    if (this.mainTarget) {
      set_message(this.mainTarget);
      return {
        target: this.mainTarget,
        position: this.getMovementLocation(this.mainTarget),
      };
    }
  }

  protected async moveSetup(): Promise<void> {
    try {
      // Prepare the pathfinder
      const before = Date.now();
      this.nGraphMove = await NGraphMove.getInstance();
      console.info(`Took ${Date.now() - before}ms to prepare pathfinding.`);

      // Event to scramble characters if we take stacked damage
      character.on("stacked", () => {
        // DEBUG
        console.info(
          `Scrambling ${parent.character.id} because we're stacked!`
        );

        const x = -25 + Math.round(50 * Math.random());
        const y = -25 + Math.round(50 * Math.random());
        move(parent.character.real_x + x, parent.character.real_y + y);
      });
    } catch (e) {
      console.error(e);
    }
  }

  // protected moveLoop(): void {
  //   try {
  //     if (this.holdPosition || smart.moving) {
  //       setTimeout(() => {
  //         this.moveLoop();
  //       }, Math.max(1000, parent.character.ping));
  //       return;
  //     }

  //     // Move to our target (this is to get us in the general vicinity, we will do finer movements within that later)
  //     const lastMovementTarget = this.movementTarget;
  //     this.movementTarget = this.getMovementTarget();
  //     if (this.movementTarget && this.movementTarget.position) {
  //       if (
  //         !lastMovementTarget ||
  //         this.movementTarget.target != lastMovementTarget.target
  //       ) {
  //         // New movement target
  //         // this.astar.stop()
  //         this.nGraphMove.stop();
  //         // this.astar.smartMove(this.movementTarget.position, this.movementTarget.range)
  //         this.nGraphMove.move(
  //           this.movementTarget.position,
  //           this.movementTarget.range
  //         );
  //         setTimeout(() => {
  //           this.moveLoop();
  //         }, Math.max(1000, parent.character.ping));
  //         return;
  //       }

  //       // if (!this.astar.isMoving()) {
  //       if (!this.nGraphMove.isMoving()) {
  //         // Same monster, new movement target
  //         // this.astar.smartMove(this.movementTarget.position, this.movementTarget.range)
  //         this.nGraphMove.move(
  //           this.movementTarget.position,
  //           this.movementTarget.range
  //         );
  //         setTimeout(() => {
  //           this.moveLoop();
  //         }, Math.max(1000, parent.character.ping));
  //         return;
  //       }
  //     }

  //     // Stop on sight
  //     const targets = this.getTargets(1);
  //     if (
  //       targets.length &&
  //       targets[0].mtype == this.movementTarget.target &&
  //       this.targetPriority[targets[0].mtype] &&
  //       !this.targetPriority[targets[0].mtype].holdPositionFarm
  //     ) {
  //       // this.astar.stop()
  //       this.nGraphMove.stop();
  //     }
  //     const targeted = get_targeted_monster();
  //     if (targeted && targeted.rip) {
  //       change_target(null, true);
  //       // this.astar.stop()
  //       this.nGraphMove.stop();
  //     }

  //     // Don't do anything if we're moving around
  //     // if (this.astar.isMoving()) {
  //     if (this.nGraphMove.isMoving()) {
  //       setTimeout(() => {
  //         this.moveLoop();
  //       }, Math.max(1000, parent.character.ping));
  //       return;
  //     }

  //     // Don't do anything if we're holding position for this monster
  //     if (
  //       this.targetPriority[this.movementTarget.target as MonsterName] &&
  //       this.targetPriority[this.movementTarget.target as MonsterName]
  //         .holdPositionFarm
  //     ) {
  //       setTimeout(() => {
  //         this.moveLoop();
  //       }, Math.max(1000, parent.character.ping));
  //       return;
  //     }

  //     // const monsterTypes = Object.keys(this.targetPriority) as MonsterType[]
  //     // const inEnemyAttackRange2 = getEntities({ isRIP: false, canAttackUsWithoutMoving: true, isMonsterType: monsterTypes })
  //     // const inAggroRange2 = getEntities({ isRIP: false, isWithinDistance: 50, isMonsterType: monsterTypes })
  //     // const inAttackRange2 = getEntities({ isRIP: false, isWithinDistance: parent.character.range, isMonsterType: monsterTypes })
  //     // const inAttackRangeHighPriority2 = getEntities({ isRIP: false, isWithinDistance: parent.character.range, isMonsterType: [this.movementTarget.target as MonsterType] })
  //     // const inExtendedAttackRange2 = getEntities({ isRIP: false, isWithinDistance: parent.character.range * 2, isMonsterType: monsterTypes })
  //     // const inExtendedAttackRangeHighPriority2 = getEntities({ isRIP: false, isWithinDistance: parent.character.range * 2, isMonsterType: [this.movementTarget.target as MonsterType] })
  //     // const visible2 = getEntities({ isRIP: false, isMonsterType: monsterTypes })
  //     // const visibleHighPriority2 = getEntities({ isRIP: false, isMonsterType: [this.movementTarget.target as MonsterType] })

  //     // Get all enemies
  //     const inEnemyAttackRange: Entity[] = [];
  //     const inAggroRange: Entity[] = [];
  //     const inAttackRange: Entity[] = [];
  //     const inAttackRangeHighPriority: PositionReal[] = [];
  //     const inExtendedAttackRange: PositionReal[] = [];
  //     const inExtendedAttackRangeHighPriority: PositionReal[] = [];
  //     const visible: PositionReal[] = [];
  //     const visibleHighPriority: PositionReal[] = [];
  //     for (const id in parent.entities) {
  //       const entity = parent.entities[id];
  //       if (entity.rip) continue; // It's dead
  //       if (!this.targetPriority[entity.mtype]) continue; // It's not on our target list
  //       const d = distance(parent.character, entity);
  //       const enemyRange = Math.max(entity.range + entity.speed, 50);

  //       if (
  //         enemyRange < parent.character.range && // Enemy range is less than our range
  //         d < enemyRange // We are within the enemy range
  //       ) {
  //         if (
  //           entity.hp > calculateDamageRange(parent.character, entity)[0] ||
  //           this.targetPriority[entity.mtype].holdAttackInEntityRange ||
  //           entity.target == parent.character.name
  //         ) {
  //           inEnemyAttackRange.push(entity); // We can run away from it
  //         }
  //       }

  //       if (!entity.target && d < 50) {
  //         inAggroRange.push(entity);
  //       }

  //       if (d < parent.character.range) {
  //         inAttackRange.push(entity); // We don't have to move to attack these targets
  //         if (this.movementTarget.target == entity.mtype)
  //           inAttackRangeHighPriority.push(entity);
  //       } else if (d < parent.character.range * 2) {
  //         inExtendedAttackRange.push(entity); // We can move to these targets while still attacking our current target
  //         if (this.movementTarget.target == entity.mtype)
  //           inExtendedAttackRangeHighPriority.push(entity);
  //       }

  //       visible.push(entity); // We can see these targets nearby
  //       if (this.movementTarget.target == entity.mtype)
  //         visibleHighPriority.push(entity);
  //     }

  //     // Get out of enemy range
  //     if (inEnemyAttackRange.length) {
  //       const average: IPosition = {
  //         x: 0,
  //         y: 0,
  //       };
  //       let maxRange = 0;
  //       for (const v of inEnemyAttackRange) {
  //         average.x += v.real_x;
  //         average.y += v.real_y;
  //         if (v.range + v.speed > maxRange) {
  //           maxRange = v.range + v.speed;
  //         }
  //       }
  //       average.x /= inEnemyAttackRange.length;
  //       average.y /= inEnemyAttackRange.length;

  //       const angle: number = Math.atan2(
  //         parent.character.real_y - average.y,
  //         parent.character.real_x - average.x
  //       );
  //       const moveDistance: number = Math.min(
  //         parent.character.range,
  //         maxRange * 1.5
  //       );
  //       const calculateEscape = (
  //         angle: number,
  //         moveDistance: number
  //       ): IPosition => {
  //         const x = Math.cos(angle) * moveDistance;
  //         const y = Math.sin(angle) * moveDistance;
  //         return {
  //           x: parent.character.real_x + x,
  //           y: parent.character.real_y + y,
  //         };
  //       };
  //       let escapePosition = calculateEscape(angle, moveDistance);
  //       let angleChange = 0;
  //       //while (!this.nGraphMove.canMove({ map: parent.character.map, x: parent.character.real_x, y: parent.character.real_y }, { map: parent.character.map, x: escapePosition.x, y: escapePosition.y }) && angleChange < 180) {
  //       while (
  //         !can_move_to(escapePosition.x, escapePosition.y) &&
  //         angleChange < 180
  //       ) {
  //         if (angleChange <= 0) {
  //           angleChange = -angleChange + 1;
  //         } else {
  //           angleChange = -angleChange;
  //         }
  //         escapePosition = calculateEscape(
  //           angle + (angleChange * Math.PI) / 180,
  //           moveDistance
  //         );
  //       }

  //       move(escapePosition.x, escapePosition.y);
  //       setTimeout(() => {
  //         this.moveLoop();
  //       }, Math.max(400, parent.character.ping));
  //       return;
  //     }

  //     // TODO: 2. move out of the way of enemies in aggro range ()

  //     // 3. Don't move if there's a monster we can attack from our current position
  //     if (inAttackRangeHighPriority.length) {
  //       setTimeout(() => {
  //         this.moveLoop();
  //       }, Math.max(400, parent.character.ping));
  //       return;
  //     }

  //     // TODO: 4. Optimize movement. Start moving towards a 2nd monster while we are killing the 1st monster.

  //     // 5. Move to our target monster
  //     if (visibleHighPriority.length) {
  //       let closest: PositionReal;
  //       let d = Number.MAX_VALUE;
  //       for (const v of visibleHighPriority) {
  //         const vD = distance(parent.character, v);
  //         if (vD < d) {
  //           d = vD;
  //           closest = v;
  //         }
  //       }
  //       // this.astar.smartMove(closest, parent.character.range)
  //       this.nGraphMove.move(closest, parent.character.range);
  //       setTimeout(() => {
  //         this.moveLoop();
  //       }, Math.max(400, parent.character.ping));
  //       return;
  //     }

  //     // 6. Move to any monster
  //     if (visible.length) {
  //       let closest: PositionReal;
  //       let d = Number.MAX_VALUE;
  //       for (const v of visible) {
  //         const vD = distance(parent.character, v);
  //         if (vD < d) {
  //           d = vD;
  //           closest = v;
  //         }
  //       }
  //       // this.astar.smartMove(closest, parent.character.range)
  //       this.nGraphMove.move(closest, parent.character.range);
  //       setTimeout(() => {
  //         this.moveLoop();
  //       }, Math.max(400, parent.character.ping));
  //       return;
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  //   setTimeout(() => {
  //     this.moveLoop();
  //   }, Math.max(400, parent.character.ping));
  // }

  protected async healLoop(): Promise<void> {
    try {
      if (parent.character.rip) {
        // Respawn if we're dead
        respawn();
        setTimeout(() => {
          this.healLoop();
        }, getCooldownMS("use_town"));
        return;
      } else if (!isAvailable("use_hp")) {
        setTimeout(() => {
          this.healLoop();
        }, getCooldownMS("use_hp"));
        return;
      }

      const hpPots: ItemName[] = ["hpot0", "hpot1"];
      const mpPots: ItemName[] = ["mpot0", "mpot1"];
      let useMpPot: ItemInfo = null;
      let useHpPot: ItemInfo = null;

      // TODO: find last potion in inventory
      for (let i = parent.character.items.length - 1; i >= 0; i--) {
        const item = parent.character.items[i];
        if (!item) continue;

        if (!useHpPot && hpPots.includes(item.name)) {
          // This is the HP Pot that will be used
          useHpPot = item;
        } else if (!useMpPot && mpPots.includes(item.name)) {
          // This is the MP Pot that will be used
          useMpPot = item;
        }

        if (useHpPot && useMpPot) {
          // We've found the last two pots we're using
          break;
        }
      }

      const hpRatio = parent.character.hp / parent.character.max_hp;
      const mpRatio = parent.character.mp / parent.character.max_mp;
      if (
        hpRatio <= mpRatio &&
        hpRatio != 1 &&
        (!useHpPot ||
          (useHpPot.name == "hpot0" &&
            (parent.character.hp <= parent.character.max_hp - 200 ||
              parent.character.hp < 50)) ||
          (useHpPot.name == "hpot1" &&
            (parent.character.hp <= parent.character.max_hp - 400 ||
              parent.character.hp < 50)))
      ) {
        use_skill("use_hp");
        reduce_cooldown("use_hp", Math.min(...parent.pings));
        reduce_cooldown("use_mp", Math.min(...parent.pings));
      } else if (
        mpRatio != 1 &&
        (!useMpPot ||
          (useMpPot.name == "mpot0" &&
            (parent.character.mp <= parent.character.max_mp - 300 ||
              parent.character.mp < 50)) ||
          (useMpPot.name == "mpot1" &&
            (parent.character.mp <= parent.character.max_mp - 500 ||
              parent.character.mp < 50)))
      ) {
        use_skill("use_mp");
        reduce_cooldown("use_hp", Math.min(...parent.pings));
        reduce_cooldown("use_mp", Math.min(...parent.pings));
      } else if (hpRatio < mpRatio) {
        use_skill("regen_hp");
        reduce_cooldown("use_hp", Math.min(...parent.pings));
        reduce_cooldown("use_mp", Math.min(...parent.pings));
      } else if (mpRatio < hpRatio) {
        use_skill("regen_mp");
        reduce_cooldown("use_hp", Math.min(...parent.pings));
        reduce_cooldown("use_mp", Math.min(...parent.pings));
      }
    } catch (error) {
      console.error(error);
    }
    setTimeout(() => {
      this.healLoop();
    }, getCooldownMS("use_hp"));
  }

  public getNewYearTreeBuff(): void {
    if (!G.maps.main.ref.newyear_tree) return; // Event is not live.
    if (parent.character.s.holidayspirit) return; // We already have the buff.
    if (distance(parent.character, G.maps.main.ref.newyear_tree) > 400) return; // Too far away

    parent.socket.emit("interaction", { type: "newyear_tree" });
  }

  public getMonsterhuntQuest(): void {
    if (distance(parent.character, G.maps.main.ref.monsterhunter) > 400) return; // Too far away
    if (!parent.character.s.monsterhunt) {
      // No quest, get a new one
      parent.socket.emit("monsterhunt");
    } else if (parent.character.s.monsterhunt.c == 0) {
      // We've finished a quest
      parent.socket.emit("monsterhunt");
    }
  }

  public parseCM(characterName: string, data: any): void {
    if (
      !parent.party_list.includes(characterName) &&
      parent.character.name != characterName &&
      !["earthiverse", "earthMag", "earthMag2"].includes(
        characterName
      ) /* Hardcode party members */ &&
      !(
        data.message == "monster"
      ) /* NOTE: Special code to let Aria send Phoenix position CMs to my characters */
    ) {
      // Ignore messages from players not in our party
      game_log("Blocked CM from " + characterName);
      return;
    }

    if (data.message == "info") {
      const party: PartyInfo = getPartyInfo();
      party[characterName] = data.info;
      setPartyInfo(party);
    } else if (data.message == "monster") {
      /**
            let monster = get_targeted_monster()
            show_json(monster)
            send_cm("earthPri", {
                "message": "monster",
                "id": monster.mtype,
                "info": {
                    "id": monster.id,
                    "map": monster.map,
                    "x": monster.real_x,
                    "y": monster.real_y
                }
            })
             */
      const monsters = getMonstersInfo();
      monsters[data.id as MonsterName] = data.info;
      setMonstersInfo(monsters);
    } else if (data.message == "npc") {
      const npcs: NPCInfo = getNPCInfo();
      npcs[data.id as NPCName] = data.info;
      setNPCInfo(npcs);
    } else if (data.message == "player") {
      const players: PlayersInfo = getPlayersInfo();
      players[data.id] = data.info;
      setPlayersInfo(players);
    } else if (data.message == "chests") {
      for (const chestID in data.chests) {
        if (!parent.chests[chestID])
          parent.chests[chestID] = data.chests[chestID];
      }
    }
  }

  /** Looks for equipment in our inventory, and if it's more applicable to the current situation, equip it */
  public equipBetterItems(): void {
    try {
      const items = getInventory();

      // Equip the items we want for this monster
      if (
        this.movementTarget.target &&
        this.targetPriority[this.movementTarget.target as MonsterName]
      ) {
        for (const idealItem of this.targetPriority[
          this.movementTarget.target as MonsterName
        ].equip || []) {
          let hasItem = false;
          for (const slot in parent.character.slots) {
            const slotInfo = parent.character.slots[slot as SlotType];
            if (!slotInfo) continue;
            if (slotInfo.name == idealItem) {
              hasItem = true;
              break;
            }
          }
          if (!hasItem) {
            for (const item of items) {
              if (item.name == idealItem) {
                // If we're going to equip a 2 hand weapon, make sure nothing is in our offhand
                if (
                  G.classes[parent.character.ctype].doublehand[
                    G.items[idealItem].wtype
                  ]
                )
                  unequip("offhand");

                equip(item.index);
                break;
              }
            }
          }
        }
      }

      // Equip the most ideal items
      for (const slot in parent.character.slots) {
        let slotItem: ItemInfo = parent.character.slots[slot as SlotType];
        let betterItem: InventoryItemInfo;
        if (!slotItem) continue; // Nothing equipped in that slot
        for (const item of items) {
          if (item.name != slotItem.name) continue; // Not the same item
          if (!item.level || item.level <= slotItem.level) continue; // Not better than the currently equipped item

          // We found something better
          slotItem = item;
          betterItem = item; // Overwrite the slot info, and keep looking
        }

        // Equip our better item
        if (betterItem) equip(betterItem.index, slot as SlotType);
      }
    } catch (error) {
      console.error(error);
    }
  }

  public wantToAttack(e: Entity, s: SkillName = "attack"): boolean {
    if (!isAvailable(s)) return false;

    if (parent.character.c.town) return false; // Teleporting to town

    let range = G.skills[s].range ? G.skills[s].range : parent.character.range;
    const distanceToEntity = distance(parent.character, e);
    if (G.skills[s].range_multiplier) range *= G.skills[s].range_multiplier;
    if (distanceToEntity > range) return false; // Too far away

    const mp = G.skills[s].mp ? G.skills[s].mp : parent.character.mp_cost;
    if (parent.character.mp < mp) return false; // Insufficient MP

    if (s != "attack" && e.immune) return false; // We can't damage it with non-attacks
    if (s != "attack" && e["1hp"]) return false; // We only do one damage, don't use special attacks

    if (!is_pvp() && e.type == "monster" && !this.targetPriority[e.mtype])
      return false; // Holding attacks against things not in our priority list

    if (!e.target) {
      // Hold attack
      if (this.holdAttack) return false; // Holding all attacks
      if (
        (smart.moving /*|| this.astar.isMoving()*/ ||
          this.nGraphMove.isMoving()) &&
        this.movementTarget &&
        this.movementTarget.target &&
        this.movementTarget.target != e.mtype &&
        this.targetPriority[e.mtype].holdAttackWhileMoving
      )
        return false; // Holding attacks while moving
      if (
        this.targetPriority[e.mtype].holdAttackInEntityRange &&
        distanceToEntity <= e.range
      )
        return false; // Holding attacks in range

      // Don't attack if we have it as a coop target, but we don't have everyone there.
      if (this.targetPriority[e.mtype].coop) {
        const availableTypes = [parent.character.ctype];
        for (const member of parent.party_list) {
          const e = parent.entities[member];
          if (!e) continue;
          if (e.rip) continue; // Don't add dead players
          if (e.ctype == "priest" && distance(parent.character, e) > e.range)
            continue; // We're not within range if we want healing
          availableTypes.push(e.ctype as CharacterType);
        }
        for (const type of this.targetPriority[e.mtype].coop) {
          if (!availableTypes.includes(type)) return false;
        }
      }

      // We are burned
      if (parent.character.s.burned) return false;

      // Low HP
      if (
        calculateDamageRange(e, parent.character)[1] * 5 * e.frequency >
          parent.character.hp &&
        (this.targetPriority[e.mtype].holdAttackInEntityRange ||
          distanceToEntity <= e.range)
      )
        return false;
    }

    return true;
  }
}
