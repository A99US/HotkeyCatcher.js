/*
https://github.com/A99US/HotkeyCatcher.js
*/
if( !window.hotkeycatcher ){
/**
 * =============================================================================
 * Building The KeyCode Array And Helper Variables
 * =============================================================================
 */
  window.hotkeycatcher = {
    lib: null, bind: null, unbind: null, addkey: null,
    timer: "", prevModKeys: null, modArray: [16,17,18,91],
    result: {
      message: null, hotkey: [], key: [], code: [], modkey: null, onlymodkey: null
    },
    keysRev: {}, keys: {
      backspace: 8, tab: 9, clear: 12, enter: 13, shift: 16, ctrl: 17, alt: 18,
      pause: 19, capslock: 20,
      esc: 27, space: 32, pageup: 33, pagedown: 34, end: 35, home: 36,
      left: 37, up: 38, right: 39, down: 40,
      printscreen: 44, insert: 45, "delete": 46, help: 47, meta: 91, contextmenu: 93,
      "numpad*": 106, "numpad+": 107, "numpad-": 109, "numpad.": 110, "numpad/": 111,
      numlock: 144, scrolllock: 145, audiomute: 173, audiodown: 174, audioup: 175,
      mediaplayer: 181, app1: 182, app2: 183,
      ";": 186, "=": 187, ",": 188, "-": 189, ".": 190, "/": 191, "`": 192,
      "[": 219, "\\": 220, "]": 221, "'": 222
    }
  };
  // Numbers on keyboard
  for (let i = 0; i < 10; i++){
    window.hotkeycatcher.keys['' + i] = i + 48;
  }
  // Numbers on numpad
  for (let i = 0; i < 10; i++){
    window.hotkeycatcher.keys['numpad' + i] = i + 96;
  }
  // Alphabets
  for (let i = 65; i < 91; i++){
    window.hotkeycatcher.keys[String.fromCharCode(i).toLowerCase()] = i;
  }
  // F1 - F12
  for (let i = 0; i < 12; i++){
    window.hotkeycatcher.keys['f' + (i+1)] = i + 112;
  }
  // Reversing The Keys And Values
  for (let key in window.hotkeycatcher.keys){
      window.hotkeycatcher.keysRev[ window.hotkeycatcher.keys[key] ] = key;
  }
  // console.log(window.hotkeycatcher.keys);
  // console.log(window.hotkeycatcher.keysRev);
/**
 * =============================================================================
 * Helper Functions
 * =============================================================================
 */
  window.hotkeycatcher.lib = {
    itistrue : str => ['true','1',true,1].includes(str) ,
    itisfalse : str => !str || [null,"","0","false",0,false].includes(str) ,
    sanitStr : str => str.split('').filter( char => /[a-zA-Z0-9]/.test(char) ).join("")
  };
/**
 * =============================================================================
 * Building The Keyboard Listener & Recorder
 * =============================================================================
 */
  document.addEventListener("keydown", evt => {
    let e = evt || window.event;
    let CTRL = e.ctrlKey, ALT = e.altKey, SHIFT = e.shiftKey, META = e.metaKey;
    let currentModKeys = ( window.hotkeycatcher.modArray.includes(e.keyCode) ) ?
        "" :
        CTRL +" "+ ALT +" "+ SHIFT +" "+ META ;
    clearTimeout( window.hotkeycatcher.timer ) ;
    let resetresult = () => {
      window.hotkeycatcher.result = {
        message: null, hotkey : [], key : [], code : [], modkey : null, onlymodkey : null
      };
      window.hotkeycatcher.prevModKeys = null;
    };
    let addtimout = () => setTimeout(() => resetresult(), 1000 ) ;
    let keyrev = window.hotkeycatcher.keysRev[e.keyCode] ;
    if( !keyrev ){
      resetresult();
      let logmsg = "Error : Key '"+ e.key +"' KeyCode '"+ e.keyCode +"' Doesn't Exist In Keys Array. Raise an issue at GitHub repo or add keys to keys array by yourself.";
      console.log( logmsg );
      window.hotkeycatcher.result.message = logmsg;
      return;
    }
    // Current modKey == Previous modKey
    if( currentModKeys == window.hotkeycatcher.prevModKeys ){
      window.hotkeycatcher.result.key.unshift( keyrev );
      window.hotkeycatcher.result.code.unshift( e.keyCode );
    }
    // Current modKey != Previous modKey
    else{
      window.hotkeycatcher.prevModKeys = currentModKeys ;
      window.hotkeycatcher.result.message = "";
      window.hotkeycatcher.result.modkey = currentModKeys == "" ?
        "" : (
        ( CTRL ? "ctrl " : "" ) + ( ALT ? "alt " : "" ) +
        ( SHIFT ? "shift " : "" ) + ( META ? "meta " : "" ) ).trim() ;
      window.hotkeycatcher.result.onlymodkey = currentModKeys == "" ? true : false ;
      window.hotkeycatcher.result.key = [ keyrev ];
      window.hotkeycatcher.result.code = [ e.keyCode ];
    }
    window.hotkeycatcher.result.hotkey = [];
    let codeArrLen = (window.hotkeycatcher.result.key).length,
        tempMod = window.hotkeycatcher.result.modkey == "" ?
                  "" :
                  window.hotkeycatcher.result.modkey +" " ;
    for ( let i = 0 ; i < codeArrLen ; i++ ) {
      window.hotkeycatcher.result.hotkey.push(
        tempMod +
        (window.hotkeycatcher.result.key).slice( 0, i+1 ).reverse().join(" ")
      );
    }
    window.hotkeycatcher.timer = addtimout(keyrev, e.keyCode) ;
  }, true);
/**
 * =============================================================================
 * Function To Add Listener
 * =============================================================================
 */
  window.hotkeycatcher.bind = (...scmArray) => {
    let item, namespace = "namespace"+ Date.now(), target = [], callback = false;
    // Looping ...args - Stop loop if item is a function ( single item ...args )
    for (let x = 0; x < scmArray.length; x++) {
      item = scmArray[x];
      if(typeof item === "function"){
        callback = item;
        break;
      }
      if( !(["string","object"].includes(typeof item)) ) continue;
      else if( x == 0 && typeof item === "string" ) namespace = item ;
      else if( x > 0 )
        target.push( typeof item === "object" ? item : [ item ] );
    }
    // No Callback In The Arguments
    if(!callback){
      console.log("Error : No Function In Arguments.");
      return;
    }
    // The Callback With Hotkey Result In Argument
    let CallbackFunction = evt => {
      let e = evt || window.event;
      callback(
        e,
        window.hotkeycatcher.result.hotkey[0],
        window.hotkeycatcher.result
      );
    };
    window.hotkeycatcher.bindhelper(namespace,target,CallbackFunction,'bind');
  };
/**
 * =============================================================================
 * Function To Remove Listener
 * =============================================================================
 */
  window.hotkeycatcher.unbind = (...target) => {
    if(typeof target[0] !== "string"){
      console.log("Error : First argument is not a string (namespace). Cannot be processed.");
      return;
    }
    let namespace = target[0] ;
    window.hotkeycatcher.bindhelper(namespace,target.slice(1),null,'unbind');
  };
/**
 * =============================================================================
 * Function To Help Binding / Unbinding Listener
 * =============================================================================
 */
  window.hotkeycatcher.bindhelper = (namespace,target,Callback,type='bind') => {
    let TargetElement, EventType, TypeAndNamespace;
    type = type == 'bind' ? 1 : 0 ;
    namespace = window.hotkeycatcher.lib.sanitStr(namespace);
    // Looping All The Target Element That Been Set In The ...args
    // So You Can Bind The Same Callback To Several Different element And Event Type
    if( window.hotkeycatcher.lib.itisfalse( target ) || target.length == 0 )
      target = [ ["",""] ] ;
    for( let item of target ){
      if( window.hotkeycatcher.lib.itisfalse( item ) )
        item = [ '', '' ] ;
      else if( typeof item !== "object" )
        item = [ item ] ;
      // Setting Up Value of Target Element
      if( window.hotkeycatcher.lib.itisfalse(item[0]) || item[0].toLowerCase() == 'document' ){
        TargetElement = $(document) ;
      }
      else{
        TargetElement = $(item[0]) ;
        if( TargetElement.length == 0 ){
          console.log(
            "Error : Element '"+ item[0] +"' Doesn't Exist In Document.\n"+
            "No Listener Was "+ ( type ? "Added." : "Removed." )
          ) ;
          continue ;
        }
        if(type) TargetElement.prop("tabindex","0");
      }
      // Setting Up Value of Event Type + Namespace
      if( window.hotkeycatcher.lib.itisfalse(item[1]) ){
        EventType = type ? 'keydown' : '' ;
      }
      else if( !(['keydown','keyup'].includes(item[1])) ){
        console.log(
          "Error : Keyboard Event Type '"+ item[1] +"' Is Not Available.\n"+
          "No Listener Was "+ ( type ? "Added." : "Removed." )
        ) ;
        continue ;
      }
      else{
        EventType = item[1];
      }
      TypeAndNamespace = ""+ EventType +"."+ namespace ;
      // Remove Duplicate if EventType.Namespace already registered on TargetElement
      // Useful For IFrame / Embedded Page
      // Haven't found a way how to check if it already exist or not
      // So far, testing didn't throw any error
      // Can only clear namespace from choosen Element
      // Can't just use $(document) to clear all listener of any element in the document
      TargetElement.off( TypeAndNamespace );
      // Adding Listener
      if(type) TargetElement.on( TypeAndNamespace, Callback );
    }
  };
/**
 * =============================================================================
 * Function To Add Keys
 * =============================================================================
 */
  window.hotkeycatcher.addkey = keyarray => {
    if(typeof keyarray !== "object"){
      console.log("Error : Argument is not an array. Cannot be added.");
      return;
    }
    let val, checkKey, checkVal;
    for (let key in keyarray){
      val = keyarray[key];
      checkKey = window.hotkeycatcher.keys[key];
      checkVal = window.hotkeycatcher.keysRev[val];
      if( checkKey ){
        console.log("Error : Key '"+ key +"' (Code '"+ checkKey +"') Already Exist. Cannot be added.");
      }
      else if( checkVal ){
        console.log("Error : KeyCode '"+ val +"' (Key '"+ checkVal +"') Already Exist. Cannot be added.");
      }
      else{
        window.hotkeycatcher.keys[ key ] = val;
        window.hotkeycatcher.keysRev[ val ] = key;
      }
    }
  };
}

