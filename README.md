# BackendSerWeb

ejemplo de crear producto
{
    "ingrePrep": "Lengua de res marinada",
    "nombre": "Baguette de Lengua de res",
    "pan": "Pan Baguette Integral",
    "precio": 60,
    "preparacion": "Lengua de res",
    "tipo": "bagP",
    "thumbnail": "../public/img/menu/baguettes/baguet.png",
    "vegetales": [
        {
            "id": "4",
            "nombre": "aguacate"
        },
        {
            "id": "5",
            "nombre": "frijoles"
        },
        {
            "id": "6",
            "nombre": "lechuga"
        },
        {
            "id": "3",
            "nombre": "rajas"
        }
    ],
    "status": "true",
    "stock": 10
}

ejemplo para la ruta:
http://localhost:8080/api/carts/:cid/product/:pid

actualiza la cantidad
http://localhost:8080/api/carts/2/product/12
{
          
      "pid": 12,
      "quantity": 10
          
}

crea nuevo producto en cart
http://localhost:8080/api/carts/2/product/13
{
          
      "pid": 13,
      "quantity": 10
          
}

(tomar en cuenta q estos id son de ejemplo ya que para los id de los cart se hace aleatorio con numeros y letras)


