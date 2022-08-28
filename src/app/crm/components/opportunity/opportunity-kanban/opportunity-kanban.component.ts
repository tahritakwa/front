import {
  AfterContentInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewContainerRef
} from '@angular/core';
import {DragulaService} from 'ng2-dragula';
import {Subscription} from 'rxjs/Subscription';
import {ActivatedRoute, Router} from '@angular/router';
import {OpportunityConstant} from '../../../../constant/crm/opportunityConstant';
import {OpportunityService} from '../../../services/opportunity.service';
import {NumberConstant} from '../../../../constant/utility/number.constant';
import {OpportunityLog} from '../../../../models/crm/opportunityLog.model';
import {CrmConstant} from '../../../../constant/crm/crm.constant';
import {debounceTime} from 'rxjs/operators';
import {ItemService} from '../../../../inventory/services/item/item.service';
import {UpdateServiceService} from '../../../services/update-service.service';
import {OrganisationService} from '../../../services/organisation/organisation.service';
import {CategoryService} from '../../../services/category/category.service';
import {Opportunity} from '../../../../models/crm/opportunity.model';
import {Employee} from '../../../../models/payroll/employee.model';
import {StaffingCategoryCrm} from '../../../../models/crm/categoryCrm.model';
import {SideNavService} from '../../../services/sid-nav/side-nav.service';
import {FilterTypesEnum} from '../../../../models/crm/enums/FilterTypes.enum';
import {ContactConstants} from '../../../../constant/crm/contact.constant';
import {SwalWarring} from '../../../../shared/components/swal/swal-popup';
import {TranslateService} from '@ngx-translate/core';
import {CurrencyService} from '../../../../administration/services/currency/currency.service';
import {GenericCrmService} from '../../../generic-crm.service';
import {GrowlService} from '../../../../../COM/Growl/growl.service';
import {SharedConstant} from '../../../../constant/shared/shared.constant';
import {FormModalDialogService} from '../../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import {PopupAddOpporttunityComponent} from '../popup-add-opportunity/popup-add-opportinity.component';
import {registerLocaleData} from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import {TiersService} from '../../../../purchase/services/tiers/tiers.service';
import {Tiers} from '../../../../models/achat/tiers.model';
import {CompanyService} from '../../../../administration/services/company/company.service';
import {EnumValues} from 'enum-values';
import {PipelineState} from '../../../../models/crm/enums/PipelineState';
import {OpportunityType} from '../../../../models/crm/enums/opportunityType.enum';
import {Subject} from 'rxjs/Subject';
import {ArchivePopupComponent} from '../../archiving/archive-popup/archive-popup.component';
import {LocalStorageService} from '../../../../login/Authentification/services/local-storage-service';
import {UserService} from '../../../../administration/services/user/user.service';
import {PermissionConstant} from '../../../../Structure/permission-constant';
import {AuthService} from '../../../../login/Authentification/services/auth.service';
import {SpinnerService} from '../../../../../COM/spinner/spinner.service';

@Component({
  selector: 'app-kanban-view',
  templateUrl: './opportunity-kanban.component.html',
  styleUrls: ['./opportunity-kanban.component.scss']
})
export class OpportunityKanbanComponent implements OnInit, AfterContentInit, OnChanges, OnDestroy {

  public byTypeAffaireFilter = FilterTypesEnum['BY_TYPE_AFFAIRE'];
  public byCategoryFilter = FilterTypesEnum['BY_GATEGORY'];
  public byEmployeeFilter = FilterTypesEnum['BY_EMPLOYEE'];
  public byArticleFilter = FilterTypesEnum['BY_ARTICLE'];
  MANY_ITEMS = OpportunityConstant.MANY_ITEMS;
  public size: number;
  public edited = false;
  sourceOpportunity = OpportunityConstant.EMPTY_PROPERTY;
  target = OpportunityConstant.EMPTY_PROPERTY;
  title = OpportunityConstant.EMPTY_PROPERTY;
  subs = new Subscription();
  public allStatus: Array<any> = [];

  public opportunitiesByStatusToShow: any;
  employee: Array<Employee> = [];
  responsables: Array<Employee> = [];
  public employeeListId = [];

