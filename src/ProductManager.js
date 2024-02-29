import fs from 'fs';

export default class ProductManager {

    #products
    #path
    static #ultimoIdEvento = 1

    constructor(paths) {
        this.#path = paths;
    }

    async initialize() {
        this.#products = await this.getProductsFile();
    }
    
    async getProductsFile() {
        try {
            const usersFileContent = await fs.promises.readFile(this.#path, 'utf-8')
            return JSON.parse(usersFileContent)
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
            return ProductManager.#ultimoIdEvento
        } else {
            const producId = this.#products[this.#products.length - 1].id
            ProductManager.#ultimoIdEvento = producId + 1
            return ProductManager.#ultimoIdEvento
        }
    }



    async createProduct(title, description, price, thumbnail, code, stock) {


        // valida campos
        if (title === "" || description === "" || price === "" ||  price < 0 || thumbnail === "" || code === "" || stock === "") {
            console.log("verifique que los campos esten coorectos o llenos");
            return;
        }

        //  Valida que el codigo no exista       
        const valCode = this.#products.find(prod => prod.code === code);
        if (valCode) {
            console.error(`El code ${code} ya existe, favor poner un code nuevo`);
            return;
            // throw `Elllll code ${code} ya existe, favor poner un code nuevo`
        }
        //  Valida que el id no exista para no se repita
        let newId = this.#getNuevoId()
        const valId = this.#products.find( prod => prod.id === newId);
        if (valId) {
            newId = this.#getNuevoId()
        }


        const product = {
            id: newId,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }

        this.#products.push(product);

        await this.#updateFile();


    }



    async findProductById(productId) {
        try {
            this.#products = await this.getProductsFile();
            const prodctIndex = this.#products.find(prod => prod.id === productId)

            if (!prodctIndex) {
                throw 'The product does not exist'
            }

            return prodctIndex;

        } catch (error) {
            console.log(error);
            return [{error: 'The product does not exist'}];
        }
    }

    async updateProduct(productUpd) {
        try {

            const prodctIndex = this.#products.findIndex(prod => prod.id === productUpd.id)

            if (prodctIndex < 0) {
                throw 'Product id is not exist'
            }

            if (this.#products[prodctIndex].code != productUpd.code) {
                if (!this.validateCode(productUpd.code)) {
                    throw 'Product code can not update'
                }
            }

            const productData = { ...this.#products[prodctIndex], ...productUpd }
            this.#products[prodctIndex] = productData

            await this.#updateFile();

            return productData;

        } catch (exp) {
            console.log(exp);
            return [];
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


// module.exports = ProductManager

// //------ EJECUCION ------
// const main = async () => {
//     const manager = new ProductManager('./Products.json')
//     await manager.initialize() // carga los productos desde el archivo
    
//     // console.log('all products \n', await manager.getProductsFile())//mostrar los productos desde el archivo
    
//     // await manager.createProduct("titulo4", "descripcion4", 35, "Sin imagen", "abc1", 10) // crear producto

//     console.log('Find Product ', await manager.findProductById(10)); //encontrar producto

//     //actualiza producto enviendo un elemento    
//     // console.log('Product updated ', await manager.updateProduct(

//     //     {
//     //         id: 1,
//     //         title: 'titulo1',
//     //         description: 'descripcion1',
//     //         price: 35,
//     //         thumbnail: 'Sin imagen',
//     //         code: 'abc1',
//     //         stock: 10
//     //     }

//     // ));

//     console.log('all products \n', await manager.getProductsFile())//mostrar los productos desde el archivo
// }

// main()