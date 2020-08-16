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

var attack_mode = true;

setInterval(function () {
  use_hp_or_mp();
  loot();
  if (!attack_mode || parent.character.rip || is_moving(parent.character)) {
    return;
  }

  let target = get_targeted_monster();
  if (!target) {
    target = get_nearest_monster({ min_xp: 100, max_att: 120 });
  } else {
    change_target(target);
  }

  if (!is_in_range(target, "attack")) {
    move(
      parent.character.x + (target.x - parent.character.x) / 2,
      parent.character.y + (target.y - parent.character.y) / 2
    );
  } else if (can_attack(target)) {
    set_message("Attacking");
    attack(target);
  }
});
