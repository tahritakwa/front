import { Resource } from '../shared/ressource.model';
import { OperationKit } from './operation-kit.model';
import { Operation } from './operation.model';

export class OperationKitOperation implements Resource {
    Id: number;
    IdOperationKit: number;
    IdOperation: number;
    Duration?: number;
    Htprice?: number;
    IdOperationKitNavigation: OperationKit;
    IdOperationNavigation: Operation;


    public constructor(model?: any) {
        this.Id = model.Id;
        this.IdOperationKit = model.IdOperationKit;
        this.IdOperation = model.IdOperation;
        this.Duration = model.IdOperationNavigation.ExpectedDuration;
        this.Htprice = model.IdOperationNavigation.Htprice;
        this.IdOperationNavigation = model.IdOperationNavigation;
    }
}
