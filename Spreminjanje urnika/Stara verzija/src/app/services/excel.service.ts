import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  styleExcelRazredi(ws: any) {
    var keys: any = [];
    Object.keys(ws).forEach(r => {
      if (r != "!cols" && r != "!fullref"
      && r != "!merges" && r != "!ref" && r != "!rows") {
        keys.push(r)
        ws[r].s = {
          border: {
            top: {style: "thin", color: "black"},
            bottom: {style: "thin", color: "black"},
            left: {style: "thin", color: "black"},
            right: {style: "thin", color: "black"}
          }
        }
      }
      
    })


    var k = ["B1", "K1", "T1", "AC1", "AL1", "A2", "J2", "AB2", "AK2", "S2"]

    for (var i = 0; i < k.length; i++) {
      ws[k[i]].s = {
        fill: {fgColor: {rgb: "BFBFBF"}},
        alignment: {horizontal: "center"},
        font: {bold: true},
        border: {
          top: {style: "thin", color: "black"},
          bottom: {style: "thin", color: "black"},
          left: {style: "thin", color: "black"},
          right: {style: "thin", color: "black"}
        }
      }
    }

    var k = ["B", "C", "D", "E", "F", "G", "H", "K", "L", "M", "N", "O", "P", "Q", "T", "U", "V", "W", "X", "Y", 
    "Z", "AC", "AD", "AE", "AF", "AG", "AH", "AI", "AL", "AM", "AN", "AO", "AP", "AQ", "AR"]

    for (var i = 0; i < k.length; i++) {
      var a = k[i] + "2"
      ws[a].s = {
        fill: {fgColor: {rgb: "D9D9D9"}},
        border: {
          top: {style: "thin", color: "black"},
          bottom: {style: "thin", color: "black"},
          left: {style: "thin", color: "black"},
          right: {style: "thin", color: "black"}
        }
      }
    }

    var tab = []
    for (var i = 0; i < 55; i++) {
      if (i % 9 == 0) tab.push({wch: 5})
      else tab.push({wch: 9})
    } 
    
    ws['!cols'] = tab;
    // Profesorji -------------------------------------------------------------------
    var k = ["A", "AB", "AK", "J", "S"]

    var vsiRazredi = window.vsiRazredi.length
    
    for (var i = 0; i < k.length; i++) {
      for (var j = 3; j < vsiRazredi + 3; j++) {
        var sp = k[i] + j
        ws[sp].s = {
          fill: {fgColor: {rgb: "D9D9D9"}},
          alignment: {horizontal: "left"},
          border: {
            top: {style: "thin", color: "black"},
            bottom: {style: "thin", color: "black"},
            left: {style: "thin", color: "black"},
            right: {style: "thin", color: "black"}
          } 
        }
      }
    } 
    
    
    

    return ws;
  }

  styleExcel(ws: any) {

    
    var keys: any = [];
    Object.keys(ws).forEach(r => {
      if (r != "!cols" && r != "!fullref"
      && r != "!merges" && r != "!ref" && r != "!rows") {
        keys.push(r)
        ws[r].s = {
          border: {
            top: {style: "thin", color: "black"},
            bottom: {style: "thin", color: "black"},
            left: {style: "thin", color: "black"},
            right: {style: "thin", color: "black"}
          }
        }
      }
      
    })

    var k = ["B1", "K1", "T1", "AC1", "AL1", "A2", "J2","S2", "AB2", "AK2"]

    for (var i = 0; i < k.length; i++) {
      ws[k[i]].s = {
        fill: {fgColor: {rgb: "BFBFBF"}},
        alignment: {horizontal: "center"},
        font: {bold: true},
        border: {
          top: {style: "thin", color: "black"},
          bottom: {style: "thin", color: "black"},
          left: {style: "thin", color: "black"},
          right: {style: "thin", color: "black"}
        }
      }
    }

    
    var k = ["B", "C", "D", "E", "F", "G", "H", "K", "L", "M", "N", "O", "P", "Q", "T", "U", "V", "W", "X", "Y", 
    "Z", "AC", "AD", "AE", "AF", "AG", "AH", "AI", "AL", "AM", "AN", "AO", "AP", "AQ", "AR"]

    for (var i = 0; i < k.length; i++) {
      var a = k[i] + "2"
      

      ws[a].s = {
        fill: {fgColor: {rgb: "D9D9D9"}},
        border: {
          top: {style: "thin", color: "black"},
          bottom: {style: "thin", color: "black"},
          left: {style: "thin", color: "black"},
          right: {style: "thin", color: "black"}
        }
      }
    }
    

    var tab = []
    for (var i = 0; i < 55; i++) {
      if (i % 9 == 0) tab.push({wch: 12})
      else tab.push({wch: 8})
    } 

    ws['!cols'] = tab;
    // Profesorji -------------------------------------------------------------------
    var k = ["A", "AB", "AK", "J", "S"]

    var vsiProf = window.vsiProfesorji.length
   
    for (var i = 0; i < k.length; i++) {
      for (var j = 3; j < vsiProf+3; j++) {
        var sp = k[i] + j
        ws[sp].s = {
          fill: {fgColor: {rgb: "D9D9D9"}},
          alignment: {horizontal: "left"},
          border: {
            top: {style: "thin", color: "black"},
            bottom: {style: "thin", color: "black"},
            left: {style: "thin", color: "black"},
            right: {style: "thin", color: "black"}
          } 
        }
      }
    } 
    
    
    

    return ws;
  }
}
