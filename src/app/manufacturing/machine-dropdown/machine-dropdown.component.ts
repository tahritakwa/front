import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MachineService } from '../service/machine.service';
import {MachineConstant} from '../../constant/manufuctoring/machine.constant';
import {SectionConstant} from '../../constant/manufuctoring/section.constant';

@Component({
  selector: 'app-machine-dropdown',
  templateUrl: './machine-dropdown.component.html',
  styleUrls: ['./machine-dropdown.component.scss']
})
export class MachineDropdownComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() assignedToSection: boolean;
  @Input() sectionId: number;
  @Output() selectedMachineId = new EventEmitter<boolean>();
  public machineFiltredList = [];
  public machineId = [];

  constructor(public translate: TranslateService, private machineService: MachineService) {

   }

  public initDataSource() {
    if (this.assignedToSection === true) {
      this.getMachinesNotAssignedToSection();
    }  else if (this.sectionId > 0) {
      this.getMachinesAssignedToSectionId();
    } else {
      this.getAllMachines();
    }
  }

  handleFilterParentCode(value): void {
    this.machineFiltredList = this.machineId.filter((s) =>
      s.description.toLocaleLowerCase().includes(value.toLowerCase()));
  }

  public onSelect(event): void {
    this.selectedMachineId.emit(event);
  }

  ngOnInit() {
    this.initDataSource();
  }

  getMachinesNotAssignedToSection() {
    this.machineService.getJavaGenericService().getEntityList(MachineConstant.NOT_ASSIGNED)
      .subscribe((data) => {
        this.prepareData(data);
      });
  }

  getMachinesAssignedToSectionId() {
    this.machineService.getJavaGenericService()
      .getEntityById(this.sectionId , SectionConstant.GET_BY_SECTION_ID)
      .subscribe((data) => {
        this.prepareData(data);
      });
  }

  getAllMachines() {
    this.machineService.getJavaGenericService().getEntityList()
      .subscribe((data) => {
        this.prepareData(data);
      });
  }

  prepareData(data: any) {
    this.machineId = data;
    this.machineFiltredList = this.machineId.slice(0);
  }
}
