import {Component, OnInit} from '@angular/core';
import {AccountingConfigurationConstant} from '../../../constant/accounting/accounting-configuration.constant';
import {ActivatedRoute} from '@angular/router';
import {AccountingConfigurationService} from '../../services/configuration/accounting-configuration.service';


@Component({
  selector: 'app-list-depreciation-assets',
  templateUrl: './list-depreciation-assets.component.html',
  styleUrls: ['./list-depreciation-assets.component.scss']
})
export class ListDepreciationAssetsComponent implements OnInit {

  public currentFiscalYear:any;
  public dotationAmortizationAccounts = [];
  constructor(private accountingConfigurationService: AccountingConfigurationService, private route: ActivatedRoute) {
    if (this.route.snapshot.data['currentFiscalYear']) {
      this.currentFiscalYear = this.route.snapshot.data['currentFiscalYear'];
    } else {
      this.accountingConfigurationService.getJavaGenericService().getEntityList(
        AccountingConfigurationConstant.CURRENT_FISCAL_YEAR_URL
      ).subscribe(data => {
        this.currentFiscalYear = data;
      });
    }
    this.dotationAmortizationAccounts = this.route.snapshot.data['amortizationAccounts'].dotationAmortizationAccounts;

  }

  ngOnInit() {

  }

}
