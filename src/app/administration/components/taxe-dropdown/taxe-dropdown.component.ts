import { Component, OnInit, Input, ViewContainerRef, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { TaxeService } from '../../services/taxe/taxe.service';
import { ReducedTaxe } from '../../../models/administration/reduced-taxe.model';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { AddTaxeComponent } from '../../taxe/add-taxe/add-taxe.component';
import { TaxeGroupConstant } from '../../../constant/Administration/taxe-group.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';


@Component({
  selector: 'app-taxe-drop-down',
  templateUrl: './taxe-dropdown.component.html',
  styleUrls: ['./taxe-dropdown.component.scss']
})
export class TaxeDropdownComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() isInGrid: boolean;
  @Output() addClickedTax = new EventEmitter<boolean>();
  @Input() addModal: boolean;
  @Output() select = new EventEmitter<any>();


  public taxeDataSource: ReducedTaxe[];
  public taxeFiltredDataSource: ReducedTaxe[];
  constructor(private taxeService: TaxeService,
    private viewRef: ViewContainerRef, private formModalDialogService: FormModalDialogService) { }

  ngOnInit() {
    this.initDataSource();
  }
  initDataSource(): void {
    this.taxeService.listdropdown().subscribe((data: any) => {
      this.taxeDataSource = data.listData;
      this.taxeFiltredDataSource = this.taxeDataSource.slice(NumberConstant.ZERO);
    });
  }

  addNew(): void {
    const modalTitle = TaxeGroupConstant.ADD_TAX;
    if (this.isInGrid) {
      this.addClickedTax.emit(true);
    } else {
      this.formModalDialogService.openDialog(modalTitle, AddTaxeComponent,
        this.viewRef, this.closeModal.bind(this), null, null, SharedConstant.MODAL_DIALOG_SIZE_L);
    }
  }

  closeModal() {
    this.initDataSource();
  }
  get IdTaxe(): FormControl {
    return this.form.get('IdTaxe') as FormControl;
  }
  selectTaxe(event){
    this.select.emit(event);
  }
  handleFilter(value: string): void {
    this.taxeFiltredDataSource = this.taxeDataSource.filter((s) =>
      s.CodeTaxe.toLowerCase().includes(value.toLowerCase())
      || s.Label.toLowerCase().includes(value.toLowerCase()));
  }
}
