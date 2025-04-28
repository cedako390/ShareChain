import * as Minio from 'minio'

const minioClient = new Minio.Client({
  endPoint: 'play.min.io',
  port: 9000,
  useSSL: true,
  accessKey: 'mRn79vVAOqUPrmxNccY2',
  secretKey: 'xKJySOmjxxH2Eelub9KBaj706qXCeT3cDTVuVWEK',
})