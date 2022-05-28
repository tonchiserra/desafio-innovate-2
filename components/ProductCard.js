export class ProductCard extends HTMLElement {
  static get observedAttributes(){
    return ['state']
  }

  constructor() {
    super()
    this.state = {product: {}, variant: {}}
  }

  connectedCallback(){
    this.setState(this.getState())
    //document.addEventListener("click", this.handleClick)
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    this.render()
  }

  //Muestra en pantalla lo que retorne la funcion createTemplate
  render() {
    //console.log(this.state)
    //this.innerHTML = this.createTemplate()
  }

  handleClick(event) {
    if(event.target.className !== 'option-btn') return
    
    let newOp = event.target.textContent
    
    let op1, op2
    if(this.state.product.variants.find(v => v.option1 === newOp)) {
      op1 = newOp
      op2 = this.state.variant.option2
    }else{
      op1 = this.state.variant.option1
      op2 = newOp
    }

    let newVariant = this.state.product.variants.find(v => v.option1 === op1 && v.option2 === op2)

    console.log(newVariant)

    //this.setState({ state: newVariant })
  }

  //Crea el template del producto
  createTemplate(){
    let template = `
      <article class="product-card" id="${this.state.product.id}">
        <div class="main-carousel">
          ${this.state.product.images.filter(img => img.alt !== null && img.alt.includes(this.state.variant.option1.toLowerCase())).map(img => `<img src="${img.src}" alt="${img.alt}" height="100" />`).join("")}
        </div>
        ${
          this.state.product.options.map(op => `
            <div class="${op.name.toLowerCase()}">
              ${op.values.map(value => `<button class="option-btn">${value}</button>`).join("")}
            </div>
          `).join("")
        }
      </article>
    `
    return template
  }

  setState(newState){
    for(let key in newState){
      if(this.state.hasOwnProperty(key)) this.state[key] = newState[key]
    }
    this.render()
  }

  getState(){
    console.log(this.getAttribute('state'))
    return JSON.parse(JSON.stringify(this.getAttribute('state')))
  }
}

window.customElements.define('product-card', ProductCard)

/*export class ProductCard {
  constructor({ state }) {
    this.state = state
    document.addEventListener("click", this.handleClick)
  }

  //Muestra en pantalla lo que retorne la funcion createTemplate
  render() {
    this.innerHTML = this.createTemplate()
  }

  handleClick(event) {
    if(event.target.className !== 'option-btn') return
    
    let newOp = event.target.textContent
    
    let op1, op2
    if(this.state.product.variants.find(v => v.option1 === newOp)) {
      op1 = newOp
      op2 = this.state.variant.option2
    }else{
      op1 = this.state.variant.option1
      op2 = newOp
    }

    let newVariant = this.state.product.variants.find(v => v.option1 === op1 && v.option2 === op2)

    console.log(newVariant)

    this.setState({ state: newVariant })
  }

  //Crea el template del producto
  createTemplate(){
    let template = `
      <article class="product-card" id="${this.state.product.id}">
        <div class="main-carousel">
          ${this.state.product.images.filter(img => img.alt !== null && img.alt.includes(this.state.variant.option1.toLowerCase())).map(img => `<img src="${img.src}" alt="${img.alt}" height="100" />`).join("")}
        </div>
        ${
          this.state.product.options.map(op => `
            <div class="${op.name.toLowerCase()}">
              ${op.values.map(value => `<button class="option-btn">${value}</button>`).join("")}
            </div>
          `).join("")
        }
      </article>
    `
    return template
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

  //Cambia el valor "variant" del state
  changeVariant(newOp){
    console.log('newOp')
    let op1, op2
    if(this.state.product.variants.find(v => v.option1 === newOp)) {
      op1 = newOp
      op2 = this.state.variant.option2
    }else{
      op1 = this.state.variant.option1
      op2 = newOp
    }

    let newVariant = this.state.product.variants.find(v => v.option1 === op1 && v.option2 === op2)

    console.log(newVariant)

    this.setState({ state: newVariant })
  }
}*/