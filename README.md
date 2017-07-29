# :anchor: GameHook
GameHook allows you to fetch information in any game you are currently playing from the popular emulator "RetroArch" in real-time via WebAPI.

> GameHook is still in early stages of development!

![Image](https://i.imgur.com/PP4qJEo.png)

## How do I get it?
```git clone https://github.com/chris062689/game-hook.git```
```cd game-hook && npm update```

## How do I check for updates?
1. Download the assets located here: https://github.com/chris062689/game-hook-assets
2. Extract the folders: mappers, scripts inside of the `/game-hook/assets/` folder (if this folder does not exist you must create it.)

## Quick-Start Guide
1. Download and install [Node.js](https://nodejs.org/), and reboot before proceeding with the remaining steps.
2. Download and install [RetroArch](http://www.libretro.com/index.php/retroarch-2/).
3. Open RetroArch, set Network CMD Enable to true within Settings.
4. Start your game using a compatible core.
5. Apply the example configuration below, or your own based on the game you'd like to use.
6. Start the GameHook server `npm start` and verify it has connected to the driver.
7. Open an appropriate client _(inside the /assets/clients folder, often an HTML file.)_

## What are some examples of what GameHook do?

There are example scripts and clients included.
- **Example Clients** - Inside of the /assets/clients folder, clients are typically HTML files. You can see examples for:
    - **Pokemon Sidebar** - A sidebar used for video game streamers and Pokemon. Will display common information about the Pokemon game you are playing as a sidebar that can easily integrate into OBS or Xsplit.
- **Example Scripts** - Inside of the /assets/scripts folder, you can see examples for:
    - **Pokemon Red / Blue Nuzlocke Mode** - A script that enforces "Nuzlocke" rules from Pokemon. This enforces all main Nuzlocke rules automatically including: Disallow use of "dead" Pokemon, disallow captures after first encounters per Route.
    - **Pokemon Red / Blue Shiny Checker** - A script that determines if the Pokemon you are fighting is a shiny.


## How do I set up my config?
Within the GameHook folder, open up `/config/config.js`.
There are the following options available:
- **Log Level** - Indicates the amount of logging that should be done. Useful for debugging.
    - Default Value: `'info'`
- **Driver File** - The path to the driver
    - Default Value: `'RetroArch.js'`
- **Mapper File** - The path to the mapper
    - Example: `'PokemonRedBlue_GBC.js'`)
- **Scripts** - A list of scripts to automatically be ran.
    - Example: `['PokemonNuzlocke.js', 'PokemonShinyDetect.js']`

An example configuration would like like this:
```
exports.logLevel = 'info';
exports.driverFile = 'RetroArch.js';
exports.gameFile = 'PokemonRedBlue_GBC.js';
exports.scripts = ['PokemonNuzlocke.js', 'PokemonShinyDetect.js'];
```

## Technical Information
The GameHook server exports a live-feed of your game through a Web API / JSON.

### Internal Components of the GameHook Server:
- **Mapper** - The mapper file is what translates the RAM (Random Access Memory) of the game you are currently playing into something readable. This mapper file contains what type of data should be displayed (string, integer, decimal, references, etc.) and any translation that needs to occur. _This mapper file is specific to the game you are playing_
- **Driver** - The driver binds the mapper file to a specific emulator or process. This module handles reading and writing RAM, and translating according to the mapper file.
- **User Scripts** - GameHook can be customized further by creating your own scripts to interact with the game based off of the translated values in the mapper file. _See the /data/scripts folder for more information on how to write your own._

### Internal Components of the GameHook Client:
Because the GameHook server is served through Web API / JSON, any Web API enabled platform can leverage the GameHook server.
_See the /assets/clients folder for more information on how to write your own._


> Program your own scripts to interact with your favorite games!
![Image](https://i.imgur.com/HC6z4Yz.png)
