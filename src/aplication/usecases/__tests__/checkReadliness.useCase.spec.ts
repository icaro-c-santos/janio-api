import { CheckReadinessUseCase } from '../checkReadliness.useCase';
import { ReadinessStatus, Service } from '../types';
import { IStorageService } from '../../../domain/interfaces/storage.interface';

describe('CheckReadinessUseCase', () => {
  let storageServiceMock: jest.Mocked<IStorageService>;
  let useCase: CheckReadinessUseCase;

  beforeEach(() => {
    storageServiceMock = {
      ping: jest.fn(),
    } as unknown as jest.Mocked<IStorageService>;
    useCase = new CheckReadinessUseCase(storageServiceMock);
  });

  it('should return READY when serviceStorage is up', async () => {
    storageServiceMock.ping.mockResolvedValue(true);

    const result = await useCase.execute();

    expect(result.status).toBe(ReadinessStatus.READY);
    expect(result.servicesOn).toContain(Service.STORAGE);
    expect(result.servicesDown).toHaveLength(0);
  });

  it('should return UNREADY when serviceStorage is down', async () => {
    storageServiceMock.ping.mockResolvedValue(false);

    const result = await useCase.execute();

    expect(result.status).toBe(ReadinessStatus.UNREADY);
    expect(result.servicesDown).toContain(Service.STORAGE);
    expect(result.servicesOn).toHaveLength(0);
  });

  it('should return UNREADY when throw erro', async () => {
    storageServiceMock.ping.mockRejectedValue(new Error('error not expected'));

    const result = await useCase.execute();

    expect(result.status).toBe(ReadinessStatus.UNREADY);
    expect(result.servicesOn).toHaveLength(0);
    expect(result.servicesDown).toHaveLength(0);
  });
});
