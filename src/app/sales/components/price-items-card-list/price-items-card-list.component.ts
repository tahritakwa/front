import { Component, ComponentRef, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { Subject } from 'rxjs/Subject';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { Item } from '../../../models/inventory/item.model';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { PricesService } from '../../services/prices/prices.service';
import { PriceItemsAffectionListComponent } from '../price-items-affection-list/price-items-affection-list.component';

@Component({
  selector: 'app-price-items-card-list',
  templateUrl: './price-items-card-list.component.html',
  styleUrls: ['./price-items-card-list.component.scss']
})
export class PriceItemsCardListComponent implements OnInit {

  data = [];
  @Output() affectionClicked = new EventEmitter<any>();
  @Input() idPrice: number;
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
      this.pricesService.getPriceItems(this.state().skip, this.state().take,
        this.idPrice).subscribe(data => {
          this.data = data.data;
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
  pictureItemSrc(dataItem) {
    if (dataItem.PictureFileInfo) {
      return SharedConstant.PICTURE_BASE.concat(dataItem.PictureFileInfo.Data);
    }
  }
  affectToItemsClick() {
    if (this.idPrice) {
      this.openAffectionModal(this.idPrice);
    } else {
      this.affectionClicked.emit();
    }
  }

  openAffectionModal(idPrice: number) {
    this.formModalDialogService.openDialog(SharedConstant.ARTICLE_LIST_TITLE,
      PriceItemsAffectionListComponent, this.viewRef, this.onCloseModal.bind(this),
      { idPrice: idPrice }, true, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  private onCloseModal(data: any): void {
    this.initData();
  }
  unaffectItem(item: Item) {
    this.pricesService.unaffectItemFromPrice(this.idPrice, item.Id).subscribe(() => {
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
