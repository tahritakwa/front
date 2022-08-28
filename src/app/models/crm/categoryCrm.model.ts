import {StatusCrm} from './statusCrm.model';


export class StaffingCategoryCrm {
    id: number;
    title: string;
    employeesId: number[];
    responsablesUsersId: number[];
    categoryType: string;
    idCurrency: number;
    withTotal: boolean;
    status: StatusCrm[];
    pipelineId: number;

    constructor(id: number, title: string, employeesId: number[], responsablesUsersId: number[],
                categoryType: string, status: Array<StatusCrm>) {
        this.id  = id ;
        this.title = title;
        this.employeesId = employeesId;
        this.responsablesUsersId = responsablesUsersId;
        this.categoryType = categoryType;
        this.status = status;

    }
}
