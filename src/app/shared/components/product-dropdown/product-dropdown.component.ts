import { Component, OnInit, Input, Output, EventEmitter, ViewContainerRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ProductItem } from '../../../models/inventory/product-item.model';
import { AddProductItemComponent } from '../../../inventory/components/add-product-item/add-product-item.component';
import { FormModalDialogService } from '../../services/dialog/form-modal-dialog/form-modal-dialog.service';
import { TranslateService } from '@ngx-translate/core';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { ProductItemService } from '../../services/product-item/product-item.service';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-product-dropdown',
  templateUrl: './product-dropdown.component.html',
  styleUrls: ['./product-dropdown.component.scss']
})
export class ProductDropdownComponent implements OnInit {
  @Input() itemForm: FormGroup = undefined;
  @Input() allowCustom;
  @Input() disabled;
  @Input() TecdocBrand;
  @Output() Selected = new EventEmitter<boolean>();
  @Output() Existed = new EventEmitter<boolean>();
  @Input() forSearch: boolean;
  @Input() public placeholder = 'PRODUCT_BAND';
  @ViewChild(ComboBoxComponent) public productComboBoxComponent: ComboBoxComponent;
  public productItemDataSource: ProductItem[];
  public productItemFiltredDataSource: ProductItem[];
  public isFromModal: boolean;
  public selectedItem;
  public selectedValue;
  public TecDocSupplier;

  constructor(private productItemService: ProductItemService, private formModalDialogService: FormModalDialogService,
    private viewRef: ViewContainerRef, private translationService: TranslateService) {
  }

  ngOnInit() {
    if (this.TecDocSupplier) {
      this.CreateAndinitDataSource(this.TecDocSupplier);
    } else {
      this.initDataSource();
    }
  }

  initDataSource(notreset = true): void {
    if (this.itemForm && this.itemForm.controls['IdProductItem'] && Number(this.itemForm.controls['IdProductItem'].value)) {
      this.selectedValue = this.itemForm.controls['IdProductItem'].value;
    }
    this.productItemService.listdropdown().subscribe((data: any) => {
      this.productItemDataSource = data.listData;
      this.productItemFiltredDataSource = this.productItemDataSource.slice(0);
      if (this.TecdocBrand) {
        this.SetTecDocBrand(this.TecdocBrand, notreset);
      }
    });

  }

  CreateAndinitDataSource(objectToCreate): void {
    if (objectToCreate) {
      this.addNew(objectToCreate, true);
    }
  }

  /**
   * filter by code and label
   * @param value
   */
  handleFilter(value: string): void {
    this.productItemFiltredDataSource = this.productItemDataSource.filter((s) =>
      s.CodeProduct.toLowerCase().includes(value.toLowerCase())
      || s.LabelProduct.toLocaleLowerCase().includes(value.toLowerCase()));

  }

  /**
   * search for tecdoc brand
   * @param value
   */
  SetTecDocBrand(value: string, notreset: boolean): void {
    this.productItemFiltredDataSource = this.productItemDataSource.filter((s) =>
      s.CodeProduct.toLowerCase().trim() === (value.toLowerCase())
      || s.LabelProduct.toLocaleLowerCase().trim() === (value.toLowerCase()));
    if (this.productItemFiltredDataSource.length >= 1) {
      this.handleChange(this.productItemFiltredDataSource[0].Id);
      if (notreset)
        this.Existed.emit(true);
    }
  }

  /**
   * on change
   * @param $event
   */
  handleChange($event): void {
    if(this.itemForm){
      this.IdProductItem.setValue($event);
    }
    this.selectedItem = $event;
    this.productItemFiltredDataSource = this.productItemDataSource.slice(0);
    this.Selected.emit($event);

  }

  /**
   * Add new value
   * */
  addNew(objectToCreate?, isFromTecDoc?: boolean): void {
    const modalTitle = this.translationService.instant('ADD_BRAND');
    this.formModalDialogService.openDialog(modalTitle, AddProductItemComponent,
      this.viewRef, this.close.bind(this), (isFromTecDoc ? objectToCreate : null), true, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  public close(data) {
    if (data.data) {
      this.productItemDataSource = data.data;
      this.productItemFiltredDataSource = this.productItemDataSource.slice(0);
      this.IdProductItem.setValue(data.data[data.total - 1].Id);
    } else
      if (data) {
        this.IdProductItem.setValue(data);
      }

  }


  get IdProductItem(): FormControl {
    return this.itemForm.get('IdProductItem') as FormControl;
  }


}
