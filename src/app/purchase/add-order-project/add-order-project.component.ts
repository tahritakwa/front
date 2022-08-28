import {Component, OnInit, ViewChild, ViewContainerRef, OnDestroy, ElementRef} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {OrderProjectService} from '../services/order-project/order-project.service';
import {ProvisioningService} from '../services/order-project/provisioning-service.service';
import {ProvisioningConstant} from '../../constant/purchase/provisioning.constant';
import {SupplierDropdownComponent} from '../../shared/components/supplier-dropdown/supplier-dropdown.component';
import swal from 'sweetalert2';
import { PurchaseRequestConstant } from '../../constant/purchase/purchase-request.constant';
import { CurrencyService } from '../../administration/services/currency/currency.service';
import { AdvencedListProvisionnigComponent } from '../components/advenced-list-provisionnig/advenced-list-provisionnig.component';
import { PriceRequestService } from '../services/price-request/PriceRequestService';
import { DocumentConstant } from '../../constant/sales/document.constant';
import { ValidationService } from '../../shared/services/validation/validation.service';
import { documentStatusCode } from '../../models/enumerators/document.enum';
import { ItemService } from '../../inventory/services/item/item.service';
import { Provisioning } from '../../models/purchase/provisioning.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormModalDialogService } from '../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { GridProvisionComponent } from '../components/grid-provision/grid-provision.component';
import { KeyboardConst } from '../../constant/keyboard/keyboard.constant';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { SearchConstant } from '../../constant/search-item';
import { SharedConstant } from '../../constant/shared/shared.constant';
import { SearchItemService } from '../../sales/services/search-item/search-item.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../Structure/permission-constant';
import { DatePickerComponent } from '@progress/kendo-angular-dateinputs';

const URL_LIST = '/main/purchase/orderProject';

@Component({
  selector: 'app-add-order-project',
  templateUrl: './add-order-project.component.html',
  styleUrls: ['./add-order-project.component.scss']
})
export class AddOrderProjectComponent implements OnInit, OnDestroy {
  idProvision: number;
  selectedSupplier: boolean;
  validOrderProject: boolean;
  keyAction;
  public urlList = URL_LIST;
  @ViewChild('container', {read: ViewContainerRef})
  public containerRef: ViewContainerRef;
  public minDate: Date = new Date(1735, 0, 1);

  constructor(public OrderService: OrderProjectService, public translate: TranslateService,
    public currencyService: CurrencyService,
    public provisioningService: ProvisioningService,
    public validationService: ValidationService,
    public itemService: ItemService,
    protected modalService: ModalDialogInstanceService,
    private router: Router,
    public viewRef: ViewContainerRef, private route: ActivatedRoute,
    public formModalDialogService: FormModalDialogService,
    public priceRequestService: PriceRequestService,
    private searchItemService: SearchItemService,
    private formBuilder: FormBuilder, public authService: AuthService) {
    this.route.params.subscribe(params => {
      const id = +params[DocumentConstant.ID]; // (+) converts string InvoiceConstants.ID to a number
      if (id) {
        this.idProvision = id;
      }
    });
    this.acceptOrderProject();
  }

  @ViewChild(GridProvisionComponent) gridProvision;
  @ViewChild(SupplierDropdownComponent) supplier;
  @ViewChild(AdvencedListProvisionnigComponent) equivalentList;
  @ViewChild('RefSatrtDateNewReferences') RefSatrtDateNewReferences:DatePickerComponent;
  @ViewChild('RefEndDateNewReferences') RefEndDateNewReferences: DatePickerComponent;

  public isTheOrderBtnShown = false;
  public isTheOrderBtnDisabled = true;
  public generateOrderPermission = false;
  public ImportPermission = false;
  public haveUpdatePermission = false;
  public haveAddPermission = false;
  disabledDropDown = false;
  DisplayGrid: boolean = true;
  ShowHistory: boolean = false;
  SalesHistory: boolean = false;
  isMinMaxCheked: boolean = false;
  isNewReferencesChecked: boolean = false;
  selectedValueMultiSelect: Array<number>;
  SatrtDatePurchase: Date;
  EndDatePurchase: Date;
  SatrtDateSales: Date;
  EndDateSales: Date;
  SatrtDateNewReferences: Date;
  EndDateNewReferences: Date;
  orderObjectToSend: Provisioning;
  isInvalidSelectionOrDates: boolean;
  warrringString: string;
  suplierData: Array<any>;
  idItem: number;
  selectedRow: any;
  Code: string;
  showModalImport = false;
  supplierRequired: boolean;
  newRefDatesForm : FormGroup;
  onKeyActionHandler() {
    this.keyAction = (event) => {
      const keyName = event.key;
      if (keyName === KeyboardConst.ESCAPE) {
        this.onCloseSearchFetchModal(null);
      }
    };
    document.addEventListener(SearchConstant.KEY_UP, this.keyAction);
  }

