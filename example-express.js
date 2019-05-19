let config = require('config')

const cors = require('cors')
const express = require('express')

const app = express();

const { decrypt } = require('./index')

app.use(cors())

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.text({type: 'text/plain'}))
app.use(bodyParser.json({type: 'application/json'}))

decrypt(config, ['db.name', 'db.password'])
  .then(decrypted_config => {
    // AFTER DECODE DESIRED PARAMS, ASSIGN NEW VALUES TO GLOBAL CONFIG OBJ, SO YOU CAN USE IN YOUR MODULES CONFIG IN THE SAME WAY 
    config = Object.assign(config, decrypted_config)
    app.listen(process.env.NODE_PORT || 3000)    
  })
  .catch(err => {
    console.log("ERROR FROM CONFIG DECRYPTION => ", err)
  })
  

module.exports = app // FOR TESTING
