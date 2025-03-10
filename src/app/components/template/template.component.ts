import { Component, ElementRef, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DashboardService } from 'src/app/shared/services/dashboard.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { COCKTAIL_RECIPES } from '../../shared/config/cocktail-recipes';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit {
  showNew: any;
  newItem: any;
  previewData: any;
  template: any;
  mainHeaderDataNameArr: any[] = ['Name', 'Units', 'Picked', 'Loaded', 'Returned'];
  tableArray: any[];
  userRole: any;
  @ViewChild('content', { static: false }) content: ElementRef;
  selectedIndex: any;
  templateData: any;
  popUpData: any;
  sumofRedWine: any;
  redWineGlass: number;
  sumofBeer: any;
  templateDataOnLoad: any;
  constructor(
    public dialogRef: MatDialogRef<TemplateComponent>,
    public dashboardService: DashboardService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // this.previewData = data.listDetails;
  }

  ngOnInit(): void {
    this.templateDataOnLoad = this.data.listDetails;
    this.templateData = this.templateDataOnLoad;
    this.popUpData = this.dashboardService.getUserDataPop();
    this.userRole = this.dashboardService.getUserRole();
    const tempItems = this.templateData.listArr;
    const popUpItems = this.popUpData.popUpArr;
    tempItems.forEach(temp => {
      popUpItems.forEach(pop => {
        if (temp.name === pop.name) {
          
          temp.items.forEach(tItems => {
            pop.items.forEach(pItems => {
              let someItem = temp.items.map(ele => ele.name);
              if (!someItem.includes(pItems.name)) {
                temp.items.push(pItems);
              }
              else {
                temp.items.filter(ele => {
                  if (ele.name === pItems.name) {
                    ele.units = pItems.units
                  }
                })
                // tItems.units = pItems.units
              }
            });
          });

        }

      });
      if (temp.name == 'Garnishes') {
        let bottleCount = {
          'Cocktails': [
            {
              name: 'ice',
              mul: 1,
              units: 0
            },
            {
              name: 'Lime',
              mul: 4,
              units: 0
            },
            {
              name: 'Soda',
              mul: 2,
              units: 0
            }
          ],
        }
        popUpItems.forEach(element => {
          let sum = 0;
          if (Object.keys(bottleCount).includes(element.name)) {
            sum = element.items.map(a => a.units).reduce(function (a, b) {
              return a + b;
            });
            let somepush = temp.items.map(ele => ele['id']);
            if (sum > 0) {

              bottleCount[element.name].forEach(element => {
                let glassArray = {
                  loaded: false,
                  name: element.name,
                  picked: false,
                  returned: 0,
                  units: (sum * element.mul),
                  id: element.name
                }
                if (!somepush.includes(element.name)) {
                  temp.items.push(glassArray)
                }
                else {
                  temp.items.filter(ele => {
                    if (ele.id === element.name) {
                      ele.units = glassArray.units
                    }
                  })
                }
              });
            }
          }
        });
      }
      if (temp.name == 'Glassware') {
        let bottleCount = {
          'Red Wine': [
            {
              name: 'RedWine Glass',
              mul: 8,
              units: 0
            }
          ],
          'Beer': [
            {
              name: 'Beer Glass',
              mul: 1,
              units: 0
            }
          ],
          'Spirits': [
            {
              name: 'Spirits Glass',
              mul: 4,
              units: 0
            }
          ],
          'Cocktails': [
            {
              name: 'Cocktails Glass',
              mul: 1,
              units: 0
            }
          ],
        }
        popUpItems.forEach(element => {
          let sum = 0;
          if (Object.keys(bottleCount).includes(element.name)) {
            sum = element.items.map(a => a.units).reduce(function (a, b) {
              return a + b;
            });
            let somepush = temp.items.map(ele => ele['id']);
            if (sum > 0) {

              bottleCount[element.name].forEach(element => {
                let glassArray = {
                  loaded: false,
                  name: element.name,
                  picked: false,
                  returned: 0,
                  units: (sum * element.mul),
                  id: element.name
                }
                if (!somepush.includes(element.name)) {
                  temp.items.push(glassArray)
                }
                else {
                  temp.items.filter(ele => {
                    if (ele.id === element.name) {
                      ele.units = glassArray.units
                    }
                  })
                }
              });
            }
          }
        });
      }

      if (temp.name === 'Cocktail Ingredients') {
        this.calculateCocktailIngredients(temp, popUpItems);
      }

    });
    console.log('RealData', this.templateData);
  }

  calculateCocktailIngredients(temp, popUpItems) {
    popUpItems.forEach(element => {
      if (element.name === 'Cocktails') {
        element.items.forEach(cocktail => {
          if (COCKTAIL_RECIPES[cocktail.name]) {
            const pax = this.templateData.pax || 1;
            const recipe = COCKTAIL_RECIPES[cocktail.name];
            
            recipe.ingredients.forEach(ingredient => {
              const totalQuantity = (ingredient.quantity * pax * cocktail.units) / 1000; // Convert to liters
              
              const ingredientItem = {
                loaded: false,
                name: ingredient.name,
                picked: false,
                returned: 0,
                units: totalQuantity,
                id: ingredient.name
              };

              // Add or update ingredient in template
              const existingItem = temp.items.find(item => item.name === ingredient.name);
              if (existingItem) {
                existingItem.units += totalQuantity;
              } else {
                temp.items.push(ingredientItem);
              }
            });
          }
        });
      }
    });
  }

  close() {
    // this.templateData=" "
    this.dashboardService.resetUserDataPop();
  }

  onSubmit() {
    console.log(this.templateData);
    this.dashboardService.saveUserTemp(this.templateData);
  }
  deleteList(j, i) {
    alert('Are you sure you want to delete list?');
    this.templateData.listArr[j].items.splice(i, 1);
  }
  AddItemToList(index) {
    this.showNew = true;
    this.selectedIndex = index;

  }
  AddList(j, newItem) {
    const itemObj = {
      name: newItem,
      units: 0,
      picked: false,
      loaded: false,
      returned: 0
    }
    this.templateData.listArr[j].items.push(itemObj);
    this.showNew = false;
  }
  hide() {
    if (this.showNew == true) {
      this.showNew = false;
    }
  }
  exportAsPDF(div_id) {
    
    // window.print();
    const documentDefinition = this.getDocumentDefinition();
  // pdfMake.createPdf(documentDefinition).download();
  pdfMake.createPdf(documentDefinition).open();
  }
  getDocumentDefinition() {
    return {
      content: [
        {
          columns: [
            [{
              text: 'Stock Sheet Number :' + this.templateData.savedId,
            },
            {
              text: 'Client Name : ' + this.templateData.clientName,
            },
            {
              text: 'Event date : ' + this.templateData.eventDate,
            },
            {
              text: 'Sales Person : ' + this.templateData.salesPerson,
            },
            {
              text: 'Pax : ' + this.templateData.pax,
            },
            ],
          ]
        },
        this.getEducationObject(this.templateData.listArr),
      ],
      info: {
        title: this.templateData.packageName + '_Stock_Sheet',
        author: this.templateData.packageName,
        subject: 'Stock_Sheet',
        keywords: 'Stock_Sheet, Stock_Sheet',
      },
      images: {
        checked: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAQAAACROWYpAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAF+2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMTktMTItMzBUMDE6Mzc6MjArMDE6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE5LTEyLTMwVDAxOjM4OjI4KzAxOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE5LTEyLTMwVDAxOjM4OjI4KzAxOjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMSIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9IkRvdCBHYWluIDIwJSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowNzVjYjZmMy1jNGIxLTRiZjctYWMyOS03YzUxMWY5MWJjYzQiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo5ZTM1YTc3ZC0zNDM0LTI5NGQtYmEwOC1iY2I5MjYyMjBiOGIiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowYzc2MDY3Ny0xNDcwLTRlZDUtOGU4ZS1kNTdjODJlZDk1Y2UiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjBjNzYwNjc3LTE0NzAtNGVkNS04ZThlLWQ1N2M4MmVkOTVjZSIgc3RFdnQ6d2hlbj0iMjAxOS0xMi0zMFQwMTozNzoyMCswMTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKE1hY2ludG9zaCkiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjA3NWNiNmYzLWM0YjEtNGJmNy1hYzI5LTdjNTExZjkxYmNjNCIgc3RFdnQ6d2hlbj0iMjAxOS0xMi0zMFQwMTozODoyOCswMTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+jHsR7AAAAUNJREFUOMvN1T9Lw0AYx/EviLVFxFH8M3USgyAFoUsQ0UV8F6Ui4qCTbuJg34HgptBdUATrUoxiqYMgiOBoIcW9BVED+jgkntGm9i6CmN+Sg/vAcc89dwBd5Clzj6uZGg7LJAC62UFipEgKcmroaeZj/gpcIAhl5rE1M0cJQbiCOsIrs5h8WZ4R6j72yBrhcRo+dhE8bCOcoYng/hFOMxAXb/DAHTNxcCGo7JE5LqhjsW2KP6nDcGecCv1vRdC2eJQDLllooach2hbvIghvLJJgM0QHdeq8F0x/5ETRM4b0DonF7be+Pf+y4A4bZnETok4E/XG3xxR3WhasUWeLCg2OGYnXGP1MkPwnLRmJf3UN+RfgtBGe5MnHVQShxBQZzdgcIgjXsKSu/KZmXgKxBkmKsZ6bffoAelilQs3goauyTi+8A8mhgeQlxdNWAAAAAElFTkSuQmCC',
        unchecked: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAQAAACROWYpAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAF+2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMTktMTItMzBUMDE6Mzc6MjArMDE6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE5LTEyLTMwVDAxOjM4OjU3KzAxOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE5LTEyLTMwVDAxOjM4OjU3KzAxOjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMSIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9IkRvdCBHYWluIDIwJSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowNzVjYjZmMy1jNGIxLTRiZjctYWMyOS03YzUxMWY5MWJjYzQiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo5ZTM1YTc3ZC0zNDM0LTI5NGQtYmEwOC1iY2I5MjYyMjBiOGIiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowYzc2MDY3Ny0xNDcwLTRlZDUtOGU4ZS1kNTdjODJlZDk1Y2UiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjNiZjY4MWUzLWExNGEtNDI4My04YjE2LTM2NDgzYTZiZmU2NiIgc3RFdnQ6d2hlbj0iMjAxOS0xMi0zMFQwMTozNzoyMCswMTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKE1hY2ludG9zaCkiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmMwZTIyYmFkLWVjZWQtNDNlZS1iMjNkLWM0NmM5M2IzZTM1YyIgc3RFdnQ6d2hlbj0iMjAxOS0xMi0zMFQwMTozODo1NyswMTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+6AB6cQAAAPxJREFUOMvF1b1Kw1AYBuAnFf8QL8WlIHQJIriIdyEu4qCTXop7dwenTgUHpYvgJVhob8AuakE+h9hapJqcFDXvFDgPIXlzvgNLjnQ9GlRM340TK7DsUtRI2zqH09txxUzWn3IrhK4DecXs6wjhnqHwZk/K1fIiDAs81krCW54KPBDG8iTcNBIGf4ND1MWTdmrgqIOL5TM0S8SRhmMu1dAo+2DZ57t9eWajtKrvN1GVnrMK9HewhbBy+nPPJbTsJwmymOn8P7fkfLzQGCoG4G4S3vZc4J4QOnY0KyZ3LYQHjqcjf1Qxrx/inDXtWsfNlU1YdeZOP+Gg67mwwTvIDqR1iAowgQAAAABJRU5ErkJggg==',
    },
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 20, 0, 10],
            decoration: 'underline'
          },
          name: {
            fontSize: 16,
            bold: true
          },
          jobTitle: {
            fontSize: 14,
            bold: true,
            italics: true
          },
          sign: {
            margin: [0, 50, 0, 10],
            alignment: 'right',
            italics: true
          },
          tableHeader: {
            bold: true,
            
          }
        }
    };
  }
  getEducationObject(list) {
    const exs = [];
    const exsData = [];
    debugger;
    list.forEach(data => {
      exs.push(
        [{
          columns: [
            {
              text: '\n\n'+data.name +'\n\n',
              style: 'tableHeader',
              alignment: 'left',
            },
            {
              text: '\n\n'+'Units' +'\n\n',
              style: 'tableHeader',
              alignment: 'right',
            },
            {
              text: '\n\n'+'Picked'+'\n\n',
              style: 'tableHeader',
              alignment: 'right',
            },
            {
              text: '\n\n'+'Loaded' +'\n\n',
              style: 'tableHeader',
              alignment: 'right',
            },
            {
              text: '\n\n'+'returned' +'\n\n',
              style: 'tableHeader',
              alignment: 'right',
            }
            
          ]
         
        }]
      );
      debugger;
      data.items.forEach(ele => {
        exs.push(
          [{
            columns: [
              {
                text: ele.name,
                alignment: 'left'
              },
              {
                text: ele.units,
                
                alignment: 'right'
              },
              {
                image: (ele.picked===true?'checked':'unchecked'),
                fit: [12, 12],
                alignment: 'right'
              },
              {
                image: (ele.loaded===true?'checked':'unchecked'),
                fit: [12, 12],
                alignment: 'right'
              },
              {
                text: ele.returned,
                alignment: 'right'
              }
              
            ],
           
          }]
        );
      });
    });
    return {
      style: 'tableExample',
      table: {
        widths: [500, 100, 100, 100],
        body: [
          ...exs,
       
        ]
      },
      layout: 'lightHorizontalLines'
    };
  }
}
