import {FormControl, FormGroup} from '@angular/forms';
import {Component, Input, OnInit} from '@angular/core';
import {TaxeService} from '../../../administration/services/taxe/taxe.service';
import {TaxeItem} from '../../../models/administration/taxe-item.model';
import {Taxe} from '../../../models/administration/taxe.model';
import {DropDownComponent} from '../../interfaces/drop-down-component.interface';
import {PredicateFormat, Relation} from '../../utils/predicate';
import {Company} from '../../../models/administration/company.model';
import {CompanyService} from '../../../administration/services/company/company.service';

const ID = 'Id';
const TAXE_ITEM = 'TaxeItem';

@Component({
  selector: 'app-taxe-multiselect',
  templateUrl: './taxe-multiselect.component.html',
  styleUrls: ['./taxe-multiselect.component.scss']
})
export class TaxeMultiselectComponent implements OnInit, DropDownComponent {
  @Input() itemForm: FormGroup;
  public taxeDataSource: Taxe[];
  public taxeFiltredDataSource: Taxe[];
  predicate: PredicateFormat;
  public selectedValues: number[];
  @Input() readonly: boolean;
  @Input() defaultCodeTaxe;
  @Input() addMode;
  public company;
  @Input() required : boolean;
  constructor(private taxeService: TaxeService, private companyService: CompanyService) {
  }

  ngOnInit() {
    this.preparePredicate();
    this.initDataSource();

  }

  ngAfterViewInit(): void {
    document.getElementById('TaxeItem').focus();
    document.getElementById('TaxeItem').setAttribute('class', 'ng-valid');
  }

  preparePredicate() {
    this.predicate = new PredicateFormat();
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push(new Relation('TaxeGroupTiersConfig'));
    return this.predicate;
  }

  initDataSource(): void {
    this.taxeService.listdropdownWithPerdicate(this.predicate).subscribe((res: any) => {
      this.taxeDataSource = res.listData.filter(data => data.TaxeGroupTiersConfig && data.TaxeGroupTiersConfig.length > 0);
      this.taxeFiltredDataSource = this.taxeDataSource.slice(0);
      this.getCurrentDefaultTax();
    });
  }

  /**
   * filter by code taxe and label
   * @param value
   */
  handleFilter(value: string): void {
    this.taxeFiltredDataSource = this.taxeDataSource.filter((s) =>
      s.CodeTaxe.toLowerCase().includes(value.toLowerCase())
      || s.Label.toLowerCase().includes(value.toLowerCase()));
  }

  addNew(): void {
    throw new Error('Method not implemented.');
  }

  get TaxeItem(): FormControl {
    return <FormControl>this.itemForm.get(TAXE_ITEM);
  }

  get selectedTaxeItems(): TaxeItem[] {
    const selectedTaxes = new Array<TaxeItem>();
    if (this.selectedValues) {
      this.selectedValues.forEach((x) => {
        selectedTaxes.push(new TaxeItem(x, this.itemForm.get(ID).value));
      });
    }
    return selectedTaxes;
  }

  public getCurrentDefaultTax() {
    if (this.addMode) {
      this.selectedValues = [];
      this.companyService.getCurrentCompany().subscribe((data: Company) => {
        this.company = data;
        this.selectedValues.push(this.company.IdDefaultTax);
      });
    }
  }
}
