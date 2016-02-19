/*jslint sloppy: true */
/*global describe: false, it: false, expect: false, beforeEach: false,
afterEach: false, spyOn: false, jasmine: false */

describe('Arcadia.Scene', function () {
    var scene,
        context,
        WIDTH = 640,
        HEIGHT = 480;

    beforeEach(function () {
        scene = new Arcadia.Scene({
            size: {
                width: WIDTH,
                height: HEIGHT
            }
        });
        context = jasmine.createSpyObj('context', [ 'canvas', 'clearRect', 'translate', 'save' ]);
    });

    afterEach(function () {
        scene = context = null;
    });

    it('can add child objects', function () {
        var shape = new Arcadia.Shape();

        expect(function () {
            scene.add(shape);
        }).not.toThrow();

        expect(scene.children.length).toBe(1);
    });

    xit('gives child object a link back to parent', function () {
        var shape = new Arcadia.Shape();

        scene.add(shape);
        expect(shape.parent).toBe(scene);
    });

    it('can remove child objects', function () {
        var shape = new Arcadia.Shape();

        scene.add(shape);
        expect(scene.children.length).toBe(1);

        scene.remove(shape);
        expect(scene.children.length).toBe(0);
    });

    it("updates its' child objects", function () {
        var shape,
            delta;

        shape = new Arcadia.Shape();
        delta = 1;

        spyOn(shape, 'update');

        scene.add(shape);
        scene.update(delta);

        expect(shape.update).toHaveBeenCalledWith(delta);
    });

    it("draws its' child objects", function () {
        var shape,
            context;

        shape = new Arcadia.Shape();
        context = {
            canvas: {
                width: WIDTH,
                height: HEIGHT
            },
            clearRect: jasmine.createSpy('clearRect')
        };

        spyOn(shape, 'draw');

        scene.add(shape);
        scene.draw(context);

        expect(shape.draw).toHaveBeenCalledWith(context, WIDTH / 2, HEIGHT / 2);
    });

    it('tracks a camera target', function () {
        var shape = new Arcadia.Shape(100, 100);

        scene.target = shape;

        spyOn(shape, 'draw');

        scene.add(shape);
        scene.draw(context);

        expect(shape.draw).toHaveBeenCalledWith(context, scene.camera.viewport.width / 2 - shape.position.x, scene.camera.viewport.height / 2 - shape.position.y);
    });

    it('draws other child shapes offset by camera target', function () {
        var shape1,
            shape2;

        shape1 = new Arcadia.Shape(100, 100);
        shape2 = new Arcadia.Shape(200, 200);

        scene.add(shape1);
        scene.add(shape2);

        scene.target = shape1;

        spyOn(shape1, 'draw');
        spyOn(shape2, 'draw');

        scene.draw(context);

        expect(shape1.draw).toHaveBeenCalledWith(context, scene.camera.viewport.width / 2 - shape1.position.x, scene.camera.viewport.height / 2 - shape1.position.y);
        expect(shape2.draw).toHaveBeenCalledWith(context, scene.camera.viewport.width / 2 - shape1.position.x, scene.camera.viewport.height / 2 - shape1.position.y);
    });

});
