/*Keyboard Manager

Accessing key states...
* kb.key[KEY_CODE]

Returns either 0 (up) or 1 (down)

*/

var kb = {};

kb.init = function(){
    
    //The default key state is 0
    kb.key = [];
    for (var i = 0;i<255;i++){
        kb.key.push(0);
    }


    //Called when key pressed
    kb.keyDown = function(e){
        kb.key[e.keyCode] = 1;
    };

    //Called when key released
    kb.keyUp = function(e){
        kb.key[e.keyCode] = 0;
    };

    document.addEventListener("keydown",kb.keyDown, true);
    document.addEventListener("keyup",kb.keyUp, true);
    
    //Helper object for finding keys (without a key code)
    
    var keyMap = {enter:13,shift:16,ctrl:17,space:32,left:37,up:38,right:39,down:40};
    
    
    //  Usage Example...
    //* kb.getKey("space") => kb.key[32];
    
    kb.getKey = function(keyName){
        return kb.key[keyMap[keyName]];
    };
    
};
