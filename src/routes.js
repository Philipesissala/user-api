import { Router } from "express";
import UserController from "./app/controllers/UserController";

const router = new Router();

import AdminAuth from "./app/middleware/AdminAuth";

router.get("/user", UserController.index);
router.get("/user/:id", UserController.show);
router.post("/user", AdminAuth, UserController.store);
router.put("/user/:id", UserController.update);
router.delete("/user/:id", UserController.delete);
router.post("/recoverpassword", UserController.recoverPassword);
router.post("/changepassword", UserController.changePassword);
router.post("/login", UserController.login);

export default router;
