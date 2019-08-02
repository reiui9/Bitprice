var http = require('http')
var console = require('console')
var config = require('config')

function getCoinNews (coin, count) {
  if (!Number.isInteger(count) || count < 1) {
    count = 10
  }
  coin = coin.toLowerCase()
  // slug mapping
  var slug = {
    btc: 'bitcoin',
    dash: 'dash',
    eth: 'ethereum',
    etc: 'ethereum-classic',
    ltc: 'litecoin',
    xrp: 'ripple',
    bch: 'bitcoin-cash',
    xmr: 'monero',
    zec: 'zcash',
    eos: 'eos'
  }
  var apiKey = config.get('cryptocontrol.api.news.key')
  var apiUrl = config.get('cryptocontrol.api.base.url')
  
  // GET 'https://cryptocontrol.io/api/v1/public/news/coin/{slug}?key={apiKey}'
  var response = http.getUrl(apiUrl + '/api/v1/public/news/coin/' + slug[coin] + '?key=' + apiKey, { format: 'json' })
  var results = []
  for (var i=0; i<count; i++) {
    var news = response[i]
    var ret = {}
    ret.title = news.title
    ret.description = news.description
    ret.thumbnail = news.thumbnail
    ret.url = news.url
    results.push(ret)
  }
  console.log(results)
  return results
}

module.exports.function = function getBTCRates (coins) {
  var krakenMarketBaseUrl = config.get('cryptowatch.api.base.url') + '/markets/kraken'
  var bithumbMarketBaseUrl = config.get('cryptowatch.api.base.url') + '/markets/bithumb'
  var targetMarketBaseUrl = krakenMarketBaseUrl
  // change symbol to string type
  coins.coin = coins.coin.toString()
  coins.exchange = coins.exchange.toString()

  if (coins.exchange.toLowerCase() == 'krw') {
    targetMarketBaseUrl = bithumbMarketBaseUrl
  }
  var result = {
    price: {
      last: 1,
      high: 1,
      low: 1,
      change: {
        percentage: 0,
        absolute: 0
      }
    },
    volume: 0,
    chart: {
      url: config.get('chart.bitcoin')
    },
    coins: coins,
    news: []
  }
  result.news = getCoinNews(coins.coin)
  // TODO: handle special case more elegant way
  if (coins.exchange.toLowerCase() == coins.coin.toLowerCase()) {
    return result
  }
  var response = http.getUrl(targetMarketBaseUrl + '/' + coins.coin.toLowerCase() + coins.exchange.toLowerCase() + '/summary', { format: 'json' })
  result.price = response.result.price
  result.volume = response.result.volume
  return result
}
