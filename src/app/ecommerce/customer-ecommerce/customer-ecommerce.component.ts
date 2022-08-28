import { Component, OnInit, ViewChild } from '@angular/core';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { DataStateChangeEvent, PagerSettings } from '@progress/kendo-angular-grid';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ReportingInUrlComponent } from '../../shared/components/reports/reporting-in-url/reporting-in-url.component';
import { NumberConstant } from '../../constant/utility/number.constant';
import { PredicateFormat, Filter, Relation, OrderBy, OrderByDirection } from '../../shared/utils/predicate';
import { SharedConstant } from '../../constant/shared/shared.constant';
import { ColumnSettings } from '../../shared/utils/column-settings.interface';
import { StockDocumentConstant } from '../../constant/inventory/stock-document.constant';
import { GridSettings } from '../../shared/utils/grid-settings.interface';
import { StockDocumentsService } from '../../inventory/services/stock-documents/stock-documents.service';
import { SwalWarring } from '../../shared/components/swal/swal-popup';
import { MessageService } from '../../shared/services/signalr/message/message.service';
import { InformationTypeEnum } from '../../shared/services/signalr/information/information.enum';
import { EcommerceConstant } from '../../constant/ecommerce/ecommerce.constant';
import { EcommerceCustomerService } from '../services/ecommerce-customer/ecommerce-customer.service';

@Component({
  selector: 'app-customer-ecommerce',
  templateUrl: './customer-ecommerce.component.html',
  styleUrls: ['./customer-ecommerce.component.scss']
})
export class CustomerEcommerceComponent implements OnInit {

  @ViewChild(ReportingInUrlComponent) report;
  choosenFilter: string;
  choosenFilterNumber = NumberConstant.ZERO;
  public predicate: PredicateFormat;
  // pager settings
  public pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  /**
* Grid state
*/
  public gridState: DataSourceRequestState = {
    skip: 0,
    take: 10,
    filter: { // Initial filter descriptor
      logic: 'and',
      filters: []
    }
  };

  public columnsConfig: ColumnSettings[] = [
    {
      field: EcommerceConstant.NOM_CLIENT_FIELD,
      title: EcommerceConstant.NOM_CLIENT_TITLE,
      filterable: true
    },
    {
      field: EcommerceConstant.PRENOM_CLIENT_FIELD,
      title: EcommerceConstant.PRENOM_CLIENT_TITLE,
      filterable: true
    },
    {
      field: EcommerceConstant.EMAIL_CLIENT_FIELD,
      title: EcommerceConstant.EMAIL_CLIENT_TITLE,
      filterable: true
    },
    {
      field: EcommerceConstant.PREMUIM_CLIENT_FIELD,
      title: EcommerceConstant.PREMUIM_CLIENT_TITLE,
      filterable: true,
      _width: 150 
    }
    
  ];

  // Grid settings
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };

  constructor(public stockDocumentsService: StockDocumentsService, private swalWarrings: SwalWarring,
    private router: Router, public translate: TranslateService, private messageService: MessageService,
    public ecommerceCustomerService: EcommerceCustomerService) { }

  /**
* Data changed listener
* @param state
*/
  public dataStateChange(state: DataStateChangeEvent): void {
    this.gridSettings.state = state;
    this.ecommerceCustomerService.getClientList(state, this.predicate).subscribe(data => this.gridSettings.gridData = data);
  }

  /**
* Remove handler
* @param param0
*/
  public removeHandler({ dataItem }) {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.stockDocumentsService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        });
      }
    });
  }
  /**
   *  Go to edit form
   * @param id
   */
  public goToAdvancedEdit(id: number) {
    this.router.navigateByUrl(StockDocumentConstant.URI_ECOMMERCE_EDIT.concat(id.toString()));
  }

  /**
* Init grid with data from the datasource
*/
  initGridDataSource() {
    this.ecommerceCustomerService.getClientList(this.gridSettings.state, this.predicate).subscribe(data =>
      this.gridSettings.gridData = data
    );
  }


  /**
   * Prepare predicate
   * @param status
   */
  public preparePredicate(status: number): void {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    
    this.predicate.Relation = new Array<Relation>();
    
    this.predicate.OrderBy = new Array<OrderBy>();
    // Add order by DocumentDate
    this.predicate.OrderBy.push.apply(this.predicate.OrderBy, [new OrderBy("Id", OrderByDirection.asc)]);
  }

  /**
 * onChange Status Transfert Movement
 * */
  public onChangeStatusTransfertMovement(status: number) {
    // Prepare predicate
    this.preparePredicate(status);
    // Init grid data source
    this.initGridDataSource();
  }

  ngOnInit() {
    // Prepare predicate
    this.preparePredicate(NumberConstant.ZERO);
    // Init grid data source
    this.initGridDataSource();
  }

  public changePremium (id:number,isPremium:boolean)
  {
    this.swalWarrings.CreateSwal(EcommerceConstant.TEXT_SWAL_WARRING_CLIENT_PREMUIM,
      EcommerceConstant.TITLE_SWAL_WARRING_CLIENT_PREMUIM,
      EcommerceConstant.TEXT_BUTTON_SWAL_WARRING_CLIENT_PREMUIM).then((result) => {
        if (result.value) {
          this.ecommerceCustomerService.changePremuimClient(id,isPremium).subscribe(res =>{
            this.messageService.startSendMessage(res, InformationTypeEnum.INVENTORY_TRANSFER_MVT_RECEIVE, null, false);
            this.ecommerceCustomerService.getClientList(this.gridSettings.state, this.predicate).subscribe(data => this.gridSettings.gridData = data);
          });
        }
      });
  }

}
