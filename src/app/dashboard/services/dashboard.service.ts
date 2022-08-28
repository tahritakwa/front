import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs/Observable';
import { AppConfig } from '../../../COM/config/app.config';
import { Operation } from '../../../COM/Models/operations';
import { DashboardConstant } from '../../constant/dashboard/dashboard.constant';
import { ReducedCurrency } from '../../models/administration/reduced-currency.model';
import { Dashboard } from '../../models/dashboard/dashboard.model';
import { ObjectToSend } from '../../models/sales/object-to-save.model';
import { ResourceService } from '../../shared/services/resource/resource.service';
import { DataTransferShowSpinnerService } from '../../shared/services/spinner/data-transfer-show-spinner.service';
import { Colorset } from '../Colorset';

@Injectable()
export class DashboardService extends ResourceService<Dashboard> {
  public currency: ReducedCurrency;
  public periods = {
    saleState: null,
    itemPurchase: null,
    itemStockStates: null,
    orderStatus: null,
    purchaseRequest: null,
    salesPurchaseVolume: null,
    topCustomer: null,
    topSupplier: null

  };

  dragula = '';
  Clicked = 'period-filter with-shadow card h-100';
  colorset;
  public shouldRefresh = false;
  public costumeColors = {
    BarChart: [
      { // Blue
        backgroundColor: 'rgb(77 194 241)',

      },
      { // grey
        backgroundColor: 'rgb(237 109 112)',

      },
      {
        backgroundColor: 'rgba(200, 206, 211, 0.5803921568627451)',
      },
      {
        backgroundColor: 'rgba(100, 80, 136, 0.34901960784313724)',
      },
      {
        backgroundColor: 'rgba(255, 225, 180, 0.56)',
      }
    ],
    PieChart: [{
      backgroundColor: [
        'rgba(112, 175, 181, 0.3803921568627451)',
        'rgba(200, 206, 211, 0.5803921568627451)',
        'rgba(222, 46, 45, 0.6196078431372549)',
        'rgba(100, 80, 136, 0.34901960784313724)',
        'rgba(255, 225, 180, 0.56)']
    }]
  };

  public UpdatePeriodCookies() {
    this.cookieService.set('Periods', JSON.stringify(this.periods));
  }

  public GetPeriodCookies() {
    try {
      this.periods = (JSON.parse(this.cookieService.get('Periods')));
    } catch {
      this.cookieService.set('Periods', JSON.stringify(this.periods));
    }
    return this.periods;
  }

  public setCostumeColor(arrayColors) {
    this.costumeColors = {
      BarChart: [
        { // Blue
          backgroundColor: arrayColors.color1,

        },
        { // grey
          backgroundColor: arrayColors.color2,

        },
        {
          backgroundColor: arrayColors.color3,
        },
        {
          backgroundColor: arrayColors.color4,
        },
        {
          backgroundColor: arrayColors.color5,
        }
      ],
      PieChart: [{
        backgroundColor: [
          arrayColors.color1,
          arrayColors.color2,
          arrayColors.color3,
          arrayColors.color4,
          arrayColors.color5]
      }]
    };
  }

