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
          data: {...data},
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

const detectRoot = async (argv, comprehend) => {
  const params = {
    Text: argv.Text,
  }

  const isLogged = argv._.includes('isLogged');
  const DATA = {};
  // return new Promise((resolve, reject) => {
  let data;
  try {
    data = await comprehend.detectDominantLanguageAsync(params);
  } catch (err) {
    throw new Error(err);
  }

  const detectEntities = argv.detectEntities === ('true' || true) ? true : false;
  const detectSentiment = argv.detectSentiment === ('true' || true) ? true : false;

  const Languages = data.Languages;

  const languageScore = Math.max.apply(Math, Languages.map(e => e.Score));

  const languageObject = Languages.find(e => e.Score == languageScore);

  const language = languageObject.LanguageCode;

  params.LanguageCode = language;

  if (detectEntities) {
    await detectEntitiesFunction(params, comprehend).then(response => {
      if (isLogged) console.log(response.LOG);
      DATA.EntityData = response.data;
    })
  }

  if (detectSentiment) {
    await detectSentimentFunction(params, comprehend).then(response => {
      if (isLogged) console.log(response.LOG);
      DATA.SentimentData = response.data;
    });
  }
  return await DATA;
}

module.exports = { detectRoot }
