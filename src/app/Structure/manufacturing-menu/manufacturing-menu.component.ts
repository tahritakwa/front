import {Component, DoCheck} from '@angular/core';
import {Router} from '@angular/router';
import {SharedConstant} from '../../constant/shared/shared.constant';

@Component({
  selector: 'app-manufacturing-menu',
  templateUrl: './manufacturing-menu.component.html',
  styleUrls: ['./manufacturing-menu.component.scss']
})

export class ManufacturingMenuComponent implements DoCheck {
  isManufacturingLink: boolean;

  constructor(private router: Router) {
  }

  ngDoCheck() {
    this.idManufacturingForm();
  }

  idManufacturingForm() {
    if (this.router.url.indexOf(SharedConstant.NOMENCLATURE) || this.router.url.indexOf(SharedConstant.GAMME)
      || this.router.url.indexOf(SharedConstant.FABRICATION_ARRANGEMENT)) {
      this.isManufacturingLink = true;

    } else {
      this.isManufacturingLink = false;
    }
  }

}
