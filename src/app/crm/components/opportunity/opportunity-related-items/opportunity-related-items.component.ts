import {Component, Input} from '@angular/core';
import {AuthService} from '../../../../login/Authentification/services/auth.service';
import {PermissionConstant} from '../../../../Structure/permission-constant';

@Component({
  selector: 'app-opportunity-related-items',
  templateUrl: './opportunity-related-items.component.html',
  styleUrls: ['./opportunity-related-items.component.scss']
})
export class OpportunityRelatedItemsComponent {
  public noteElementsCount = 0;
  public fileElementsCount = 0;
  public claimElementsCount = 0;
  @Input() source: String;
  @Input() sourceId: number;
  @Input() data;
  @Input() isArchivingMode;
  @Input() isProspect;
  entityType = 'OPPORTUNITY';
  public CRMPermissions = PermissionConstant.CRMPermissions;
  constructor(public authService: AuthService) {
  }

  recount(e) {
    this.fileElementsCount = e;
  }

  nbrNoteEvent($event) {
    this.noteElementsCount = $event;
  }

  showCountClaim(count) {
    this.claimElementsCount = count;
  }
}
