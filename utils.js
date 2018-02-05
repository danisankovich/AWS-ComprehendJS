const chalk = require('chalk');

const ColorIndex = {
  PERSON: 'green',
  LOCATION: 'red',
  ORGANIZATION: 'yellow',
  COMMERCIAL_ITEM: 'magenta',
  EVENT: 'cyan',
  DATE: 'magentaBright',
  QUANTITY: 'greenBright',
  TITLE: 'blueBright',
  OTHER: 'redBright',
};

const detectSentimentFunction = (parameters, comprehend) => {
  return new Promise((resolve, reject) => {
    comprehend.detectSentiment(parameters, (err, data) => {
      if (err) {
        reject(err);
      } else {
        const LOG = `
          ${chalk.bgRed(' SENTIMENT ANALYSIS ')}

          SCORES: {
              ${chalk.green("Positive")}: ${data.SentimentScore.Positive},
              ${chalk.red("Negative")}: ${data.SentimentScore.Negative},
              ${chalk.yellow("Neutral")}: ${data.SentimentScore.Neutral},
              ${chalk.magenta("Mixed")}: ${data.SentimentScore.Mixed},
          }

          SENTIMENT: ${chalk.cyan(data.Sentiment)}
          --------------------------------------------------`;

        resolve({
          data: data.SentimentScore,
          LOG
        })
      }
    });
  });
};

const detectEntitiesFunction = (parameters, comprehend) => {
  return new Promise((resolve, reject) => {
    comprehend.detectEntities(parameters, (err, data) => {
      if (err) {
        reject(err);
      } else {
        const EntitiesCollection = {};
        const types = [];

        const Entities = data.Entities;
        Entities.forEach(entity => {
          EntitiesCollection[entity.Type] = EntitiesCollection[entity.Type] || [];
          EntitiesCollection[entity.Type].push(entity.Text);
        });

        let stringItem = `{`;

        for (let key in EntitiesCollection) {
          stringItem += `
              ${chalk[ColorIndex[key]](key)}:
            \t${EntitiesCollection[key].sort().join('\n\t\t')}
          `;
        }

        const LOG = `
          ${chalk.bgRed(' Entity ANALYSIS ')}

          Entities: ${stringItem}}

          --------------------------------------------------`

        resolve({
          data: EntitiesCollection,
          LOG
        })
      }
    });
  });
}
module.exports = {
  detectSentimentFunction,
  detectEntitiesFunction
}
