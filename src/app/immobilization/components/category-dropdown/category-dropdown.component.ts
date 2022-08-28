import { Component, OnInit, Input, ViewContainerRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AddCategoryComponent } from '../../category/add-category/add-category.component';
import { Category } from '../../../models/immobilization/category.model';
import { CategoryService } from '../../services/category/category.service';
import { DropDownComponent } from '../../../shared/interfaces/drop-down-component.interface';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { TranslationKeysConstant } from '../../../constant/shared/translation-keys.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { ReducedCategory } from '../../../models/immobilization/reduced-category.model';

@Component({
  selector: 'app-category-dropdown',
  templateUrl: './category-dropdown.component.html',
  styleUrls: ['./category-dropdown.component.scss']
})
export class CategoryDropdownComponent implements OnInit, DropDownComponent {

  @Input() allowCustom;
  @Input() form: FormGroup;
  @Input() isAdvancedAdd: boolean;
  public categoryDataSource: ReducedCategory[];
  public categoryFiltredDataSource: ReducedCategory[];
  constructor(private categoryService: CategoryService, private viewRef: ViewContainerRef,
     private formModalDialogService: FormModalDialogService) { }

  ngOnInit() {
    this.initDataSource();
  }
  public initDataSource(): void {
    this.categoryService.listdropdown().subscribe((data: any) => {
      this.categoryDataSource = data.listData;
      this.categoryFiltredDataSource = this.categoryDataSource.slice(0);
    });
  }
  /**
   * filter by label
   * @param value
   */
  handleFilter(value: string) {
    this.categoryFiltredDataSource = this.categoryDataSource.filter((s) =>
      s.Label.toLowerCase().includes(value.toLowerCase())
    );
  }
  public addNew() {
    this.formModalDialogService.openDialog(TranslationKeysConstant.ADD_CATEGORY, AddCategoryComponent,
      this.viewRef, this.onCloseModalCategory.bind(this), null, true, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  /**
  * on close search modal event
  * @param selectedDataItemId
  */
  onCloseModalCategory(selectedDataId): void {
    this.initDataSource();
    if (Number(selectedDataId)) {
      if (this.form) {
        this.form.controls['IdCategory'].setValue(selectedDataId);
      }
    }
  }

  get IdCategory(): FormControl {
    return this.form.get('IdCategory') as FormControl;
  }
}
