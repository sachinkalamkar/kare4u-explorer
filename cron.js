// var cron=require("./main");
// cron.schedule('59 26 13 1-31 1-12 1-7', async function(){
//  logger.info("CronJob started:",date)
//  await cron.main()

// });
var cron = require('cron-scheduler')
var main = require('./main.js')

cron({ on: '0 */2* * * *' }, function () {


})