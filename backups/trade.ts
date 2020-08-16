import { ItemName, NPCType, ItemInfo } from "./definitions/adventureland";
import {
  findItems,
  findItem,
  getInventory,
  findItemsWithLevel,
  sleep,
} from "./functions";
import { InventoryItemInfo, ItemLevelInfo } from "./definitions/bots";

export function sellUnwantedItems(itemsToSell: ItemLevelInfo): void {
  if (parent.character.map == "bank") return; // We can't do things in the bank
  if (!findItem("computer")) {
    let foundNPCBuyer = false;
    if (!G.maps[parent.character.map].npcs) return; // No NPCs on this map
    for (const npc of G.maps[parent.character.map].npcs.filter(
      (npc) => G.npcs[npc.id].role == "merchant"
    )) {
      if (
        distance(parent.character, {
          x: npc.position[0],
          y: npc.position[1],
        }) < 350
      ) {
        foundNPCBuyer = true;
        break;
      }
    }
    if (!foundNPCBuyer) return; // Can't sell things, nobody is near.
  }

  for (const item of getInventory()) {
    // Don't sell unique items
    if (item.p) continue;

    if (itemsToSell[item.name]) {
      if (item.level && item.level > itemsToSell[item.name]) continue; // Higher level than that which we want to sell automatically

      item.q ? sell(item.index, item.q) : sell(item.index, 1);
    }
  }
}

export function openMerchantStand(): void {
  const stand = findItem("stand0");
  if (!stand) return; // No stand available.

  if (parent.character.standed === undefined)
    // Checks if the stand is closed
    parent.open_merchant(stand.index);
}

export function closeMerchantStand(): void {
  if (parent.character.standed !== undefined)
    // Checks if the stand is open
    parent.close_merchant();
}

export function buyFromPonty(itemsToBuy: Set<ItemName>): void {
  let foundPonty = false;
  for (const npc of parent.npcs) {
    if (
      npc.id == "secondhands" &&
      distance(parent.character, {
        x: npc.position[0],
        y: npc.position[1],
      }) < 350
    ) {
      foundPonty = true;
      break;
    }
  }
  if (!foundPonty) return; // We're not near Ponty, so don't buy from him.

  // Set up the handler
  let itemsBought = 0;
  parent.socket.once("secondhands", (data: ItemInfo[]) => {
    for (let i = 0; i < data.length; i++) {
      if (itemsToBuy.has(data[i].name)) {
        // We want this item based on our list
        parent.socket.emit("sbuy", { rid: data[i].rid });
        if (++itemsBought >= 5) break; // Only buy a few items at a time to prevent maxing out server calls.
      } else if (data[i].p) {
        // Buy all shiny and glitched items
        parent.socket.emit("sbuy", { rid: data[i].rid });
        if (++itemsBought >= 5) break; // Only buy a few items at a time to prevent maxing out server calls.
      } else if (G.items[data[i].name].upgrade && data[i].level >= 8) {
        // Buy all high level upgradable items
        parent.socket.emit("sbuy", { rid: data[i].rid });
        if (++itemsBought >= 5) break; // Only buy a few items at a time to prevent maxing out server calls.
      } else if (G.items[data[i].name].compound && data[i].level >= 4) {
        // Buy all high level compoundable items
        parent.socket.emit("sbuy", { rid: data[i].rid });
        if (++itemsBought >= 5) break; // Only buy a few items at a time to prevent maxing out server calls.
      }
    }
  });

  // Attempt to buy stuff
  parent.socket.emit("secondhands");
}

export function transferItemsToMerchant(
  merchantName: string,
  itemsToKeep: ItemName[]
): void {
  const merchant = parent.entities[merchantName];
  if (!merchant) return; // No merchant nearby
  if (distance(parent.character, merchant) > 400) return; // Merchant is too far away to trade

  const itemsToKeepSet = new Set<ItemName>(itemsToKeep);

  const items = getInventory();
  items.sort((a, b) => {
    if (a.name < b.name) return -1; // 1. Sort by item name (alphabetical)
    if (a.name > b.name) return 1;
    if (a.level > b.level) return -1; // 2. Sort by item level (higher first)
  });

  for (const item of items) {
    if (itemsToKeepSet.has(item.name)) {
      // We want to keep this item, but we only need to keep one slot worth of this item, let's keep the highest level one around
      itemsToKeepSet.delete(item.name);
      continue;
    }

    if (item.q) {
      send_item(merchantName, item.index, item.q);
    } else {
      send_item(merchantName, item.index, 1);
    }
  }
}

export function transferGoldToMerchant(
  merchantName: string,
  minimumGold = 0
): void {
  if (parent.character.gold <= minimumGold) return; // Not enough gold
  const merchant = parent.entities[merchantName];
  if (!merchant) return; // No merchant nearby
  if (distance(parent.character, merchant) > 400) return; // Merchant is too far away to trade

  send_gold(merchantName, parent.character.gold - minimumGold);
}

