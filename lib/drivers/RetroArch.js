var logger = require('winston');
var Promise = require("bluebird");

var read_buffer = [];
var read_buffer_history = [];

class RetroArchDriver {
    constructor() {}

    toJSON() {
        return "RetroArch";
    }

    init() {
        var resolver = Promise.defer();
        this._socket = require('dgram').createSocket('udp4');
        /**
         * Messages are received from RetroArch via UDP packets.
         * All responses should be READ_CORE_RAM when RetroArch sends the result
         * of a memory address lookup.
         * This API in RetroArch was added by Alcaro.  PR 3068
         */
        this._socket.on('message', function(data) {
            var message = data.toString();
            logger.silly(`RetroArch CMD Response: ${message.replace(/\n$/, '')}`);

            var split = message.split(' ');
            var address = parseInt(split[1], 16);
            var hex_values = split.slice(2).toString().slice(0, -1)

            if (hex_values == "-1") {
                logger.warn('Did not get a proper response back from RetroArch. Is a game loaded with a compatible core?')
                return false;
            }

            read_buffer[address] = hex_values.split(',');
        });
        this._socket.on('close', function() {
            logger.error('Socket has been closed.');
        });
        this._socket.on('error', function() {
            logger.error('Socket has encountered an error.');
        });

        var self = this;
        this.getHex(0x00).then(function(hex) {
            self.initialized = true;
            resolver.resolve(true);
        }).catch(function(err) { resolver.reject(err); });

        return resolver.promise;
    }

    getHex(address, length = 1) {
        function waitForReadBuffer(address) {
            return new Promise(function(resolve, reject) {
                (function wait() {
                    if (read_buffer[address] != undefined) {
                        return resolve(read_buffer[address]);
                    }
                    setTimeout(wait, 15);
                })();
            });
        }

        var resolver = Promise.defer();
        var self = this;
        this.sendMessage(`READ_CORE_RAM ${address.toString(16)} ${length}`).then(function() {
            waitForReadBuffer(address).timeout(451).then(function(result) {
                    read_buffer[address] = null;
                    read_buffer_history[address] = result;
                    resolver.resolve(result);
                }).catch(Promise.TimeoutError, function(e) {
                    if (read_buffer_history[address] == null) {
                      logger.warn(`Timed out while waiting for address ${address.toString(16)}`)
                      resolver.reject(`Timed out while waiting for address ${address.toString(16)}`)
                    } else {
                      logger.verbose(`Timed out while waiting for address ${address.toString(16)}`)
                      resolver.resolve(read_buffer_history[address]);
                    }
                })
                .catch(function(ex) {
                    resolver.reject(ex);
                });
        });
        return resolver.promise;
    }

    setHex(address, hex) {
      var resolver = Promise.defer();
      var self = this;
      this.sendMessage(`WRITE_CORE_RAM ${address.toString(16)} ${hex.join(' ')}`).then(function() {
          resolver.resolve();
      });
      return resolver.promise;
    }

    sendMessage(message) {
        var resolver = Promise.defer();
        logger.silly(`RetroArch CMD Send: ${message}`);
        this._socket.send(message, 0, message.length, 55355, '127.0.0.1', function(err, bytes) {
            if (err) {
                resolver.reject(err);
            } else {
                resolver.resolve(true);
            }
        });
        return resolver.promise;
    }

}

module.exports = new RetroArchDriver();
