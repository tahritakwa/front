import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { NumberConstant } from '../../../../constant/utility/number.constant';
import {FiltrePredicateModel} from '../../../../models/shared/filtrePredicate.model';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-filtre-input',
  templateUrl: './filtre-input.component.html',
  styleUrls: ['./filtre-input.component.scss']
})
export class FiltreInputComponent implements OnInit {
  @Input() public filtreFieldsInputs: FiltrePredicateModel[] = [];
  @Input() public buttonLabel = 'MORE_FILTRE';
  @Input() public onlyOneCheckedDropdown = false;
  @Output() public filtreFieldsInputsToSend = new EventEmitter<any>();
  public checkedInput: boolean[] = [];

  /**
   *
   * @param translate
   */
  constructor(public translate: TranslateService) { }

  ngOnInit() {
    this.fillDefaultCheckedInputs();
  }

  public fillDefaultCheckedInputs() {
    if (this.checkedInput.length === NumberConstant.ZERO) {
      this.filtreFieldsInputs.sort((a, b) =>
      this.translate.instant(a.label.toUpperCase()).localeCompare(this.translate.instant(b.label.toUpperCase())));
      this.filtreFieldsInputs.forEach((filtreInput: FiltrePredicateModel) => {
        this.checkedInput.push(filtreInput.checkedInput ? filtreInput.checkedInput : false);
      });
    }
  }

  changeFiltre(filtre: FiltrePredicateModel, index: number) {
    this.checkedInput[index] = !this.checkedInput[index];
    const filterToSend = {'isCheckedInput': this.checkedInput[index], 'fieldInput': filtre};
    this.filtreFieldsInputsToSend.emit(filterToSend);
  }


  onLabelClick(filtreInput: FiltrePredicateModel, i: number) {
    if (this.onlyOneCheckedDropdown) {
      this.changeFiltre(filtreInput, i);
    } else {
      event.stopPropagation();
    }
  }

  public fillCheckedInputs() {
    this.checkedInput =[];
      this.filtreFieldsInputs.forEach((filtreInput: FiltrePredicateModel) => {
        this.checkedInput.push(filtreInput.checkedInput ? filtreInput.checkedInput : false);
      });
  }
}
