const fs = require('fs');
const logger = require('winston');

class ScriptState {
  constructor() {
    this.name = 'undefined script';
    this.savefile = 'undefined.json';
    this.data = {};
  }

  run() {
    /* Child will overwrite this function */
    return true;
  }

  saveData() {
    let filepath = `${__lib}/../savefiles/${this.savefile}`;
    return fs.writeFileSync(filepath, JSON.stringify(this.data), 'utf-8');
  }

  loadData() {
    try {
        let filepath = `${__lib}/../savefiles/${this.savefile}`;
        fs.accessSync(filepath, fs.F_OK);

        this.data = JSON.parse(filepath, 'utf8');
        logger.info(`[SCRIPT] Loaded savefile data ${this.savefile} successfully.`);
    } catch (err) {
      if (err.code === 'ENOENT') { return false; }
      else { throw err; }
    }
  }
}

module.exports = ScriptState;
