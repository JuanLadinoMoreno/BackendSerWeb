import fs from 'fs';

export default class ProductManager {

    #products
    #path
    static #ultimoIdProduct = 1

    constructor(paths) {
        this.#path = paths;
    }

    async initialize() {
        this.#products = await this.getProductsFile();
    }
    
    async getProductsFile() {
        try {
            const productsFileContent = await fs.promises.readFile(this.#path, 'utf-8')
            return JSON.parse(productsFileContent)
        }
        catch (err) {
            console.log(err);
            return []
        }
    }

    async getProducts(){
        return await this.getProductsFile();
    }
    
    #getNuevoId() {
        if (this.#products.length === 0) {
            return ProductManager.#ultimoIdProduct
        } else {
            const producId = this.#products[this.#products.length - 1].id
            ProductManager.#ultimoIdProduct = producId + 1
            return ProductManager.#ultimoIdProduct
        }
    }

    validaDatos(produc){
        if((produc.ingrePrep === "" || !produc.ingrePrep) || 
            (produc.nombre === "" || !produc.nombre) ||
            (produc.pan === "" || !produc.pan) ||
            (isNaN(produc.precio) || produc.precio < 0) ||
            (produc.preparacion === "" || !produc.preparacion) ||
            (!produc.tipo || produc.tipo === "") ||
            (!produc.status || (produc.status != "true" && produc.status != "false") ) ||
            (isNaN(produc.stock) ||  produc.stock < 0) ){
            // console.log("Verifique que los campos esten coorectos o llenos");
            throw new Error(`Verifique que los campos esten coorectos o llenos`)
        }
    }


    // async createProduct(title, description, price, thumbnail, code, stock) {
    async createProduct(produc) {
        // this.initialize()
        this.#products = await this.getProductsFile();


        // valida campos
        this.validaDatos(produc)

        //  Valida que el codigo no exista       
        // const valCode = this.#products.find(prod => prod.code === code);
        // if (valCode) {
        //     console.error(`El code ${code} ya existe, favor poner un code nuevo`);
        //     return;
        //     // throw `Elllll code ${code} ya existe, favor poner un code nuevo`
        // }

        //  Valida que el id no exista para no se repita
        let newId = this.#getNuevoId()
        const valId = this.#products.find( prod => prod.id === newId);
        if (valId) {
            newId = this.#getNuevoId()
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

        const product = {id: newId, ...produc }

        
        this.#products.push(product);
        
        await this.#updateFile();
        
        // console.log('productooooooooo', produc.stock);
        return product


    }



    async findProductById(productId) {
        try {
            this.#products = await this.getProductsFile();
            // console.log('this.#products', this.#products);
            // console.log('this.#path', this.#path);
            const prodctIndex = this.#products.find(prod => prod.id === productId)

            if (!prodctIndex) {
                // throw 'The product does not existe'
                console.log('El producto a agregar no existe en el catalogo');
                return [];
            }

            return prodctIndex;

        } catch (error) {
            console.log(error, 'The product does not exist');
            return [];
        }
    }

    async updateProduct(id, prodUpd) {
        try {
            // console.log('prodUpd', prodUpd);
            this.#products = await this.getProductsFile();
            const prodctIndex = this.#products.findIndex(prod => prod.id === id)

            if (prodctIndex < 0) {
                throw new Error('Product is not exist') 
            }
            
            console.log('prodctIndex',prodctIndex);
            // console.log('productUpd',productUpd);
            
            // if (!productUpd != null) {
            //     throw new Error('Product is not exist') 
            // }

            //valida code
            // if (this.#products[prodctIndex].code != productUpd.code) {
            //     if (!this.validateCode(productUpd.code)) {
            //         throw 'Product code can not update'
            //     }
            // }
            if(prodUpd.id != id){
                throw new Error('Product id is not updated')
            }
            

            const productData = { ...this.#products[prodctIndex], ...prodUpd }
            this.#products[prodctIndex] = productData

            await this.#updateFile();

            console.log('productData', productData);
            return productData;

        } catch (exp) {
            console.log(exp);
            return [];
        }
    }

    async deleteProduct(id) {
        try {
            this.#products = await this.getProductsFile();
            const prodctIndex = this.#products.findIndex(prod => prod.id === id)
            // console.log('prod index', prodctIndex);

            if (prodctIndex < 0) {
                throw 'Product id is not exist'
            }

            // const productData = { ...this.#products[prodctIndex], ...productUpd }
            this.#products.splice(prodctIndex,1);
            // this.#products[prodctIndex] = productData

            await this.#updateFile();

            // return productData;

        } catch (exp) {
            console.log(exp);
            // return [];
        }
    }

    validateCode(code) {

        const valCode = this.#products.find(prod => prod.code === code);
        if (valCode) {
            throw `El code ${code} ya existe, favor poner un code nuevo`
        }
        return true;
    }

    async #updateFile() {
        await fs.promises.writeFile(this.#path, JSON.stringify(this.#products, null, '\t'))
    }
}
