const { mergeDeepRight, assocPath, split, path } = require('ramda')
const config = require('config')
const AWS = require('aws-sdk');
const kms = new AWS.KMS({ 
  region: path(['aws', 'region'], config) || 'us-east-1' //USE VALUE IN CONFIG IF EXIST, DEFAULT N.VIRGINIA
});

const kms_decrypt = (bufString) => {
    return new Promise((resolve, reject) => {
      const params = {
        CiphertextBlob: Buffer.from(bufString, "base64")
      }
      kms.decrypt(params, (err, data) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(data.Plaintext.toString())
        }
      })
  });
}

module.exports = {
  decrypt: (config, params) => {
    const mapped = params.map(param => {
      const splitted_params = split('.', param)
      const path_value = path(splitted_params, config)
      return kms_decrypt(path_value)
        .then(dec => {
          return Promise.resolve(assocPath(splitted_params, dec, {}))
        })
    })

    return Promise
      .all(mapped)
      .then(results => {
        const reduced_results = results.reduce((a, b) => {
          return mergeDeepRight(a, b)
        })
        const merged_config = mergeDeepRight(config, reduced_results)
        return Promise.resolve(merged_config)
      })    
  } 
}