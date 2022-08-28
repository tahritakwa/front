import { Component, OnInit } from '@angular/core';
import { DataSourceRequestState, State } from '@progress/kendo-data-query';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { TranslateService } from '@ngx-translate/core';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { TemplateAccountingConstant } from '../../../constant/accounting/template.constant';
import { TemplateAccountingService } from '../../services/template/template.service';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { SharedAccountingConstant } from '../../../constant/accounting/sharedAccounting.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { GenericAccountingService } from '../../services/generic-accounting.service';
import { AccountsConstant } from '../../../constant/accounting/account.constant';
import { Filter } from '../../../models/accounting/Filter';
import {StarkRolesService} from '../../../stark-permissions/service/roles.service';
import { RoleConfigConstant } from '../../../Structure/_roleConfigConstant';
import { PermissionConstant } from '../../../Structure/permission-constant';
import {AuthService} from '../../../login/Authentification/services/auth.service';


@Component({
  selector: 'app-list-template-accounting',
  templateUrl: './template-accounting-list.component.html',
  styleUrls: ['./template-accounting-list.component.scss']
})
export class TemplateAccountingListComponent implements OnInit {
  /**
   * size of pagination => 10 items per page
   */
  private pageSize = NumberConstant.TWENTY;
  /**
   * currentPage number
   */
  private currentPage = NumberConstant.ZERO;

