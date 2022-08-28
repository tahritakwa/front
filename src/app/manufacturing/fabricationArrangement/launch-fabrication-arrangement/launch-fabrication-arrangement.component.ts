import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {DataStateChangeEvent, GridComponent, PageChangeEvent, PagerSettings} from '@progress/kendo-angular-grid';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ColumnSettings} from '../../../shared/utils/column-settings.interface';
import {DataSourceRequestState} from '@progress/kendo-data-query';
import {FabricationArrangementConstant} from '../../../constant/manufuctoring/fabricationArrangement.constant';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {ItemService} from '../../../inventory/services/item/item.service';
import {TiersService} from '../../../purchase/services/tiers/tiers.service';
import {PredicateFormat} from '../../../shared/utils/predicate';
import {TiersConstants} from '../../../constant/purchase/tiers.constant';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {Subscription} from 'rxjs/Subscription';
import {FabricationArrangementService} from '../../service/fabrication-arrangement.service';
import {ValidationService} from '../../../shared/services/validation/validation.service';
import {DetailOfService} from '../../service/detail-of.service';
import {UserService} from '../../../administration/services/user/user.service';
import {DetailOfStatus} from '../../../models/enumerators/detail-of-status.enum';
import {OfStatus} from '../../../models/enumerators/of-status.enum';
import {TranslateService} from '@ngx-translate/core';
import {Operation} from '../../../../COM/Models/operations';
import { OfService } from '../../service/of.service';
import { GammeConstant } from '../../../constant/manufuctoring/gamme.constant';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-launch-fabrication-arrangement',
  templateUrl: './launch-fabrication-arrangement.component.html',
  styleUrls: ['./launch-fabrication-arrangement.component.scss'],
})
export class LaunchFabricationArrangementComponent implements OnInit {
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public predicate: PredicateFormat;
  private currentPage = NumberConstant.ZERO;
  private size = NumberConstant.TEN;
  private subscription$: Subscription;
  public value = '';
  public ofId;
  public currentStatus = 'confirmed';
  private listFabs: Array<any> = [];
  public filterType = 'allOF';
  public selectedArticle: any;
  public isChecked = false;
  public formGroup: FormGroup;
  public selectedArticles: any = [];
  public listUsers: any = [];
  public selectedUsers: any ;
  public formatDate: string = this.translate.instant(SharedConstant.DATE_FORMAT);
  @ViewChild('closeModalBtn') closeModalBtn: ElementRef;
  public gridState: DataSourceRequestState = {
    skip: 0,
    take: this.size,
    filter: { // Initial filter descriptor
      logic: 'and',
      filters: []
    }
  };

  public gridState2: DataSourceRequestState = {
    skip: 0,
    take: this.size,
    filter: { // Initial filter descriptor
      logic: 'and',
      filters: []
    }
  };

  public gridState3: DataSourceRequestState = {
    skip: 0,
    take: this.size,
    filter: { // Initial filter descriptor
      logic: 'and',
      filters: []
    }
  };

  public columnsConfig: ColumnSettings[] = [
    {
      field: FabricationArrangementConstant.FABRICATION_ID_OF_FIELD,
      title: FabricationArrangementConstant.FABRICATION_ID_TITLE,
      filterable: true,
    },
    {
      field: FabricationArrangementConstant.FABRICATION_REF_FIELD,
      title: FabricationArrangementConstant.FABRICATION_REF_TITLE,
      filterable: true,
    },
    {
      field: FabricationArrangementConstant.FABRICATION_QTY_FIELD,
      title: FabricationArrangementConstant.FABRICATION_QTY_TITLE,
      filterable: true,
    },
    {
      field: FabricationArrangementConstant.FABRICATION_CREATION_DATE_FIELD,
      title: FabricationArrangementConstant.FABRICATION_CREATION_DATE_TITLE,
      filterable: true,
    }
  ];

