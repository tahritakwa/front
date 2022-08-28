import { NumberConstant } from './../../../constant/utility/number.constant';
import { TierCategory } from './../../../models/sales/tier-category.model';
import { TierCategoryService } from './../../../sales/services/tier-category/tier-category.service';
import { PredicateFormat, OrderBy, OrderByDirection } from './../../utils/predicate';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { DropDownComponent } from '../../interfaces/drop-down-component.interface';


@Component({
  selector: 'app-tier-category-dropdown',
  templateUrl: './tier-category-dropdown.component.html',
  styleUrls: ['./tier-category-dropdown.component.scss']
})
export class TierCategoryDropdownComponent implements OnInit, DropDownComponent {

   /**
   * Form group input
   */
    @Input() group: FormGroup;
    @Input() allowCustom;
    @Input() id
    @Input() disabled;
    @Output() Selected = new EventEmitter<any>();
    @Input() showDetails: boolean;
    public tierCategoryDataSource: TierCategory[] = [];
    public tierCategoryFiltredDataSource: TierCategory[] = [];
    
    @ViewChild(ComboBoxComponent) tierCategoryComboBoxComponent: ComboBoxComponent;
    public predicate: PredicateFormat = new PredicateFormat();
    constructor(
      private tierCategoryService: TierCategoryService) {
    }
  
    ngOnInit() {
      this.initDataSource();
    }
  
    public onchange(event): void {
      const selected = this.tierCategoryFiltredDataSource.filter(tierCategory => tierCategory.Id === event)[NumberConstant.ZERO];
      this.Selected.emit(selected);
    }
  
    /**
     * Initialize the data source
     */
    initDataSource(): void {
      this.tierCategoryService.readDropdownPredicateData(this.predicate).subscribe((data: any) => {
        this.tierCategoryDataSource = data;
        this.tierCategoryFiltredDataSource = this.tierCategoryDataSource.slice(NumberConstant.ZERO);
      });
    }
  
    handleFilter(value: string): void {
      this.tierCategoryFiltredDataSource = this.tierCategoryDataSource.filter((s) =>
        s.Name.toLowerCase().includes(value.toLowerCase()));
    }
  
   public preparePredicate(id:number):void {
    this.predicate = new PredicateFormat();
    this.predicate.OrderBy = new Array<OrderBy>();
    this.predicate.OrderBy.push(new OrderBy("Name", OrderByDirection.asc));
  }
  

}
