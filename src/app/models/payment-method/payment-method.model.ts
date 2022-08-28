import { Resource } from '../shared/ressource.model';
import { Document } from '../sales/document.model';
import { PaymentType } from '../payment/payement-type.model';

export class PaymentMethod extends Resource {
  Code: string;
  MethodName: string;
  Description: string;
  AuthorizedForExpenses: boolean;
  AuthorizedForRecipes: boolean;
  Immediate: boolean;
  IdPaymentType?: number;
  IdPaymentTypeNavigation: PaymentType;
}


