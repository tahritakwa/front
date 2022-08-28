import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ChartOfAccountsConstant} from '../../../constant/accounting/chart-of-account.constant';
import {ActivatedRoute} from '@angular/router';
import {ChartAccountService} from '../../../accounting/services/chart-of-accounts/chart-of-account.service';
import {GenericAccountingService} from '../../../accounting/services/generic-accounting.service';
import {ComboBoxComponent} from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-parent-plan-acc',
  templateUrl: './parent-plan-acc.component.html',
  styleUrls: ['./parent-plan-acc.component.scss']
})
export class ParentPlanAccComponent implements OnInit {
  @ViewChild(ComboBoxComponent) public parentPlan: ComboBoxComponent;
  public chartOfAccountFiltredList: any;
  public chartAccountsList: any;
  @Input() group;
  @Output() selectedValue = new EventEmitter<boolean>();
  public accountParent: any;

  constructor(private activatedRoute: ActivatedRoute,
              private chartOfAccountService: ChartAccountService,
              private genericAccountingService: GenericAccountingService) {
    if (this.activatedRoute.snapshot.data['chartsAccounts']) {
      this.chartOfAccountFiltredList = this.activatedRoute.snapshot.data['chartsAccounts'];
      this.chartAccountsList = this.chartOfAccountFiltredList.slice();
    } else {
      this.chartOfAccountService.getJavaGenericService().getEntityList(ChartOfAccountsConstant.GET_ALL_CHARTS)
        .subscribe(data => {
          this.chartOfAccountFiltredList = data;
          this.chartAccountsList = this.chartOfAccountFiltredList.slice();
        });
    }
  }

  /**
   * Search accounting plan selected by label
   */
  handleFilterChartOfAccount(value): void {
    if (this.genericAccountingService.isNullAndUndefinedAndEmpty(value)) {
      this.chartOfAccountFiltredList = this.chartAccountsList;
    } else {
      this.chartOfAccountFiltredList = this.genericAccountingService.
      getChartOfAccountFilteredListByWrittenValue(value, this.chartAccountsList);
    }
  }
  onSelect($event) {
    this.selectedValue.emit($event);
  }
  ngOnInit() {
  }

}
