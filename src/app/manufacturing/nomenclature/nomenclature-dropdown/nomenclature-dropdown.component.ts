import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {NomenclatureService} from '../../service/nomenclature.service';

@Component({
  selector: 'app-nomenclature-dropdown',
  templateUrl: './nomenclature-dropdown.component.html',
  styleUrls: ['./nomenclature-dropdown.component.scss']
})
export class NomenclatureDropdownComponent implements OnInit {
  @Input() form: FormGroup;
  @Output() selectedNomenclatureId = new EventEmitter<boolean>();
  public nomenclatureFiltredList = [];
  public nomenclatureId = [];

  constructor(public translate: TranslateService, private nomenclatureService: NomenclatureService) {
    this.initDataSource();
  }


  public initDataSource() {
    this.nomenclatureService.getJavaGenericService().getEntityList('')
      .subscribe((data) => {
        this.nomenclatureId = data;
        this.nomenclatureFiltredList = this.nomenclatureId.slice(0);
      });
  }

  handleFilterParentCode(value): void {
    this.nomenclatureFiltredList = this.nomenclatureId.filter((s) =>
      s.reference.toString().includes(value));
  }

  public onSelect(event): void {
    this.selectedNomenclatureId.emit(event);
  }

  ngOnInit() {
  }

}
