import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {GenericAccountingService} from '../../../accounting/services/generic-accounting.service';
import {ComboBoxComponent} from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-journal-dropdown',
  templateUrl: './journal-dropdown.component.html',
  styleUrls: ['./journal-dropdown.component.scss']
})
export class JournalDropdownComponent implements OnInit {
  @Input() form: FormGroup;
  public journalFiltredList = [];
  public selectedJournalInFilter: any;
  @Output() selectedValue = new EventEmitter<boolean>();
  constructor(private genericAccountingService: GenericAccountingService) { }
  @ViewChild(ComboBoxComponent) public journalComponent: ComboBoxComponent;
  ngOnInit() {
    this.initJournalFilteredList();
  }

  public handleFilterJournal(writtenValue) {
    this.journalFiltredList = this.genericAccountingService.getJournalFilteredListByWrittenValue(writtenValue);
  }
  public journalValueChange($event) {
    this.selectedValue.emit($event);
  }
  public initJournalFilteredList() {
    this.genericAccountingService.getJournalList().then((journalList: any) => {
      this.journalFiltredList = journalList;
    });
  }

}
