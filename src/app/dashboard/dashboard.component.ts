import { Component, ElementRef, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IntlService } from '@progress/kendo-angular-intl';
import { CompanyService } from '../administration/services/company/company.service';
import { DashboardConstant } from '../constant/dashboard/dashboard.constant';
import { SharedConstant } from '../constant/shared/shared.constant';
import { NumberConstant } from '../constant/utility/number.constant';
import { ReducedCurrency } from '../models/administration/reduced-currency.model';
import { DeliveryRate } from '../models/dashboard/delivery-rate.model';
import { PermissionConstant } from '../Structure/permission-constant';
import { RoleConfigConstant } from '../Structure/_roleConfigConstant';
import { DashboardService } from './services/dashboard.service';
import { AuthService } from '../login/Authentification/services/auth.service';
import { LocalStorageService } from '../login/Authentification/services/local-storage-service';




@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public RoleConfigConstant = RoleConfigConstant;

  /**show currency  format to kendo input */

  public currency: ReducedCurrency;
  public FORMAT_NUMBER = '{0:##,#.###}';
  public dateformat = 'dd/MM/yyyy';

  dragula = '';
  ClickedClass = 'card h-100 with-shadow';
  public shouldRefresh = false;
  public totalClientPerDay: any;
  public currentMonthTurnover: any;
  public lastMonthTurnoverSales: any;
  public lastMonthTurnoverDepense: any;
  public currentMonthTurnoverSales: any;
  public currentMonthTurnoverDepense: any;
  public totalOrderB2B: any;
  public deliverySalesRate: DeliveryRate;
  public deliveryPurchaseRate: DeliveryRate;
  public salesType = DashboardConstant.OPERATION_TYPE_SALE;
  public purchaseType = DashboardConstant.OPERATION_TYPE_PURCHASE;
  public InvoiceAmountTTCSales: number;
  public InvoiceAmountTTCPurchases: number;
  public InvoiceRemainingAmountSales: number;
  public InvoiceRemainingAmountPurchases: number;
  public InvoiceRemainingAmountPercentPurchases = NumberConstant.ZERO;
  public InvoiceRemainingAmountPercentSales = NumberConstant.ZERO;
  public hasSalesPermission = false;
  public hasPurchasePermission = false;
  public hasTreasurySalesPermission = false;
  public hasTreasuryPurchasePermission = false;
  public userCurrencyCode: any;
  public userCurrencyPrecision: any;
  public userCurrencySymbole: any;


  constructor(public el: ElementRef,
    public companyService: CompanyService,
      public dashService: DashboardService, public intl: IntlService, private authService: AuthService, private translate: TranslateService,
      private localStorageService: LocalStorageService) {
    this.getSelectedCurrency();
  }


  ngOnInit(): void {
    this.hasSalesPermission = this.authService.hasAuthority(PermissionConstant.DashboardPermissions.SALES_DASHBOARD);
    this.hasPurchasePermission = this.authService.hasAuthority(PermissionConstant.DashboardPermissions.PURCHASE_DASHBOARD);
    this.hasTreasurySalesPermission = this.authService.hasAuthority(PermissionConstant.DashboardPermissions.TREASURY_SALES_DASHBOARD);
    this.hasTreasuryPurchasePermission = this.authService.hasAuthority(PermissionConstant.DashboardPermissions.TREASURY_PURCHASE_DASHBOARD);
    this.getSelectedCurrency();
    this.FORMAT_NUMBER = '{0:##,#.###}';
    this.dateformat = 'dd/MM/yyyy';
    if (this.hasSalesPermission) {
      this.getTotalOrderB2B();
      this.getTotalClientPerDay();
      this.getSalesTurnover();
    }
    if (this.hasPurchasePermission) {
      this.getPurchaseTurnover();
    }
    if (this.hasTreasurySalesPermission) {
      this.getCustomerOutstanding(NumberConstant.FOUR, NumberConstant.ZERO);
    }
    if (this.hasTreasuryPurchasePermission) {
      this.getSupplierOutstanding(NumberConstant.FOUR, NumberConstant.ZERO);
    }

  }

  public getCustomerOutstanding(periodEnum, byMonth) {
    this.dashService.getKPICustomerOutstanding(DashboardConstant.OPERATION_TYPE_SALE,
      periodEnum, byMonth).subscribe((data) => {
        if (Object.keys(data).length > NumberConstant.ZERO) {
          this.InvoiceAmountTTCSales = data[NumberConstant.ZERO].InvoiceAmountTTC;
          this.InvoiceRemainingAmountSales = data[NumberConstant.ZERO].InvoiceRemainingAmount;
          this.InvoiceRemainingAmountPercentSales = Math.round((NumberConstant.ONE_HUNDRED *
            this.InvoiceRemainingAmountSales) / this.InvoiceAmountTTCSales);
        }
      });
  }

  public getSupplierOutstanding(periodEnum, byMonth) {
    this.dashService.getKPISupplierOutstanding(DashboardConstant.OPERATION_TYPE_PURCHASE,
      periodEnum, byMonth).subscribe((data) => {
        if (Object.keys(data).length > NumberConstant.ZERO) {
          this.InvoiceAmountTTCPurchases = data[NumberConstant.ZERO].InvoiceAmountTTC;
          this.InvoiceRemainingAmountPurchases = data[NumberConstant.ZERO].InvoiceRemainingAmount;
          this.InvoiceRemainingAmountPercentPurchases = Math.round((NumberConstant.ONE_HUNDRED *
            this.InvoiceRemainingAmountPurchases) / this.InvoiceAmountTTCPurchases);
        }
      });
  }

  public getTotalOrderB2B() {
    this.dashService.getTotalOrderB2B().subscribe((data) => {
      if (Object.keys(data).length > NumberConstant.ZERO) {
        this.totalOrderB2B = data;
      }
    });
  }


  public getTotalClientPerDay() {
    this.dashService.getKPITotalCustomers().subscribe((data) => {
      if (Object.keys(data).length > NumberConstant.ZERO) {
        this.totalClientPerDay = data[NumberConstant.ZERO];
      }
    });
  }
 

  public getSalesTurnover() {
    this.dashService.getKPISalesTurnover().subscribe((data) => {
      if (Object.keys(data).length > NumberConstant.ZERO) {
        data.forEach((sales) => {
          if (DashboardConstant.LAST_MONTH_TURNOVER === sales.Label) {
            this.lastMonthTurnoverSales = sales.Value;
          }
          if (DashboardConstant.CURRENT_MONTH_TURNOVER === sales.Label) {
            this.currentMonthTurnoverSales = sales.Value;
          }sales

        });
      }
    });
  }

  public getPurchaseTurnover() {
    this.dashService.getKPIPurchaseTurnover().subscribe((data) => {
      if (Object.keys(data).length > NumberConstant.ZERO) {
        data.forEach((purchase) => {
          if (DashboardConstant.LAST_MONTH_TURNOVER_DEPENSE === purchase.Label) {
            this.lastMonthTurnoverDepense = purchase.Value;
          }
          if (DashboardConstant.CURRENT_MONTH_TURNOVER_DEPENSE === purchase.Label) {
            this.currentMonthTurnoverDepense = purchase.Value;
          }

        });
      }
    });
  }


  public labelContent(e: any): string {
    return e.category;
  }

  getSelectedCurrency() {
    this.userCurrencyCode = this.localStorageService.getCurrencyCode();
    this.userCurrencyPrecision = this.localStorageService.getCurrencyPrecision();
    this.userCurrencySymbole = this.localStorageService.getCurrencySymbol();
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngDoCheck() {
    this.dragula = this.dashService.dragula;
    this.ClickedClass = this.dashService.Clicked;
    this.shouldRefresh = this.dashService.shouldRefresh;
    if (this.shouldRefresh === true) {
      this.dashService.shouldRefresh = false;
      this.ngOnInit();
    }
  }



}
