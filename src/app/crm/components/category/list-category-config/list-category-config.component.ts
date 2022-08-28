import {ColumnSettings} from '../../../../shared/utils/column-settings.interface';
import {GridSettings} from '../../../../shared/utils/grid-settings.interface';
import {SwalWarring} from '../../../../shared/components/swal/swal-popup';
import {ValidationService} from '../../../../shared/services/validation/validation.service';
import {GrowlService} from '../../../../../COM/Growl/growl.service';
import {NumberConstant} from '../../../../constant/utility/number.constant';
import {CrmConstant} from '../../../../constant/crm/crm.constant';
import {CategoryService} from '../../../services/category/category.service';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {SortDescriptor, State} from '@progress/kendo-data-query';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ItemService} from '../../../../inventory/services/item/item.service';
import {Subscription} from 'rxjs/Subscription';
import {SharedConstant} from '../../../../constant/shared/shared.constant';
import {NomenclaturesConstant} from '../../../../constant/manufuctoring/nomenclature.constant';
import {EnumValues} from 'enum-values';
import {CategoryTypeEnum} from '../../../../models/crm/enums/categoryType.enum';
import {GenericCrmService} from '../../../generic-crm.service';
import {PermissionConstant} from '../../../../Structure/permission-constant';
import {AuthService} from '../../../../login/Authentification/services/auth.service';
import {PredicateFormat} from '../../../../shared/utils/predicate';
import {SharedCrmConstant} from '../../../../constant/crm/sharedCrm.constant';
import {UserService} from '../../../../administration/services/user/user.service';
import {LocalStorageService} from '../../../../login/Authentification/services/local-storage-service';


const EDIT_CRM = 'main/settings/crm/category/edit/';

@Component({
  selector: 'app-list-category',
  templateUrl: './list-category-config.component.html',
  styleUrls: ['./list-category-config.component.scss']
})
export class ListCategoryConfigComponent implements OnInit, OnDestroy {

  private subscription$: Subscription;

  public categoriesType = [];
  public selectedItem;
  /**
   * filtering value
   */
  public value: string;
  public listRespAndEmployees = [];
  public listItems = [];
  // pager settings
  pagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS_REDUCED;

  /**
   * To bind the value written in the search box
   */
  public searchValue = '';
  /**
   * size of pagination => 10 items per page
   */
  private pageSize = NumberConstant.TEN;

