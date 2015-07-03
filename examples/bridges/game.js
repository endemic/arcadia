/*jslint sloppy: true, plusplus: true */
/*globals Arcadia */

var Game = function () {
    Arcadia.Scene.apply(this, arguments);

    this.color = 'purple';

    this.cursor = new Arcadia.Shape({
        size: { width: 8, height: 8 },
        color: 'red'
    });
    this.add(this.cursor);
    this.deactivate(this.cursor);

    // Store islands
    this.islands = [];

    var i;

    i = new Island({
        position: { x: 100, y: 100 },
        id: this.islands.length
    });
    this.add(i);
    this.islands.push(i);

    i = new Island({
        position: { x: 200, y: 100 },
        id: this.islands.length
    });
    this.add(i);
    this.islands.push(i);

    i = new Island({
        position: { x: 200, y: 200 },
        id: this.islands.length
    });
    this.add(i);
    this.islands.push(i);

    i = new Island({
        position: { x: 100, y: 200 },
        id: this.islands.length
    });
    this.add(i);
    this.islands.push(i);

    i = new Island({
        position: { x: 150, y: 150 },
        id: this.islands.length
    });
    this.add(i);
    this.islands.push(i);

    i = new Island({
        position: { x: 150, y: 250 },
        id: this.islands.length
    });
    this.add(i);
    this.islands.push(i);

    // store bridges
    this.bridges = new Arcadia.Pool();
    this.bridges.factory = function () {
        return new Bridge();
    };
    this.add(this.bridges);

    // drawing target
    this.drawingBridge = new Arcadia.Shape({
        size: { width: 2, height: 2 }
    });
    this.add(this.drawingBridge);
    this.deactivate(this.drawingBridge);
};

Game.prototype = new Arcadia.Scene();

Game.prototype.onPointStart = function (points) {
    var i, island;

    this.activate(this.cursor);
    this.cursor.position = {
        x: points[0].x,
        y: points[0].y
    };

    // Determine if user touched an island
    i = this.islands.length;
    while (i--) {
        island = this.islands[i];

        // If so, start drawing a line
        if (this.cursor.collidesWith(island)) {
            this.startIsland = island;
            var distance = Math.sqrt(Math.pow(this.cursor.position.x - this.startIsland.position.x, 2) + Math.pow(this.cursor.position.y - this.startIsland.position.y, 2));
            this.activate(this.drawingBridge);
            this.drawingBridge.size = { width: 2, height: distance };
            this.drawingBridge.rotation = Math.atan2(this.cursor.position.y - this.startIsland.position.y, this.cursor.position.x - this.startIsland.position.x) + Math.PI / 2;
            this.drawingBridge.position = {
                // halfway between cursor and island
                x: (this.cursor.position.x + this.startIsland.position.x) / 2,
                y: (this.cursor.position.y + this.startIsland.position.y) / 2
            };
        }
    }
};

Game.prototype.onPointMove = function (points) {
    this.cursor.position = {
        x: points[0].x,
        y: points[0].y
    };

    if (this.startIsland) {
        var distance = Math.sqrt(Math.pow(this.cursor.position.x - this.startIsland.position.x, 2) + Math.pow(this.cursor.position.y - this.startIsland.position.y, 2));
        this.drawingBridge.size = { width: 2, height: distance };
        this.drawingBridge.rotation = Math.atan2(this.cursor.position.y - this.startIsland.position.y, this.cursor.position.x - this.startIsland.position.x) + Math.PI / 2;
        this.drawingBridge.position = {
            x: (this.cursor.position.x + this.startIsland.position.x) / 2,
            y: (this.cursor.position.y + this.startIsland.position.y) / 2
        };
    }
};

Game.prototype.onPointEnd = function (points) {
    var success = false,
        collision = false,
        islandIds,
        i,
        endIsland,
        bridge;

    if (this.startIsland) {
        // Determine if user ended touch on an island
        i = this.islands.length;
        while (i--) {
            endIsland = this.islands[i];

            if (this.cursor.collidesWith(endIsland) && endIsland.id != this.startIsland.id) {
                // vertical bridge
                if (this.startIsland.position.x === endIsland.position.x) {
                    // Place bridge object
                    bridge = this.bridges.activate();
                    bridge.position = {
                        x: this.startIsland.position.x,
                        y: (this.startIsland.position.y + endIsland.position.y) / 2
                    };
                    bridge.size = {
                        width: Island.SIZE / 2,
                        height: Math.abs(this.startIsland.position.y - endIsland.position.y) - Island.SIZE
                    };
                    // check collision
                    j = this.bridges.length;
                    while (j--) {
                        if (bridge.collidesWith(this.bridges.at(j))) {
                            // collision = true;
                            collision = this.bridges.at(j);
                            islandIds = [collision.start.id, collision.end.id]
                        }
                    }
                    // If successful, add the bridge
                    if (!collision) {
                        bridge.start = this.startIsland;
                        bridge.end = endIsland;
                        bridge.start.increment();
                        bridge.end.increment();
                        Arcadia.playSfx('build');
                    } else if (islandIds.indexOf(this.startIsland.id) !== -1 &&  islandIds.indexOf(endIsland.id) !== -1) {
                        // trying to draw over existing bridge
                        collision.increment();
                        collision.start.increment();
                        collision.end.increment();
                        Arcadia.playSfx('build');
                        this.bridges.deactivate(bridge);
                    } else {
                        this.bridges.deactivate(bridge);
                        Arcadia.playSfx('invalid');
                    }
                // horizontal bridge
                } else if (this.startIsland.position.y === endIsland.position.y) {
                    // Generate bridge object
                    bridge = this.bridges.activate();
                    bridge.position = {
                        x: (this.startIsland.position.x + endIsland.position.x) / 2,
                        y: this.startIsland.position.y
                    };
                    bridge.size = {
                        width: Math.abs(this.startIsland.position.x - endIsland.position.x) - Island.SIZE,
                        height: Island.SIZE / 2
                    };
                    // check collision
                    j = this.bridges.length;
                    while (j--) {
                        if (bridge.collidesWith(this.bridges.at(j))) {
                            // collision = true;
                            collision = this.bridges.at(j);
                            islandIds = [collision.start.id, collision.end.id];
                        }
                    }
                    // If successful, add the bridge
                    if (!collision) {
                        bridge.start = this.startIsland;
                        bridge.end = endIsland;
                        bridge.start.increment();
                        bridge.end.increment();
                        Arcadia.playSfx('build');
                    } else if (islandIds.indexOf(this.startIsland.id) !== -1 &&  islandIds.indexOf(endIsland.id) !== -1) {
                        // trying to draw over existing bridge
                        collision.increment();
                        collision.start.increment();
                        collision.end.increment();
                        Arcadia.playSfx('build');
                        this.bridges.deactivate(bridge);
                    } else {
                        this.bridges.deactivate(bridge);
                        Arcadia.playSfx('invalid');
                    }
                }
            }
        }

        this.deactivate(this.drawingBridge);
        this.startIsland = null;
    } else {
        // Determine if user touched a bridge; if so, remove it
        i = this.bridges.length;
        while (i--) {
            if (this.cursor.collidesWith(this.bridges.at(i))) {
                bridge = this.bridges.at(i);
                bridge.start.decrement(bridge.count);
                bridge.end.decrement(bridge.count);
                this.bridges.deactivate(i);
                Arcadia.playSfx('erase');
            }
        }
    }

    this.deactivate(this.cursor);
};
