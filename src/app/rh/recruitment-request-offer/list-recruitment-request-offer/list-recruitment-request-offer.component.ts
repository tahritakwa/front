import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { SortDescriptor, State } from '@progress/kendo-data-query';
import { Subscription } from 'rxjs/Subscription';
import { RecruitmentConstant } from '../../../constant/rh/recruitment.constant';
import { FieldTypeConstant } from '../../../constant/shared/fieldType.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { TypeConstant } from '../../../constant/utility/Type.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { AdministrativeDocumentStatusEnumerator } from '../../../models/enumerators/administrative-document-status.enum';
import { RecruitmentOfferStatus } from '../../../models/enumerators/recruitment-offer-status.enum';
import { RecruitmentPriority } from '../../../models/enumerators/recruitment-priority.enum';
import { RecruitmentState } from '../../../models/enumerators/recruitment-state.enum';
import { RecruitmentType } from '../../../models/enumerators/recruitment-type.enum';
import { FiltrePredicateModel } from '../../../models/shared/filtrePredicate.model';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { Filter, Operation, Operator, OrderBy, OrderByDirection, PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { RecruitmentService } from '../../services/recruitment/recruitment.service';

@Component({
  selector: 'app-list-recruitment-request-offer',
  templateUrl: './list-recruitment-request-offer.component.html',
  styleUrls: ['./list-recruitment-request-offer.component.scss']
})
export class ListRecruitmentRequestOfferComponent implements OnInit, OnDestroy {
  @Input() type;
  @Input() advencedAddLink;
  public statusCode = AdministrativeDocumentStatusEnumerator;
  public priorityCode = RecruitmentPriority;
  public recruitmentType = RecruitmentType;
  public offerStatus = RecruitmentOfferStatus;
  public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);
  public startDate: Date;
  public endDate: Date;
  public selectedCandidate: number;
  // permissions
  public hasAddRequestPermission: boolean;
  public hasAddOfferPermission: boolean;
  public hasAddRecruitmentPermission: boolean;

  public hasUpdateOfferPermission: boolean;
  public hasUpdateRecruitmentPermission: boolean;
  public hasUpdateRequestPermission: boolean;

  public hasDeleteOfferPermission: boolean;
  public hasDeleteRecruitmentPermission: boolean;
  public hasDeleteRequestPermission: boolean;

  public hasShowOfferPermission: boolean;
  public hasShowRecruitmentPermission: boolean;
  public hasShowRequestPermission: boolean;


  /**
   * Page setting
   */
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  /**
   * Predicate
   */
  public predicate: PredicateFormat = new PredicateFormat();
  /**
   * Grid Recruitment State
   */
  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    filter: {
      logic: 'and',
      filters: []
    }
  };

  /***
   * Grid Recruitment columns
   */
  public columnsConfig: ColumnSettings[] = [
    {
      field: RecruitmentConstant.JOB_NAVIGATION_DESIGNATION,
      title: RecruitmentConstant.JOB_DESIGNATION_TITLE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: RecruitmentConstant.CODE_FIELD,
      title: RecruitmentConstant.CODE_TITLE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: RecruitmentConstant.ID_QUALIFICATION_TYPE_NAVIGATION_LABEL,
      title: RecruitmentConstant.GRADE_DESIGNATION_TITLE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: RecruitmentConstant.PRIORITY,
      title: RecruitmentConstant.PRIORITY_TITLE,
      filterable: true,
      filter: 'numeric',
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: RecruitmentConstant.ID_EMPLOYEE_AUTHORNAVIGATION_FULLNAME,
      title: RecruitmentConstant.AUTHOR,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: RecruitmentConstant.ID_EMPLOYEE_VALIDATORNAVIGATION_FULLNAME,
      title: RecruitmentConstant.VALIDATOR,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: RecruitmentConstant.CREATION_DATE,
      title: RecruitmentConstant.CREATION_DATE_TITLE,
      filterable: true,
      filter: 'date',
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: RecruitmentConstant.CLOSING_DATE,
      title: RecruitmentConstant.CLOSING_DATE_TITLE,
      filterable: true,
      filter: 'date',
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: RecruitmentConstant.TREATMENT_DATE,
      title: RecruitmentConstant.TREATMENT_DATE_TITLE,
      filterable: true,
      filter: 'date',
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: RecruitmentConstant.REQUEST_STATUS,
      title: RecruitmentConstant.REQUEST_STATUS_TITLE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: RecruitmentConstant.OFFER_STATUS,
      title: RecruitmentConstant.OFFER_STATUS_TITLE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: RecruitmentConstant.STATE,
      title: RecruitmentConstant.STATE_TITLE,
      filterable: true,
      filter: 'numeric',
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
  ];
  /**
   * Grid Sort
   */
  sort: SortDescriptor[] = [
    {
      field: RecruitmentConstant.JOB_NAVIGATION_DESIGNATION,
      dir: RecruitmentConstant.ASC
    }
  ];
  /**
   * Grid Recruitment settings
   */
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };

  hasDeletePermission: boolean;
  private subscriptions: Subscription[] = [];
  public filtreFieldsColumns = [];
  public filtreFieldsInputs = [];


  /**
   * constructor
   */
  constructor( public authService: AuthService, public recruitmentService: RecruitmentService, private swalWarrings: SwalWarring,
    private router: Router, public translate: TranslateService) {
    this.hasAddRecruitmentPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.ADD_RECRUITMENT);
    this.hasAddOfferPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.ADD_RECRUITMENTOFFER);
    this.hasAddRequestPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.ADD_RECRUITMENTREQUEST);

    this.hasUpdateRecruitmentPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.UPDATE_RECRUITMENT);
    this.hasUpdateRequestPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.UPDATE_RECRUITMENTREQUEST);
    this.hasUpdateOfferPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.UPDATE_RECRUITMENTOFFER);

    this.hasDeleteOfferPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.DELETE_RECRUITMENTOFFER);
    this.hasDeleteRecruitmentPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.DELETE_RECRUITMENT);
    this.hasDeleteRequestPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.DELETE_RECRUITMENTREQUEST);

    this.hasShowRequestPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.SHOW_RECRUITMENTREQUEST);
    this.hasShowRecruitmentPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.SHOW_RECRUITMENT);
    this.hasShowOfferPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.SHOW_RECRUITMENTOFFER);
  }

  ngOnInit() {
    this.preparePredicate();
    this.initRecruitmentFiltreConfig();
    this.initGridDataSource();
  }

  public initGridDataSource(): void {
    this.getRecruitmentList();
  }

  public dataStateChange($event: State) {
    this.gridSettings.state = $event;
    this.getRecruitmentList();
  }

  sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.getRecruitmentList();
  }

  public getRecruitmentList() {
    this.subscriptions.push(this.recruitmentService.getRecruitmentsList(this.gridSettings.state, this.predicate, this.selectedCandidate,
      this.startDate, this.endDate).subscribe(data => {
        this.gridSettings.gridData = data;
      })
    );
  }

  /***
   * remove the selected line from the request grid list
   */
  public removeHandler(dataItem) {
    this.swalWarrings
      .CreateSwal(RecruitmentConstant.DELETE_RECRUITMENT)
      .then((result: { value: any }) => {
        if (result.value) {
          this.subscriptions.push(this.recruitmentService.remove(dataItem).subscribe(() => {
            this.initGridDataSource();
          }));
        }
      });
  }

  public goToAdvancedEdit(dataItem: { Id: string }) {
    if (this.type === RecruitmentType.Request) {
      this.router.navigateByUrl(RecruitmentConstant.REQUEST_EDIT_URL.concat(dataItem.Id));
    }
    if (this.type === RecruitmentType.Offer) {
      this.router.navigateByUrl(RecruitmentConstant.OFFER_EDIT_URL.concat(dataItem.Id));
    }
    if (this.type === RecruitmentType.RecruitmentSession) {
      this.router.navigateByUrl(RecruitmentConstant.RECRUITMENT_EDIT_URL.concat(dataItem.Id));
    }
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }

  /**
   * prepare predicate
   */
  private preparePredicate(): void {
    this.predicate = new PredicateFormat();
    if (!this.predicate.Relation) {
      this.predicate.Relation = new Array<Relation>();
      this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(RecruitmentConstant.ID_EMPLOYEE_NAVIGATION)]);
      this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(RecruitmentConstant.ID_EMPLOYEE_AUTHOR_NAVIGATION)]);
      this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(RecruitmentConstant.ID_JOB_NAVIGATION)]);
      this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(RecruitmentConstant.ID_QUALIFICATION_TYPE_NAVIGATION)]);
      this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(RecruitmentConstant.ID_OFFICE_NAVIGATION)]);
      this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(RecruitmentConstant.ID_EMPLOYEE_VALIDATOR_NAVIGATION)]);
      this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(RecruitmentConstant.ID_CONTRACT_TYPE_NAVIGATION)]);
    }
    this.predicate.Filter = new Array<Filter>();
    if (this.type === RecruitmentType.Request) {
      this.predicate.Filter.push(new Filter(RecruitmentConstant.REQUEST_STATUS, Operation.lte, this.statusCode.AllStatus));
    }
    if (this.type === RecruitmentType.Offer) {
      this.predicate.Filter.push(new Filter(RecruitmentConstant.OFFER_STATUS, Operation.lte, RecruitmentOfferStatus.Closed));
    }
    if (this.type === RecruitmentType.RecruitmentSession) {
      this.predicate.Filter.push(new Filter(RecruitmentConstant.STATE, Operation.lt, RecruitmentState.Closed));
      this.predicate.Filter.push(new Filter(RecruitmentConstant.TYPE, Operation.eq, RecruitmentType.RecruitmentSession));
    }
    this.predicate.OrderBy = new Array<OrderBy>();
    this.predicate.OrderBy.push(new OrderBy(RecruitmentConstant.ID, OrderByDirection.desc));
    this.predicate.pageSize = this.gridSettings.state.take;
    this.predicate.page = this.gridSettings.state.skip / this.gridSettings.state.take + NumberConstant.ONE;
  }

  private initRecruitmentFiltreConfig() {
    this.filtreFieldsColumns.push(new FiltrePredicateModel(RecruitmentConstant.PRIORITY_TITLE,
      FieldTypeConstant.PRIORITY_DROPDOWN_COMPONENT, RecruitmentConstant.PRIORITY));
    this.filtreFieldsColumns.push(new FiltrePredicateModel(SharedConstant.CODE_UPPERCASE,
      FieldTypeConstant.TEXT_TYPE, SharedConstant.CODE));
    if (this.type === this.recruitmentType.Request || this.type === this.recruitmentType.Offer) {
      this.filtreFieldsColumns.push(new FiltrePredicateModel(RecruitmentConstant.AUTHOR,
        FieldTypeConstant.EMPLOYEE_DROPDOWN_TYPE, SharedConstant.ID_EMPLOYEE));
      this.filtreFieldsInputs.push(new FiltrePredicateModel(RecruitmentConstant.CREATION_DATE_TITLE, FieldTypeConstant.DATE_TYPE,
        RecruitmentConstant.CREATION_DATE));
      this.filtreFieldsInputs.push(new FiltrePredicateModel(RecruitmentConstant.POSTE, FieldTypeConstant.JOB_DROPDOWN_COMPONENT,
        RecruitmentConstant.ID_JOB_SKILLS));
    }
    if (this.type === this.recruitmentType.Request) {
      this.filtreFieldsInputs.push(new FiltrePredicateModel(SharedConstant.STATE_UPPERCASE,
        FieldTypeConstant.RECRUITMENT_REQUEST_STATE_DROPDOWN, RecruitmentConstant.REQUEST_STATUS));
    } else if (this.type === this.recruitmentType.Offer) {
      this.filtreFieldsInputs.push(new FiltrePredicateModel(SharedConstant.STATE_UPPERCASE,
        FieldTypeConstant.RECRUITMENT_OFFER_STATE_DROPDOWN_COMPONENT, RecruitmentConstant.OFFER_STATUS));
    } else {
      this.filtreFieldsInputs.push(new FiltrePredicateModel(SharedConstant.STATE_UPPERCASE,
        FieldTypeConstant.RECRUITMENT_STATE_DROPDOWN_COMPONENT, SharedConstant.STATE));
      this.filtreFieldsInputs.push(new FiltrePredicateModel(SharedConstant.START_DATE_UPPERCASE,
        FieldTypeConstant.DATE_TYPE, RecruitmentConstant.START_DOCUMENT_DATE));
      this.filtreFieldsInputs.push(new FiltrePredicateModel(SharedConstant.END_DATE_UPPERCASE,
        FieldTypeConstant.DATE_TYPE, RecruitmentConstant.END_DOCUMENT_DATE));
      this.filtreFieldsColumns.push(new FiltrePredicateModel(RecruitmentConstant.CANDIDATE_UPPERCASE,
        FieldTypeConstant.CANDIDATE_DROPDOWN_COMPONENT, RecruitmentConstant.IDCANDIDATE));
    }
  }

  getFiltrePredicate(filtre) {
    this.gridSettings.state.skip = NumberConstant.ZERO;
    if (!this.predicate.Filter || (this.predicate.Filter && this.predicate.Filter.length === NumberConstant.ZERO)) {
      this.predicate.Filter = new Array<Filter>();
    }
    this.prepareFiltreFromAdvancedSearch(filtre);
  }

  private prepareFiltreFromAdvancedSearch(filtre) {
    if (filtre.prop === RecruitmentConstant.IDCANDIDATE) {
      this.selectedCandidate = filtre.value;
    } else if (filtre.prop === RecruitmentConstant.START_DOCUMENT_DATE) {
      const date = filtre.filtres ? filtre.filtres[NumberConstant.ZERO].value : undefined;
      this.startDate = date ? new Date (date.getFullYear(), date.getMonth(), date.getDate()) : null;
    } else if (filtre.prop === RecruitmentConstant.END_DOCUMENT_DATE) {
      const date = filtre.filtres ? filtre.filtres[NumberConstant.ZERO].value : undefined;
      this.endDate = date ? new Date (date.getFullYear(), date.getMonth(), date.getDate()) : null;
    } else if (filtre.prop === SharedConstant.ID_EMPLOYEE) {
      filtre.prop = RecruitmentConstant.ID_EMPLOYEE_AUTHOR;
    }
    if (filtre.type === TypeConstant.date) {
      this.predicate.Filter = this.predicate.Filter.filter(value => value.prop === filtre.prop && value.operation !== filtre.operation);
    } else {
      this.predicate.Filter = this.predicate.Filter.filter(value => value.prop !== filtre.prop);
    }
    if(filtre.prop == RecruitmentConstant.CREATION_DATE && filtre.isDateFiltreBetween && filtre.filtres){
      this.predicate.Filter.push(filtre.filtres[NumberConstant.ZERO]);
      this.predicate.Filter.push(filtre.filtres[NumberConstant.ONE]);
    }
    if (filtre.operation && filtre.value && !filtre.SpecificFiltre) {
      if (filtre.type === TypeConstant.date) {
        filtre.value = new Date (filtre.value.getFullYear(), filtre.value.getMonth(), filtre.value.getDate());
      }
      this.predicate.Filter.push(filtre);
    }
  }
  /**
   * identify the predicate operator AND|OR
   * @param operator
   */
   getOperatorPredicate(operator: Operator) {
    this.predicate.Operator = operator;
  }

  /**
   * Reset dataGrid
   */
   resetClickEvent() {
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.selectedCandidate = NumberConstant.ZERO;
    this.startDate = null;
    this.endDate = null;
    this.preparePredicate();
    this.initGridDataSource();
  }

}

