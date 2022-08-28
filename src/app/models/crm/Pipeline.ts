import {PipelineStep} from './PipelineStep';

export class Pipeline {
  id: number;
  name: string;
  pipelineSteps: Array<PipelineStep>;
  possibleToDeleteOrUpdate: boolean;
  possibleToDelete: boolean;
  IsUsedByOthers:boolean;
}
