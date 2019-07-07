var http = require('http')
var console = require('console')
var config = require('config')
module.exports.function = function findShoe () {
  console.log("GET /ticker without any parameter!)")
  // Read the remote.url value from capsule.properties
  var response = http.getUrl(config.get('blockchain.url') + '/ticker', { format: 'json' });

  const items = [];
  for (let currency in response) {
      const item = response[currency];
      item['quarterBefore'] = item['15m'];
      // delete item['15m'];
      item.currency = currency;
      items.push(item)
  }
  console.log(items);
  return items;
}
