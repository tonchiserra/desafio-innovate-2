export class ProductCard {
  constructor({ state }) {
    this.state = state

    document.addEventListener("click", e => {
      if(e.target.className !== 'option-btn') return

      this.state.product.options.forEach(op => {
        if(e.target.id !== op.id + e.target.id.slice(13)) return
        this.changeVariant(e.target.id.slice(13))
      })
    })

    document.addEventListener("mouseover", e => {
      if(e.target.className !== 'option-btn') return

      this.state.product.options.forEach(op => {
        if(e.target.id !== op.id + e.target.id.slice(13)) return
        if(e.target.offsetParent.id !== "option-container1") return
        this.showStock(e.target)
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

    this.createCarousel()
  }

  //Crea el carousel de un producto en especifico cuando se actualiza su variante
  createCarousel(){
    let el = document.getElementById(`${this.state.product.id}carousel`)
    const flkty = new Flickity( el, {
      cellAlign: 'left',
      contain: true
    })
  }

  //Crea el template del producto
  createTemplate(){
    let template = `
      <article class="product-card" id="${this.state.product.id}">
        <button class="fav-btn" onclick="document.getElementById('${this.state.product.id}favbtnpath').classList.toggle('fav-btn-clicked');">
          <svg xmlns="http://www.w3.org/2000/svg" width="21.151" height="28.022" viewBox="0 0 21.151 28.022">
            <path id="${this.state.product.id}favbtnpath" data-name="Icon weather-lightning" d="M9.552,35.114h.588L20.5,19.777q.2-.407-.226-.407H16l4.5-8.211c.136-.271.03-.407-.3-.407h-5.74a.547.547,0,0,0-.437.271L9.838,22.172c-.03.271.06.407.286.407h4.143Zm12.806-9.536h.407l7.864-11.555a.343.343,0,0,0,.06-.3c-.03-.075-.121-.105-.256-.105H27.269l3.284-6.071q.271-.452-.271-.452H26.154a.486.486,0,0,0-.452.286l-3.134,8.256a.325.325,0,0,0,.015.316.335.335,0,0,0,.286.105h3.073Z" transform="translate(-9.552 -7.092)" fill="#fff"/>
          </svg>
        </button>
    
        <div class="main-carousel" id="${this.state.product.id}carousel">
          ${this.state.product.images.filter(img => img.alt !== null && img.alt.includes(this.state.variant.option1.toLowerCase())).map(img => `<div class="carousel-cell" style="background-image: url(${img.src})"></div>`).join("")}
        </div>

        <div class="description-container">
          <div class="main-description">
            <p class="product-name">${this.state.product.title}</p>
            <div class="price-container">
              ${this.state.variant.compare_at_price 
                ? `<p>$${this.state.variant.compare_at_price}</p>`
                : ''
              }
              <p>$${this.state.variant.price}</p>
            </div>
          </div>

          ${
            this.state.product.options.map((op, i) => `
              <div class="option-container" id="option-container${i}">
                ${
                  i === 1 ? `<p class="product-stock" id="${op.id}stock"></p>` : ''
                }
                ${
                  op.values.map(value => i === 0
                    ? `<button class="option-btn" id="${op.id + value}" style="background-color: ${this.handleColor(value)}"></button>`
                    : `<button class="option-btn" id="${op.id + value}" ${this.handleOptionBtn(value)}>${value}</button>`
                  ).join("")
                }
              </div>
            `).join("")
          }

          <div class="product-promos">
            ${this.state.variant.compare_at_price
              ? `<p class="off">${Math.round(100 - ((this.state.variant.price * 100) / this.state.variant.compare_at_price))}% OFF</p>`
              : ''
            }
          </div>
        </div>
      </article>
    `
    return template
  }

  //Recibe como parametro una nueva opcion del producto y setea la nueva variante
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

  //Al hacer hover sobre una opcion de tipo talle se muestra si hay o no stock
  showStock(op){
    let pStock = document.getElementById(op.id.slice(0, -(op.id.length - 13)) + 'stock')

    op.addEventListener("mouseout", () => pStock.innerHTML = '')

    if(this.state.product.variants.filter(v => v.option1 === this.state.variant.option1).find(v => v.option2 === op.textContent)) {
      pStock.innerHTML = 'En stock'
      pStock.style.color = '#2ADB2A'
    }else{
      pStock.innerHTML = 'Fuera de stock'
      pStock.style.color = '#FF0000'
    }

    op.removeEventListener("mouseout", e => {
      console.log('hola')
    })
  }

  //Retorna 'disabled' en caso de que no exista una variante con el valor del boton del talle y el color actual
  handleOptionBtn(value){
    if(!this.state.product.variants.filter(v => v.option1 === this.state.variant.option1).find(v => v.option2 === value)) return 'disabled'
  }

  //Devuelve el div pintado del color que viene en espanol
  handleColor(color){
    switch (color){
      case 'AZUL': return "#3f79ff"
      case 'ROSA': return "#ff4471"
      case 'NEGRO': return "#222222"
      case 'ROJO': return "#ff3a3a"
      case 'BLANCO': return "#ffffff"
      case 'CAMEL': return "#c2bb84"
      case 'NATURAL': return "#ebe6be"
      case 'MULTICOLOR': return ""
      case 'BEIGE': return "#F5F5DC"
      case 'VERDE': return "#5bbf4f"
      case 'GRIS': return "#bbbbbb"
      case 'DORADO': return "#dca72e"
      case 'MARRON': return "#6c5828"
      case 'AQUA': return "#65ffda"
      case 'CADAQUES TANNAT': return "#740000"
      case 'PLATA': return "#dcdcdc"
      case 'LEOPARDO': return "#dca72e"
      case 'NARANJA': return "#ff914a"
      case 'CREMA': return "#eeeeee"
      case 'COBRE': return "#a6895c"
      case 'AMARILLO': return "#ffe056"
      case 'BRONCE': return "#dca72e"
      case 'COGNAC': return "#6c5828"
      case 'CELESTE': return "65ffda"
      case 'KAKI': return "#444444"
      case 'BORDO': return "#740000"
      case 'CAFE': return "#6c5828"
      case 'CHOCOLATE': return "#332411"
      case 'OFF WHITE': return "#f4f4f4"
      case 'ARENA': return "#c2bb84"
      case 'OCRE': return "#af3200"
    }
  }
}