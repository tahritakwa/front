import {inject, TestBed} from '@angular/core/testing';

import {LanguageKnowledgeService} from './language-knowledge.service';

describe('LanguageKnowledgeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LanguageKnowledgeService]
    });
  });

  it('should be created', inject([LanguageKnowledgeService], (service: LanguageKnowledgeService) => {
    expect(service).toBeTruthy();
  }));
});
