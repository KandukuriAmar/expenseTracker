import express from 'express';
const router = express.Router();
import * as superAdminController from '../controller/superadminController.js';
import superauth from '../middlewares/superadminauth.js';

router.get("/", superauth, superAdminController.getAllUsers);
router.get("/with-balance", superauth, superAdminController.getAllUsersWithBalance);
router.get("/password-reset-requests", superauth, superAdminController.getPasswordResetRequests);
router.post("/", superauth, superAdminController.addUser);
router.put("/:id", superauth, superAdminController.updateUserById);
router.delete("/:id", superauth, superAdminController.deleteUserById);
router.patch("/:id/toggle", superauth, superAdminController.toggleUserStatusById);
router.patch("/password-reset/:requestId", superauth, superAdminController.resolvePasswordReset);

export default router;