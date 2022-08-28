import { Resource } from '../shared/ressource.model';
import { Contract } from './contract.model';


export class Attendance extends Resource {
  IdContract: number;
  IdSession: number;
  NumberDaysWorked: number;
  NumberDaysPaidLeave: number;
  NumberDaysNonPaidLeave: number;
  MaxNumberOfDaysAllowed: number;
  IdContractNavigation: Contract;
  StartDate: Date;
  EndDate: Date;
  AdditionalHourOne: number;
  AdditionalHourTwo: number;
  AdditionalHourThree: number;
  AdditionalHourFour: number;
}
