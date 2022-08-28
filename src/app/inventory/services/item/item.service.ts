import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { AppConfig } from '../../../../COM/config/app.config';
import { Item } from '../../../models/inventory/item.model';
import { Observable, Subject } from 'rxjs';
import { ItemConstant } from '../../../constant/inventory/item.constant';
import { Operation } from '../../../../COM/Models/operations';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { DataResult, DataSourceRequestState } from '@progress/kendo-data-query';
import { ItemWarehouse } from '../../../models/inventory/item-warehouse.model';
import { OrderBy, OrderByDirection, PredicateFormat } from '../../../shared/utils/predicate';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { DataTransferShowSpinnerService } from '../../../shared/services/spinner/data-transfer-show-spinner.service';
import { TecDocMFA } from '../../../models/inventory/tec-doc-MFA.model';
import { ItemFilterPeerWarehouse } from '../../../models/inventory/item-filter-peer-warehouse.model';
import { TeckDockWithWarehouseFilter } from '../../../models/inventory/teckDock-with-warehouse-filter';
import { ItemQuantity } from '../../../models/manufacturing/item-quantity';
import { FiltersItemDropdown } from '../../../models/shared/filters-item-dropdown.model';
import { ItemToGetEquivalentList } from '../../../models/inventory/item-to-get-equivalent-list.model';
import { ReducedEquivalentItem } from '../../../models/inventory/reduced-equivalent-item';
import { ObjectToSave, EntityAxisValues } from '../../../models/shared/objectToSend';
import { TiersConstants } from '../../../constant/purchase/tiers.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';
import { ObjectToSend } from '../../../models/sales/object-to-save.model';
import { FilterSearchItem } from '../../../models/inventory/filter-search-item-model';

@Injectable()
export class ItemService extends ResourceService<Item> {
  public isUpdateMode = new Subject<any>();
  public idSelectedWarehouse: number;
  public showtecdoc: boolean;
  public isPurchase = false;
  public isForInventory = false;
  public formatSaleOptions: any;
  public formatPurchaseOptions: any;
  public formateNumber = '##,#.###';

  public gridState: DataSourceRequestState = {
    skip: 0,
    take: 10,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public columnsConfig: ColumnSettings[] = [
    {
      field: ItemConstant.SUPPLIER_COLUMN_FIELD,
      title: TiersConstants.SUPPLIERS,
      _width: 150,
      filterable: true
    },
    {
      field: ItemConstant.CODE_COLUMN,
      title: ItemConstant.PRODUCTS,
      _width: 200,
      filterable: true
    },
    {
      field: 'Description',
      title: 'DESIGNATION',
      _width: 200,
      filterable: true
    },
    {
      field: 'AllAvailableQuantity',
      title: 'QTE_TOT',
      _width: 90,
      filterable: true
    },
    {
      field: 'WarhouseAvailableQuantity',
      title: 'CURRENT_WAREHOUSE',
      _width: 90,
      filterable: true,
      hidden: true
    },
    {
      field: 'CMD',
      title: 'CMD',
      filterable: true,
      _width: 90,
      hidden: true
    },
    {
      field: 'CRP',
      title: 'CRP',
      filterable: true,
      _width: 90,
      hidden: true
    },
    {
      field: 'UnitHtsalePrice',
      title: 'PUHT',
      filterable: true,
      _width: 120,
      hidden: false
    },
    {
      field: 'LabelProduct',
      title: 'PRODUCT_BRAND',
      filterable: true,
      _width: 100
    },
    {
      field: 'LabelVehicule',
      title: 'Marque Vehicule',
      filterable: false,
      _width: 100,
      hidden: true
    },
    {
      field: 'UnitHtpurchasePrice',
      title: 'PURCHASE_PUHT_ABBREVIATION',
      filterable: true,
      _width: 120,
      hidden: false
    },
    {
      field: 'ReliquatQty',
      title: 'QTE_RELIQUAT',
      filterable: true,
      _width: 50,
      hidden: false
    }
  ];

  public ExcelColumnsConfig: any[] = [
    {
      field: 'Code',
      title: 'REFERENCE',
      _width: 135,
      filterable: true,
      condition: true
    },
    {
      field: 'Description',
      title: 'DESIGNATION',
      _width: 150,
      filterable: true,
      condition: true
    },
    {
      field: 'NamesTiers',
      title: 'FSR',
      _width: 150,
      filterable: true,
      condition: true
    },
    {
      field: 'AllAvailableQuantity',
      title: 'QTE_TOT',
      _width: 90,
      filterable: true,
      condition: true
    },
    {
      field: 'WarhouseAvailableQuantity',
      title: 'CURRENT_WAREHOUSE',
      _width: 90,
      filterable: true,
      condition: true
    },
    {
      field: 'CMD',
      title: 'CMD',
      filterable: true,
      _width: 60,
      hidden: false,
      condition: false
    },
    {
      field: 'CRP',
      title: 'CRP',
      filterable: true,
      _width: 60,
      hidden: false,
      condition: false
    },
    {
      field: 'UnitHtsalePrice',
      title: 'PUHT',
      filterable: true,
      _width: 120,
      condition: true
    },
    {
      field: 'LabelProduct',
      title: 'PRODUCT_BAND',
      filterable: true,
      _width: 200,
      condition: true
    },
    {
      field: 'TecDocRef',
      title: 'TecDoc',
      filterable: true,
      _width: 200,
      condition: false
    },
    {
      field: 'Oem',
      title: 'Oem',
      _width: 200,
      condition: true
    },
    {
      field: 'NatureLabel',
      title: 'NATURE',
      filterable: true,
      _width: 250,
      condition: false
    },
  ];

  public TecDoccolumnsConfig: ColumnSettings[] = [
    {
      field: 'Code',
      title: 'REFERENCE',
      _width: 200,
      filterable: true
    },
    {
      field: 'Description',
      title: 'DESIGNATION',
      filterable: true
    },
    {
      field: 'IdNatureNavigation.Label',
      title: 'NATURE',
      filterable: true
    },
    {
      field: 'Reference',
      title: 'REFERENCE',
      filterable: true,
      _width: 140
    },
    {
      field: 'Description',
      title: 'DESIGNATION',
      filterable: true,
      _width: 300
    },
    {
      field: 'Supplier',
      title: 'PRODUCT_BAND',
      filterable: true,
      _width: 180

    },
    {
      field: 'AllAvailableQuantity',
      title: 'STOCK',
      filterable: true,
      _width: 125

    },
  ];

  syncItem: Item;
  TecDoc: boolean;
  TecDocIdSupplier: any;
  TecDocReference: any;
  public advancedSearchPredicateChange: Subject<PredicateFormat> = new Subject<PredicateFormat>();

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig,
    @Inject(DataTransferShowSpinnerService) dataTransferShowSpinnerService, private localStorageService : LocalStorageService) {
    super(
      httpClient, appConfig,
      'item', 'Item', 'Inventory', dataTransferShowSpinnerService);
  }

