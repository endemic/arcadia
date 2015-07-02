var Bridge = function (options) {
    Arcadia.Shape.apply(this, arguments);

    this.border = '2px #fff';
    this.vertices = 4;
    
    // this.path = function (context) {
    //     context.moveTo(-this.size.width / 2, -this.size.height / 2);
    //     console.log(JSON.stringify(this.start));
    //     context.lineTo(this.size.width / 2, this.size.height / 2);
    //     console.log(JSON.stringify(this.end));
    // };
};

Bridge.prototype = new Arcadia.Shape();
