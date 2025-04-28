import * as Minio from 'minio'

const minioClient = new Minio.Client({
  endPoint: 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: 'mRn79vVAOqUPrmxNccY2',
  secretKey: 'xKJySOmjxxH2Eelub9KBaj706qXCeT3cDTVuVWEK',
})

// File to upload
const sourceFile = './tmp/test-file.txt'

// Destination bucket
const bucket = 'js-test-bucket'

// Destination object name
const destinationObject = 'zxc/foo/bar/some/my-test-file.txt'


// Set the object metadata
var metaData = {
  'Content-Type': 'text/plain',
  'X-Amz-Meta-Testing': 1234,
  example: 5678,
}

// Upload the file with fPutObject
// If an object with the same name exists,
// it is updated with new data
const data = await minioClient.fPutObject(bucket, destinationObject, sourceFile, metaData)
console.log('File ' + sourceFile + ' uploaded as object ' + destinationObject + ' in bucket ' + bucket)
console.log(data)