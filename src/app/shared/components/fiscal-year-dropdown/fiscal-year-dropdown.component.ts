import {Component, EventEmitter, Input, OnInit, Output, ViewContainerRef} from '@angular/core';
import {FiscalYear} from '../../../models/accounting/fiscal-year.model';
import {FormGroup} from '@angular/forms';
import {FiscalYearService} from '../../../accounting/services/fiscal-year/fiscal-year.service';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {FiscalYearConstant} from '../../../constant/accounting/fiscal-year.constant';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {FormModalDialogService} from '../../services/dialog/form-modal-dialog/form-modal-dialog.service';
import {AddFiscalYearComponent} from '../../../accounting/fiscal-year/add-fiscal-year/add-fiscal-year.component';
import {TranslateService} from '@ngx-translate/core';
import {SharedAccountingConstant} from '../../../constant/accounting/sharedAccounting.constant';
import {DatePipe} from '@angular/common';
import {GenericAccountingService} from '../../../accounting/services/generic-accounting.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';

@Component({
  selector: 'app-fiscal-year-dropdown',
  templateUrl: './fiscal-year-dropdown.component.html',
  styleUrls: ['./fiscal-year-dropdown.component.scss']
})
export class FiscalYearDropdownComponent implements OnInit {

  @Input() fiscalYearsDataSource: any;
  public fiscalYearsFilteredDataSource: FiscalYear[];
  public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);
  public AccountingPermissions = PermissionConstant.SettingsAccountingPermissions;
  @Input() group: FormGroup;
  @Input() selectedValue;
  @Input() allowCustom;
  @Input() form: string;
  @Input() comingFromModal: boolean;
  @Input() closeFiscalYearStartDate: string;
  @Output() Selected = new EventEmitter<boolean>();

  constructor(private fiscalYearService: FiscalYearService, private formModalDialogService: FormModalDialogService,
              private viewRef: ViewContainerRef, private translate: TranslateService, private datePipe: DatePipe,
              public authService: AuthService
  ) {}

  ngOnInit() {
    if(this.fiscalYearsDataSource) {
      this.fiscalYearsFilteredDataSource = this.fiscalYearsDataSource.slice(NumberConstant.ZERO);
      return;
    }
    if (this.closeFiscalYearStartDate) {
      this.initFiscalYearAfterCurrentFiscalYearDataSource();
    } else {
      this.initFiscalYearsDataSource();
    }
  }

  initFiscalYearsDataSource(): void {
    if (this.form === 'closedFiscalYears') {
      this.getDataSourceWithClosedFiscalYears().then((data: any) => {
        this.fiscalYearsDataSource = data;
        this.fiscalYearsFilteredDataSource = data.slice(NumberConstant.ZERO);
      });
    } else if (this.form === 'targetFiscalYearId') {
      this.getDataSourceWithTargetFiscalYears().then((data: any) => {
        this.fiscalYearsDataSource = data;
        this.fiscalYearsFilteredDataSource = data.slice(NumberConstant.ZERO);
      });
    } else {
      this.getDataSourceWithAllFiscalYears().then((data: any) => {
        this.fiscalYearsDataSource = data;
        this.fiscalYearsFilteredDataSource = data.slice(NumberConstant.ZERO);
      });
    }
  }

  getDataSourceWithClosedFiscalYears() {
    return new Promise(resolve => {
      this.fiscalYearService.getJavaGenericService().getEntityList(FiscalYearConstant.FIND_CLOSED_METHOD_URL)
        .subscribe((data) => {
          resolve(data);
        });
    });
  }

  getDataSourceWithAllFiscalYears() {
    return new Promise(resolve => {
      this.fiscalYearService.getJavaGenericService().getEntityList(FiscalYearConstant.FIND_ALL_METHOD_URL)
        .subscribe((data) => {
          resolve(data);
        });
    });
  }

  handleAddNewElementToFiscalYearsDropdown() {
    if (this.form === 'closedFiscalYears') {
      this.getDataSourceWithClosedFiscalYears().then((data: any) => {
        this.fiscalYearsDataSource = data;
        this.fiscalYearsFilteredDataSource = data.slice(NumberConstant.ZERO);
      });
    } else if (this.form === 'targetFiscalYearId') {
      this.getDataSourceWithTargetFiscalYears().then((data: any) => {
        this.fiscalYearsDataSource = data;
        this.fiscalYearsFilteredDataSource = data.slice(NumberConstant.ZERO);
        this.group.controls['targetFiscalYearId'].setValue(data[0].id);
      });
    } else {
      this.getDataSourceWithAllFiscalYears().then((data: any) => {
        this.fiscalYearsDataSource = data;
        this.fiscalYearsFilteredDataSource = data.slice(NumberConstant.ZERO);
        this.group.controls['fiscalYearId'].setValue(data[0].id);
      });
    }
  }

  getDataSourceWithTargetFiscalYears() {
    return new Promise(resolve => {
      this.fiscalYearService.getJavaGenericService().getEntityList(FiscalYearConstant.FISCAL_YEAR_OPENING_TARGETS)
        .subscribe((data) => {
          resolve(data);
        });
    });
  }
  handleFilterFiscalYears(value: string): void {
    this.fiscalYearsFilteredDataSource = this.fiscalYearsDataSource.filter((s) =>
      s.name.toLowerCase().includes(value.toLowerCase()));
  }

  addNewFiscalYears(): void {
    const modalTitle = this.translate.instant(FiscalYearConstant.ADD_NEW_FISCAL_YEAR);
    this.formModalDialogService.openDialog(modalTitle, AddFiscalYearComponent, this.viewRef, this.handleAddNewElementToFiscalYearsDropdown.bind(this)
      , null, null, SharedConstant.MODAL_DIALOG_SIZE_L);
  }

  public onSelect($event): void {
    this.Selected.emit($event);
  }

  initFiscalYearAfterCurrentFiscalYearDataSource() {
     this.fiscalYearService.getJavaGenericService().getEntityList(FiscalYearConstant.ALL_FISCAL_YEARS_AFTER_CURRENT_FISCAL_YEAR
      + `?${FiscalYearConstant.CURRENT_FISCAL_YEAR_START_DATE}=${this.datePipe.transform(this.closeFiscalYearStartDate,
        SharedAccountingConstant.YYYY_MM_DD_HH_MM_SS)}`)
      .subscribe(data => {
         this.fiscalYearsFilteredDataSource = data;
      });
  }
}
