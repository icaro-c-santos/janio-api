import { Bucket, Storage } from '@google-cloud/storage';
import { IStorageService } from '../../modules/users/domain/storage.interface';

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

  async ping() {
    try {
      const [value] = await this.bucket.exists();
      if (!value) throw new Error('BUCKET NOT EXISTS');
      return true;
    } catch {
      return false;
    }
  }

  async uploadFile({
    buffer,
    key,
    contentType,
  }: {
    buffer: Buffer;
    key: string;
    contentType?: string;
  }): Promise<void> {
    const file = this.bucket.file(key);
    await file.save(buffer, {
      contentType,
      resumable: false,
    });
  }
}
