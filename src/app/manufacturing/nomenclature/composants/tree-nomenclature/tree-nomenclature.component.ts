import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ItemService} from '../../../../inventory/services/item/item.service';
import {ProductNomenclatureService} from '../../../service/product-nomenclature.service';
import {NomenclatureService} from '../../../service/nomenclature.service';
import {NomenclaturesConstant} from '../../../../constant/manufuctoring/nomenclature.constant';
import {NumberConstant} from '../../../../constant/utility/number.constant';
import {forkJoin} from 'rxjs/observable/forkJoin';
import {filter, flatMap} from 'rxjs/operators';
import {ProductNomenclatureConstant} from '../../../../constant/manufuctoring/productNomenclature.constant';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-tree-nomenclature',
  templateUrl: './tree-nomenclature.component.html',
  styleUrls: ['./tree-nomenclature.component.scss']
})
export class TreeNomenclatureComponent implements OnInit {

  @Input() idNomenclatureOnUpdate: number;
  public allChildrenByProductParent: any;
  public data: any[] = [];


  constructor(
    private router: Router,
    private itemService: ItemService,
    private productNomenclatureService: ProductNomenclatureService,
    private nomenclatureService: NomenclatureService
  ) {
  }


  /* method to collapse child of component (subProduct)
 * Set parent with bolder normal */
  collapseChild($event) {
    $event.originalEvent.srcElement.nextElementSibling.style = NomenclaturesConstant.NOMENCLATURE_STRUCTURE_NO_EXPAND_STYLE;
    $event.originalEvent.path[NumberConstant.ZERO].style = NomenclaturesConstant.NOMENCLATURE_STRUCTURE_NO_EXPAND_STYLE;
    $event.originalEvent.path[NumberConstant.TWO].style = NomenclaturesConstant.NOMENCLATURE_STRUCTURE_NO_EXPAND_STYLE;
  }

  /* method to expand child of component (subProduct)
  * Set parent with bolder style */
  expandChild($event: any) {
    $event.originalEvent.path[NumberConstant.ZERO].style = NomenclaturesConstant.NOMENCLATURE_STRUCTURE_TOGGLER_LARGE_STYLE;
    $event.originalEvent.path[NumberConstant.TWO].style = NomenclaturesConstant.NOMENCLATURE_STRUCTURE_EXPAND_STYLE;
    $event.node.children = [];
    forkJoin(this.nomenclatureService.getJavaGenericService()
        .getEntityById($event.node.data.id, NomenclaturesConstant.GET_PRODUCT_BY_PARENT_PRODUCT_ID),
      this.nomenclatureService.getJavaGenericService().getEntityById($event.node.data.id, NomenclaturesConstant.GET_FIRST_LEVEL_CHILDREN_BY_PRODUCT_ID)
        .pipe(flatMap((res1) => this.itemService.getAmountPerItem(res1))))
      .subscribe((result) => {
        result[1].forEach(async item => {
          const o = result[NumberConstant.ZERO].find(e => e.productId === item.IdItem !== undefined);
          item.nomenclatureId = o.nomenclatureId.id;
          item.description = item[NomenclaturesConstant.PRODUCT_Description];
          item.unite = item[NomenclaturesConstant.MESURE_UNIT];
          item.Quantity = parseInt(item.Quantity) * parseInt($event.node.data.quantity);
          if (item[NomenclaturesConstant.TOTAL_AMOUNT_WITH_CURRENCY] !== 0) {
            item.unitHtpurchasePrice = Number(item[NomenclaturesConstant.AMOUNT_WITH_CURRENCY]) * Number(item[NomenclaturesConstant.ITEM_QUANTITY]);
            item.unitHtpurchasePrice = `${item.unitHtpurchasePrice} ${item[NomenclaturesConstant.CURRENCY_SYMBOLE]}`;
          }
          const treeLine = this.checkComposantsExist(item.IdItem, item);
          if ($event.node.children.find(items => items.data.id === treeLine.data.id) === undefined) {
            $event.node.children.push(treeLine);
          }
        });
      });

  }

  /* Select event for one row to update some component -->redirect to nomenclature interface for update/add component*/
  nodeParentToUpdateComponent($event: any, id?: number) {
    this.idNomenclatureOnUpdate = (id !== undefined) ? id : $event.node.data.nomenclatureId;
    this.router.navigate([NomenclaturesConstant.URI_ADVANCED_EDIT.concat(String(this.idNomenclatureOnUpdate))], {
      queryParams: filter,
      skipLocationChange: true
    });
  }

