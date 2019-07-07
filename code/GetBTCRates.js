var http = require('http')
var console = require('console')
var config = require('config')
module.exports.function = function getBTCRates () {
  console.log("GET /ticker without any parameter!)")
  // Read the remote.url value from capsule.properties
  var response = http.getUrl(config.get('blockchain.url') + '/ticker', { format: 'json' });

  var items = [];
  for (var currency in response) {
      var item = response[currency];
      item.quarterBefore = item['15m']
      delete item['15m'];
      item.currency = currency;
      items.push(item)
  }
  return items;
}
