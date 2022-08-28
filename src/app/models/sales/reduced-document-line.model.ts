import { Resource } from '../shared/ressource.model';
import { DocumentLinePrices } from './document-line-prices.model';
import { Warehouse } from '../inventory/warehouse.model';
import { Taxe } from '../administration/taxe.model';
import { Tiers } from '../achat/tiers.model';
import { StockMovement } from '../inventory/stock-movement.model';
import { ReducedContact } from '../shared/reduced-contact.model';

export class ReducedDocumentLine extends Resource {
  CodeDocumentLine = '';
  IdDocument = 0;
  IdItem = undefined;
  Designation = '';
  RefDesignation = '';
  /* document line quantity */
  MovementQty = 0;

  /* document line Remaining Quantity */
  RemainingQuantity = 0;

  /* document line Received Quantity */
  ReceivedQuantity = 0;

  /* document line Received Quantity */
  IsChecked = false;
  /** document line unié de calcul */
  IdMeasureUnit = 0;
  IdPrices;
  IdWarehouse = 0;
  HtUnitAmount = 0;
  /*document line remise */
  DiscountPercentage = 0;
  HtAmount = 0;
  VatTaxAmount = 0;
  VatTaxRate = 0;
  TtcAmount = 0;
  HtTotalLine = 0;
  TtcTotalLine = 0;
  IdDocumentLineAssociated: number;
  IdDocumentLineStatus: number;
  HtUnitAmountWithCurrency = 0; /**prix unitaire */
  HtAmountWithCurrency = 0; /**prix unitaire apres remise */
  TtcAmountWithCurrency = 0;
  HtTotalLineWithCurrency = 0; /**montant total ht */
  TtcTotalLineWithCurrency = 0;
  VatTaxAmountWithCurrency = 0;
  ExcVatTaxAmount = 0;
  ExcVatTaxRate = 0;
  ExcVatTaxAmountWithCurrency = 0;
  Requirement = '';
  WarehouseName = '';
  IsActive = false;
  DocumentLineTaxe = null;
  DocumentLinePrices = new Array<DocumentLinePrices>();
  MesureUnitLabel = '';
  IdLine?= 0;
  LabelItem = '';
  LabelMeasureUnit = '';
  Taxe = new Array<Taxe>();
  UnitPriceFromQuotation?= 0;
  UnitHtsalePrice?= 0;
  LabelUnitSales?= '';
  IdUnitSales: number;
  TaxeString?: Array<string>;
  ShelfAndStorage = '';
  IsExpenseLine = false;
  IsValidReservationFromProvisionalStock = false;
  CostPrice = 0;
  PercentageMargin = 0;
  SellingPrice = 0;
  isNew = true;
  StockMovement: StockMovement;
  IdSupplier: Tiers;
  CodeDocument: string;
  AvailableQuantity = 0;
  IdWarehouseNavigation: Warehouse;
  IdContactNavigation: ReducedContact;
  public constructor(init?: Partial<ReducedDocumentLine>, idLine?: number, warehouse?: Warehouse) {
    super();
    {

      if (init) {
        Object.assign(this, init);
        this.MovementQty = Number(this.MovementQty);
      }

      if (warehouse) {
        this.IdWarehouse = warehouse.Id;
        this.WarehouseName = warehouse.WarehouseName;
      }
      if (idLine) {
        this.IdLine = idLine;
      }

    }
  }
}
