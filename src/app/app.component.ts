import { Component, OnInit,  ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AgGridAngular } from 'ag-grid-angular';
import RefData from './data/refData';
import { HeaderGroupComponent } from './header-group-component/header-group.component';
import { SkillFilter } from './filters/skill.component.filter';
import { ProficiencyFilter } from './filters/proficiency.component.filter';
import { AllModules, ColumnApi, GridApi, Module } from '@ag-grid-enterprise/all-modules';
import 'ag-grid-enterprise';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit  {
  @ViewChild('agGrid') agGrid: AgGridAngular;

  public rowData: any[];
  public columnDefs: any[];
  public rowCount: string;

  public defaultColDef: any;
  public frameworkComponents: any;
  public sideBar: false;
  public modules: Module[] = AllModules;
  public api: GridApi;
  public columnApi: ColumnApi;
  /*constructor(private http: HttpClient) {
  }*/
  constructor() {
    this.defaultColDef = {
        resizable: true,
        sortable: true,
        filter: true,
        floatingFilter: true,
        headerComponentParams: {
            menuIcon: 'fa-bars'
        }
    };

    this.frameworkComponents = {
        headerGroupComponent: HeaderGroupComponent
    };

    this.createRowData();
    this.createColumnDefs();
}

  ngOnInit(): void {
    console.log('Method not implemented.');
  }


  /*title = 'agGrid';
  rowData: any;
  defaultColDef = {
    sortable: true,
    filter: true
  };
  columnDefs = [
    { field: 'make', rowGroup: true },
    { field: 'price' }
  ];

  autoGroupColumnDef = {
    headerName: 'Model',
    field: 'model',
    cellRenderer: 'agGroupCellRenderer',
    cellRendererParams: {
      checkbox: true
    }
  };
  ngOnInit() {
   //   this.rowData = this.http.get<any[]>('https://www.ag-grid.com/example-assets/small-row-data.json');
   this.rowData = this.http.get('https://www.ag-grid.com/example-assets/row-data.json');
   this.createRowData();
  }
  getSelectedRows() {
    const selectedNodes = this.agGrid.api.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data );
    console.log('hmm ', selectedData );
    const selectedDataStringPresentation = selectedData.map(node => `${node.make} ${node.model}`).join(', ');

    console.log(`Selected nodes: `, selectedDataStringPresentation);
}*/

/***NEW TESITNG ***/

getSelectedRows() {
  const selectedNodes = this.api.getSelectedNodes();
  const selectedData = selectedNodes.map(node => node.data );
  console.log('hmm ', selectedData );
  const selectedDataStringPresentation = selectedData.map(node => `${node.name} , her language is ${node.language}`).join(', ');

  console.log(`Selected nodes: `, selectedDataStringPresentation);
}

public createRowData() {
  const rowData: any[] = [];

  for (let i = 0; i < 200; i++) {
      const countryData = RefData.countries[i % RefData.countries.length];
      rowData.push({
          name: RefData.firstNames[i % RefData.firstNames.length] + ' ' + RefData.lastNames[i % RefData.lastNames.length],
          skills: {
              android: Math.random() < 0.4,
              html5: Math.random() < 0.4,
              mac: Math.random() < 0.4,
              windows: Math.random() < 0.4,
              css: Math.random() < 0.4
          },
          dob: RefData.DOBs[i % RefData.DOBs.length],
          address: RefData.addresses[i % RefData.addresses.length],
          years: Math.round(Math.random() * 100),
          proficiency: Math.round(Math.random() * 100),
          country: countryData.country,
          continent: countryData.continent,
          language: countryData.language
      });
  }

  this.rowData = rowData;
 // console.log('fff ', rowData);
}

private createColumnDefs() {
  this.columnDefs = [
      {
          headerName: '#',
          width: 40,
          checkboxSelection: true,
          filter: false,
          sortable: false,
          suppressMenu: true,
          pinned: true
      },
      {
          headerName: 'Employee',
          headerGroupComponent: 'headerGroupComponent',
          children: [
              {
                  field: 'name',
                  width: 150,
                  pinned: true,
                  enableRowGroup: true,
                  enablePivot: true
              },
              {
                  field: 'country',
                  width: 150,
                  cellRenderer: countryCellRenderer,
                  pinned: true,
                  filterParams: {
                      cellRenderer: countryCellRenderer,
                      cellHeight: 20
                  },
                  enableRowGroup: true,
                  enablePivot: true,
                  columnGroupShow: 'show'
              }
          ]
      },
      {
          headerName: 'IT Skills',
          children: [
              {
                  field: 'skills',
                  width: 125,
                  sortable: false,
                  cellRenderer: skillsCellRenderer,
                  menuTabs: ['filterMenuTab'],
                //  filterFramework: SkillFilter,
                  enableRowGroup: true,
                  enablePivot: true
              },
              {
                  field: 'proficiency',
                  width: 160,
                  cellRenderer: percentCellRenderer,
                //  menuTabs: ['filterMenuTab'],
                 // filterFramework: ProficiencyFilter
              },
          ]
      },
      {
          headerName: 'Contact',
          children: [
              {
                  field: 'mobile',
               //   cellRendererFramework: RendererComponent,
                  minWidth: 150,
                  filter: 'agTextColumnFilter'
              },
              {
                  field: 'address',
                  minWidth: 500,
                  filter: 'agTextColumnFilter'
              }
          ]
      }
  ];
}



private calculateRowCount() {
  if (this.api && this.rowData) {
      const model = this.api.getModel();
      const totalRows = this.rowData.length;
      const processedRows = model.getRowCount();
      this.rowCount = processedRows.toLocaleString() + ' / ' + totalRows.toLocaleString();
  }
}
public onModelUpdated() {
  console.log('onModelUpdated');
  this.calculateRowCount();
}

public onGridReady(params) {
  console.log('onGridReady');

  this.api = params.api;
  this.columnApi = params.columnApi;

  this.api.sizeColumnsToFit();

  this.calculateRowCount();
}

public onCellClicked($event) {
  console.log('onCellClicked: ' + $event.rowIndex + ' ' + $event.colDef.field);
}

public onCellDoubleClicked($event) {
  console.log('onCellDoubleClicked: ' + $event.rowIndex + ' ' + $event.colDef.field);
}

public onCellContextMenu($event) {
  console.log('onCellContextMenu: ' + $event.rowIndex + ' ' + $event.colDef.field);
}

public onQuickFilterChanged($event) {
  this.api.setQuickFilter($event.target.value);
}

public invokeSkillsFilterMethod() {
  this.api.getFilterInstance('skills', (instance) => {
      const componentInstance = instance.getFrameworkComponentInstance();
      console.log('wohh ', componentInstance);
      componentInstance.helloFromSkillsFilter();
  });
}


}

