const AWS = require('aws-sdk');
const minimist = require('minimist');
const _ = require('lodash');
const Promise = require('bluebird');
const comprehend = new AWS.Comprehend({region: 'us-west-2'});
Promise.promisifyAll(comprehend);


const utils = require('./utils');

const { detectRoot } = utils;

const argv = minimist(process.argv.slice(2), {});

const runAnalysis = () => {
  return new Promise((resolve, reject) => {

    if (argv._.includes('help')) {
      console.log(`
        You can utilize the following options when running this function:

        --Text=STRING (required)

        --detectEntities=BOOLEAN (optional)
        --detectSentiment=BOOLEAN (optional)
        `)
      } else {
        return resolve(detectRoot(argv, comprehend).then(des => {
          return des;
        }));
      }
  });
}

// runAnalysis().then(e => {
//   console.log(e)
// });

 module.exports = { runAnalysis }