  public gridState: DataSourceRequestState = {
    skip: NumberConstant.ZERO,
    take: this.pageSize,
    filter: { // Initial filter descriptor
      logic: 'and',
      filters: []
    }
  };
  // Grid quick add
  public formGroup: FormGroup;
  public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);

  // message event
  // Edited Row index
  private editedRowIndex: number;

  public sortParams = '';
  /**
   * Grid columns
   */
  public selectedJournalInFilter: any;
  public journalFiltredList = [];

  public filters = new Array<Filter>();

  public columnsConfig: ColumnSettings[] = [
    {
      field: TemplateAccountingConstant.LABEL_FIELD,
      title: TemplateAccountingConstant.LABEL_TITLE,
      tooltip: TemplateAccountingConstant.LABEL_TITLE,
      filterable: true
    },
    {
      field: TemplateAccountingConstant.JOURNAL,
      title: TemplateAccountingConstant.JOURNAL_TITLE,
      tooltip: TemplateAccountingConstant.JOURNAL_TITLE,
      filterable: true,

    }
  ];
  // Grid settings
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };

  // pager settings
  pagerSettings: PagerSettings = {
    buttonCount: NumberConstant.FIVE,
    info: true,
    type: 'numeric',
    pageSizes: [NumberConstant.TEN, NumberConstant.TWENTY, NumberConstant.FIFTY, NumberConstant.ONE_HUNDRED],
    previousNext: true
  };
  public AccountingPermissions = PermissionConstant.SettingsAccountingPermissions;

  titleBtnGrid = TemplateAccountingConstant.NEW_TEMPLATE_ACCOUNTING;
  labelTemplate = SharedConstant.EMPTY;
  constructor(private templateAccountingService: TemplateAccountingService, private swalWarrings: SwalWarring,
    private router: Router, private fb: FormBuilder, private activatedRoute: ActivatedRoute,
    private genericAccountingService: GenericAccountingService, private starkRolesService: StarkRolesService,
    private growlService: GrowlService, private translate: TranslateService, private authService : AuthService) {
  }

  /**
   * ng init
   */
  ngOnInit() {
    if (this.authService.hasAuthority(this.AccountingPermissions.VIEW_ACCOUNTING_TEMPLATE)) {
      if (this.authService.hasAuthority(this.AccountingPermissions.VIEW_JOURNALS)) {
        this.initJournalFilteredList();
      }
      this.initGridDataSource();
    }
  }

  initJournalFilteredList() {
    this.genericAccountingService.getJournalList().then((journalList: any) => {
      this.journalFiltredList = journalList.slice(0);
    });
  }

  handleFilterJournal(writtenValue) {
    this.journalFiltredList = this.genericAccountingService.getJournalFilteredListByWrittenValue(writtenValue);
  }

  initGridDataSource() {
    if (this.selectedJournalInFilter) {
      this.filters.push(new Filter(SharedAccountingConstant.FILTER_TYPES.DROP_DOWN_LIST, SharedAccountingConstant.FILTER_OPERATORS.EQUAL,
        SharedAccountingConstant.FILTER_DROP_DOWN_BY.JOURNAL, this.selectedJournalInFilter.id.toString()));
    }
    this.templateAccountingService.getJavaGenericService().sendData(
      SharedAccountingConstant.FILTER_APIS.GET_TEMPLATE_ACCOUNTING_LIST + `?page=${this.currentPage}&size=${this.pageSize}${this.sortParams}`
      , this.filters
    )
      .subscribe(data => {
        this.gridSettings.gridData = { data: data.listTemplateDto, total: data.total };
      });
  }

  /**
   * Quick edit
   * @param param0
   */
  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    this.formGroup = this.fb.group({
      id: [dataItem.id],
      label: [dataItem.label, Validators.required],
      journalId: [dataItem.codeDocument, Validators.required],
      documentDebitAmount: [dataItem.documentDebitAmount, Validators.required],
      documentCreditAmount: [dataItem.documentCreditAmount, Validators.required],
      newspaper: [Validators.required]
    });

    this.editedRowIndex = rowIndex;

    sender.editRow(rowIndex, this.formGroup);
  }

  /**
   * Cancel
   * @param param0
   */
  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  /**
   * Remove handler
   * @param param0
   */
  public removeHandler( dataItem ) {
    const swalWarningMessage = `${this.translate.instant(AccountsConstant.ACCOUNTING_SWAL_TEXT)}`;
    this.swalWarrings.CreateSwal(swalWarningMessage, AccountsConstant.ARE_YOU_SURE).then((result) => {
      if (result.value) {
        this.templateAccountingService.getJavaGenericService().deleteEntity(dataItem.id)
          .subscribe(() => {
            this.growlService.successNotification(this.translate.instant(SharedAccountingConstant.SUCCESS_OPERATION));
            this.initGridDataSource();
          },
            err => {
              this.growlService.ErrorNotification(this.translate.instant(SharedAccountingConstant.FAILURE_OPERATION));
            });
      }
    });
  }

  /**
   * Close editor
   * @param grid
   * @param rowIndex
   */
  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    if (rowIndex !== undefined) {
      grid.closeRow(rowIndex);
      this.editedRowIndex = undefined;
      this.formGroup = undefined;
    }
  }

  public isThereAtLeastOneFieldInFilter(): boolean {
    return this.filters.length > 0;
  }

  public goToAdvancedEdit(dataItem) {
    if (this.isThereAtLeastOneFieldInFilter()) {
      const url = this.router.serializeUrl(this.router.createUrlTree([TemplateAccountingConstant.TEMPLATE_EDIT_URL.concat(dataItem.id)], { queryParams: { id: null } }));
      window.open(url, '_blank');
    } else {
      this.router.navigateByUrl(TemplateAccountingConstant.TEMPLATE_EDIT_URL.concat(dataItem.id));
    }
  }

  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    this.currentPage = (state.skip) / this.pageSize;
    this.pageSize = state.take;
    this.sortParams = this.genericAccountingService.getSortParams(state.sort);
  }

  public resetToFirstPage() {
    this.currentPage = 0;
    this.gridSettings.state.skip = this.currentPage;
  }

  public journalValueChange() {
    this.resetToFirstPage();
    this.initGridDataSource();
  }

  public onPageChange() {
    this.initGridDataSource();
  }

  public filterChange() {
    this.initGridDataSource();
  }

  public sortChange() {
    this.resetToFirstPage();
    this.initGridDataSource();
  }
  public filter() {
    this.filters = new Array<Filter>();
    this.filters.push(new Filter(SharedAccountingConstant.FILTER_TYPES.STRING, SharedAccountingConstant.FILTER_OPERATORS.CONTAINS,
      TemplateAccountingConstant.LABEL_FIELD, this.labelTemplate));
    this.initGridDataSource();
  }
}
