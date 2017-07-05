const Promise = require("bluebird");

class Hex {
    constructor(gameState, address, length = 1) {
        this._gameState = gameState;
        this.address = address;
        this.length = length;
    }

    setNybble(nybble) { this.nybble = nybble; return this; }

    toJSON() {
        return {
            address: (this.address == null ? null : this.address.toString(16)),
            length: this.length,
            hex: this.hex,
            value: this.value
        };
    }

    get() {
        var resolver = Promise.defer();
        this.getHex().then(function(hex) {
            resolver.resolve({
                hex: hex,
                value: hex
            });
        }).catch(function(ex) {
            resolver.reject(ex);
        });
        return resolver.promise;
    }

    getHex() {
        var self = this;
        var resolver = Promise.defer();
        this._gameState._driver.getHex(this.address, this.length).then(function(hex) {
            if (hex == null) {
                resolver.reject(`${self.address.toString(16)} returned NULL from driver.`);
            }
            if (self.nybble != null) {
                resolver.resolve([hex[0][self.nybble]]);
            } else {
              resolver.resolve(hex);
            }
        }).catch(function(err) {
            self.hex = null;
            self.value = null;
            resolver.reject(err);
        });
        return resolver.promise;
    }

    setHex(hex) {
      var self = this;
      var resolver = Promise.defer();
      this._gameState._driver.setHex(this.address, hex).then(function() {
        resolver.resolve(hex);
      })
      return resolver.promise;
    }
}

module.exports = Hex;
