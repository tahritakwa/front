import { Component, OnInit, Input } from '@angular/core';
import { CompanyService } from '../../../administration/services/company/company.service';

@Component({
  selector: 'app-company-combobox',
  templateUrl: './company-combobox.component.html',
  styleUrls: ['./company-combobox.component.scss']
})
export class CompanyComboboxComponent implements OnInit {
  @Input() group;
  comapniesDataSource: any[];
  companiesFiltredDataSource: any[];

  constructor(private companyService: CompanyService) { }

  ngOnInit() {
    this.initDataSource();
  }

  initDataSource() {
    this.companyService.getAllMasterCompanies().subscribe(data => {
      this.comapniesDataSource = data;
    });
  }

  /**
   * filter by designation
   * @param value
   */
  handleFilter(value: string): void {
    this.companiesFiltredDataSource = this.comapniesDataSource.filter((s) =>
      s.Name.toLowerCase().includes(value.toLowerCase()) || s.Code.toLowerCase().includes(value.toLowerCase()));
  }

}
