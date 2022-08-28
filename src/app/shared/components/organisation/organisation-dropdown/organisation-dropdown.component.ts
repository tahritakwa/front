import { Component, OnInit } from '@angular/core';
import { OrganisationService } from '../../../../crm/services/organisation/organisation.service';

@Component({
  selector: 'app-organisation-dropdown',
  templateUrl: './organisation-dropdown.component.html',
  styleUrls: ['./organisation-dropdown.component.scss']
})
export class OrganisationDropdownComponent implements OnInit {

  public organisationList: any;
  public itemForm: any;
  constructor(public organisationService: OrganisationService) { }

  ngOnInit() {
    this.loadOrganisations();
  }

  loadOrganisations() {

    this.organisationService.getJavaGenericService().getEntityList().subscribe(
      (data) => {
        this.organisationList = data;
      }
    );
  }
}
