import { Component, OnInit, Input } from '@angular/core';
import { EnumValues } from 'enum-values';
import { ImmobilizationType } from '../../../models/enumerators/immobilization-type.enum';

@Component({
  selector: 'app-immobilization-type-combobox',
  templateUrl: './immobilization-type-combobox.component.html',
  styleUrls: ['./immobilization-type-combobox.component.scss']
})
export class ImmobilizationTypeComboboxComponent implements OnInit {

  @Input() form;
  public immobilizationTypes: any;
  @Input() styleDeprectionPeriod;
  @Input() isFromActif;
  @Input() fieldName;


  constructor() { }

  ngOnInit() {
    this.immobilizationTypes = EnumValues.getNamesAndValues(ImmobilizationType);
    if(this.form.controls['ImmobilisationType'].value){
      if(!this.isFromActif) {
        this.form.controls['ImmobilisationType'].setValue(this.immobilizationTypes.find(x => x.value == this.form.controls['ImmobilisationType'].value));
      } else {
        this.form.controls['ImmobilisationType'].setValue(this.immobilizationTypes.find(x => x.name == this.form.controls['ImmobilisationType'].value).value);
      }
    }
  }

  getStyle() {
    if (this.styleDeprectionPeriod) {
      let background = {
          'background': 'darkgrey'
        };
      return background;
    }
  }

}
