export interface IStorageService {
  uploadFile(args: {
    buffer: Buffer;
    path: string;
    contentType?: string;
  }): Promise<void>;

  ping(): Promise<any>;

  generateDownloadUrl(args: {
    path: string;
    expiresInSeconds?: number;
  }): Promise<string>;
}
