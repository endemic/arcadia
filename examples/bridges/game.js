/*jslint sloppy: true, plusplus: true */
/*globals Arcadia */

var Game = function () {
    Arcadia.Scene.apply(this, arguments);

    // Background color
    this.color = 'purple';

    // Object that tracks player's cursor/finger; used for collision detection 
    this.cursor = new Arcadia.Shape({
        size: { width: 8, height: 8 },
        vertices: 0,
        color: 'white'
    });
    this.add(this.cursor);
    this.deactivate(this.cursor);

    // Data structure for the vertices in the graph
    this.vertices = [];

    // TODO: Load the puzzle here
    // Temporary vertices for testing
    var i;

    i = new Vertex({
        position: { x: 100, y: 100 },
        id: this.vertices.length
    });
    this.add(i);
    this.vertices.push(i);

    i = new Vertex({
        position: { x: 200, y: 100 },
        id: this.vertices.length
    });
    this.add(i);
    this.vertices.push(i);

    i = new Vertex({
        position: { x: 200, y: 200 },
        id: this.vertices.length
    });
    this.add(i);
    this.vertices.push(i);

    i = new Vertex({
        position: { x: 100, y: 200 },
        id: this.vertices.length
    });
    this.add(i);
    this.vertices.push(i);

    // i = new Vertex({
    //     position: { x: 400, y: 100 },
    //     id: this.vertices.length
    // });
    // this.add(i);
    // this.vertices.push(i);
    // i = new Vertex({
    //     position: { x: 400, y: 200 },
    //     id: this.vertices.length
    // });
    // this.add(i);
    // this.vertices.push(i);

    // Data structure for edges
    this.edges = new Arcadia.Pool();
    this.edges.factory = function () {
        return new Edge();
    };
    this.add(this.edges);

    // Line that is shown while dragging from one vertex to another
    this.activeEdge = new Arcadia.Shape({
        size: { width: 2, height: 2 }
    });
    this.add(this.activeEdge);
    this.deactivate(this.activeEdge);
};

Game.prototype = new Arcadia.Scene();

Game.prototype.onPointStart = function (points) {
    var i, vertex;

    // Show the "cursor" object; move it to the mouse/touch point
    this.activate(this.cursor);
    this.cursor.position = {
        x: points[0].x,
        y: points[0].y
    };

    i = this.vertices.length;
    while (i--) {
        vertex = this.vertices[i];

        // Determine if user touched a vertex
        if (this.cursor.collidesWith(vertex)) {
            this.startVertex = vertex;
            var distance = Math.sqrt(Math.pow(this.cursor.position.x - this.startVertex.position.x, 2) + Math.pow(this.cursor.position.y - this.startVertex.position.y, 2));

            // If so, start drawing a line
            this.activate(this.activeEdge);
            this.activeEdge.size = { width: 2, height: distance };
            this.activeEdge.rotation = Math.atan2(this.cursor.position.y - this.startVertex.position.y, this.cursor.position.x - this.startVertex.position.x) + Math.PI / 2;
            this.activeEdge.position = {
                // halfway between cursor and vertex
                x: (this.cursor.position.x + this.startVertex.position.x) / 2,
                y: (this.cursor.position.y + this.startVertex.position.y) / 2
            };
        }
    }
};

Game.prototype.onPointMove = function (points) {
    this.cursor.position = {
        x: points[0].x,
        y: points[0].y
    };

    // If currently drawing an edge (from the startVertex), update the
    // "interactive" drawing line
    if (this.startVertex) {
        var distance = Math.sqrt(Math.pow(this.cursor.position.x - this.startVertex.position.x, 2) + Math.pow(this.cursor.position.y - this.startVertex.position.y, 2));
        this.activeEdge.size = { width: 2, height: distance };
        this.activeEdge.rotation = Math.atan2(this.cursor.position.y - this.startVertex.position.y, this.cursor.position.x - this.startVertex.position.x) + Math.PI / 2;
        this.activeEdge.position = {
            x: (this.cursor.position.x + this.startVertex.position.x) / 2,
            y: (this.cursor.position.y + this.startVertex.position.y) / 2
        };
    }
};

