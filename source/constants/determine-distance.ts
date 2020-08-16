export const determineDistance = (
  currentX: number,
  currentY: number,
  targetX: number,
  targetY: number
): number => {
  //   game_log(`currentX: ${currentX},currentY: ${currentY}`);
  //   game_log(`targetX: ${targetX},targetY: ${targetY}`);
  const diffY = currentY - targetY * 2;
  const diffX = currentX - targetX * 2;
  //   game_log(`equation: ${equation}`);
  const distance = Math.pow(Math.sqrt(Math.abs(diffY + diffX)), 1 / 2);
  //   game_log(`distance returned as: ${distance}`);
  return distance;
};
