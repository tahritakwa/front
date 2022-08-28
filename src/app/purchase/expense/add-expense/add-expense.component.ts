import {Component, ComponentRef, OnInit} from '@angular/core';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ValidationService} from '../../../shared/services/validation/validation.service';
import {ExpenseService} from '../../services/expense/expense.service';
import {ExpenseConstant} from '../../../constant/purchase/expense.contant';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {Filter, Operation, PredicateFormat, Relation} from '../../../shared/utils/predicate';
import {Observable} from 'rxjs/Observable';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {ActivatedRoute, Router} from '@angular/router';
import {isNotNullOrUndefinedAndNotEmptyValue} from '../../../stark-permissions/utils/utils';
import {ItemConstant} from '../../../constant/inventory/item.constant';
import {StyleConfigService} from '../../../shared/services/styleConfig/style-config.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { ItemTiers } from '../../../models/inventory/item-tiers.model';


@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.scss']
})
export class AddExpenseComponent implements OnInit {

  public listUrl = ExpenseConstant.EXPENSE_LIST_URL;
  /**
   * attribute to use while verifying the route leave
   */
  private isSaveOperation = false;
  /**
   * to check if we add or edit a unit of measure
   */
  public isUpdateMode = false;
  /*
   * dialog subject
   */
  dialogOptions: Partial<IModalDialogOptions<any>>;
  public optionDialog: Partial<IModalDialogOptions<any>>;
  public selectedTax;

  expenseFormGroup: FormGroup;

  // predicate
  public predicate: PredicateFormat;
  selectedSupplier: number;
  selectedCurrency: number;
  public hasAddExpensePermission: boolean;
  public hasUpdateExpensePermission: boolean;
  /**
   * To contain the exepense data if we are in the update mode
   */
  private id: number;
  idItem = NumberConstant.ZERO;
  public placeholder = SharedConstant.CHOOSERECIPIENT;
  public selectedTiers = [];

  constructor(private expenseService: ExpenseService, private activatedRoute: ActivatedRoute,
              private fb: FormBuilder, private router: Router, private styleConfigService: StyleConfigService,
              private authService: AuthService,
              private validationService: ValidationService) {
  }

  ngOnInit() {
    this.hasAddExpensePermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.ADD_EXPENSE);
        this.hasUpdateExpensePermission =
        this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.UPDATE_EXPENSE);
    this.createFormGroup();
    this.checkModeAndCreateFormGroup();
  }

  /**
   * check if is an update mode or add mode
   */
  private checkModeAndCreateFormGroup() {
    this.activatedRoute.params.subscribe(params => {
      this.id = params[SharedConstant.ID_LOWERCASE] || 0;
      this.isUpdateMode = this.id > NumberConstant.ZERO;
    });
    if (this.isUpdateMode) {
      this.preparePredicate();
      this.expenseService.getModelByCondition(this.predicate).subscribe((data) => {
        this.expenseFormGroup.patchValue(data);
        if(data.ItemTiers){
          this.selectedTiers = data.ItemTiers;
        }else{
          this.selectedTiers = [];
        }
        this.selectedTax = data.IdTaxe;
        this.idItem = data.IdItem;
        if (!this.hasUpdateExpensePermission) {
          this.expenseFormGroup.disable();
        }
      });
    }
  }

  /**
   * Prepare Predicate
   */
  public preparePredicate(): void {
    this.predicate = new PredicateFormat();
    this.predicate.Relation = new Array<Relation>();
    if (isNotNullOrUndefinedAndNotEmptyValue(this.id)) {
      this.predicate.Filter = new Array<Filter>();
      this.predicate.Filter.push(new Filter('Id', Operation.eq, Number(this.id)));
    }
    this.predicate.Relation.push.apply(this.predicate.Relation,
      [new Relation(ExpenseConstant.ID_TAXE_NAVIGATION),
        new Relation(ExpenseConstant.ID_ITEM_NAVIGATION),
        new Relation(ExpenseConstant.ID_TIERS_NAVIGATION_FROM_ID_ITEM_NAVIGATION)]);
  }

  /**
   * Inialise Modal
   * @param reference
   * @param options
   */
  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.dialogOptions = options;
  }

  receiveTaxe($event) {
    this.selectedTax = $event;
  }


  private createFormGroup(expense?) {
    this.expenseFormGroup = this.fb.group({
      Id: [expense ? expense.Id : NumberConstant.ZERO],
      Code: [{value: expense ? expense.Code : '', disabled: true}],
      Description: [expense ? expense.Description : '', Validators.required],
      ListTiers:[(expense && expense.IdItemNavigation && expense.IdItemNavigation.ItemTiers) ?
        expense.IdItemNavigation.IdTiersNavigation.Id : undefined],
      IdTaxe: [expense ? expense.IdTaxe : '', Validators.required],
    });

  }

  public save() {
    if (this.expenseFormGroup.valid) {
      this.isSaveOperation = true;
      const expense = this.expenseFormGroup.getRawValue();
      expense.IdItem = this.idItem;
      expense.ItemTiers = this.selectedTiers;
      this.expenseService.save(expense, !this.isUpdateMode).subscribe(() => {
        this.router.navigateByUrl(this.listUrl);
      });
    } else {
      this.validationService.validateAllFormFields(this.expenseFormGroup);
    }
  }

  /**
   * this method will be called by CanDeactivateGuard service to check the leaving component possibility
   */
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.isSaveOperation) {
      this.isSaveOperation = false;
      return true;
    }
    return this.validationService.handleCanDeactivateToLeaveCurrentComponent(this.isFormGroupChanged.bind(this));
  }

  private isFormGroupChanged(): boolean {
    return this.expenseFormGroup.touched;
  }

  public isThereCodeToShowInHeader(): boolean {
    return this.isUpdateMode && this.expenseFormGroup.controls[ItemConstant.CODE_COLUMN].value;
  }

  getFooterClass() {
    return this.styleConfigService.getFooterClassSettingLayoutAddComponent();

  }
  public selectedValue($event) {
    const ListSuppliers = ($event);
    for (const tier of ListSuppliers) {
      if (!(this.selectedTiers.map(x => x.IdTiers).includes(tier.Id))) {
        let tierItem = new ItemTiers();
        tierItem.IdTiers = tier.Id;
        this.selectedTiers.push(tierItem);
      }
    }
    this.selectedTiers = this.selectedTiers.filter(x => ListSuppliers.map(y => y.Id).includes(x.IdTiers));
  }
}
