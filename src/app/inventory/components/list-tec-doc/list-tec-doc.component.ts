import { Component, OnInit, EventEmitter, Output, Input, OnDestroy, ChangeDetectorRef, OnChanges, DoCheck } from '@angular/core';
import { ItemService } from '../../services/item/item.service';
import { GroupDescriptor } from '@progress/kendo-data-query';
import { TecdocService } from '../../services/tecdoc/tecdoc.service';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { RowClassArgs } from '@progress/kendo-angular-grid';
import { Router } from '@angular/router';
import { ItemConstant } from '../../../constant/inventory/item.constant';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { TecDocArticleModel } from '../../../models/inventory/tec-doc-article.model';
import { FormGroup, FormControl } from '@angular/forms';
import { Item } from '../../../models/inventory/item.model';
import { TeckDockWithWarehouseFilter } from '../../../models/inventory/teckDock-with-warehouse-filter';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { RoleConfigConstant } from '../../../Structure/_roleConfigConstant';
import { StarkRolesService } from '../../../stark-permissions/service/roles.service';
import { SearchItemService } from '../../../sales/services/search-item/search-item.service';
import { isNullOrUndefined } from 'util';
import { notEmptyValue } from '../../../stark-permissions/utils/utils';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { OemService } from '../../services/oem/oem.service';
import { Oem } from '../../../models/inventory/oem.model';
import { ActivityAreaEnumerator } from '../../../models/enumerators/activity-area.enum';
import { CompanyService } from '../../../administration/services/company/company.service';
import { DocumentEnumerator } from '../../../models/enumerators/document.enum';
import { ProvisioningDetails } from '../../../models/purchase/provisioning-details.model';
import { ProvisioningService } from '../../../purchase/services/order-project/provisioning-service.service';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';


@Component({
  selector: 'app-list-tec-doc',
  templateUrl: './list-tec-doc.component.html',
  styleUrls: ['./list-tec-doc.component.scss']
})
export class ListTecDocComponent implements OnInit, OnDestroy, DoCheck {

  public FormatNumber = SharedConstant.NUMBER_FORMAT;
  public RoleConfigConstant = RoleConfigConstant;
  public formGroup: FormGroup;
  articleList: Array<TecDocArticleModel>;
  isBtnClicked = false;
  public groups: GroupDescriptor[];
  @Input()
  public isModal = false;
  @Input()
  btnEditVisible: true;
  @Input()
  isSync: boolean;
  @Input() isforSync = false;
  public TecDocGrid: boolean;
  @Input() public SelectedOemNumber: string;
  public selectedItem: number;
  public FromApi: any;
  @Output()
  public selectevent = new EventEmitter<any>();
  @Output() showTecDocList = new EventEmitter<boolean>();
  @Output() cleanEquivalenceListe = new EventEmitter<boolean>();
  @Output() ShownTecDoc = new EventEmitter<boolean>();
  @Output()
  messageEvent = new EventEmitter<boolean>();
  public isCollapsed: boolean;
  @Output()
  dbClick = new EventEmitter<Item>();
  @Output() reloadList = new EventEmitter<any>();
  @Output()
  btnClick = new EventEmitter<any>();
  TecDocArticles: any[];
  public SelectedForDetails: Item;


  @Output()
  itemEvent = new EventEmitter<Item>();
  opentecdocdetails: boolean;

  @Output()
  clearTecDocEquivalentListe = new EventEmitter<boolean>();
  @Input() openedFromGarageAddCar;
  public warehouseForm: FormGroup;
  availableQuanittyFilter = false;
  centralQuantityFilter = false;
  public gridSettings: GridSettings = {
    state: this.tecdocService.gridState,
    columnsConfig: this.tecdocService.columnsConfig
  };
  isFiltered = true;
  public isInSalesRole = false;
  public IdItemSelected: number;
  public idDocument: number;
  isAutoVersion: boolean;
  @Output() countTecDoc = new EventEmitter<number>();
  @Output() generateBLTecDoc = new EventEmitter<boolean>();
  public goToAdvancedEdit(dataItem) {
    this.router.navigateByUrl(ItemConstant.URI_ADVANCED_EDIT + String(dataItem.ItemInDB.Id),
      { queryParams: dataItem.ItemInDB, skipLocationChange: true });
  }
  public showSalesPrice = false ;

