import { v4 as uuid } from 'uuid';
import { IStorageService } from '../../../users/domain/storage.interface';

export class ReceiptExpenseService {
  constructor(private storage: IStorageService) {}

  async upload(file: Express.Multer.File): Promise<string> {
    const uniqueId = uuid();
    const extension = file.originalname.split('.').pop() || 'pdf';
    const key = `receipts/${uniqueId}.${extension}`;

    await this.storage.uploadFile({
      buffer: file.buffer,
      key,
      contentType: file.mimetype,
    });

    return key;
  }

  async getUrl(key: string): Promise<string> {
    return this.storage.generateDownloadUrl({ path: key });
  }
}