  /*
* check if item in treeTable have a components
* */
  public checkComposantsExist(productId: any, nomenclature: any): any {
    const treeLine = {
        data: {
          id: productId,
          nomenclatureId: nomenclature.nomenclatureId,
          name: nomenclature.description,
          quantity: nomenclature.Quantity,
          unite: nomenclature.unite,
          unitHtpurchasePrice: nomenclature.unitHtpurchasePrice
        },
        children: ''
      }
    ;
    this.nomenclatureService.getJavaGenericService()
      .getEntityById(productId, NomenclaturesConstant.GET_PRODUCT_BY_PARENT_PRODUCT_ID)
      .subscribe(res => {
        if (res.length != 0) {
          treeLine.children = '[{}]';
        } else {
          treeLine.children = '';
        }
      });
    return treeLine;
  }

  /*get cost product from treeView for each product with nomenclature*/
  public async getNomenclatureCostFromTreeView(idProduit: any, nomenclature ?: any): Promise<any> {
    let unitHtpurchasePrice = NumberConstant.ZERO;
    await this.nomenclatureService.getJavaGenericService().getEntityById(idProduit,
      NomenclaturesConstant.GET_CHILDREN_BY_PRODUCT_ID).toPromise().then(res => {
      res.forEach(item => {
        let qteWithoutMultiplication = Number(item.quantity) * Number(nomenclature.Quantity);
        this.allChildrenByProductParent.subscribe(data => {
          const o = data.find(e => e.IdItem === item.idItem && e.Quantity === qteWithoutMultiplication);
          unitHtpurchasePrice += Number(o[NomenclaturesConstant.TOTAL_AMOUNT_WITH_CURRENCY]);
          nomenclature.unitHtpurchasePrice = unitHtpurchasePrice;
        });
      });
    });
    return new Promise(function (resolve) {
      resolve(nomenclature.unitHtpurchasePrice);
    });
  }

  /**
   * load products related to the nomenclature
   */
  public loadNomenclaturesDetails() {
    this.data = [];
    forkJoin(this.productNomenclatureService.getJavaGenericService()
        .getEntityById(this.idNomenclatureOnUpdate, ProductNomenclatureConstant.GET_PRODUCT_BY_NOMENCLATURE),
      this.nomenclatureService.getJavaGenericService()
        .getEntityById(this.idNomenclatureOnUpdate, NomenclaturesConstant.NOMENCLATURES_URL).pipe(
        flatMap((res1) => this.nomenclatureService.getJavaGenericService().getEntityById(res1.productId,
          NomenclaturesConstant.GET_FIRST_LEVEL_CHILDREN_BY_PRODUCT_ID)
        ), flatMap((res2) => this.itemService.getAmountPerItem(res2))))
      .subscribe(result => {
        result[NumberConstant.ONE].forEach(async item => {
          const o = result[NumberConstant.ZERO].find(e => e.productId === item.IdItem !== undefined);
          item.nomenclatureId = o.nomenclatureId.id;
          item.description = item[NomenclaturesConstant.PRODUCT_Description];
          item.unite = item[NomenclaturesConstant.MESURE_UNIT];
          if (item[NomenclaturesConstant.TOTAL_AMOUNT_WITH_CURRENCY] !== 0) {
            item.unitHtpurchasePrice = `${item[NomenclaturesConstant.TOTAL_AMOUNT_WITH_CURRENCY]} ${item[NomenclaturesConstant.CURRENCY_SYMBOLE]}`;
          }
          const treeLine = this.checkComposantsExist(item.IdItem, item);
          this.data.push(treeLine);
        });
      });
  }

  ngOnInit() {

    this.nomenclatureService.getJavaGenericService()
      .getEntityById(this.idNomenclatureOnUpdate, NomenclaturesConstant.NOMENCLATURES_URL).pipe(
      flatMap((res1) => this.nomenclatureService.getJavaGenericService().getEntityById(res1.productId,
        NomenclaturesConstant.GET_CHILDREN_BY_PRODUCT_ID)
      ), flatMap((res2) => this.itemService.getAmountPerItem(res2)))
      .subscribe(result => {
        this.allChildrenByProductParent = new Observable(observer => {
          observer.next(
            result
          );
        });
        this.loadNomenclaturesDetails();

      });
  }

}

