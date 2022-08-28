import { DocumentLine } from '../sales/document-line.model';
import { User } from '../administration/user.model';
import { Resource } from '../shared/ressource.model';
import { NumberConstant } from '../../constant/utility/number.constant';

export class NegotitateQty extends Resource {
    IdDocumentLine = 0;
    Price = 0;
    Qty = 0;
    IsFinal = false;
    Description = '';
    IsAccepted = false;
    IsRejected = false;
    CreationDate = new Date();
    IdUser = 0;
    IdUserNavigation = new User();
    QteSupplier = 0;
    PriceSupplier = 0;
    IdItem = 0;
    /**
     *
     */
  constructor(dataItem?: DocumentLine, init?: Partial<NegotitateQty>) {
    super();
        if (dataItem) {
            this.IdDocumentLine = dataItem.Id;
            this.Description = dataItem.Designation;
            this.Qty = dataItem.MovementQty;
            this.Price = dataItem.UnitPriceFromQuotation;
            this.IdItem = dataItem.IdItem;
            this.Id = NumberConstant.ZERO;
        } else if (init) {
            Object.assign(this, init);
        }
    }
}
