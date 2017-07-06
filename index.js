global.__base = __dirname + '/';

global.__config = __dirname + '/config';

global.__data = __dirname + '/data';

global.__assets = __dirname + '/assets';
global.__assets_mappers = __dirname + '/assets/mappers';
global.__assets_scripts = __dirname + '/assets/scripts';

global.__lib = __dirname + '/lib';
global.__lib_core = __dirname + '/lib/core';
global.__lib_drivers = __dirname + '/lib/drivers';
global.__lib_types = __dirname + '/lib/types';

const logger = require(`${global.__lib}/logger.js`);

const assets = require(`${global.__lib}/assets.js`)
assets.updateAssets();

require(`${__lib}/server.js`);
