import { Component, ComponentRef, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { TecDocArticleModel } from '../../../models/inventory/tec-doc-article.model';
import { Item } from '../../../models/inventory/item.model';
import { ItemService } from '../../services/item/item.service';
import { ItemConstant } from '../../../constant/inventory/item.constant';
import { ListTecDocComponent } from '../list-tec-doc/list-tec-doc.component';
import { TecdocService } from '../../services/tecdoc/tecdoc.service';
import { TecDocComponent } from '../../../shared/components/tec-doc/tec-doc.component';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { OemItem } from '../../../models/inventory/oem-item.model';
import { BrandService } from '../../services/brand/brand.service';


@Component({
  selector: 'app-tec-doc-sync-stepper',
  templateUrl: './tec-doc-sync-stepper.component.html',
  styleUrls: ['./tec-doc-sync-stepper.component.scss']
})
export class TecDocSyncStepperComponent implements AfterViewInit {

  @ViewChild('SyncTable') SyncTable: ElementRef;
  @ViewChild('TecDocComponent') tecDocComponent: TecDocComponent;
  @ViewChild('ListTecDocComponent') listTecDocComponent: ListTecDocComponent;
  isModal: boolean;
  dialogOptions: Partial<IModalDialogOptions<any>>;
  public data: Item;
  isUpdateMode: boolean;
  isSync: boolean;
  selectedItem: TecDocArticleModel;
  step: number;
  selectedToSyncTab = [0, 0, 0, 0];
  datatoUpdate: any;
  ismodal = true;
  searchModes = ['CATEGORY', 'REFERENCE'];
  current = 1;
  public tecDocFilter = true;
  OemList = [];
  constructor(public modalService: ModalDialogInstanceService, private brandService: BrandService, private itemService: ItemService) { }

  ngAfterViewInit() {
    if (this.tecDocComponent && this.listTecDocComponent) {
      this.tecDocComponent.tecdocService = new TecdocService();
      this.listTecDocComponent.tecdocService = new TecdocService();
    }
  }

  selectRowTecDoc(value) {
    this.selectedItem = value.selectedRows[0].dataItem;
  }
  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.step = 1;
    this.isSync = true;
    this.isModal = true;
    this.dialogOptions = options;
    this.data = this.dialogOptions.data;
    this.itemService.syncItem = undefined;
    if (this.data) {
      this.isUpdateMode = true;
    } else {
      this.isUpdateMode = false;
    }
  }
  previous() {
    if (this.step > 1) {
      this.step--;
    }
  }
  next() {
    if (this.selectedItem) {
      this.step++;
      if (this.step === 2) {
        this.selectedItem.TecDocIdSupplier = this.selectedItem.IdSupplier;
        this.selectedItem.TecDocRef = this.selectedItem.Reference;
        this.itemService.getMedias(this.selectedItem).subscribe(data => {
          this.selectedItem.TecDocImageList = data.map(x => x.Source);
        });
        this.addTecDocMissingVehicleBrands();
      }
    }
    if (this.step > 2) {
      this.datatoUpdate = this.startupdate();
      this.confirm();
    }
  }
  confirm() {
    this.itemService.syncItem = this.datatoUpdate;
    this.dialogOptions.onClose();
    if (this.selectedToSyncTab[2] === 0) {
      this.modalService.closeAnyExistingModalDialog();
    }
  }
  startupdate() {
    const datatoUpdate = Object.assign({}, this.data);
    if (this.selectedToSyncTab[0] === 1) {
      datatoUpdate.Code = this.selectedItem.Reference;
    }
    if (this.selectedToSyncTab[1] === 1) {
      datatoUpdate.Description = this.selectedItem.Description;
    }
    if (this.selectedToSyncTab[2] === 1) {
      datatoUpdate.LabelProduct = this.selectedItem.Supplier;
    } else {
      datatoUpdate.LabelProduct = undefined;
    }
    if (this.selectedToSyncTab[3] === 1) {
      datatoUpdate.BarCode1D = this.selectedItem.BarCode;
    }
    datatoUpdate.TecDocId = this.selectedItem.Id;
    datatoUpdate.TecDocRef = this.selectedItem.Reference;
    datatoUpdate.TecDocIdSupplier = this.selectedItem.IdSupplier;
    datatoUpdate.TecDocImageUrl = this.selectedItem.ImagesUrl;
    datatoUpdate.TecDocBrandName = this.selectedItem.Supplier;
    datatoUpdate.TecDocImageList = this.selectedItem.TecDocImageList;
    if (datatoUpdate.TecDocImageList == null) {
      datatoUpdate.TecDocImageList = [];
    }
    if (this.selectedItem.OemNumbers && this.selectedItem.OemNumbers.length > NumberConstant.ZERO) {
      this.selectedItem.OemNumbers.forEach(oem => {
        datatoUpdate.OemItem = this.OemList
      });
    }
    return (datatoUpdate);
  }
  selectToSync(trIndex, TdIndex, value) {
    this.SyncTable.nativeElement.children[1].children[trIndex].children[TdIndex].bgColor = ItemConstant.SELECTIONCOLOR;
    this.SyncTable.nativeElement.children[1].children[trIndex].children[3 - TdIndex].bgColor = '';
    this.selectedToSyncTab[trIndex] = value;
  }

  selectAllTecdoc() {
    for (let index = 0; index < this.selectedToSyncTab.length; index++) {
      this.selectToSync(index, 2, 1);
    }
  }
  selectAllLocal() {
    for (let index = 0; index < this.selectedToSyncTab.length; index++) {
      this.selectToSync(index, 1, 0);
    }
  }
  addTecDocMissingVehicleBrands() {
    let SavedBrandLabels;
    let listbrands = Array.from(new Set(this.selectedItem.OemNumbers.map(x => x.mfrName)))
    this.brandService.addTecDocMissingVehicleBrands(listbrands).subscribe(data => {
      SavedBrandLabels = data.map(x => x.Label);

      this.selectedItem.OemNumbers.forEach(Oemnumber => {
        let brand = data.filter(x => x.Label === Oemnumber.mfrName)[0]
        let Oem = new OemItem(0, Oemnumber.articleNumber, brand)
        Oem.IdBrand = Oem.IdBrandNavigation.Id;
        this.OemList.push(Oem)
      });
    });
  }
}
