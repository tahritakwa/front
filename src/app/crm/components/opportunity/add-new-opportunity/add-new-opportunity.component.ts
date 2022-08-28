import {Component, OnInit} from '@angular/core';
import {OpportunityConstant} from '../../../../constant/crm/opportunityConstant';
import {ValidationService} from '../../../../shared/services/validation/validation.service';
import {TiersService} from '../../../../purchase/services/tiers/tiers.service';
import {Opportunity} from '../../../../models/crm/opportunity.model';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ContactCrmService} from '../../../services/contactCrmService/contact-crm.service';
import {OpportunityService} from '../../../services/opportunity.service';
import {CrmConstant} from '../../../../constant/crm/crm.constant';
import {OrganisationService} from '../../../services/organisation/organisation.service';
import {NumberConstant} from '../../../../constant/utility/number.constant';
import {CategoryService} from '../../../services/category/category.service';
import {Employee} from '../../../../models/payroll/employee.model';
import {ItemService} from '../../../../inventory/services/item/item.service';
import {ContactCrm} from '../../../../models/crm/contactCrm.model';
import {Item} from '../../../../models/inventory/item.model';
import {Router} from '@angular/router';
import {OrganisationConstant} from '../../../../constant/crm/organisation.constant';
import {GrowlService} from '../../../../../COM/Growl/growl.service';
import {TranslateService} from '@ngx-translate/core';
import {OpportunityFilterService} from '../../../services/opportunity-filter.service';
import {SwalWarring} from '../../../../shared/components/swal/swal-popup';
import {Observable} from 'rxjs/Observable';
import {SharedConstant} from '../../../../constant/shared/shared.constant';
import {DatePipe} from '@angular/common';
import {ExactDate} from '../../../../shared/helpers/exactDate';
import {PredicateFormat} from '../../../../shared/utils/predicate';
import {Organisation} from '../../../../models/crm/organisation.model';
import {OpportunityType} from '../../../../models/crm/enums/opportunityType.enum';
import {HttpCrmErrorCodes} from '../../../http-error-crm-codes';
import {GenericCrmService} from '../../../generic-crm.service';
import {PermissionService} from '../../../services/permission/permission.service';
import {EnumValues} from 'enum-values';
import {UserService} from '../../../../administration/services/user/user.service';

@Component({
  selector: 'app-add-new-opportunity',
  templateUrl: './add-new-opportunity.component.html',
  styleUrls: ['./add-new-opportunity.component.scss']
})
export class AddNewOpportunityComponent implements OnInit {
  public static TRANSLATE_CUSTOMER = 'CUSTOMER';
  opportunityFormGroup: FormGroup;
  private dataFromTeams;
  public teamsList = [];
  public formatDateT: string = this.translate.instant(SharedConstant.DATE_FORMAT);
  public listResponsiblesUsers: Array<Employee>;
  public disabledCategorie = true;
  public disabledEmployee = true;
  public minOpportunityEndDate: Date = new Date();
  public isUpdateMode: boolean;
  public selectedClient;
  public rating;
  public categoryData;
  public organizationsList = [];
  public searchedOrganizationsList = [];
  public selectedCategoryType: string;
  public categoryTypesList: Array<string> = [];
  public organisationContacts: Array<ContactCrm> = [];
  public searchedOrganisationContacts: Array<ContactCrm> = [];
  public categoryFiltredType: Array<string> = [];
  public categoryId: number;
  public showChangeReason = false;
  public employeesByCategory = [];
  public listP: Array<any> = [];
  public responsableByCategory: Employee[] = [];
  public contactByCategory = [];
  private productIdList: Array<any> = [];
  private canNavigate = true;
  public restartCateg = false;
  public restartEmployee = false;
  public restartResponsable = false;
  public categorie;
  public firstCollapseIsOpened = true;
  public secondeCollapseIsOpened = false;
  public thirdCollapseIsOpened = false;
  public initRequiredValidation = false;
  responsableSelected;
  editResponsable = false;
  public resetContract = false;
  public opportunityEndDateIsInvalid = false;
  public titleIsAlreadyTaken = false;
  public predicate: PredicateFormat;
  public prospectType = undefined;
  public STAFFING_TYPE = OpportunityConstant.TYPE_STAFFING;
  public PRODUCT_SALE_TYPE = OpportunityConstant.TYPE_PRODUCT_SALE;
  public opportunityRelatedPermissions: any;
  private opportunityEntityName = OpportunityConstant.OPPORTUNITY;
  public parentPermission = 'ADD_OPPORTUNITY';

