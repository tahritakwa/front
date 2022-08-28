import { Resource } from '../shared/ressource.model';
import {BankAccount} from './bank-account.model';

export class BankAgency extends Resource {
  IdBank: number;
  Label: string;
  Contact: any;
  IdBankNavigation: BankAccount;
  DeletedToken: string;
 }
