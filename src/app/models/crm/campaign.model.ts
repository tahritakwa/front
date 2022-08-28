import {StatusCrm} from "./statusCrm.model";

export class Campaign {
    id: number;
    name: string;
    responsablesUsersId: number;
    teams: string;
    state: string;
    pipelineId: number;
    startDate: any;
    description: string;
    currentPositionPipe: number;
    closedPositionPipe: number;

}
