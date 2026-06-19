import { NextFunction, Request, Response } from 'express';
import * as applicationService from '../services/application.service';
import { HttpError } from '../middleware/errorHandler';
import {
  createApplicationSchema,
  updateApplicationSchema,
  listQuerySchema,
} from '../validators/application.validator';

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const query = listQuerySchema.parse(req.query);
    const result = await applicationService.getApplications(query);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getOne(req: Request, res: Response, next: NextFunction) {
  try {
    const application = await applicationService.getApplicationById(req.params.id);
    if (!application) {
      throw new HttpError(404, 'Application not found');
    }
    res.json(application);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createApplicationSchema.parse(req.body);
    const application = await applicationService.createApplication(data);
    res.status(201).json(application);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const data = updateApplicationSchema.parse(req.body);
    const application = await applicationService.updateApplication(req.params.id, data);
    res.json(application);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await applicationService.deleteApplication(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
