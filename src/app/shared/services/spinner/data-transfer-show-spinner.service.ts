import { Injectable } from '@angular/core';



@Injectable()
export class DataTransferShowSpinnerService {

  private hideSpinner = false;

  constructor() { }


  getShowSpinnerValue () {
    return this.hideSpinner;
  }

  setShowSpinnerValue (hideSpinner) {
    this.hideSpinner = hideSpinner;
  }


}
