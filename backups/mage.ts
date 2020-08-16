import { game_log } from "./functions";

class Mage {
  mainLoop() {
    setTimeout(() => {
      game_log("in loop");
      this.mainLoop();
    }, 250);
  }
}

const mage = new Mage();
export { mage };
