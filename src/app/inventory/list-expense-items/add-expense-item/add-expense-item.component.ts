import {Component, ComponentRef, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import {ValidationService} from '../../../shared/services/validation/validation.service';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {Filter, Operation, PredicateFormat, Relation} from '../../../shared/utils/predicate';
import {Expense} from '../../../models/purchase/expense.model';
import {ExpenseService} from '../../../purchase/services/expense/expense.service';
import {ExpenseConstant} from '../../../constant/purchase/expense.contant';
import {StyleConfigService} from '../../../shared/services/styleConfig/style-config.service';

const ACTIVE_LIST_URL = '/main/inventory/list-expense-items/';
@Component({
    selector: 'app-add-expense-item',
    templateUrl: './add-expense-item.component.html',
    styleUrls: ['./add-expense-item.component.scss']
})
export class AddExpenseItemComponent implements OnInit, OnDestroy {

    /**
     * Form Group
     */
    expenseItemFormGroup: FormGroup;


    /**
     * If modal=true
     */
    public isModal: boolean;


    /**
     * dialog subject
     */
    options: Partial<IModalDialogOptions<any>>;
    /**/

    /*
     * Id Entity
     */
    private id: number;

    /*
     * is updateMode
     */
    public isUpdateMode: boolean;

    private expenseItemSubscription: Subscription;

    /*
     * expenseItem to update
     */
    private expenseItemToUpdate: Expense;
    /*
   * id Subscription
   */
    private idSubscription: Subscription;
    public expenseItemSaved = false;
    public selectedVAT;
    // Selected supplier Id
    selectedSupplier: number;
    selectedCurrency: number;

    constructor(private fb: FormBuilder,
        private expenseItemService: ExpenseService,
        private modalService: ModalDialogInstanceService,
        private validationService: ValidationService,
        private activatedRoute: ActivatedRoute,
        private router: Router) {
        this.idSubscription = this.activatedRoute.params.subscribe(params => {
            this.id = +params['id'] || 0;
        });
    }

    ngOnInit() {
        this.createAddForm();
        this.isUpdateMode = this.id > 0 && !this.isModal;
        if (this.isUpdateMode) {
            this.getDataToUpdate();
        }
    }
    /**
       * create main form
       */
    private createAddForm(): void {
        this.expenseItemFormGroup = new FormGroup({
            Id: new FormControl(0),
            Code: new FormControl({ value: '', disabled: true }, Validators.required),
            Description: new FormControl('', Validators.required),
            IdTiers: new FormControl(undefined, Validators.required),
            IdTaxe: new FormControl(undefined, Validators.required),
            IdCurrency: new FormControl({ value: '', disabled: true }, Validators.required)
        });
    }

    private preparePredicate() {
        const predicate = new PredicateFormat();
        predicate.Filter = new Array<Filter>();
        predicate.Filter.push(new Filter(SharedConstant.ID, Operation.eq, this.id));
        predicate.Relation = new Array<Relation>();
        predicate.Relation.push.apply(predicate.Relation,
            [new Relation(ExpenseConstant.ID_CURRENCY_NAVIGATION),
            new Relation(ExpenseConstant.ID_TAXE_NAVIGATION),
            new Relation(ExpenseConstant.ID_ITEM_NAVIGATION),
            new Relation(ExpenseConstant.ID_TIERS_NAVIGATION_FROM_ID_ITEM_NAVIGATION)]);
        return predicate;
    }

    /**
    *  get data to update
    * */
    private getDataToUpdate(): void {

        this.expenseItemSubscription = this.expenseItemService.getModelByCondition(this.preparePredicate()).subscribe(data => {
            this.expenseItemToUpdate = data;

            if (this.expenseItemToUpdate) {
                this.expenseItemFormGroup.patchValue(this.expenseItemToUpdate);
                this.selectedVAT = this.expenseItemFormGroup.controls[ExpenseConstant.ID_TAXE].value;
                this.selectedCurrency = this.expenseItemToUpdate.IdCurrency;
                this.selectedSupplier = (this.expenseItemToUpdate.IdItemNavigation && this.expenseItemToUpdate.IdItemNavigation.IdTiersNavigation) ? this.expenseItemToUpdate.IdItemNavigation.IdTiersNavigation.Id : undefined;
                this.expenseItemFormGroup.controls[ExpenseConstant.ID_TIERS].setValue(this.selectedSupplier);
            }
        });
    }

    /**
    * mode modal init
    * @param reference
    * @param options
    */
    dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
        this.isModal = true;
        this.options = options;
    }
    receiveTaxe($event) {
        if($event){
        this.selectedVAT = $event.selectedValue;
        }
    }

    /**
   * change the currency Value when changing supplier value
   * @param $event
   */
    receiveSupplier($event) {
        this.selectedSupplier = $event.selectedValue;
        let selectedCurrencyId;
        if ($event.supplierFiltredDataSource && $event.itemForm && $event.itemForm.value[ExpenseConstant.ID_TIERS]) {
            const supplierValue = ($event.supplierFiltredDataSource.filter(c => c.Id === $event.itemForm.value[ExpenseConstant.ID_TIERS]));
            if (supplierValue && supplierValue.length > 0) {
                selectedCurrencyId = supplierValue[0].IdCurrency;
            }
        }
        if (!selectedCurrencyId) {
            selectedCurrencyId = this.selectedCurrency;
        }
        this.expenseItemFormGroup.controls[ExpenseConstant.ID_CURRENCY].setValue(selectedCurrencyId);
    }

    /**
    * Save click
    */
    public onAddExpenseItemClick(): void {


        if (this.expenseItemFormGroup.valid) {
            let expense: Expense;
            if (this.expenseItemToUpdate) {
                Object.assign(this.expenseItemToUpdate, this.expenseItemFormGroup.getRawValue());
                expense = this.expenseItemToUpdate;
            } else {
                expense = this.expenseItemFormGroup.getRawValue();
            }
            expense.IdSupplier = this.expenseItemFormGroup.controls[ExpenseConstant.ID_TIERS].value;
            if (!this.expenseItemSaved && !this.isUpdateMode) {
                this.expenseItemService.save(expense, !this.isUpdateMode).subscribe((data) => {
                    this.backToPrevious();
                    this.expenseItemSaved = true;
                });

            } else if (!this.expenseItemSaved && this.isUpdateMode) {
                if (this.expenseItemFormGroup.touched) {
                    this.expenseItemService.save(expense).subscribe(() => {
                        this.backToPrevious();
                    });
                }
            }
        } else {

            this.validationService.validateAllFormFields(this.expenseItemFormGroup);
        }
    }


    ngOnDestroy(): void {
        if (this.idSubscription) {
            this.idSubscription.unsubscribe();
        }
        if (this.expenseItemSubscription) {
            this.expenseItemSubscription.unsubscribe();
        }
    }
    backToPrevious() {
        if (!this.isModal) {
            this.router.navigate([ACTIVE_LIST_URL]);
        } else {
            this.options.onClose();
            this.modalService.closeAnyExistingModalDialog();
        }
    }


}
