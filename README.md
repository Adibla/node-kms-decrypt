# Node KMS decrypt
Node KMS decrypt is a library which aims to easily decipher all (or some) of your config params, previusly encrypted using AWS KMS
## Quickstart 
```shell
npm install node-kms-decrypt
```

```javascript
/* config
  {
    "db": {
      "name": "encoded",
      "password": "encoded"
    },
    "aws": {
      "region": "us-east-2"
    }
  }
*/
const config = require('config')
const { decrypt } = require('node-kms-decrypt')

const properties_to_decrypt = ['db.name', 'db.password']

decrypt(config, properties_to_decrypt)
    .then(decrypted => {
        console.log(decrypted)
    })
```
Using async await
```javascript
const config = require('config')
const { decrypt } = require('node-kms-decrypt')

const properties_to_decrypt = ['db.name', 'db.password']

const decrypted = await decrypt(config, properties_to_decrypt)
```

Decrypt and assign to new global config object before start express server
```javascript
let config = require('config')

const cors = require('cors')
const express = require('express')

const app = express();

const { decrypt } = require('node-kms-decrypt')

const properties_to_decrypt = ['db.name', 'db.password']

app.use(cors())

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.text({type: 'text/plain'}))
app.use(bodyParser.json({type: 'application/json'}))

decrypt(config, ['db.name', 'db.password'])
  .then(decrypted_config => {
    config = Object.assign(config, decrypted_config)
    app.listen(process.env.NODE_PORT || 3000)    
  })
  .catch(err => {
    console.log("ERROR FROM CONFIG DECRYPTION => ", err)
  })
  

module.exports = app
```

* `config` - (Object) Json object with encrypted properties
* `properties_to_decrypt` - (String | Array[]) array of properties to decrypt, example: ['db.password', 'db.user']

You must start your application passing your aws profile with IAM role authorized to decrypt your data through command line, example:
NODE_ENV=test AWS_PROFILE=example node index.js
Otherwise you can pass it as third parameter (NOT RECCOMENDED)

### Dependencies

Node KMS decrypt uses a number of open source projects to work properly:

* [RamdaJS](https://ramdajs.com) - A practical functional library for JavaScript programmers. 
* [AWS Sdk](https://aws.amazon.com/it/sdk-for-node-js)