  public opportunityTypes = [];
  public selectedOppType;

  public predicateOpportunity: PredicateFormat;

  public listUsers = [];
  public Users = [];
  public listUsersFilter = [];
  private connectedUser: any;

  /**
   * @param formBuilder
   * @param validationService
   * @param opportunityService
   * @param contactCrmService
   * @param router
   * @param growilService
   * @param translate
   * @param categoryService
   * @param tiersService
   * @param oppService
   * @param opportunityFilter
   * @param swallWarning
   * @param translateService
   * @param exactDate
   * @param datePipe
   * @param genericCrmService
   * @param genericCrmServices
   * @param organisationService
   * @param itemService
   * @param permissionService
   */
  constructor(private formBuilder: FormBuilder,
              private validationService: ValidationService,
              private opportunityService: OpportunityService,
              private contactCrmService: ContactCrmService,
              private router: Router,
              private growilService: GrowlService,
              private translate: TranslateService,
              private categoryService: CategoryService,
              private tiersService: TiersService,
              private oppService: OpportunityService,
              private opportunityFilter: OpportunityFilterService,
              private swallWarning: SwalWarring,
              private translateService: TranslateService,
              private exactDate: ExactDate,
              private datePipe: DatePipe,
              private genericCrmService: GenericCrmService,
              private organisationService: OrganisationService,
              private itemService: ItemService,
              private permissionService: PermissionService,
              private userService: UserService) {
    this.createAddOpporttunityForm();

  }


  ngOnInit() {
    this.selectedPermission();
    this.initTypesList();
    this.initResponsiblesDataSource();
    this.categoryService.getJavaGenericService().getEntityList()
      .subscribe(categoryData => {
        this.categoryData = categoryData;
        categoryData.forEach(categoryTypeList => {
          if (this.categoryTypesList.indexOf(categoryTypeList.categoryType) < NumberConstant.ZERO) {
            this.categoryTypesList.push(categoryTypeList.categoryType);
          }
        });
      });
    this.getOrganizationListProspectType();
    this.getTiersContactList();
    this.isUpdateMode = false;
    this.preparePredicate();
    this.getTiersListCustomerType();
  }

  private initTypesList() {
    this.opportunityTypes = EnumValues.getNames(OpportunityType).map((type: any) => {
      return type = {enumValue: type, enumText: this.translate.instant(type)};
    });
    this.selectedOppType = this.opportunityTypes[0];
  }

  public changeOpportunityType(type) {
    this.organizationsList = [];
    this.searchedOrganizationsList = [];
    if (type === OpportunityType.PROSPECT) {
      this.switchToProspectList();
    } else if (type === OpportunityType.CLIENT) {
      this.switchToClientList();
    } else {
      this.prospectType = undefined;
      this.getOrganizationListProspectType();
      this.getTiersListCustomerType();
    }
  }

  private getTiersContactList() {
    this.tiersService.getContactTiers().subscribe((data: any) => {
      data.listData.forEach(contact => {
        contact.name = `${contact.FirstName} ${contact.LastName}`;
        contact.id = contact.Id;
        this.contactByCategory.push(contact);
      });
    });
  }

  private getOrganizationListProspectType() {
    this.organisationService.getJavaGenericService().getEntityList('')
      .subscribe(data => {
          this.organizationsList = this.organizationsList.concat(data);
          this.searchedOrganizationsList = this.searchedOrganizationsList.concat(data);
        }
      );
  }

  private getTiersListCustomerType() {
    this.tiersService.processDataServerSide(this.predicate).subscribe(data => {
      data.data.forEach((client) => {
        const orgClient = this.convertClientToOrganisation(client);
        orgClient.isClient = true;
        this.organizationsList.push(orgClient);
        this.searchedOrganizationsList.push(orgClient);
      });
    });
  }

  convertClientToOrganisation(client): Organisation {
    return new Organisation(client.Id, client.Name, client.Email, client.Phone,
      client.Adress, client.Description, client.Fax1, client.Linkedin, client.Facebook, client.Twitter,
      this.translateService.instant(AddNewOpportunityComponent.TRANSLATE_CUSTOMER));
  }

  public switchToProspectList() {
    this.opportunityFormGroup.controls['organisationId'].setValue(null);
    this.opportunityFormGroup.controls['customerId'].setValue(null);
    this.prospectType = true;
    this.getOrganizationListProspectType();
  }

