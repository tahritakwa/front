import { Resource } from '../shared/ressource.model';

export class ReducedPaymentMethod extends Resource {
  Code: string;
  MethodName: string;
  Description: string;
  AuthorizedForExpenses: boolean;
  AuthorizedForRecipes: boolean;
  Immediate: boolean;
  IdPaymentType?: number;
  IdPaymentTypeNavigation;
  PaymentType;
}


