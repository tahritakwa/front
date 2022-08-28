import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { NumberConstant } from '../../../constant/utility/number.constant';
const ID = 'Id';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.scss']
})
export class AddPostComponent implements OnInit {
  @Input() allMachineSelected;
  @Input() viewReference;
  @Input() idGarage;
  @Input() data;
  @Input() hasUpdatePermission;
  @Output() removeContext = new EventEmitter<any>();
  @Output() machineAdded = new EventEmitter<any>();
  @Output() machineRemoved = new EventEmitter<any>();

  machineGridData: any[] = [];
  postFormGroup: FormGroup;
  showDetails = true;

  constructor(private fb: FormBuilder, private validationService: ValidationService) { }
  ngOnInit() {
    this.postFormGroup = this.fb.group({
     Id: [0],
     Name: ['', [Validators.required, Validators.maxLength(NumberConstant.FIFTY)]],
     IdGarage: [undefined],
     });
    if (this.data) {
       this.setData(this.data);
    }
  }
  RemoveView( ) {
    // Inform parent to delete the component from the container
    this.removeContext.emit(this.viewReference);
  }

  getData() {
    return { Id : this.Id.value , Name: this.Name.value, IdGarage: this.IdGarage.value, Machine: this.machineGridData};
  }

  machineAddedInTheGrid($event) {
    this.machineAdded.emit($event);
  }

  machineRemovedFromTheGrid($event) {
    this.machineRemoved.emit($event);
  }

  setData(data) {
    if(data != undefined) {
      this.Id.setValue(data.Id);
      this.Name.setValue(data.Name);
      this.IdGarage.setValue(data.IdGarage);
      this.machineGridData = data.Machine ? data.Machine : [];
    }
  }

  validateForm() {
    if (!this.postFormGroup.valid) {
      this.validationService.validateAllFormFields(this.postFormGroup);
    }
  }

  get Name(): FormControl {
    return this.postFormGroup.get(GarageConstant.NAME) as FormControl;
  }

  get Id(): FormControl {
    return this.postFormGroup.get(ID) as FormControl;
  }
  get IdGarage(): FormControl {
    return this.postFormGroup.get(GarageConstant.ID_GARAGE) as FormControl;
  }
}
