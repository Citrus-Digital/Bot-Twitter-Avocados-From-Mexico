const { T } = require('../config/twit');
const { getResponses, getTriggers } = require('./messages');
const { getTimeNow, getRandomIntInclusive, sleep } = require('./utils');
const { TweetModel } = require('../models/tweets');
const { SentModel } = require('../models/sent');
const { valid } = require('joi');

const tweetIt = async (tweet, date, hour) => {
    try {
        const tweetObj = {
            status: tweet.tweet_reply,
            in_reply_to_status_id: tweet.tweet_id_str
        };
    
        T.post(
            'statuses/update', 
            tweetObj, 
            async (err, data, response) => {
                if(err) {
                    console.log(`Error at ${getTimeNow()} - `, data);
                    await TweetModel.findOneAndUpdate(
                        { tweet_id: tweet.tweet_id, tweet_id_str: tweet.tweet_id_str}, 
                        { $set: { 
                            sent_error: true, 
                            sent_error_obj: data.errors, 
                            sent_at: new Date() 
                        }}
                    );
                } else {
                    await SentModel.updateOne(
                        { date, hour }, 
                        { $inc: { count: 1 }, $push: { sent: tweet.tweet_id_str } }, {upsert: true}
                    );
                    
                    await TweetModel.findOneAndUpdate(
                        { tweet_id: tweet.tweet_id, tweet_id_str: tweet.tweet_id_str}, 
                        { $set: { sent: true, sent_at: new Date() } }
                    );
                    
                    console.log(`tweetIt: sent tweet to ${tweet.tweet_id_str} at ${getTimeNow(false, true)}`);
                }
            }
        );
    } catch (error) {
        console.log('error on tweetIt: ', error)
    }
};

const sendTweets = async () => {
    try {
        const date = getTimeNow(true);
        const hour = new Date().getHours();
        
        const sent = await SentModel.findOne({ date, hour });
        
        if (sent && sent.count >= 99) {
            return;
        }
        
        const limit = getLimit(sent?.count);

        const createdAt = new Date();
        createdAt.setMinutes(createdAt.getMinutes() - getRandomIntInclusive(2, 5));
    
        const tweetPeding = await TweetModel.find({ 
            sent: false, 
            sent_at: null, 
            sent_error: false, 
            tweet_created_at: {$lte: createdAt} 
        }).sort({created_at: 1}).limit(limit);
    
        if(!tweetPeding.length) {
            console.log(`sendTweets: no tweets were found at ${getTimeNow(false, true)}`);
            return;
        }

        console.log(`sendTweets: ${tweetPeding.length} tweets were found at ${getTimeNow(false, true)}`);

        let index = 0;
        for (const tweet of tweetPeding) {
            let sleepTime = 0;
            if (index === 0) {
                sleepTime = getRandomIntInclusive(1000, 8000);
                await sleep(sleepTime);
            } else {
                sleepTime = getRandomIntInclusive(20000, 35000)
                await sleep(sleepTime);
            }
            await tweetIt(tweet, date, hour);
            index++;
        }
    } catch (error) {
        console.log('error on sendTweets: ', error);        
    }
}

const getLimit = (count = 0) => {
    let limit = 100;
    limit = count > 0 ? parseInt(limit) - parseInt(count) : limit;
    return Math.ceil(limit/60);
}

const searchNewTweets = async () => {
    try {
        const triggers = getTriggers(getTimeNow(false, true));
        
        console.log(
            `search ${triggers.length} trigger at ${getTimeNow(false, true)}`, 
            triggers.map(trigger => trigger.triggers)
        );

        for (const trigger of triggers) {
            const triggerCurrent = formatTriggersToTwitter(trigger.triggers);

            let params = { q: `${triggerCurrent} since:${getTimeNow(true)}`, count: 100 };
            const tweetSinceId = await TweetModel.findOne({ trigger_id: trigger.id }, { tweet_id: 1 }).sort({created_at: -1})
    
            if ( tweetSinceId ) {
                params.since_id = parseInt(tweetSinceId.tweet_id);
            }

            const found = await T.get('search/tweets', params);

            if (!found?.data || !found.data.statuses.length) {
                console.log(`searchNewTweets: no tweets were found at ${getTimeNow(false, true)} this trigger ${triggerCurrent}`);
                continue;
            }

            console.log(`searchNewTweets: ${found.data.statuses.length} tweets were found at ${getTimeNow(false, true)} this trigger ${triggerCurrent}`);
            
            await saveTweets(found.data, trigger, triggerCurrent)
        }
    } catch (error) {
        console.log('error on getNewTweets: ', error);   
    }
}

const saveTweets = async (data, trigger, triggerCurrent) => {
    try {
        if (!data.statuses.length) {
            return;
        }

        const tweets = data.statuses.reverse();

        for (let tweet of tweets) {
            if (
                tweet.user.screen_name == process.env.TWITTER_ACCOUNT || 
                (tweet.retweeted_status && tweet.retweeted_status.user.screen_name == process.env.TWITTER_ACCOUNT)
            ) {
                continue;
            }

            const msg = getResponses(trigger.result.responses)
            const tweetReply = `@${tweet.user.screen_name} ${msg.response}`; 

            try {
                await new TweetModel({
                    trigger_id: trigger.id,
                    trigger: triggerCurrent,
                    tweet_reply: tweetReply,
                    tweet_id: tweet.id,
                    tweet_id_str: tweet.id_str,
                    tweet_text: tweet.text,
                    tweet_created_at: new Date(tweet.created_at),
                    tweet: tweet
                }).save();
            } catch (error) {
                continue;
            }
        }
    } catch (error) {
        console.log('error on saveTweets: ', error)
    }
}

const formatTriggersToTwitter = (triggers) => {
    return triggers.join(' + ');
}

module.exports =  {
    searchNewTweets,
    sendTweets
}
