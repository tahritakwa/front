import {Component, Input} from '@angular/core';
import {AuthService} from '../../../../login/Authentification/services/auth.service';
import {PermissionConstant} from '../../../../Structure/permission-constant';

@Component({
  selector: 'app-contact-related-items',
  templateUrl: './contact-related-items.component.html',
  styleUrls: ['./contact-related-items.component.scss']
})
export class ContactRelatedItemsComponent {

  public opportunityElementsCount = 0;
  public noteElementsCount = 0;
  public claimElementsCount = 0;
  public fileElementsCount = 0;
  @Input() source: String;
  @Input() sourceId: number;
  @Input() data;
  @Input() isProspect;
  @Input() contactCrm;
  @Input() isArchivingMode;
  entityType = 'CONTACT';
  public CRMPermissions = PermissionConstant.CRMPermissions;
  constructor( public authService: AuthService) {
  }

  recount(e) {
    this.fileElementsCount = e;
  }

  nbrNoteEvent($event) {
    this.noteElementsCount = $event;
  }


  showCountOpportunities(count) {
    this.opportunityElementsCount = count;
  }

  showCountClaim(count) {
    this.claimElementsCount = count;
  }

}
