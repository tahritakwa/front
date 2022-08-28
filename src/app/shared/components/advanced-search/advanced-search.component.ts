import { TierCategoryDropdownComponent } from './../tier-category-dropdown/tier-category-dropdown.component';
import { Component, EventEmitter, Input, OnInit, Output, ViewChildren } from '@angular/core';
import { Filter, Operator } from '../../utils/predicate';
import { StyleConstant } from '../../../constant/utility/style.constant';
import { FiltrePredicateModel } from '../../../models/shared/filtrePredicate.model';
import { FiltrePredicateComponent } from './filtre-predicate/filtre-predicate.component';
import { SharedConstant } from '../../../constant/shared/shared.constant';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss']
})
export class AdvancedSearchComponent implements OnInit {
  @Input() public filtreFieldsColumns: FiltrePredicateModel[] = [];
  @Input() public filtreFieldsInputs: FiltrePredicateModel[] = [];
  @Input() public fromBalancePurchase = false;
  @Output() public filtrePredicateToSend = new EventEmitter<Filter>();
  @Output() public predicateOperator = new EventEmitter<Operator>();
  @Output() public searchClickEvent = new EventEmitter<boolean>();
  @Output() public resetClickEvent = new EventEmitter<boolean>();
  @Output() public filterFieldsInputsChange = new EventEmitter<any>();
  @ViewChildren(FiltrePredicateComponent) filtrePredicateComponent;
  public isContentVisible = false;
  public fieldsetBorderShowed = StyleConstant.BORDER_SOLID;
  public fieldsetBorderHidden = StyleConstant.BORDER_NONE;
  public fieldsetBorderStyle: string;
  public filtreToSendToGrid: Filter;
  public resetFieldValue = false;
  public isBtnSearchDisabled = false;
  parentFilters = [];
  constructor() {
    this.fieldsetBorderStyle = this.fieldsetBorderHidden;
  }

  ngOnInit() {
  }

  showContent() {
    this.isContentVisible = true;
    this.fieldsetBorderStyle = this.fieldsetBorderShowed;
  }

  hideContent() {
    this.isContentVisible = false;
    this.fieldsetBorderStyle = this.fieldsetBorderHidden;
    this.resetClickEvent.emit(true);
    this.filtreFieldsInputs.forEach((filtreInput: FiltrePredicateModel) => {
      this.filtreFieldsColumns =
        this.filtreFieldsColumns.filter(filtrePredicate => filtrePredicate.columnName !== filtreInput.columnName);
    });
  }

  /**
   * send the selected filtre to the parent componenet
   * @param filtre
   */
  handleFiltreOperator(filtre) {
    this.filtreToSendToGrid = filtre;
    this.filtrePredicateToSend.emit(this.filtreToSendToGrid);
  }

  /**
   * on search click event
   */
  onSearchClick() {
    this.searchClickEvent.emit(true);
  }

  /**
   * Reset field values
   */
  resetFieldValues(initDataSource?) {
    this.filtrePredicateComponent.last.formGroupFilter.controls[SharedConstant.STATUS].setValue(undefined);
    this.filtrePredicateComponent.last.formGroupFilter.controls[SharedConstant.STATE].setValue(undefined);
    this.resetFieldValue = !this.resetFieldValue;
    if (initDataSource) {
      this.resetClickEvent.emit(this.resetFieldValue);
    }
  }

  getFiltreFieldsConfig(filter) {
    if (filter.isCheckedInput) {
      this.filtreFieldsColumns.push(new FiltrePredicateModel(filter.fieldInput.label, filter.fieldInput.type, filter.fieldInput.columnName,
        filter.fieldInput.isSpecificFiltre, filter.fieldInput.module, filter.fieldInput.model, filter.fieldInput.propertyOfParentEntity,
        filter.fieldInput.filtreProp, filter.fieldInput.documentType, filter.fieldInput.placeHolder));
    } else {
      this.filtreFieldsColumns =
        this.filtreFieldsColumns.filter(filtrePredicate => filtrePredicate.columnName !== filter.fieldInput.columnName);
      this.filterFieldsInputsChange.emit(filter);
    }
    this.initChild();

  }

  public handleOtherFilter(filterType) {
    const target = this.filtrePredicateComponent.filter(x => x.type === filterType.filter)[0];
    if (target) {
      if (filterType.filter === 'cityDropdownComponent') {
        if (filterType.value) {
          target.CityDropdownComponent.setCityData(filterType.value);
          target.CityDropdownComponent.group.controls['IdCity'].setValue(null);
        } else {
          target.CityDropdownComponent.countryId = null;
          target.CityDropdownComponent.initDataSource();
        }
      } else if (filterType.filter === 'countryDropdownComponent') {
        target.CountryDropdownComponent.setCountryData(filterType.value);
      }
    }
  }
  initChild() {
    if (this.filtreFieldsColumns.filter(x => x.type === 'cityDropdownComponent').length !== 0) {
      let countryFilter = this.filtrePredicateComponent.filter(x => x.type === 'countryDropdownComponent')[0];
      this.filtreFieldsColumns.filter(x => x.type === 'cityDropdownComponent')[0].parentID = countryFilter.filtreValue;
    }
  }
}
