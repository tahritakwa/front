import { Component, OnInit, Input, ViewContainerRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MeasureUnit } from '../../../models/inventory/measure-unit.model';
import { MeasureUnitService } from '../../services/mesure-unit/measure-unit.service';
import { DropDownComponent } from '../../interfaces/drop-down-component.interface';
import { MeasureUnitListComponent } from '../../../inventory/components/list-measure-unit/measure-unit-list.component';
import { FormModalDialogService } from '../../services/dialog/form-modal-dialog/form-modal-dialog.service';
import { ItemConstant } from '../../../constant/inventory/item.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { ReducedMeasureUnit } from '../../../models/inventory/reduced-measure-unit.model';
import { AddMeasureUnitComponent } from '../../../inventory/components/add-measure-unit/add-measure-unit.component';

@Component({
  selector: 'app-unit-sales',
  templateUrl: './unit-sales.component.html',
  styleUrls: ['./unit-sales.component.scss']
})
export class UnitSalesComponent implements OnInit, DropDownComponent {
  @Input() itemForm: FormGroup;
  @Input() allowCustom;
  @Input() isInGrid;
  @Input() readonly;
  @Input() hideBtn: boolean;
  @Output() selected = new EventEmitter<boolean>();
  @Output() addClicked = new EventEmitter<boolean>();
  public unitStockDataSource: ReducedMeasureUnit[];
  public unitSalesDataSource: ReducedMeasureUnit[];
  public unitSalesFiltredDataSource: ReducedMeasureUnit[];
  constructor(private natureService: MeasureUnitService, private formModalDialogService: FormModalDialogService,
    private viewRef: ViewContainerRef) { }

  ngOnInit() {
    this.initDataSource();
  }
  initDataSource(): void {
    this.natureService.listdropdown().subscribe((data: any) => {
      this.unitSalesDataSource = data.listData;
      this.unitSalesFiltredDataSource = this.unitSalesDataSource.slice(0);
    });
  }

  /**
   * filter by label and description
   * @param value
   */
  handleFilter(value: string): void {
    this.unitSalesFiltredDataSource = this.unitSalesDataSource.filter((s) =>
      s.Label.toLowerCase().includes(value.toLowerCase())
      || s.Description.toLowerCase().includes(value.toLowerCase()));
  }
  addNew(): void {
    if (this.isInGrid) {
      // notice the grid to treat the add event
      this.addClicked.emit();
    } else {
      const modalTitle = ItemConstant.CREATE_SALESUNIT;
      this.formModalDialogService.openDialog(modalTitle, AddMeasureUnitComponent, this.viewRef, this.close.bind(this)
        , null, true, SharedConstant.MODAL_DIALOG_SIZE_L);
    }
  }
  get IdUnitSales(): FormControl {
    return this.itemForm.get('IdUnitSales') as FormControl;
  }

  public close(data) {
    if (data) {
      this.unitStockDataSource = data.data;
      this.unitSalesFiltredDataSource = this.unitStockDataSource.slice(0);
      this.IdUnitSales.setValue(data.data[data.total - 1].Id);
    }
  }
}