  public getItemEquivalance(item: Item): Observable<any> {
    return super.callService(Operation.POST, ItemConstant.GETITEMEQUIVALENCE, item, null, false);
  }
  public updateItemEquivalentDesignation(itemToUpdate: ReducedEquivalentItem): Observable<any> {
    return super.callService(Operation.POST, ItemConstant.UPDATE_ITEM_EQUIVALENCE, itemToUpdate, null, false);
  }
  public getReducedItemEquivalance(item: Item): Observable<any> {
    return super.callService(Operation.POST, ItemConstant.GETREDUCEDITEMEQUIVALENCE, item, null, false);
  }

  public getItemByRef(teckDockWithWarehouseFilter: TeckDockWithWarehouseFilter): Observable<any> {
    return super.callService(Operation.POST, ItemConstant.GET_ITEM_TECDOC_BY_REF, teckDockWithWarehouseFilter,null,true);
  }

  public getItemByOem(teckDockWithWarehouseFilter: TeckDockWithWarehouseFilter): Observable<any> {
    return super.callService(Operation.POST, ItemConstant.GET_ITEM_TECDOC_BY_OEM, teckDockWithWarehouseFilter,null,true);
  }

  public getItemById(teckDockWithWarehouseFilter: TeckDockWithWarehouseFilter): Observable<any> {
    return super.callService(Operation.POST, ItemConstant.GET_ITEM_TECDOC_BY_ID, teckDockWithWarehouseFilter);
  }

  public checkWarehouseUnicity(itemWarehouse: Array<ItemWarehouse>): Observable<any> {
    const data: any = {};
    data['itemWarehouse'] = itemWarehouse;
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);