  private statusColors: any;
  public positionMap: any;
  log = [];
  public categoryType: string;
  public categoryId;
  public listProduit: Array<any> = [];
  public filterG = 'ALL_OPPORTUNITY';
  choosenFilterNumber = NumberConstant.ZERO;
  objectives = false;
  concerned = false;
  public categoryList: Array<StaffingCategoryCrm> = [];
  public objList: Array<string> = [];
  public category: string;
  public opportunitiesList: Array<Opportunity> = [];
  private selectedCategory: number;
  private idEmploy;
  private productId;
  private opportunityDetailsToShow;

  showSidNav: boolean;
  dragOpp = false;
  opportunityData: any;
  defaultCategory: string;
  dataToSendToPoPUp: any;
  @Output() closeKanban = new EventEmitter<any>();
  @Input() opportunityFilter;
  @Input() isArchivingMode;
  @Input() source: string;
  showTotalInKanban: boolean;
  currencyCodeTotale: string;
  private listCurrency = [];
  private currencyListConvert = [];
  public defaultCurrancyCode: string;
  public defaultCurrancyId: number;
  private opportunitiesClientsIds = [];
  private clientsOrganizationDetails = [];
  private destroy = new Subject();
  public connectedUser;
  public CRMPermissions = PermissionConstant.CRMPermissions;
  public hasEditPermission = false;
  public constructor( private spinnerService: SpinnerService,
                      private dragulaService: DragulaService,
                     private router: Router,
                     private viewRef: ViewContainerRef,
                     private oppService: OpportunityService,
                     private upadteOppEervice: UpdateServiceService,
                     private organisationService: OrganisationService,
                     private categoryService: CategoryService,
                     private companyService: CompanyService,
                     private sideNaveService: SideNavService,
                     private swalWarring: SwalWarring,
                     private  translate: TranslateService,
                     private route: ActivatedRoute,
                     private itemService: ItemService,
                     private tierService: TiersService,
                     private currencyService: CurrencyService,
                     private genericCrmService: GenericCrmService,
                     private growlService: GrowlService,
                     private formModalDialogService: FormModalDialogService,
                     private localStorageService: LocalStorageService,
                     private  userService: UserService,
                     public authService: AuthService) {
  }

  ngOnInit() {
    this.hasEditPermission = this.authService.hasAuthorities([this.CRMPermissions.EDIT_OPPORTUNITY]);
    this.getConnectedUser();
    registerLocaleData(localeFr, 'fr');
    this.currencyService.listdropdown().subscribe((data: any) => {
      this.listCurrency = data.listData;
      this.getDefaultCurrancy();
    });
    this.initDragAndDropKanban();
    this.currencyService.list().subscribe(currencies => {
      this.currencyListConvert = currencies;
    });
  }

  ngOnDestroy() {
    this.destroy.next();
  }

  getDefaultCurrancy() {
    this.companyService.getCurrentCompany().subscribe(data => {
      if (data) {
        this.defaultCurrancyId = data.IdCurrency;
        const currency = this.listCurrency
          .find(currencyItem => currencyItem.Id === data.IdCurrency);
        this.defaultCurrancyCode = currency.Code;
      }
    });
  }

  initDragAndDropKanban() {
    this.subs.add(this.dragulaService.dropModel(this.MANY_ITEMS).takeUntil(this.destroy)
      .subscribe(({el, target, source, sourceModel, targetModel, item}) => {
          // notification CANNOT_MOVE_STATE if the opportunity in the close position cannot move to another state
          if (!this.dragOpp &&
            (item.currentPositionPipe === item.closedPositionPipe)) {
            this.growlService.InfoNotification(this.translate.instant(OpportunityConstant.CANNOT_MOVE_STATE));
            this.initKanban();
          } else {
            // fetch opportunity with state data
            this.fillOpportunityDataFromState(item, source, target);
            setTimeout(function () {
              this.edited = false;
            }.bind(this), NumberConstant.FOUR_THOUSAND);
          }
        }
      )
    );
  }