Game.prototype.onPointEnd = function (points) {
    var success = false,
        collision = false,
        vertexIds,
        i,
        endVertex,
        edge;

    if (this.startVertex) {
        i = this.vertices.length;
        while (i--) {
            endVertex = this.vertices[i];

            // Determine if player ended click/touch on a vertex
            // (that's different from the starting vertex)
            if (this.cursor.collidesWith(endVertex) && endVertex.id != this.startVertex.id) {

                // TODO: the vertical/horizontal conditions contain lots of dupe code

                // Handle vertical edges
                if (this.startVertex.position.x === endVertex.position.x) {
                    // Place edge object
                    edge = this.edges.activate();
                    edge.position = {
                        x: this.startVertex.position.x,
                        y: (this.startVertex.position.y + endVertex.position.y) / 2
                    };
                    edge.size = {
                        width: Vertex.SIZE / 2,
                        height: Math.abs(this.startVertex.position.y - endVertex.position.y) - Vertex.SIZE
                    };
                    // check collision
                    j = this.edges.length;
                    while (j--) {
                        if (edge.collidesWith(this.edges.at(j))) {
                            collision = this.edges.at(j);
                            vertexIds = [collision.vertices[0].id, collision.vertices[1].id];
                        }
                    }
                    // If successful, add the edge
                    if (!collision) {
                        this.startVertex.addEdge(edge);
                        endVertex.addEdge(edge);
                        edge.vertices.push(this.startVertex);
                        edge.vertices.push(endVertex);

                        Arcadia.playSfx('build');
                    } else if (vertexIds.indexOf(this.startVertex.id) !== -1 &&  vertexIds.indexOf(endVertex.id) !== -1) {
                        // trying to draw over existing edge
                        if (collision.increment()) {
                            collision.vertices[0].updateColor();
                            collision.vertices[1].updateColor();
                            Arcadia.playSfx('build');
                        } else {
                            Arcadia.playSfx('invalid');
                        }
                        this.edges.deactivate(edge);
                    } else {
                        this.edges.deactivate(edge);
                        Arcadia.playSfx('invalid');
                    }
                // Handle horizontal edges
                } else if (this.startVertex.position.y === endVertex.position.y) {
                    // Generate edge object
                    edge = this.edges.activate();
                    edge.position = {
                        x: (this.startVertex.position.x + endVertex.position.x) / 2,
                        y: this.startVertex.position.y
                    };
                    edge.size = {
                        width: Math.abs(this.startVertex.position.x - endVertex.position.x) - Vertex.SIZE,
                        height: Vertex.SIZE / 2
                    };
                    // check collision
                    j = this.edges.length;
                    while (j--) {
                        if (edge.collidesWith(this.edges.at(j))) {
                            collision = this.edges.at(j);
                            vertexIds = [collision.vertices[0].id, collision.vertices[1].id];
                        }
                    }
                    // If successful, add the edge
                    if (!collision) {
                        this.startVertex.addEdge(edge);
                        endVertex.addEdge(edge);
                        edge.vertices.push(this.startVertex);
                        edge.vertices.push(endVertex);

                        Arcadia.playSfx('build');
                    } else if (vertexIds.indexOf(this.startVertex.id) !== -1 &&  vertexIds.indexOf(endVertex.id) !== -1) {
                        // trying to draw over existing edge
                        if (collision.increment()) {
                            collision.vertices[0].updateColor();
                            collision.vertices[1].updateColor();
                            Arcadia.playSfx('build');
                        } else {
                            Arcadia.playSfx('invalid');
                        }
                        this.edges.deactivate(edge);
                    } else {
                        this.edges.deactivate(edge);
                        Arcadia.playSfx('invalid');
                    }
                // Diagonal, etc. edges aren't allowed
                } else {
                    Arcadia.playSfx('invalid');
                }
            }
        }

        this.deactivate(this.activeEdge);
        this.startVertex = null;
    } else {
        // Determine if user touched a edge; if so, remove it
        i = this.edges.length;
        while (i--) {
            if (this.cursor.collidesWith(this.edges.at(i))) {
                edge = this.edges.at(i);
                edge.vertices[0].removeEdge(edge);
                edge.vertices[1].removeEdge(edge);
                this.edges.deactivate(i);
                Arcadia.playSfx('erase');
            }
        }
    }

    // Check for completeness
    // Fast check - ensure all vertices have correct # of edges
    var complete = this.vertices.every(function (vertex) {
        return vertex.isComplete();
    });

    console.log(complete);

    // Slow check - ensure all nodes on the graph are connected
    if (complete) {
        var foundVertices = [];
        this.search(this.vertices[0], foundVertices);
        // Basically start at one vertex, and see if we can traverse the whole
        // graph -- if the # of vertices found by the search equals the number
        // in the puzzle, then it's a correct solution
        if (foundVertices.length === this.vertices.length) {
            // alert('u won, bro');
            this.win();
        } else {
            alert('nice try, cheeter');
        }
    }

    this.deactivate(this.cursor);
};

// https://en.wikipedia.org/wiki/Depth-first_search
// Need each vertex to store a list of its connected edges
Game.prototype.search = function (vertex, listOfTraversedVertices) {
    var _this = this;

    if (listOfTraversedVertices.indexOf(vertex.id) !== -1) {
        return;
    }

    listOfTraversedVertices.push(vertex.id);
    vertex.edges.forEach(function (edge) {
       _this.search(edge.vertices[0], listOfTraversedVertices);
       _this.search(edge.vertices[1], listOfTraversedVertices);
    });
};

Game.prototype.win = function () {
    // Hide edges
    var i = this.edges.length,
        _this = this;

    while (i--) {
        this.edges.at(i).tween('alpha', 0, 1000);
    }

    // Particle emitters
    this.particles = new Arcadia.Pool();
    this.particles.factory = function () {
        var emitter,
            factory;

        factory = function () {
            return new Arcadia.Shape({
                color: '#fff',
                size: { width: 3, height: 3 },
                vertices: 0
            });
        };
        emitter = new Arcadia.Emitter(factory);
        emitter.duration = 1.0;
        emitter.scale = -1;
        return emitter;
    };
    while (this.particles.length < this.vertices.length) {
        this.particles.activate();
    }
    this.particles.deactivateAll();
    this.add(this.particles);

    // Shrink vertices, then show an "explosion"
    this.vertices.forEach(function (vertex) {
        vertex.tween('scale', 0, 2000, 'elasticInOut', function () {
            _this.particles.activate().startAt(vertex.position.x, vertex.position.y);
        });
    });
};