  public setCostumeColors(arrayColors) {
    this.costumeColors = arrayColors;
    this.cookieService.set('currentColor', JSON.stringify(this.costumeColors), null, '/main');
  }



  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig,
    @Inject(DataTransferShowSpinnerService) dataTransferShowSpinnerService, private cookieService: CookieService) {
    super(
      httpClient, appConfig, 'dashboard', null, null, dataTransferShowSpinnerService);
    this.colorset = this.GetColorIndex();
    if (!this.colorset) {
      this.colorset = 1;
      this.SetColor(1);
    } else {
      this.setCostumeColors(this.GetColors());
    }
  }




  public getRoleConfigsModulesFuncs(): Observable<any> {
    return super.callService(Operation.POST, DashboardConstant.GET_ROLE_CONFIGS_MODULES_FUNCS, null, null, true);
  }
  public getReducedRoleConfigsModulesFuncs(): Observable<any> {
    return super.callService(Operation.POST, DashboardConstant.GET_REDUCED_ROLE_CONFIGS_MODULES_FUNCS, null, null, true);
  }

  public getRoleConfigs(): Observable<any> {
    return super.callService(Operation.POST, DashboardConstant.GET_ROLE_CONFIGS, null, null, true);
  }
  public getReducedRoleConfigs(): Observable<any> {
    return super.callService(Operation.POST, DashboardConstant.GET_REDUCED_ROLE_CONFIGS, null, null, true);
  }

  public getReducedRoleConfigsModulesFuncsServerSession(): Observable<any> {
    return super.callService(Operation.POST, DashboardConstant.GET_REDUCED_ROLE_CONFIGS_MODULES_FUNCS_SERVER_SESSION, null, null, true);
  }

  public getRoleConfigsServerSession(): Observable<any> {
    return super.callService(Operation.POST, DashboardConstant.GET_ROLE_CONFIGS_SERVER_SESSION, null, null, true);
  }
  public getReducedRoleConfigsServerSession(): Observable<any> {
    return super.callService(Operation.POST, DashboardConstant.GET_REDUCED_ROLE_CONFIGS_SERVER_SESSION, null, null, true);
  }

  public checkHasOnlyRoles(data: any): Observable<any> {
    return super.callService(Operation.POST, DashboardConstant.CHECK_HAS_ONLY_ROLES, data, null, true);
  }

  public checkHasOnlyPermissions(data: any): Observable<any> {
    return super.callService(Operation.POST, DashboardConstant.CHECK_HAS_ONLY_PERMISSIONS, data, null, true);
  }

  public checkHasOnlyRolesPermissions(data: any): Observable<any> {
    return super.callService(Operation.POST, DashboardConstant.CHECK_HAS_ONLY_ROLES_PERMISSIONS, data, null, true);
  }

  public AddDragable() {
    this.Clicked = 'period-filter card h-100 ConfigDash';
    this.dragula = 'DRAGULA_FACTS';
  }
  public StopDragable() {
    this.Clicked = 'period-filter card h-100';
    this.dragula = '';
  }
  public SetColor(colorindex: number): any {
    this.colorset = colorindex;
    this.selectcolors(colorindex);
    this.cookieService.set('colorset', JSON.stringify(this.colorset), null, '/main');
    this.cookieService.set('currentColor', JSON.stringify(this.costumeColors), null, '/main');
  }
  public GetColorIndex() {
    return (parseInt(this.cookieService.get('colorset'), 10));
  }

  public refreshwidgets() {
    this.shouldRefresh = true;
  }

  public GetColors() {
    return (JSON.parse(this.cookieService.get('currentColor')));
  }

  selectcolors(colorindex, colorarray?) {
    if (colorindex === DashboardConstant.COLOR_SET_1) {
      this.setCostumeColors(Colorset.colorsets.cs1);
    }
    if (colorindex === DashboardConstant.COLOR_SET_2) {
      this.setCostumeColors(Colorset.colorsets.cs2);
    }
    if (colorindex === DashboardConstant.COLOR_SET_3) {
      this.setCostumeColors(Colorset.colorsets.cs3);
    }
  }

  getKPIFromItemPurchaseStoredProcedure(rankCriteria: boolean, numberOfRows: number, periodEnum: number): Observable<any> {
    const data = {};
    data['rankCriteria'] = rankCriteria;
    data['numberOfRows'] = numberOfRows;
    data['periodEnum'] = periodEnum;
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return super.callService(Operation.POST, 'getKPIFromItemPurchaseStoredProcedure', objectToSend, null, true);
  }
  getKPIFromItemSaleStoredProcedure(rankCriteria: boolean, numberOfRows: number, periodEnum: number): Observable<any> {
    const data = {};
    data['rankCriteria'] = rankCriteria;
    data['numberOfRows'] = numberOfRows;
    data['periodEnum'] = periodEnum;
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return super.callService(Operation.POST, 'getKPIFromItemSaleStoredProcedure', objectToSend, null, true);
  }
  getKPIFromSalePurchaseStateStoredProcedure(operationType: string, periodEnum: number, month: number): Observable<any> {
    const data = {};
    data['operationType'] = operationType;
    data['periodEnum'] = periodEnum;
    data['month'] = month;

    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return super.callService(Operation.POST, 'getKPIFromSalePurchaseStateStoredProcedure', objectToSend, null, true);
  }

  getKPISupplierOutstanding(operationType: string, periodEnum: number, month: number): Observable<any> {
    const data = {};
    data['operationType'] = operationType;
    data['periodEnum'] = periodEnum;
    data['month'] = month;
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return super.callService(Operation.POST, 'getKPISupplierOutstanding', objectToSend, null, true);
  }
  getKPICustomerOutstanding(operationType: string, periodEnum: number, month: number): Observable<any> {
    const data = {};
    data['operationType'] = operationType;
    data['periodEnum'] = periodEnum;
    data['month'] = month;
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return super.callService(Operation.POST, 'getKPICustomerOutstanding', objectToSend, null, true);
  }
  getKPIFromPurchasesSalesStoredProcedure(operationType: string, periodEnum: number, month: number): Observable<any> {
    const data = {};
    data['operationType'] = operationType;
    data['periodEnum'] = periodEnum;
    data['month'] = month;
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return super.callService(Operation.POST, 'getKPIFromPurchasesSalesStoredProcedure', objectToSend, null, true);
  }

  getKPICummulativeTurnover(operationType: string, periodEnum: number, month: number): Observable<any> {
    const data = {};
    data['operationType'] = operationType;
    data['periodEnum'] = periodEnum;
    data['month'] = month;
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return super.callService(Operation.POST, 'getKPICummulativeTurnover', objectToSend, null, true);
  }
  getKPIFromTopCustomerStoredProcedure(rankCriteria: boolean, numberOfRows: number, periodEnum: number): Observable<any> {
    const data = {};
    data['rankCriteria'] = rankCriteria;
    data['numberOfRows'] = numberOfRows;
    data['periodEnum'] = periodEnum;
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return super.callService(Operation.POST, 'getKPIFromTopCustomerStoredProcedure', objectToSend, null, true);
  }
  getKPIFromTopSupplierStoredProcedure(rankCriteria: boolean, numberOfRows: number, periodEnum: number): Observable<any> {
    const data = {};
    data['rankCriteria'] = rankCriteria;
    data['numberOfRows'] = numberOfRows;
    data['periodEnum'] = periodEnum;
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return super.callService(Operation.POST, 'getKPIFromTopSupplierStoredProcedure', objectToSend, null, true);
  }

  getKPIFromOrderStateStoredProcedure(storedProcedureName: string, tierType: string,
    numberOfRows: number, periodEnum: number): Observable<any> {
    const data = {};
    data['storedProcedureName'] = storedProcedureName;
    data['tierType'] = tierType;
    data['numberOfRows'] = numberOfRows;
    data['periodEnum'] = periodEnum;
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return super.callService(Operation.POST, 'getKPIFromOrderStateStoredProcedure', objectToSend, null, true);
  }

  getKPIFromTotalWorkDaysStoredProcedure(storedProcedureName: string, month: number, year: number, teamName: string): Observable<any> {
    const data = {};
    data['storedProcedureName'] = storedProcedureName;
    data['month'] = month;
    data['year'] = year;
    data['teamName'] = teamName;
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return super.callService(Operation.POST, 'getKPIFromTotalWorkDaysStoredProcedure', objectToSend, null, true);
  }

  getKPITotalCustomers(): Observable<any> {
    return super.callService(Operation.GET, 'getKPITotalCustomers');
  }
  getKPISalesTurnover(): Observable<any> {
    return super.callService(Operation.GET, 'getKPISalesTurnover');
  }
  getKPIPurchaseTurnover(): Observable<any> {
    return super.callService(Operation.GET, 'getKPIPurchaseTurnover');
  }
  public getTotalOrderB2B(): Observable<any> {
    return this.callService(Operation.GET, DashboardConstant.GET_TOTAL_ORDER_B2B);
  }

  getKPIFromDeliveryRateStoredProcedure(storedProcedureName: string, type: string, byMonth: number, periodEnum: number): Observable<any> {
    const data = {};
    data['storedProcedureName'] = storedProcedureName;
    data['type'] = type;
    data['byMonth'] = byMonth;
    data['periodEnum'] = periodEnum;
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return super.callService(Operation.POST, 'getKPIFromDeliveryRateStoredProcedure', objectToSend, null, true);
  }

  getTierRank(id): Observable<any> {
    return super.callService(Operation.POST, 'getTierRank/' + id, null, null, true);
  }
}