  fillOpportunityDataFromState(opportuniryItem, sourceState, targetState) {
    // prepare data drag and drop
    const userConnecte = this.connectedUser.Email;
    opportuniryItem.currentPositionPipe = +(targetState.parentElement.id - 1);
    const dateOpp = new Date();
    let opportunityLog: OpportunityLog;
    opportunityLog = new OpportunityLog(sourceState.parentElement.id, targetState.parentElement.id,
      opportuniryItem.id, userConnecte, opportuniryItem.title, dateOpp.toString());
    this.sourceOpportunity = sourceState.parentElement.id;
    this.target = targetState.parentElement.id;
    this.title = opportuniryItem.title;

    // get element drag as HTMLElement to fetch opportunityData
    if (this.sourceOpportunity !== this.target) {
      const element: HTMLElement = document.getElementById('openPopup') as HTMLElement;
      element.click();
      this.log.push(opportunityLog);
      this.opportunityData = {
        data: {
          opportunity: opportuniryItem,
          isUpdated: true,
          type: this.categoryType,
          isSuccessStep: this.checkIsSuccessStep(opportuniryItem, +this.target)
            && (opportuniryItem.opportunityType === OpportunityType.PROSPECT),
          opportunityIsBeingLost: this.checkIsLossStep(opportuniryItem, +this.target),
          opportunityIsBeingWon: ((opportuniryItem.opportunityType === OpportunityType.CLIENT)
            && this.checkIsSuccessStep(opportuniryItem, +this.target))
        }
      };
      this.dragOpp = true;
      this.edited = true;
    }
  }

  getConnectedUser() {
    this.connectedUser = this.localStorageService.getUser();
  }

  private checkIsSuccessStep(opprtunity, order): boolean {
    if (opprtunity) {
      const selectedStep = opprtunity.category.pipeline.pipelineSteps.find(step => step.order === order);
      return (selectedStep.state === EnumValues.getNameFromValue(PipelineState, PipelineState.SUCCESS_FINAL_STATE));
    }
  }

  private checkIsLossStep(opprtunity, order): boolean {
    if (opprtunity) {
      const selectedStep = opprtunity.category.pipeline.pipelineSteps.find(step => step.order === order);
      return (selectedStep.state === EnumValues.getNameFromValue(PipelineState, PipelineState.FAILURE_FINAL_STATE));
    }
  }

  private loadClientsDetails() {
    this.opportunitiesClientsIds = [];
    this.allStatus.forEach((status) => {
      const opportunitiesByStatus: Opportunity[] = this.opportunitiesByStatusToShow[status];
      this.fillOpportunitiesClientsIds(opportunitiesByStatus);
    });
    this.getClientsDetailsByIds();
  }

  fillOpportunitiesClientsIds(opportunities: Opportunity[]) {
    if (opportunities) {
      opportunities.forEach((opportunity: Opportunity) => {
        if (opportunity.idClientOrganization) {
          this.opportunitiesClientsIds.push(opportunity.idClientOrganization);
        }
      });
    }
  }

  getClientsDetailsByIds() {
    this.opportunitiesClientsIds.forEach((id) => {
      if (id) {
        this.tierService.getTiersById(id).subscribe((tier) => {
          this.clientsOrganizationDetails.push(tier);
        });
      }
    });
  }

  getOpportunityClientName(opportunity: Opportunity) {
    if (opportunity.opportunityType === OpportunityConstant.CLIENT_TYPE) {
      const client: Tiers = this.clientsOrganizationDetails.find(tier => tier.Id === opportunity.idClientOrganization);
      if (client && client.Name) {
        return client.Name;
      }
    } else {
      return opportunity.organisationName;
    }
  }

