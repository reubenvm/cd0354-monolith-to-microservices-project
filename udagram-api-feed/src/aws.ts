import AWS = require('aws-sdk');
import {config} from './config/config';


// Configure AWS
const credentials = new AWS.SharedIniFileCredentials({profile: config.aws_profile});
AWS.config.credentials = credentials;

export const s3 = new AWS.S3({
  signatureVersion: 'v4',
  region: config.aws_region,
  params: {Bucket: config.aws_media_bucket},
});

// Generates an AWS signed URL for retrieving objects
export function getGetSignedUrl( key: string ): string {
  const signedUrlExpireSeconds = 60 * 5;

  // console.log('AWS media bucket: ' + config.aws_media_bucket)
  // console.log('AWS region: ' + config.aws_region)
  // console.log('AWS profile: ' + config.aws_profile)
  // console.log('AWS acces key: ' + credentials.accessKeyId)
  // console.log('AWS secret access key: ' + credentials.secretAccessKey)

  s3.config.update({
    accessKeyId: config.access_key_id,
    secretAccessKey: config.secret_access_key
  })

  // s3.config.update({
  //   accessKeyId: config.access_key_id,
  //   secretAccessKey: config.secret_access_key
  // })

  return s3.getSignedUrl('getObject', {
    Bucket: config.aws_media_bucket,
    Key: key,
    Expires: signedUrlExpireSeconds,
  });
}

// Generates an AWS signed URL for uploading objects
export function getPutSignedUrl( key: string ): string {
  const signedUrlExpireSeconds = 60 * 5;

  return s3.getSignedUrl('putObject', {
    Bucket: config.aws_media_bucket,
    Key: key,
    Expires: signedUrlExpireSeconds,
  });
}
