import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators/tap';
import 'rxjs/add/operator/map';
import { Filter, Operation as op, Operator, OrderBy, OrderByDirection, PredicateFormat } from '../../utils/predicate';
import { Operation } from '../../../../COM/Models/operations';
import { DataResult, DataSourceRequestState } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Resource } from '../../../models/shared/ressource.model';
import { GenericService } from '../../../../COM/config/app-config.service';
import { AppConfig } from '../../../../COM/config/app.config';
import { EntityAxisValues, FileInfo, ObjectToSave } from '../../../models/shared/objectToSend';
import { QueryOptions } from '../../utils/query-options';
import { DataTransferShowSpinnerService } from '../spinner/data-transfer-show-spinner.service';
import { Inject } from '@angular/core';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { ItemFilterPeerWarehouse } from '../../../models/inventory/item-filter-peer-warehouse.model';
import { FiltersItemDropdown } from '../../../models/shared/filters-item-dropdown.model';
import { DataResultWithSum } from '../../../models/shared/data-result-with-sum.model';
import jwt_decode from "jwt-decode";
// consts
const UNDEFINED = 'undefined';
const MIN_DATE_FILTER = 1753;
// end consts

// backend endpoints
const GET_PREDICATE = 'getDataSourcePredicate';
const GET_BY_ID = 'getById/';
const GET_MODEL_BY_CONDITION = 'getModelByCondition';
const GET_UNICITY = 'getUnicity/';
const UPLOAD_FILE = 'uploadFile';
const GET_DATA_DROPDOWN_PREDICATE = 'getDataDropdownWithPredicate';
const GET_TIERS_BY_ID = 'getTiersById/';
const GET_UNICITY_PER_MONTH = 'getUnicityPerMonth';
const GET_COMPANY_CURRENCY_PRECISION = 'getCompanyCurrencyPrecision';
const GET_PICTURE = 'getPicture';
const GET_PICTURES = 'getPictures';
const GET_STARK_INFORMATIONS = 'getStarkInformations';
const GET_DATA_DROPDOWN = 'getDataDropdown';


// end backend endpoints

/**
 * Resource service : base class of service
 * */
export abstract class ResourceService<T extends Resource> extends BehaviorSubject<any[]> {
  protected gservice: GenericService<T>;
  protected headers: HttpHeaders;
  private data: T[] = [];
  public dataTransferShowSpinnerService: DataTransferShowSpinnerService;

  /**
   * create new service
   * @param http
   * @param config
   * @param endpoint
   * @param model
   * @param module
   * @param dataTransferShowSpinnerService
   */
  constructor(
    public http: HttpClient,
    public config: AppConfig,
    public endpoint: string,
    public model?: string,
    public module?: string,
    @Inject(DataTransferShowSpinnerService) dataTransferShowSpinnerService?,
    public root?: string,
    public addCodeCompany?: boolean

  ) {
    super([]);
    this.prepareHeader(module, model);
    this.gservice = new GenericService<T>(http, config, this.headers, endpoint, root);
    if (dataTransferShowSpinnerService) {
      this.dataTransferShowSpinnerService = dataTransferShowSpinnerService;
    }
  }

  /**
   * HttpGet All
   * */
  public list(hideSpinner?: boolean): Observable<T[]> {
    if (hideSpinner) {
      this.dataTransferShowSpinnerService.setShowSpinnerValue(hideSpinner);
    }
    return this.gservice.list();
  }