  private getAllStatusFromData() {
    this.spinnerService.showLoader();
    this.dragOpp=false;
    this.oppService.getOpportunityByCategoryAndIsArchiving(this.categoryId, this.isArchivingMode)
      .subscribe(data => {
        data.orderedStatusPosition.sort(function (a, b) {
          return a.position.toString().localeCompare(b.position.toString());
        });
        this.allStatus = [];

        data.orderedStatusPosition.forEach(element => {
          this.allStatus.push(element.statusName);
        });

        this.categoryType = Object.keys(data.categoryUsersId).toString();
        if (!this.opportunityFilter.data.typeDAffaireFromList) {

          if (this.categoryType === CrmConstant.STAFFING) {
            this.employeeListId = data.categoryUsersId.Staffing;
            this.userService.getUsersListByArray(this.employeeListId).subscribe(data1 => {
              this.employee = data1;
              this.oppService.employeeListId = data1;
            });
          } else {
            const productListId = data.categoryUsersId.productSale;

            this.itemService.getItemsAfterFilter(productListId).subscribe(product => {
              product.listData.forEach(p => this.listProduit.push(p));
            });
          }
        }

        this.opportunitiesByStatusToShow = data.statusWithOpportunity;
        this.loadClientsDetails();
        this.statusColors = data.statusColors;
        this.positionMap = data.statusPosition;

        this.size = NumberConstant.NINETY / Object.keys(data.statusPosition).length;
          this.spinnerService.hideLaoder();
          this.dragOpp = true;
      }

      );
  }

  getCategoriesByCategoryType(categoryType) {
    this.byTypeAffaireFilter = categoryType;
    this.opportunityFilter.data.typeDAffaireFromKanban = categoryType;
    this.categoryType = categoryType;
    this.byCategoryFilter = FilterTypesEnum['BY_GATEGORY'];

    if (categoryType === CrmConstant.STAFFING) {
      this.byEmployeeFilter = FilterTypesEnum['BY_EMPLOYEE'];
      this.productId = undefined;
    } else if (categoryType === CrmConstant.PRODUCT_SALE) {
      this.byArticleFilter = FilterTypesEnum['BY_ARTICLE'];
      this.idEmploy = undefined;
    }

    this.categoryList = [];
    this.categoryService.getListOfCategories(categoryType, this.isArchivingMode)
      .subscribe(category => {
        this.categoryList = category;
      });
  }


  filterByCategory(event, concerned ?: boolean, ignoreIds?: boolean) {

    if (this.byTypeAffaireFilter === CrmConstant.STAFFING) {
      this.byEmployeeFilter = FilterTypesEnum['BY_EMPLOYEE'];
      if (concerned === true && ignoreIds === true) {
        this.idEmploy = undefined;
      }

    } else if (this.byTypeAffaireFilter === CrmConstant.PRODUCT_SALE) {
      this.byArticleFilter = FilterTypesEnum['BY_ARTICLE'];
      if (concerned === true && ignoreIds === true) {
        this.productId = undefined;
      }
    }

    this.byCategoryFilter = event.title;
    this.selectedCategory = event.title;
    this.concerned = concerned;
    this.listProduit = [];

    if (event.title !== undefined) {
      this.category = event.title;
    }

    this.oppService.getOpportunityByCategoryAndIsArchiving(event.id, this.isArchivingMode)
      .subscribe(async data => {
        data.orderedStatusPosition.sort(function (a, b) {
          return a.position.toString().localeCompare(b.position.toString());
        });
        this.allStatus = [];
        data.orderedStatusPosition.forEach(element => {
          this.allStatus.push(element.statusName);
        });


        this.categoryType = Object.keys(data.categoryUsersId).toString();
        this.opportunitiesByCategoryForList(event, data);

      });

  }


  private opportunitiesByCategoryForList(event, res) {
    this.oppService.getOpportunityConcernedAndResponsable(event.id).subscribe(async data => {
      if (data !== null) {
        const responsablesDetails = await this.userService.getUsersListByArray(data.responsableIds).toPromise();
        if (responsablesDetails != null) {
          this.responsables = responsablesDetails;
        }
        if (this.categoryType === OpportunityConstant.TYPE_PRODUCT_SALE) {
          const productsDetails = await this.itemService.getItemsAfterFilter(data.productIds).toPromise();
          productsDetails.listData.forEach(p => this.listProduit.push(p));
          this.initKanbanByFilter(res, productsDetails.listData);

        } else if (this.categoryType === OpportunityConstant.TYPE_STAFFING) {

          const employeesDetails = await this.userService.getUsersListByArray(data.employeeIds).toPromise();

          if (employeesDetails != null) {
            this.employee = employeesDetails;
          }

          this.initKanbanByFilter(res);

        }

      }

      this.opportunitiesByStatusToShow = res.statusWithOpportunity;
      this.loadClientsDetails();
      this.statusColors = res.statusColors;
      this.positionMap = res.statusPosition;
      this.size = NumberConstant.NINETY / Object.keys(res.statusPosition).length;

    });
  }

