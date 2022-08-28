import {DocumentConstant} from '../../constant/sales/document.constant';
import {TiersConstants} from '../../constant/purchase/tiers.constant';
import {DocumentEnumerator, documentStatusCode} from '../../models/enumerators/document.enum';
import {PurchaseRequestConstant} from '../../constant/purchase/purchase-request.constant';
import {isNullOrUndefined} from 'util';
import {isNotNullOrUndefinedAndNotEmptyValue} from '../../stark-permissions/utils/utils';
import {FormGroup} from '@angular/forms';
import {StockDocumentConstant} from '../../constant/inventory/stock-document.constant';
import {DatePipe} from '@angular/common';

export class PredicateFormat {
  Filter: Array<Filter>;
  SpecFilter: Array<SpecFilter>;
  OrderBy: Array<OrderBy>;
  Relation: Array<Relation>;
  SpecificRelation: Array<string>;
  Operator: Operator;
  page: Number;
  pageSize: Number;
  values: Array<Number>;
  IsDefaultPredicate?: boolean;

  constructor() {
  }

  /**
   * prepare Document Predicate
   * @param status
   * @param type
   * @param isRestaurant
   */
  public static prepareDocumentPredicate(status: number, type: string, isRestaurant?: boolean): PredicateFormat {
    const myPredicate = new PredicateFormat();
    myPredicate.Filter = new Array<Filter>();
    myPredicate.OrderBy = new Array<OrderBy>();
    // if status equal to zero => All documents in current type
    if (status !== 0) {
      myPredicate.Filter.push(new Filter(DocumentConstant.DOCUMENT_TYPE_CODE, Operation.eq, type),
        new Filter(DocumentConstant.ID_DOCUMENT_STATUS, Operation.eq, status));
    } else {
      myPredicate.Filter.push(new Filter(DocumentConstant.DOCUMENT_TYPE_CODE, Operation.eq, type));
    }
    if (isRestaurant === false) {
      myPredicate.Filter.push(new Filter(DocumentConstant.ISRESTAURN, Operation.eq, isRestaurant));
    }

    myPredicate.OrderBy.push.apply(myPredicate.OrderBy, [new OrderBy(DocumentConstant.CREATION_DATE, OrderByDirection.desc)]);
    myPredicate.Relation = new Array<Relation>();
    myPredicate.Relation.push.apply(myPredicate.Relation, [new Relation(DocumentConstant.ID_DOCUMENT_STATUS_NAVIGATION),
      new Relation(DocumentConstant.ID_TIER_NAVIGATION)]);
    if (type == DocumentEnumerator.PurchaseRequest) {
      myPredicate.Relation.push.apply(myPredicate.Relation, [new Relation(DocumentConstant.DOCUMENT_LINE_NAVIGATION)]);
    }
    return myPredicate;
  }

  /**
   * prepare Document Predicate with specific filtre
   */
  public static prepareDocumentPredicateWithSpecificFiltre(isRestaurn: boolean, idtier?): PredicateFormat {
    const myPredicate = new PredicateFormat();
    myPredicate.Filter = new Array<Filter>();
    myPredicate.SpecFilter = new Array<SpecFilter>();
    myPredicate.Filter.push(new Filter(DocumentConstant.ISRESTAURN, Operation.eq, isRestaurn));
    if (idtier) {
      myPredicate.Filter.push(new Filter(DocumentConstant.ID_TIER, Operation.eq, idtier));
    }
    myPredicate.OrderBy = new Array<OrderBy>();
    myPredicate.OrderBy.push.apply(myPredicate.OrderBy, [new OrderBy(DocumentConstant.ID, OrderByDirection.desc)]);
    myPredicate.Relation = new Array<Relation>();
    myPredicate.Relation.push.apply(myPredicate.Relation, [new Relation(DocumentConstant.ID_DOCUMENT_STATUS_NAVIGATION),
      new Relation(DocumentConstant.ID_TIER_NAVIGATION), new Relation(DocumentConstant.ID_CREATOR_NAVIGATION), new Relation(DocumentConstant.ID_ITEM_NAVIGATION),
      new Relation(DocumentConstant.ID_VALIDATOR_NAVIGATION)]);
    return myPredicate;
  }

  /**
   * prepare Tiers Predicate
   * @param type
   */
  public static prepareTiersPredicate(type: number): PredicateFormat {
    const myPredicate = new PredicateFormat();
    myPredicate.Filter = new Array<Filter>();
    myPredicate.SpecFilter = new Array<SpecFilter>();
    myPredicate.SpecificRelation = new Array<string>();
    myPredicate.SpecificRelation.push(TiersConstants.COUNTRY_SPECIFIC_RELATION);
    myPredicate.SpecificRelation.push(TiersConstants.CITY_SPECIFIC_RELATION);
    myPredicate.Relation = new Array<Relation>();
    myPredicate.Relation.push.apply(myPredicate.Relation, [new Relation(TiersConstants.ID_CURRENCY_NAVIGATION),
      new Relation(TiersConstants.ID_TAXEGROUP_TIERS_NAVIGATION),
      new Relation(TiersConstants.ID_DISCOUNT_GROUP_NAVIGATION),
      new Relation(TiersConstants.PHONE_NAVIGATION)]);
    return myPredicate;
  }

