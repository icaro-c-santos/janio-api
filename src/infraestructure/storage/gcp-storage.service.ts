import { Bucket, Storage } from '@google-cloud/storage';
import { IStorageService } from '../../domain/interfaces/storage.interface';

export class GCPStorageService implements IStorageService {
  private readonly storage: Storage;

  private readonly bucket: Bucket;

  constructor(bucketName: string, storage: Storage = new Storage()) {
    this.storage = storage;
    this.bucket = this.storage.bucket(bucketName);
  }

  async generateDownloadUrl({
    path,
    expiresInSeconds = 3600,
  }: {
    path: string;
    expiresInSeconds?: number;
  }): Promise<string> {
    const file = this.bucket.file(path);
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + expiresInSeconds * 1000,
    });

    return url;
  }

  async uploadFile({
    buffer,
    path,
    contentType,
  }: {
    buffer: Buffer;
    path: string;
    contentType?: string;
  }): Promise<void> {
    const file = this.bucket.file(path);
    await file.save(buffer, {
      contentType,
      resumable: false,
    });
  }
}