  constructor(public tecdocService: TecdocService,
    public itemService: ItemService,
    private router: Router,
    private swalWarrings: SwalWarring,
    private rolesService: StarkRolesService,
    public searchItemService: SearchItemService,
    public oemService: OemService, private companyService: CompanyService,
      private provisioningService: ProvisioningService, private localStorageService : LocalStorageService,  private authService: AuthService) {
          this.isAutoVersion = this.localStorageService.getActivityArea() === ActivityAreaEnumerator.Auto;

  }

  ngOnInit() {
    this.itemService.getJson('environments/TecDocConf.json').subscribe(data => {
      this.FromApi = data.IsUseTecDocApi;
    });
    this.isCollapsed = true;
    this.sendCollapseStauts();
    this.CreateWarehouseFromGroup();
    this.tecdocService.articleList = new Array<any>();
    this.showSalesPrice =  this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_SALES_PRICE); 
    this.rolesService.ListRoleConfigsAsObservable().subscribe((roledata: Array<any>) => {
      if (!isNullOrUndefined(roledata) && notEmptyValue(roledata)) {
        this.rolesService.hasOnlyRoles([RoleConfigConstant.SalesConfig])
          .then(x => {
            this.isInSalesRole = x === true ? true : false;
            this.rolesService.hasOnlyRoles([
              RoleConfigConstant.SuperAdminConfig,
              RoleConfigConstant.AdminConfig,
              RoleConfigConstant.PurchaseConfig])
              .then(x => { this.isInSalesRole = x === true ? false : true; });
          });
      }
    });


  }
  public CreateWarehouseFromGroup() {
    this.warehouseForm = new FormGroup({
      IdWarehouse: new FormControl(0)
    });
    this.warehouseForm.get(ItemConstant.ID_WAREHOUSE).valueChanges.subscribe((value) => {
      this.initGridDataSource();
    });
  }
  initGridDataSource() {
    this.tecdocService.articleList = new Array<any>();
    this.articleList = [];
    if (this.tecdocService.PCId * this.tecdocService.ProductId !== 0) {
      const teckDockWithWarehouseFilter = new TeckDockWithWarehouseFilter(this.tecdocService.PCId, this.tecdocService.ProductId, this.localStorageService,
        this.warehouseForm.get(ItemConstant.ID_WAREHOUSE).value, this.availableQuanittyFilter, null, null, this.centralQuantityFilter, null);
      this.itemService.GetArticles(teckDockWithWarehouseFilter).subscribe(data => {
        this.articleList = data;
        this.tecdocService.setarticles(this.articleList, this.tecdocService.PCId, this.tecdocService.ProductId);
        this.articleList = this.tecdocService.articleList;
      });
    }
  }

  openTecdocModal(dataItem) {
    this.SelectedForDetails = dataItem;
    this.SelectedForDetails.TecDocRef = dataItem.Reference;
    this.SelectedForDetails.TecDocIdSupplier = dataItem.IdSupplier;
    this.SelectedForDetails.TecDocId = dataItem.Id;
    this.opentecdocdetails = true;
  }

  public filterByAvailbleQuantity() {
    this.initGridDataSource();
  }
  tecDocAdd(article: TecDocArticleModel) {
    this.tecdocService.SelectedArticle = article;
    this.router.navigateByUrl(ItemConstant.URI_ADVANCED_ADD);
  }

  tecDocAddFromGarage(article: TecDocArticleModel) {
    this.tecdocService.SelectedArticle = article;
    window.open(ItemConstant.URI_ADVANCED_ADD, '_blank');
  }

  public filterCentralQuantity() {
    this.centralQuantityFilter = !this.centralQuantityFilter;
    this.initGridDataSource();
  }

  public sendCollapseStauts(): void {
    this.messageEvent.emit(this.isCollapsed);
  }

  public groupChange(groups: GroupDescriptor[]): void {
    this.groups = groups;
  }

  FilterHandle() {
    this.tecdocService.filter(!this.isFiltered);
  }
  public rowCallback(context: RowClassArgs) {
    const isEven = context.index % NumberConstant.TWO === 0;
    return {
      notecodd: !isEven && !context.dataItem.IsInDb,
      noteceven: isEven && !context.dataItem.IsInDb
    };
  }

  public loadWarehousDetails(event: any) {
    this.itemService.loadWarhouseDetailsTecDoc(event, true);
  }

  onClickGoToDetails(id) {
    this.router.navigateByUrl(ItemConstant.DETAILS_URL.concat(id));
  }
  getItemId(value) {
    (!value.QuantityForDocumentLine) ? value.QuantityForDocumentLine = 1 : value.QuantityForDocumentLine;
    value.IsItemTecdoc = true;
    let dataTecDoc = {
      tecDocArticles: this.tecdocService.gridView.data,
      dataItem: value
    }
    this.btnClick.emit(dataTecDoc);

  }


  public selectRow(event: any) {
    if (!this.isSync) {
      let list;
      const selectedTecDocItem = new TeckDockWithWarehouseFilter(null, null, this.localStorageService,
        this.warehouseForm.get('IdWarehouse').value, this.availableQuanittyFilter,
        event.selectedRows[0].dataItem.IdSupplier, event.selectedRows[0].dataItem.Reference, this.centralQuantityFilter, null);
      if (!this.isModal && !this.searchItemService.isFromSearchItem_supplierInetrface) {
        this.itemService.GetEquivalentTecDoc(selectedTecDocItem)
          .subscribe(data => {
            if (data && data.length > 0) {
              list = data;
              this.countTecDoc.emit(data.length);
            } else {
              this.countTecDoc.emit(NumberConstant.ZERO);
            }

          });
      }
      this.itemService.TecDocReference = event.selectedRows[0].dataItem.Reference;
      this.itemService.TecDocIdSupplier = event.selectedRows[0].dataItem.IdSupplier;
    }
    this.selectevent.emit(event);
  }

  public dbCellClick() {
    this.dbClick.emit();
  }

  public removeHandler(dataItem) {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.itemService.remove(dataItem.ItemInDB).subscribe(() => {
          this.initGridDataSource();
        });
      }
    });

  }
  addDocument(event, quantity = 1) {
    this.IdItemSelected = event;
    this.searchItemService.addDocument(this.IdItemSelected, quantity,
      this.warehouseForm.controls['IdWarehouse'].value);
  }

  public ToshowTecDocGrid(value) {
    this.ShownTecDoc.emit(value);
  }

  closeTecdocModal() {
    this.opentecdocdetails = false;
  }


  ngOnDestroy(): void {
    this.tecdocService.gridView = undefined;
    this.tecdocService = new TecdocService();
  }
  public ngDoCheck() {
    if (this.tecdocService.detelctChange === true) {
      this.clearTecDocEquivalentListe.emit(true);
      this.tecdocService.detelctChange = false;
    }
  }
  unSub(event, index) {
    let OemToUnSub = new Oem(0, this.SelectedOemNumber, event.Id);
    this.oemService.save(OemToUnSub, true).subscribe();
    this.reloadList.emit();
  }

  ReSub(event, index) {
    let OemToUnSub = new Oem(event.IdOem, this.SelectedOemNumber, event.Id);
    this.oemService.remove(OemToUnSub).subscribe();
    this.reloadList.emit();
  }
  isSelectedSupplier(event, documentType, QuantityForDocumentLine) {
    if (this.searchItemService.idSupplier) {
      this.addBl(event, documentType, QuantityForDocumentLine);
      if (documentType === DocumentEnumerator.SalesDelivery) {
        this.generateBLTecDoc.emit(true);
      }
    }
  }

  addBl(event, documentType, QuantityForDocumentLine) {
    if (this.searchItemService.idProvision && !this.searchItemService.idDocument) {
      const provisioningDetails = new ProvisioningDetails();
      provisioningDetails.IdItem = event;
      provisioningDetails.IdProvisioning = this.searchItemService.idProvision;
      provisioningDetails.MvtQty = QuantityForDocumentLine;
      this.provisioningService.addItemFromModal(provisioningDetails).subscribe();
    } else {
      this.searchItemService.searchItemDocumentType = documentType;
      this.IdItemSelected = event;
      this.searchItemService.addDocument(
        this.IdItemSelected, QuantityForDocumentLine,ItemConstant.ID_CENTRAL_WAREHOUSE);
    }
  }
}
