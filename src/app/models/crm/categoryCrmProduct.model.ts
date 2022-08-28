import {StatusCrm} from './statusCrm.model';

export class ProductSaleCategoryCrm {
  id: number;
  title: string;
  idItems: number[];
  responsablesUsersId: number[];
  categoryType: string;
  idCurrency: number;
  withTotal: boolean;
  status: StatusCrm[];
  pipelineId: number;

  constructor(title: string, IdItems: number[], responsablesUsersId: number[],
              categoryType: string, status: Array<StatusCrm>, idCurrency: number ,  withTotal: boolean) {
    this.idItems = IdItems;
    this.responsablesUsersId = responsablesUsersId;
    this.status = status;
    this.title = title;
    this.categoryType = categoryType;
    this.idCurrency = idCurrency;
    this.withTotal = withTotal;
  }
}
