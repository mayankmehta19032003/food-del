import  express  from 'express';
import { addToCart, getCart, removeFromCart } from '../controllers/cartController.js';
import authMiddlerware from './../middleware/auth.js';


const cartRouter = express.Router();

cartRouter.post("/add",authMiddlerware,addToCart);
cartRouter.post("/remove",authMiddlerware,removeFromCart);
cartRouter.post("/get",authMiddlerware,getCart);

export default cartRouter;