import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { PermissionConstant } from '../permission-constant';
import { AuthService } from '../../login/Authentification/services/auth.service';
import { LeaveRequestConstant } from '../../constant/payroll/leave.constant';
import { Router } from '@angular/router';
import { TimeSheetConstant } from '../../constant/rh/timesheet.constant';
import { DocumentRequestConstant } from '../../constant/payroll/document-request.constant';

@Component({
  selector: 'app-header-shortcut',
  templateUrl: './header-shortcut.component.html',
  styleUrls: ['./header-shortcut.component.scss']
})
export class HeaderShortcutComponent implements OnInit {

  @Input() RoleConfigConstant;
  @Output() goToQuotationEvent = new EventEmitter<any>();
  @Output() goToDeliveryEvent = new EventEmitter<any>();
  @Output() goToDeliveryListEvent = new EventEmitter<any>();
  @Output() goToAddAssetEvent = new EventEmitter<any>();
  @Output() goToSearchItemEvent = new EventEmitter<any>();
  @Output() goToCounterSalesEvent = new EventEmitter<any>();

  hasAddQuotationPermission = false;
  hasAddDeliveryPermission = false;
  hasQuickSalesPermission = false;
  hasDeliveryListPermission = false;
  hasAddAssetPermission = false;
  hasAddLeavePermission = false;
  hasTimesheetListPermission = false;
  hasAddDocumentRequestPermission = false;
  haveCounterSalesPermission = false;

  constructor(public authService: AuthService, public router: Router) {
    this.hasAddQuotationPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_QUOTATION_SALES);
    this.hasAddDeliveryPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_DELIVERY_SALES);
    this.hasQuickSalesPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_QUICK_SALES);
    this.hasDeliveryListPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_DELIVERY_SALES);
    this.hasAddAssetPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_ASSET_SALES);
    this.hasAddLeavePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.ADD_LEAVE);
    this.hasTimesheetListPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.TIMESHEET_MY_TIMESHEET);
    this.hasAddDocumentRequestPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.ADD_DOCUMENTREQUEST);
    this.haveCounterSalesPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.COUNTER_SALES);
  }

  ngOnInit() {
  }

  public goToQuotation() {
    this.goToQuotationEvent.emit();
  }

  public goToDelivery() {
    this.goToDeliveryEvent.emit();
  }

  public goToDeliveryList() {
    this.goToDeliveryListEvent.emit();
  }

  public goToAddAsset() {
    this.goToAddAssetEvent.emit();
  }

  public goToSearchItem() {
    this.goToSearchItemEvent.emit();
  }
  public goToCounterSales() {
    this.goToCounterSalesEvent.emit();
  }

  goToAddLeave() {
    this.router.navigateByUrl(LeaveRequestConstant.LEAVE_REQUEST_ADD_URL);
  }

  goToListMyTimesheet() {
    this.router.navigateByUrl(TimeSheetConstant.TIMESHEET_LIST_URL);
  }

  goToAddDocumentRequest() {
    this.router.navigateByUrl(DocumentRequestConstant.DOCUMENT_REQUEST_ADD_URL);
  }
}