    return this.callService(Operation.POST, ItemConstant.CHECK_WAREHOUSE_UNICITY, objectToSend) as Observable<any>;
  }

  public GetProductTree(Id: number): Observable<any> {
    return this.callService(Operation.POST, 'getProductTree/' + String(Id), this.localStorageService.getEmail());
  }

  public GetMFAs(): Observable<any> {
    return this.callService(Operation.POST, 'getMFAs', this.localStorageService.getEmail());
  }

  public GetModelSeriesByMFA(idMFA): Observable<any> {
    return this.callService(Operation.POST, 'getModelSeriesByMFA/' + String(idMFA), this.localStorageService.getEmail());
  }

  public GetPassengerCars(idMFA, idMS): Observable<any> {
    return this.callService(Operation.POST, 'getPassengerCars/' + String(idMFA) + '/' + String(idMS),
    this.localStorageService.getEmail());
  }

  public GetProduct(idPC, idNode): Observable<any> {
    return this.callService(Operation.POST, 'getProduct/'.concat(String(idPC), '/', String(idNode)),
    this.localStorageService.getEmail());
  }

  public GetArticles(teckDockWithWarehouseFilter: TeckDockWithWarehouseFilter): Observable<any> {
    return this.callService(Operation.POST, 'getTeckDockArticles', teckDockWithWarehouseFilter);
  }

  public GetEquivalentTecDoc(teckDockWithWarehouseFilter: TeckDockWithWarehouseFilter): Observable<any> {
    return this.callService(Operation.POST, 'getEquivalentTecDoc', teckDockWithWarehouseFilter, null, false);
  }

  showTecDocGrid() {
    this.showtecdoc = true;
  }

  hideTecDocGrid() {
    this.showtecdoc = false;
  }

  public getItemsListByWarehouse(state: DataSourceRequestState, predicate: PredicateFormat, idWarehouse: number): Observable<DataResult> {
    let model: any = {};

    const pred: PredicateFormat = predicate ? JSON.parse(JSON.stringify(predicate)) : new PredicateFormat();
    this.prepareServerOptions(state, pred);
    model['Skip'] = pred.page;
    model['Take'] = pred.pageSize;
    model['IdWarehouse'] = idWarehouse;

    return this.callService(Operation.POST, 'getItemsListByWarehouse', model).map(
      ({ listData, total }: any) =>
        <GridDataResult>{
          data: listData,
          total: total
        }
    );
  }

  public getItemWarhouse(data, serviceName): Observable<any> {
    return super.callService(Operation.POST, serviceName, data);
  }
  public getItemWarhouseOfSelectedItem(data): Observable<any> {
    return super.callService(Operation.POST, 'getItemWarhouseOfSelectedItem', data);
  }

  /**
   * load wrahouse detail
   * @param event
   */
  public loadWarhouseDetails(event, isFromListItem, idWarehouse?) {
    if (this.TecDoc) {
      this.loadWarhouseDetailsTecDoc(event, isFromListItem, idWarehouse);
    } else {
      let item: Item = event.dataItem as Item;
      if ((isFromListItem && item.IsStockManaged) || (!item.IsStockManaged && item.IdNatureNavigation && item.IdNatureNavigation.IsStockManaged)) {
        //if (item.ItemWarehouse.length == 0) {
        item.ItemWarehouse = new Array<ItemWarehouse>();
        let model: any = {};
        let serviceName: string = '';
        if (isFromListItem) {
          model = item;
          serviceName = ItemConstant.GET_ITEM_WARHOUSE;
        } else {
          model['Item'] = item;
          model['IdWarehouse'] = idWarehouse;
          serviceName = 'getItemWarhouseBySelectedWarehouse';
        }
        this.getItemWarhouse(model, serviceName)
          .subscribe(data => {
            // push all ItemWarehouse in list of warehouse related to selected Item
            data.ItemWarehouse.forEach(x => {
              event.dataItem.ItemWarehouse.push(x);
            });
          });
        //}
      }
    }
  }

  public loadWarhouseDetailsTecDoc(event, isFromListItem, idWarehouse?) {
    if (!event.dataItem.IsInDb) {
      return;
    }
    const item: Item = event.dataItem.ItemInDB as Item;
    if (item.IdNatureNavigation && item.IdNatureNavigation.IsStockManaged) {
      if (item.ItemWarehouse.length === 0) {

        let model: any = {};
        let serviceName: string = '';
        if (isFromListItem) {
          model = item;
          serviceName = ItemConstant.GET_ITEM_WARHOUSE;
        } else {
          model['Item'] = item;
          model['IdWarehouse'] = idWarehouse;
          serviceName = 'getItemWarhouseBySelectedWarehouse';
        }
        this.getItemWarhouse(model, serviceName)
          .subscribe(
            data =>
              // push all ItemWarehouse in list of warehouse related to selected Item
              data.ItemWarehouse.forEach(x => {
                event.dataItem.ItemInDB.ItemWarehouse.push(x);
              })
          );
      }
    }
  }

  public getDataSourcePredicateValueMapper(id: any, filtersItemDropdown): Observable<any> {
    return this.callService(Operation.POST, 'getDataSourcePredicateValueMapperForGrid',
      { FiltersItemDropdown: filtersItemDropdown, ValueMapper: { Property: 'Id', Value: id } });
  }

  public warehouseFilter(state: DataSourceRequestState,
    predicate?: PredicateFormat, filtersItemDropdown?: FiltersItemDropdown): Observable<any> {
    const pred = this.preparePrediacteFormat(state, predicate);
    let dataToSend = new ItemFilterPeerWarehouse(pred, filtersItemDropdown);
    return this.callService(Operation.POST, 'warehouseFilter', dataToSend) as Observable<any>;
  }
  public warehouseFilterWithoutSpinner(state: DataSourceRequestState,
    predicate?: PredicateFormat, filtersItemDropdown?: FiltersItemDropdown): Observable<any> {
    const pred = this.preparePrediacteFormat(state, predicate);
    let dataToSend = new ItemFilterPeerWarehouse(pred, filtersItemDropdown);
    return this.callService(Operation.POST, 'warehouseFilter', dataToSend, null, true) as Observable<any>;
  }
  public exportPdf(state: DataSourceRequestState,
    predicate?: PredicateFormat, filtersItemDropdown?: FiltersItemDropdown): Observable<any> {
    const pred = this.preparePrediacteFormat(state, predicate);
    let dataToSend = new ItemFilterPeerWarehouse(pred, filtersItemDropdown);
    return this.callService(Operation.POST, 'exportPdf', dataToSend) as Observable<any>;
  }

  public getAmountPerItem(ListItems: Array<ItemQuantity>): Observable<any> {
    return this.callService(Operation.POST, ItemConstant.GET_AMOUNT_PER_ITEM, ListItems) as Observable<any>;
  }

  public getQuantityPerItem(ListItems: number[]): Observable<any> {
    return this.callService(Operation.POST, ItemConstant.GET_QUANTITY_PER_ITEM, ListItems) as Observable<any>;
  }


  public getItemsAfterFilter(itemArray: number[]) {
    return this.callService(Operation.POST, 'getItemsAfterFilter', itemArray) as Observable<any>;
  }

  public getItemDropDownList(filtersItemDropdown: FiltersItemDropdown) {
    return this.callService(Operation.POST, 'getItemDropDownListForDataGrid', filtersItemDropdown, null, true) as Observable<any>;
  }

  public getReplacementItems(item: ItemToGetEquivalentList): Observable<Array<Item>> {
    return this.callService(Operation.POST, 'getReplacementItems', item) as Observable<Array<Item>>;
  }
  public getItemKit(item: ItemToGetEquivalentList): Observable<Array<Item>> {
    return this.callService(Operation.POST, 'getItemKit', item) as Observable<Array<Item>>;
  }
  public removeEquivalentItem(Id: number): Observable<any> {
    return this.callService(Operation.POST, 'removeEquivalentItem/' + String(Id)) as Observable<Array<Item>>;
  }
  public removeReplacementItem(Id: number): Observable<any> {
    return this.callService(Operation.POST, 'removeReplacementItem/' + String(Id)) as Observable<Array<Item>>;
  }
  public removeKitItem(IdSelectedKit: number, Id: number): Observable<any> {
    return this.callService(Operation.POST, 'removeKitItem/' + String(Id) + '/' + String(IdSelectedKit)) as Observable<Array<Item>>;
  }

  public getOnOrderQuantityDetails(IdItem: Number): Observable<any> {
    return this.callService(Operation.POST, 'getOnOrderQuantityDetails', IdItem);
  }

  public getProductById(idPC): Observable<any> {
    return this.callService(Operation.GET, 'getById/'.concat(idPC));
  }
  public getItemListDetailByIds(itemArray: number[]) {
    return this.callService(Operation.POST, 'getItemListDetailsById', itemArray) as Observable<any>;
  }

  public getTecdocDetails(item): Observable<any> {
    return this.callService(Operation.POST, 'getTecdocDetails', item);
  }

  public getTecdocDetailsApi(item): Observable<any> {
    item.userMail = this.localStorageService.getEmail();
    return this.callService(Operation.POST, 'getTecdocDetailsApi', item);
  }

  public getPassengerCar(item): Observable<any> {
    item.userMail = this.localStorageService.getEmail();
    return this.callService(Operation.POST, 'getpassengerCar', item);
  }

  public getTopPassengerCars(item): Observable<any> {
    return this.callService(Operation.POST, 'getTopPassengerCar', item);
  }

  public getTopPassengerCarsApi(item): Observable<any> {
    item.userMail = this.localStorageService.getEmail();
    return this.callService(Operation.POST, 'getTopPassengerCarApi', item);
  }

  public getEngines(item): Observable<any> {
    item.userMail = this.localStorageService.getEmail();
    return this.callService(Operation.POST, 'getEngines', item);
  }
  public getTopBrandInfo(idSuplier): Observable<any> {
    return this.callService(Operation.POST, 'getTopBrandInfo/' + idSuplier, this.localStorageService.getEmail());
  }
  public getBrandInfo(idSuplier): Observable<any> {
    return this.callService(Operation.POST, 'getBrandInfo/' + idSuplier, this.localStorageService.getEmail());
  }
  public getAllBrandInfo(idSuplier): Observable<any> {
    return this.callService(Operation.GET, 'getAllBrandInfo/' + idSuplier);
  }
  public getMedias(item): Observable<any> {
    item.userMail = this.localStorageService.getEmail();
    return this.callService(Operation.POST, 'getMedia', item);
  } public getDocuments(item): Observable<any> {
    item.userMail = this.localStorageService.getEmail();
    return this.callService(Operation.POST, 'getDocument', item);
  }

  public getBrands(): Observable<any> {
    return this.callService(Operation.GET, 'getTecDocBrands');
  }

  public getTecDocItemsByBrand(brandId): Observable<any> {
    return this.callService(Operation.POST, 'getTecDocItemsByBrand', brandId, null, false);
  }

  public uploadEmployee(file): Observable<any> {
    return super.callService(Operation.POST, 'importFileItems', file);
  }
  show(data: any) {
    this.isUpdateMode.next({ value: true, data: data });
  }
  getResult(): Observable<any> {
    return this.isUpdateMode.asObservable();
  }
  /**
 * saveItem
 * @param data
 * @param isNew
 */
  public saveItem(data, isNew: boolean): Observable<any> {
    const object: ObjectToSave = new ObjectToSave();
    object.Model = data;
    object.EntityAxisValues = Array<EntityAxisValues>();
    if (isNew) {
      return this.callService(Operation.POST, 'insert_item', object);
    } else {
      return this.callService(Operation.PUT, 'update_item', object);
    }
  }
  public affectEquivalentItem(idMasterItem, idItemToAffect): Observable<any> {
    return super.callService(Operation.POST, 'affectEquivalentItem', { IdMasterItem: idMasterItem, IdItemToAffect: idItemToAffect });
  }
  public affectEquivalentItemWithoutResponse (idMasterItem, idItemToAffect) : Observable<any>{
    return super.callService(Operation.POST, 'affectEquivalentItemWithoutResponse', { IdMasterItem: idMasterItem, IdItemToAffect: idItemToAffect });
  }

  public getItemsFillingIsAffected(state: DataSourceRequestState,
    predicate: PredicateFormat, idPrice: number): Observable<any> {
    return super.callService(Operation.POST, 'getItemsFillingIsAffected/' + idPrice,
      this.preparePrediacteFormat(state, predicate));
  }

  public GetItemTier(item): Observable<any> {
    return this.callService(Operation.GET, 'getItemTier/' + item);
  }

  public getNumberOfItemEquiKit(guidItem: ItemToGetEquivalentList): Observable<any> {
    return this.callService(Operation.POST, 'getNumberOfItemEquiKit', guidItem);
  }

  public getItemSheetData(Id: number): Observable<any> {
    return this.callService(Operation.POST, 'getItemSheetData', Id);
  }

  public getReducedItemData(Id: number): Observable<any> {
    return this.callService(Operation.POST, 'getReducedItemData', Id);
  }
  public convertListToString(data : any){
    let tiers = "";
    if(data!= null && data.NamesTiers != null ){
      data.NamesTiers.forEach(element => {
        if(tiers.length ==0){
          tiers = element;
        }else{
          tiers = tiers +', '+ element;
        }
      });
    data.NamesTiers = tiers;
    }
  }
  public getItemDataWithSpecificFilter(guidItem: FilterSearchItem): Observable<any> {
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = guidItem;
    return this.callService(Operation.POST, 'getItemDataWithSpecificFilter', objectToSave);
  }
  public getByCodeAndDesignation(pattern: String): Observable<any> {

    return this.callService(Operation.POST, 'getByCodeAndDesignation', pattern);

  }

  public getItemDetails(listIds: Array<Number>): Observable<any> {

    return this.callService(Operation.POST, 'getItemDetails', listIds);

  }
  public getArticlesByGlobalSearch(teckDockWithWarehouseFilter: TeckDockWithWarehouseFilter): Observable<any> {
    return super.callService(Operation.POST, ItemConstant.GET_ARTICLES_BY_GLOBAL_SEARCH, teckDockWithWarehouseFilter,null,true);
  }
}
