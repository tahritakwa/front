import { Component, OnInit, Input, OnDestroy, EventEmitter, Output, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DiscountGroupTiersService } from '../../../administration/services/discount-group-tiers/discount-group-tiers.service';
import { DiscountGroupTiers } from '../../../models/administration/discount-group-tiers.model';
import { DropDownComponent } from '../../interfaces/drop-down-component.interface';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { FormModalDialogService } from '../../services/dialog/form-modal-dialog/form-modal-dialog.service';
import { ComponentsConstant } from '../../../constant/shared/components.constant';
import { AddDiscountGroupTiersComponent } from '../add-discount-group-tiers/add-discount-group-tiers.component';

@Component({
  selector: 'app-discount-group-tiers-drop-down',
  templateUrl: './discount-group-tiers-drop-down.component.html',
  styleUrls: ['./discount-group-tiers-drop-down.component.scss']
})
export class DiscountGroupTiersDropDownComponent implements OnInit, DropDownComponent {
  public isDesabeld: boolean;
  @Input() group: FormGroup;
  @Input() allowCustom;
  @Input() isInGrid;
  @Output() addClicked = new EventEmitter<boolean>();
  public discountGroupTiersDataSource: DiscountGroupTiers[];
  public discountGroupTiersFiltredDataSource: DiscountGroupTiers[];

  constructor(private discountGroupTiersService: DiscountGroupTiersService
    , private formModalDialogService: FormModalDialogService,
    private viewRef: ViewContainerRef) { }

  ngOnInit() {
    this.initDataSource();
  }
  initDataSource(): void {
    this.discountGroupTiersService.list().subscribe(data => {
      this.discountGroupTiersDataSource = data;
      this.discountGroupTiersFiltredDataSource = this.discountGroupTiersDataSource.slice(0);
    });
  }
  handleFilter(value: string): void {
    this.discountGroupTiersFiltredDataSource = this.discountGroupTiersDataSource.filter((s) =>
      s.Code.toLowerCase().includes(value.toLowerCase())
      || s.Label.toLocaleLowerCase().includes(value.toLowerCase()));
  }
  addNew(): void {
    if (this.isInGrid) {
      // notice the grid to treat the add event
      this.addClicked.emit();
    } else {
      const modalTitle = ComponentsConstant.CREATE_DISCOUNT_GROUP;
      this.formModalDialogService.openDialog(modalTitle, AddDiscountGroupTiersComponent, this.viewRef, this.initDataSource.bind(this)
      , null, null, SharedConstant.MODAL_DIALOG_SIZE_M);
    }
  }
  setGroupTiersValue(){
    this.addClicked.emit();
  }
}
