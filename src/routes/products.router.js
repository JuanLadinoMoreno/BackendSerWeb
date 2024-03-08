import {Router} from 'express'
import ProductManager from '../ProductManager.js';
// import ProductManager from  'src/ProductManager.js'


const router = Router()

const fileName = `./assets/Products.json`
// const fileName = `${_dirname}/../../assets/Products.json`
const productManager = new ProductManager(fileName);



router.get('/', async (req, res) => {
    let limit = +req.query.limit
    const products = await productManager.getProducts();
    if (limit > 0) return res.json(products.slice(0, limit))

    res.json(products)

    // console.log('get products');

});
router.get('/:id', async (req, res) => {
    const id = +req.params.id
    const product = await productManager.findProductById(id)
    res.json(product)
});

router.post('/', async (req, res) => {
    const product = req.body
    const prodCreado = await productManager.createProduct(product);
    res.status(201).json(prodCreado)
})

router.put('/:id', async (req, res) => {
    const productId = +req.params.id
    const product = req.body
    const prodUpd = await productManager.updateProduct(productId, product);
    res.status(201).json(prodUpd)
})

router.delete('/:id', async (req, res) => {
    await productManager.deleteProduct(+req.params.id);
    res.status(200)
})


export default router
// module.exports = router



// {
//     "ingrePrep": "Lengua de res marinada",
//     "nombre": "Baguette de Lengua de res",
//     "pan": "Pan Baguette Integral",
//     "precio": 60,
//     "preparacion": "Lengua",
//     "tipo": {
//         "id": "bagP",
//         "nombre": "baguette",
//         "url": "../public/img/menu/baguettes/baguet.png"
//     },
//     "thumbnails": "../public/img/menu/baguettes/baguet.png",
//     "vegetales": [
//         {
//             "id": "4",
//             "nombre": "aguacate"
//         },
//         {
//             "id": "5",
//             "nombre": "frijoles"
//         },
//         {
//             "id": "6",
//             "nombre": "lechuga"
//         },
//         {
//             "id": "3",
//             "nombre": "rajas"
//         }
//     ],
//     "status": "true",
//     "stock": 0
// },