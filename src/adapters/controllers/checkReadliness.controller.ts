import { Request, Response } from 'express';
import { CheckReadinessUseCase } from '../../aplication/usecases/checkReadliness.useCase';
import { ReadinessStatus } from '../../aplication/usecases/types';

export class CheckReadinessController {
  constructor(private checkReadinessUseCase: CheckReadinessUseCase) {}

  async readiness(req: Request, res: Response) {
    const result = await this.checkReadinessUseCase.execute();
    res
      .status(result.status === ReadinessStatus.READY ? 200 : 503)
      .json(result);
  }
}
