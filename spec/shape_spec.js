describe('Arcadia.Shape', function () {
    var shape;
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');

    beforeEach(function () {
        shape = new Arcadia.Shape();
    });

    afterEach(function () {
        shape = null;
    });

    describe('updating drawable properties', function () {
        describe('#color', function () {
            it('updates internal color value', function () {
                shape.color = 'red';
                expect(shape._color).toBe('red');
            });
            it('updates internal cache', function () {
                spyOn(shape, 'drawCanvasCache');
                shape.color = 'red';
                shape.draw(context);
                expect(shape.drawCanvasCache).toHaveBeenCalled();
            });
        });

        describe('#border', function () {
            it('updates internal border value', function () {
                shape.border = '5px blue';
                expect(shape._border.width).toBe(5);
                expect(shape._border.color).toBe('blue');
            });
            it('updates internal cache', function () {
                spyOn(shape, 'drawCanvasCache');
                shape.border = '2px red';
                shape.draw(context);
                expect(shape.drawCanvasCache).toHaveBeenCalled();
            });
            it('throws an error on invalid args', function () {
                expect(function () {
                    shape.border = 'nonsense';
                }).toThrowError('Use format "(width)px (color)" when setting borders');
            });
        });

        describe('#shadow', function () {
            it('updates internal shadow value', function () {
                shape.shadow = '1px 1px 1px blue';
                expect(shape._shadow.x).toBe(1);
                expect(shape._shadow.y).toBe(1);
                expect(shape._shadow.blur).toBe(1);
                expect(shape._shadow.color).toBe('blue');
            });
            it('updates internal cache', function () {
                spyOn(shape, 'drawCanvasCache');
                shape.shadow = '2px 2px 2px red';
                shape.draw(context);
                expect(shape.drawCanvasCache).toHaveBeenCalled();
            });
            it('throws an error on invalid args', function () {
                expect(function () {
                    shape.shadow = 'garbage';
                }).toThrowError('Use format "(x)px (y)px (blur)px (color)" when setting shadows');
            });
        });

        describe('#vertices', function () {
            it('updates internal vertices value', function () {
                shape.vertices = 3;
                expect(shape._vertices).toBe(3);
            });
            it('updates internal cache', function () {
                spyOn(shape, 'drawCanvasCache');
                shape.vertices = 0;
                shape.draw(context);
                expect(shape.drawCanvasCache).toHaveBeenCalled();
            });
        });

        describe('#size', function () {
            it('updates internal size value', function () {
                shape.size = {width: 30, height: 40};
                expect(shape._size).toEqual({width: 30, height: 40});
            });
            it('updates internal cache', function () {
                spyOn(shape, 'drawCanvasCache');
                shape.size = {width: 10, height: 10};
                shape.draw(context);
                expect(shape.drawCanvasCache).toHaveBeenCalled();
            });
            it('throws an error on invalid args', function () {
                expect(function () {
                    shape.size = {width: 0, height: 0};
                }).toThrowError('Bad things happen when you make a canvas smaller than 1x1');
            });
            xit('allows setting size via string rather than object', function () {
                shape.size = '4px 5px';
                expect(shape.size).toEqual({width: 4, height: 5});
            })
        });

        describe('#path', function () {
            var customPath = function (context) { console.info('doing things with context!'); };

            it('updates internal path value', function () {
                shape.path = customPath;
                expect(shape._path).toEqual(customPath);
            });
            it('updates internal cache', function () {
                spyOn(shape, 'drawCanvasCache');
                shape.path = customPath;
                shape.draw(context);
                expect(shape.drawCanvasCache).toHaveBeenCalled();
            });
        });
    });

    describe('#drawCanvasCache', function () {
        it('draws custom path', function () {

        });
        it('draws a line', function () {

        });
        it('draws a triangle', function () {

        });
        it('draws a square', function () {

        });
        it('draws a circle', function () {

        });
        it('draws a solid shape', function () {

        });
        it('draws a border', function () {

        });
        it('resets the `dirty` flag', function () {

        });
    });

    describe('#setAnchorPoint', function () {
        it('sets midpoint of object', function () {

        });
        it('sets midpoint of object with a border', function () {

        });
        it('sets midpoint of object with a shadow', function () {

        });
        it('sets midpoint of object with a negatively placed shadow', function () {

        });
        it('sets midpoint of object with a blurred shadow', function () {

        });
        it('sets midpoint of object with a negatively placed, blurred shadow', function () {

        });
    });

    describe('#draw', function () {
        it('draws the shape to the main canvas', function () {

        });
        it('saves/restores the original canvas state', function () {

        });
        it('draws the shape relative to x/y offsets', function () {

        });
        it('draws the shape at its x/y position', function () {

        });
        it('draws the shape with appropriate rotation', function () {

        });
        it('draws the shape with appropriate scale', function () {

        });
    });

    describe('#update', function () {
        describe('tweened properties', function () {
            it('updates simple properties', function () {

            });

            it('updates complex properties', function () {

            });
        });

        it('updates shape velocity based on acceleration', function () {

        });
        it('updates shape position based on velocity/speed/delta', function () {

        });
        it('updates shape rotation based on angularVelocity/delta', function () {

        });
    });

    describe('#collidesWith', function () {
        it('handles AABB collisions', function () {

        });
    });

    describe('#tween', function () {
        it('adds a simple property tween to the shape', function () {

        });
        it('adds a complex property tween to the shape', function () {

        });
    });
});

