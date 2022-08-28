import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class OpportunityFilterService {

  public organisationId: number;

  public categoryFromList;
  public employeeIdFromList;

  public categoryFromKanban;
  public employeeIdFromKanban;

  public typeDAffaireFromList;
  public typeDAffaireFromKanban;

  public productIdFromList;
  public productIdFromKanban;

  public toLisT;

  constructor() {
  }

  filterByOrganisation(organisationId?: any) {
    this.organisationId = organisationId;
  }

  fromListToKanban(category?: any, employeeId?: any, typeDAffaireFromKanban?: any, productIdFromList?: any) {
    this.categoryFromList = category;
    this.employeeIdFromList = employeeId;
    this.typeDAffaireFromList = typeDAffaireFromKanban;
    this.productIdFromList = productIdFromList;

  }

  fromKanbanToList(category?: any, employeeId?: any, typeDAffaireFromList?: any,  productIdFromKanban?: any, toList?: any) {
    this.categoryFromKanban = category;
    this.employeeIdFromKanban = employeeId;
    this.typeDAffaireFromKanban = typeDAffaireFromList;
    this.productIdFromKanban = productIdFromKanban;
    this.toLisT = toList;
  }

}
