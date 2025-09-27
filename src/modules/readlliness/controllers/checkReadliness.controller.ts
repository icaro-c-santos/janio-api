import { Request, Response } from 'express';
import { ReadinessStatus } from '../usecases/types';
import { CheckReadinessUseCase } from '../usecases/check-readliness.useCase';

export class CheckReadinessController {
  constructor(private checkReadinessUseCase: CheckReadinessUseCase) {}

  async readiness(req: Request, res: Response) {
    const result = await this.checkReadinessUseCase.execute();
    res
      .status(result.status === ReadinessStatus.READY ? 200 : 503)
      .json(result);
  }
}
