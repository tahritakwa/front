import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { EnumValues } from 'enum-values';
import { GarageConstant } from '../../../../constant/garage/garage.constant';
import { groupData } from '../../../../constant/garage/planning-data';
import { ResourceAllocationFilterByEnumerator } from '../../../../models/enumerators/resource-allocation-filtre-by.enum';

@Component({
  selector: 'app-resource-allocation',
  templateUrl: './resource-allocation.component.html',
  styleUrls: ['../../../../../assets/styles/planning.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ResourceAllocationComponent implements OnInit {

  public selectedGarages: number = null; public selectedDate: Date = new Date();
  public selectedFiltre: any = null;
  public resources: any[] = [];
  public group: any;
  public events: any[] = [];
  public garageDataSource: any[] = [];
  public filtreDataSource: any[] = [];
  public ouvrier: any;
  public post: any;
  public searchFormGroup: FormGroup;
  public resourceAllocationFilterByEnumerator = ResourceAllocationFilterByEnumerator;
  constructor(public translate: TranslateService, private fb: FormBuilder) { }

  initDataSource(): void {
    const FilterEnum = EnumValues.getNamesAndValues(this.resourceAllocationFilterByEnumerator);
    FilterEnum.forEach(elem => {
      elem.name = elem.name.toUpperCase();
      this.translate.get(elem.name.toUpperCase()).subscribe(trans => elem.name = trans);
      this.filtreDataSource.push(elem);
    });
    let garage: any[] = [];
    garage = JSON.parse(localStorage.getItem(GarageConstant.GARAGE_LIST));
    if (garage) {
      garage.forEach(x => {

        this.garageDataSource.push({
          text: x.Name, value: x.Id, color: '', Responsible: x.Responsible,
          Workers: x.Workers, Posts: x.Posts, Id: x.Id
        });
      });
    }
  }

  dataInit() {
    this.events = [];
    this.resources = [],
      this.resources = [... this.resources, {
        name: 'Garage',
        data: JSON.parse(localStorage.getItem(GarageConstant.GARAGE_LIST)),
        field: 'garageId',
        valueField: 'Id',
        textField: 'Name',
        colorField: 'color'
      }];

    this.group = groupData;
    const interventionList: any[] = JSON.parse(localStorage.getItem(GarageConstant.INTERVENTIONS_ORDER_LIST));
    let interventionPlanned: any[] = JSON.parse(localStorage.getItem(GarageConstant.PLANNED_OPERATION_LIST));
    interventionPlanned = interventionPlanned ? interventionPlanned : [];
    interventionPlanned.forEach(x => {
      const intervention = interventionList.find(inter => inter.Id === x.IdInterventionOrder);
      this.events.push({
        id: intervention.Id,
        title: 'Intervention '.concat(intervention.Tiers).concat(' Matricule ').concat(intervention.RegistrationNumber)
          .concat(' Operation : ').concat(x.OperationName),
        start: new Date(intervention.InterventionHour),
        end: new Date(intervention.InterventionHour)
          .setHours(new Date(intervention.InterventionHour).getHours() + new Date(x.DurationExpected).getHours()),
        garageId: x.IdGarage,
        posteId: x.PosteName,
        stateId: intervention.InterventionState,
        ouvrierId: x.ResponsableName
      });
    });
    if (!this.selectedGarages || !this.selectedFiltre) {
      this.events = this.events.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj['id']).indexOf(obj['id']) === pos;
      });
    }
    this.events.forEach(x => {
      x.start = new Date(x.start);
      x.end = new Date(x.end);
    });
  }

  createSearchFormGroup() {
    this.searchFormGroup = this.fb.group({
      IdGarage: [undefined],
      IdWorker: [undefined],
      IdPost: [undefined],
    });
  }

  ngOnInit() {
    this.createSearchFormGroup();
    this.initDataSource();
    this.dataInit();
  }

  doFilter() {

  }

  getGarageWorkers() {
    const garage = this.garageDataSource.find(x => x.Id === this.selectedGarages);
    const data = [];
    garage.Workers.forEach(x => {
      data.push({ text: x.Name, value: x.Name });
    });
    this.ouvrier = {
      name: 'Ouvrier',
      data: data,
      multiple: true,
      field: 'ouvrierId',
      valueField: 'value',
      textField: 'text',
      colorField: 'color'
    };

    this.resources.push(this.ouvrier);
  }

  getGaragePostes() {
    const garage = this.garageDataSource.find(x => x.Id === this.selectedGarages);
    const data = [];
    let id = 1;
    garage.Posts.forEach(x => {
      data.push({ text: x.Name, value: x.Name });
      id++;
    });

    this.post = {
      name: 'Post',
      data: data,
      multiple: true,
      field: 'posteId',
      valueField: 'value',
      textField: 'text',
      colorField: 'color'
    };

    this.resources.push(this.post);
  }

  filtre() {
    this.dataInit();

    if (this.selectedFiltre === this.resourceAllocationFilterByEnumerator.Post) {
      this.getGaragePostes();

    } else if (this.selectedFiltre === this.resourceAllocationFilterByEnumerator.Worker) {
      this.getGarageWorkers();
    }
    this.group = { ...this.group, resources: [this.resourceAllocationFilterByEnumerator[this.selectedFiltre]] };
    this.events = this.events.filter(x => x.garageId === this.selectedGarages);

  }

  cancel() {
    this.selectedGarages = null;
    this.selectedFiltre = null;
    this.dataInit();
  }

}
