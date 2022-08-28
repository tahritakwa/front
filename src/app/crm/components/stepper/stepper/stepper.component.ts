import {Component, Input, OnInit} from '@angular/core';
import {PipelineService} from '../../../services/pipeline/pipeline.service';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent implements OnInit {
  @Input() campaign: any;
  listStatus = [];
  allPipelineSteps = [];
  campaignPipelineStep: any;

  public totalSteps = 0;

  constructor(private pipelineService: PipelineService) {
  }

  ngOnInit() {
    if (this.campaign != undefined) {
      this.getStatusByPipeline(this.campaign.pipelineId);
    }
  }

  getStatusByPipeline(id) {
    this.listStatus = [];
    this.pipelineService.getJavaGenericService().getEntityById(id).subscribe(
      (p) => {
        this.totalSteps = p.pipelineSteps.size;
        this.allPipelineSteps = p.pipelineSteps;
        this.getCampaignPipelineSteps();
        p.pipelineSteps.forEach((pipelineSteps) => {
          const data = {
            id: pipelineSteps.id,
            title: pipelineSteps.relatedStatus.title,
            color: pipelineSteps.relatedStatus.color,
            positionInPipe: pipelineSteps.order,
            colorStepper: '#DCDCDC',
            pipelineState: pipelineSteps.state
          };
          this.listStatus.push(data);
        });
        this.setStepprtColor();
      }
    );
  }

  getCampaignPipelineSteps() {

    this.campaignPipelineStep = this.allPipelineSteps.filter((re) => this.campaign.currentPositionPipe == re.id);

  }

  setStepprtColor() {
    this.listStatus.forEach((status) => {
      this.campaignPipelineStep.forEach(
        (camp) => {
          if (camp.state === 'INITIAL_STATE') {

            this.listStatus[0].colorStepper = '#4169E1';
          }
          if (camp.state === 'INTERMEDIATE_STATE') {
            if (status.positionInPipe == camp.order) {
              status.colorStepper = '#4169E1';
            }
          }
          if (camp.state === 'FAILURE_FINAL_STATE') {

            if (status.positionInPipe == camp.order) {
              status.colorStepper = '#FF0000';
            }
          }
          if (camp.state === 'SUCCESS_FINAL_STATE') {
            status.colorStepper = '#008000';
          }
        }
      );

    });

  }


}
