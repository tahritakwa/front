import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { GridSettings } from '../../shared/utils/grid-settings.interface';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { Tiers } from '../../models/achat/tiers.model';
import { Item } from '../../models/inventory/item.model';
import { ItemConstant } from '../../constant/inventory/item.constant';
import { ItemService } from '../services/item/item.service';
import { Router } from '@angular/router';
import { MediaConstant } from '../../constant/utility/Media.constant';
import { NumberConstant } from '../../constant/utility/number.constant';
import { SharedConstant } from '../../constant/shared/shared.constant';
import { SwalWarring } from '../../shared/components/swal/swal-popup';
import { AuthService } from '../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../Structure/permission-constant';

@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.scss']
})
export class ItemCardComponent implements OnInit {
  @Input() selectedItemInParentComp: number;
  @Input() gridSettings: GridSettings;
  @Output() DoPaginte = new EventEmitter();
  @Output() dataStateChangeEvent = new EventEmitter();
  @Output() onItemClickEvent = new EventEmitter();
  /**
   * permissions
   */
   public hasShowPermission: boolean;
   public hasDeletePermission: boolean;
   public hasUpdatePermission: boolean;
   public hasAddPermission: boolean;
  constructor(private itemService: ItemService, private swalWarrings: SwalWarring, private router: Router, private authService: AuthService) {
  }

  ngOnInit() {
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.DELETE_ITEM_STOCK);
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_ITEM_STOCK);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_ITEM_STOCK);
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_ITEM_STOCK);
  }

  get data(): any[] {
    if (this.gridSettings && this.gridSettings.gridData) {
      this.gridSettings.gridData.data.forEach(item => {
        item.image = MediaConstant.PLACEHOLDER_PICTURE;
        if (item.FilesInfos) {
          let firstImage: any;
          firstImage = item.FilesInfos.filter(fileinfo => fileinfo.Extension !== MediaConstant.DOT_MP4)[NumberConstant.ZERO];
          if (firstImage) {
            item.image = firstImage.FileData;
          }
        }
      })
      return this.gridSettings.gridData.data;
    }
  }


  /**
   * @ to be replaced with suppliers list
   * @param item
   */
  public getSuppliers(item): string[] {
    const supplierName = item.ListTiers;
    return supplierName;
  }

  paginate(event: any) {
    this.DoPaginte.emit(event);
  }

  dataStateChange(event: any) {
    this.dataStateChangeEvent.emit(event);
  }

  /**
   * advanced edit
   * @param dataItem
   */
  public edit(dataItem) {
    const editUrl = this.itemService.isPurchase ? ItemConstant.URI_ADVANCED_EDIT_PURCHASE : ItemConstant.URI_ADVANCED_EDIT;
    this.router.navigateByUrl(editUrl + dataItem.Id, { queryParams: dataItem, skipLocationChange: true });
  }

  public onItemClick(dataItem) {
    this.onItemClickEvent.emit(dataItem);
  }

  public isElementCardSelected(dataItem: Item): boolean {
    if (dataItem && this.selectedItemInParentComp) {
      return dataItem.Id === this.selectedItemInParentComp;
    }
  }

  colneItem(id) {
    if (this.itemService.isPurchase) {
      window.open(ItemConstant.DUPLICATE_ITEM_URL_PURCHASE.concat(id));
    } else {
      window.open(ItemConstant.DUPLICATE_ITEM_URL.concat(id));
    }
  }
  public removeHandler(dataItem) {
    this.swalWarrings.CreateDeleteSwal(ItemConstant.ITEM, SharedConstant.CET).then((result) => {
      if (result.value) {
        this.itemService.remove(dataItem).subscribe(() => {
          this.dataStateChange(this.gridSettings.state);
        });
      }
    });

  }
}
