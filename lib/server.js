const logger = require(`${global.__lib}/logger.js`);
const express = require('express');
const bodyParser = require('body-parser');
const objectPath = require("object-path");
const fs = require('fs');
const path = require('path');
const Promise = require("bluebird");

const config = require(`${__config}/config.js`);

/* Initalize GameState */
var driver = require(`${global.__lib_drivers}/${config.driverFile}`);
var gameState = require(`${global.__assets_mappers}/${config.gameFile}`);
var scripts = [];

logger.info(`[startup] Loaded driver: ${config.driverFile}`);
logger.info(`[startup] Loaded mapper: ${config.gameFile}`);

gameState.init(driver).error(function(err) {
    logger.warn('[startup] Failed to connect to driver. Is your emulator running?');
    logger.error(err);
}).then(function() {
    logger.info(`[startup] Established connection to ${driver.name}`);
}).then(function() {
    /* Initalize Script Engine. */
    config.scripts.forEach(function(file) {
        var script = require(`${global.__assets_scripts}/${file}`);
        if (script.verify(gameState) == true) {
          logger.info(`[startup] Loaded script: ${file}`);
          // Load any existing data that was stored in json.
          script.loadData();
          // Push the script onto the scripts stack.
          scripts.push(script);
        } else {
          logger.warn(`[startup] ${file} is not compatible with ${gameState.gameName}`);
        }
    });
}).then(function() {
    /* Initalize API Endpoint */
    var website = express();
    website.use(bodyParser.json());
    website.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    website.get('/', function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(gameState, null, 3));
    });

    website.patch('/', function(req, res) {
      let property = objectPath.get(gameState, req.body.property);
      if (property) {
        if (req.body.type == 'hex') {
          property.setHex(req.body.value);
          res.send({ result: true });
        } else {
          // Request type was unimplemented.
          res.send(501);
        }
      } else {
        // Property was not found.
        res.send(404);
      }
    });

    var server = website.listen(5123, function() {
        var host = server.address().address;
        var port = server.address().port;
        logger.info('[startup] Web API Endpoint accessible at http://127.0.0.1:%s/', port);
        logger.info('Startup completed!');
    });
    /* End API Endpoints */
}).then(function() {
    /*
      Main loop - This is required for scripting support.
      If scripting support it not needed, you could just call gameState.getAllProperties()
      If you only need a single property,    gameState.[property].get()
    */
    (function() {
        gameState.getAllProperties().then(function() {
            gameState.scripts = {};

            scripts.forEach(function(module) {
                gameState.scripts[module.name] = module.run(gameState);
            });
        });
        setTimeout(arguments.callee, 1000);
    })();
}).error(function(err) {
  logger.error(err);
});
