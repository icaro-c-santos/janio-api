import { S3 } from 'aws-sdk';
import { IStorageService } from '../../modules/users/domain/storage.interface';
import { appConfig } from '../../config';

interface UploadParams {
  buffer: Buffer;
  key: string;
  contentType?: string;
}

interface DownloadUrlParams {
  path: string;
  expiresInSeconds?: number;
}

export class S3StorageService implements IStorageService {
  private readonly s3: S3;

  private readonly bucketName: string;

  constructor(bucketName: string) {
    this.bucketName = bucketName;
    this.s3 = new S3({
      endpoint: appConfig.MINIO_ENDPOINT,
      accessKeyId: appConfig.MINIO_ACCESS_KEY,
      secretAccessKey: appConfig.MINIO_SECRET_KEY,
      s3ForcePathStyle: true,
      signatureVersion: 'v4',
    });
  }

  async generateDownloadUrl({
    path,
    expiresInSeconds = 3600,
  }: DownloadUrlParams): Promise<string> {
    const url = await this.s3.getSignedUrlPromise('getObject', {
      Bucket: this.bucketName,
      Key: path,
      Expires: expiresInSeconds,
    });

    return url;
  }

  async ping(): Promise<boolean> {
    try {
      await this.s3.headBucket({ Bucket: this.bucketName }).promise();
      return true;
    } catch {
      return false;
    }
  }

  async uploadFile({ buffer, key, contentType }: UploadParams): Promise<void> {
    await this.s3
      .putObject({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      })
      .promise();
  }
}
