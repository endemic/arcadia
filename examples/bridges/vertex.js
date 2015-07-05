var Vertex = function (args) {
    Arcadia.Shape.apply(this, arguments);

    this.size = { width: 40, height: 40 };
    this.vertices = 0;
    this.color = 'purple';
    this.border = '2px #fff';
    this.number = args.number || (Math.round(5 * Math.random()) + 1);
    this.edges = [];
    this.id = args.id;

    this.label = new Arcadia.Label({
        font: '16px monospace',
        text: this.number,
        fixed: false
    });
    this.add(this.label);
};

Vertex.prototype = new Arcadia.Shape();

Vertex.prototype.isComplete = function () {
    return this.number == this.edgeCount();
};

Vertex.prototype.edgeCount = function () {
    return this.edges.reduce(function (previous, current) {
        return previous + current.count;
    }, 0);
};

Vertex.prototype.addEdge = function (edge) {
    this.edges.push(edge);
    this.updateColor();
};

Vertex.prototype.removeEdge = function (edge) {
    var index = this.edges.indexOf(edge);
    this.edges.splice(index, 1);

    this.updateColor();
};

Vertex.prototype.updateColor = function () {
    var count = this.edgeCount();

    if (count === this.number) {
        this.color = 'lime';
    } else if (count > this.number) {
        this.color = 'red';
    } else {
        this.color = 'purple';
    }
};

Vertex.SIZE = 32;
