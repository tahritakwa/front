import { Component, ComponentRef, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { Subject } from 'rxjs/Subject';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { Tiers } from '../../../models/achat/tiers.model';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { PricesService } from '../../services/prices/prices.service';
import { PriceCustomersAffectionListComponent } from '../price-customers-affection-list/price-customers-affection-list.component';

@Component({
  selector: 'app-price-customers-card-list',
  templateUrl: './price-customers-card-list.component.html',
  styleUrls: ['./price-customers-card-list.component.scss']
})
export class PriceCustomersCardListComponent implements OnInit {
  data = [];
  @Output() affectionClicked = new EventEmitter<any>();
  @Output() CustomerListEmpty = new EventEmitter<any>();
  @Input() idPrice: number;
  @Input() idCurrency: number;
  @Input() hasUpdatePermission: boolean;
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS_BY_FOUR;
  minPageSize = this.pagerSettings.pageSizes[0];
  public gridState: DataSourceRequestState = {
    skip: 0,
    take: this.minPageSize
  };
  public gridSettings: GridSettings = {
    state: this.gridState
  };
  isModal = false;
  isReadOnly = false;
  options: Partial<IModalDialogOptions<any>>;
  reference: ComponentRef<IModalDialog>;
  public closeDialogSubject: Subject<any>;
  public dataModal: any;
  constructor(public pricesService: PricesService,
    private formModalDialogService: FormModalDialogService,
    private viewRef: ViewContainerRef) { }

    dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
      this.isModal = true;
      this.options = options;
      this.dataModal = options.data;
      this.isReadOnly = this.dataModal.isReadOnly;
      this.idPrice = this.dataModal.idPrice;
      this.closeDialogSubject = options.closeDialogSubject;
    }
  ngOnInit() {
    this.initData();
  }
  initData() {

    if (this.idPrice) {
      this.pricesService.getPriceCustomers(this.state().skip, this.state().take,
        this.idPrice).subscribe(data => {
          this.data = data.data;
          if(data.total <= 0 || !data.total){
            this.CustomerListEmpty.emit(true);
          }else{
            this.CustomerListEmpty.emit(false);
          }
          this.gridSettings.gridData = { data: data.data, total: data.total };
          if (data.total <= this.state().skip && this.state().skip !== NumberConstant.ZERO) {
            this.state().skip = data.total % this.state().take === NumberConstant.ZERO ?
              data.total - this.state().take : data.total - (data.total % this.state().take);
            this.initData();
          }
        });
    }
  }
  state(): DataSourceRequestState {
    return this.gridSettings.state;
  }
  pictureTierSrc(dataItem) {
    if (dataItem.PictureFileInfo) {
      return SharedConstant.PICTURE_BASE.concat(dataItem.PictureFileInfo.Data);
    }
  }
  affectToCusomerClick() {
    if (this.idPrice) {
      this.openAffectionModal(this.idPrice, this.idCurrency);
    } else {
      this.affectionClicked.emit();
    }
  }

  openAffectionModal(idPrice: number, idCurrency: number) {
    this.formModalDialogService.openDialog(SharedConstant.CUSTOMER_LIST_TITLE,
      PriceCustomersAffectionListComponent, this.viewRef, this.onCloseModal.bind(this),
      { idPrice: idPrice, idCurrency: idCurrency }, true, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  private onCloseModal(data: any): void {
    this.initData();
  }
  unaffectCustomer(customer: Tiers) {
    this.pricesService.unaffectCustomerFromPrice(this.idPrice, customer.Id).subscribe(() => {
      this.initData();
    });
  }

  paginate(event) {
  }
  dataStateChange(state) {
    this.gridSettings.state = state;
    this.initData();
  }

}
