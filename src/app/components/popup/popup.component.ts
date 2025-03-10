import { Component, ElementRef, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DashboardService } from 'src/app/shared/services/dashboard.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { COCKTAIL_RECIPES } from '../../shared/config/cocktail-recipes';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {
  listName: any = '';
  itemName: any;
  disableAddList = false;
  showList = false;
  itemArr = [];
  listArr = [];
  constructor(
    public dialogRef: MatDialogRef<PopupComponent>,
    public dashboardService: DashboardService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {

  }

  ngOnInit(): void {
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
      console.log(this.listArr);
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
  savePopup(){
    this.dashboardService.setPopUpData(this.listArr);
  }

  addCocktail() {
    const cocktailList = {
      name: 'Cocktails',
      id: Math.floor((Math.random() * 10000) + 1),
      items: [
        {
          name: 'Espresso Martini',
          units: 100, // Number of cocktails needed
          picked: false,
          loaded: false,
          returned: 0
        },
        {
          name: 'Mojito',
          units: 50,  // Number of cocktails needed
          picked: false,
          loaded: false,
          returned: 0
        }
      ]
    };
    
    this.listArr.push(cocktailList);
  }
}
