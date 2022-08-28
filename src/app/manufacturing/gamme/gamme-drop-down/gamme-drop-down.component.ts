import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { GammeService } from '../../service/gamme.service';

@Component({
  selector: 'app-gamme-drop-down',
  templateUrl: './gamme-drop-down.component.html',
  styleUrls: ['./gamme-drop-down.component.scss']
})
export class GammeDropDownComponent implements OnInit {
  @Input() form: FormGroup;
  @Output() selectedGammeId = new EventEmitter<boolean>();
  public gammeFiltredList = [];
  public gammeId = [];
  constructor(public translate: TranslateService, private gammeService: GammeService) {
    this.initDataSource();
  }


  public initDataSource() {
    this.gammeService.getJavaGenericService().getEntityList()
      .subscribe((data) => {
        this.gammeId = data;
        this.gammeFiltredList = this.gammeId.slice(0);
      });
  }

  handleFilterParentCode(value): void {
    this.gammeFiltredList = this.gammeId.filter((s) =>
      s.designation.toLowerCase().includes(value.toLowerCase())
    );
  }

  public onSelect($event): void {
    this.selectedGammeId.emit($event);
  }

  ngOnInit() {
  }

}
