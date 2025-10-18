
var TweetCounts = function () {
    this.map = new Map();
    this.freqInterval = {
        minute: 60,
        hour: 60 * 60,
        day: 60 * 60 * 24,
    }
};

/** 
 * @param {string} tweetName 
 * @param {number} time
 * @return {void}
 */
TweetCounts.prototype.recordTweet = function (tweetName, time) {
    const timestamps = this.map.get(tweetName) ?? [];
    timestamps.push(time);
    this.map.set(tweetName, timestamps);
};

/** 
 * @param {string} freq 
 * @param {string} tweetName 
 * @param {number} startTime 
 * @param {number} endTime
 * @return {number[]}
 */

TweetCounts.prototype.getTweetCountsPerFrequency = function (freq, tweetName, startTime, endTime) {
    const BASE = this.freqInterval[freq] // min hour or day?
    const frequency = Math.floor((endTime - startTime) / BASE) + 1 // how many chunks for given interval, int part.
    // bucketCount = Math.floor((endTime - startTime) / intervalLength) + 1;
    // (endTime – startTime) is the total span you must cover.
    // Dividing by intervalLength tells me how many full chunks fit into that span and 
    // +1 because first chunk starts exactly at startTime.. so we need one bucket minimum.
    const tweetCounts = new Array(frequency).fill(0);
    const records = this.map.get(tweetName); // for all records of tweet "abcd"

    for (let index = 0; index < records.length; index += 1) {
        const time = records[index];
        if (startTime <= time && time <= endTime) {
            // bucketIndex = Math.floor((t - startTime) / intervalLength);
            //  subtract startTime so that the first interval begins at offset 0.
            //  Dividing by intervalLength and flooring tells me “how many full intervals fit before time t,” i.e. the zero‐based bucket number.
            // Example: t=75, startTime=0, interval=60
            // (75-0)/60 = 1.25, floor = 1 so t falls in the second bucket, index 1 (the [60–119] slot).
            const chunk = Math.floor((time - startTime) / BASE)
            tweetCounts[chunk] += 1;
        }
    }
    return tweetCounts;
};

/** 
 * Your TweetCounts object will be instantiated and called as such:
 * var obj = new TweetCounts()
 * obj.recordTweet(tweetName,time)
 * var param_2 = obj.getTweetCountsPerFrequency(freq,tweetName,startTime,endTime)
 * 
 * 
 * 
 * 
The problem “Tweet Counts Per Frequency” asks you to design a system that supports two operations:

recordTweet(tweetName, time)
– Logs that a tweet named tweetName occurred at timestamp time.

getTweetCountsPerFrequency(freq, tweetName, startTime, endTime)
– Given a frequency (“minute”, “hour” or “day”), a tweetName, and a time window [startTime, endTime], return an array of counts, one for each consecutive bucket of length

minute = 60 seconds
hour = 60*60 seconds
day = 60*60*24 seconds

For example, if freq=”minute” and startTime=0, endTime=119, you’d break that 120-second span into two 60-second intervals: [0–59], [60–119], and report how many times tweetName was recorded in each.
 */

