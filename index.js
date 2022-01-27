require('dotenv').config();
var cron = require('node-cron');
var mongoose = require('mongoose');
const { searchNewTweets, sendTweets } = require('./src/services/twiiter');
const { getTimeNow } = require('./src/services/utils');
const Conn = require('./src/config/mongo');

Conn(mongoose);

const init = () => {
    searchNewTweets();
    sendTweets();
    
    console.log('running a task every five minutes');

    cron.schedule('*/3 * * * *', () => {
        console.log(`starting getNewTweets... ${getTimeNow(false, true)}`);
        searchNewTweets();
    });
    
    cron.schedule('*/1 * * * *', () => {
        console.log(`starting sendTweets... ${getTimeNow(false, true)}`);
        sendTweets();
    });
}

init();