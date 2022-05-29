import { App } from './App.js'
import { ProductCard } from "./components/ProductCard.js";

//Cuando el DOM fue cargado entonces se crea una nueva instancia de la clase App
//App es la encargada de darle todo el funcionamiento a la aplicacion
document.addEventListener("DOMContentLoaded", () => {
  const app = new App({
    container: "#products-container",
    state: { products: [] },
    template: function(props){ //estas props son el state que le paso por parametro en el metodo render de la clase
      if(props.products.length < 1) return
      
      let allProductCards = props.products.map(product => {
        const productCard = new ProductCard({
          state: { product: product, variant: product.variants[0] }
        })

        return productCard.createTemplate()
      }).join("")

      return allProductCards
    }
  })

  app.getAllProducts()
})