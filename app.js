const logger = require('winston');
const express = require('express');
const fs = require('fs');
const path = require('path');
const Promise = require("bluebird");

const config = require('./config/config.js');

logger.level = config.logLevel;
logger.add(logger.transports.File, {
    filename: 'game-hook.log'
});

global.__lib = `${__dirname}/lib/`;

/* Initalize GameState */
var gameState = require(config.gameFile);
var driver = require(config.driverFile);
var scripts = [];

gameState.init(driver).then(function() {
    logger.info('[GameState] Established connection to emulator.');
}).error(function(err) {
    logger.warn('[GameState] Failed to connect to driver. Is your emulator running?');
    logger.error(err);
}).then(function() {
    /* Initalize Script Engine. */
    config.scripts.forEach(function(script) {
        var scriptName = path.basename(script, '.js');
        logger.info('[SCRIPT] Loaded script: %s', scriptName);
        scripts.push({
            name: scriptName,
            script: require(script)
        });
    });
}).then(function() {
    /* Initalize API Endpoint */
    var website = express();
    website.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    website.get('/', function(req, res) {
        gameState.getAllProperties().then(function() {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(gameState, null, 3));
        }).catch(function(ex) {
            console.log(ex);
        });
    });

    var server = website.listen(5000, function() {
        var host = server.address().address;
        var port = server.address().port;
        logger.info('[WEB] API Endpoint accessible at http://127.0.0.1:%s/', port);
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
                gameState.scripts[module.name] = new module.script(gameState);
            });
        });
        setTimeout(arguments.callee, 1000);
    })();
});
