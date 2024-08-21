import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrnikService {

  constructor() { }

  
  vecIzbranihProfesorjev(profesorji: any, dan: any) {
    var obj: any = {};

    function urnikRazreda(razredi: any) {
      
      if (razredi.indexOf('') > -1) razredi.splice(razredi.indexOf(''), 1); 
      if (razredi.indexOf(' ') > -1) razredi.splice(razredi.indexOf(' '), 1); 

      var predmeti = new Array(razredi.length)
      var prof = new Array(razredi.length)

      for (var i = 0; i < razredi.length; i++) {
        var index = window.urnik.predmeti.findIndex((x: any) => x.razred == razredi[i]) 
        
        if (index >= 0) {
          predmeti[i] = window.urnik.predmeti[index][dan];
          prof[i] = window.urnik.profesorji[index][dan];
        }
      }
      return {
        predmeti: predmeti,
        prof: prof
      };
    }
    
    for (var i = 0; i < profesorji.length; i++) {
      var arr = [];
      var index = window.urnik.urnikZaProf.findIndex((x: any) => x.profesor == profesorji[i]) 
      if (index >= 0) {
        for (var j = 0; j < window.urnik.urnikZaProf[index][dan].length; j++) {
          if (window.urnik.urnikZaProf[index][dan][j] != 'Prosto' && window.urnik.urnikZaProf[index][dan][j] != 'prosto') {
            arr.push(window.urnik.urnikZaProf[index][dan][j].split(':')[0].toUpperCase());
          }
        }
        arr = arr.filter((v, i, a) => a.indexOf(v) === i);
        var a = urnikRazreda(arr)
        obj[profesorji[i] + 'razredi'] = arr;
        obj[profesorji[i] + 'prof'] = a.prof;
        obj[profesorji[i]] = a.predmeti;
      }
      
      
    }

    
   
    return obj;
  }

  urnikProfesorja(profesorji: any, dan: any) {
    var obj: any = {};
    var prosteUre = 0;

   

    for (var i = 0; i < profesorji.length; i++) {
      var index = window.urnik.urnikZaProf.findIndex((x: any) => x.profesor == profesorji[i]) 
      var arr = [];
      if (index >= 0) {
        for (var j = 0; j < window.urnik.urnikZaProf[index][dan].length; j++) {
          if (window.urnik.urnikZaProf[index][dan][j] == 'Prosto') {
            arr.push(' ');
            prosteUre++; 
          }
          else arr.push(window.urnik.urnikZaProf[index][dan][j].split(':')[0].toUpperCase())
        }
      }
      obj[profesorji[i]] = arr
    }
    return obj;
  }

  urnikIzbranihRazredov(razredi: any, dan: any) {
    var obj: any = {};
    for (var i = 0; i < razredi.length; i++) {
      var index = window.urnik.profesorji.findIndex((x: any) => x.razred == razredi[i])
      var index2 = window.urnik.predmeti.findIndex((x: any) => x.razred == razredi[i])
      obj[razredi[i]] = window.urnik.profesorji[index][dan];
      obj[razredi[i] + 'predmet'] = window.urnik.predmeti[index2][dan];
    }
    return obj;
  }

  razrediProfesorja(prof: any, dan: any) {
    
    var index = window.urnik.urnikZaProf.findIndex((x: any) => x.profesor == prof)
    
    var razredi = [];
    for (var i = 0; i < 7; i++) {
      if (window.urnik.urnikZaProf[index][dan][i].split(':')[0] != 'Prosto') {
        console.log(i)
        razredi.push([i, window.urnik.urnikZaProf[index][dan][i].toUpperCase()])
      }
    }

    razredi = razredi.filter((v:any, i:any, a:any) => a.indexOf(v) === i);

    return razredi;

  }

  najdiProste(dan: any) {
    
    var razredi = [];
    var razrediDan = [];
    var stevec = 0;
    var dnevi = ['pon', 'tor', 'sre', 'cet', 'pet'];

    var stRazredov = window.urnik.predmeti.length
    var stDni = dnevi.length;

    var naDan = [0,0,0,0,0,0];

    

    for (var i = 0; i < stRazredov; i++) {
      for (var j = 0; j < stDni; j++) {
        if (window.urnik.predmeti[i][dnevi[j]].includes('Prosto')) razredi.push(window.urnik.predmeti[i].razred)

        var d = window.urnik.predmeti[i][dnevi[j]].length;
        for (var x = 0; x < d; x++) if (window.urnik.predmeti[i][dnevi[j]][x] == 'Prosto') {
          naDan[j]++;
          stevec++;   
        }
      }
      if (window.urnik.predmeti[i][dan].includes('Prosto')) razrediDan.push(window.urnik.predmeti[i].razred)
    }

    
    razredi = razredi.filter((item, i, ar) => ar.indexOf(item) === i);
    return {
      naDan: naDan,
      vsi: razredi,
      razredi: razrediDan,
      stevec: stevec
    };

  }

  preglejCeProst(prvi: any, drugi: any, dan: any) {
    var prvaUra = prvi.ura;
    var drugaUra = drugi.ura;

    var index = window.urnik.urnikZaProf.findIndex((x: any) => x.profesor == prvi.profesor);

    var index2 = window.urnik.urnikZaProf.findIndex((x: any) => x.profesor == drugi.profesor);

    

    if (index > -1) {
      var a = window.urnik.urnikZaProf[index][dan][drugaUra];
      if (a != 'Prosto') a = a.split(':')[0].toUpperCase();
      var p1 = window.urnik.urnikZaProf[index].profesor;
    }
    if (index2 > -1) {
      var b = window.urnik.urnikZaProf[index2][dan][prvaUra];
      if (b != 'Prosto') b = b.split(':')[0].toUpperCase();
      var p2 = window.urnik.urnikZaProf[index2].profesor;
    }
    return {
      ura1: a,
      p1: p1,
      ura2: b,
      p2: p2
    }
  }

  urnikProfesorjevProsto(razred: any, dan: any) {
    var index = window.urnik.profesorji.findIndex((x: any) => x.razred == razred)

    var uni = window.urnik.profesorji[index][dan].filter((v:any, i:any, a:any) => a.indexOf(v) === i);

    
    var unique = [];

    for (var i = 0; i < uni.length; i++) if (uni[i] != 'Prosto' && uni[i] != 'prosto') unique.push(uni[i])
    
   
    var prof = [];
    for (var i = 0; i < unique.length; i++) {
      if (unique[i].includes(',')) {
        var a = unique[i].split(',');
        for (var j = 0; j  < a.length; j++) prof.push(a[j]);
      } else {
        if (unique[i] != '') prof.push(unique[i]);
      }
    }
    var obj = this.urnikProfesorja(prof, dan)
    return {
      objekt: obj,
      prof: prof
    };
  }

  najdiProsteProfesorje(data: any) {
    var dan = data.dan;
    var j = data.ura-1

    var medUra = [];
    var prosti = [];
    var prostDan = [];
    var naRazpolago = [];
    var neProsti = [];

    // 0 Prost dan
    // 1 Prost
    // 2 Na razpolago
    // 3 Ne prost
    // 4 Med ura

    function otherThanNull(arr: any) {
      for (var i = 0; i < arr.length; i++) if (arr[i] != 'Prosto' && arr[i].length > 1) return 0;
      return 1;
    }

    function vmesnaUra(arr: any) {
      if (j > 0 && j < 7) {
        if (arr[j-1] != 'Prosto' && arr[j+1] != 'Prosto') return 1;
        else return 0; 
      } else {
        return 0;
      }
    }

    for (var i = 0; i < window.urnik.urnikZaProf.length; i++) {
      if (window.urnik.urnikZaProf[i][dan][j] == 'r' || window.urnik.urnikZaProf[i][dan][j] == 'R') {
        naRazpolago.push([window.urnik.urnikZaProf[i]['profesor'], 2])
      }
      if (window.urnik.urnikZaProf[i][dan][j] == "Prosto") {
        var a = otherThanNull(window.urnik.urnikZaProf[i][dan])
        if (a) {
          prostDan.push([window.urnik.urnikZaProf[i]['profesor'], a])
          
        } else {
          var b = vmesnaUra(window.urnik.urnikZaProf[i][dan])
          if (b) medUra.push([window.urnik.urnikZaProf[i]['profesor'], 4])
          else prosti.push([window.urnik.urnikZaProf[i]['profesor'], a])
        }
      } else {
        neProsti.push([window.urnik.urnikZaProf[i]['profesor'], 3])
      }
    }

    
    var arr = naRazpolago.concat(medUra).concat(prosti).concat(neProsti).concat(prostDan);
    
    

    //for (var i = 0; i < arr.length; i++) if (arr[i][0] == data.profesor) index = i; 
   
    if (data.profesor != 'Prosto' && data.profesor != 'prosto') arr.unshift([data.profesor, 0])

    
    return arr;
  }

  profesorjiNaRazpolago(data: any) {

    var dan = data.dan;
    var j = data.ura-1
    var prof = []

    for (var i = 0; i < window.urnik.urnikZaProf.length; i++) {
      if (window.urnik.urnikZaProf[i][dan][j].includes('R')) {
        prof.push(window.urnik.urnikZaProf[i].profesor)
      }
    }

    return prof;
  }

  urnikProfesorjevZaRazred(data: any) {

    var index = window.urnik.predmeti.findIndex((x: any) => x.razred == data.razred)
    var arr = window.urnik.profesorji[index][data.dan];
    arr = arr.filter((item: any , i: any, ar: any) => ar.indexOf(item) === i);
    
    if (arr.indexOf('Prosto') != -1) arr.splice(arr.indexOf('Prosto'), 1);
    if (arr.indexOf('') != -1) arr.splice(arr.indexOf(''), 1);

    

   

    var seznamProf: any = [];

    for (var i = 0; i < arr.length; i++) {
      if (arr[i].includes(',')) {
        var a = arr[i].split(',');
        for (var j = 0; j < a.length; j++) seznamProf.push(a[j])
      } else {
        seznamProf.push(arr[i])
      }
    }

    var x = new Array(seznamProf.length);
    for (var i = 0; i < x.length; i++) x[i] = new Array(8);

    var y = new Array(seznamProf.length);
    for (var i = 0; i < y.length; i++) y[i] = new Array(8);

  
    for (var i = 0; i < seznamProf.length; i++) { 
      var index = window.urnik.urnikZaProf.findIndex((x: any) => x.profesor == seznamProf[i])
      if (index >= 0) {
        x[i][0] = seznamProf[i];
        for (var j = 0; j < 7; j++) {
          x[i][j+1] = window.urnik.urnikZaProf[index][data.dan][j].split(':')[0]
        }
      }
    }
    return x;
  }

  urnikRazreda(data: any) {
    var index = window.urnik.profesorji.findIndex((x: any) => x.razred == data.razred)
    return window.urnik.profesorji[index][data.dan];
  }

  najdiVseSpremembe(dan: any, stalen: any, urnik: any) {

    dan = dan.toLowerCase();


    var razredi = [];
    var profesorji = [];

    for (var i = 0; i < stalen.urnikZaProf.length; i++) {
      
      var profesor = stalen.urnikZaProf[i].profesor;
      var index = urnik.urnikZaProf.map((e: any) => e.profesor).indexOf(profesor);

      var a = stalen.urnikZaProf[i][dan]
      var b = urnik.urnikZaProf[index][dan]

      if(preglejCeEnako(a, b)) {
        //if (profesor == "Loss") 
        profesorji.push(profesor)
      }
    }

    for (var i = 0; i < stalen.profesorji.length; i++) {
      var razred = stalen.profesorji[i].razred;
      var index = urnik.profesorji.map((e: any) => e.razred).indexOf(razred);

      var a = stalen.profesorji[i][dan]
      var b = urnik.profesorji[index][dan]

      if(preglejCeEnako(a, b)) {
        razredi.push(razred)
      }
    }

    for (var i = 0; i < stalen.profesorji.length; i++) {
      var razred = stalen.predmeti[i].razred;
      var index = urnik.predmeti.map((e: any) => e.razred).indexOf(razred);

      var a = stalen.predmeti[i][dan]
      var b = urnik.predmeti[index][dan] 

      if(preglejCeEnako(a, b)) {
        razredi.push(razred)
      }
    }

    var unique_razredi = razredi.filter((v, i, a) => a.indexOf(v) === i);
  
    profesorji = [...new Set(profesorji)];
    return {
      prof: profesorji,
      razredi: unique_razredi
    }
  
  



function preglejCeEnako(a: any, b: any) {
  for (var i = 0; i < b.length; i++) {

    var aa = a[i].toLowerCase()
    var bb = b[i].toLowerCase()

     
    
    if (aa != bb) {
      return true
    }
  }
  return false
}


  }

  

}
