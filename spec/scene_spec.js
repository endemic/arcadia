/*jslint sloppy: true */
/*global describe: false, it: false, expect: false, beforeEach: false,
afterEach: false, spyOn: false, jasmine: false */

describe('Arcadia.Scene', function () {
    var scene;
    var context;
    var SCENE_WIDTH = 1200;
    var SCENE_HEIGHT = 1200;
    var GAME_WIDTH = 640;
    var GAME_HEIGHT = 480;

    beforeEach(function () {
        scene = new Arcadia.Scene({
            size: {width: SCENE_WIDTH, height: SCENE_HEIGHT},
            parent: {size: {width: GAME_WIDTH, height: GAME_HEIGHT}}
        });
        context = jasmine.createSpyObj('context', [ 'canvas', 'clearRect', 'translate', 'save' ]);
    });

    afterEach(function () {
        scene = context = null;
    });

    describe('#update', function () {
        xit('updates camera position based on target position');
        xit('won\'t go beyond top bounds');
        xit('won\'t go beyond bottom bounds');
        xit('won\'t go beyond left bounds');
        xit('won\'t go beyond right bounds');
    });

    describe('#draw', function () {
        var dummyContext = {
            canvas: {
                width: GAME_WIDTH,
                height: GAME_HEIGHT
            },
            fillRect: function dummy() {},
            clearRect: function dummy() {}
        };

        it('draws child objects', function () {
            var shape = new Arcadia.Shape();

            spyOn(shape, 'draw');

            scene.add(shape);
            scene.draw(dummyContext);

            expect(shape.draw).toHaveBeenCalledWith(dummyContext, GAME_WIDTH / 2, GAME_HEIGHT / 2);
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

            scene.update(0.16);

            spyOn(shape1, 'draw');
            spyOn(shape2, 'draw');

            scene.draw(dummyContext);

            expect(shape1.draw).toHaveBeenCalledWith(dummyContext, 220, 140);
            expect(shape2.draw).toHaveBeenCalledWith(dummyContext, 220, 140);
        });

        it('clears previously drawn content', function () {
            spyOn(dummyContext, 'clearRect');
            scene.draw(dummyContext);
            expect(dummyContext.clearRect).toHaveBeenCalledWith(0, 0, GAME_WIDTH, GAME_HEIGHT);
        });

        it('fills over previously drawn content', function () {
            spyOn(dummyContext, 'fillRect');
            scene.color = 'green';
            scene.draw(dummyContext);
            expect(dummyContext.fillRect).toHaveBeenCalledWith(0, 0, GAME_WIDTH, GAME_HEIGHT);
            expect(dummyContext.fillStyle).toBe('green');
        });
    });

    describe('#target', function () {
        it('gets camera target shape', function () {
            expect(scene.target).toBe(null);
        });
        it('can set camera target shape', function () {
            var shape = new Arcadia.Shape();
            scene.target = shape;
            expect(scene.target).toBe(shape);
        });
        it('throws if target does not have a position prop', function () {
            expect(function () {
                scene.target = {garbage: true};
            }).toThrowError('Scene camera target requires a `position` property.');
        });
    });
});