  /**
   * prepare Tiers Predicate
   * @param type
   */
  public static prepareIdTypeTiersPredicate(type: number): PredicateFormat {
    const myPredicate = new PredicateFormat();
    myPredicate.Filter = new Array<Filter>();
    myPredicate.Filter.push(new Filter(TiersConstants.ID_TYPE_TIERS, Operation.eq, type));
    myPredicate.Relation = new Array<Relation>();
    myPredicate.Relation.push.apply(myPredicate.Relation, [new Relation(TiersConstants.ID_CURRENCY_NAVIGATION),
      new Relation(TiersConstants.ID_TAXEGROUP_TIERS_NAVIGATION),
      new Relation(TiersConstants.ID_DISCOUNT_GROUP_NAVIGATION),
      new Relation(TiersConstants.PHONE_NAVIGATION), new Relation(TiersConstants.ADDRESS)]);
    myPredicate.SpecificRelation = [TiersConstants.ADDRESS_COUNTRY, TiersConstants.ADDRESS_CITY];
    myPredicate.IsDefaultPredicate = true;
    return myPredicate;
  }

  /**
   /**
   * prepare Tiers Predicate
   * @param documentType
   */
  public static prepareDocumentTypePredicate(documentType: DocumentEnumerator): PredicateFormat {
    const myPredicate = new PredicateFormat();
    myPredicate.Filter = new Array<Filter>();
    myPredicate.OrderBy = new Array<OrderBy>();
    myPredicate.Filter.push(new Filter(DocumentConstant.DOCUMENT_TYPE_CODE, Operation.eq, documentType));
    myPredicate.OrderBy.push.apply(myPredicate.OrderBy, [new OrderBy(DocumentConstant.ID_DOCUMENT, OrderByDirection.desc)]);
    myPredicate.Relation = new Array<Relation>();
    myPredicate.Relation.push.apply(myPredicate.Relation, [new Relation(DocumentConstant.ID_DOCUMENT_STATUS_NAVIGATION),
      new Relation(DocumentConstant.ID_TIER_NAVIGATION), new Relation(DocumentConstant.ID_CREATOR_NAVIGATION)
      , new Relation(DocumentConstant.ID_USED_CURRENCY_NAVIGATION)]);
    myPredicate.IsDefaultPredicate = true;
    return myPredicate;
  }

  /**
   * prepare Tiers Predicate
   * @param type
   */
  public static prepareTiersPredicateWithContacts(type: number): PredicateFormat {
    const myPredicate = new PredicateFormat();
    myPredicate.Filter = new Array<Filter>();
    myPredicate.Filter.push(new Filter(TiersConstants.ID_TYPE_TIERS, Operation.eq, type));
    myPredicate.Relation = new Array<Relation>();
    myPredicate.Relation.push.apply(myPredicate.Relation, [new Relation(TiersConstants.CONTACT),
      new Relation(TiersConstants.ID_TAXEGROUP_TIERS_NAVIGATION)]);
    return myPredicate;
  }

  /**
   * prepare Contacts Predicate
   * @param type
   */
  public static prepareContactPredicate(): PredicateFormat {
    const myPredicate = new PredicateFormat();
    myPredicate.Filter = new Array<Filter>();
    myPredicate.Relation = new Array<Relation>();
    myPredicate.Relation.push.apply(myPredicate.Relation, [new Relation(TiersConstants.CONTACT),
      new Relation(TiersConstants.ID_TAXEGROUP_TIERS_NAVIGATION)]);
    return myPredicate;
  }

  /**
   * prepare Predicate
   */
  public static prepareEmptyPredicate(): PredicateFormat {
    const myPredicate = new PredicateFormat();
    myPredicate.Filter = new Array<Filter>();
    myPredicate.Relation = new Array<Relation>();
    return myPredicate;
  }

  /**
   * prepare purchase request Document Predicate with specific filtre
   */
  public static preparePurchaseRequestDocumentPredicateWithSpecificFiltre(): PredicateFormat {
    const myPredicate = new PredicateFormat();
    myPredicate.Filter = new Array<Filter>();
    myPredicate.SpecFilter = new Array<SpecFilter>();
    myPredicate.SpecificRelation = new Array<string>();
    myPredicate.SpecificRelation.push(PurchaseRequestConstant.ITEM_SPECIFC_NAVIGATION);
    myPredicate.OrderBy = new Array<OrderBy>();
    myPredicate.OrderBy.push.apply(myPredicate.OrderBy, [new OrderBy(DocumentConstant.ID, OrderByDirection.desc)]);
    myPredicate.Relation = new Array<Relation>();
    myPredicate.Relation.push.apply(myPredicate.Relation, [new Relation(DocumentConstant.ID_DOCUMENT_STATUS_NAVIGATION),
      new Relation(DocumentConstant.ID_TIER_NAVIGATION), new Relation(DocumentConstant.ID_CREATOR_NAVIGATION), new Relation(DocumentConstant.ID_ITEM_NAVIGATION),
      new Relation(DocumentConstant.ID_VALIDATOR_NAVIGATION)]);
    return myPredicate;
  }

