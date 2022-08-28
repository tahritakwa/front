import {Component, Input, OnInit} from '@angular/core';
import {Candidacy} from '../../../../models/rh/candidacy.model';
import {Interview} from '../../../../models/rh/interview.model';
import {PredicateFormat} from '../../../../shared/utils/predicate';

@Component({
  selector: 'app-list-interview-by-candidacy',
  templateUrl: './list-interview-by-candidacy.component.html',
  styleUrls: ['./list-interview-by-candidacy.component.scss']
})
export class ListInterviewByCandidacyComponent implements OnInit {
  @Input() candidacy: Candidacy;

  interviewList: Interview[];
  predicate: PredicateFormat;
  hideInteviewList = false;

  constructor() {
  }

  ngOnInit() {
  }

  deleteCandidacyFromInterviewList() {
    // set the candidacy state to PreSelection and delete all related inteviews
  }

}
