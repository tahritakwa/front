import { Component, OnInit, Input, ViewChild, ViewChildren } from '@angular/core';
import { Item } from '../../../models/inventory/item.model';
import { ItemService } from '../../services/item/item.service';
import { TecdocDetails } from '../../../models/inventory/tecdoc-details.model';
import { TecdocCarDetails } from '../../../models/inventory/tecdoc-car-details.model';
import { GroupByPipe } from 'ngx-pipes';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { TecdocMediaDetails } from '../../../models/inventory/tecdoc-media-details.model';
import { TecDocRowItem } from '../../../models/inventory/TedDocRowItem';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { TranslateService } from '@ngx-translate/core';
import { GridComponent } from '@progress/kendo-angular-grid';


@Component({
  selector: 'app-tecdoc-details-api',
  templateUrl: './tecdoc-details-api.component.html',
  styleUrls: ['./tecdoc-details-api.component.scss'],
  providers: [GroupByPipe]
})
export class TecdocDetailsApiComponent implements OnInit {


  @Input() isModal: boolean;
  @Input() selectedItem: any;
  @ViewChild('carousel') carousel: NgbCarousel;
  @ViewChild('cargrid') public grid: GridComponent;
  isPassangercarOpen = false;
  isEnginesOpen = false;
  isMediaOpen = false;
  tecdocDetails = new TecDocRowItem();
  tecdocCarDetails = new Array<TecdocCarDetails>();
  tecdocMedia = new Array<TecdocMediaDetails>();
  tecdocEngines: string[];
  enginesearch = '';
  showAll: any;
  isBrandInfoOpen = false;
  BrandInfo: any;
  isAllBrand = false;
  ListBrands: any;
  description: string;
  isDocumentOpen = false;
  tecdocDocuments: any;

  constructor(public itemService: ItemService, private groupPipe: GroupByPipe,
    private growlService: GrowlService, private translate: TranslateService) { }

  ngOnInit() {
    this.tecdocDetails = new TecDocRowItem();
    if (!this.selectedItem.TecDocId) {
      this.selectedItem.TecDocId = this.selectedItem.Id;
    }
    if (this.selectedItem.IsInDb === false) {
      this.selectedItem.TecDocIdSupplier = this.selectedItem.IdSupplier;
      this.selectedItem.TecDocRef = this.selectedItem.Reference;
    }
    this.itemService.getTecdocDetailsApi(this.selectedItem).subscribe(data => {
      this.tecdocDetails = data;
      if (this.tecdocDetails.DataSupplierId !== 0) {
        this.description = this.tecdocDetails.GenericArticles.map(x => x.genericArticleDescription).join(' - ');
        this.getTopBrandInfo(data.DataSupplierId);
      } else {
        this.growlService.warningNotification(this.translate.instant('TECDOC_VERSION_TECDOC'));
      }
    });
  }



  getPassengerCars() {
    if (!this.showAll) {
      this.grid.loading = true;
      this.itemService.getPassengerCar(this.selectedItem).subscribe(data => {
        this.tecdocCarDetails = data;
        this.grid.loading = false;
      });
      this.isPassangercarOpen = true;
      this.showAll = true;
    }
  }

  getTopPassengerCars() {
    if (!this.isPassangercarOpen) {
      this.grid.loading = true;
      this.itemService.getTopPassengerCarsApi(this.selectedItem).subscribe(data => {
        if (data.length === 100) {
          this.tecdocCarDetails = data.slice(0, 99);
          this.showAll = false;
        } else {
          this.tecdocCarDetails = data;
          this.showAll = true;
        }
        this.grid.loading = false;
      });
      this.isPassangercarOpen = true;
    }
  }

  getMotorList(array: any) {
    let lis = array.map(x => x.MotorCode);
    return lis;
  }

  getYear(date) {
    return Math.floor(date / 100);
  }

  getTopBrandInfo(TecDocIdSupplier?) {
    if (!this.isBrandInfoOpen) {
      this.itemService.getBrandInfo(TecDocIdSupplier ?
        TecDocIdSupplier : TecDocIdSupplier).subscribe(data => {
          this.ListBrands = data;
          this.BrandInfo = this.ListBrands[0];
          this.isBrandInfoOpen = true;
        });
    }
  }

  selectbrand(index) {
    this.BrandInfo = this.ListBrands[index];
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
  getDocument() {
    if (!this.isDocumentOpen) {
      this.itemService.getDocuments(this.selectedItem).subscribe(data => {
        this.tecdocDocuments = data.Pdfs;
      });
      this.isDocumentOpen = true;
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

  OpenDocumentLink(url) {
    window.open(url);
  }
}