  public static prepareDailySalesPredicate(dailySalesInventoryMovementForm: FormGroup): PredicateFormat {
    const myPredicate = new PredicateFormat();
    myPredicate.Filter = new Array<Filter>();
    myPredicate.OrderBy = new Array<OrderBy>();
    myPredicate.Relation = new Array<Relation>();
    var pipeDate = new DatePipe('en-US');
    myPredicate.Filter.push(new Filter(StockDocumentConstant.START_DOCUMENT_DATE, Operation.gte,
      pipeDate.transform(dailySalesInventoryMovementForm.controls[StockDocumentConstant.START_DOCUMENT_DATE].value, 'yyyy-MM-dd')));

    myPredicate.Filter.push(new Filter(StockDocumentConstant.END_DOCUMENT_DATE, Operation.lte,
      pipeDate.transform(dailySalesInventoryMovementForm.controls[StockDocumentConstant.END_DOCUMENT_DATE].value, 'yyyy-MM-dd')));

    myPredicate.Filter.push(new Filter(StockDocumentConstant.ID_WAREHOUSE, Operation.eq, dailySalesInventoryMovementForm.controls[StockDocumentConstant.ID_WAREHOUSE_SOURCE].value));
    myPredicate.Filter.push(new Filter(StockDocumentConstant.ID_DOCUMENT_NAVIGATION_ID_DOCUMENT_STATUS, Operation.neq, documentStatusCode.Provisional));
    myPredicate.Relation.push.apply(myPredicate.Relation, [new Relation(StockDocumentConstant.ID_ITEM_NAVIGATION), new Relation(StockDocumentConstant.ID_DOCUMENT_NAVIGATION)
      , new Relation(StockDocumentConstant.ID_WAREHOUSE_NAVIGATION)]);
    myPredicate.IsDefaultPredicate = true;
    myPredicate.Operator = Operator.and;
    return myPredicate;
  }

  public static preparePurchaseBalancePredicate() {
    const myPredicate = new PredicateFormat();
    myPredicate.Filter = new Array<Filter>();
    myPredicate.SpecFilter = new Array<SpecFilter>();
    myPredicate.SpecificRelation = new Array<string>();
    myPredicate.OrderBy = new Array<OrderBy>();
    myPredicate.Relation = new Array<Relation>();
    myPredicate.Filter.push(new Filter(StockDocumentConstant.DOCUMENT_ASSOCIETED, Operation.neq, null));
    myPredicate.Relation.push.apply(myPredicate.Relation, [new Relation(StockDocumentConstant.DOCUMENT_LINE_ASSOCIATED_NAVIGATION),
      new Relation(StockDocumentConstant.DOCUMENT_NAVIGATION)]);
    myPredicate.IsDefaultPredicate = true;
    return myPredicate;
  }
}

export class Filter {
  constructor(public prop: string,
              public operation: Operation,
              public value?: any,
              public isDynamicValue: boolean = false,
              public isSearchPredicate: boolean = false,
              public isDateFiltreBetween?: boolean) {
  }

  public getValue(): any {
    return this.value;
  }
}

export class SpecFilter {
  constructor(public Module: string,
              public Model: string,
              public PropertyOfParentEntity: string,
              public Predicate: PredicateFormat,
              public Prop?: String) {
  }
}

export class OrderBy {
  Prop: string;
  Direction: OrderByDirection;

  constructor(prop: string, direction: OrderByDirection) {
    this.Prop = prop;
    this.Direction = direction;
  }
}

export class Relation {
  prop: string;

  constructor(prop: string) {
    this.prop = prop;
  }
}

export enum Operation {
  eq = 1,
  contains = 2,
  startswith = 3,
  endswith = 4,
  neq = 5,
  gt = 6,
  gte = 7,
  lt = 8,
  lte = 9,
  doesnotcontain = 10,
  isnull = 11,
  isnotnull = 12,
  isempty = 13,
  isnotempty = 14,
  POST
}

export enum OperationTypeString {
  eq = 1,
  contains = 2,
  startswith = 3,
  endswith = 4
}

export enum OperationTypeNumber {
  eq = 1,
  neq = 5,
  gt = 6,
  gte = 7,
  lt = 8,
  lte = 9
}

export enum OperationTypeDropDown {
  eq = 1,
  neq = 5
}

export enum OperationDropDown {
  eq = 1,
  neq = 5,
}

export enum OperationTypeDate {
  eq = 1,
  gt = 6,
  lt = 8,
  betw = 10
}

export enum Operator {
  and = 0,
  or = 1
}

export enum OrderByDirection {
  asc = 1,
  desc = 2
}

export enum OperationBoolean {
  eq = 1
}

export enum OperationTypeDateAcc {
  eq = 1,
  gt = 6,
  gte = 7,
  lt = 8,
  lte = 9
}

export enum OperationProdTypeString {
  contains = 2
}
