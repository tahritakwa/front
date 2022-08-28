import { Component, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../permission-constant';
import { RoleConfigConstant } from '../_roleConfigConstant';

@Component({
  selector: 'app-document-menu',
  templateUrl: './document-menu.component.html',
  styleUrls: ['./document-menu.component.scss']
})
export class DocumentMenuComponent implements DoCheck {
  public RoleConfigConstant = RoleConfigConstant;
  isSalesDocument: boolean;
  //Purchase document
  public list_OrderQuotation_PU = false;
  public list_PurchaseInvoice_PU = false;
  public list_Receipt_PU = false;
  public list_Invoice_PU = false;
  public list_Asset_PU = false;
  //Sales Document
  public list_Quotation_SA = false;
  public list_Order_SA = false;
  public list_Delivery_SA = false;
  public list_Invoice_SA = false;
  public list_Asset_SA = false;
  public list_InvoiceAsset_SA = false;

  constructor(private router: Router, public authService: AuthService) { }

  ngOnInit() {
    //Purchase Document permissions
    this.list_OrderQuotation_PU = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_ORDER_QUOTATION_PURCHASE);
    this.list_PurchaseInvoice_PU = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_FINAL_ORDER_PURCHASE);
    this.list_Receipt_PU = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_RECEIPT_PURCHASE);
    this.list_Invoice_PU = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_INVOICE_PURCHASE);
    this.list_Asset_PU = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_ASSET_PURCHASE);
    //Sales Document permissions
    this.list_Quotation_SA = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_QUOTATION_SALES);
    this.list_Order_SA = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_ORDER_SALES);
    this.list_Delivery_SA = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_DELIVERY_SALES);
    this.list_Invoice_SA = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_INVOICE_SALES);
    this.list_Asset_SA = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_ASSET_SALES);
    this.list_InvoiceAsset_SA = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_INVOICE_ASSET_SALES);
  }

  ngDoCheck() {
    this.idDocumentForm();
  }

  idDocumentForm() {
    if (this.router.url.indexOf('sales') > 0) {
      this.isSalesDocument = true;
    } else {
      this.isSalesDocument = false;
    }
  }
}
