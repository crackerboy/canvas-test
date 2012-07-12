/*

Very simple game object

*/

var GameObject = function(x,y,color,size){
    this.color = color;
    this.x = x;
    this.y = y;
    this.size = size;
    this.rotation = 0;
};
GameObject.prototype = {
    render:function(c){
        
        c.fillStyle = this.color;
        
        c.save();
        
        c.translate(this.x,this.y);
        c.rotate(this.rotation);
        
        c.fillRect(- this.size/2,- this.size/2,this.size,this.size);
        
        c.restore();
    }
};