  public switchToClientList() {
    this.opportunityFormGroup.controls['organisationId'].setValue(null);
    this.opportunityFormGroup.controls['customerId'].setValue(null);
    this.prospectType = false;
    this.getTiersListCustomerType();
  }

  save() {
    this.initRequiredValidation = true;
    this.titleIsAlreadyTaken = false;
    if (this.opportunityFormGroup.valid && this.opportunityRelatedPermissions.permissionValidForm) {
      this.canNavigate = true;
      this.saveOpportunity();
      this.opportunityFilter.filterByOrganisation(undefined);
    } else {
      this.firstCollapseIsOpened = true;
      this.secondeCollapseIsOpened = true;
      this.thirdCollapseIsOpened = true;
      this.validationService.validateAllFormFields(this.opportunityFormGroup);
    }
  }

  /**
   * Create Bonus form
   * @param bonus
   */
  private createAddOpporttunityForm(opportunity?: Opportunity): void {
    this.opportunityFormGroup = this.formBuilder.group({
      title: [undefined, [Validators.required, Validators.maxLength(50)]],
      rating: [0],
      team: [''],
      employeesPermittedTo: [''],
      responsableUserId: [undefined, Validators.required],
      opportunityCreatedDate: [new Date(), Validators.required],
      opportunityEndDate: [undefined],
      estimatedIncome: [undefined, [Validators.min(0)]],
      IdCurrency: [undefined],
      employeeId: [undefined],
      productIdList: [undefined],
      customerId: [undefined],
      organisationId: [undefined, Validators.required],
      description: [undefined, Validators.maxLength(200)]
    });
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {

    return this.genericCrmService.handleCanDeactivateToLeaveCurrentComponent(this.isOpportunityFormChanged.bind(this));
  }

  changeEstimatedIncome(event) {
    if (this.opportunityFormGroup.controls['estimatedIncome'].value) {
      this.opportunityFormGroup.controls['IdCurrency'].setValidators([Validators.required]);
      this.opportunityFormGroup.controls['IdCurrency'].updateValueAndValidity();
    } else {
      this.opportunityFormGroup.controls['IdCurrency'].setValue(undefined);
      this.opportunityFormGroup.controls['IdCurrency'].setValidators(null);
      this.opportunityFormGroup.controls['IdCurrency'].updateValueAndValidity();
    }
  }

  public isOpportunityFormChanged(): boolean {
    for (const control in this.opportunityFormGroup.controls) {
      if (this.opportunityFormGroup.get(control).value != null && this.opportunityFormGroup.get(control).value !== ''
        && control !== 'opportunityCreatedDate' && control !== 'rating') {
        this.canNavigate = false;
        return (!this.canNavigate);
      }
    }
    return (!this.canNavigate);
  }

  receiveSupplier($event) {
    this.selectedClient = $event.selectedValue;
  }

  /**
   *  created Date getter
   */
  get opportunityCreatedDate(): FormControl {
    return this.opportunityFormGroup.get(OpportunityConstant.CRERATED_DATE) as FormControl;
  }

  /**
   *  End Date getter
   */
  get opportunityEndDate(): FormControl {
    return this.opportunityFormGroup.get(OpportunityConstant.ENDDATE) as FormControl;
  }

  private preparePredicate() {
    this.predicate = this.genericCrmService.preparePredicateForClientsList(this.predicate);
  }

  filterByCategoryList(event) {
    this.categorie = null;
    this.editResponsable = false;
    this.responsableSelected = null;
    this.listP = [];
    this.restartCateg = true;
    this.restartEmployee = true;
    this.restartResponsable = true;
    this.categoryFiltredType = [];
    this.employeesByCategory = [];
    this.productIdList = [];
    this.categoryFiltredType = [];
    this.categoryData.forEach(category => {
      if (category.categoryType === event) {
        this.categoryFiltredType.push(category.title);
      }
    });
    this.disabledCategorie = false;
    this.updateAddOpportunityFormGroupValadiation(event);
  }

  filterByCategory(event) {
    this.editResponsable = true;
    this.responsableSelected = null;
    this.listP = [];
    this.productIdList = [];
    this.restartCateg = false;
    this.restartEmployee = true;
    this.restartResponsable = true;
    this.getEmployeeIdFormControl().setValue('');
    this.categoryData.forEach(category => {
      if (category.title === event) {
        this.categoryId = category.id;
      }
    });
    this.oppService.getOpportunityConcernedAndResponsable(this.categoryId).subscribe(data => {
      if (data !== null) {

        if (data.productIds.length > 0) {
          this.itemService.getItemsAfterFilter(data.productIds).subscribe(product => {
            product.listData.forEach(p => this.listP.push(p));
            this.getResponsableList(data.responsableIds);
          });
        } else if (data.employeeIds.length > 0) {

          this.userService.getUsersListByArray(data.employeeIds).subscribe(_rsponse => {
            if (_rsponse != null) {
              this.employeesByCategory = _rsponse;
              this.getResponsableList(data.responsableIds);
            }
          });
        }
      }
    });
    this.disabledEmployee = false;
  }

  getResponsableList(responsableIds) {
    this.userService.getUsersListByArray(responsableIds).subscribe(_rsponse => {
      this.responsableByCategory = _rsponse;
    });
  }

  filterByOrganization(event) {
    if (event) {
      this.opportunityFormGroup.controls['customerId'].setValue(null);
      this.resetContract = true;
      this.organisationContacts = [];
      this.searchedOrganisationContacts = [];
      if (this.prospectType || !event.isClient) {
        this.prospectType = true;
        this.getContactsByProspectOrganizationId(event);
      } else {
        this.prospectType = false;
        this.getContactsByClientOrganizationId(event);
      }
    } else {
      this.opportunityFormGroup.controls['customerId'].setValue(null);
      this.organisationContacts = [];
      this.searchedOrganisationContacts = [];
    }

  }

  private getContactsByClientOrganizationId(event) {
    this.organisationContacts = [];
    this.searchedOrganisationContacts = [];
    this.organisationContacts = this.contactByCategory.filter(contact => contact.IdTiers === event.id);
    this.searchedOrganisationContacts = this.contactByCategory.filter(contact => contact.IdTiers === event.id);
  }

  private getContactsByProspectOrganizationId(event) {
    this.organisationContacts = [];
    this.searchedOrganisationContacts = [];
    this.contactCrmService.getJavaGenericService().getEntityById(event.id, CrmConstant.BY_ORGANISATION_URL)
      .subscribe((contact: ContactCrm[]) => {
        this.organisationContacts = contact;
        this.searchedOrganisationContacts = contact;
        this.organisationContacts.forEach((contactCrm) => {
          contactCrm.name = contactCrm.name.concat(' ').concat(contactCrm.lastName);
        });
      });
  }

  cancel() {
    this.router.navigateByUrl(OpportunityConstant.OPPORTUNITIES_LIST);
  }

  changeEndDate(event) {
    this.opportunityEndDateIsInvalid = (event < this.opportunityCreatedDate.value) ? true : false;
  }

  /**
   * here we treate the save
   */
  saveOpportunity() {
    const x = [];
    const valueToSend = this.opportunityFormGroup.value as Opportunity;
    this.productIdList.forEach((product: Item) => {
        x.push(product.Id);
      }
    );
    valueToSend.productIdList = this.productIdList;
    valueToSend.productIdList = x;
    valueToSend.categoryId = this.categoryId;
    valueToSend.idClientContact = (!this.prospectType) ? this.opportunityFormGroup.value.customerId : null;
    valueToSend.idClientOrganization = (!this.prospectType) ? this.opportunityFormGroup.value.organisationId.id : null;
    valueToSend.customerId = this.prospectType ? this.opportunityFormGroup.value.customerId : null;
    valueToSend.organisationId = this.prospectType ? this.opportunityFormGroup.value.organisationId.id : null;
    valueToSend.opportunityType = this.prospectType ? OpportunityType.PROSPECT : OpportunityType.CLIENT;
    valueToSend.opportunityEndDate = this.opportunityFormGroup.controls['opportunityEndDate'].value ?
      this.exactDate.getDateExact(this.opportunityFormGroup.controls['opportunityEndDate'].value) : null;
    this.organisationService.getJavaGenericService().getEntityById(valueToSend.organisationId).subscribe(
      (dataOrganisation) => {
        if (dataOrganisation) {
          valueToSend.currencyId = this.opportunityFormGroup.controls['IdCurrency'].value ?
            this.opportunityFormGroup.controls['IdCurrency'].value : dataOrganisation.currencyId;
          this.opportunityService.getJavaGenericService().checkTitleAndSaveOpportunity('save', valueToSend)
            .subscribe((resultat) => {
              const data = JSON.parse(resultat);
              if (data != null) {
                if (data.errorCode === HttpCrmErrorCodes.OPPORTUNITE_TITLE_ALL_READY_EXIST) {
                  this.titleIsAlreadyTaken = true;
                  this.opportunityFormGroup.controls[OpportunityConstant.TITLE].markAsPending();
                } else {
                  this.opportunityService.oppSaved.emit(true);
                  this.categoryFiltredType = [];
                  this.restartCateg = true;
                  this.opportunityFormGroup.reset();
                  this.permissionService.savePermission(this.opportunityRelatedPermissions, this.opportunityEntityName, data.id).subscribe(() => {
                    this.router.navigateByUrl(OpportunityConstant.LIST_OPPORTUNITIES_URL);
                    this.growilService.successNotification(this.translate.instant(OrganisationConstant.SUCCESS_OPERATION));
                  });
                }
              }
            });

        }
      });

  }

  /**
   * here we treate the update
   */
  updateOpportunity() {
    this.opportunityFormGroup.value.productIdList = this.productIdList;
    this.opportunityService.getJavaGenericService().updateEntity(this.opportunityFormGroup.value,
      this.opportunityFormGroup.value[OpportunityConstant.ID]).subscribe(data => {

    });
  }

  restartEmployeeTest() {
    this.restartEmployee = false;
  }

  restartResponsableTest() {
    this.restartResponsable = false;
  }


  public initResponsiblesDataSource() {
    this.predicateOpportunity = PredicateFormat.prepareEmptyPredicate();
    this.userService.processDataServerSide(this.predicateOpportunity).subscribe(data => {
      this.listResponsiblesUsers = data.data;
      this.listUsersFilter = data.data;
      this.filterUsers();
    }, () => {
    }, () => {
    });
  }

  filterUsers() {
    this.listUsersFilter = this.listUsersFilter.filter(responsable => responsable.FullName != null);
    this.removeDuplicateUsers();
    this.listResponsiblesUsers = this.listUsersFilter;
  }

  removeDuplicateUsers() {
    this.listUsersFilter = this.listUsersFilter.reduce((a, b) => {
      if (!a.find(data => data.Email === b.Email)) {
        a.push(b);
      }
      return a;
    }, []);
  }

  rewriteTitle() {
    this.titleIsAlreadyTaken = false;
  }

  getButtonReturnValue(): string {
    return this.translateService.instant(OpportunityConstant.BACK_TO_LIST);
  }

  private updateAddOpportunityFormGroupValadiation(event) {
    if (!this.genericCrmService.isNullOrUndefinedOrEmpty(event)) {
      if (event === this.PRODUCT_SALE_TYPE) {
        this.getEmployeeIdFormControl().clearValidators();
        this.getProductIdFormControl().clearValidators();
        this.getProductIdFormControl().setValidators([Validators.required]);
      } else if (event === this.STAFFING_TYPE) {
        this.getEmployeeIdFormControl().clearValidators();
        this.getProductIdFormControl().clearValidators();
        this.getEmployeeIdFormControl().setValidators([Validators.required]);
      }
      this.opportunityFormGroup.updateValueAndValidity();
    }
  }

  getProductIdFormControl() {
    return this.opportunityFormGroup.controls['productIdList'];
  }

  getEmployeeIdFormControl() {
    return this.opportunityFormGroup.controls['employeeId'];
  }

  selectedPermission() {
    this.permissionService.getResult().subscribe(data => {
      if (data && data.permission && (data.parent === this.parentPermission)) {
        this.opportunityRelatedPermissions = data.permission;
      }
    });
  }

  handleOrganizationFilter(organization) {
    this.searchedOrganizationsList = this.organizationsList.filter(organ => organ.name.toLowerCase()
      .indexOf(organization.toLowerCase()) !== -1);
  }

  handleContactsFilter(searchedContact) {
    if (this.prospectType) {
      this.searchedOrganisationContacts = this.organisationContacts.filter(contact => {
        return (contact.name.toLowerCase()
          .indexOf(searchedContact.toLowerCase()) !== -1 || contact.lastName.toLowerCase()
          .indexOf(searchedContact.toLowerCase()) !== -1);
      });
    } else {
      this.searchedOrganisationContacts = this.organisationContacts.filter(contact => {
        return (contact.name.toLowerCase()
          .indexOf(searchedContact.toLowerCase()) !== -1);
      });
    }
  }
}
