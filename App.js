export class App {
  constructor({ container, state, template}){
    this.container = container
    this.state = state
    this.template = template
  }

  //Muestra en pantalla lo que retorne la funcion template()
  render(){
    const $container = document.querySelector(this.container)
    if(!$container) return
    $container.innerHTML += this.template(this.state)
  }

  setState(newState){
    for(let key in newState){
      if(this.state.hasOwnProperty(key)) this.state[key] = newState[key]
    }
    this.render()
  }

  getState(){
    return JSON.parse(JSON.stringify(this.state))
  }

  //Recoge todos los productos que se encuentran en products.json
  //Asigna al state solo aquellos productos que se encuentren activos
  getAllProducts = async () => {
    try{
      let response = await fetch("./data/products.json")
      let { products } = await response.json()
  
      if(!response.ok) throw {status: response.status, statusText: response.statusText}
  
      this.setState({ products: products.filter(product => product.status === "active") })
  
    }catch(err){
      document.querySelector(this.container).innerHTML = `
        <div class="error-container">
          <h2>Oops... Ocurrió un error</h2>
          <p>${err || "Error desconocido"}</p>
        </div>
      `
    }
  }
}