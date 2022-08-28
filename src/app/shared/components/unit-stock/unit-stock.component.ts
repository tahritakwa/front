import { Component, OnInit, Input, ViewContainerRef, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MeasureUnit } from '../../../models/inventory/measure-unit.model';
import { MeasureUnitService } from '../../services/mesure-unit/measure-unit.service';
import { DropDownComponent } from '../../interfaces/drop-down-component.interface';
import { FormModalDialogService } from '../../services/dialog/form-modal-dialog/form-modal-dialog.service';
import { ItemConstant } from '../../../constant/inventory/item.constant';
import { MeasureUnitListComponent } from '../../../inventory/components/list-measure-unit/measure-unit-list.component';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { AddMeasureUnitComponent } from '../../../inventory/components/add-measure-unit/add-measure-unit.component';


@Component({
  selector: 'app-unit-stock',
  templateUrl: './unit-stock.component.html',
  styleUrls: ['./unit-stock.component.scss']
})
export class UnitStockComponent implements OnInit, DropDownComponent {
  @Input() source ;
  @Input() itemForm: FormGroup;
  @Input() allowCustom;
  @Input() isInGrid;
  @Output() selected = new EventEmitter<boolean>();
  @Output() addClicked = new EventEmitter<boolean>();
  public unitStockDataSource: MeasureUnit[];
  public unitStockFiltredDataSource: MeasureUnit[];
  @Input() readonly: boolean;
  @Input() hideBtn: boolean;
  constructor(private unitService: MeasureUnitService, private formModalDialogService: FormModalDialogService,
    private viewRef: ViewContainerRef) { }

  ngOnInit() {
    this.initDataSource();
  }
  initDataSource(): void {
    this.unitService.list().subscribe(data => {
      this.unitStockDataSource = data;
      this.unitStockFiltredDataSource = this.unitStockDataSource.slice(0);
    });
  }

  /**
   * filter by label and description and mesure unit code
   * @param value
   */
  handleFilter(value: string): void {
    this.unitStockFiltredDataSource = this.unitStockDataSource.filter((s) =>
      s.Label.toLowerCase().includes(value.toLowerCase())
      || s.Description.toLowerCase().includes(value.toLowerCase())
      || s.MeasureUnitCode.toLocaleLowerCase().includes(value.toLowerCase()));
  }
  addNew(): void {
    if (this.isInGrid) {
      // notice the grid to treat the add event
      this.addClicked.emit();
    } else {
      const modalTitle = ItemConstant.CREATE_STOCKUNIT;
      this.formModalDialogService.openDialog(modalTitle, AddMeasureUnitComponent, this.viewRef,
        this.close.bind(this), {source : this.source}, true, SharedConstant.MODAL_DIALOG_SIZE_L);
    }
  }
  get IdUnitStock(): FormControl {
    return this.itemForm.get('IdUnitStock') as FormControl;
  }

  public close(data) {
    if (data) {
      this.unitStockDataSource = data.data;
      this.unitStockFiltredDataSource = this.unitStockDataSource.slice(0);
      this.IdUnitStock.setValue(data.data[data.total - 1].Id);
    }
  }
}