  /**
   * Reload server side data grid
   * @param state
   * @param predicate
   * @param api
   * @param hideSpinner
   * @param ignoreOrderBy
   * @returns Observable
   */
  public reloadServerSideData(state: DataSourceRequestState,
    predicate?: PredicateFormat,
    api?: string,
    hideSpinner?: boolean,
    ignoreOrderBy?: boolean): Observable<DataResultWithSum> {
    if (hideSpinner) {
      this.dataTransferShowSpinnerService.setShowSpinnerValue(hideSpinner);
    }
    const pred = this.preparePrediacteFormat(state, predicate, api, ignoreOrderBy);
    return this.processDataServerSide(pred, api);
  }
  public translaiteData(data: any) {

  }
  /**
   * Reload server side data grid
   * @param state
   * @param predicate
   * @param api
   * @param hideSpinner
   * @param ignoreOrderBy
   * @returns Observable
   */
  public reloadServerSideDataWithListPredicate(state: DataSourceRequestState,
    predicate?, api?: string, hideSpinner?: boolean, ignoreOrderBy?: boolean): Observable<DataResultWithSum> {
    if (hideSpinner) {
      this.dataTransferShowSpinnerService.setShowSpinnerValue(hideSpinner);
    }
    predicate = predicate.map(pred => {
      return this.preparePrediacteFormat(state, pred, api, ignoreOrderBy);
    });
    return this.processDataServerSide(predicate, api);
  }


  public getAllUserWithoutState() {
    const pred = new PredicateFormat();
    return this.processDataServerSide(pred);
  }

  public listdropdown(hideSpinner: boolean = true): Observable<T[]> {
    if (hideSpinner && this.dataTransferShowSpinnerService) {
      this.dataTransferShowSpinnerService.setShowSpinnerValue(hideSpinner);
    }
    return this.gservice.dropdownlist();
  }

  public listdropdownWithPerdicate(predicate: PredicateFormat, hideSpinner: boolean = true): Observable<any[]> {
    if (hideSpinner && this.dataTransferShowSpinnerService) {
      this.dataTransferShowSpinnerService.setShowSpinnerValue(hideSpinner);
    }
    return this.gservice.dropdownListWithPredicate(predicate);
  }

  /**
   * Call service with predicate condition and return list data
   * @param predicate
   * @returns Observable
   */
  public callPredicateData(predicate: PredicateFormat, api?: string, hideSpinner?: boolean): Observable<any[]> {
    if (hideSpinner) {
      this.dataTransferShowSpinnerService.setShowSpinnerValue(hideSpinner);
    }
    const route = api ? api : GET_PREDICATE;
    return this.callService(Operation.POST, route, predicate).map(
      data => data['listData']
    ) as Observable<any[]>;
  }

  /**
   * Http get list with predicate
   * @param predicate
   */
  public readPredicateData(predicate: PredicateFormat, api?: string, hideSpinner?: boolean): Observable<any[]> {
    if (hideSpinner) {
      this.dataTransferShowSpinnerService.setShowSpinnerValue(hideSpinner);
    }
    return this.callPredicateData(predicate, api);
  }

  /**
   * Http get list with predicate
   * @param predicate
   */
  public readDropdownPredicateData(predicate: PredicateFormat, api?: string, hideSpinner?: boolean): Observable<any[]> {
    if (hideSpinner) {
      this.dataTransferShowSpinnerService.setShowSpinnerValue(hideSpinner);
    }
    return this.callPredicateData(predicate, GET_DATA_DROPDOWN_PREDICATE);
  }

  public readDropdownData(hideSpinner?: boolean): Observable<any[]> {
    if (hideSpinner) {
      this.dataTransferShowSpinnerService.setShowSpinnerValue(hideSpinner);
    }
    return this.callService(Operation.GET, GET_DATA_DROPDOWN);
  }


  /**
   * HttpGet list data with server side pagination, adapted to kendo grid
   * @param predicate
   * @param api
   * @returns Observable
   */
  public processDataServerSide(
    predicate: any, api?: string, hideSpinner?: boolean): Observable<any> {
    if (hideSpinner) {
      this.dataTransferShowSpinnerService.setShowSpinnerValue(hideSpinner);
    }
    const route = api ? api : GET_PREDICATE;
    return this.callService(Operation.POST, route, predicate).map(
      ({ listData, total, sum }: any) =>
        <DataResultWithSum>{
          data: listData,
          total: total,
          sum: sum
        }
    );
  }


