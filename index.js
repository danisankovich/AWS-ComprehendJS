const AWS = require('aws-sdk');
const minimist = require('minimist');
const chalk = require('chalk');
const _ = require('lodash');

const utils = require('./utils');

const { detectSentimentFunction, detectEntitiesFunction } = utils;

const argv = minimist(process.argv.slice(2), {});

const comprehend = new AWS.Comprehend({region: 'us-west-2'});

const params = {
  Text: argv.Text,
}

if (argv._.includes('help')) {
  console.log(`
    You can utilize the following options when running this function:

    --Text=STRING (required)

    --detectEntities=BOOLEAN (optional)
    --detectSentiment=BOOLEAN (optional)
  `)
} else {
  comprehend.detectDominantLanguage(params, (err, data) => {
    let detectEntities = argv.detectEntities === 'true' ? true : false;
    let detectSentiment = argv.detectSentiment === 'true' ? true : false;
    if (err) {
      console.log(err, err.stack);
    } else {

      const Languages = data.Languages;

      const languageScore = Math.max.apply(Math, Languages.map(e => e.Score));

      const languageObject = Languages.find(e => e.Score == languageScore);

      const language = languageObject.LanguageCode;

      params.LanguageCode = language;

      if (detectEntities) {
        detectEntitiesFunction(params, comprehend).then(response => {
          console.log(response.LOG);
        })
      }

      if (detectSentiment) {
        detectSentimentFunction(params, comprehend).then(response => {
          console.log(response.LOG);
        });
      }
    }
  })
}
