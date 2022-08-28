import { TimeSheet } from '../rh/timesheet.model';
import { Resource } from '../shared/ressource.model';
import { Contract } from './contract.model';

export class SessionContract extends Resource {
  IdSession: number;
  IdContract: number;
  IdTimeSheetNavigation: TimeSheet;
  IdContractNavigation: Contract;
}
