# AWS ComprehendJS

To download and configure the package:

You will need to create an AWS account, create an IAM user, and configure
keys to your AWS config file to use Amazon Comprehend.
https://docs.aws.amazon.com/comprehend/latest/dg/auth-and-access-control.html


```
$ git clone https://github.com/mikesankovich/AWS-ComprehendJS.git

$ cd AWS-ComprehendJS

$ npm install

```


## to run the test:
```
$ node test.js --Text=STRING_TO_ANALYZE --detectEntities=BOOLEAN --detectSentiment=BOOLEAN
```
Text is required to run.

to include the DETECTOR function in your code:

```
const runAnalysis = require('./index').runAnalysis;

runAnalysis().then(res => {
  console.log(res)
})

```



detectEntities and detectSentiment are optional, but at least one must be included to get a response.

other options [ isLogged ]

isLogged: logs the output to the node console

## Sample Request/Response:

### REQUEST:
```

$ node test.js

--Text='It made me happy that The jumped over the fence in Seattle. Lancaster was a fun trip though, I really enjoyed it. I managed to buy a nice cookie at the mall down the street. Unfortunately I could not find a nice skirt to wear. My cousin Alex was unable to come to be to Blue Cross Blue Shield building though, and he instead went to Florida State University, where he studied for 3 years before transferring to Notre Dame yesterday. So yeah Blue Cross Blue Shield and FSU are cool'

--detectEntities=true
--detectSentiment=true
isLogged
```

### RESPONSE

```
{
  EntityData: {
    LOCATION: [ 'Lancaster', 'Seattle' ],
    PERSON: [ 'Alex' ],
    ORGANIZATION: [
      'Blue Cross Blue Shield',
      'Blue Cross Blue Shield',
      'FSU',
      'Florida State University',
      'Notre Dame'
    ],
    QUANTITY: [ '3 years' ],
    DATE: [ 'yesterday' ]
  },
  SentimentData: {
    Sentiment: 'POSITIVE',
    SentimentScore:
    {
      Positive: 0.7364290952682495,
      Negative: 0.035616688430309296,
      Neutral: 0.008683380670845509,
      Mixed: 0.21927079558372498
    }
  }
}
```
