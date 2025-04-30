import * as Minio from "minio";

const minioClient = new Minio.Client({
  endPoint: 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: 'mRn79vVAOqUPrmxNccY2',
  secretKey: 'xKJySOmjxxH2Eelub9KBaj706qXCeT3cDTVuVWEK',
})

export {minioClient}