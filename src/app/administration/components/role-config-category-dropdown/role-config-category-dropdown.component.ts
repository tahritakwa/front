import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { RoleConfigCategoryService } from '../../services/role-config-category/role-config-category.service';
import { RoleConfigCategory } from '../../../models/administration/role-config-category.model';

@Component({
  selector: 'app-role-config-category-dropdown',
  templateUrl: './role-config-category-dropdown.component.html',
  styleUrls: ['./role-config-category-dropdown.component.scss']
})
export class RoleConfigCategoryDropdownComponent implements OnInit {
  @Input() form: FormGroup;
  @Output() Selected = new EventEmitter<boolean>();
  public RoleConfigCategoryDataSource: RoleConfigCategory[];
  public RoleConfigCategoryFiltredDataSource: RoleConfigCategory[];
  constructor(private roleConfigCategoryService: RoleConfigCategoryService) { }

  ngOnInit() {
    this.initDataSource();
  }
  initDataSource(): void {
    this.roleConfigCategoryService.list().subscribe((data: any) => {
      this.RoleConfigCategoryDataSource = data;
      this.RoleConfigCategoryFiltredDataSource = this.RoleConfigCategoryDataSource.slice(0);
    });
  }
  /**
   * filter by label && description && code
   * @param value
   */
  handleFilter(value: string): void {
    this.RoleConfigCategoryFiltredDataSource = this.RoleConfigCategoryDataSource.filter((s) =>
      s.Code.toLowerCase().includes(value.toLowerCase())
      || s.Label.toLocaleLowerCase().includes(value.toLowerCase()));
  }

  get IdRoleConfigCategory(): FormControl {
    return this.form.get('IdRoleConfigCategory') as FormControl;
  }

}
