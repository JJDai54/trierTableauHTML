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

var tth_options = {
 'arrows' : new Array("updown_off.png", "up_on.png", "down_on.png", "blank.png", "up_off.png", "down_off.png"),
 'imgFld' : "trierTableauHTML/images/",
 'skin' : "skin-arrow-blue-round", //dossier des icones dans le frameworks
 'margin' : "0px 4px 0px 4px",  
 'localLang' : "fr",
 'posImg' : "right", //position de l'icone, right or left
 'asc' : true, //defini le sens de tri des colonnes par défaut
 'last_asc' : false, // change 'asc' à chaque changement de sens dans une même colonne
 'typeContent' : 0 ,//utilisé pendant le dev
 'isFirstTH' : true //utilisé pour déterminer si on est sur la premigne TH
};
 
var ico_blank    = tth_options['arrows'].indexOf('blank.png');
var ico_up_on    = tth_options['arrows'].indexOf('up_on.png');
var ico_up_off   = tth_options['arrows'].indexOf('up_off.png');
var ico_down_on  = tth_options['arrows'].indexOf('down_on.png');
var ico_down_off = tth_options['arrows'].indexOf('down_off.png');
 
 

/* ***********************************************************

************************************************************** */
function tth_set_value(cle, new_value){
    tth_options[cle] = new_value;
}
/* ***********************************************************

************************************************************** */
function tth_init(options = null){
if (options != null)
    for (var cle in options) {
        tth_options[cle] = options[cle];
    }
    
    
}
// exemple d'initalisation des options
//tth_init_({ "posImg" : 'left', "skin" : 'skin-arrow-green', "asc" : false});

/* ***********************************************************

************************************************************** */
function tth_isValidDate(d) {
  //d="2121-05-12";
  d2 = d.replace(/\-/gi,"/");
  if (tth_options['localLang'] == "fr"){
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
const tth_compare = function(ids, asc){
  return function(row1, row2){
    const tdValue = function(row, ids){
      return row.children[ids].textContent;
    }
    const tri = function(v1, v2){
      if (v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2)){
        tth_options['typeContent'] = 1
        return v1 - v2;
      }
      
      else if(tth_isValidDate(v1)>0 || tth_isValidDate(v2)>0) {
        tth_options['typeContent'] = 3;
        return tth_isValidDate(v1) - tth_isValidDate(v2);       
       }   
      
      
      else {
        tth_options['typeContent'] = 2
        return v1.toString().localeCompare(v2, tth_options['localLang'], {ignorePunctuation: true});
      }
      return v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2, tth_options['localLang'], {ignorePunctuation: true});
    };
    return tri(tdValue(asc ? row1 : row2, ids), tdValue(asc ? row2 : row1, ids));
  }
}

/* ***********************************************************

************************************************************** */
function tth_getNewImg2Sort(index){
    var oImg = document.createElement('img');
    oImg.src = tth_options['imgSkin'] + tth_options['arrows'][index];
    oImg.style.styleFloat = tth_options['posImg'];
    oImg.style.cssFloat = tth_options['posImg'];
    oImg.style.cursor = 'pointer';
    oImg.style.margin = tth_options['margin'];
    return oImg;
}


/* ***********************************************************

************************************************************** */
var tth_getScriptURL = (function() {
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
function tth_trierTableau(idTbl, defautCol2sort = 0, cols2sort = "", sRoot = ""){ //defautSenseOfSort = 0
    //calcul du chemin des icones
    if(sRoot == ''){
        tth_options['imgSkin']= tth_getScriptURL() + "images/" + tth_options['skin'] + "/";
    }else{
        tth_options['imgSkin'] = sRoot + "/" + tth_options['imgFld'] + tth_options['skin'] + "/";
    }

  const obTable = document.getElementById(idTbl);
  const tbody   = obTable.getElementsByTagName("tbody")[0];
  const thx = obTable.querySelectorAll('th');
  const trxb = tbody.querySelectorAll('tr');

  var lCol = 0;
  tth_options['current_asc'] = tth_options['asc'];
  
  //-----------------------------------------  
  //parcours des colonnes et affectation de l'evennement click
  thx.forEach(function(th){

  //remplace le sépaateur par |
  cols2sort = cols2sort.replace(/\-/gi,"|").replace(/\,/gi,"|").replace(/\;/gi,"|").replace(/\//gi,"|");
  var tCols2sort = cols2sort.split('|');

  var allCols = (cols2sort == ""); //toutes les colonnes si cols2sort est vide
//alert(tCols2sort[0] + "|" + tth_options['old_th']);
  tth_options['old_th'] = Array.from(thx).indexOf(th) + 1;
  th.style.cursor = 'pointer';  //affichge d'un curseur sur le titre des colonnes
  if (defautCol2sort == tth_options['old_th']) th2sort = th; // met de côté la colonne de tri par défaut
  //initialise les colonnes de tri et leur affecte l'evennement "click()"
  if (tCols2sort.find(element => element == tth_options['old_th'] )  !== undefined || allCols)   
  {

      th.appendChild( tth_getNewImg2Sort(ico_blank)); //icone transparent avant pour laisser un espace
      //this.asc = tth_options['asc'];
      //===========================================================    
      //evennement ajouté à chaque colonne de tri
      //===========================================================    
      th.addEventListener('click', function(){
      newIndexOfTH = Array.from(thx).indexOf(th)+1;

      //détermine l'image up_off ou down_off aux colonnes de tri uniquement  
      
      if(tth_options['last_asc'] && !tth_options['isFirstTH']){ //cas a revoir
        if(newIndexOfTH == tth_options['old_th']){
          this.asc = (newIndexOfTH == tth_options['old_th']) ? !this.asc : this.asc;   
          img = (this.asc) ? tth_options['arrows'][ico_down_off] : tth_options['arrows'][ico_up_off];    
          tth_options['asc'] = !tth_options['asc'];    
          //alert('meme colonne');
        }else{
          this.asc = (newIndexOfTH == tth_options['old_th']) ? !this.asc : tth_options['asc'];   
          img = (tth_options['asc']) ? tth_options['arrows'][ico_down_off] : tth_options['arrows'][ico_up_off];  
          //alert('colonne differente');
        }
      }else{
        this.asc = (newIndexOfTH == tth_options['old_th']) ? !this.asc : tth_options['asc'];   
        img = (tth_options['asc']) ? tth_options['arrows'][ico_down_off] : tth_options['arrows'][ico_up_off];  
        tth_options['isFirstTH'] = false;
        //alert("isFirstTH");
      }  
      
      //affecte l'icone gris à tutes les colonnes y compris celle cliquée
      thx.forEach(function(th){
        if(th.getElementsByTagName("img").length > 0){
          oImg = th.getElementsByTagName("img")[0];         
          oImg.src = tth_options['imgSkin'] + img;
        }
      })
      //-----------------------------------------
      //trTries stocke les références des lignes triées  
      let trTries = Array.from(trxb).sort(tth_compare(Array.from(thx).indexOf(th), this.asc));
      img = (this.asc) ? tth_options['arrows'][ico_down_on] : tth_options['arrows'][ico_up_on] ;         
      oImg = th.getElementsByTagName("img")[0];         
      oImg.src = tth_options['imgSkin'] + img;
      
      //déplace les lignes du tableau dans l'ordre de tri  
      trTries.forEach(function(tr){
         tbody.appendChild(tr)
      });
      
      //-------------------------------------------------
      // colonne mise de coté pour vérifier au prochain clique si on est toujours sur la m^me colonne  
      tth_options['old_th'] = newIndexOfTH;

    })
  }
  });
if (th2sort) th2sort.click();
}

