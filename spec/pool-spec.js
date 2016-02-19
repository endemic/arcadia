describe('Arcadia.Pool', function () {
    beforeEach(function () {
        this.pool = new Arcadia.Pool();
    });

    afterEach(function () {
        this.pool = null;
    });

    describe('#add', function () {
        it('adds objects', function () {
            var shape;
            shape = new Arcadia.Shape({
                vertices: 3
            });
            this.pool.add(shape);
            expect(this.pool.at(0)).toBe(shape);
        });

        it('increases the length property', function () {
            this.pool.add(new Arcadia.Shape());
            expect(this.pool.length).toBe(1);
        });

        it('inserts in order', function () {
            this.pool.add(new Arcadia.Shape({
                zIndex: 4
            }));
            this.pool.add(new Arcadia.Shape({
                zIndex: 3
            }));
            this.pool.add(new Arcadia.Shape({
                zIndex: 2
            }));
            this.pool.add(new Arcadia.Shape({
                zIndex: 1
            }));
            expect(this.pool.at(0).zIndex).toBe(1);
            expect(this.pool.at(1).zIndex).toBe(2);
            expect(this.pool.at(2).zIndex).toBe(3);
            expect(this.pool.at(3).zIndex).toBe(4);
        });

        it('doesn\'t overwite inactive objects', function () {
            var inactiveShape,
                self = this;

            inactiveShape = new Arcadia.Shape();
            this.pool.add(inactiveShape);
            this.pool.deactivate(inactiveShape);
            this.pool.add(new Arcadia.Shape());
            this.pool.add(new Arcadia.Shape());
            expect(function () {
                self.pool.activate(inactiveShape);
            }).not.toThrow();
            expect(this.pool.at(0)).toBe(inactiveShape);
        });
    });

    describe('#remove', function () {
        beforeEach(function () {
            this.pool = new Arcadia.Pool();

            while (this.pool.length < 10) {
                this.pool.add(new Arcadia.Shape({
                    vertices: this.pool.length
                }));
            }
        });

        afterEach(function () {
            this.pool = null;
        });

        it('removes objects by index', function () {
            this.pool.remove(0);
            expect(this.pool.length).toBe(9);
        });

        it('removes objects by reference', function () {
            var shape;
            shape = this.pool.at(0);
            this.pool.remove(shape);
            expect(this.pool.length).toBe(9);
        });

        it('calls #destroy on removed object', function () {
            var shape;
            shape = this.pool.at(0);
            shape.destroy = function () {
                console.log('destroy');
            };
            spyOn(shape, 'destroy');
            this.pool.remove(shape);
            expect(shape.destroy).toHaveBeenCalled();
        });
        it('returns removed object', function () {
            var returnedOjbect, shape;
            shape = this.pool.at(0);
            returnedOjbect = this.pool.remove(0);
            expect(returnedOjbect).toBe(shape);
        });
    });
    describe('#at', function () {
        it('accesses active objects', function () {
            var shape;
            shape = new Arcadia.Shape({
                vertices: 3
            });
            this.pool.add(shape);
            expect(this.pool.at(0)).toBe(shape);
        });
        it("can't access what doesn't exist", function () {
            expect(this.pool.at(0)).toBe(void 0);
        });
    });
    describe('#deactivateAll', function () {
        it('deactivates all objects', function () {
            while (this.pool.length < 10) {
                this.pool.add(new Arcadia.Shape({
                    vertices: this.pool.length
                }));
            }
            expect(this.pool.length).toBe(10);
            this.pool.deactivateAll();
            expect(this.pool.length).toBe(0);
        });
    });
    describe('#activateAll', function () {
        it('activates all objects', function () {
            while (this.pool.length < 10) {
                this.pool.add(new Arcadia.Shape({
                    vertices: this.pool.length
                }));
            }
            this.pool.deactivateAll();
            expect(this.pool.length).toBe(0);
            this.pool.activateAll();
            expect(this.pool.length).toBe(10);
        });
        it('resets child objects', function () {
            var shape;
            shape = new Arcadia.Shape();
            shape.reset = function () {
                console.log('pass');
            };
            spyOn(shape, 'reset');
            this.pool.add(shape);
            this.pool.deactivate(shape);
            this.pool.activateAll();
            expect(shape.reset).toHaveBeenCalled();
        });
    });
    describe('#activate', function () {
        it('throws without inactive objects or a factory', function () {
            var self = this;
            expect(function () {
                self.pool.activate();
            }).toThrow();
        });
        it('can use a factory', function () {
            this.pool.factory = function () {
                return new Arcadia.Shape();
            };
            this.pool.activate();
            expect(this.pool.length).toBe(1);
        });
        it('can use inactive objects', function () {
            var shape;
            this.pool.add(new Arcadia.Shape());
            shape = this.pool.deactivate(0);
            this.pool.activate();
            expect(this.pool.at(0)).toBe(shape);
        });
        it('keeps sorted order when activating', function () {
            this.pool.add(new Arcadia.Shape({
                zIndex: 1
            }));
            this.pool.add(new Arcadia.Shape({
                zIndex: 2
            }));
            this.pool.add(new Arcadia.Shape({
                zIndex: 3
            }));
            this.pool.add(new Arcadia.Shape({
                zIndex: 4
            }));
            this.pool.deactivate(2);
            this.pool.activate();
            expect(this.pool.at(0).zIndex).toBe(1);
            expect(this.pool.at(1).zIndex).toBe(2);
            expect(this.pool.at(2).zIndex).toBe(3);
            expect(this.pool.at(3).zIndex).toBe(4);
        });
    });
    describe('#deactivate', function () {
        beforeEach(function () {
            var results;
            results = [];
            while (this.pool.length < 10) {
                results.push(this.pool.add(new Arcadia.Shape({
                    vertices: this.pool.length
                })));
            }
            results;
        });
        it('removes access to object', function () {
            var shape;
            shape = this.pool.deactivate(0);
            expect(this.pool.at(0)).not.toBe(shape);
        });
        it('can remove by reference', function () {
            var removedShape, shape;
            shape = this.pool.at(5);
            removedShape = this.pool.deactivate(shape);
            expect(this.pool.at(5)).not.toBe(removedShape);
        });
        it('decrements `length` property', function () {
            this.pool.deactivate(0);
            expect(this.pool.length).toBe(9);
        });
        it('maintains sort order', function () {
            this.pool.deactivate(4);
            this.pool.deactivate(1);
            expect(this.pool.at(0).zIndex).toBe(0);
            expect(this.pool.at(1).zIndex).toBe(2);
            expect(this.pool.at(2).zIndex).toBe(3);
            expect(this.pool.at(3).zIndex).toBe(5);
            expect(this.pool.at(4).zIndex).toBe(6);
            expect(this.pool.at(5).zIndex).toBe(7);
            expect(this.pool.at(6).zIndex).toBe(8);
            expect(this.pool.at(7).zIndex).toBe(9);
        });
    });
    describe('#update', function () {
        it('updates active objects', function () {
            var pool, shape1, shape2;
            pool = new Arcadia.Pool();
            shape1 = new Arcadia.Shape();
            shape2 = new Arcadia.Shape();
            pool.add(shape1);
            pool.add(shape2);
            pool.deactivate(shape2);
            spyOn(shape1, 'update');
            spyOn(shape2, 'update');
            pool.update(1);
            expect(shape1.update).toHaveBeenCalled();
            expect(shape2.update).not.toHaveBeenCalled();
        });
    });
    describe('#draw', function () {
        it('draws active objects', function () {
            var pool, shape1, shape2;
            pool = new Arcadia.Pool();
            shape1 = new Arcadia.Shape();
            shape2 = new Arcadia.Shape();
            pool.add(shape1);
            pool.add(shape2);
            pool.deactivate(shape1);
            spyOn(shape1, 'draw');
            spyOn(shape2, 'draw');
            pool.draw(1);
            expect(shape2.draw).toHaveBeenCalled();
            expect(shape1.draw).not.toHaveBeenCalled();
        });
    });
});

// ---
// generated by coffee-script 1.9.2
