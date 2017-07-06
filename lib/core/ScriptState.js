const fs = require('fs');
const path = require('path');
const logger = require(`${global.__lib}/logger.js`);

class ScriptState {
  constructor() {
    this.persistData = false;
    this.filenameSuffix = '';

    this.compatibleMappers = [];
    this.data = {};
  }

  verify(gameState) {
    return this.compatibleMappers.includes(gameState.gameName);
  }

  run() {
    /* Child will overwrite this function */
    return true;
  }

  saveData() {
    if (this.persistData) {
      let filepath =`${global.__data}/${this.name}${this.filenameSuffix}.json`;
      return fs.writeFileSync(filepath, JSON.stringify(this.data), 'utf-8');
    }
  }

  loadData() {
    if (this.persistData) {
      try {
          let filepath =`${global.__data}/${this.name}${this.filenameSuffix}.json`;
          fs.accessSync(filepath, fs.F_OK);

          this.data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
          logger.info(`[script] [${this.name}] Loaded savefile data ${this.name}${this.filenameSuffix}.json`);
      } catch (err) {
        if (err.code === 'ENOENT') { return false; }
        else { throw err; }
      }
    }
  }
}

module.exports = ScriptState;
