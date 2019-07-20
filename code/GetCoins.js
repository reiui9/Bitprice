// get a coin by using selection
// if exchange is not defined, set it as 'USD'
// return 'Coins' model

module.exports.function = function getCoins (coin, exchange) {
  var coins = {coin:{},exchange:{}};
  if(coin == undefined)
    coin = 'many'
  if(exchange == undefined)
    exchange ='usd'
  coins.coin = coin;
  coins.exchange = exchange;
  return coins
}
