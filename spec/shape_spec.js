describe('Arcadia.Shape', function () {
    var shape;
    var dummyContext;
    var SHAPE_WIDTH = 30;
    var SHAPE_HEIGHT = 20;

    beforeEach(function () {
        shape = new Arcadia.Shape({
            size: {
                width: SHAPE_WIDTH,
                height: SHAPE_HEIGHT
            }
        });

        dummyContext = {
            save: function dummySave() {},
            translate: function dummyTranslate() {},
            rotate: function dummyRotate() {},
            scale: function dummyScale() {},
            restore: function dummyRestore() {},
            drawImage: function dummyDrawImage() {},
            globalAlpha: null
        };
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
                shape.draw(dummyContext);
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
                shape.draw(dummyContext);
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
                shape.draw(dummyContext);
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
                shape.draw(dummyContext);
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
                shape.draw(dummyContext);
                expect(shape.drawCanvasCache).toHaveBeenCalled();
            });
            it('throws an error on invalid args', function () {
                expect(function () {
                    shape.size = {width: 0.5, height: 0};
                }).toThrowError('`Shape` width/height must be greater than 1!');
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
                shape.draw(dummyContext);
                expect(shape.drawCanvasCache).toHaveBeenCalled();
            });
        });
    });

    describe('#drawCanvasCache', function () {
        it('draws custom path', function () {
            var context = shape.canvas.getContext('2d');
            shape.path = function (context) { console.info('drawrin'); };;
            spyOn(shape, 'path');
            shape.drawCanvasCache();
            expect(shape.path).toHaveBeenCalledWith(context);
        });
        it('draws a line', function () {
            var context = shape.canvas.getContext('2d');
            spyOn(context, 'moveTo');
            spyOn(context, 'lineTo');
            shape.vertices = 2;
            shape.drawCanvasCache();
            expect(context.moveTo).toHaveBeenCalledWith(-SHAPE_WIDTH / 2 * Arcadia.PIXEL_RATIO, -SHAPE_HEIGHT / 2 * Arcadia.PIXEL_RATIO);
            expect(context.lineTo).toHaveBeenCalledWith(SHAPE_WIDTH / 2 * Arcadia.PIXEL_RATIO, SHAPE_HEIGHT / 2 * Arcadia.PIXEL_RATIO);
        });
        it('draws a triangle', function () {
            var context = shape.canvas.getContext('2d');
            spyOn(context, 'moveTo');
            spyOn(context, 'lineTo');
            shape.vertices = 3;
            shape.drawCanvasCache();
            expect(context.moveTo).toHaveBeenCalledWith(0, -SHAPE_HEIGHT / 2 * Arcadia.PIXEL_RATIO);
            expect(context.lineTo).toHaveBeenCalledWith(SHAPE_WIDTH / 2 * Arcadia.PIXEL_RATIO, SHAPE_HEIGHT / 2 * Arcadia.PIXEL_RATIO);
            expect(context.lineTo).toHaveBeenCalledWith(-SHAPE_WIDTH / 2 * Arcadia.PIXEL_RATIO, SHAPE_HEIGHT / 2 * Arcadia.PIXEL_RATIO);
            expect(context.lineTo).toHaveBeenCalledWith(0, -SHAPE_HEIGHT / 2 * Arcadia.PIXEL_RATIO);
        });
        it('draws a square', function () {
            var context = shape.canvas.getContext('2d');
            spyOn(context, 'moveTo');
            spyOn(context, 'lineTo');
            shape.vertices = 4;
            shape.drawCanvasCache();
            expect(context.moveTo).toHaveBeenCalledWith(-SHAPE_WIDTH / 2 * Arcadia.PIXEL_RATIO, -SHAPE_HEIGHT / 2 * Arcadia.PIXEL_RATIO);
            expect(context.lineTo).toHaveBeenCalledWith(SHAPE_WIDTH / 2 * Arcadia.PIXEL_RATIO, -SHAPE_HEIGHT / 2 * Arcadia.PIXEL_RATIO);
            expect(context.lineTo).toHaveBeenCalledWith(SHAPE_WIDTH / 2 * Arcadia.PIXEL_RATIO, SHAPE_HEIGHT / 2 * Arcadia.PIXEL_RATIO);
            expect(context.lineTo).toHaveBeenCalledWith(-SHAPE_WIDTH / 2 * Arcadia.PIXEL_RATIO, SHAPE_HEIGHT / 2 * Arcadia.PIXEL_RATIO);
            expect(context.lineTo).toHaveBeenCalledWith(-SHAPE_WIDTH / 2 * Arcadia.PIXEL_RATIO, -SHAPE_HEIGHT / 2 * Arcadia.PIXEL_RATIO);
        });
        it('draws a circle', function () {
            var context = shape.canvas.getContext('2d');
            spyOn(context, 'arc');
            shape.vertices = 0;
            shape.drawCanvasCache();
            expect(context.arc).toHaveBeenCalledWith(0, 0, SHAPE_WIDTH / 2 * Arcadia.PIXEL_RATIO, 0, 2 * Math.PI);
        });
        xit('draws a solid shape', function () {

        });
        xit('draws a border', function () {

        });
        it('resets the `dirty` flag', function () {
            shape.dirty = true;
            shape.drawCanvasCache();
            expect(shape.dirty).toBeFalsy();
        });
    });

    describe('#setAnchorPoint', function () {
        xit('sets midpoint of object', function () {

        });
        xit('sets midpoint of object with a border', function () {

        });
        xit('sets midpoint of object with a shadow', function () {

        });
        xit('sets midpoint of object with a negatively placed shadow', function () {

        });
        xit('sets midpoint of object with a blurred shadow', function () {

        });
        xit('sets midpoint of object with a negatively placed, blurred shadow', function () {

        });
    });

    describe('#draw', function () {
        it('inherits scale value from parent, even if zero', function () {
            spyOn(dummyContext, 'scale');
            shape.draw(dummyContext, 0, 0, 0, 0, 0); //context, offsetX, offsetY, offsetRotation, offsetScale, offsetAlpha
            expect(dummyContext.scale).toHaveBeenCalledWith(0, 0);
        });

        it('inherits alpha value from parent, even if zero', function () {
            shape.draw(dummyContext, 0, 0, 0, 0, 0); //context, offsetX, offsetY, offsetRotation, offsetScale, offsetAlpha
            expect(dummyContext.globalAlpha).toBe(0);
        });

        xit('draws the shape to the main canvas', function () {

        });
        xit('saves/restores the original canvas state', function () {

        });
        xit('draws the shape relative to x/y offsets', function () {

        });
        xit('draws the shape at its x/y position', function () {

        });
        xit('draws the shape with appropriate rotation', function () {

        });
        xit('draws the shape with appropriate scale', function () {

        });
    });

    describe('#update', function () {
        describe('tweened properties', function () {
            xit('updates simple properties', function () {

            });

            xit('updates complex properties', function () {

            });
        });

        xit('updates shape velocity based on acceleration', function () {

        });
        xit('updates shape position based on velocity/speed/delta', function () {

        });
        xit('updates shape rotation based on angularVelocity/delta', function () {

        });
    });

    describe('#collidesWith', function () {
        xit('handles AABB collisions', function () {

        });
    });

    describe('#tween', function () {
        xit('adds a simple property tween to the shape', function () {

        });
        xit('adds a complex property tween to the shape', function () {

        });
    });
});

