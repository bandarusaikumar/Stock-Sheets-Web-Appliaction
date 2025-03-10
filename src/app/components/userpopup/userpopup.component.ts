import { Component, ElementRef, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DashboardService } from 'src/app/shared/services/dashboard.service';

@Component({
  selector: 'app-userpopup',
  templateUrl: './userpopup.component.html',
  styleUrls: ['./userpopup.component.scss']
})
export class UserpopupComponent implements OnInit {

  showNew:any;
  newItem:any;
  previewData: any;
  template: any;
  mainHeaderDataNameArr: any[] = ['Name', 'Units', 'Picked', 'Loaded', 'Returned'];
  tableArray: any[];
  userRole:any;
  @ViewChild('content', {static: false}) content: ElementRef;
  selectedIndex: any;
  constructor(
    public dialogRef: MatDialogRef<UserpopupComponent>,
    public dashboardService: DashboardService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    
  }

  ngOnInit(): void {
    this.previewData = this.data.listDetails;
this.userRole=this.dashboardService.getUserRole();
  }


  onLoad(){
    console.log(this.previewData);
    // this.dashboardService.saveUserTemp(this.previewData);
    this.dashboardService.setUserDataPop(this.previewData);
  }
  deleteList(j,i) {
    alert('Are you sure you want to delete list?');
    this.previewData.listArr[j].items.splice(i, 1);
  }
  AddItemToList(index){
    this.showNew=true;
      this.selectedIndex = index;   
    
  }
  AddList(j,newItem){
    const itemObj = {
      name: newItem,
      units: 0,
      picked: false,
      loaded: false,
      returned: 0
    }
    this.previewData.listArr[j].items.push(itemObj);
    this.showNew=false;
  }
  hide(){
    if(this.showNew==true){
      this.showNew=false;
    }
  }
  // public downloadPDF() {
  //   const doc = new jsPDF();

  //   const specialElementHandlers = {
  //     '#editor': function (element, renderer) {
  //       return true;
  //     }
  //   };

  //   const content = this.content.nativeElement;

  //   doc.fromHTML(content.innerHTML, 15, 15, {
  //     width: 190,
  //     'elementHandlers': specialElementHandlers
  //   });

  //   doc.save('test.pdf');
  // }
  exportAsPDF(div_id)
  {
    // let data = document.getElementById(div_id);  
    // html2canvas(data).then(canvas => {
    //   const contentDataURL = canvas.toDataURL('image/png')  
    //   let pdf = new jspdf('l', 'cm', 'a4'); 
     
    //   pdf.addImage(contentDataURL, 'PNG', 1, 0, 25, 20.0);  
    //   pdf.save('exportedStockSheet.pdf');   
    // }); 
    window.print();
  }
}