  /**
   * Http get list data, return list data
   * @param predicate
   */
  public read(predicate?: PredicateFormat, hideSpinner?: boolean) {
    if (hideSpinner) {
      this.dataTransferShowSpinnerService.setShowSpinnerValue(hideSpinner);
    }
    if (this.data.length) {
      return super.next(this.data);
    }
    if (predicate === undefined) {
      this.gservice
        .list()
        .pipe(
          tap(data => {
            this.data = data;
          })
        )
        .subscribe(data => {
          super.next(data);
        });
    } else {
      this.callPredicateData(predicate)
        .pipe(
          tap(data => {
            this.data = data as T[];
          })
        )
        .subscribe(data => {
          super.next(data);
        });
    }
  }

  /**
   * HttpGet element by Id, return
   * @param id
   * @returns Observable
   */
  public getById(id: number, hideSpinner?: boolean): Observable<any> {
    if (hideSpinner) {
      this.dataTransferShowSpinnerService.setShowSpinnerValue(hideSpinner);
    }
    return this.callService(Operation.GET, GET_BY_ID + id);
  }

  /**
   * HttpGet element by Id, return
   * @param id
   * @returns Observable
   */
  public getTiersById(id: number, hideSpinner?: boolean): Observable<any> {
    if (hideSpinner) {
      this.dataTransferShowSpinnerService.setShowSpinnerValue(hideSpinner);
    }
    return this.callService(Operation.GET, GET_TIERS_BY_ID + id);
  }

  /**
   * Get element with predicate condtion
   * @param predicate
   * @returns Observable
   */
  public getModelByCondition(predicate: PredicateFormat, hideSpinner?: boolean): Observable<any> {
    if (hideSpinner) {
      this.dataTransferShowSpinnerService.setShowSpinnerValue(hideSpinner);
    }
    return this.callService(Operation.POST, GET_MODEL_BY_CONDITION, predicate);
  }

  /**
   * HttpPOST/PUT
   * @param data
   * @param isNew
   * @param predicate
   * @param hideSpinner
   * @param unicityData
   * @returns Observable
   */
  public save(data: T, isNew?: boolean, predicate?: PredicateFormat, hideSpinner?: boolean, unicityData?: any, isFromModal?: boolean): Observable<T> {
    if (hideSpinner) {
      this.dataTransferShowSpinnerService.setShowSpinnerValue(hideSpinner);
    }
    const action = isNew ? Operation.POST : Operation.PUT;

    this.reset();

    return this.fetch(action, data, false, unicityData, isFromModal);
  }

  /**
   * HttpDelete
   * @param data
   * @param predicate
   * @returns Observable
   */
  public remove(data: T, predicate?: PredicateFormat, hideSpinner?: boolean): Observable<T> {
    if (hideSpinner) {
      this.dataTransferShowSpinnerService.setShowSpinnerValue(hideSpinner);
    }
    this.reset();

    return this.fetch(Operation.DELETE, data);
  }

  /**
   * Reset item
   * @param dataItem
   */
  public resetItem(dataItem: any, hideSpinner?: boolean) {
    if (hideSpinner) {
      this.dataTransferShowSpinnerService.setShowSpinnerValue(hideSpinner);
    }
    if (!dataItem) {
      return;
    }

    // find orignal data item
    const originalDataItem = this.data.find(item => item.Id === dataItem.Id);

    // revert changes
    Object.assign(originalDataItem, dataItem);

    super.next(this.data);
  }

  /**
   * Reset list data
   * */
  public reset(hideSpinner?: boolean) {
    if (hideSpinner) {
      this.dataTransferShowSpinnerService.setShowSpinnerValue(hideSpinner);
    }
    this.data = [];
  }

