import { App } from './App.js'
import { ProductCard } from "./components/ProductCard.js";

//Cuando el DOM fue cargado entonces se crea una nueva instancia de la clase App
//App es la encargada de darle todo el funcionamiento a la aplicacion
document.addEventListener("DOMContentLoaded", () => {
  const app = new App({
    container: "#products-container",
    state: { products: [], oldQuantity: 0, newQuantity: 0 },
    template: function(props){ //estas props las paso por parametro en el metodo render de la clase
      if(props.products.length < 1) return

      let allProductCards = props.products.filter((product, i) => {
        if(i >= props.oldQuantity && i < props.newQuantity) return product
      }).map(product => {
        const productCard = new ProductCard({
          state: { product: product, variant: product.variants[0] }
        })

        return productCard.createTemplate()
      }).join("")

      return allProductCards
    }
  })

  app.getAllProducts()

  document.getElementById("show-more-btn").addEventListener("click", () => app.updateQuantity())
})