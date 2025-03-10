import { ConstantPool } from '@angular/compiler';
import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  userRole: any;
  popUp:any;
  setUserPopUp: any;
  // constructor(private http: HttpClient) { }

  constructor(private firebase: AngularFireDatabase) { }
  stockList: AngularFireList<any>;
  userStockSavedList: AngularFireList<any>;
  bookRef: AngularFireObject<any>;

  setUserRole(role) {
    this.userRole = role;
  }
  getUserRole() {
    return this.userRole;
  }
  setPopUpData(data){
this.popUp=data;
  }
  getPopUpData(){
    return this.popUp;
  }
  setUserDataPop(data){
    this.setUserPopUp=data;
  }
  getUserDataPop(){
    return this.setUserPopUp;
  }
  resetUserDataPop(){
    this.setUserPopUp="";
  }
  getList() {
    // return this.http.get('assets/json/queue-column-header.json').toPromise();
    this.userStockSavedList = this.firebase.list('userSavedSheets');
    this.stockList = this.firebase.list('stockSheets');
    return this.stockList.valueChanges();
  }
  getUserSaved() {
    this.userStockSavedList = this.firebase.list('userSavedSheets');
    return this.userStockSavedList.valueChanges();
  }
  

  insertStockSheet(stock) {
    this.stockList.push({
      // id: stock.listDetails.$key,
      packageName: stock.listDetails.packageName,
      role: stock.listDetails.role,
      eventDate: stock.listDetails.eventDate,
      // salesPerson: stock.listDetails.salesPerson,
      pax: stock.listDetails.pax,
      listArr: stock.listDetails.listArr,
      popUpArr: stock.listDetails.popUpArr,
    });
  }
 
  saveUserTemp(stock) {
    this.userStockSavedList.push({
      savedId: Math.floor((Math.random() * 10000) + 1), 
      clientName:stock.clientName,
      role: this.userRole,
      eventDate: stock.eventDate,
      salesPerson: stock.salesPerson,
      pax: stock.pax,
      listArr: stock.listArr,
    });
  }
}
