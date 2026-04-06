import express from 'express';
const router = express.Router();
import * as superAdminController from '../controller/superadminController.js';
import superauth from '../middlewares/superadminauth.js';

router.get("/", superauth, superAdminController.getAllUsers);
router.post("/", superauth, superAdminController.addUser);
router.put("/:id", superauth, superAdminController.updateUserById);
router.delete("/:id", superauth, superAdminController.deleteUserById);
router.patch("/:id/toggle", superauth, superAdminController.toggleUserStatusById);

export default router;