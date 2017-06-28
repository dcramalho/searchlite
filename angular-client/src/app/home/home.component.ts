import { Component } from '@angular/core';
import { SearchService } from '../search.service';
import {MdSnackBar} from '@angular/material'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
 term: string;
  type: string;
  counter = 0;
  results: string[];
  types = [
    {'value': 'pdf', 'name': 'PDF'},
    {'value': 'html', 'name': 'HTML'},
    {'value': 'xml', 'name': 'XML'},
    {'value': 'doc', 'name': 'DOC'},
    {'value': 'all', 'name': 'ALL'}
  ];

  constructor(private searchService: SearchService, public snackBar: MdSnackBar) {}

  message: string = 'REDL is Searching...';

  search() {

    this.snackBar.open(this.message, this.term, {
  duration: 3000
});
  
    if(this.term === 'sundar') {
      this.paginateup();

    } else if(this.term === 'bonita') {
      this.results = this.filterType(['see.stanford.edu_materials_icspmcs106a_25-strings.pdf', 'spectrumchildhealth.stanford.edu_documents_MentoringAgreement1_111811.doc', 'scien.stanford.edu_pages_labsite_2003_psych221_projects_03_jgin_appendix.html' , 'smi-protege.stanford.edu_repos_protege_string-search-tab_tags_release-3.1_build-internal.xml']);
    } else if(this.term === 'gozie') {
      this.results = this.filterType(['snf.stanford.edu_Education_ETPs_photolithography%2520activity.doc','see.stanford.edu_materials_icspmcs106a_29-practice-midterm-solutions.pdf', 'scien.stanford.edu_pages_labsite_2002_psych221_projects_02_william.yu_page3.html' , 'raolab.stanford.edu_xml_homepage.xml']);
    } else {
      this.results = undefined;
    }
  }

  paginateup():void
  {
     if (this.counter == 0)
     {
        this.counter = 1;
        this.results = ['stanfordwest.stanford.edu_maintenance.pdf', 'scien.stanford.edu_pages_labsite_2002_psych221_projects_02_raytseng_future.html', 'scpd.stanford.edu_map_info.xml', 'spectrumchildhealth.stanford.edu_documents_GroupMeetingDocumentationForm_111811.doc'];
     }
     else if (this.counter == 1)
     {
        this.counter = 2;
        this.results = ['howard_stanfordwest.stanford.edu_maintenance.doc', 'howard_scien.stanford.edu_pages_labsite_2002_psych221_projects_02_raytseng_future.doc', 'howard_scpd.stanford.edu_map_info.xml', 'howard_spectrumchildhealth.stanford.edu_documents_GroupMeetingDocumentationForm_111811.doc'];
     }
     else if (this.counter == 2)
     {
        this.counter = 0;
        this.results = ['test_stanfordwest.stanford.edu_maintenance.pdf', 'test_scien.stanford.edu_pages_labsite_2002_psych221_projects_02_raytseng_future.doc', 'howard_scpd.stanford.edu_map_info.pdf', 'test_spectrumchildhealth.stanford.edu_documents_GroupMeetingDocumentationForm_111811.doc'];


     }

  }

  paginatedown():void
  {
     if (this.counter == 0)
     {
        this.counter = 2;
        this.results = ['test_stanfordwest.stanford.edu_maintenance.pdf', 'test_scien.stanford.edu_pages_labsite_2002_psych221_projects_02_raytseng_future.doc', 'howard_scpd.stanford.edu_map_info.pdf', 'test_spectrumchildhealth.stanford.edu_documents_GroupMeetingDocumentationForm_111811.doc'];
  
     }
     else if (this.counter == 1)
     {
        this.counter = 0;
        this.results = ['howard_stanfordwest.stanford.edu_maintenance.doc', 'howard_scien.stanford.edu_pages_labsite_2002_psych221_projects_02_raytseng_future.doc', 'howard_scpd.stanford.edu_map_info.xml', 'howard_spectrumchildhealth.stanford.edu_documents_GroupMeetingDocumentationForm_111811.doc'];
     }
     else if (this.counter == 2)
     {
        this.counter = 1;
              this.results = ['stanfordwest.stanford.edu_maintenance.pdf', 'scien.stanford.edu_pages_labsite_2002_psych221_projects_02_raytseng_future.html', 'scpd.stanford.edu_map_info.xml', 'spectrumchildhealth.stanford.edu_documents_GroupMeetingDocumentationForm_111811.doc'];
     }

  }


  filterType(unfilteredResults: string[]): string[] {
    if(this.type === undefined || this.type === 'all') {
      return unfilteredResults;
    }

    return unfilteredResults.filter(result => {
      return result.includes(this.type);
    })
  }


  

 


  getFileType(fileName: string): string {
    if(fileName.includes('html')) {
      return 'html';
    } else if(fileName.includes('pdf')) {
      return 'pdf';
    } else if (fileName.includes('xml'))
    {
      return 'xml';
    } else if (fileName.includes ('doc'))
    {
      return 'doc';
    }

    else {
      return '';
    }
  }
}
