import { Component, OnInit, Input, ViewContainerRef, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DiscountGroupItem } from '../../../models/inventory/discount-group-item.model';
import { DiscountGroupItemService } from '../../../administration/services/discount-group-item/discount-group-item-service';
import { DropDownComponent } from '../../interfaces/drop-down-component.interface';
import { FormModalDialogService } from '../../services/dialog/form-modal-dialog/form-modal-dialog.service';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { ItemConstant } from '../../../constant/inventory/item.constant';
import { AddDiscountGroupItemComponent } from '../../../inventory/components/add-discount-group-item/add-discount-group-item.component';

@Component({
  selector: 'app-discount-group-item-drop-down',
  templateUrl: './discount-group-item-drop-down.component.html',
  styleUrls: ['./discount-group-item-drop-down.component.scss']
})
export class DiscountGroupItemDropDownComponent implements OnInit, DropDownComponent {
  @Input() allowCustom;
  @Input() parentForm: FormGroup;
  @Input() isInGrid;
  @Output() addClicked = new EventEmitter<boolean>();
  public discountGroupItemDataSource: DiscountGroupItem[];
  public discountGroupItemFiltredDataSource: DiscountGroupItem[];

  public isDesabeld: boolean;

  constructor(private discountGroupItemService: DiscountGroupItemService
    , private formModalDialogService: FormModalDialogService,
    private viewRef: ViewContainerRef) { }

  ngOnInit() {
    this.initDataSource();
  }
  initDataSource(): void {
    this.discountGroupItemService.list().subscribe(data => {
      this.discountGroupItemDataSource = data;
      this.discountGroupItemFiltredDataSource = this.discountGroupItemDataSource.slice(0);
    });
  }
  handleFilter(value: string): void {
    this.discountGroupItemFiltredDataSource = this.discountGroupItemDataSource.filter((s) =>
      s.Code.toLowerCase().includes(value.toLowerCase())
      || s.Label.toLocaleLowerCase().includes(value.toLowerCase()));
  }
  addNew(): void {
    if (this.isInGrid) {
      // notice the grid to treat the add event
      this.addClicked.emit();
    } else {
      const modalTitle = ItemConstant.CREATE_DISCOUNT_GROUP_ITEM;
      this.formModalDialogService.openDialog(modalTitle, AddDiscountGroupItemComponent, this.viewRef, this.initDataSource.bind(this)
      , null, null, SharedConstant.MODAL_DIALOG_SIZE_M);
    }
  }
  setTiersValue(){
    this.addClicked.emit();
  }
}
