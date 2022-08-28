import { Resource } from '../shared/ressource.model';
import { DocumentLineTaxe } from './document-line-taxe.model';
import { DocumentLinePrices } from './document-line-prices.model';
import { MeasureUnit } from '../inventory/measure-unit.model';
import { Prices } from './prices.model';
import { Warehouse } from '../inventory/warehouse.model';
import { Item } from '../inventory/item.model';
import { Taxe } from '../administration/taxe.model';
import { Tiers } from '../achat/tiers.model';
import { Document } from './document.model';
import { StockMovement } from '../inventory/stock-movement.model';

export class DocumentLine extends Resource {
  CodeDocumentLine = '';
  IdDocument = 0;
  IdItem = undefined;
  RefItem = undefined;
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
  IdItemNavigation: Item;
  IdMeasureUnitNavigation: MeasureUnit = new MeasureUnit();
  IdPricesNavigation: Prices;
  IdWarehouseNavigation = new Warehouse();
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
  ShelfAndStorage : '';
  IsExpenseLine = false;
  IsValidReservationFromProvisionalStock = false;
  CostPrice = 0;
  PercentageMargin = 0;
  SellingPrice = 0;
  isNew = true;
  StockMovement: StockMovement;
  IdDocumentNavigation: Document;
  IdTiersNavigation: Tiers;
  IdSupplier: Tiers;
  CodeDocument: string;
  AvailableQuantity = 0;
  IdDocumentAssociated: number;
  OrderedQty = 0;
  ReliquaQty = 0;
  NewSalesPrice = 0;
  IncreaseRate = 0;
  IsNegotitated = false;
  IsNegotitationAccpted = false;
  IsNegotitatedRefused = false;
  DocumentLineNegotiationOptions;
  TaxeAmount = 0;
  Marque: string;
  IdStorage = 0;
  IdStorageNavigation : Storage;
  HaveDiscountLineInDocument? : boolean;
  public constructor(idItem?: number, init?: Partial<DocumentLine>, idLine?: number, warehouse?: Warehouse) {
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
export class ItemPricesResult {
  HtUnitAmountWithCurrency: number = 0;
  IdUnitSales: any = 0;
  IdMeasureUnit: number = 0;
  LabelItem: string = null;
  RefItem: string = null;
  Designation: string = null;
  DocumentLineTaxe: Array<DocumentLineTaxe>;
  DiscountPercentage: number = 0;
  HtAmountWithCurrency: number = 0;
  HtTotalLineWithCurrency: number = 0;
  constructor(init?: ItemPricesResult, idMeasureUnit?: any, description?: string) {

    let obj1 = this; let obj2 = init;
    Object.keys(obj2).forEach(function (key) {
      if (key in obj1) {
        obj1[key] = obj2[key];
      }
    });
    this.DocumentLineTaxe = init.DocumentLineTaxe;
    if (idMeasureUnit) {
      this.IdUnitSales = idMeasureUnit.Label;
    }
    this.LabelItem = description;
  }
}
