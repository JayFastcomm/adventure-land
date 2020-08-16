let ctype = String(character.ctype);
let start_time = new Date();
try {
  import(`http://localhost:3000/${ctype}.js`).then(
    (success) => {
      bots[ctype].run();
    },
    (error) => {
      load_code(ctype);
      bots[ctype].run();
    }
  );
} catch (e) {
  log("error: " + typeof e === object ? JSON.stringify(e) : e);
}
