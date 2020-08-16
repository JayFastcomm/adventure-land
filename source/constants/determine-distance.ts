export const determineDistance = (
  currentX: number,
  currentY: number,
  targetX: number,
  targetY: number
): number => {
  //   game_log(`currentX: ${currentX},currentY: ${currentY}`);
  //   game_log(`targetX: ${targetX},targetY: ${targetY}`);
  const diffY = (currentY - targetY) * currentY - targetY;
  const diffX = (currentX - targetX) * currentX - targetX;

  //   game_log(`equation: ${equation}`);
  const distance = Math.pow(Math.sqrt(Math.abs(diffY + diffX)), 1 / 2);
  game_log(`distance to entity: ${distance}`);
  //   game_log(`distance returned as: ${distance}`);
  return distance;
};