  public columnsConfig2: ColumnSettings[] = [
    {
      field: FabricationArrangementConstant.FABRICATION_REF_FIELD,
      title: FabricationArrangementConstant.FABRICATION_REF_TITLE,
      filterable: true,
    },
    {
      field: FabricationArrangementConstant.FABRICATION_QTY_TOTAL_FIELD,
      title: FabricationArrangementConstant.FABRICATION_QTY_TOTAL_TITLE,
      filterable: true,
    },
    {
      field: FabricationArrangementConstant.FABRICATION_CREER_FIELD,
      title: FabricationArrangementConstant.FABRICATION_CREER_TITLE,
      filterable: true,
    },
    {
      field: FabricationArrangementConstant.FABRICATION_LANCER_FIELD,
      title: FabricationArrangementConstant.FABRICATION_LANCER_TITLE,
      filterable: true,
    }
  ];
  public columnsConfig3: ColumnSettings[] = [
    {
      field: FabricationArrangementConstant.FABRICATION_ID_OF_FIELD,
      title: FabricationArrangementConstant.FABRICATION_ID_TITLE,
      filterable: true,
    },
    {
      field: FabricationArrangementConstant.FABRICATION_QTY_FIELD,
      title: FabricationArrangementConstant.FABRICATION_QTY_TITLE,
      filterable: true,
    },
    {
      field: FabricationArrangementConstant.FABRICATION_CREATION_DATE_FIELD,
      title: FabricationArrangementConstant.FABRICATION_CREATION_DATE_TITLE,
      filterable: true,
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };
  public gridSettings2: GridSettings = {
    state: this.gridState2,
    columnsConfig: this.columnsConfig2
  };
  public gridSettings3: GridSettings = {
    state: this.gridState3,
    columnsConfig: this.columnsConfig3
  };

  @ViewChild(GridComponent) grid: GridComponent;
  btnEditVisible: boolean;
  date: Date;
  constructor(
    public fabricationArrangementService: FabricationArrangementService,
    public tiersService: TiersService,
    public itemService: ItemService,
    private swalWarrings: SwalWarring,
    private validationService: ValidationService,
    private detailOfService: DetailOfService,
    private ofService: OfService,
    private growlService: GrowlService,
    private userService: UserService,
    private translate: TranslateService,
    private datePipe: DatePipe
  ) {
    this.predicate = PredicateFormat.prepareTiersPredicate(TiersConstants.CUSTOMER_TYPE);
    this.formGroup = new FormGroup({
      matricule: new FormControl('', Validators.required),
      launchingDate: new FormControl('', Validators.required),
      responsibleId: new FormControl('', Validators.required),
      launchingHour: new FormControl('', Validators.required),
    });
  }

  allDetailOfDataSource(filterStatus?: string, pageFilter?: number) {
    if (pageFilter != null) {
      this.currentPage = pageFilter;
    }
    this.currentStatus = filterStatus;

    this.subscription$ = this.fabricationArrangementService.getJavaGenericService()
      .getEntityList( FabricationArrangementConstant.GET_DETAIL_FABRICATIONARRANGEMENT_NOT_LAUNCHED_PAGEABLE +
        `?page=${this.currentPage}&size=${this.size}`)
      .subscribe((data) => {
        data.content = data.content.filter(dof => dof.status === DetailOfStatus.DETAIL_OF_CREATED);
        data.content.map((dof) => {
          this.itemService.getProductById(dof.idItem).subscribe(product => {
            dof.ref_article = product.Description;
          });
          dof.id_of = dof.of.id;
          dof.reference = dof.of.reference;
          dof.creationDate_of = dof.of.createdDate;
          dof.isChecked = false;
          return dof;
        });
        this.gridSettings.gridData = { data: data.content, total: data.totalElements };
        this.size = NumberConstant.TEN;
      });
  }

  onPageAllDOFChange(event: PageChangeEvent) {
    this.currentPage = (event.skip) / 10;
    this.size = event.take;
    this.allDetailOfDataSource(this.currentStatus);
  }

  onPageByItemChange(event: PageChangeEvent) {
    this.gridSettings3.state = this.gridState3;
    this.gridSettings2.state.skip = event.skip;
    this.currentPage = (event.skip) / 10;
    this.size = event.take;
    this.DetailOfByItemDataSource(this.currentStatus);
  }

  dataStateChange(state: DataStateChangeEvent) {
    this.gridSettings.state = state;
  }

  ngOnInit() {
    this.userService.getAllUserWithoutState().subscribe(result => {
      this.listUsers = result.data;
    });
    this.allDetailOfDataSource();
  }

  filterOF(value) {
    this.size = NumberConstant.TEN;
    this.currentPage = NumberConstant.ZERO;
    this.gridSettings.state = this.gridState;
    this.gridSettings2.state = this.gridState2;
    this.gridSettings3.state = this.gridState3;
    this.filterType = value;
    this.selectedArticles = [];
    if (this.filterType === 'allOF') {
      this.allDetailOfDataSource();
    } else {
      this.DetailOfByItemDataSource();
    }
  }

  DetailOfByItemDataSource(filterStatus?: string, pageFilter?: number) {
    this.gridSettings3.gridData = { data: [], total: 0 };
    if (pageFilter != null) {
      this.currentPage = pageFilter;
    }
    this.currentStatus = filterStatus;
    this.subscription$ = this.detailOfService.callService(Operation.GET,
      FabricationArrangementConstant.GET_DETAIL_FABRICATIONARRANGEMENT_PAGEABLE + 'GroupByItem?page=' +
      + this.currentPage + '&size=' + this.size)
      .subscribe((data) => {
        data.content.map((dof) => {
          this.itemService.getProductById(dof.idItem).subscribe(product => {
            dof.ref_article = product.Description;
          });
          dof.creer = dof.nbTotalOf;
          dof.qty_total = dof.nbtotalQuantityToManufacture;
          dof.lancer = dof.nbOfLaunched;
          dof.selectedOf = [];
          return dof;
        });
        this.gridSettings2.gridData = { data: data.content, total: data.totalElements };
        this.size = NumberConstant.TEN;
      });
  }

  onSelectionChange(event) {
    this.gridSettings3.state = this.gridState3;
    this.selectedArticle = event.selectedRows[0].dataItem;
    const selectedData = event.selectedRows[0].dataItem;
    this.detailOfService.getJavaGenericService()
      .getEntityList( FabricationArrangementConstant.GET_DETAIL_FABRICATIONARRANGEMENT_PAGEABLE + 'ByItem' +
        `/${selectedData.idItem}?page=${0}&size=${this.size}` )
      .subscribe((data) => {
        data.content = data.content.filter(dof => dof.of.status === OfStatus.OF_CREATED);
        data.content.map(dof => {
          dof.id_of = dof.of.id;
          dof.reference = dof.of.reference;
          dof.creationDate_of = dof.of.createdDate;
          if (selectedData.selectedOf.indexOf(dof.id_of) === -1) {
            dof.isChecked = false;
          } else {
            dof.isChecked = true;
          }
          return dof;
        });
        this.gridSettings3.gridData = { data: data.content, total: data.totalElements };
        this.size = NumberConstant.TEN;
      });
  }

  eventCheckOfByItem(event, dataItem) {
    if (dataItem.isChecked) {
      this.gridSettings2.gridData.data.map(article => {
        if (article[0] === this.selectedArticle[0]) {
          article.lancer += 1;
          article.selectedOf.push(dataItem.id_of);
          article.selectedOf.push(dataItem.reference);
          this.selectedArticles.push(dataItem);
          return article;
        }
      });
    } else {
      this.gridSettings2.gridData.data.map(article => {
        if (article[0] === this.selectedArticle[0]) {
          article.lancer -= 1;
          article.selectedOf.splice(article.selectedOf.indexOf(dataItem), 1);
          this.selectedArticles.splice(this.selectedArticles.indexOf(dataItem), 1);
          return article;
        }
      });
    }
  }

  launchOF() {
    if (this.formGroup.valid) {
      let valueToSend = this.formGroup.getRawValue();
      valueToSend.launchingDate = this.datePipe.transform(valueToSend.launchingDate, FabricationArrangementConstant.YYYY_MM_DD)+
       " "+this.datePipe.transform(valueToSend.launchingHour, FabricationArrangementConstant.HH_MM_SS) ;
      valueToSend.launchingHour = this.datePipe.transform(valueToSend.launchingDate, FabricationArrangementConstant.YYYY_MM_DD)+
      " "+this.datePipe.transform(valueToSend.launchingHour, FabricationArrangementConstant.HH_MM_SS) ;
      this.swalWarrings.CreateSwal(this.translate.instant(FabricationArrangementConstant.SWAL_TITLE_VALIDATION_LAUNCH_OF),
        `${this.translate.instant(SharedConstant.ARE_YOU_SURE)}`,
        SharedConstant.YES, SharedConstant.NO).then((result) => {
          if (result.value) {
            this.ofService.getJavaGenericService()
          .updateEntity(valueToSend, this.ofId).toPromise().then(async () => {
            await  Promise.resolve(this.showSuccessMessage());
          });
            this.selectedArticles.forEach(article => {
              if (this.filterType === 'orderbyRef') {
                this.itemService.getProductById(article.idItem).subscribe(res => {
                  this.exportPDF(article.id, article.idItem, res.Code);
                });
              } else {
                this.exportPDF(article.id, article.idItem, article.ref_article);
              }
            });
            this.selectedArticles = [];
          }
        });
    } else {
      this.validationService.validateAllFormFields(this.formGroup);
    }
  }

  showSuccessMessage() {
    this.growlService.successNotification(this.translate.instant(GammeConstant.SUCCESS_OPERATION));
  }

  exportPDF(DetailOfId, articleId, articleReference) {
    this.detailOfService.readReport(FabricationArrangementConstant.LAUNCH_DETAILS_OF +
      `/${DetailOfId}/${articleId}?ref_article=${articleReference}`)
      .subscribe(response => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(blob);
        window.open(fileURL, '_blank');
        this.allDetailOfDataSource();
        this.DetailOfByItemDataSource();
        this.closeModal();
      });
  }

