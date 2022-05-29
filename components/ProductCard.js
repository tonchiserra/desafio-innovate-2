export class ProductCard {
  constructor({ state }) {
    this.state = state
    document.addEventListener("click", e => {
      if(e.target.className !== 'option-btn') return

      this.state.product.options.forEach(op => {
        if(e.target.id !== op.id + e.target.textContent) return
        this.changeVariant(e.target.textContent)
      })
    })
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

  //Muestra en pantalla lo que retorne la funcion createTemplate
  render() {
    document.getElementById(this.state.product.id).innerHTML = this.createTemplate()
  }

  //Crea el template del producto
  createTemplate(){
    let template = `
      <article class="product-card" id="${this.state.product.id}">
        <div class="main-carousel">
          ${this.state.product.images.filter(img => img.alt !== null && img.alt.includes(this.state.variant.option1.toLowerCase())).map(img => `<img src="${img.src}" alt="${img.alt}" width="400" loading="lazy" />`).join("")}
        </div>
        ${
          this.state.product.options.map(op => `
            <div class="${op.name.toLowerCase()}">
              ${
                op.values.map(value => `<button class="option-btn" id="${op.id + value}">${value}</button>`).join("")
              }
            </div>
          `).join("")
        }
      </article>
    `
    return template
  }

  changeVariant(newOp) {  
    let op1, op2

    if(this.state.product.variants.find(v => v.option1 === newOp)) {
      op1 = newOp
      op2 = this.state.variant.option2
    }
    if(this.state.product.variants.find(v => v.option2 === newOp)) {
      op1 = this.state.variant.option1
      op2 = newOp
    }

    let newVariant = this.state.product.variants.find(v => v.option1 === op1 && v.option2 === op2)

    if(!newVariant) newVariant = this.state.product.variants.find(v => v.option1 === op1)

    this.setState({ variant: newVariant })
  }
}