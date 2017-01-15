/* Shortcut functions */
module.exports.TypeArray = function TypeArray(gameState, propertyType, address, length, dict) {
  var result = [];
  var itemPosition;
  var itemAddress = address;
  for (itemPosition = 0; itemPosition < 8; itemPosition++) {
    result.push(new propertyType(gameState, itemAddress, 1, dict));
    itemAddress += 1;
  }
  return result;
};

/* Shortcut functions */
module.exports.TypeArrayNybble = function TypeArrayNybble(gameState, propertyType, address, length, dict) {
  var result = [];
  var itemPosition;
  var itemAddress = address;
  var itemNybble = 0;
  for (itemPosition = 0; itemPosition < 8; itemPosition++) {
    result.push(new propertyType(gameState, itemAddress, 1, dict).setNybble(itemNybble));
    if (itemNybble == 1) {
      itemNybble = 0;
      itemAddress += 1;
    } else {
      itemNybble = 1;
    }
  }
  return result;
};
