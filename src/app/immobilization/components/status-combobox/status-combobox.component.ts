import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-status-combobox',
  templateUrl: './status-combobox.component.html',
  styleUrls: ['./status-combobox.component.scss']
})
export class StatusComboboxComponent implements OnInit {
  @Input() form: FormGroup;
  // Status List
  public statusDataFilter: any[];
  public status = [{ 'id': 1, 'name': 'LIVING' }, { 'id': 2, 'name': 'BROKEN' }, { 'id': 3, 'name': 'STOCK' }];
  constructor(public translate: TranslateService) {
    this.status.forEach(obj => {

      translate.get(obj.name).subscribe(tr => obj.name = tr);
    });
  }
  handleFilterChange(writtenValue) {
    this.status = this.statusDataFilter.filter((s) =>
      s.name.toLowerCase().includes(writtenValue.toLowerCase())
      || s.name.toLocaleLowerCase().includes(writtenValue.toLowerCase())
    );
  }
  ngOnInit() {
    this.statusDataFilter = this.status;
  }
}