function skillsCellRenderer(params) {
  const data = params.data;
  const skills = [];
  // tslint:disable-next-line:only-arrow-functions
  RefData.IT_SKILLS.forEach(function(skill) {
      if (data && data.skills && data.skills[skill]) {
     //     skills.push(`<img src="images/skills/${skill}.png" width="16px" title="${skill}" />`);
        skills.push(`<img src="../assets/images/skills/${skill}.png" width="16px" title="${skill}" />`);
      }
  });
  return skills.join(' ');
}

function countryCellRenderer(params) {
  // tslint:disable-next-line:max-line-length
  return `<img border='0' width='15' height='10'
  style='margin-bottom: 2px' src='../assets/images/flags/${RefData.COUNTRY_CODES[params.value]}.png'>${params.value}`;
}

function percentCellRenderer(params) {
  const value = params.value;

  const eDivPercentBar = document.createElement('div');
  eDivPercentBar.className = 'div-percent-bar';
  eDivPercentBar.style.width = value + '%';
  if (value < 20) {
      eDivPercentBar.style.backgroundColor = 'red';
  } else if (value < 60) {
      eDivPercentBar.style.backgroundColor = '#ff9900';
  } else {
      eDivPercentBar.style.backgroundColor = '#00A000';
  }

  const eValue = document.createElement('div');
  eValue.className = 'div-percent-value';
  eValue.innerHTML = value + '%';

  const eOuterDiv = document.createElement('div');
  eOuterDiv.className = 'div-outer-div';
  eOuterDiv.appendChild(eValue);
  eOuterDiv.appendChild(eDivPercentBar);

  return eOuterDiv;
}


function invokeSkillsFilterMethod() {
  throw new Error('Function not implemented.');
}

