import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AreaService } from '../service/area.service';
@Component({
  selector: 'app-dropdown-area',
  templateUrl: './dropdown-area.component.html',
  styleUrls: ['./dropdown-area.component.scss']
})
export class DropdownAreaComponent implements OnInit {
  @Input() form: FormGroup;
  @Output() selectedAreaId = new EventEmitter<boolean>();
  public areaFiltredList = [];
  public areaId = [];
  constructor(public translate: TranslateService, private areaService: AreaService) {
    this.initDataSource();
  }


  public initDataSource() {
    this.areaService.getJavaGenericService().getEntityList()
      .subscribe((data) => {
        this.areaId = data;
        this.areaFiltredList = this.areaId.slice(0);
      });
  }

  handleFilterParentCode(value): void {
    this.areaFiltredList = this.areaId.filter((s) =>
      s.reference.toString().includes(value)
      || s.designation.toLocaleLowerCase().includes(value.toLowerCase()));
  }

  public onSelect(event): void {
    this.selectedAreaId.emit(event);
  }

  ngOnInit() {
  }

}
