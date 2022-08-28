import {Component, OnInit, QueryList, ViewChildren, ViewContainerRef, ViewEncapsulation} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {NumberConstant} from '../../../../constant/utility/number.constant';
import {uniqueValueInFormArray, ValidationService} from '../../../../shared/services/validation/validation.service';
import {SwalWarring} from '../../../../shared/components/swal/swal-popup';
import {PredicateFormat} from '../../../../shared/utils/predicate';
import {Employee} from '../../../../models/payroll/employee.model';
import {StatusCrm} from '../../../../models/crm/statusCrm.model';
import {StaffingCategoryCrm} from '../../../../models/crm/categoryCrm.model';
import {GrowlService} from '../../../../../COM/Growl/growl.service';
import {CategoryService} from '../../../services/category/category.service';
import {StatusOpportunityService} from '../../../services/list-status-opportunity/status-opportunity.service';
import {FormModalDialogService} from '../../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import {CrmConstant} from '../../../../constant/crm/crm.constant';
import {TranslateService} from '@ngx-translate/core';
import {RatingPerSkillsComponent} from '../../../../payroll/components/rating-per-skills/rating-per-skills.component';
import {SkillsConstant} from '../../../../constant/payroll/skills.constant';
import {SkillsMatrixConstant} from '../../../../constant/payroll/skills-matrix.constant';
import {DataResult, DataSourceRequestState} from '@progress/kendo-data-query';
import {EmployeeSkillsMatrixFilter} from '../../../../models/enumerators/employee-skills-matrix-filter.enum';
import {SkillsRating} from '../../../../models/payroll/skills-rating.model';
import {Observable} from 'rxjs/Observable';
import {FiltersItemDropdown} from '../../../../models/shared/filters-item-dropdown.model';
import {ProductSaleCategoryCrm} from '../../../../models/crm/categoryCrmProduct.model';
import {OpportunityConstant} from '../../../../constant/crm/opportunityConstant';
import {CompanyService} from '../../../../administration/services/company/company.service';
import {EnumValues} from 'enum-values';
import {CategoryTypeEnum} from '../../../../models/crm/enums/categoryType.enum';
import {PipelineService} from '../../../services/pipeline/pipeline.service';
import {pairwise, startWith} from 'rxjs/operators';
import {GenericCrmService} from '../../../generic-crm.service';
import {StyleConfigService} from '../../../../shared/services/styleConfig/style-config.service';
import {SharedCrmConstant} from '../../../../constant/crm/sharedCrm.constant';
import {UserService} from '../../../../administration/services/user/user.service';
import {LocalStorageService} from '../../../../login/Authentification/services/local-storage-service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {

  formGroup: FormGroup;
  public listRespUser: Array<Employee> = [];
  public listRespUserFiltred: Array<Employee> = [];
  public listConcernedEmployees: Array<Employee> = [];
  public listConcernedEmployeesFiltred: Array<Employee> = [];
  public categoriesType: Array<string>;
  public selectedItem;
  currencyChecked: boolean;
  public isFormGroupChanged = false;

  public itemsSort: StatusCrm[] = [];
  public itemsPipeSort: String[] = [];
  @ViewChildren(RatingPerSkillsComponent) RatingChils: QueryList<RatingPerSkillsComponent>;
  /*
 * Id Entity
 */
  private id: number;
  /*
   * is updateMode
   */
  public isUpdateMode: boolean;
  /*
 * id Subscription
 */
  public predicate: PredicateFormat = new PredicateFormat();

  skillsFamilySelected: any[] = [];
  filterFormGroup: FormGroup;
  formGroupProduct: FormGroup;
  public gridState: DataSourceRequestState;
  public filtersItemDropdown = new FiltersItemDropdown();
  employeeSkillsMatrixFilter: EmployeeSkillsMatrixFilter;
  showMessage = false;
  selectedTeam = 0;
  selectedEmployees: any[] = [];
  selectedProducts: any[] = [];
  public categoryCrmFormGroup: FormGroup;
  staffingDataToSend: StaffingCategoryCrm;
  productSaleDataToSend: ProductSaleCategoryCrm;

  data: any;
  products: any = [];
  public value: any;
  public selectedValue = [];
  public updatePossibility: boolean;

  public articleIsValid = true;

  public categoryTileAlreadyExists = false;

  public selectForWhichTime = 0;


  public minStatus = 2;
  public statusNumberIsInsufficient = false;

  public allPipelines = [];
  public skillsCollapseIsOpened: boolean;

  public listUsers = [];
  public Users = [];
  public listUsersFilter = [];
  private connectedUser: any;
  public predicateResp: PredicateFormat;

  public listUsersConcerned = [];
  public concerned = [];
  public listUsersConcernedFilter = [];
  public isConcerned = true;
  public fromRH = false;
  /**
   *
   * @param formBuilder
   * @param translate
   * @param validationService
   * @param router
   * @param skillsService
   * @param activatedRoute
   * @param swalWarrings
   * @param categoryService
   * @param growlService
   * @param employeeService
   * @param formModalDialogService
   * @param statusOpportunityService
   * @param viewRef
   * @param employeeSkillsService
   */
  constructor(private formBuilder: FormBuilder,
              private translate: TranslateService,
              public validationService: ValidationService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private swalWarrings: SwalWarring,
              private categoryService: CategoryService,
              private growlService: GrowlService,
              private styleConfigService: StyleConfigService,
              private formModalDialogService: FormModalDialogService,
              private pipelineService: PipelineService,
              public statusOpportunityService: StatusOpportunityService,
              private viewRef: ViewContainerRef,
              private companyService: CompanyService,
              private genericCrmService: GenericCrmService,
              private userService: UserService,
              private localStorageService: LocalStorageService
  ) {
  }

  fillBusinessTypes() {
    this.categoriesType = EnumValues.getNames(CategoryTypeEnum);
    this.selectedItem = this.categoriesType[0];
  }

  /**
   * ngOnInit
   */
  ngOnInit() {
    this.getConnectedUser();
    this.loadIndividualUsersList();
    this.initData();
    this.getAllPipelines();
    this.createAddForm();
    this.isUpdateMode = this.id > 0;
    if (this.isUpdateMode) {
      this.getDataToUpdate();
    } else {
      this.companyService.getCurrentCompany().subscribe(data => {
        if (data) {
          this.categoryCrmFormGroup.controls['IdCurrency'].setValue(data.IdCurrency);
          this.isFormGroupChanged = false;
        }
      });
    }
    this.createFilterFormGroup();
    this.addSkillsLevel();
  }

  initData() {
    this.fillBusinessTypes();
    this.staffingDataToSend = new StaffingCategoryCrm(NumberConstant.ZERO, '', [], [],
      '', []);
    // this.dataToUpdate = new StaffingCategoryCrm(NumberConstant.ZERO, '', [], [], '', []);
    this.productSaleDataToSend = new ProductSaleCategoryCrm('', [], [], '',
      [], 0, false);

    this.activatedRoute.params.subscribe(params => {
      this.id = +params['id'] || 0;
      if (this.id > 0) {
        this.checkUpdatePossibility(this.id);
      }
    });
    this.formGroupProduct = new FormGroup({
      IdItem: new FormControl([], Validators.required),
      categoryType: new FormControl('', Validators.required),
      title: new FormControl('', Validators.required),
      responsablesUsersId: new FormControl([], Validators.required),

    });
  }

  public changeRateLevel() {
    this.validateForm();
    this.gridState = this.initializeState();
  }

  itemSelectProductLineForm(event) {
    this.articleIsValid = true;
    this.selectedProducts = [];
    this.selectForWhichTime === 0 ? this.selectedProducts = event : this.selectedProducts = (event.itemSelected);

    this.selectForWhichTime++;
  }


  public deleteSkillsLevel(index) {
    this.SkillsLevels.removeAt(index);
    this.validateForm();
    this.gridState = this.initializeState();
    // this.skillsSelected(); //
  }

  public initializeState(): DataSourceRequestState {
    return {
      skip: 0,
      take: 10,
      filter: { // Initial filter descriptor
        logic: 'and',
        filters: []
      },
      group: [{field: SkillsMatrixConstant.TEAM}]
    };
  }

  /**
   * when user indicate skills that should be display in the matrix
   */

  preparePredicate() {
    this.predicate = new PredicateFormat();
    if (this.gridState) {
   //   this.employeeSkillsService.prepareServerOptions(this.gridState, this.predicate);//
    }
    this.employeeSkillsMatrixFilter = new EmployeeSkillsMatrixFilter();
    this.employeeSkillsMatrixFilter.Page = this.predicate.page;
    this.employeeSkillsMatrixFilter.PageSize = this.predicate.pageSize;
    this.employeeSkillsMatrixFilter.IdTeam = this.selectedTeam;
    this.employeeSkillsMatrixFilter.EmployeesId = this.selectedEmployees;
    this.employeeSkillsMatrixFilter.SkillsLevels = [];
    if (this.SkillsLevels.length > 0) {
      for (let index = 0; index < this.SkillsLevels.length; index++) {
        const skillsLevel = new SkillsRating();
        skillsLevel.IdSkills = (this.SkillsLevels.at(index) as FormGroup).controls[SkillsMatrixConstant.ID_SKILLS].value;
        skillsLevel.MinLevel = (this.SkillsLevels.at(index) as FormGroup).controls[SkillsMatrixConstant.RATE].value[0];
        skillsLevel.MaxLevel = (this.SkillsLevels.at(index) as FormGroup).controls[SkillsMatrixConstant.RATE].value[1];
        if (skillsLevel.IdSkills) {
          this.employeeSkillsMatrixFilter.SkillsLevels.push(skillsLevel);
        }
      }
    }
  }

  public validateForm() {
    for (let index = 0; index < this.SkillsLevels.length; index++) {
      (this.SkillsLevels.at(index) as FormGroup).get(SkillsConstant.ID_SKILLS).updateValueAndValidity();
    }
  }

  public get SkillsLevels(): FormArray {
    return this.filterFormGroup.controls[SkillsMatrixConstant.SKILLS_LEVELS] as FormArray;
  }

  /**
   * Get category data to update
   */
  getDataToUpdate() {
    this.itemsSort = [];
    this.itemsPipeSort = [];
    this.categoryService.getJavaGenericService().getEntityById(this.id)
      .toPromise().then(data => {
      this.products = data.idItems;
      this.orderPipe(data);
      this.categoryCrmFormGroup.patchValue(data);
      this.categoryCrmFormGroup.controls[CrmConstant.TYPE_CONTROLS].setValue(data.categoryType);
      this.categoryCrmFormGroup.controls['IdCurrency'].setValue(data.idCurrency);
      this.currencyChecked = data.withTotal;
      this.orderPipe(data);
      this.isFormGroupChanged = false;
    });
  }

  orderPipe(data) {
    data.status.sort((a, b) => (a.positionInPipe > b.positionInPipe) ? 1 : -1);
  }

  /*
   * Prepare Add form component
   */
  private createAddForm(): void {
    this.categoryCrmFormGroup = this.formBuilder.group({
      id: [NumberConstant.ZERO, Validators.required],
      title: ['', Validators.required],
      employeesId: ['', Validators.required],
      responsablesUsersId: ['', Validators.required],
      type: ['', Validators.required],
      IdCurrency: [undefined],
      withTotal: [''],
      pipelineId: [undefined, Validators.required]
    });
  }

  prepareStaffingCategoryDataToSend() {
    this.staffingDataToSend.responsablesUsersId = [];
    this.staffingDataToSend.employeesId = [];
    this.staffingDataToSend.title = this.categoryCrmFormGroup.value.title;
    this.staffingDataToSend.idCurrency = this.categoryCrmFormGroup.value.IdCurrency;
    this.staffingDataToSend.withTotal = this.currencyChecked;
    this.categoryCrmFormGroup.value.employeesId.forEach(element => {
      this.staffingDataToSend.employeesId.push(element);
    });
    this.categoryCrmFormGroup.value.responsablesUsersId.forEach(element => {
      this.staffingDataToSend.responsablesUsersId.push(element);
    });
    this.staffingDataToSend.categoryType = this.categoryCrmFormGroup.value.type;
    this.staffingDataToSend.pipelineId = this.categoryCrmFormGroup.controls['pipelineId'].value;
  }

  prepareProductSaleCategoryDataToSend() {
    if (this.selectedProducts !== undefined) {
      this.selectedProducts = this.selectedProducts.map(value1 => {
        if ((value1.Id !== undefined)) {
          return value1.Id;
        } else {
          return value1;
        }
      });
    }
    if (this.selectedProducts.length === 0) {
      this.articleIsValid = false;
      this.categoryCrmFormGroup.setErrors({'incorrect': true});
    }

    this.productSaleDataToSend.status = [];
    this.productSaleDataToSend = new ProductSaleCategoryCrm(this.categoryCrmFormGroup.value.title, this.selectedProducts,
      this.categoryCrmFormGroup.value.responsablesUsersId, this.categoriesType[1],
      this.productSaleDataToSend.status, this.categoryCrmFormGroup.value.IdCurrency, this.currencyChecked
    );
    this.productSaleDataToSend.pipelineId = this.categoryCrmFormGroup.controls['pipelineId'].value;

  }

  save() {
    this.isFormGroupChanged = false;
    if (this.categoryCrmFormGroup.value.type === this.categoriesType[0]) {
      this.saveStaffingCategory();
    } else {
      this.saveProductSaleCategory();
    }
  }

  private getAllPipelines() {
    this.pipelineService.getJavaGenericService().getEntityList().subscribe((data) => {
      this.allPipelines = data;
    });
  }

  public createFilterFormGroup() {
    this.filterFormGroup = this.formBuilder.group({
      IdTeam: [undefined],
      SkillsLevels: this.formBuilder.array([]),
    });
  }

  public addSkillsLevel(): void {
    if (this.filterFormGroup.valid) {
      this.SkillsLevels.push(this.createSkillsFormGroup());
    }
  }

  public createSkillsFormGroup(): FormGroup {
    return new FormGroup({
      IdSkills: new FormControl(undefined, uniqueValueInFormArray(Observable.of(this.SkillsLevels), SkillsConstant.ID_SKILLS)),
      Rate: new FormControl([1, 6])
    });
  }

  getLabelTitle() {
    return this.isUpdateMode ? 'UPDATE_CATEGORY' : 'ADD_OBJECTIF';
  }

  checkUpdatePossibility(id: number) {
    this.categoryService.getJavaGenericService().getEntityById(id, OpportunityConstant.EXISTS_BY_OPP).subscribe((data) => {
      this.updatePossibility = data;
    });
  }

  /**
   * Product sale category save or update
   */
  saveProductSaleCategory() {
    this.categoryCrmFormGroup.get(OpportunityConstant.EMPLOYEES_ID).clearValidators();
    this.categoryCrmFormGroup.get(OpportunityConstant.EMPLOYEES_ID).updateValueAndValidity();
    if (this.selectedProducts === undefined) {
      this.selectedProducts = [];
      this.selectedProducts = this.products;
    }
    this.prepareProductSaleCategoryDataToSend();
    if (this.categoryCrmFormGroup.valid) {
      if (this.isUpdateMode) {
        this.updateCategory(this.productSaleDataToSend, this.id, OpportunityConstant.TYPE_PRODUCT_SALE_URL);
      } else {
        this.saveCategory(this.productSaleDataToSend, OpportunityConstant.TYPE_PRODUCT_SALE_URL);
      }
    } else {
      this.statusNumberIsInsufficient = this.itemsSort.length < this.minStatus;
      this.validationService.validateAllFormFields(this.categoryCrmFormGroup);
    }
  }

  /**
   * Staffing category save or update
   */
  saveStaffingCategory() {
    if (this.categoryCrmFormGroup.valid) {
      this.prepareStaffingCategoryDataToSend();
      if (this.isUpdateMode) {
        this.updateCategory(this.staffingDataToSend, this.id, OpportunityConstant.TYPE_STAFFING_URL);
      } else {
        this.saveCategory(this.staffingDataToSend, OpportunityConstant.TYPE_STAFFING_URL);
      }
    } else {
      this.validationService.validateAllFormFields(this.categoryCrmFormGroup);
    }
  }

  titleKeyUp() {
    this.categoryTileAlreadyExists = false;
  }

  /**
   *  update category to be used with staffing & product sale category
   * @param dataToSend
   * @param id
   * @param endpoint
   */
  updateCategory(dataToSend, id: number, endpoint: string) {
    this.categoryService.getJavaGenericService().updateEntity(dataToSend, id, endpoint)
      .subscribe(data => {
        if (data.title != null) {
          this.growlService.successNotification(this.translate.instant(CrmConstant.SUCCESS_OPERATION));
          this.router.navigateByUrl(CrmConstant.CATEGORY_SETTING_LIST_URL);
        } else {
          this.categoryCrmFormGroup.controls['title'].markAsPending();
          this.categoryTileAlreadyExists = true;
        }
      }, err => {
        this.growlService.ErrorNotification(this.translate.instant(CrmConstant.FAILURE_OPERATION));
      });
  }

  /**
   * save category to be used with staffing & product sale category
   * @param dataToSend
   * @param endpoint
   */
  saveCategory(dataToSend, endpoint: string) {
    this.categoryService.getJavaGenericService().saveEntity(dataToSend, endpoint).subscribe(data => {
      if (data.title != null) {
        this.growlService.successNotification(this.translate.instant(CrmConstant.SUCCESS_OPERATION));
        this.router.navigateByUrl(CrmConstant.CATEGORY_SETTING_LIST_URL);
      } else {
        this.categoryCrmFormGroup.controls['title'].setErrors({'incorrect': true});
        this.categoryTileAlreadyExists = true;
      }
    }, err => {
      this.growlService.ErrorNotification(this.translate.instant(CrmConstant.FAILURE_OPERATION));
    });
  }

  handleResponsablesFilter(userSearched) {
    this.listUsers = this.listUsersFilter.filter(responsable => responsable.FullName.toLowerCase()
      .includes(userSearched.toLowerCase()));
  }

  handleConcernedsFilter(userSearched) {
    this.listUsersConcerned = this.listUsersConcernedFilter.filter(responsable => responsable.FullName.toLowerCase()
      .includes(userSearched.toLowerCase()));
  }

  handleEmployeesFilter(employeeSearched) {
    this.listConcernedEmployees = this.listConcernedEmployeesFiltred.filter(employee => employee.FullName.toLowerCase()
      .indexOf(employeeSearched.toLowerCase()) !== -1);
  }

  updateCurrency(value) {
    this.currencyChecked = value.target.checked;
  }

  /**
   * this method will be called by CanDeactivateGuard service to check the leaving component possibility
   */
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.genericCrmService.handleCanDeactivateToLeaveCurrentComponent(this.isContactFormGroupChanged.bind(this));
  }

  isContactFormGroupChanged(): boolean {
    return this.isFormGroupChanged;
  }

  changeCategoryFormListener() {
    Object.keys(this.categoryCrmFormGroup.controls).forEach(control => {
      this.categoryCrmFormGroup.get(control).valueChanges.pipe(startWith(null), pairwise()).subscribe(([prev, next]: [any, any]) => {
        if ((!this.genericCrmService.isNullOrUndefinedOrEmpty(prev) && this.genericCrmService.isNullOrUndefinedOrEmpty(next))
          || !this.genericCrmService.isNullOrUndefinedOrEmpty(next) && prev !== next) {
          this.isFormGroupChanged = true;
        }
      });
    });
  }

  getFooterClass(): string {
    return this.styleConfigService.getFooterClassSettingLayoutAddComponent();
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

  filterUsersConcerned() {
    this.listUsersConcernedFilter = this.listUsersConcernedFilter.filter(responsable => responsable.FullName != null);
    this.removeDuplicateUsersConcerned();
    this.listUsersConcerned = this.listUsersConcernedFilter;
  }

  removeDuplicateUsersConcerned() {

    this.listUsersConcernedFilter = this.listUsersConcernedFilter.reduce((a, b) => {
      if (!a.find(data => data.Email === b.Email)) {
        a.push(b);
      }
      return a;
    }, []);
  }

  loadIndividualUsersList() {
    this.predicateResp = PredicateFormat.prepareEmptyPredicate();
    this.userService.processDataServerSide(this.predicate).subscribe(data => {

      this.listUsersConcernedFilter = data.data;
      this.listUsersConcerned = data.data;
      this.listUsers = data.data;
      this.listUsersFilter = data.data;
      this.filterUsersConcerned();
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
