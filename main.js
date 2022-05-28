import { Variant } from './components/Variant.js.js'
import ProductCard from './components/ProductCard.js'

const state = {
  products: [],
  variants: [],
}

const changeVariants = (variant, newOp) => {
  handleVariant(variant, newOp)

  let currentProduct = state.products.find(product => product.id === variant.getProductId())
  if(currentProduct === null) return

  let currentVariant = currentProduct.variants.find(v => v.id === variant.variantId)
  let color = currentVariant.option1.toLowerCase()

  let carousel = document.getElementById(`carousel${currentProduct.id}`)
  carousel.innerHTML = ''

  currentProduct.images.forEach(img => {
    if(img.alt === null) return

    if(img.alt.includes(color)){
      let image = `<img src="${img.src}" alt="${img.alt}" height="100" />`  
      carousel.innerHTML += image
    }
  })
  
  if(carousel.innerHTML === '') carousel.innerHTML += "No hay Stock"
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
    carousel.id = `carousel${product.id}`

    let currentVariant = product.variants.find(v => v.id === variant.variantId)

    let color = null;

    product.images.forEach(img => {
      if(img.alt === null) return

      if(color === currentVariant.option1.toLowerCase() || color === null) {
        if(img.alt.includes(currentVariant.option1.toLowerCase())){

          let image = document.createElement("img")
          image.src = img.src
          image.alt = img.alt
          image.height = 100
  
          carousel.appendChild(image)  
  
          color = currentVariant.option1.toLowerCase()        
          return
        }else{
          let i = currentVariant.position
          if(product.variants.length > i){
            handleVariant(variant, product.variants[i].option1)
            currentVariant = product.variants.find(v => v.id === variant.variantId)
          }
        }
      }
    })
    productCard.appendChild(carousel)

    product.options.forEach(op => {
      let option = document.createElement("div")
      option.id = op.id
      option.className = op.name.toLowerCase()

      op.values.forEach(val => {
        let button = document.createElement("button")
        button.onclick = () => changeVariants(variant, val)
        button.textContent = val

        option.appendChild(button)
      })

      productCard.appendChild(option)
    })

    fragment.appendChild(productCard)
  })

  return fragment
}

const getAllProducts = () => {
  fetch("./data/products.json")
  .then(response => response.json())
  .then(({ products }) => {
    state.products = products.filter(product => product.status === "active")  
    document.getElementById("products-container").appendChild(createAllProducts())
  })
  .catch(err => {
      document.getElementById("products-container").innerHTML = `
        <div class="error-container">
          <h2>Oops... Ocurrió un error</h2>
        </div>
      `
  })
}

window.onload = () => {
  getAllProducts()
}