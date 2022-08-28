import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {ReducedCandidate} from '../../../models/rh/reduced-candidate.model';
import {PermissionConstant} from '../../../Structure/permission-constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';
import { CandidateService } from '../../../rh/services/candidate/candidate.service';

@Component({
  selector: 'app-candidate-combobox',
  templateUrl: './candidate-combobox.component.html',
  styleUrls: ['./candidate-combobox.component.scss']
})
export class CandidateComboboxComponent implements OnInit {

  @Input() group;
  @Input() isFromStepper;
  @Output() selected: EventEmitter<any> = new EventEmitter();
  @Output() addCandidate: EventEmitter<any> = new EventEmitter();
  @ViewChild(ComboBoxComponent) public comboboxComponent: ComboBoxComponent;

  public haveAddPermission: boolean;
  candidateDataSource: ReducedCandidate[];
  candidateFiltredDataSource: ReducedCandidate[];

  constructor(private candidateService: CandidateService, public authService: AuthService) { }

  get IdCandidate(): FormControl {
    return this.group.get(SharedConstant.ID_CANDIDATE) as FormControl;
  }

  ngOnInit() {
    this.haveAddPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.ADD_CANDIDATE);
    this.initDataSource();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initDataSource();
  }

  initDataSource(): void {
    if (this.isFromStepper) {
      this.candidateService.getAvailableCandidates().subscribe(result => {
        this.candidateDataSource = result.data;
        this.candidateFiltredDataSource = this.candidateDataSource;
      });
    } else {
      this.candidateService.listdropdown().subscribe((data: any) => {
        this.candidateDataSource = data.listData;
        this.candidateFiltredDataSource = this.candidateDataSource;
      });
    }
  }

  // Emit to the parent to opend modal add candidate
  addNew(): void {
    this.addCandidate.emit(true);
  }

  onSelect() {
    const selectedCandidate = this.candidateFiltredDataSource
      .filter(x => x.Id === this.group.get(SharedConstant.ID_CANDIDATE).value)[NumberConstant.ZERO];
    this.selected.emit(selectedCandidate);
  }

  /**
   * filter by code and label
   * @param value
   */
  handleFilter(value: string): void {
    this.candidateFiltredDataSource = this.candidateDataSource.filter((s) =>
      s.FullName.toLowerCase().indexOf(value.toLowerCase()) !== NumberConstant.MINUS_ONE);
  }

}
