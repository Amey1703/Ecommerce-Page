import { Router } from "express";
import { registerHandler, loginHandler,getLogin } from '../controllers/auth.js';

const router = new Router();

router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.get("/login", getLogin);



export default router;
