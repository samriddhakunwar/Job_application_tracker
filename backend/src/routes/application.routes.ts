import { Router } from 'express';
import * as applicationController from '../controllers/application.controller';

const router = Router();

router.get('/', applicationController.list);
router.get('/:id', applicationController.getOne);
router.post('/', applicationController.create);
router.patch('/:id', applicationController.update);
router.delete('/:id', applicationController.remove);

export default router;