  private setCurrency(currency, opportunity) {
    if (currency) {
      opportunity.currencyFormat = {
        style: 'accounting',
        currency: currency.Code,
        currencyDisplay: 'symbol'
      };
    }
  }

  toDate(itemOpp) {
    return itemOpp.opportunityCreatedDate[NumberConstant.ZERO] + CrmConstant.FILE_SEPARATOR
      + itemOpp.opportunityCreatedDate[NumberConstant.ONE] +
      CrmConstant.FILE_SEPARATOR + itemOpp.opportunityCreatedDate[NumberConstant.TWO];
  }

  setMyStyles(color, index) {
    if (index === NumberConstant.ZERO) {
      return {
        'background-color': `${color}`,
        'border': 'none',
        'padding': '2.5px 50%',
        'display': 'block',
        'margin-top': '-4%',
        'border-radius': '10px'
      };
    } else {
      return {
        'background-color': `${color}`,
        'border': 'none',
        'padding': '2.5px 23px',
        'display': 'inline-block',
        'border-radius': '10px'
      };
    }
  }

  ngAfterContentInit(): void {
    this.oppService.oppSaved.pipe(debounceTime(NumberConstant.FIVE_HUNDRED)).subscribe(data => {
      this.getAllStatusFromData();
    });
  }

  filter(event) {
    const x = [];
    event.forEach(product => {
        x.push(product.Id);
      }
    );
  }

  getOpportunitiesList() {
    this.oppService.getJavaGenericService().getEntityList()
      .subscribe((data) => {
        this.opportunitiesList = data;
        this.opportunitiesList.forEach((opp) => {
          this.categoryService.getJavaGenericService().getEntityById(opp.categoryId).subscribe(response => {
            const categoryType = response.categoryType;
            if (this.objList.indexOf(categoryType) < NumberConstant.ZERO) {
              this.objList.push(categoryType);
            }
          });

        });
      });
  }

  getEmployeeById(id: number) {
    this.userService.getById(id).subscribe((data) => {
      this.byEmployeeFilter = data.FullName;
    });
  }

  getProductById(id: number) {
    this.itemService.getProductById(id).subscribe((data) => {

      this.byArticleFilter = data.Description;
    });
  }

  showOpp(id: number) {
    this.oppService.getJavaGenericService().getEntityById(id, OpportunityConstant.DETEAIL).subscribe(data => {

      if (data) {
        this.showSidNav = true;
        this.opportunityDetailsToShow = {value: true, data: data};

      }
    });
  }

  hideSidNav(e) {
    this.showSidNav = false;
  }


  public removeHandler(item) {
    this.swalWarring.CreateSwal(this.translate.instant(ContactConstants.PUP_UP_DELETE_OPPORTUNITY_TEXT)).then((result) => {
      if (result.value) {
        this.oppService.getJavaGenericService().deleteEntity(item.id).subscribe((data) => {

            if (data) {
              this.getAllStatusFromData();
            }
          }
        );
      }
    });
  }

  public archiveAction(id) {
    this.oppService.getJavaGenericService().getData('archive/dependency/'.concat(id)).subscribe(archiveDependency => {
      const dataToSendToPoPUp = {
        isArchiving: true,
        archiveDependency: archiveDependency,
        source: 'opportunity',
        sourceId: id,
        textHeader: this.translate.instant(ContactConstants.ARCHIVE_OPPORTUNITY_TEXT)
      };
      this.showSidNav = false;
      this.showPopUpArchive(dataToSendToPoPUp, CrmConstant.ARCHIVING_TITLE);
    });
  }

