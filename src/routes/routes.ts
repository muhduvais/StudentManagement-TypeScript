import express, { Router, Request, Response, NextFunction } from 'express';
import adminController from '../controller/adminController';
import nocache from 'nocache';

const router: Router = Router();

router.use(nocache());

router.get("/", (req: Request, res: Response) => {
    res.redirect('/adminLogin');
});

router.get("/adminLogin", adminController.toAdminLogin);
router.post('/adminLogin', adminController.checkLogin);
router.get("/adminHome", adminController.fromAdminHome);
router.post("/addUser", adminController.addUser);
router.patch("/editUser/:id", adminController.editUser);
router.post("/deleteUser/:id", adminController.deleteUser);
router.get("/adminLogout", adminController.adminLogout);

export default router;