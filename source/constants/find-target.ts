import { Entity } from "../definitions/adventureland";

export const findTarget = (targetId: string): Entity => {
  return parent.entities[targetId];
};