  eventCheckItemByOF(event, dataItem) {
    if (dataItem.isChecked) {
      dataItem.status = 'OF_LAUNCHED';
      this.ofId= dataItem.id_of;
      this.selectedArticles.push(dataItem);
    } else {
      this.selectedArticles.splice(this.selectedArticles.indexOf(dataItem), 1);
    }
  }

  openModal() {
    this.formGroup = new FormGroup({
      matricule: new FormControl('', Validators.required),
      launchingDate: new FormControl('', Validators.required),
      responsibleId: new FormControl('', Validators.required),
      launchingHour: new FormControl('', Validators.required),
    });
  }

  closeModal() {
    this.closeModalBtn.nativeElement.click();
  }

  onPageChange(event: PageChangeEvent) {
    this.gridSettings3.state.skip = event.skip;
    this.currentPage = (event.skip) / 10;
    this.size = event.take;
    this.ofDataSource(this.currentStatus);
  }

  ofDataSource(filterStatus?: string, pageFilter?: number) {
    if (pageFilter != null) {
      this.currentPage = pageFilter;
    }
    this.currentStatus = filterStatus;
    this.fabricationArrangementService.getJavaGenericService()
      .getEntityList( FabricationArrangementConstant.GET_DETAIL_FABRICATIONARRANGEMENT_PAGEABLE + 'ByItem' +
        `/${this.selectedArticle[0]}?page=${0}&size=${this.size}` )
      .subscribe((data) => {
        data.content = data.content.filter(dof => dof.of.status === DetailOfStatus.DETAIL_OF_CREATED);
        data.content.map(dof => {
          dof.id_of = dof.of.id;
          dof.reference = dof.of.reference;
          dof.creationDate_of = dof.of.createdDate;
          if (this.selectedArticle.selectedOf.indexOf(dof.id_of) === -1) {
            dof.isChecked = false;
          } else {
            dof.isChecked = true;
          }
          return dof;
        });
        this.gridSettings3.gridData = { data: data.content, total: data.totalElements };
        this.size = NumberConstant.TEN;
      });
  }


}
