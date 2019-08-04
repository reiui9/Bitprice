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
  for (var i = 0; i < count; i++) {
    var news = response[i]
    var ret = {}
    ret.title = news.title
    ret.description = news.description
    ret.thumbnail = news.thumbnail
    ret.url = news.url
    results.push(ret)
  }
  return results
}

// https://gist.github.com/jiggzson/b5f489af9ad931e3d186
function scientificToDecimal(num) {
  // if the number is in scientific notation remove it
  if (/\d+\.?\d*e[\+\-]*\d+/i.test(num)) {
      var zero = '0',
          parts = String(num).toLowerCase().split('e'), // split into coeff and exponent
          e = parts.pop(), // store the exponential part
          l = Math.abs(e), // get the number of zeros
          sign = e / l,
          coeff_array = parts[0].split('.')
      if (sign === -1) {
          coeff_array[0] = Math.abs(coeff_array[0]);
          num = '-'+zero + '.' + new Array(l).join(zero) + coeff_array.join('')
      } else {
          var dec = coeff_array[1]
          if(dec) l = l - dec.length
          num = coeff_array.join('') + new Array(l+1).join(zero)
      }
  }
  
  return num
}

function decimalToKRW(decimal) {
  var 억 = Math.pow(10, 8)
  var 만 = Math.pow(10, 4)
  var krw = ""
  decimal = parseInt(decimal)
  if (decimal > 억) {
    var num = Math.floor(decimal / 억)
    krw = num.toString() + "억"
    decimal = decimal % 억
  }
  if (decimal > 만) {
    if (krw != "") {
      krw = krw + " "
    }
    var num = Math.floor(decimal / 만)
    krw = krw + num.toString() + "만"
    decimal = decimal % 만
  }
  if (krw != "") {
    krw = krw + " "  
  }
  krw = krw + decimal.toString()
  return krw
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
      last: "1",
      high: "1",
      low: "1",
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
  for (var key in result.price) {
    if (key != 'last' && key != 'high' && key != 'low') {
      continue
    }
    result.price[key] = result.price[key].toString()
    result.price[key] = scientificToDecimal(result.price[key])
    if (coins.exchange.toLowerCase() == 'krw') {
      result.price[key] = decimalToKRW(result.price[key])
    }
  }
  result.volume = response.result.volume
  return result
}
