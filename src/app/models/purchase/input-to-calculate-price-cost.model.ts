export class InputToCalculatePriceCost {
  IdDocument: number;
  Margin: number;
  Coefficient: number;
  IdLine: number;
  constructor(IdDocument: number,
    Margin: number,
    Coefficient: number, IdLine: number) {
    this.Coefficient = Coefficient;
    this.Margin = Margin;
    this.IdDocument = IdDocument;
    this.IdLine = IdLine;
  }
}