  public gridState: State = {
    skip: 0,
    take: this.pageSize,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public columnsConfig: ColumnSettings[] = [
    {
      field: CrmConstant.TITLE,
      title: CrmConstant.TITLE_OBJECTIF_TITLE,
      filterable: false,
      _width: 160
    },
    {
      field: CrmConstant.RESPONSIBLE_USER,
      title: CrmConstant.RESPONSIBLE_USER_TITLE,
      filterable: false,
      _width: 200
    },
    {
      field: CrmConstant.CONCERNED_USER,
      title: CrmConstant.CONCERNED_USER_TITLE,
      filterable: false,
      _width: 200
    },
    {
      field: CrmConstant.TYPE,
      title: CrmConstant.TYPE_TITLE,
      filterable: false,
      _width: 180
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  public sort: SortDescriptor[] = [{
    field: CrmConstant.TITLE,
    dir: 'asc'
  }];
  public CRMPermissions = PermissionConstant.CRMPermissions;
  public listUsers = [];
  public Users = [];
  public listUsersFilter = [];
  private connectedUser: any;
  public predicate: PredicateFormat;
  public ItemFilter: any;

  /**
   * @param router
   * @param swalWarrings
   * @param translate
   * @param growlService
   * @param validationService
   * @param objectifService
   * @param itemService
   * @param genericCrmService
   */
  constructor(
    private router: Router,
    private swalWarrings: SwalWarring,
    private translate: TranslateService,
    private growlService: GrowlService,
    public validationService: ValidationService,
    private objectifService: CategoryService,
    private itemService: ItemService,
    private genericCrmService: GenericCrmService,
    public authService: AuthService,
    private userService: UserService,
    private localStorageService: LocalStorageService) {
    this.fillBusinessTypes();
  }


  /**
   * ngOnInit
   */
  ngOnInit() {
    this.getConnectedUser();
    this.loadIndividualUsersList();
    this.initGridDataSource(this.gridState.skip);
  }

  fillBusinessTypes() {
    this.categoriesType = EnumValues.getNames(CategoryTypeEnum);
    this.selectedItem = this.categoriesType[0];
  }

  onPageChange(event) {
    this.pageSize = event.take;
    this.initGridDataSource(event.skip / this.pageSize);
  }

  public dataStateChange(state: any): void {
    this.gridSettings.state = state;
  }

  public removeHandler(dataItem) {
    this.swalWarrings.CreateDeleteSwal(CrmConstant.CATEGORY, SharedConstant.CETTE).then((result) => {
      if (result.value) {
        this.objectifService.getJavaGenericService().deleteEntity(dataItem.id).subscribe(() => {
            this.growlService.successNotification(this.translate.instant(CrmConstant.SUCCESS_OPERATION));
            this.initGridDataSource(this.gridState.skip);
          }, () => {
            this.growlService.ErrorNotification(this.translate.instant(NomenclaturesConstant.FAILURE_OPERATION));
          }
        );
      }
    });
  }

  /**
   * Grid data source initiation
   * */
  initGridDataSource(page: any) {
    this.subscription$ = this.objectifService.getJavaGenericService()
      .getEntityList(CrmConstant.PAGE_PAGINATION_URL + `?page=${page}&size=${this.pageSize}`)
      .subscribe(categories => {
        this.listRespAndEmployees = [];
        this.listItems = [];
        categories.categoryList.forEach(category => {

          this.listItems = this.listItems.concat(category.idItems);
        });
        this.getCategoriesDetails(categories);
      });
  }

  private getCategoriesDetails(categories) {
    this.itemService.getItemListDetailByIds(this.listItems).subscribe(data => {
      // reset list of items and list of responsables and employees
      this.listRespAndEmployees = [];
      this.listItems = [];
      this.listItems = data;
      this.gridSettings.gridData = {
        data: categories.categoryList,
        total: categories.totalItems
      };
    });
  }

  /**
   * edit click row event
   * @param dataItem
   */
  public goToAdvancedEdit(dataItem) {
    this.router.navigateByUrl(EDIT_CRM.concat(dataItem.id));
  }


  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.initGridDataSource(this.gridState.skip);
  }

  /*
  get the the reponsable or the employee fullName
   */
  getResponsableOrEmployeeFullName(responsableUser) {
    if (!this.genericCrmService.isNullOrUndefinedOrEmpty(responsableUser)) {
      const responsible = this.listUsersFilter.find(responsableDetail => responsableUser === responsableDetail.Id);
      if (responsible) {
        return responsible.FullName;
      }
    }
  }

  /*
  get product descreption
   */
  getItemDescreption(item) {
    if (!this.genericCrmService.isNullOrUndefinedOrEmpty(item)) {
      this.ItemFilter = this.listItems.find(itemDetail => item === itemDetail.Id);
      if (this.ItemFilter) {
        return this.ItemFilter.Description ? this.ItemFilter.Description : '';
      } else {
        return '';
      }
    }
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }

  searchCategory() {
    if (this.searchValue) {
      this.objectifService.search(this.searchValue, this.pageSize, this.gridState.skip).subscribe((categories) => {
        this.listRespAndEmployees = [];
        this.listItems = [];
        categories.categoryList.forEach(category => {
          this.listItems = this.listItems.concat(category.idItems);
        });
        this.getCategoriesDetails(categories);
      });
    } else {
      this.initGridDataSource(this.gridState.skip);
    }
  }

  filterUsers() {
    this.listUsersFilter = this.listUsersFilter.filter(responsable => responsable.FullName != null);
    this.removeDuplicateUsers();
    this.listUsers = this.listUsersFilter;
  }

  removeDuplicateUsers() {
    this.listUsersFilter = this.listUsersFilter.reduce((a, b) => {
      if (!a.find(data => data.Email === b.Email)) {
        a.push(b);
      }
      return a;
    }, []);
  }

  loadIndividualUsersList() {
    this.predicate = PredicateFormat.prepareEmptyPredicate();
    this.userService.processDataServerSide(this.predicate).subscribe(data => {
      this.listUsers = data.data.filter(user => user.Email !== this.connectedUser.Email);
      this.listUsersFilter = data.data.filter(user => user.Email !== this.connectedUser.Email);
      this.filterUsers();
    }, () => {
      this.growlService.ErrorNotification(this.translate.instant(SharedCrmConstant.FAILURE_OPERATION));
    }, () => {
    });
  }

  getConnectedUser() {
    this.connectedUser = this.localStorageService.getUser();
  }
}
