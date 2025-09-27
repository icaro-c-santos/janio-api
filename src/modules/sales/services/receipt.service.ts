import { v4 as uuid } from 'uuid';
import { IStorageService } from '../../users/domain/storage.interface';
import { slugify } from '../../../shared/slugify';
import { CustomerDomain } from '../../customers/domain/customer.interface';

export class ReceiptService {
  constructor(private storage: IStorageService) {}

  private getCustomerName(customer: CustomerDomain): string {
    return (
      customer?.user?.company?.legalName ||
      customer?.user?.individual?.fullName ||
      'any'
    );
  }

  async upload(
    file: Express.Multer.File,
    customer: CustomerDomain,
  ): Promise<string> {
    const customerName = this.getCustomerName(customer);
    const uniqueId = uuid();
    const extension = file.originalname.split('.').pop() || 'pdf';
    const key = `receipts/${slugify(customerName)}_${uniqueId}.${extension}`;

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
