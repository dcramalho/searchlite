

import { Component } from '@angular/core';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent 
{
    hidden = false;
    first_index = 2;
    second_index = 0;
    temp: string = "";
    paginate_index = 0;
    term: string = "";
    filetype: string;
    subres_length = 0;
    overpage = false;

    /** String holding the initial undeited result string from the backend */
    result: string = "";

    /** Declare an array of strings to hold individual results */
    results_strings: Array<string> = new Array<string>();

    /** Makes a smaller subarray of the results_strings to allow pagination */
    sub_results_strings: Array<string> = new Array<string>();


    types = [
      {'value': 'all', 'name': 'ALL'},
      {'value': 'pdf', 'name': 'PDF'},
      {'value': 'html', 'name': 'HTML'},
      {'value': 'xml', 'name': 'XML'},
      {'value': 'doc', 'name': 'DOC'},
      {'value': 'xls', 'name': 'XLS'},
      {'value': 'php', 'name': 'PHP'},

      {'value': 'ppt', 'name': 'PPT'},
];
  

  constructor(private searchService: SearchService) 
  {

  }

  /** Reveals the hidden results box */
  reveal()
  {
      if (!this.hidden){
       this.hidden =!this.hidden;
      }
  }
 
  /** Gets the backend data based on term provided in this.term */
  search()
  {
        this.reveal();
        this.subres_length = 0;
        this.paginate_index = 0;
        this.searchService.search(this.term).subscribe(data => {
          this.result = JSON.stringify(data); 
          this.prepareResults(); 
        });
       
  }
 
  /** Prepares the results for display */
  prepareResults()
  {
      /** Find the location of the last square bracker, i.e. end of result */
      this.second_index = this.result.lastIndexOf(']');

      /** Create substring from after the first square bracket to before the last square bracket. */
      this.result = this.result.substring(this.first_index,this.second_index); 

      /** Remove last quotation from results string */
      this.result = this.result.substring(0, this.result.lastIndexOf('\"'));

      /** Replace all instances of "," with empty spaces. */
      this.result = this.result.replace(/\",\"/g, " ");    

      /** Remove ?/ from strings**/
      /**this.result = */

      /** Split strings into array based on the whitespace */
      this.results_strings = this.result.split(" "); 

      /**Testing for filtering and subresults display*/
      this.results_strings = this.filterType(this.results_strings);
      

      this.subres_length = this.results_strings.length;


     
      if (this.subres_length == 1)
      {
        this.sub_results_strings=[];
        this.sub_results_strings[0] = "NO RESULTS";

      }
      else
      {
           this.generateSubresults();

      }
    


  }

  /** Generates the subresults to be displayed based on the paginate index. paginate_index +=5 for more and -=5 for less */
  generateSubresults()
  {
      this.sub_results_strings[0] = this.results_strings[0];
      this.sub_results_strings[1] = this.results_strings[1];
      this.sub_results_strings[2] = this.results_strings[2];
      this.sub_results_strings[3] = this.results_strings[3];
      this.sub_results_strings[4] = this.results_strings[4];
  }

  /** Hop forward five results and generate them */
  paginateup()
  {

      /**Case of No Results*/
      if (this.subres_length == 1)
      {

      }
      /**Case of results over*/
      else if ( this.paginate_index + 9 >= this.subres_length )
      {
        this.sub_results_strings =[];
        this.sub_results_strings[0] = this.results_strings[this.paginate_index];
        this.sub_results_strings[1] = this.results_strings[this.paginate_index+1];
        this.sub_results_strings[2] = this.results_strings[this.paginate_index+2];
        this.sub_results_strings[3] = this.results_strings[this.paginate_index+3];
        this.sub_results_strings[4] = this.results_strings[this.paginate_index+4];
        this.sub_results_strings[5] = this.results_strings[this.paginate_index+5];
        this.sub_results_strings[6] = this.results_strings[this.paginate_index+6];                this.sub_results_strings[7] = this.results_strings[this.paginate_index+7];
        this.sub_results_strings[8] = this.results_strings[this.paginate_index+8];             this.sub_results_strings[9] = this.results_strings[this.paginate_index+9];
        this.overpage = true;
      }
   
      else
      {
        this.paginate_index+=5;
        this.sub_results_strings = [];
        this.sub_results_strings[0] = this.results_strings[this.paginate_index];
        this.sub_results_strings[1] = this.results_strings[this.paginate_index+1];
        this.sub_results_strings[2] = this.results_strings[this.paginate_index+2];
        this.sub_results_strings[3] = this.results_strings[this.paginate_index+3];
        this.sub_results_strings[4] = this.results_strings[this.paginate_index+4];  
      }    
  }

  /** Hop backwards five results and generate them */
  paginatedown()
  {
      if (this.paginate_index - 4 < 0)
      {
        /**ADD CODE TO POP ERROR MESSAGE*/
        this.paginate_index = 0;
      }
      else if (this.overpage == true)
      {
          this.sub_results_strings = [];
          this.sub_results_strings[0] = this.results_strings[this.paginate_index];
          this.sub_results_strings[1] = this.results_strings[this.paginate_index+1];
          this.sub_results_strings[2] = this.results_strings[this.paginate_index+2];
          this.sub_results_strings[3] = this.results_strings[this.paginate_index+3];
          this.sub_results_strings[4] = this.results_strings[this.paginate_index+4];
          this.overpage = false;
      }
      else
      {
        this.paginate_index-=5;
        this.sub_results_strings = [];
        this.sub_results_strings[0] = this.results_strings[this.paginate_index];
        this.sub_results_strings[1] = this.results_strings[this.paginate_index+1];
        this.sub_results_strings[2] = this.results_strings[this.paginate_index+2];
        this.sub_results_strings[3] = this.results_strings[this.paginate_index+3];
        this.sub_results_strings[4] = this.results_strings[this.paginate_index+4];
      }
  }


  /** Filters results based on this.type */
  filterType(unfilteredResults: string[]): string[] {

    if(this.filetype === undefined || this.filetype === 'all') 
    {
      return unfilteredResults;
    }

    return unfilteredResults.filter(result => {return result.includes(this.filetype);})
  }






  //** Gets the type of the file based on if it contains a certain string -- called from HTML file*/
  getFileType(fileName: string): string {

    if(fileName.includes('html')) {
      return 'html';
    } 
    else if(fileName.includes('pdf')) {
      return 'pdf';
    } 
    else if (fileName.includes('xml'))
    {
      return 'xml';
    } 
    else if (fileName.includes ('doc'))
    {
      return 'doc';
    }
     else if (fileName.includes ('xls'))
    {
      return 'xls';
    }
     else if (fileName.includes ('ppt'))
    {
      return 'ppt';
    }
        else if (fileName.includes ('php'))
    {
      return 'php';
    }
    else {
      return '';
    }

  }
}
