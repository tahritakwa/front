import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms'; 
import { TranslateService } from '@ngx-translate/core';
import { VehicleBrand } from '../../../models/garage/vehicle-brand.model';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { VehicleBrandService } from '../../services/vehicle-brand/vehicle-brand.service';
const ALL_BRANDS = 'ALL_BRANDS';
@Component({
  selector: 'app-brand-dropdown',
  templateUrl: './brand-dropdown.component.html',
  styleUrls: ['./brand-dropdown.component.scss']
})
export class BrandDropdownComponent implements OnInit {

  @Input() form: FormGroup;
  @Output() Selected = new EventEmitter<any>();
  @Input() addAllState;
  brandDataSource: any[] = [];
  brandFiltredDataSource: any[] = [];
  predicate: PredicateFormat;
  allBrandsTranslate = '';
  constructor(public translate: TranslateService, private brandService: VehicleBrandService) { }

  ngOnInit() {
     if (this.addAllState) {
        this.translate.get(ALL_BRANDS).subscribe(trans => {
          this.allBrandsTranslate = trans;
          this.brandFiltredDataSource.push({Designation : trans, Id : 0});
        });
     }
     this.initGridDataSource();
  }

  initGridDataSource() {
    this.predicate = new PredicateFormat();
    this.brandService.readDropdownPredicateData(this.predicate).subscribe((data: any) => {
      this.brandDataSource = data;
      this.brandFiltredDataSource = this.brandDataSource.slice(0);
      if (this.addAllState) {
        this.brandFiltredDataSource.push({Designation : this.allBrandsTranslate, Id : 0});
      }
    });
  }

  handleFilter($event) {
    this.brandFiltredDataSource = this.brandDataSource.filter(x => x.Designation.toLowerCase().includes($event.toLowerCase()));
  }

  onSelectBrand($event) {
    const selectedValue: VehicleBrand = this.brandDataSource.find(x => x.Id === $event);
    this.Selected.emit(selectedValue);
  }

}
