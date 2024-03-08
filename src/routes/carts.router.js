import { Router} from "express";
import CartsManager from "../cartsManager.js";

const router = Router()
const path = `./assets/Carts.json`
const cartsManager = new CartsManager(path)

router.get('/', async (req, res) => {
    let limit = +req.query.limit
    const carts = await cartsManager.getCarts()
    if(limit > 0) return res.json(carts.slice(0, limit))
    
    res.json(carts)
})

router.get('/:id', async (req, res) => {
    const id = +req.params.id
    const product = await cartsManager.findProductById(id)
    res.json(product)
});

router.post('/',async (req, res) => {
    const cart = req.body
    const cartCreado = await cartsManager.createCart(cart)
    res.status(201).json(cartCreado)
})

router.post('/:cid/product/:pid',async (req, res) => {
    const prod = req.body

    const cid = +req.params.cid
    const pid = +req.params.pid
    const cartCreado = await cartsManager.createProductInCart(prod, cid, pid)
    res.status(201).json(prod)
})


export default router