  public patchValues(id, data, hideSpinner?: boolean): Observable<T> {
    if (hideSpinner) {
      this.dataTransferShowSpinnerService.setShowSpinnerValue(hideSpinner);
    }
    return this.gservice.patch(id, data);
  }

  /**
   * Excute Post / Put / Delete
   * @param action
   * @param data
   */
  private fetch(action: string, data: T, hideSpinner?: boolean, unicityData?: any, isFromModal?: boolean): Observable<T> {
    if (hideSpinner) {
      this.dataTransferShowSpinnerService.setShowSpinnerValue(hideSpinner);
    }
    const object: ObjectToSave = new ObjectToSave();
    object.Model = data as T;
    object.EntityAxisValues = Array<EntityAxisValues>();
    object.VerifyUnicity = unicityData ? unicityData : undefined;
    switch (action) {
      case Operation.POST: {
        return this.gservice.create(data, unicityData, isFromModal);
      }
      case Operation.PUT: {
        return this.gservice.update(data, unicityData);
      }
      case Operation.DELETE: {
        return this.gservice.delete(data);
      }
      default:
        break;
    }
  }

  /**
   * Prepare predicate header
   * @param module
   * @param model
   */
  private prepareHeader(module?: string, model?: string, hideSpinner?: boolean) {
    if (hideSpinner) {
      this.dataTransferShowSpinnerService.setShowSpinnerValue(hideSpinner);
    }
    this.headers = this.headers || new HttpHeaders();
    if (module) {
      this.headers = this.headers.set('Module', module);
    }
    if (model) {
      this.headers = this.headers.set('TModel', model);
    }
  }

  public callService(
    action: Operation,
    service: string,
    data?: any,
    queryOptions?: QueryOptions,
    hideSpinner?: boolean,
    isWithDateCorrection: boolean = true
  ): Observable<any> | Observable<any[]> {
    if (hideSpinner) {
      this.dataTransferShowSpinnerService.setShowSpinnerValue(hideSpinner);
    }
    return this.gservice.callService(action, service, data, queryOptions, isWithDateCorrection);
  }

  public preparePrediacteFormat(state: DataSourceRequestState,
    predicate?: PredicateFormat,
    api?: string, ignoreOrderBy?: boolean): PredicateFormat {
    const pred: PredicateFormat = predicate ? JSON.parse(JSON.stringify(predicate)) : new PredicateFormat();
    this.prepareServerOptions(state, pred);
    if ((pred.OrderBy == null || pred.OrderBy.length === 0) && !ignoreOrderBy) {
      pred.OrderBy = new Array<OrderBy>();
      const orderBy: OrderBy = new OrderBy('Id', OrderByDirection.desc);
      pred.OrderBy.push(orderBy);
    }
    return pred;
  }


  private getFilter(filterToAdd, predicate) {
    filterToAdd.forEach((element: any) => {
      if (element.filters && element.filters.length > 0) {
        this.getFilter(element.filters, predicate);
      } else {
        predicate.Filter.push(new Filter(element.field, op[element.operator as keyof typeof op], element.value));
      }
    });
  }

  /**
   * Prepare options for calling server side traitement
   * @param state
   * @param predicate
   */
  public prepareServerOptions(state: DataSourceRequestState, predicate: PredicateFormat, hideSpinner?: boolean) {
    if (hideSpinner) {
      this.dataTransferShowSpinnerService.setShowSpinnerValue(hideSpinner);
    }
    if (state.filter) {
      predicate.Operator = Operator[state.filter.logic];
      predicate.Filter = (typeof predicate.Filter !== UNDEFINED && predicate.Filter instanceof Array)
        ? predicate.Filter : new Array<Filter>();
      const cellFilters = p => p.filters;
      if (predicate.Operator === Operator.or) {
        (<any>state.filter.filters).reduce((res, p) => res.concat(p.filters), [])
          .map(data => predicate.Filter
            .push(new Filter(data.field, op[data.operator as keyof typeof op], data.value, false, true)));
      } else {
        this.getFilter(state.filter.filters, predicate);
      }

    }
    if (state.sort && state.sort.length > 0) {
      predicate.OrderBy = new Array<OrderBy>();
      const sortFields = state.sort.filter((item) => {
        return !state.group.find(x => x.field === item.field);
      });
      const orderFields = Array.from(new Set(state.group.concat(sortFields)));
      orderFields.forEach(data =>
        predicate
          .OrderBy
          .push(new OrderBy(data.field,
            data.dir === 'asc' ? OrderByDirection.asc : OrderByDirection.desc)));
    }
    predicate.pageSize = state.take;
    predicate.page = (state.skip / state.take) + 1;
  }

