var Island = function (args) {
    Arcadia.Shape.apply(this, arguments);

    this.size = { width: 32, height: 32 };
    this.vertices = 0;
    this.color = 'red';
    this.border = '2px #fff';
    this.number = Math.round(5 * Math.random()) + 1;
    this.connections = 0;
    this.id = args.id;

    this.label = new Arcadia.Label({
        font: '16px monospace',
        text: this.number,
        fixed: false
    });
    this.add(this.label);
};

Island.prototype = new Arcadia.Shape();

Island.prototype.isComplete = function () {
    return this.number == this.connections;
};

Island.SIZE = 32;
