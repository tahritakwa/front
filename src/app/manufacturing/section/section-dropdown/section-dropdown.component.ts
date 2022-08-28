import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {SectionService} from '../../service/section.service';

@Component({
  selector: 'app-section-dropdown',
  templateUrl: './section-dropdown.component.html',
  styleUrls: ['./section-dropdown.component.scss']
})
export class SectionDropdownComponent implements OnInit {
  @Input() form: FormGroup;
  @Output() selectedSectionId = new EventEmitter<boolean>();
  public sectionFiltredList = [];
  public sectionId = [];
  constructor(public translate: TranslateService, private sectionService: SectionService) {
    this.initDataSource();
  }

  public initDataSource() {
    this.sectionService.getJavaGenericService().getEntityList()
      .subscribe((data) => {
        this.sectionId = data;
        this.sectionFiltredList = this.sectionId.slice(0);
      });
  }

  handleFilterParentCode(value): void {
    this.sectionFiltredList = this.sectionId.filter((s) =>
      s.reference.toString().includes(value)
      || s.designation.toLocaleLowerCase().includes(value.toLowerCase()));
  }

  public onSelect(event): void {
    this.selectedSectionId.emit(event);
  }

  ngOnInit() {
  }

}
