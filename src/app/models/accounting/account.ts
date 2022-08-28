export class Account {
  planId: number;
  code: string;
  label: string;
  literable: boolean;
  reconcilable: boolean;

  constructor(planId?: number, code?: string, label?: string, literable?: boolean, reconcilable?: boolean) {
    this.planId = planId;
    this.code = code;
    this.label = label;
    this.literable = literable;
    this.reconcilable = reconcilable;
  }
}
