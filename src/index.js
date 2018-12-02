var singulars = require("./palabras.js");
var reglas = require("./reglas.js");
var replace = require("preserve-case");
const escapeStringRegexp = require('escape-string-regexp');

function Traductor() {
  this.traductorForm = "\
    <form id='traductor-form' action='#'>\
      Nibel:\
      <select id='nivel'> \
      <option value='1' selected>Universitario</option>\
      <option value='2'>Cuñado</option>\
      <option value='3'>Gente Entrañable</option>\
      </select>\
      <br/>\
      <textarea id='traductor-textarea' style='width: 100%' rows='10'></textarea>\
      <br/>\
      <button id='traductor-button'>TRADUCE!</button>\
    </form>";
  this.resultadoForm = "\
    <p>$texto$</p>\
    <form id='traductor-back-form'>\
      <button id='traductor-back-button'>VOLVER!</button>\
    </form>";

  this.reglas = [];

  //////////////////////////////////////////////////////////////////////////////

  this.traduce = function(texto) {

    let rOption = $('#nivel').val();
    if(rOption == 1) {
      this.reglas = reglas[0];
    }
    else if(rOption == 2) {
      this.reglas = reglas[1];
    }
    else if(rOption == 3) {
      this.reglas = reglas[2];
    }
    
    // Si vienen mal dadas, retornar por uno de los mensajes predefinidos al azar

    let lineas = texto.split("\n");
    let palabras = [];
    for(let i=0;i<lineas.length;i++) {
      palabras.push.apply(palabras, lineas[i].split(" "));
    }
    let palabrasMod = [];
    for(let i=0;i<palabras.length;i++) {
      let p = palabras[i].trim(); 
      if(p != "" && typeof(p) !== 'undefined') {
        for(let j = 0; j < this.reglas.length; j++) {
          let code = this.reglas[j][0];
          if(code == "RPC") {
            p = this.replaceAllPreserveCase(p, this.reglas[j][1], this.reglas[j][2]);
          }
          else if (code == "RS") {
            p = this.replaceRandom(p, this.reglas[j][1], this.reglas[j][2], this.reglas[j][3]);
          }
          else if (code == "RPR") {
            p = this.replaceAllPreserveCaseIfPrefix(p, this.reglas[j][1], this.reglas[j][2], this.reglas[j][3]);
          }
          else if (code == "RPRR") {
            p = this.replaceAllPreserveCaseIfPrefixRandom(p, this.reglas[j][1], this.reglas[j][2], this.reglas[j][3], this.reglas[j][4]);
          }
          else if (code == "RNPR") {
            p = this.replaceAllPreserveCaseIfNotPrefix(p, this.reglas[j][1], this.reglas[j][2], this.reglas[j][3]);
          }
          else if (code == "RNPRR") {
            p = this.replaceAllPreserveCaseIfNotPrefixRandom(p, this.reglas[j][1], this.reglas[j][2], this.reglas[j][3], this.reglas[j][4]);
          }
          else if (code == "DWS") {
            p = this.deleteFromWordStart(p, this.reglas[j][1]);
          }
          else if (code == "EA") {
            p = this.deleteAccents(p, this.reglas[j][1]);
          }
          else if (code == "FSP") {
            p = this.endIfPlural(p)
          }
          else if (code == "RCC") {
            p = this.changeCaseRandom(p, this.reglas[j][1]);
          }
          else if (code == "AIR") {
            p = this.addToStart(p, this.reglas[j][1], this.reglas[j][2], this.reglas[j][3]);
          }
          else if (code == "CF") {
            p = this.replaceEnd(p, this.reglas[j][1], this.reglas[j][2], this.reglas[j][3]);
          }
        }
        let rnd = Math.floor(Math.random() * 101);
        if (rnd <= 5) {
          p = p.toUpperCase()
        }
        else {
          p = p.toLowerCase()
        }
        p = this.breakWord(p, 10);
        palabrasMod.push(p);
        rnd = Math.floor(Math.random() * 101);
        if (rnd <= 3) {
          palabrasMod.push("&nbsp;");
        }
      }
    }
    // Añadir cabecera/cierre
    return palabrasMod.join(" ");
  }
  this.breakWord = function(p, percentage) {
    rnd = Math.floor(Math.random() * 101);
    if(rnd <= percentage) {
      idx = Math.floor(Math.random() * (p.length - 1)) + 1;
      p = p.slice(0, idx) + " " + p.slice(idx, p.length);
    }
    return p;
  }
  this.replaceEnd = function(p, suffix, sNew, percentage) {
    let rnd = Math.floor(Math.random() * 101);
    let rregex = escapeStringRegexp(suffix);
    rregex = rregex + "$";
    if(rnd <= percentage) {
      let re = new RegExp(rregex, "gi");
      return p.replace(re, sNew);
    }
    return p;
  }
  this.isSingularEndingInS = function(p) {
    // Retorna true si es un singular que acaba en s
    return !(singulars[p] === undefined);
  }
  this.randomFromArray = function(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  this.isPlural = function(p) {
    return (p.slice(-1) === "s" || p.slice(-1) === "S") && (!this.isSingularEndingInS(p.toLowerCase()));
  }
  this.replaceAt = function(p, idx, rep) {
    if(rep == "") {
        return p.slice(0, idx) + p.slice(idx + 1);
    }
    else {
        return p.slice(0, idx) + rep + p.slice(idx + rep.length);
    }
  }
  this.replaceRandom = function(p, sOld, sNew, percentage) {
    let rnd = Math.floor(Math.random() * 101);
    if(rnd <= percentage) {
        return this.replaceAllPreserveCase(p, sOld, sNew);
    }
    return p;
  }
  this.randomCaseS = function (s) {
    let rnd = Math.floor(Math.random() * 101);
    if (rnd <= 50) {
      return s.toUpperCase();
    }
    else {
      return s.toLowerCase();
    }
  }
  this.replacePreserveCase = function(p, sOld, sNew, idx) {
    if(sNew != "") {
      let rp = p;
      let len = sNew.length;
      for(let i = idx; i < idx + len; i++) {
        let pos = i - idx;
        if(i >= sOld.length) {
          rp = rp.slice(0, i + 1) + this.randomCaseS(sNew[pos]) + rp.slice(i + 1);
        }
        else {
          if(p[i] == p[i].toUpperCase()) {
            rp = this.replaceAt(rp, i, sNew[pos].toUpperCase());
          }
          else {
            rp = this.replaceAt(rp, i, sNew[pos].toLowerCase());
          }
        }
      }
      return rp;
    }
    else {
      return this.replaceAt(p, idx, "");
    }
  }
  this.randomizeCase = function(s) {
    let x = "";
    for(let i = 0; i < s.length; i++) {
      let rnd = Math.floor(Math.random() * 101);
      if (rnd <= 50) {
        return x += s[i].toUpperCase();
      }
      else {
        return s += s[i].toLowerCase();;
      }
    }
    return x;
  }
  this.replaceAllPreserveCase = function(p, sOld, sNew) {
    let s = replace.all(p, sOld, sNew);
    return s;
  }
  this.replaceAllPreserveCaseIfPrefix = function(p, sOld, sNew, prefix) {
    let re = new RegExp(escapeStringRegexp(sOld), "gi");
    let rp = p;
    let match = re.exec(p);
    while(match != null) {
      let idx = match.index;
      let prefixStartIdx = idx - prefix.length;
      if(prefixStartIdx < 0) {
        match = re.exec(p);
        continue;
      }
      else if(p.slice(prefixStartIdx, prefixStartIdx + prefix.length).toUpperCase() == prefix.toUpperCase()) {
        rp = this.replacePreserveCase(rp, sOld, sNew, idx);
      }
      match = re.exec(p);
    }
    return rp;
  }
  this.replaceAllPreserveCaseIfPrefixRandom = function(p, sOld, sNew, prefix, percentage) {
    let re = new RegExp(escapeStringRegexp(sOld), "gi");
    let rp = p;
    let match = re.exec(p);
    while(match != null) {
      let idx = match.index;
      let prefixStartIdx = idx - prefix.length;
      if(prefixStartIdx < 0) {
        match = re.exec(p);
        continue;
      }
      else if(p.slice(prefixStartIdx, prefixStartIdx + prefix.length + 1).toUpperCase() == prefix.toUpperCase()) {
        let rnd = Math.floor(Math.random() * 101);
        if(rnd <= percentage) {
          rp = this.replacePreserveCase(rp, sOld, sNew, idx);
        }
      }
      match = re.exec(p);
    }
    return rp;
  }
  this.replaceAllPreserveCaseIfNotPrefix = function(p, sOld, sNew, prefix) {
    let re = new RegExp(escapeStringRegexp(sOld), "gi");
    let rp = p;
    let match = re.exec(p);
    while(match != null) {
      let idx = match.index;
      let prefixStartIdx = idx - prefix.length;
      if(prefixStartIdx < 0) {
        match = re.exec(p);
        continue;
      }
      else if(p.slice(prefixStartIdx, prefixStartIdx + prefix.length).toUpperCase() != prefix.toUpperCase()) {
        rp = this.replacePreserveCase(rp, sOld, sNew, idx);
      }
      match = re.exec(p);
    }
    return rp;
  }
  this.replaceAllPreserveCaseIfNotPrefixRandom = function(p, sOld, sNew, prefix, percentage) {
    let re = new RegExp(escapeStringRegexp(sOld), "gi");
    let rp = p;
    let match = re.exec(p);
    while(match != null) {
      let idx = match.index;
      let prefixStartIdx = idx - prefix.length;
      if(prefixStartIdx < 0) {
        match = re.exec(p);
        continue;
      }
      else if(p.slice(prefixStartIdx, prefixStartIdx + prefix.length).toUpperCase() != prefix.toUpperCase()) {
        let rnd = Math.floor(Math.random() * 101);
        if(rnd <= percentage) {
          rp = this.replacePreserveCase(rp, sOld, sNew, idx);
        }
      }
      match = re.exec(p);
    }
    return rp;
  }
  this.deleteFromWordStart = function(p, s) {
    let pu = p.toUpperCase();
    let su = s.toUpperCase();
    if(pu.startsWith(su, pu)) {
      return p.slice(s.length);
    }
    return p;
  }
  this.deleteAccents = function(p) {
    p = this.replaceAllPreserveCase(p, '"', "");
    p = p.replace(/\(/g, '');
    p = this.replaceAllPreserveCase(p, '-', "");
    p = this.replaceAllPreserveCase(p, '¿', "");
    p = this.replaceAllPreserveCase(p, "á", "a");
    p = this.replaceAllPreserveCase(p, "é", "e");
    p = this.replaceAllPreserveCase(p, "í", "i");
    p = this.replaceAllPreserveCase(p, "ó", "o");
    p = this.replaceAllPreserveCase(p, "ú", "u");
    return p;
  }
  this.endIfPlural = function(p) {
    if(!this.isPlural(p)) {
      return p;
    }
    let fin = p[p.length - 1];
    let rnd = Math.floor(Math.random() * 10);
    if(rnd == 1) {
      // Añado "s" en un diez por ciento de los casos
      p = p.slice(0, -1);
      let nS = Math.floor(Math.random() * 3) + 1;
      for(let i = 0; i < nS; i++) {
        if(fin == "s") {
            p += "s";
        }
        else {
          p += "S";
        }
      }
    }
    else if (rnd == 2) {
      p = p.slice(0, -1);
      let nS = Math.floor(Math.random() * 2) + 1;
      for(let i = 0; i < nS; i++) {
        if(fin == "s") {
            p += "n";
        }
        else {
          p += "N";
        }
      }
    }
    return p;
  }
  this.getChangedCaseSingleChar = function(c) {
    if(c == c.toUpperCase()) {
      return c.toLowerCase();
    }
    else {
      return c.toUpperCase();
    }
  }
  this.changeCaseRandom = function(p, percentage) {
    for(let i = 0; i < p.length; i++) {
      let rnd = Math.floor(Math.random() * 101);
      if(rnd <= percentage) {
        p = this.replaceAt(p, i, this.getChangedCaseSingleChar(p[i]));
      }
    }
    return p;
  }
  this.checkPrefixIgnoreCase = function(p, prefix) {
    let re = new RegExp(escapeStringRegexp(prefix), "gi");
    let match = re.exec(p);
    if (match === null) {
      return false;
    }
    return match.index === 0;
  }
  this.addToStart = function(p, prefix, sNew, percentage) {
    if(this.checkPrefixIgnoreCase(p, prefix)) {
      let rnd = Math.floor(Math.random() * 101);
      if(rnd <= percentage) {
        return sNew + p;
      }
    }
    return p;
  }
}
// Ejecución
const t = new Traductor();
$(document).ready(function() {
  // Mostrar traductorForm
  $('div#traductor').html(t.traductorForm);
  // Acción del boton "TRADUCE!"
  $('#traductor-button').click(function(evt) {
    evt.preventDefault();
    var texto = $('#traductor-textarea').val();
    texto = t.traduce(texto);
    $('div#traductor').html(t.resultadoForm.replace('$texto$', texto));
  });
  $('#traductor-back-button').click(function() {
    $('div#traductor').html(t.traductorForm);
  });
});