  onCloseSearchFetchModal(data): void {
    if (this.searchItemService.openedModalOptions) {
      this.searchItemService.openedModalOptions.onClose();
      this.searchItemService.openedModalOptions = undefined;
    }
    this.modalService.closeAnyExistingModalDialog();
    this.gridProvision.selecteText();
  }

  ngOnDestroy() {
    document.removeEventListener(SearchConstant.KEY_DOWN, this.keyAction, false);
  }

  ngOnInit() {
    this.haveUpdatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_PROVISIONING);
    this.haveAddPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_PROVISIONING);
    this.generateOrderPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.GENERATE_ORDER_PROVISIONING);
    this.ImportPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.IMPORT_PROVISIONING);
    if (this.idProvision) {
      this.searchItemService.idProvision = this.idProvision;
      this.provisioningService.GetProvision(this.idProvision).subscribe(x => {
        this.supplier.selectedValueMultiSelect = [];
        this.addSupplier(x.TiersProvisioning, true);
        this.ShowHistory = (x.IdProvisioningOptionNavigation.SearchByPurhaseHistory) as boolean;
        this.SalesHistory = (x.IdProvisioningOptionNavigation.SearchBySalesHistory) as boolean;
        this.isMinMaxCheked = (x.IdProvisioningOptionNavigation.SearchByQty) as boolean;
        this.isNewReferencesChecked = (x.IdProvisioningOptionNavigation.SearchByNewReferences) as boolean;
        this.SatrtDatePurchase = new Date(x.IdProvisioningOptionNavigation.PucrahseStartDate);
        this.EndDatePurchase = new Date(x.IdProvisioningOptionNavigation.PucrahseEndDate);
        this.SatrtDateSales = new Date(x.IdProvisioningOptionNavigation.SalesStartDate);
        this.EndDateSales = new Date(x.IdProvisioningOptionNavigation.SalesEndDate);
        this.SatrtDateNewReferences = x.IdProvisioningOptionNavigation.NewReferencesStartDate
          ? new Date(x.IdProvisioningOptionNavigation.NewReferencesStartDate) : null;
        this.EndDateNewReferences = x.IdProvisioningOptionNavigation.NewReferencesEndDate
          ? new Date(x.IdProvisioningOptionNavigation.NewReferencesEndDate) : null;
        this.DisplayGrid = false;
        this.Code = x.Code;
        this.isTheOrderBtnDisabled = x.IsPurchaseOrderGenerated;
      });
    }
    this.newRefDatesForm = this.formBuilder.group({
      SatrtDateNewReferences : new FormControl(),
      EndDateNewReferences : new FormControl ()
    })
    if(!this.haveUpdatePermission){
      this.newRefDatesForm.disable();
    }
    this.onKeyActionHandler();
  }

  acceptOrderProject() {
    this.OrderService.getResult().subscribe((data) => {
      if (data.value) {
        if (data.data) {
          this.selectedSupplier = true;
          if (this.isAnyCheckBoxChecked()) {
            this.validOrderProject = true;
          }
        } else {
          this.selectedSupplier = false;
          this.validOrderProject = false;
        }
      }
    });
  }

  /**verify if there is a supplier is selected */
  supplierCheck(chek: boolean) {
    this.disabledDropDown = chek;
    if (this.disabledDropDown) {
      if (this.gridProvision) {
        this.gridProvision.itecmChange();
      }
      this.selectedValueMultiSelect = null;
      this.supplier.selectedValueMultiSelect = [];
    }
  }

  /**getSelected supplier */
  choosenSupplier($event) {
    this.selectedValueMultiSelect = $event.selectedValueMultiSelect;
    if (this.selectedValueMultiSelect.length > 0) {
      this.supplierRequired = false;
    } else {
      this.supplierRequired = true;
    }
    if (this.gridProvision) {
      this.gridProvision.getItemRelatedToClient(this.supplier.selectedValueMultiSelect);

    }
  }

  initEquivalentList() {
    this.OrderService.importedData = [];
    this.OrderService.equivalentData = [];
    if (this.equivalentList) {
      this.equivalentList.view = new Array<any>();
      this.equivalentList.existingElementList = this.OrderService.data;
      this.equivalentList.idItem = this.idItem;
      this.equivalentList.setGridLines();
    }
  }

  /**verfiy if the dates are valid or not */
  checkDates(startDate: Date, endDate: Date, isRequiredDates: boolean) {
    if ((isRequiredDates && (!startDate || !endDate)) || (startDate > endDate) || (startDate < this.minDate)) {
      this.isInvalidSelectionOrDates = true;
      this.warrringString = this.translate.instant(ProvisioningConstant.VALIDATE_DATE);
    }
  }

  /**get the selected filtres */
  filterSelect() {
    this.isTheOrderBtnDisabled = false;
    this.isInvalidSelectionOrDates = false;
    // this.clearEquivalentProduct();
    if (this.SalesHistory) {
      this.checkDates(this.SatrtDateSales, this.EndDateSales, true);
    }
    if (this.ShowHistory) {
      this.checkDates(this.SatrtDatePurchase, this.EndDatePurchase, true);
    }
    if (this.isNewReferencesChecked) {
      this.verifDateNewRef();
      this.checkDates(this.newRefDatesForm.controls['SatrtDateNewReferences'].value,
      this.newRefDatesForm.controls['EndDateNewReferences'].value, false);
    }
    if (!this.isAnyCheckBoxChecked()) {
      this.warrringString = this.translate.instant(ProvisioningConstant.SELECT_CHOICE);
      this.isInvalidSelectionOrDates = true;
    }
    if (!this.selectedValueMultiSelect) {
      this.disabledDropDown = true;
    }
    if (!this.isInvalidSelectionOrDates) {
      this.orderObjectToSend = new Provisioning(this.selectedValueMultiSelect,
        this.SalesHistory, this.ShowHistory, this.isMinMaxCheked, this.isNewReferencesChecked, this.SatrtDatePurchase,
        this.EndDatePurchase, this.SatrtDateSales, this.EndDateSales, this.SatrtDateNewReferences, this.EndDateNewReferences);
      this.gridProvision.pageChange({skip: 0, take: 10});
      this.setGridLines();
    }
  }

  isValidOrderProject(): boolean {
    return (this.selectedSupplier && this.isAnyCheckBoxChecked());
  }

  isAnyCheckBoxChecked(): boolean {
    return this.isMinMaxCheked || this.ShowHistory || this.SalesHistory || this.isNewReferencesChecked;
  }

  /**if purchaseHistory selected*/
  purchaseHistory() {
    this.ShowHistory = !this.ShowHistory;
    this.validOrderProject = this.isValidOrderProject();
  }

  /**salesHistory salected */
  salesHistory() {
    this.SalesHistory = !this.SalesHistory;
    this.validOrderProject = this.isValidOrderProject();
  }

  /**if minMaxQuantity filer selected */
  minMax() {
    this.isMinMaxCheked = !this.isMinMaxCheked;
    this.validOrderProject = this.isValidOrderProject();
  }
  verifDateNewRef() {
    if(this.newRefDatesForm.controls['SatrtDateNewReferences'].touched ){
      if(this.newRefDatesForm.controls['SatrtDateNewReferences'].value == null && this.RefSatrtDateNewReferences.input.currentValue !="j/m./a"){

        this.warrringString = this.translate.instant(ProvisioningConstant.VALIDATE_DATE);
        this.isInvalidSelectionOrDates = true;
      }
    } else if(this.newRefDatesForm.controls['EndDateNewReferences'].touched && this.RefEndDateNewReferences.input.currentValue !="j/m./a"){
     if(this.newRefDatesForm.controls['EndDateNewReferences'].value == null){

       this.warrringString = this.translate.instant(ProvisioningConstant.VALIDATE_DATE);
       this.isInvalidSelectionOrDates = true;
     }
    }
   }

  newReferenceClick() {
    this.isNewReferencesChecked = !this.isNewReferencesChecked;
    this.validOrderProject = this.isValidOrderProject();
  }

  /** call service*/
  setGridLines() {
    if (this.selectedValueMultiSelect.length > 0) {
      this.DisplayGrid = false;
      this.provisioningService.itemPrices(this.orderObjectToSend).subscribe((x) => {
        this.idProvision = x.Id;
        if (this.idProvision > 0) {
          this.searchItemService.idProvision = this.idProvision;
          this.gridProvision.setIdProvision(x.Id);
          this.htPeerSupplier();
        }
      });
    } else {
      this.supplierRequired = true;
    }
  }


  /**generate order project */
  generateOrderProject() {
    this.isTheOrderBtnDisabled = true;
    this.provisioningService.GenereateOrderProject(this.idProvision).subscribe(result => {
      if (result.length > 0) {
        let message: string = this.translate.instant(PurchaseRequestConstant.SUCCESS_GENERATE_BC);
        result.forEach(element => {
          message = message.concat('<a target="_blank" rel="noopener noreferrer" href="/main/purchase/purchaseorder/edit/' +
            element.Id + '/' + documentStatusCode.Provisional + '" > ' + element.Code + ' </a>');
        });
        swal.fire({
          icon: SharedConstant.SUCCESS,
          html: message,
        });
      } else {
        const message: string = this.translate.instant(PurchaseRequestConstant.ECHEC_GENERATE_BC);
        swal.fire({
          icon: SharedConstant.WARNING,
          html: message,
        });
      }
    });
  }

  /** update selected supplier list */
  updateSupplierSelectedList(idProvision: number) {
    this.suplierData = new Array<any>();
    this.supplier.selectedValueMultiSelect = [];
    this.provisioningService.GetProvision(idProvision).subscribe((data) => {
      data.TiersProvisioning.forEach(element => {
        this.suplierData.push(element);

        this.supplier.selectedValueMultiSelect.push(element.IdTiers);
      });
    });
  }

  /**HT Total peer Supplier*/
  htPeerSupplier(idProvionDetail?: number, showData?: boolean) {
    this.provisioningService.SupplierTotlRecap(this.idProvision, idProvionDetail).subscribe((data) => {
      this.addSupplier(data, showData !== undefined ? showData : false);
    });
  }

  addSupplier(data, isInitData: boolean) {
    this.suplierData = new Array<any>();
    data.forEach(element => {
      this.suplierData.push(element);
      if (isInitData) {
        this.supplier.selectedValueMultiSelect.push(element.IdTiers);
      }
      element.formatOption = {
        style: 'currency',
        currency: element.IdTiersNavigation.IdCurrencyNavigation.Code,
        currencyDisplay: 'symbol',
        minimumFractionDigits: element.IdTiersNavigation.IdCurrencyNavigation.Precision
      };
    });
    this.updateSupplierSelectedList(this.idProvision);
  }

  /**import lines from grid to another */
  public imprtLines() {
    if (this.OrderService.importedData.length > 0) {
      const idsArray = this.OrderService.importedData.map(({IdItem}) => IdItem);
      this.provisioningService.addEquivalentItemToProvisioningGrid(idsArray, this.idProvision, 0).subscribe(x => {
        this.gridProvision.getDataWithPaging();
        this.supplier.selectedValueMultiSelect = [];
        this.htPeerSupplier(null, true);
      });
    }
  }

  /** show quantity details*/
  quantityDetails($event) {
    this.selectedRow = $event;
    this.generateEquivalentProduct();
  }

  /** grid row double click to show equivalent items */
  public generateEquivalentProduct(selectedRow?) {
    if (selectedRow) {
      this.selectedRow = selectedRow;
    }
    if (this.selectedRow && this.selectedRow.IdItem) {
      this.idItem = this.selectedRow.IdItem;
      this.initEquivalentList();
    }
  }

  initDataSource() {
    if (this.OrderService.SelectedProjects.length > 0) {
      this.provisioningService.importOrderProject(this.OrderService.SelectedProjects, this.idProvision).subscribe(x => {
        this.gridProvision.getDataWithPaging();
        this.supplier.selectedValueMultiSelect = [];
        this.OrderService.SelectedProjects = [];
        this.htPeerSupplier(null, true);
      });
    }
  }

  importOrderProject() {
    this.showModalImport = !this.showModalImport;
  }

  clearImportList() {
    this.OrderService.SelectedProjects = [];
    this.showModalImport = !this.showModalImport;
  }

  backToList() {
    this.router.navigateByUrl('/main/purchase/orderProject');
  }

}