  showPopUpArchive(dataToSendToPoPUp, titre) {
    this.formModalDialogService.openDialog(titre, ArchivePopupComponent, this.viewRef, this.getAllStatusFromData.bind(this),
      dataToSendToPoPUp, false, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  closeModal(e?: any) {
    const element: HTMLElement = document.getElementById('closeModal') as HTMLElement;
    element.click();
    this.dragOpp = false;
    this.initKanban();
  }

  ngOnChanges(simpleChange: SimpleChanges) {
    if (this.opportunityFilter.categoryId) {
      this.categoryId = this.opportunityFilter.categoryId;
      this.initKanban();
    }
  }

  detailUpdatedSucess(e) {
    this.initKanban();
  }

  getCurrencyCodeFromCategory() {
    if (!this.showTotalInKanban
      || this.genericCrmService.isNullOrUndefinedOrEmpty(this.opportunityFilter.data.categoryFromList.idCurrency)) {
      this.currencyCodeTotale = '';
    } else {
      const currencyTotale = this.listCurrency
        .find(currency => currency.Id === this.opportunityFilter.data.categoryFromList.idCurrency);
      this.currencyCodeTotale = currencyTotale.Code;
    }
  }

  initKanbanByFilter<T>(data: any, listProducts?: Array<any>) {
    this.getCurrencyCodeFromCategory();
    for (let i = 0; i < Object.keys(data.statusWithOpportunity).length; i++) {
      let totalByStatus = 0;
      data.statusWithOpportunity[Object.keys(data.statusWithOpportunity)[i]].forEach(opportunity => {
        // fill product list
        if (!this.genericCrmService.isNullOrUndefinedOrEmpty(opportunity.productIdList)) {
          opportunity.productIdList = opportunity.productIdList.map(item => {
            return item = {'Id': item, 'Descreption': listProducts.find(product => product.Id === item).Description};
          });
        }
        // fetch data from opportunity
        this.fillCardDataFromOpportunity(opportunity);
        // calculate the total of opportunity's estimatedIncome for each status
        opportunity.probabiltyOccurecnce = (opportunity.rating * NumberConstant.FIVE) / NumberConstant.ONE_HUNDRED;
        if (opportunity.currencyId === this.opportunityFilter.data.categoryFromList.idCurrency) {
          totalByStatus += opportunity.estimatedIncome;
        } else if (opportunity.currencyId) {
          totalByStatus += this.convertToCurrency(opportunity.currencyId,
            this.opportunityFilter.data.categoryFromList.idCurrency, opportunity.estimatedIncome);
        } else {
          if (this.defaultCurrancyId === this.opportunityFilter.data.categoryFromList.idCurrency) {
            totalByStatus += opportunity.estimatedIncome;
          } else if (this.defaultCurrancyId) {
            totalByStatus += this.convertToCurrency(this.defaultCurrancyId,
              this.opportunityFilter.data.categoryFromList.idCurrency, opportunity.estimatedIncome);
          }
        }
      });
      data.statusWithOpportunity[Object.keys(data.statusWithOpportunity)[i]].totalOpportunitesByStatus = totalByStatus;
    }
  }

  convertToCurrency(fromCurrencyId, toCurrencyId, estimatedIncome): number {
    const fromCurrency = this.currencyListConvert.find(currency => currency.Id === fromCurrencyId);
    const toCurrency = this.currencyListConvert.find(currency => currency.Id === toCurrencyId);
    return (estimatedIncome * fromCurrency.Precision) / toCurrency.Precision;

  }

  fillCardDataFromOpportunity(opportunity) {
    if (!this.genericCrmService.isNullOrUndefinedOrEmpty(opportunity.employeeId)) {
      const foundEmplyee = this.employee.find(employee => employee.Id === opportunity.employeeId);
      if (foundEmplyee && foundEmplyee.FullName) {
        opportunity.employeeFullName = foundEmplyee.FullName;
      }
    }
    if (!this.genericCrmService.isNullOrUndefinedOrEmpty(opportunity.responsableUserId)) {
      const foundResponsable = this.responsables.find(responsable => responsable.Id === opportunity.responsableUserId);
      if (foundResponsable && foundResponsable.FullName) {
        opportunity.responsableFullName = foundResponsable.FullName;
      }
    }
    if (this.genericCrmService.isNullOrUndefinedOrEmpty(opportunity.currencyId)) {
      opportunity.currencyFormat = '';
    } else {
      const currencyOpp = this.listCurrency.find(currency => currency.Id === opportunity.currencyId);
      this.setCurrency(currencyOpp, opportunity);
    }
  }

  private initKanbanByCategory() {

    this.setOpportunityDataFilter(this.opportunityFilter.data.typeDAffaireFromList, this.opportunityFilter.data.categoryFromList.title);

    this.defaultCategory = this.opportunityFilter.data.categoryFromList.title;
    this.objectives = true;
    this.filterG = 'OBJECTIVES';
    this.choosenFilterNumber = NumberConstant.TWO;

    this.selectedCategory = this.opportunityFilter.data.categoryFromList.title;

    this.setCategoryData(this.opportunityFilter.data.categoryFromList.title, this.opportunityFilter.data.categoryFromList.title,
      this.opportunityFilter.data.typeDAffaireFromList);

    this.getCategoriesByCategoryType(this.byTypeAffaireFilter);

    this.filterByCategory(this.opportunityFilter.data.categoryFromList, false);

    if (this.byTypeAffaireFilter === CrmConstant.STAFFING) {
      this.byEmployeeFilter = FilterTypesEnum['BY_EMPLOYEE'];
      this.idEmploy = undefined;
    } else if (this.byTypeAffaireFilter === CrmConstant.PRODUCT_SALE) {
      this.byArticleFilter = FilterTypesEnum['BY_ARTICLE'];
      this.productId = undefined;
    }
  }

  private initKanbanByEmployee() {

    this.setOpportunityDataFilter(this.opportunityFilter.data.typeDAffaireFromList,
      this.opportunityFilter.data.categoryFromList.title, undefined, this.opportunityFilter.data.employeeIdFromList);
    this.getEmployeeById(this.opportunityFilter.data.employeeIdFromList);

    this.setCategoryData(this.opportunityFilter.data.categoryFromList.title, this.opportunityFilter.data.categoryFromList.title,
      this.opportunityFilter.data.typeDAffaireFromList);

    this.objectives = true;
    this.concerned = true;
    this.filterG = 'OBJECTIVES';
    this.choosenFilterNumber = NumberConstant.TWO;
    this.idEmploy = this.opportunityFilter.data.employeeIdFromList;

    this.oppService.opportunitiesByEmplyeeAndCategory(this.opportunityFilter.data.employeeIdFromList,
      this.opportunityFilter.data.categoryFromList.id).subscribe(
      (data) => {
        data.orderedStatusPosition.sort(function (a, b) {
          return a.position.toString().localeCompare(b.position.toString());
        });
        this.allStatus = [];
        data.orderedStatusPosition.forEach(element => {
          this.allStatus.push(element.statusName);
        });


        this.categoryType = Object.keys(data.categoryUsersId).toString();
        this.initKanbanByFilter(data, this.listProduit);
        this.opportunitiesByStatusToShow = data.statusWithOpportunity;
        this.loadClientsDetails();
        this.statusColors = data.statusColors;
        this.positionMap = data.statusPosition;

        this.size = NumberConstant.NINETY / Object.keys(data.statusPosition).length;
      }
    );
    this.getOpportunitiesList();
  }

  private initKanbanBuOpportynity() {
    this.setOpportunityDataFilter(this.opportunityFilter.data.typeDAffaireFromList,
      this.opportunityFilter.data.categoryFromList.title, this.opportunityFilter.data.productIdFromList, undefined);
    this.productId = this.opportunityFilter.data.productIdFromList;

    this.setCategoryData(this.opportunityFilter.data.categoryFromList,
      this.opportunityFilter.data.categoryFromList.title, this.opportunityFilter.data.typeDAffaireFromList);
    this.getProductById(this.opportunityFilter.data.productIdFromList);
    this.objectives = true;
    this.concerned = true;
    this.choosenFilterNumber = NumberConstant.TWO;
    this.filterG = 'OBJECTIVES';

    this.oppService
      .opportunitiesByArticleAndCategory(this.opportunityFilter.data.productIdFromList, this.opportunityFilter.data.categoryFromList.id)
      .subscribe(
        (data) => {
          data.orderedStatusPosition.sort(function (a, b) {
            return a.position.toString().localeCompare(b.position.toString());
          });
          this.allStatus = [];
          data.orderedStatusPosition.forEach(element => {
            this.allStatus.push(element.statusName);
          });

          this.categoryType = Object.keys(data.categoryUsersId).toString();
          this.itemService.getItemsAfterFilter(data.categoryUsersId.PRODUCT_SALE).subscribe(product => {
            product.listData.forEach(p => this.listProduit.push(p));
            this.initKanbanByFilter(data, this.listProduit);
          });
          this.opportunitiesByStatusToShow = data.statusWithOpportunity;
          this.loadClientsDetails();
          this.statusColors = data.statusColors;
          this.positionMap = data.statusPosition;

          this.size = NumberConstant.NINETY / Object.keys(data.statusPosition).length;
        }
      );

  }

  /**
   * prepare the filter object swich the filter used (data passed from kanban)
   * @param typeDAffaireFromKanban
   * @param categoryFromKanban
   * @param productIdFromKanban
   * @param employeeIdFromKanban
   */
  setOpportunityDataFilter(typeDAffaireFromKanban: any, categoryFromKanban: any, productIdFromKanban?: any, employeeIdFromKanban?: any) {
    this.opportunityFilter.data.typeDAffaireFromKanban = typeDAffaireFromKanban;
    this.opportunityFilter.data.categoryFromKanban = categoryFromKanban;
    if (productIdFromKanban) {
      this.opportunityFilter.data.productIdFromKanban = productIdFromKanban;
    }
    if (employeeIdFromKanban) {
      this.opportunityFilter.data.employeeIdFromKanban = employeeIdFromKanban;
    }
  }

  /**
   * set the category data
   * @param selectedCategory
   * @param byCategoryFilter
   * @param byTypeAffaireFilter
   */
  setCategoryData(selectedCategory: any, byCategoryFilter: any, byTypeAffaireFilter: any) {
    this.selectedCategory = selectedCategory;
    this.byCategoryFilter = byCategoryFilter;
    this.byTypeAffaireFilter = byTypeAffaireFilter;
  }

  private initKanban() {
    this.showTotalInKanban = this.opportunityFilter.data.categoryFromList.withTotal;
    if ((this.opportunityFilter.data)) {
      // check category Filter and init Kanban by category
      if ((this.opportunityFilter.data.categoryFromList) && (!this.opportunityFilter.data.employeeIdFromList)
        && (!this.opportunityFilter.data.productIdFromList)) {
        this.initKanbanByCategory();
        // check employees Filter and init Kanban by employees
      } else if (this.opportunityFilter.data.employeeIdFromList) {
        this.initKanbanByEmployee();
        // check products Filter and init Kanban by products
      } else if (this.opportunityFilter.data.productIdFromList) {
        this.initKanbanBuOpportynity();
        // check No Filter Selected and init Kanban
      } else {
        this.getAllStatusFromData();
        this.oppService.oppSaved.pipe(debounceTime(NumberConstant.FIVE_HUNDRED)).subscribe(data => {
          this.getAllStatusFromData();
        });
      }
    }
  }

  checkFailureStep(order): boolean {
    const selectedStep = this.opportunityFilter.data.categoryFromList.pipeline.pipelineSteps
      .find(step => step.order === order);
    return (selectedStep.state === EnumValues.getNameFromValue(PipelineState, PipelineState.FAILURE_FINAL_STATE));
  }

  showPopUp(index) {
    this.dataToSendToPoPUp = {
      indexStatus: index,
      fromKanban: true,
      isSuccessStep: index === (this.allStatus.length - 1),
      ifFailureStep: this.checkFailureStep(index + 1),
      showChangeReason: index > 0,
      categoryId: this.categoryId,
      type: this.byTypeAffaireFilter,
      categoryElement: this.opportunityFilter.data.categoryFromList,
      closedPositionPipe: this.allStatus.length - 1
    };
    this.formModalDialogService.openDialog(
      'ADD_OPPORTUNITY', PopupAddOpporttunityComponent, this.viewRef, this.initKanban.bind(this),
      this.dataToSendToPoPUp, false, SharedConstant.MODAL_DIALOG_SIZE_ML);
  }

  getWidhtToDisplay() : string {
    const value = this.allStatus.length * 520;
    return value + 'px';
  }

  checkMediaQuery(): boolean {
    const realWidth = this.allStatus.length * 400;
    if ( window.innerWidth > realWidth) {
        return false;
    } else {
      return true;
    }
  }
}
