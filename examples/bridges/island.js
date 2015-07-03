var Island = function (args) {
    Arcadia.Shape.apply(this, arguments);

    this.size = { width: 32, height: 32 };
    this.vertices = 0;
    this.color = 'purple';
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

Island.prototype.increment = function (count) {
    if (count === undefined) {
        count = 1;
    }

    this.connections += count;

    if (this.connections === this.number) {
        this.color = 'lime';
    } else if (this.connections > this.number) {
        this.color = 'red';
    } else {
        this.color = 'purple';
    }
};

Island.prototype.decrement = function (count) {
    if (count === undefined) {
        count = 1;
    }

    this.connections -= count;

    if (this.connections < 0) {
        this.connections = 0;
    }

    if (this.connections === this.number) {
        this.color = 'lime';
    } else if (this.connections > this.number) {
        this.color = 'red';
    } else {
        this.color = 'purple';
    }
};

Island.SIZE = 32;
