import express from "express";
import { getMessage, sendMessage } from "../controllers/message.controller.js";
import protectRoute from '../middleware/protectRoute.js';

const router = express.Router();

// Route for getting messages with authentication
router.get("/:id", protectRoute, getMessage);

// Route for sending a message with authentication
router.post("/send/:id", protectRoute, sendMessage);

export default router;




//backup 

// import express from "express";
// import { getMessage, sendMessage } from "../controllers/message.controller.js";
// import protectRoute from '../middleware/protectRoute.js'

// const router = express.Router();

// router.get("/:id",protectRoute,getMessage);
// router.post("/send/:id",protectRoute,sendMessage);

// export default router;