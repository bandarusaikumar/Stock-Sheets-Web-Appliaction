interface Result {
    name: any;
    itemArray: any[]
}

export class TemplatesModal {
    tableArr: any[];
    listDetails: any;
    public static create(obj: any) {
        const instance = new TemplatesModal();
        if (obj) {
            const tableArr = [];
            obj.listDetails.listArr.forEach((element: Result, i) => {
                const table = {
                    dataItems: [
                        { name: '', dataId: 'listName', type: 'text', editable: false },
                        { name: 'Units', dataId: 'units', type: 'checkBox', editable: false },
                        { name: 'Picked', dataId: 'units', type: 'checkBox', editable: false },
                        { name: 'Loaded', dataId: 'units', type: 'checkBox', editable: false },
                        { name: 'Returned', dataId: 'returned', type: 'select' }
                    ],
                    data: []
                };
                table.dataItems[0].name = element.name;
                table.data = element.itemArray;
                tableArr.push(table);
            });
            const headerArr = [];
            instance.tableArr = tableArr;
            instance.listDetails = obj;
        }
        return instance;
    }
}
