import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PagerSettings, SelectAllCheckboxState } from '@progress/kendo-angular-grid';
import { removeFilter } from '@progress/kendo-angular-grid/dist/es2015/filtering/base-filter-cell.component';
import { DataResult, State } from '@progress/kendo-data-query';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { BankAccountService } from '../../../administration/services/bank-account/bank-account.service';
import { CompanyService } from '../../../administration/services/company/company.service';
import { BankAccountConstant } from '../../../constant/Administration/bank-account.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { TreasuryConstant } from '../../../constant/treasury/treasury.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { Currency } from '../../../models/administration/currency.model';
import { PaymentMethodEnumerator } from '../../../models/enumerators/payment-method.enum';
import { PaymentSlipStatusEnumerator } from '../../../models/enumerators/payment-slip-status.enum';
import { PaymentStatusEnumerator } from '../../../models/enumerators/payment-status.enum';
import { TiersTypeEnumerator } from '../../../models/enumerators/tiers-type.enum';
import { PaymentSlip } from '../../../models/treasury/payment-slip.model';
import { DeadLineDocumentService } from '../../../sales/services/dead-line-document/dead-line-document.service';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { FileService } from '../../../shared/services/file/file-service.service';
import { LanguageService } from '../../../shared/services/language/language.service';
import { unique, ValidationService } from '../../../shared/services/validation/validation.service';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { Filter, Operation, OrderBy, OrderByDirection, PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { PaymentSlipService } from '../../services/payment-slip.service';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';


const DAYS_NUMBER_LEFT_FOR_COMMITMENT_DATE = NumberConstant.THREE;
@Component({
    selector: 'app-add-payment-slip',
    templateUrl: './add-payment-slip.component.html',
    styleUrls: ['./add-payment-slip.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AddPaymentSlipComponent implements OnInit {

    @Input() paymentMethod;
    isAllreadyValidate = false;
    paymentSlip: PaymentSlip = new PaymentSlip();
    userCurrency: Currency;
    totalAmount = 0;
    paymentStatus = PaymentStatusEnumerator;
    tiersTypeEnum = TiersTypeEnumerator;
    paymentMethodEnum = PaymentMethodEnumerator;
    searchByTiersString: string;
    searchByDateString: string;
    public paymentSlipStatusEnumerator = PaymentSlipStatusEnumerator;
    paymentSlipFormGroup: FormGroup;
    searchFormGroup: FormGroup;
    currentDateWithTime = new Date();
    currentDate = new Date(this.currentDateWithTime.getFullYear(), this.currentDateWithTime.getMonth(),
        this.currentDateWithTime.getDate(), 0, 0, 0);
    deadLineInTreeDays = new Date(this.currentDateWithTime.getFullYear(), this.currentDateWithTime.getMonth(),
        this.currentDateWithTime.getDate() + DAYS_NUMBER_LEFT_FOR_COMMITMENT_DATE, 0, 0, 0);
    datePipe = new DatePipe('en-US');
    // selection properties
    selectAllState: SelectAllCheckboxState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
    selectedItemsIds = [];
    selectableSettings = {
        checkboxOnly: true,
        mode: TreasuryConstant.MULTIPLE
    };
    public allSettlementsIds = [];
    language: string;
    public predicate: PredicateFormat;
    public predicateBank: PredicateFormat;
    pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
    isUpdateMode = false;
    state: number;
    id: number;
    isPaymentSlipStateProvisional = false;
    public gridState: State = {
        skip: 0,
        take: 20,
        // Initial filter descriptor
        filter: {
            logic: SharedConstant.LOGIC_AND,
            filters: []
        },
        sort: [
            {
                field: TreasuryConstant.COMMITMENT_DATE,
                dir: 'asc'
            }
        ],
        group: []
    };

    public columnsConfig: ColumnSettings[] = [
        {
            field: TreasuryConstant.CUSTOMER_NAME_FROM_ID_TIERS_NAVIGATION,
            title: TreasuryConstant.CLIENT,
            tooltip: TreasuryConstant.TIERS_NAME,
            filterable: true
        },
        {
            field: TreasuryConstant.ISSUING_BANK,
            title: TreasuryConstant.ISSUING_BANK_TITLE,
            tooltip: TreasuryConstant.ISSUING_BANK_TITLE,
            filterable: true
        },
        {
            field: TreasuryConstant.HOLDER,
            title: TreasuryConstant.HOLDER_TITLE,
            tooltip: TreasuryConstant.HOLDER_TITLE,
            filterable: true
        },
        {
            field: TreasuryConstant.SETTLEMENT_REFERENCE,
            title: TreasuryConstant.REFERENCE.toUpperCase(),
            tooltip: TreasuryConstant.EXTERNAL_REFERENCE_SETTLEMENT,
            filterable: true
        },
        {
            field: TreasuryConstant.COMMITMENT_DATE,
            title: TreasuryConstant.COMMITMENT_DATE_TITLE,
            tooltip: TreasuryConstant.COMMITMENT_DATE_TITLE,
            filterable: true
        },
        {
            field: TreasuryConstant.ID_PAYMENT_STATUS,
            title: TreasuryConstant.STATE.toUpperCase(),
            tooltip: TreasuryConstant.STATE.toUpperCase(),
            filterable: true
        },
        {
            field: TreasuryConstant.AMOUNT_WITH_CURRENCY,
            title: TreasuryConstant.AMOUNT,
            tooltip: TreasuryConstant.AMOUNT,
            filterable: true
        }
    ];

    public gridSettings: GridSettings = {
        state: this.gridState,
        columnsConfig: this.columnsConfig,
    };
    companyName: string;
    // Permissions
    public hasAddPaymentSlipPermission: boolean;
    public hasUpdatePaymentSlipPermission: boolean;
    public hasValidatePaymentSlipPermission: boolean;
    public hasPrintPaymentSlipPermission: boolean;
    public hasToIssuedPaymentSlipPermission: boolean;
    public hasInBankPaymentSlipPermission: boolean;



    formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);
    constructor(
        private settlementDeadLineService: DeadLineDocumentService,
        public bankAccountService: BankAccountService,
        public paymentSlipService: PaymentSlipService,
        private validationService: ValidationService,
        private translate: TranslateService,
        private fileService: FileService,
        private router: Router, private activatedRoute: ActivatedRoute,
        private fb: FormBuilder, private swalWarring: SwalWarring,
        private growService: GrowlService, private companyService: CompanyService,
        private localStorageService : LocalStorageService, private authService: AuthService) {
        this.language = this.localStorageService.getLanguage();
        this.activatedRoute.params.subscribe(params => {
            this.id = +params[SharedConstant.ID_LOWERCASE] || 0;
        });
        this.activatedRoute.params.subscribe(params => {
            this.state = +params[TreasuryConstant.STATE_LOWER_CASE] || 0;
        });
    }

    ngOnInit() {
        this.hasValidatePaymentSlipPermission = this.authService.hasAuthority(PermissionConstant.TreasuryPermissions.VALIDATION_TREASURY_BANK_SLIP);
        this.hasPrintPaymentSlipPermission = this.authService.hasAuthority(PermissionConstant.TreasuryPermissions.PRINT_TREASURY_BANK_SLIP);
        this.hasToIssuedPaymentSlipPermission = this.authService.hasAuthority(PermissionConstant.TreasuryPermissions.TO_ISSUED_TREASURY_BANK_SLIP);
        this.hasInBankPaymentSlipPermission = this.authService.hasAuthority(PermissionConstant.TreasuryPermissions.IN_BANK_TREASURY_BANK_SLIP);
        this.hasUpdatePaymentSlipPermission = this.authService.hasAuthority(PermissionConstant.TreasuryPermissions.UPDATE_TREASURY_BANK_SLIP);
        this.isUpdateMode = this.id > 0;
        this.isPaymentSlipStateProvisional = this.state === this.paymentSlipStatusEnumerator.Provisional;
        this.companyService.getCurrentCompany().subscribe(company => {
            this.userCurrency = company.IdCurrencyNavigation;
            this.companyName = company.Name;
        });
        this.createSearchForm();
        this.createAddForm();
        if (this.isUpdateMode) {
            this.syncInitGridInUpdateMode();
            if(!this.hasUpdatePaymentSlipPermission){
              this.disabledPaymentSlipFormGroup()
            }
        } else {
            this.initGridDataSource();
        }
    }

    disabledPaymentSlipFormGroup() {
    this.paymentSlipFormGroup.controls['Reference'].disable();
    this.paymentSlipFormGroup.controls['Deposer'].disable();
    this.paymentSlipFormGroup.controls['Date'].disable();
    this.paymentSlipFormGroup.controls['IdBankAccount'].disable();
    this.paymentSlipFormGroup.controls['IdBank'].disable();
    this.paymentSlipFormGroup.controls['Agency'].disable();

    }
    private createAddForm(paymentSlip?) {
        this.paymentSlipFormGroup = this.fb.group({
            Id: [paymentSlip ? paymentSlip.Id : 0],
            Reference: [
                paymentSlip ? paymentSlip.Reference : undefined,
                {
                    validators: [Validators.required],
                    asyncValidators: unique(TreasuryConstant.REFERENCE, this.paymentSlipService,
                        paymentSlip ? paymentSlip.Id : String(NumberConstant.ZERO))
                }],
            Deposer: [
                paymentSlip ? paymentSlip.Deposer : this.companyName
                ,
                [Validators.required]],
            Date: [
                paymentSlip ? new Date(paymentSlip.Date) : new Date(),
                [Validators.required]],
            IdBankAccount: [
                paymentSlip ? paymentSlip.IdBankAccount : undefined,
                [Validators.required]],
            IdBank: [
                {
                    value: paymentSlip && paymentSlip.IdBankAccountNavigation ?
                        paymentSlip.IdBankAccountNavigation.IdBank : undefined, disabled: true
                },
                [Validators.required]],
            Agency: [
                paymentSlip ? paymentSlip.Agency : undefined,
                [Validators.required]],
            TotalAmountWithNumbers: [this.isUpdateMode ? this.paymentSlip.TotalAmountWithNumbers : undefined],
            NumberOfSettlement: [paymentSlip ? paymentSlip.NumberOfSettlement : 0],
            Type: [this.paymentMethod]
        });

    }

    createSearchForm() {
        this.searchFormGroup = this.fb.group({
            IdPaymentStatus: []
        });
    }

    getDataToUpdate() {
        const predicateModel = new PredicateFormat();
        predicateModel.Filter = new Array<Filter>();
        predicateModel.Filter.push(new Filter(BankAccountConstant.ID, Operation.eq, this.id));
        predicateModel.Relation = new Array<Relation>();
        predicateModel.Relation.push(new Relation(BankAccountConstant.ID_BANK_ACCOUNT_NAVIGATION));
        predicateModel.Relation.push(new Relation(BankAccountConstant.SETTLEMENT));
        this.paymentSlipService.getModelByCondition(predicateModel).subscribe((dataPaySlip) => {
            this.paymentSlip = dataPaySlip;
            this.paymentSlip.Date = new Date(this.paymentSlip.Date);
            this.paymentSlipFormGroup.patchValue(this.paymentSlip);
            this.paymentSlipFormGroup.controls.IdBank.patchValue(this.paymentSlip.IdBankAccountNavigation.IdBank);
            this.selectedItemsIds = this.paymentSlip.Settlement.map(m => m.Id);
            if (this.paymentSlip && this.paymentSlip.State > this.paymentSlipStatusEnumerator.Provisional) {
                this.paymentSlipFormGroup.disable();
            } else {
                this.onSelectedKeysChange();
            }
        });
    }

    public initGridDataSource() {
        this.preparePredicate();
        this.settlementDeadLineService.getSettlementListToAddInPaymentSlip(this.gridSettings.state, this.predicate,
            this.isPaymentSlipStateProvisional, this.id)
            .subscribe(result => {
                result.Data.forEach((settlement) => {
                    settlement.CommitmentDate = new Date(settlement.CommitmentDate);
                });
                this.gridSettings.gridData = new Object() as DataResult;
                this.gridSettings.gridData.data = result.Data;
                this.gridSettings.gridData.total = result.Total;
                this.totalAmount = result.TotalAmount;
                this.allSettlementsIds = result.AllSettlementIds;
                const verifySelectedIds = this.selectedItemsIds.filter((x) => this.allSettlementsIds.includes(x));
                this.selectedItemsIds = verifySelectedIds;
                this.onSelectedKeysChange();
            });
    }

    // Initialise data grid and check all settlements
    private syncInitGridInUpdateMode() {
        this.preparePredicate();
        this.settlementDeadLineService.getSettlementListToAddInPaymentSlip(this.gridSettings.state, this.predicate,
            this.isPaymentSlipStateProvisional, this.id)
            .subscribe(result => {
                result.Data.forEach((settlement) => {
                    settlement.CommitmentDate = new Date(settlement.CommitmentDate);
                });
                this.gridSettings.gridData = new Object() as DataResult;
                this.gridSettings.gridData.data = result.Data;
                this.gridSettings.gridData.total = result.Total;
                this.totalAmount = result.TotalAmount;
                this.allSettlementsIds = result.AllSettlementIds;
                this.getDataToUpdate();
            });
    }

    public preparePredicate(): void {
        this.predicate = new PredicateFormat();
        this.predicate.Filter = new Array<Filter>();
        if (this.isUpdateMode && (this.state !== this.paymentSlipStatusEnumerator.Provisional)) {
            this.predicate.Filter.push(new Filter(TreasuryConstant.ID_PAYMENT_SLIP, Operation.eq, this.id));
        } else {
            this.predicate.Filter.push(new Filter(TreasuryConstant.CODE_FROM_ID_PAYMENT_METHOD, Operation.eq, this.paymentMethod));
            this.predicate.Filter.push(new Filter(TreasuryConstant.ID_PAYMENT_STATUS, Operation.eq, this.paymentStatus.Settled));
            this.predicate.Filter.push(new Filter(TreasuryConstant.ID_TIERS_NAVIGATION_TO_ID_TYPE_TIERS, Operation.eq, NumberConstant.ONE));
        }

        if (this.searchByTiersString) {
            this.predicate.Filter.push(
                new Filter(TreasuryConstant.ID_TIERS, Operation.eq, this.searchByTiersString));
        }

        if (this.searchByDateString) {
            this.predicate.Filter.push(
                new Filter(TreasuryConstant.COMMITMENT_DATE, Operation.eq, this.searchByDateString));
        }
    }

    receiveTierStatus($event) {
        if ($event && $event.selectedTiers) {
            this.searchByTiersString = $event.selectedTiers.Id;
        } else {
            this.searchByTiersString = null;
        }
    }

    receiveDateStatus($event) {
        if ($event) {
            this.searchByDateString = $event;
        } else {
            this.searchByDateString = null;
        }
    }

    filter() {
        this.gridSettings.state.skip = NumberConstant.ZERO;
        this.gridSettings.state.take = NumberConstant.TWENTY;
        this.initGridDataSource();
    }

    public onSelectedKeysChange() {
        if (this.selectedItemsIds.length === 0) {
            this.selectAllState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
        } else if (this.selectedItemsIds.length > 0 && this.selectedItemsIds.length < this.allSettlementsIds.length) {
            this.selectAllState = SharedConstant.INDETERMINATE as SelectAllCheckboxState;
        } else {
            this.selectAllState = SharedConstant.CHECKED as SelectAllCheckboxState;
        }
    }

    public onPrintJasperClick() {
        if (this.selectedItemsIds.length > 0 || this.isUpdateMode) {
            const params = {
                idPaymentSlip: this.id
            };
            let reportName = '';
            if (this.paymentMethod === this.paymentMethodEnum.BankCheck) {
                reportName = TreasuryConstant.PAYMENT_SLIP_REPORT_NAME;
            } else {
                reportName = TreasuryConstant.DRAFT_REPORT_NAME;
            }
            const documentName = this.translate.instant(TreasuryConstant.REMITTANCESLIP)
                .concat(SharedConstant.UNDERSCORE).concat(this.paymentSlip.Reference)
                .concat(SharedConstant.UNDERSCORE).concat(this.translate.instant(
                    this.datePipe.transform(new Date(), 'MMMM').toUpperCase()))
                .concat(SharedConstant.UNDERSCORE).concat(this.datePipe.transform(new Date(), 'yyyy'));
            const dataToSend = {
                'reportName': reportName,
                'documentName': documentName,
                'reportFormatName': 'pdf',
                'printCopies': 1,
                'PrintType': -1,
                'reportparameters': params
            };
            this.paymentSlipService.downloadJasperReport(dataToSend).subscribe(
                res => {
                    this.fileService.downLoadFile(res.objectData);
                }
            );
        } else {
            this.growService.warningNotification(this.translate.instant(BankAccountConstant.NO_SETTLEMENT_SELLECTED_ALERT_INFO));
        }
    }

    public onSelectAllChange(checkedState: SelectAllCheckboxState) {
        if (checkedState === SharedConstant.CHECKED as SelectAllCheckboxState) {
            this.selectAllState = SharedConstant.CHECKED as SelectAllCheckboxState;
            this.selectedItemsIds = Object.assign([], this.allSettlementsIds);
        } else {
            this.selectAllState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
            this.selectedItemsIds = [];
        }
    }

    public dataStateChange(state: State): void {
        this.gridSettings.state = state;
        this.initGridDataSource();
    }

    paymentMethodFilterChange($event) {
        removeFilter(this.gridSettings.state.filter, TreasuryConstant.ID_PAYMENT_STATUS);
        if ($event) {
            this.gridSettings.state.filter.filters.push({ field: TreasuryConstant.ID_PAYMENT_STATUS, operator: 'eq', value: $event });
        }
        this.initGridDataSource();
    }

    public goBackToList(): void {
        if (this.paymentMethod === this.paymentMethodEnum.BankCheck) {
            this.router.navigateByUrl(TreasuryConstant.LIST_PAYMENT_SLIP_PATH);
        } else {
            this.router.navigateByUrl(TreasuryConstant.LIST_PAYMENT_SLIP_PATH.concat('/').concat(NumberConstant.ONE.toString()));
        }
    }

    public cancel(): void {
        this.goBackToList();
    }

    public save(): void {
        if (this.paymentSlipFormGroup.valid) {
            if (this.selectedItemsIds.length > 0) {
                this.paymentSlip = this.paymentSlipFormGroup.getRawValue();
                this.paymentSlipService.addPaymentSlip(this.paymentSlip, this.selectedItemsIds).subscribe(() => {
                    this.goBackToList();
                });
            } else {
                this.growService.warningNotification(this.translate.instant(BankAccountConstant.NO_SETTLEMENT_SELLECTED_ALERT_INFO));
            }
        } else {
            this.validationService.validateAllFormFields(this.paymentSlipFormGroup);
        }
    }

    public validate(state: number): void {
        if (this.paymentSlipFormGroup.disabled || this.paymentSlipFormGroup.valid) {
            if (this.selectedItemsIds.length > 0) {
                Object.assign(this.paymentSlip, this.paymentSlipFormGroup.getRawValue());
                this.paymentSlip.State = state;
                this.paymentSlipService.validatePaymentSlip(this.paymentSlip, this.selectedItemsIds).subscribe(() => {
                    this.goBackToList();
                });
            } else {
                this.growService.warningNotification(this.translate.instant(BankAccountConstant.NO_SETTLEMENT_SELLECTED_ALERT_INFO));
            }
        } else {
            this.validationService.validateAllFormFields(this.paymentSlipFormGroup);
        }
    }

    bankAccountValueChange($event) {
        if ($event) {
            this.paymentSlipFormGroup.controls.Agency.setValue($event.Agency);
            this.paymentSlipFormGroup.controls.IdBank.setValue($event.IdBank);
        } else {
            this.paymentSlipFormGroup.controls.Agency.setValue('');
            this.paymentSlipFormGroup.controls.IdBank.setValue('');
        }
    }
}
