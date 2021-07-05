/*
 You may not change or alter any portion of this comment or credits
 of supporting developers from this source code or any supporting source code
 which is considered copyrighted (c) material of the original comment or credit authors.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 --------------------------------------------------------
 auteur : JJ Delalandre - jjdelalandre@orange.fr
 site : http:jubile.fr
 version : 2.0
 date de creatiion : 01-06-2021
 date de modification : 04-07-2021
 licence : GPL
*/

var optionsTTH = {
 'arrows' : new Array("updown_off.png", "up_on.png", "down_on.png", "blank.png", "up_off.png", "down_off.png"),
 'imgFld' : "trierTableauHTML/images/",
 'skin' : "skin-arrow-blue-round", //dossier des icones dans le frameworks
 'localLang' : "fr",
 'posImg' : "right", //position de l'icone, right or left
 'asc' : true, //defini le sens de tri des colonnes par défaut
 'last_asc' : false, // si true change 'asc' à chaque changement de sens
 'typeContent' : 0 //utilisé pendant le dev
};
 
var ico_blank    = optionsTTH['arrows'].indexOf('blank.png');
var ico_up_on    = optionsTTH['arrows'].indexOf('up_on.png');
var ico_up_off   = optionsTTH['arrows'].indexOf('up_off.png');
var ico_down_on  = optionsTTH['arrows'].indexOf('down_on.png');
var ico_down_off = optionsTTH['arrows'].indexOf('down_off.png');
 
 

/* ***********************************************************

************************************************************** */
function init_TrierTableauHTML(options = null){
if (options != null)
    for (var cle in options) {
        optionsTTH[cle] = options[cle];
    }
    
    
}
// exemple d'initalisation des options
//init_TrierTableauHTML({ "posImg" : 'left', "skin" : 'skin-arrow-green', "asc" : false});

/* ***********************************************************

************************************************************** */
function isValidDate(d) {
  //d="2121-05-12";
  d2 = d.replace(/\-/gi,"/");
  if (optionsTTH['localLang'] == "fr"){
    t1 = d2.split(" ");
    t2 = t1[0].split("/");
    var j = t2[0];
    t2[0] = t2[1];
    t2[1] = j;
    d2 = t2.join("/") + " " + t1[1];
  }
  
  //t1 = d2.split(" ");
  var timestamp = Date.parse(d2);
  r = (isNaN(timestamp)) ? 0: timestamp;
  //alert (d2 + "|" + r + "|" + timestamp);
  return r;
}

/* ***********************************************************

************************************************************** */
const compare = function(ids, asc){
  return function(row1, row2){
    const tdValue = function(row, ids){
      return row.children[ids].textContent;
    }
    const tri = function(v1, v2){
      if (v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2)){
        optionsTTH['typeContent'] = 1
        return v1 - v2;
      }
      
      else if(isValidDate(v1)>0 || isValidDate(v2)>0) {
        optionsTTH['typeContent'] = 3;
        return isValidDate(v1) - isValidDate(v2);       
       }   
      
      
      else {
        optionsTTH['typeContent'] = 2
        return v1.toString().localeCompare(v2, optionsTTH['localLang'], {ignorePunctuation: true});
      }
      return v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2, optionsTTH['localLang'], {ignorePunctuation: true});
    };
    return tri(tdValue(asc ? row1 : row2, ids), tdValue(asc ? row2 : row1, ids));
  }
}

/* ***********************************************************

************************************************************** */
function getNewImg2Sort(index){
    var oImg = document.createElement('img');
    oImg.src = optionsTTH['imgSkin'] + optionsTTH['arrows'][index];
    oImg.style.styleFloat = optionsTTH['posImg'];
    oImg.style.cssFloat = optionsTTH['posImg'];
    oImg.style.cursor = 'pointer';
    return oImg;
}


/* ***********************************************************

************************************************************** */
var getScriptURL = (function() {
    var scripts = document.getElementsByTagName('script');
    var index = scripts.length - 1;
    var myScript = scripts[index];

   url = myScript.src;
   url = url.substr(0, url.lastIndexOf("/")+1); 
   return function() { return url; };
   //return url;

})();
/* ***********************************************************

************************************************************** */
function trierTableau(idTbl, defautCol2sort = 0, cols2sort = "", sRoot = ""){ //defautSenseOfSort = 0
    //calcul du chemin des icones
    if(sRoot == ''){
        optionsTTH['imgSkin']= getScriptURL() + "images/" + optionsTTH['skin'] + "/";
    }else{
        optionsTTH['imgSkin'] = sRoot + "/" + optionsTTH['imgFld'] + optionsTTH['skin'] + "/";
    }

  const obTable = document.getElementById(idTbl);
  const tbody   = obTable.getElementsByTagName("tbody")[0];
  const thx = obTable.querySelectorAll('th');
  const trxb = tbody.querySelectorAll('tr');

  var lCol = 0;
  optionsTTH['oldTH'] = -1;
  optionsTTH['current_asc'] = optionsTTH['asc'];
  
  //-----------------------------------------  
  //parcours des colonnes et affectaion de l'evennement click
  thx.forEach(function(th){

//var tCols2sort = new Array(2,3);
  cols2sort = cols2sort.replace(/\-/gi,"|").replace(/\,/gi,"|").replace(/\;/gi,"|").replace(/\//gi,"|");
  //cols2sort = cols2sort.replace(/\-/gi,"/");
var tCols2sort = cols2sort.split('|');
var allCols = (cols2sort == "");
//alert(tCols2sort[0] + "|" + lCol);
  lCol ++;
  th.style.cursor = 'pointer';
  if (defautCol2sort == lCol) th2sort = th;
  if (tCols2sort.find(element => element == lCol)  !== undefined || allCols)   
  {
    th.appendChild( getNewImg2Sort(ico_blank));
    th.appendChild( getNewImg2Sort(ico_blank));
    th.appendChild( getNewImg2Sort(ico_blank));

    //-----------------------------------------------------------    
    //evennement ajouté à chaque colonne
    th.addEventListener('click', function(){
     newIndexOfTH = Array.from(thx).indexOf(th);

      //affecte l'image up_off ou down_off aux colonnes de tri uniquement  
      if(optionsTTH['last_asc']){
        this.asc  = (newIndexOfTH == optionsTTH['old_th']) ? !this.asc  : this.asc;   
        img = (this.asc) ? optionsTTH['arrows'][ico_down_off] : optionsTTH['arrows'][ico_up_off] ;         
      }else{
        this.asc  = (newIndexOfTH == optionsTTH['old_th']) ? !this.asc  : optionsTTH['asc'];   
        img = (optionsTTH['asc']) ? optionsTTH['arrows'][ico_down_off] : optionsTTH['arrows'][ico_up_off] ;  
      }  
      
      thx.forEach(function(th){
        if(th.getElementsByTagName("img").length > 0){
          oImg = th.getElementsByTagName("img")[1];         
          oImg.src = optionsTTH['imgSkin'] + img;
        }
      })
     //-----------------------------------------
    
      let classe = Array.from(trxb).sort(compare(Array.from(thx).indexOf(th), this.asc  ));
      img = (this.asc) ? optionsTTH['arrows'][ico_down_on] : optionsTTH['arrows'][ico_up_on] ;         
      oImg = th.getElementsByTagName("img")[1];         
      oImg.src = optionsTTH['imgSkin'] + img;

      optionsTTH['old_th'] = newIndexOfTH;

      //-------------------------------------------------
        
      classe.forEach(function(tr){
         tbody.appendChild(tr)
      });
    })
  }
  });
if (th2sort) th2sort.click();
}

