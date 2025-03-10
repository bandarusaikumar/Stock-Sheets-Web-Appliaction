import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DashboardService } from 'src/app/shared/services/dashboard.service';
import { TemplateComponent } from '../template/template.component';
@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  userData = [];
  userRole: any;
  searchInput: any;
  searchKey: string;
  loadList: any[];
  newList: any[];
  constructor(public dashboardService: DashboardService,
    public authService: AuthService,
    public datePipe: DatePipe,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.userRole = this.dashboardService.getUserRole();
    this.dashboardService.getUserSaved().subscribe(data => {
      console.log(data);
      this.newList=data;
      this.userData = data;
      // this.listArr = data['listArr'];
    });
  }
  previewTemplate(listDetails?) {
    if (!listDetails) {
      const startDate = new Date();
      const formatStartDate = this.datePipe.transform(startDate, 'dd-MM-yyyy');
      listDetails = {
        role: this.userRole,
        eventDate: formatStartDate,
        salesPerson: '',
        pax: '',
        // listArr: this.listArr
      }
    }
    const dialogRef = this.dialog.open(TemplateComponent, {
      width: '80%',
      height: '80%',
      data: {
        listDetails: listDetails
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  search(key){
console.log(key);
this.searchKey=key;
if(key){
for(let i=0;i<this.newList.length;i++){
  // console.log(this.userData[i].clientName.includes(this.searchKey));
if( this.newList[i].clientName.includes(this.searchKey)){
  this.loadList=[]
this.loadList.push(this.newList[i]);
 console.log(this.loadList);
}
}
this.userData=this.loadList;
}
else{
  this.dashboardService.getUserSaved().subscribe(data => {
    console.log(data);
    this.newList=data;
    this.userData = data;
    // this.listArr = data['listArr'];
  });;
}
  
}
}
