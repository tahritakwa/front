export class Filter {
  type: string;
  operator: string;
  field: string;
  value: string;

  constructor(type: string, operator: string, field: string, value: string) {
    this.type = type;
    this.operator = operator;
    this.field = field;
    this.value = value;
  }
}
