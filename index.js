class Variant {
  constructor(productId, variantId, op1, op2){
    this.productId = productId
    this.variantId = variantId
    this.op1 = op1
    this.op2 = op2
  }

  setVariantId(newVariantId) {
    this.variantId = newVariantId
  }

  setOp1(newOp1) {
    this.op1 = newOp1
  }

  setOp2(newOp2) {
    this.op2 = newOp2
  }

  getProductId() {
    return this.productId
  }

  getOp1() {
    return this.op1
  }

  getOp2() {
    return this.op2
  }
}

const handleVariant = (variant, newOp) => {

  let currentProduct = state.products.find(product => product.id === variant.getProductId())
  if(currentProduct === null) return

  if(currentProduct.variants.find(v => v.option1 === newOp)){
    variant.setOp1(newOp)
  }
  if(currentProduct.variants.find(v => v.option2 === newOp)){
    variant.setOp2(newOp)
  }

  let currentVariant = currentProduct.variants.find(v => v.option1 === variant.getOp1() && v.option2 === variant.getOp2())
  
  variant.setVariantId(currentVariant.id)

  console.log(currentVariant)
}

const createAllProducts = () => {
  let fragment = document.createDocumentFragment()

  state.products.forEach(product => {
    let variant = new Variant(product.variants[0].product_id, product.variants[0].id, product.variants[0].option1, product.variants[0].option2)
    state.variants.push(variant)

    let productCard = document.createElement("article")
    productCard.id = product.id
    productCard.className = "product-card"

    let carousel = document.createElement("div")
    carousel.className = "main-carousel"

    let currentVariant = product.variants.find(v => v.id === variant.variantId)

    product.images.forEach(img => {
      if(img.alt === null) return

      //Cambiar! Cuando el alt es nulo es porque no hay esa variante

      if(!img.alt.includes(currentVariant.option1.toLowerCase())) return
      
      //Corregir! Hay imagenes que no incluyen el color
      //Posible solucion => Cambiar la variante
      //O sea, si no existe ese color entonces es porque no hay stock
      //Entonces al cambiar la variante se cambia el alt que tiene que leer

      let image = document.createElement("img")
      image.src = img.src
      image.alt = img.alt
      image.height = 100

      carousel.appendChild(image)
    })
    productCard.appendChild(carousel)

    product.options.forEach(op => {
      let option = document.createElement("div")
      option.id = op.id
      option.className = op.name.toLowerCase()

      op.values.forEach(val => {
        if(val === "00") return
        let button = document.createElement("button")
        button.onclick = () => handleVariant(variant, val)
        button.textContent = val

        option.appendChild(button)
      })

      productCard.appendChild(option)
    })

    fragment.appendChild(productCard)
  })

  return fragment
}

const state = {
  products: [],
  variants: [],
}

const getAllProducts = () => {
  fetch("./data/products.json")
  .then(response => response.json())
  .then(({ products }) => {
    state.products = products.filter(product => product.status === "active")  
    document.getElementById("products-container").appendChild(createAllProducts())
  })
  .catch(err => {
      console.log(err)
  })
}

window.onload = () => {
  getAllProducts()
}