import { Router } from "express";
import { verifyAccessJWT } from "../middlewares/authMiddlewares.js";
import wrapAsync from "../common/utils/wrapAsync.js";
import { getAllClasses, getClass } from "../controllers/classControllers.js";
const router = Router();

// protected routes
router.get("/my-classes/:userType", verifyAccessJWT, wrapAsync(getAllClasses));

router.get("/:c_id", verifyAccessJWT, wrapAsync(getClass));

export default router;