// TODO: Add an agrument for a list of items to dismantle
export async function dismantleItems(
  itemsToDismantle: ItemLevelInfo
): Promise<void> {
  if (parent.character.map == "bank") return; // We can't do things in the bank
  if (!findItem("computer")) {
    let foundGuy = false;
    for (const npc of parent.npcs) {
      if (
        npc.id == "craftsman" &&
        distance(parent.character, {
          x: npc.position[0],
          y: npc.position[1],
        }) < 250
      ) {
        foundGuy = true;
        break;
      }
    }
    if (!foundGuy) return; // We're not near the dismantle guy
  }

  for (const itemName in itemsToDismantle) {
    if (parent.character.gold < G.dismantle[itemName as ItemName].cost)
      continue; // Not enough money to dismantle this item
    for (
      let itemLevel = itemsToDismantle[itemName as ItemName];
      itemLevel > 0;
      itemLevel--
    ) {
      const items = findItemsWithLevel(itemName as ItemName, itemLevel);
      for (const item of items) {
        parent.socket.emit("dismantle", { num: item.index });
        // TODO: Improve this
        await sleep(parent.character.ping);
      }
    }
  }
}

// TODO: Implement to only exchange items in our whitelist
export function exchangeItems(itemsToExchange: Set<ItemName>): void {
  if (parent.character.q.exchange) return; // Already exchanging something
  if (parent.character.map == "bank") return; // We can't do things in the bank

  const haveComputer = findItem("computer");
  const nearbyNPCs: NPCType[] = [];
  if (!haveComputer) {
    for (const npc of parent.npcs) {
      if (!npc.position) continue; // NPC doesn't have a position

      if (
        distance(parent.character, {
          x: npc.position[0],
          y: npc.position[1],
        }) < 250
      )
        nearbyNPCs.push(npc.id);
    }
    if (!nearbyNPCs.length) return;
  }

  const exchangableItems: { [T in NPCType]?: InventoryItemInfo[] } = {};
  for (const item of getInventory()) {
    const gInfo = G.items[item.name];
    const amountNeeded = gInfo.e;
    if (!amountNeeded || amountNeeded > item.q) continue; // Not exchangable, or not enough

    let npc: NPCType;
    if (gInfo.type == "quest") {
      if (gInfo.quest) {
        npc = G.quests[gInfo.quest].id;
      } else {
        npc = "exchange";
      }
    } else if (
      gInfo.type == "box" ||
      gInfo.type == "gem" ||
      gInfo.type == "misc"
    ) {
      npc = "exchange";
    } else if (item.name == "lostearring" && item.level == 2) {
      // NOTE: We're only exchanging level 2 earrings, because we want agile quivers
      npc = "pwincess";
    } else {
      continue;
    }

    // Add the item to our list of exchangable items
    if (!exchangableItems[npc]) exchangableItems[npc] = [];
    exchangableItems[npc].push(item);
  }

  for (const npc in exchangableItems) {
    if (!nearbyNPCs.includes(npc as NPCType) && !haveComputer) continue; // Not near
    // Exchange something!
    const item = exchangableItems[npc as NPCType][0];
    exchange(item.index);
    return; // We can only exchange one item at a time
  }
}

export async function buyPots(): Promise<void> {
  if (parent.character.map == "bank") return; // We can't do things in the bank
  if (!findItem("computer")) {
    let foundNPC = false;
    if (!G.maps[parent.character.map].npcs) return;
    for (const npc of G.maps[parent.character.map].npcs.filter(
      (npc) => npc.id == "fancypots"
    )) {
      if (
        distance(parent.character, {
          x: npc.position[0],
          y: npc.position[1],
        }) < 350
      ) {
        foundNPC = true;
        break;
      }
    }
    if (!foundNPC) return; // Can't buy things, nobody is near.
  }
  if (parent.character.gold < G.items["mpot1"].g) return; // No money

  const itemsToBuy: { [T in ItemName]?: number } = {
    mpot1: 9999,
    hpot1: 9999,
  };

  for (const itemName in itemsToBuy) {
    const numberToBuy = itemsToBuy[itemName as ItemName];
    const numItems = findItems(itemName as ItemName).reduce(
      (a, b) => a + b.q,
      0
    );
    if (numItems < numberToBuy) {
      await buy_with_gold(
        itemName as ItemName,
        Math.min(
          numberToBuy - numItems,
          parent.character.gold / G.items[itemName as ItemName].g
        )
      );
    }
  }
}

export async function buyScrolls(): Promise<void> {
  if (parent.character.map == "bank") return; // We can't do things in the bank
  if (!findItem("computer")) {
    let foundNPC = false;
    if (!G.maps[parent.character.map].npcs) return;
    for (const npc of G.maps[parent.character.map].npcs.filter(
      (npc) => npc.id == "scrolls"
    )) {
      if (
        distance(parent.character, {
          x: npc.position[0],
          y: npc.position[1],
        }) < 350
      ) {
        foundNPC = true;
        break;
      }
    }
    if (!foundNPC) return; // Can't buy things, nobody is near.
  }
  if (parent.character.gold < G.items["scroll0"].g) return; // No money

  const itemsToBuy: { [T in ItemName]?: number } = {
    scroll0: 1000,
    scroll1: 100,
    scroll2: 10,
    cscroll0: 1000,
    cscroll1: 100,
    cscroll2: 10,
  };

  for (const itemName in itemsToBuy) {
    const numberToBuy = itemsToBuy[itemName as ItemName];
    const numItems = findItems(itemName as ItemName).reduce(
      (a, b) => a + b.q,
      0
    );
    const numCanBuy = Math.min(
      numberToBuy - numItems,
      Math.trunc(parent.character.gold / G.items[itemName as ItemName].g)
    );
    if (numItems < numberToBuy && numCanBuy > 0) {
      await buy_with_gold(itemName as ItemName, numCanBuy);
    }
  }
}
