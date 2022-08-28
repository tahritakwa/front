import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PermissionConstant} from '../../../../Structure/permission-constant';
import {AuthService} from '../../../../login/Authentification/services/auth.service';

@Component({
  selector: 'app-organisation-related-items',
  templateUrl: './organisation-related-items.component.html',
  styleUrls: ['./organisation-related-items.component.scss']
})
export class OrganisationRelatedItemsComponent {

  public contactElementsCount = 0;
  public opportunityElementsCount = 0;
  public noteElementsCount = 0;
  public claimElementsCount = 0;
  public fileElementsCount = 0;
  @Input() source: String;
  @Input() sourceId: number;
  @Input() data;
  @Input() isProspect;
  @Output() contact = new EventEmitter<any>();
  @Input() idOrganisation;
  @Input() idOpportunity;
  @Input() contactCrm;
  @Input() isArchivingMode;

  @Input() organisationIsFromOpportunity = false;
  entityType = 'ORGANISATION';
  public CRMPermissions = PermissionConstant.CRMPermissions;
  constructor(public authService: AuthService) {
  }

  recount(e) {
    this.fileElementsCount = e;
  }

  nbrNoteEvent($event) {
    this.noteElementsCount = $event;
  }

  showDetails(e) {
    this.contact.emit(e);
  }

  showCountOpportunities(count) {
    this.opportunityElementsCount = count;
  }

  showCountContacts(count) {
    this.contactElementsCount = count;
  }

  showCountClaim(count) {
    this.claimElementsCount = count;
  }
}
