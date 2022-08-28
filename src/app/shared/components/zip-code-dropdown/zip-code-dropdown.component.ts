import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ComponentsConstant } from '../../../constant/shared/components.constant';
import { ZipCode } from '../../../models/shared/zip-code';
import { ZipCodeService } from '../../services/zip-code/zip-code.service';
import { OrderBy, PredicateFormat } from '../../utils/predicate';

@Component({
  selector: 'app-zip-code-dropdown',
  templateUrl: './zip-code-dropdown.component.html',
  styleUrls: ['./zip-code-dropdown.component.scss']
})
export class ZipCodeDropdownComponent implements OnInit {

  @Input() form: FormGroup;
  @Input() allowCustom;
  @Input() idZipColName: string;
  @Input() disabled;

  public ZipCodeData: ZipCode[];
  public ZipCodeFiltredData: ZipCode[];

  constructor(private zipCodeService: ZipCodeService) { }

  ngOnInit() {
    this.initDataSource();

    if (!this.idZipColName) {
      this.idZipColName = ComponentsConstant.ID_ZIP_CODE;
    }
  }
  /**
   * prepare User Predicate
   * */
  prepareUserPredicate() {
    const myPredicate = new PredicateFormat();
    myPredicate.OrderBy = new Array<OrderBy>();

    return myPredicate;
  }
  /**
   * init Data Source
   * */
  initDataSource(): void {

    this.zipCodeService.callPredicateData(this.prepareUserPredicate()).subscribe(data => {
      this.ZipCodeData = data;
      this.ZipCodeFiltredData = this.ZipCodeData.slice(0);
    });

  }


}
