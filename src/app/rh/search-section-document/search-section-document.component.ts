import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {StockDocumentConstant} from '../../constant/inventory/stock-document.constant';
import {AdministrativeDocumentConstant} from '../../constant/payroll/administrative-document-constant';
import {SharedDocumentConstant} from '../../constant/payroll/shared-document.constant';
import {NumberConstant} from '../../constant/utility/number.constant';
import {Filter, Operation, Operator, PredicateFormat} from '../../shared/utils/predicate';

@Component({
  selector: 'app-search-section-document',
  templateUrl: './search-section-document.component.html',
  styleUrls: ['./search-section-document.component.scss']
})
export class SearchSectionDocumentComponent implements OnInit {
  @Input() showAllEmployee;
  @Output() filterChanged = new EventEmitter<any>();

  public selectedCollaboraters: number[] = [];
  public searchFormGroup: FormGroup;
  public predicate: PredicateFormat;
  public minDate: Date;
  public maxDate: Date;
  public selectedType: number;

  constructor(private fb: FormBuilder) {
  }

  /**
   *  Start Date getter
   */
  get StartDocumentDate(): FormControl {
    return this.searchFormGroup.get(StockDocumentConstant.START_DOCUMENT_DATE) as FormControl;
  }

  /**
   *  End Date getter
   */
  get EndDocumentDate(): FormControl {
    return this.searchFormGroup.get(StockDocumentConstant.END_DOCUMENT_DATE) as FormControl;
  }

  get IdDocumentRequestType(): FormControl {
    return this.searchFormGroup.get(StockDocumentConstant.ID_DOCUMENT_REQUEST_TYPE) as FormControl;
  }

  /**
   * initialize component
   */
  ngOnInit() {
    this.createSearchForm();
  }

  public onChangeStartDocumentDate(): void {
    if (this.EndDocumentDate.value && this.StartDocumentDate.value && this.EndDocumentDate.value < this.StartDocumentDate.value) {
      this.EndDocumentDate.setValue(this.StartDocumentDate.value);
      this.maxDate = this.EndDocumentDate.value;
    } else {
      this.minDate = this.StartDocumentDate.value;
    }
    this.preparePredicate();
  }

  public onChangeEndDocumentDate(): void {
    if (this.StartDocumentDate.value && this.EndDocumentDate.value && this.EndDocumentDate.value < this.StartDocumentDate.value) {
      this.StartDocumentDate.setValue(this.EndDocumentDate.value);
      this.minDate = this.StartDocumentDate.value;
    } else {
      this.maxDate = this.EndDocumentDate.value;
    }
    this.preparePredicate();
  }

  /**
   * When user choose a specific employees
   * @param $event
   */
  employeeSelected($event) {
    this.selectedCollaboraters = $event.selectedValueMultiSelect;
    this.preparePredicate();
  }

  typeSelected($event) {
    this.selectedType = $event;
    this.preparePredicate();
  }

  /**
   * prepare predicate and notice parent with the changement
   */
  public onSearch() {
    this.preparePredicate();
  }

  /**
   * Prepare Predicate
   */
  public preparePredicate(): void {
    this.predicate = new PredicateFormat();
    this.predicate.Operator = Operator.and;
    this.predicate.Filter = new Array<Filter>();
    this.prepareCollaboraterPredicate();
    this.prepareTypePredicate();
    this.preparePeriodPredicate();
    this.filterChanged.emit(this.predicate);
  }

  public preparePeriodPredicate() {

    if (this.minDate) {
      this.predicate.Filter.push(new Filter(SharedDocumentConstant.SUBMISSION_DATE, Operation.gte, this.minDate));
    }
    if (this.maxDate) {
      this.maxDate.setDate(this.maxDate.getDate() + NumberConstant.ONE);
      this.predicate.Filter.push(new Filter(SharedDocumentConstant.SUBMISSION_DATE, Operation.lte, this.maxDate));
    }

  }

  public prepareCollaboraterPredicate() {
    if (this.selectedCollaboraters.length > NumberConstant.ZERO) {
      this.selectedCollaboraters.forEach(Id => {
        this.predicate.Filter.push(new Filter(AdministrativeDocumentConstant.EMPLOYEE_ID, Operation.eq, Id, false, true));
      });
    }
  }

  public prepareTypePredicate() {
    if (this.selectedType) {
      this.predicate.Filter.push(new Filter(AdministrativeDocumentConstant.ID_TYPE,
        Operation.eq, this.selectedType));
    }
  }

  /**
   * Create resignation form
   */

  private createSearchForm(): void {
    this.searchFormGroup = this.fb.group({
      StartDocumentDate: [],
      EndDocumentDate: [],
      IdDocumentRequestType: []
    });
  }
}
