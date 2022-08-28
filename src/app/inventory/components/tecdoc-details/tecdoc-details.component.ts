import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Item } from '../../../models/inventory/item.model';
import { ItemService } from '../../services/item/item.service';
import { TecdocDetails } from '../../../models/inventory/tecdoc-details.model';
import { TecdocCarDetails } from '../../../models/inventory/tecdoc-car-details.model';
import { GroupByPipe } from 'ngx-pipes';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { TecdocMediaDetails } from '../../../models/inventory/tecdoc-media-details.model';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-tecdoc-details',
  templateUrl: './tecdoc-details.component.html',
  styleUrls: ['./tecdoc-details.component.scss'],
  providers: [GroupByPipe]
})
export class TecdocDetailsComponent implements OnInit {

  @Input() isModal: boolean;
  @Input() selectedItem: Item;
  @ViewChild('carousel') carousel: NgbCarousel;
  isPassangercarOpen = false;
  isEnginesOpen = false;
  isMediaOpen = false;
  tecdocDetails = new TecdocDetails();
  tecdocCarDetails = new Array<TecdocCarDetails>();
  tecdocMedia = new Array<TecdocMediaDetails>();
  tecdocEngines: string[];
  enginesearch = '';
  showAll: any;
  isBrandInfoOpen = false;
  BrandInfo: any;
  isAllBrand = false;

  constructor(public itemService: ItemService, private groupPipe: GroupByPipe,
    private growlService: GrowlService, private translate: TranslateService) { }

  ngOnInit() {
    if (!this.selectedItem.TecDocId) {
      this.selectedItem.TecDocId = this.selectedItem.Id;
    }
    this.itemService.getTecdocDetails(this.selectedItem).subscribe(data => {
      this.tecdocDetails = data;
      if (this.tecdocDetails.Id === 0) {
        this.growlService.warningNotification(this.translate.instant('TECDOC_VERSION_TECDOC'));
      } else {
        this.getTopBrandInfo(data.SupplierId);
        let listInfo = [];
        try {
          let information = JSON.parse(data.Information);
          information.forEach(info => {
            let inf = {
              infotype: info.infotype,
              value: info.value.split('-')
            };

            listInfo.push(inf);

          });
          this.tecdocDetails.Information = listInfo;
        } catch (e) {
          this.tecdocDetails.Information = null;
        } finally {
          this.tecdocDetails.Criteria = JSON.parse(data.Criteria);
          this.tecdocDetails.OemNumbers = (JSON.parse(data.OemNumbers));
          this.getTopBrandInfo(data.SupplierId);
        }
      }
    });

  }



  getPassengerCars() {
    if (!this.showAll) {
      this.itemService.getPassengerCar(this.selectedItem).subscribe(data => {
        this.tecdocCarDetails = data;
      });
      this.isPassangercarOpen = true;
      this.showAll = true;
    }
  }

  getTopPassengerCars() {
    if (!this.isPassangercarOpen) {
      this.itemService.getTopPassengerCars(this.selectedItem).subscribe(data => {
        if (data.length === 100) {
          this.tecdocCarDetails = data.slice(0, 99);
          this.showAll = false;
        } else {
          this.tecdocCarDetails = data;
          this.showAll = true;
        }
      });
      this.isPassangercarOpen = true;
    }
  }

  getTopBrandInfo(TecDocIdSupplier?) {
    if (!this.isBrandInfoOpen) {
      this.itemService.getTopBrandInfo(TecDocIdSupplier ?
        TecDocIdSupplier : TecDocIdSupplier).subscribe(data => {
          this.BrandInfo = data;
          this.isBrandInfoOpen = true;
        });
    }
  }
  getAllBrandInfo() {
    if (!this.isAllBrand) {
      this.itemService.getAllBrandInfo(this.selectedItem.TecDocIdSupplier ?
        this.selectedItem.TecDocIdSupplier : this.selectedItem.IdSupplier).subscribe(data => {
          this.BrandInfo = data;
          this.isBrandInfoOpen = true;
          this.isAllBrand = true;
        });
    }
  }

  getEngines() {
    if (!this.isEnginesOpen) {
      this.itemService.getEngines(this.selectedItem).subscribe(data => {
        this.tecdocEngines = data;
      });
      this.isEnginesOpen = true;
    }
  }

  getMedia() {
    if (!this.isMediaOpen) {
      this.itemService.getMedias(this.selectedItem).subscribe(data => {
        this.tecdocMedia = data.filter(x => x.mediaType === 1);
      });
      this.isMediaOpen = true;
    }
  }


  updateClass(engine: string) {
    if (this.toShowInSearch(engine)) {
      return 'primary';
    } else {
      return 'secondary';
    }
  }


  normalise(str: string) {
    return str.toUpperCase().replace(/[^\w\s]/g, '').replace(/ /g, '').trim();
  }
  toShowInSearch(engine) {
    return (engine && this.normalise(this.enginesearch) && (this.normalise(engine).includes(this.normalise(this.enginesearch))))
  }
  getevents(event) {
  }
}
