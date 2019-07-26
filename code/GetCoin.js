var http = require('http')
var console = require('console')
var config = require('config')

module.exports.function = function getCoin () {
  console.log("GET /ticker without any parameter!)")
  // Read the remote.url value from capsule.properties
  var response = ['BTC','ETC','LTC']
  
  // image setting
  var images = []
  images[0] = config.get('image.BTC')
  images[1] = config.get('image.ETC')
  images[2] = config.get('image.LTC')

  var items = []
  for (var i in response) {
    var item = {
      coin: response[i],
      image: {
        url: ""
      }
    }
    // image random setting
    item.image.url = images[i]
    items.push(item)
  }
  return items
}
