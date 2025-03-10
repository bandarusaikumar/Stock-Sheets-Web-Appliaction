import { DatePipe, Location } from '@angular/common';
import { Template } from '@angular/compiler/src/render3/r3_ast';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DashboardService } from 'src/app/shared/services/dashboard.service';
import { TemplateComponent } from '../template/template.component';
import { Router } from '@angular/router';
import { PopupComponent } from '../popup/popup.component';
import { UserpopupComponent } from '../userpopup/userpopup.component';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  showTemplate = false;
  showList = false;
  listName: any = '';
  itemName: any;
  packageName: any = '';
  disableAddList = false;
  itemArr = [];
  listArr = [];
  userData = [];
  disableSave = false;
  userRole: any;
  showPreview = false;
  dataDb: any;
  searchInput: any;
  popUpData: any[];
  constructor(
    public authService: AuthService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    public dashboardService: DashboardService,
    public datePipe: DatePipe,
    public router: Router,
    public location: Location
  ) { }

  ngOnInit(): void {
    this.userRole = this.dashboardService.getUserRole();
    // this.dashboardService.getList();
    this.dashboardService.getList().subscribe(data => {
      console.log(data);
      this.userData = data;
      // this.listArr = data['listArr'];
    });;
  }

  showAccordion() {
    this.listArr = [];
    this.itemArr = [];
    this.showTemplate = true;
  }

  openList() {
    if (this.listName) {
      this.showList = true;
      this.disableAddList = true;
    } else {
      this.snackBar.open('Please provide the section Name', 'ok', {
        duration: 2000,
      });
    }
  }

  AddItemToList() {
    const isElement = this.itemArr.find((ele) => ele == this.itemName);
    if (this.itemName && !isElement) {
      const itemObj = {
        name: this.itemName,
        units: 0,
        picked: false,
        loaded: false,
        returned: 0
      }

      this.itemArr.push(itemObj);
      this.itemName = '';
    } else {
      this.snackBar.open('Please Enter an Item Name', 'ok', {
        duration: 2000,
      });
    }
  }

  deleteItem(i) {
    alert('Are you sure you want to delete Item?');
    this.itemArr.splice(i, 1);
  }

  deleteList(i) {
    alert('Are you sure you want to delete list?');
    this.listArr.splice(i, 1);
  }

  saveItem() {
    if (this.itemArr.length) {
      const listObj = {
        name: this.listName,
        id: Math.floor((Math.random() * 10000) + 1),
        items: this.itemArr
      };
      this.listArr.push(listObj);
      // this.showTemplate = false;
      this.resettemplate();
    } else {
      this.snackBar.open('Please Add items before saving', 'ok', {
        duration: 2000,
      });
    }
  }

  resettemplate() {
    this.listName = '';
    this.itemName = '';
    this.itemArr = [];
    this.showList = false;
    this.disableAddList = false;
  }

  saveTemplate() {
    // save to db
    if (this.packageName) {
      const startDate = new Date();
      const formatStartDate = this.datePipe.transform(startDate, 'dd-MM-yyyy');
      this.dataDb = {
        listDetails: {
          eventDate: formatStartDate,
          packageName:this.packageName,
          salesPerson: '',
          pax: '',
          role: this.userRole,
          listArr: this.listArr,
          popUpArr:this.dashboardService.getPopUpData()
        }
      };
      console.log(this.dataDb);
      this.dashboardService.insertStockSheet(this.dataDb);
      // this.router.navigateByUrl('/dashboard');
      // this.location.back();
      this.showTemplate = false;
      this.listArr = [];
    } else {
      this.snackBar.open('Please Enter an Package Name', 'ok', {
        duration: 2000,
      });
    }
  
  }
  createNewTemp() {
    this.showTemplate = false;
    this.listArr = [];

  }
  openPopUp(listDetails?) {
    if (!listDetails) {
      const startDate = new Date();
      const formatStartDate = this.datePipe.transform(startDate, 'dd-MM-yyyy');
     listDetails = {
        role: this.userRole,
        eventDate: formatStartDate,
        salesPerson: '',
        pax: '',
        listArr: this.listArr,
        popUpArr:[]
      }
    }
    const dialogRef = this.dialog.open(UserpopupComponent, {
      width: '70%',
      height: '70%',
      data: {
        listDetails: listDetails
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.previewTemplate(listDetails);
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
        listArr: this.listArr
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
  createPopup() {
    // if (!listDetails) {
    //   const startDate = new Date();
    //   const formatStartDate = this.datePipe.transform(startDate, 'dd-MM-yyyy');
    //   listDetails = {
    //     role: this.userRole,
    //     eventDate: formatStartDate,
    //     salesPerson: '',
    //     pax: '',
    //     listArr: this.listArr
    //   }
    // }
    const dialogRef = this.dialog.open(PopupComponent, {
      width: '50%',
      height: '50%',
      data: {
        // listDetails: listDetails
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  reload() {
    // window.location.reload();
    // this.router.navigateByUrl('dashboard');
    this.location.back();
  }

  restartApp() {
    localStorage.clear(); // Clears stored data
    window.location.reload(); // Reloads the app
  }
  
}
