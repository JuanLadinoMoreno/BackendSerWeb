import fs from 'fs'
import ProductManager from './ProductManager.js'

const productManager = new ProductManager('./assets/Products.json')

export default class CartsManager {
    #carts
    #path
    static #ultimoCart = 1




    constructor(path) {
        this.#path = path
    }

    async getCartsFile() {
        try {
            const cartsFileContent = await fs.promises.readFile(this.#path, 'utf-8')
            return JSON.parse(cartsFileContent)
        }
        catch (err) {
            console.log(err);
            return []
        }
    }

    async getCarts() {
        return await this.getCartsFile()
    }

    #genId() {
        const arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'ñ', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        let code = "";

        for (let i = 0; i < 10; i++) {
            code += arr[(Math.random() * (arr.length - 1)).toFixed(0)];
        }

        return code;
    }

    async #updateFile() {
        await fs.promises.writeFile(this.#path, JSON.stringify(this.#carts, null, '\t'))
    }


    async createCart(cart) {
        // this.initialize()
        this.#carts = await this.getCartsFile();


        // valida campos
        // this.validaDatos(produc) //OOOJJJJJJOO

        //  Valida que el codigo no exista       
        // const valCode = this.#products.find(prod => prod.code === code);
        // if (valCode) {
        //     console.error(`El code ${code} ya existe, favor poner un code nuevo`);
        //     return;
        //     // throw `Elllll code ${code} ya existe, favor poner un code nuevo`
        // }

        // if (cart.products.quantity == "") {
        //     console.log('asdasdlkjoluasldpojasdkljañlksdjakñsjdlkajsñdioajsdlkj');
        //     // cart.products.quantity = 0
        // }

        //  Valida que el id no exista para no se repita
        let newId = this.#genId()
        const valId = this.#carts.find(cart => cart.cid === newId);
        if (valId) {
            newId = this.#genId()
        }


        // const product = {
        //     id: newId,
        //     title,
        //     description,
        //     price,
        //     thumbnail,
        //     code,
        //     stock
        // }

        const cartIn = { cid: newId, ...cart }


        this.#carts.push(cartIn);

        await this.#updateFile();

        // console.log('productooooooooo', produc.stock);
        return cartIn


    }

    async findCarttById(cartId) {
        try {
            this.#carts = await this.getCartsFile();
            const cartIndex = this.#carts.find(cat => cat.id === cartId)

            if (!cartIndex) {
                throw 'The product does not exist'
            }

            return cartIndex;

        } catch (error) {
            console.log(error);
            return [{ error: 'The product does not exist' }];
        }
    }

    async createProductInCart(prod, cid, pid) {
        this.#carts = await this.getCartsFile();

        //valida que el producto exista en la lista de productos
        const product = await productManager.findProductById(pid)

        // console.log('product', product);

        // if (!product) throw new Error('El producto no existe')
        if(product.length == []) return console.log('El producto selecionado no se puede modificar')

        const cartFindindex = this.#carts.findIndex(carts => carts.cid === cid)
        // console.log('cartFindindex', cartFindindex);

        //verifica que exista el id del carrito exista en la lista de carts
        const cartFind = this.#carts.find(carts => carts.cid === cid)
        // console.log('cartFind', cartFind);

        // console.log('prod.pid', prod.pid);

        const find = cartFind.products.findIndex(p => p.pid == pid)

        // console.log('findddddddddd', find);

        // verifica si el producto existe
        if (find > 0) {
            // if(cartFind.products.pid === prod.pid){
            // const prodFind = cartFind.products.find(prod => prod.pid === prod.pid)
            // prodFind.quantity += prod.quantity
            // console.log('prodFind', prodFind);


            const prodFind = cartFind.products.findIndex(prod => prod.pid === pid)
            // console.log('prodFind', prodFind);
            const dd = this.#carts[cartFindindex].products[prodFind].quantity + prod.quantity
            // console.log('dddddddd', dd);

            // console.log('...this.#carts[cartFindindex]', this.#carts[cartFindindex].products[prodFind].quantity);

            this.#carts[cartFindindex].products[prodFind].quantity = dd
            // console.log('this.#carts', this.#carts[cartFindindex].products[prodFind].quantity);

            const productData = { ...this.#carts[cartFindindex], prodFind }
            // console.log('productData', productData);
            await this.#updateFile();
        } else {
            // console.log('no existe');

            // falta verificar que el producto exista
            const prodFindInx = cartFind.products.findIndex(prod => prod.pid === pid)
            // console.log('prodFindInx', prodFindInx);
            // console.log('this.#carts', this.#carts[cartFindindex].products[cartFindindex]);

            this.#carts[cartFindindex].products.push(prod)
            await this.#updateFile();
        }

        // const oo = findProd.find(p => p.pid === prod.pid)
        // this.#carts[cartFindindex]

    }

}

