import {Injectable} from '@angular/core';
import {TecDocArticleModel} from '../../../models/inventory/tec-doc-article.model';
import {DataSourceRequestState} from '@progress/kendo-data-query';
import {ColumnSettings} from '../../../shared/utils/column-settings.interface';
import {PageChangeEvent, GridDataResult} from '@progress/kendo-angular-grid';
import {Subject} from 'rxjs/Subject';
import { FilterSearchItem } from '../../../models/inventory/filter-search-item-model';
import { ItemConstant } from '../../../constant/inventory/item.constant';

@Injectable()
export class TecdocService {
  gridView: GridDataResult;
  public detelctChange: boolean;
  IsOnlyTecdoc: boolean;
  public tecdocSearchModeChange: Subject<string> = new Subject<string>();
  public filterSearchItem: FilterSearchItem;
  public searchTecDocLabel = ItemConstant.GENERAL_SEARCH;

  constructor() {
  }

  public gridState: DataSourceRequestState = {
    skip: 0,
    take: 10,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };


  public columnsConfig: ColumnSettings[] = [
    {
      field: 'Description',
      title: 'PRODUCTS',
      filterable: true,
      _width: 300
    },
    {
      field: 'NameTiers',
      title: 'SUPPLIERS',
      filterable: true,
      _width: 180
    },
    {
      field: 'IsInDb',
      title: 'Registered',
      filterable: true
    },
    {
      field: 'AllAvailableQuantity',
      title: 'QTE_TOT',
      _width: 90,
      filterable: true
    },
    {
      field: 'WarhouseAvailableQuantity',
      title: 'CURRENT_WAREHOUSE',
      _width: 90,
      filterable: true,
      hidden: true
    },
    {
      field: 'UnitHtsalePrice',
      title: 'PUHT',
      filterable: true,
      _width: 150,
      hidden: false
    },
    {
      field: 'LabelProduct',
      title: 'PRODUCT_BRAND',
      filterable: true,
      _width: 100
    },
  ];

  public SelectedArticle: TecDocArticleModel;

  PCId: number;

  ProductId: number;

  public articleList: Array<TecDocArticleModel>;
  public articleListFiltered: Array<TecDocArticleModel>;
  public articleListNotFiltered: Array<TecDocArticleModel>;

  public filterstorage = {
    manufacturer: {
      list: [],
      selected: null
    },
    model: {
      list: [],
      selected: null
    },
    passangerCar: {
      list: [],
      selected: null
    },
    tree: {
      root: {
        list: [],
        selected: null
      },
      node1: {
        list: [],
        selected: null
      },
      node2: {
        list: [],
        selected: null
      },
      node3: {
        list: [],
        selected: null
      }
    },
    article: {
      list: [],
      selected: null
    }

  };

  public caracteristics = {
    marque: '',
    seriesModel: '',
    passangerCar: '',
    category: '',
    product: ''

  };

  filtered: boolean;

  public setarticles(articleList: TecDocArticleModel[], PCId?: number, ProductId?: number) {
    this.gridState.skip = 0;
    this.gridState.take = 10;
    this.articleListNotFiltered = articleList;
    this.Preparefilter();
    this.filter(this.filtered);
    this.loadItems();
    this.PCId = PCId;
    this.ProductId = ProductId;
    this.detelctChange = true;
  }

  public filter(filter: boolean) {
    if (this.IsOnlyTecdoc) {
      this.articleList = this.articleListNotFiltered.filter(item => item.ItemInDB === null);
    } else {
      this.filtered = filter;
      if (filter) {
        this.articleList = this.articleListFiltered;
      } else {
        this.articleList = this.articleListNotFiltered;
      }
    }
  }

  Preparefilter() {
    this.articleListFiltered = new Array<TecDocArticleModel>();
    for (const article of this.articleListNotFiltered) {
      if (!article.ItemInDB) {
        return;
      }
      this.articleListFiltered.push(article);
    }
  }

  public pageChange(event: PageChangeEvent): void {
    this.gridState.skip = event.skip;
    this.loadItems();
  }

  private loadItems(): void {
    this.gridView = {
      data: this.articleList.slice(this.gridState.skip, this.gridState.skip + this.gridState.take),
      total: this.articleList.length
    };
  }
}
