
 import express from 'express'
 import ProductManager from '../src/ProductManager.js'


const PORT = 8080;

const expressServer = express();

const fileName = `./assets/Products.json`
const productManager = new ProductManager(fileName);

expressServer.get('/products', async (req, res) => {
    let limit = +req.query.limit
    const products = await productManager.getProducts();
    if (limit > 0) return res.json(products.slice(0, limit))

    res.json(products)

});
expressServer.get('/products/:id', async (req, res) => {
    const id = +req.params.id
    const product = await productManager.findProductById(id)
    res.json(product)
});


expressServer.listen(PORT, () => {
    console.log('Servidor preparado!!');
});




