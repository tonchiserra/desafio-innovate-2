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

    this.createCarousel()
  }

  setState(newState){
    for(let key in newState){
      if(this.state.hasOwnProperty(key)) this.state[key] = newState[key]
    }
    this.render()
    document.getElementById("showing").innerHTML = `<p>Mostrando ${this.state.newQuantity > this.state.products.length ? this.state.products.length : this.state.newQuantity} de ${this.state.products.length} productos</p>`
  }

  //Crea el carousel de todos los productos
  createCarousel(){
    let prdcts = [...document.getElementById('products-container').children]
    prdcts.forEach((product, i) => {
      let el = document.getElementById(`${product.id}carousel`)

      if(i >= this.state.oldQuantity && i < this.state.newQuantity){
        const flkty = new Flickity( el, {
          cellAlign: 'left',
          contain: true,
          draggable: false
        })
      }
 
      //if(el.classList.contains('flickity-enabled')) return
    })
  }

  //Actualiza la cantidad de productos que se muestran en pantalla
  updateQuantity(){
    let showMoreBtn = document.getElementById("show-more-btn")
    this.setState({ oldQuantity: this.state.newQuantity, newQuantity: this.state.newQuantity + 8 })
    if(this.state.newQuantity >= this.state.products.length) showMoreBtn.style.display = "none"
  }

  //Recoge todos los productos que se encuentran en products.json
  //Asigna al state solo aquellos productos que se encuentren activos
  getAllProducts = async () => {
    try{
      let response = await fetch("./data/products.json")
      let { products } = await response.json()
  
      if(!response.ok) throw {status: response.status, statusText: response.statusText}
  
      this.setState({ products: products.filter(product => product.status === "active"), oldQuantity: 0, newQuantity: 8 })

    }catch(err){
      document.querySelector(this.container).innerHTML = `
        <div class="error-container">
          <h2>Oops... Ocurrió un error</h2>
          <p>${err.statusText || "Error desconocido"}</p>
        </div>
      `
    }
  }
}