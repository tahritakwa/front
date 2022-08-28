import { Resource } from '../shared/ressource.model';

export class ExitEmployeePayLine extends Resource {
    Details: string;
    IdExitEmployee: number;
    startDateToCalculate: Date;
    State: number;
}
