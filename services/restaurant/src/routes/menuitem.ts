import express from 'express';
import { isAuth, isSeller } from '../middlewares/isAuth.js';
import { addMenuItem, deleteMenuItem, toggleMenuItemAvailabilty } from '../controllers/menuitem.js';
const router = express.Router();

router.post('/new', isAuth,isSeller,addMenuItem);
router.get("all/:id", isAuth, addMenuItem);
router.delete("/:id", isAuth, isSeller,deleteMenuItem);
router.put("/status/:id", isAuth, isSeller,toggleMenuItemAvailabilty);



export default router;