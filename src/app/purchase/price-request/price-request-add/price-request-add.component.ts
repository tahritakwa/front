import { Component, OnInit, ViewContainerRef, ViewChild, ComponentFactoryResolver, AfterContentInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { PriceRequestService } from '../../services/price-request/PriceRequestService';
import { DocumentLineService } from '../../../sales/services/document-line/document-line.service';
import { dateValueGT, ValidationService } from '../../../shared/services/validation/validation.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DocumentFormService } from '../../../shared/services/document/document-grid.service';
import { TiersService } from '../../services/tiers/tiers.service';
import { CurrencyService } from '../../../administration/services/currency/currency.service';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { PriceRequestConstant } from '../../../constant/sales/price-request.constant';
import { PriceRequest } from '../../../models/purchase/price-request.model';
import { PredicateFormat, Filter, Relation, Operation } from '../../../shared/utils/predicate';
import { QuotationPriceRequestCardComponent } from '../../components/quotation-price-request-card/quotation-price-request-card.component';
import { Document } from '../../../models/sales/document.model';
import { BudgetForPriceRequestComponent } from '../../components/budget-for-price-request/budget-for-price-request.component';
import { DocumentLine } from '../../../models/sales/document-line.model';
import { DocumentService } from '../../../sales/services/document/document.service';
import { TiersPriceRequestConstant } from '../../../constant/purchase/tiers-price-request';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import swal from 'sweetalert2';
import { InformationTypeEnum } from '../../../shared/services/signalr/information/information.enum';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { PriceRequestGridComponent } from '../../components/price-request-grid/price-request-grid.component';
import { documentStatusCode } from '../../../models/enumerators/document.enum';
import { Subscription } from 'rxjs/Subscription';
import { Location } from '@angular/common';
import { SearchItemService } from '../../../sales/services/search-item/search-item.service';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { NumberConstant } from '../../../constant/utility/number.constant';

const PRICE_REQUEST_EDIT_URL = 'main/purchase/pricerequest/edit/';
@Component({
  selector: 'app-price-request-add',
  templateUrl: './price-request-add.component.html',
  styleUrls: ['./price-request-add.component.scss'],
  providers: [DocumentLineService]
})

export class PriceRequestAddComponent implements OnInit, OnDestroy {
  private idSubscription: Subscription;
  private activeSubscription: Subscription;
  public statusCode = documentStatusCode;
  @ViewChild(PriceRequestGridComponent) public priceOrderGrid;
  @ViewChild('componentHolder', { read: ViewContainerRef }) componentHolder: ViewContainerRef;
  @ViewChild(BudgetForPriceRequestComponent) private purchaseOrderGrid;
  priceRequestForm: FormGroup;
  id: number;
  isUpdateMode: boolean;
  public predicate: PredicateFormat;
  private priceRequestToUpdate: PriceRequest = new PriceRequest();
  budgetComponentNumber = 0;
  formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);
  public listCreatedComponent: Array<any> = new Array<any>();
  BudgetList: DocumentLine[] = [];
  isHasBudgetData: boolean;
  public minDate : Date = new Date(1735,0,1);
  public showQuotationPermission = false;
  public showUpdateQuotationPermission = false;
  public showOrderPermission = false;
  public showUpdateOrderPermission = false;
  public haveAddPermission :boolean;
  public haveUpdatePermission :boolean;
  public haveSendEmailPermission :boolean;
  constructor(private fb: FormBuilder, private priceRequestService: PriceRequestService,
              public validationService: ValidationService, public viewRef: ViewContainerRef,
              private router: Router,
              private activatedRoute: ActivatedRoute, public translate: TranslateService, public documentFormService: DocumentFormService,
              public supplierSerice: TiersService, public currencyService: CurrencyService, private swalWarrings: SwalWarring,
              private componentFactoryResolver: ComponentFactoryResolver, private serviceDocument: DocumentService,
              private growlService: GrowlService, private location: Location, private searchItemService:SearchItemService, public authService: AuthService) {
    this.activatedRoute.params.subscribe(params => {
      this.id = params[SharedConstant.ID_LOWERCASE] || 0;
    });
    this.isUpdateMode = this.id > NumberConstant.ZERO;
    this.idSubscription = this.activatedRoute.params.subscribe(params => {
      this.id = +params['id'] || 0;
    });

  }

  ngOnDestroy(): void {
    if (this.idSubscription) {
      this.idSubscription.unsubscribe();
    }
    if (this.activeSubscription) {
      this.activeSubscription.unsubscribe();
    }
  }
  /** * Create PriceRequest Form */
  private createAddForm(): void {
    this.priceRequestForm = this.fb.group({
      Reference: new FormControl(''),
      DocumentDate: new FormControl(new Date(), [Validators.required])
    });
  }



  /** * Retreive the PriceRequest to update */
  private getDataToUpdate() {
    this.preparePredicate();
    this.activeSubscription = this.priceRequestService.getPurchaseBudget(this.predicate).subscribe(
      res => {
        res = res.objectData;
        this.priceRequestToUpdate = res;

        this.priceRequestForm.controls[PriceRequestConstant.REFERENCE].setValue(res.Reference);
        this.priceRequestForm.controls[PriceRequestConstant.DOCUMENT_DATE].setValue(new Date(res.DocumentDate));
        if (res.PriceRequestDetail) {
          this.priceOrderGrid.getDataToUpdate(res);
        }
        if (res.Document) {
          this.purchaseOrderGrid.currentDocuments = res.Document;
          this.isHasBudgetData = true;
          res.Document.forEach((element: Document) => {
            this.cloneTemplate(element);
          });
        }
      }
    );
    if (!this.haveUpdatePermission){
      this.priceRequestForm.disable();
    }
  }

  public preparePredicate(): void {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(new Filter(PriceRequestConstant.ID, Operation.eq, this.id));
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push.apply(this.predicate.Relation,
      [new Relation(PriceRequestConstant.PRICE_REQUEST_DETAILS),
        new Relation(PriceRequestConstant.TIERS_NAVIGATION)]);
  }

  ngOnInit() {
    this.haveAddPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_PRICEREQUEST);
    this.haveUpdatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_PRICEREQUEST);
    this.showQuotationPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_QUOTATION_PRICE_REQUEST);
    this.showUpdateQuotationPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_UPDATE_QUOTATION_PRICE_REQUEST);
    this.showOrderPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_ORDER_PRICE_REQUEST);
    this.showUpdateOrderPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_UPDATE_ORDER_PRICE_REQUEST);
    this.haveSendEmailPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SEND_EMAIL_PRICEREQUEST);
    this.createAddForm();
    if (this.isUpdateMode) {
      this.getDataToUpdate();
      this.priceOrderGrid.isNotValidateToSendMail = false;
    }
  }

  load(val) {
    if (val == this.router.url) {
      //this.spinnerService.show();
      this.router.routeReuseStrategy.shouldReuseRoute = function () {
        return true;
      };
    }
  }

  closeAllOpenningTemplate(codeOfSelectedItem?: string) {
    this.listCreatedComponent.forEach(x => {
      if (codeOfSelectedItem && x.instance.formGroup.controls['Code'].value == codeOfSelectedItem) {

        x.instance.showDetails = true;
      } else {
        x.instance.showDetails = false;
      }
    });
  }
  cloneTemplate(documentToUpdate?: Document) {
    this.closeAllOpenningTemplate();
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(QuotationPriceRequestCardComponent);
    const componentRef = this.componentHolder.createComponent(componentFactory, this.budgetComponentNumber);
    componentRef.instance.index = this.budgetComponentNumber;
    componentRef.instance.showAndUpdate = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_UPDATE_QUOTATION_PRICE_REQUEST);
    this.listCreatedComponent.push(componentRef);
    this.budgetComponentNumber++;
    componentRef.instance.listSupllier = this.priceOrderGrid.supplierList;
    if (documentToUpdate !== undefined) {
      componentRef.instance.dataToUpdate = documentToUpdate;
      this.searchItemService.idDocument=documentToUpdate.Id;
    }
    componentRef.instance.deleteDocument.subscribe(x => {
      if (componentRef.instance.formGroup.controls[PriceRequestConstant.ID].value > 0) {
        this.serviceDocument.deleteDocument(componentRef.instance.formGroup.controls['Id'].value).toPromise().then(res => {
          this.removeTemplate(x);
          if (this.isUpdateMode && this.priceRequestToUpdate && this.priceRequestToUpdate.Document
            && this.priceRequestToUpdate.Document.length > 0) {
            this.priceRequestToUpdate.Document = this.priceRequestToUpdate.Document.filter(
              y => y.Id != componentRef.instance.formGroup.controls['Id'].value);
          }
        });
      } else {
        this.removeTemplate(x);
      }

    });



  }
  removeTemplate(x: number) {
    let componentRefs = this.listCreatedComponent.filter(y => y.instance.index === x)[0];
    let vcrIndex: number = this.componentHolder.indexOf(componentRefs);
    // removing component from container
    this.componentHolder.detach(vcrIndex);
    this.listCreatedComponent = this.listCreatedComponent.filter(y => y.instance.index !== x);
    this.budgetComponentNumber--;
  }
  save() {
    if (this.priceRequestForm.valid && this.priceOrderGrid.view && this.priceOrderGrid.view.length > 0) {
      let priceRequest: PriceRequest;
      if (!this.isUpdateMode) {
        priceRequest = new PriceRequest();
        priceRequest.PriceRequestDetail = this.priceOrderGrid.view;
        Object.assign(priceRequest, this.priceRequestForm.getRawValue());
        priceRequest.CreationDate = new Date();
      } else {
        priceRequest = Object.assign({}, new PriceRequest(), this.priceRequestToUpdate);
        priceRequest.Reference = this.priceRequestForm.controls[PriceRequestConstant.REFERENCE].value;
        priceRequest.DocumentDate = this.priceRequestForm.controls[PriceRequestConstant.DOCUMENT_DATE].value;
        priceRequest.PriceRequestDetail = this.priceOrderGrid.documentLineService.priceRequest;
      }
      this.priceRequestService.save(priceRequest, !this.isUpdateMode).subscribe(x => {
        this.router.navigate(['main/purchase/pricerequest']);
      });
    } else {
      if(!this.priceOrderGrid.view || this.priceOrderGrid.view.length == 0){
        this.growlService.InfoNotification(this.translate.instant('ADD_LINE_REQUIRED'));
      } else{
        this.validationService.validateAllFormFields(this.priceRequestForm);
      }

    }
    this.priceOrderGrid.isPriceRequestChaged = false;
  }
  public generatePurchaseOrder() {
    this.priceOrderGrid.isTabGridOpen = false;
    this.purchaseOrderGrid.itemDropDownMultiselect.lisItem = [];
    this.purchaseOrderGrid.supplierDropDown.selectedValueMultiSelect = [];
    this.purchaseOrderGrid.listSupplierToFilter = [];
    this.purchaseOrderGrid.supplierDropDown.listSupllier = this.priceOrderGrid.supplierList;
    this.purchaseOrderGrid.supplierDropDown.preparePredicate();
    this.purchaseOrderGrid.supplierDropDown.initDataSource();
    this.purchaseOrderGrid.itemDropDownMultiselect.itemSelected = undefined;
    this.purchaseOrderGrid.quotationSelected = undefined;
    this.purchaseOrderGrid.listQuotationToFilter = [];
    this.purchaseOrderGrid.listItemToFilter = [];
    this.purchaseOrderGrid.view = { data: [], total: 0 };
    this.purchaseOrderGrid.gridData = [];
    this.purchaseOrderGrid.skip = 0;
    this.purchaseOrderGrid.pageSize = 5;
    this.priceRequestService.getPurchaseBudget(this.predicate).toPromise().then(
      res => {
        res = res.objectData;

        if (res.Document) {
          this.purchaseOrderGrid.currentDocuments = res.Document;
          this.isHasBudgetData = true;
          res.Document.forEach((element: Document) => {
            if (element.DocumentLine && element.DocumentLine.length > 0) {
              element.DocumentLine.forEach((docLine: DocumentLine) => {
                docLine.IdTiersNavigation = element.IdTiersNavigation;
                docLine.CodeDocument = element.Code;
                this.purchaseOrderGrid.gridData.push(docLine);
              });
            }
          });
        }
        this.purchaseOrderGrid.loadItems();

        this.purchaseOrderGrid.filterList();
        this.purchaseOrderGrid.gridData.forEach(element => {
          if (this.purchaseOrderGrid.itemDropDownMultiselect.lisItem.indexOf(element.IdItem) == -1) {
            this.purchaseOrderGrid.itemDropDownMultiselect.lisItem.push(element.IdItem);
          }
          if (this.purchaseOrderGrid.quotationFiltredDataSource.map(({ CodeDocument }) => CodeDocument).indexOf(element.CodeDocument) == -1) {
            this.purchaseOrderGrid.quotationFiltredDataSource.push(element);
          }

          if (this.purchaseOrderGrid.quotationDataSource.map(({ CodeDocument }) => CodeDocument).indexOf(element.CodeDocument) == -1) {
            this.purchaseOrderGrid.quotationDataSource.push(element);
          }
        });
        this.purchaseOrderGrid.itemDropDownMultiselect.initDataSource();
      }
    );
  }
  // send email
  public sendMail() {
    const title = this.translate.instant(TiersPriceRequestConstant.TITLE_SWAL_SEND_MAIL);
    const text = this.translate.instant(TiersPriceRequestConstant.TEXT_SWAL_SEND_MAIL);
    const confirmButtonText = this.translate.instant(TiersPriceRequestConstant.CONFIRM_BUTTON_SWAL_SEND_MAIL);
    const cancelButtonText = this.translate.instant(TiersPriceRequestConstant.CANCEL_BUTTON_SWAL_SEND_MAIL);
    this.swalWarrings.CreateSwal(text, title, confirmButtonText, cancelButtonText).then((result) => {
      if (result.value) {
        // send message
        if (this.id > 0) {
          this.priceRequestService.SendPriceRequestMail(this.id, InformationTypeEnum.SALES_PRICE_REQUEST_ADD).subscribe(x => {
            const message: string = this.translate.instant(TiersPriceRequestConstant.SUCCESS_SEND_MAIL);
            swal.fire({
              text: message,
              icon: SharedConstant.SUCCESS
            }).then(() => {
            });
          });
        } else {
          this.growlService.InfoNotification(this.translate.instant(TiersPriceRequestConstant.SAVE_REQUIRED));
        }
      }
    });
  }
  public PriceRequestChaged() {
    if (this.isUpdateMode && this.isHasBudgetData) {
      this.listCreatedComponent.forEach(x => {
        x.instance.getDevisList();
        x.instance.getCompanyParams();
      });
    }
    this.priceOrderGrid.isTabGridOpen = false;
    if (this.priceOrderGrid.isPriceRequestChaged) {
      this.growlService.warningNotification('merci de sauvgrader demanande de prix pour voir les changement');
    }
  }
  public activateListners() {
    this.priceOrderGrid.isTabGridOpen = true;
  }

  refreshQuotationList(event) {
    if (event && event.length > 0) {
      event.forEach(x => {
        this.listCreatedComponent.forEach(y => {
          if (x.IdDocumentAssocieted == y.instance.formGroup.controls['Id'].value) {
            y.instance.formGroup.controls['IdDocumentStatus'].value = this.statusCode.Valid;
          }
          let docAssoc = this.purchaseOrderGrid.gridData.filter(z => z.IdDocument == x.IdDocumentAssocieted);
          if (docAssoc && docAssoc.length > 0) {
            docAssoc.forEach(w => {
              w.IdDocumentLineStatus = this.statusCode.Valid;
            });
          }
        });
      });
    }
  }
  openQuotationtab(codeQuotation) {
    let bc = document.getElementById('bc');
    bc.className = 'tab-pane';
    let bcNav = document.getElementById('bcNav');
    bcNav.className = 'nav-link';
    bcNav['aria-selected'] = false;
    let qot = document.getElementById('quotation');
    qot.className = 'tab-pane active show';
    let quotationNav = document.getElementById('quotationNav');
    quotationNav.className = 'nav-link active show';
    quotationNav['aria-selected'] = true;

    this.closeAllOpenningTemplate(codeQuotation);
  }

}
