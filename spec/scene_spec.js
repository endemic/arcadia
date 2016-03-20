/*jslint sloppy: true */
/*global describe: false, it: false, expect: false, beforeEach: false,
afterEach: false, spyOn: false, jasmine: false */

describe('Arcadia.Scene', function () {
    var scene,
        context,
        WIDTH = 600,
        HEIGHT = 400;

    beforeEach(function () {
        scene = new Arcadia.Scene({
            size: {width: WIDTH, height: HEIGHT}
        });
        context = jasmine.createSpyObj('context', [ 'canvas', 'clearRect', 'translate', 'save' ]);
    });

    afterEach(function () {
        scene = context = null;
    });

    describe('#update', function () {
        it('updates camera position based on target position');
        xit('won\'t go beyond top bounds');
        xit('won\'t go beyond bottom bounds');
        xit('won\'t go beyond left bounds');
        xit('won\'t go beyond right bounds');
    });

    describe('#draw', function () {
        var dummyContext = {
            canvas: {
                width: WIDTH,
                height: HEIGHT
            },
            fillRect: function dummy() {},
            clearRect: function dummy() {}
        };

        it('draws child objects', function () {
            var shape = new Arcadia.Shape();

            spyOn(shape, 'draw');

            scene.add(shape);
            scene.draw(dummyContext);

            expect(shape.draw).toHaveBeenCalledWith(dummyContext, 300, 200);
        });

        xit('draws child shapes offset by camera target', function () {
            var shape1 = new Arcadia.Shape({
                position: {x: 100, y: 100}
            });
            var shape2 = new Arcadia.Shape({
                position: {x: 200, y: 200}
            });

            scene.add(shape1);
            scene.add(shape2);

            scene.target = shape1;

            spyOn(shape1, 'draw');
            spyOn(shape2, 'draw');

            scene.draw(dummyContext);

            expect(shape1.draw).toHaveBeenCalledWith(dummyContext, 200, 100);
            expect(shape2.draw).toHaveBeenCalledWith(dummyContext, 200, 100);
        });

        it('clears previously drawn content', function () {
            spyOn(dummyContext, 'clearRect');
            scene.draw(dummyContext);
            expect(dummyContext.clearRect).toHaveBeenCalledWith(0, 0, 600, 400);
        });

        it('fills over previously drawn content', function () {
            spyOn(dummyContext, 'fillRect');
            scene.color = 'green';
            scene.draw(dummyContext);
            expect(dummyContext.fillRect).toHaveBeenCalledWith(0, 0, 600, 400);
            expect(dummyContext.fillStyle).toBe('green');
        });
    });

    describe('#target', function () {
        it('gets camera target shape');
        it('can set camera target shape');
        it('throws if target doesn\'t have a position');
    });
});
