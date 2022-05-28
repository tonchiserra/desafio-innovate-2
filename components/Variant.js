export class Variant {
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