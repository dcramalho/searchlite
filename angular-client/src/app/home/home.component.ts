import { Component } from '@angular/core';
import { SearchService } from '../search.service';
import {MdSnackBar} from '@angular/material'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent 
{
    hidden = false;
    show = true;
    term: string = "";
    search_counter = 0;
    i1 = 0;
    i2 = 0;
    type: string;
    results: Array<string> = new Array<string>();
    subresults: Array<string> = new Array<string>();
    iterate_sub = 0;
    results_length = 0;
    search_controller = false;
    result: string;
    temp: string;
    save_term: string = "";
    st2: string = "";
    types = [
      {'value': 'all', 'name': 'ALL'},
      {'value': 'pdf', 'name': 'PDF'},
      {'value': 'html', 'name': 'HTML'},
      {'value': 'xml', 'name': 'XML'},
      {'value': 'doc', 'name': 'DOC'},
      {'value': 'xls', 'name': 'XLS'},
      {'value': 'ppt', 'name': 'PPT'},
];


  constructor(private searchService: SearchService, public snackBar: MdSnackBar) 
  {

  }

  message: string = 'REDL is Searching...';

  search()
  {
      if ( (this.term == "") || (this.term == this.save_term))
      {
          this.nullSearch();
          this.save_term = "";
          return;
      }

       if (!this.hidden){
       this.hidden =!this.hidden;}

        this.snackBar.open(this.message, this.term, {duration: 3000});
       /**GOT RESULT*/
  
        this.searchService.search(this.term).subscribe(data => {this.result = JSON.stringify(data); });
       
        this.helpSearch();
        this.save_term = this.term;
        this.helpSearch();


  
   }
 
  helpSearch()
  {     
      /**REMOVING BRACKETS*/
  
      this.i2 = 1;
      this.i2 = this.result.lastIndexOf(']');
      this.result = this.result.substring(this.i1+1,this.i2);

    
      /**POPULATING VECTOR RESULTS*/   
      while(true)
      {
        /**REMOVING LEADING QUOTATIONS*/
        this.result = this.result.substring(1, this.result.length);
        /**GET RESULTS INTO TEMP THEN PUSH (get rid of num/ ?) ITERATE LENGTH */
        this.temp = this.result.substring(0, this.result.indexOf('"'));
        this.results.push(this.temp);
        this.results_length = this.results_length + 1;
        /**LOOP CONTROL CONDITION
        LOOKING FOR COMMA TO ITERATE RESULT*/
        if (this.result.search(',') != -1)
        {
          this.result = this.result.substring(this.result.indexOf(',') + 1, this.result.length);
          continue;
        }
        break;
      }
     
      /**BUILDING SUBRESULTS IN 5s -- CAN CHANGE TO ANY NUMBER REALLY (ADVANCED SEARCH?)*/

      /**CHECK STARTING LENGTH OF  RESULTS ARRAY*/
      



      this.results = this.filterType(this.results);




      if (this.results_length > 4)
      {
        this.subresults[0] = this.results[this.iterate_sub];
        this.subresults[1] = this.results[this.iterate_sub + 1]; 
        this.subresults[2] = this.results[this.iterate_sub + 2]; 
        this.subresults[3] = this.results[this.iterate_sub + 3]; 
        this.subresults[4] = this.results[this.iterate_sub + 4]
      }
      else
      {
        this.subresults = this.results;
      }
}

/** NEED A WAY TO GET CLICKABLE LINKS -- LINK TO READ LOCAL FILES?*/


/** PROTOTYPES OF PAGINATION FUNCITONS*/

  paginateup():void
  { 
    if (this.iterate_sub + 4 > this.results_length)
    {
        /**ADD CODE TO POP ERROR MESSAGE*/
    }
    else 
    {

      /**NEED TO TEST CASE FOR GOING OUT OF BOUNDS*/

      this.iterate_sub = this.iterate_sub+4;
      this.subresults[0] = this.results[this.iterate_sub];
      this.subresults[1] = this.results[this.iterate_sub + 1]; 
      this.subresults[2] = this.results[this.iterate_sub + 2]; 
      this.subresults[3] = this.results[this.iterate_sub + 3]; 
      this.subresults[4] = this.results[this.iterate_sub + 4] 
    }
      
  }

  paginatedown():void
  {
      if (this.iterate_sub - 4 < 0)
      {
        /**ADD CODE TO POP ERROR MESSAGE*/
      }
      else
      {
        this.iterate_sub = this.iterate_sub-4;
        this.subresults[0] = this.results[this.iterate_sub];
        this.subresults[1] = this.results[this.iterate_sub + 1]; 
        this.subresults[2] = this.results[this.iterate_sub + 2]; 
        this.subresults[3] = this.results[this.iterate_sub + 3]; 
        this.subresults[4] = this.results[this.iterate_sub + 4]
      }
  }



/**BUSTED*/
  nullSearch()
  {
        this.subresults = [];
        this.results = [];
        this.results_length = 0;
        this.iterate_sub = 0;
        this.i1 = 0;
        this.i2 = 0;
        this.temp = "";
        this.result= "";
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