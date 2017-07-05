const fs = require('fs');
const logger = require('winston');

class ScriptState {
  constructor() {
    this.name = 'undefined script';
    this.filename = 'undefined.json';
    this.loadedSavefile = false;
    this.data = {};
  }

  run() {
    /* Child will overwrite this function */
    return true;
  }

  saveData() {
    this.loadedSavefile = true;
    let filepath = `${global.__data}/${this.filename}`;
    return fs.writeFileSync(filepath, JSON.stringify(this.data), 'utf-8');
  }

  loadData() {
    try {
        let filepath =`${global.__data}/${this.filename}`;
        fs.accessSync(filepath, fs.F_OK);

        this.data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
        logger.info(`[${this.name}] Loaded savefile data ${this.filename} successfully.`);
        this.loadedSavefile = true;
    } catch (err) {
      if (err.code === 'ENOENT') { return false; }
      else { throw err; }
    }
  }
}

module.exports = ScriptState;
