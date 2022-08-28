export class Journal {
  id: number;
  code: string;
  label: string;
  reconcilable: string;

  constructor(code?: string, label?: string, reconcilable?: string) {
    this.code = code;
    this.label = label;
    this.reconcilable = reconcilable;
  }
}