  public getUnicity(property: string, value: any, valueBeforUpdate?: any, hideSpinner?: boolean): Observable<boolean> {
    if (hideSpinner && this.dataTransferShowSpinnerService) {
      this.dataTransferShowSpinnerService.setShowSpinnerValue(hideSpinner);
    }
    const object = {
      property: property,
      value: value,
      valueBeforUpdate: valueBeforUpdate
    };
    return this.callService(Operation.POST, GET_UNICITY, object) as Observable<boolean>;
  }

  /**
   * Upload the content Of file
   * @param fileInfo
   */
  public uploadFile(fileInfo: FileInfo, hideSpinner?: boolean): Observable<FileInfo> {
    return this.callService(Operation.POST, UPLOAD_FILE, fileInfo) as Observable<FileInfo>;
  }

  /**
   *
   * @param ids
   * @param serviceName
   */
  public downloadZipFile(ids: number[], serviceName: string): Observable<any> {
    return this.callService(Operation.POST, serviceName, ids);
  }
  /**
   * check unicity
   * @param data
   */
  public GetUnicityPerMonth(data: T): Observable<boolean> {
    return this.callService(Operation.POST, GET_UNICITY_PER_MONTH, data) as Observable<boolean>;
  }

  /**
  * Compare value precision with current company precision
  * @param value
  */
  public getCompanyCurrencyPrecision(value: string): Observable<number> {
    return this.callService(Operation.POST, GET_COMPANY_CURRENCY_PRECISION, value) as Observable<number>;
  }
  public getJson(path): Observable<any> {
    return this.http.get(path);
  }

  public get EndPoint(): string {
    return this.gservice.EndPoint;
  }

  public set EndPoint(endpoint: string) {
    this.gservice.EndPoint = endpoint;
  }


  public downloadJasperReport(dataToSend: any): Observable<any> {
    return this.callService(Operation.POST, SharedConstant.DOWNLOAD_JASPER_DOCUMENT_REPORT, dataToSend);
  }
  public getModulesSettings(): Observable<any[]> {
    return this.callService(Operation.GET, SharedConstant.GET_MODULES_SETTINGS);
  }

  public getPicture(path: string): any {
    if(path==null){
      return "";
    }
    return this.callService(Operation.POST, GET_PICTURE, path) as Observable<any>;
  }

  public getPictures(path: string[], hideSpinner = true): any {
    if(path==null){
      return "";
    }
    return this.callService(Operation.POST, GET_PICTURES, path, null, hideSpinner) as Observable<any>;

  }
  public warehouseFilterExcel(state: DataSourceRequestState,
    predicate?: PredicateFormat, filtersItemDropdown?: FiltersItemDropdown): Observable<GridDataResult> {
    const pred = this.preparePrediacteFormat(state, predicate);
    const dataToSend = new ItemFilterPeerWarehouse(pred, filtersItemDropdown);
    return this.callService(Operation.POST, 'warehouseFilter', dataToSend).map(
      ({ listData, total }: any) =>
        <GridDataResult>{
          data: listData,
          total: total
        }
    );
  }

  /**
   * return informations of Stark
   */
  public getStarkInformations(): Observable<any> {
    return this.callService(Operation.GET, GET_STARK_INFORMATIONS);
  }
}
