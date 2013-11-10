/*jslint sloppy: true */
/*global describe: false, it: false, expect: false, beforeEach: false,
afterEach: false, spyOn: false, jasmine: false, Vectr: false */

describe('Vectr.Scene', function () {
    var scene,
        context;

    Vectr.WIDTH = Vectr.HEIGHT = 1000;

    beforeEach(function () {
        scene = new Vectr.Scene();
        context = {
            canvas: {
                width: 0,
                height: 0
            },
            clearRect: jasmine.createSpy('clearRect'),
            translate: jasmine.createSpy('translate')
        };
    });

    afterEach(function () {
        scene = context = null;
    });

    it('can add child objects', function () {
        var shape = new Vectr.Shape();

        expect(function () { scene.add(shape); }).not.toThrow();
    });

    it("updates its' child objects", function () {
        var shape,
            delta;

        shape = new Vectr.Shape();
        delta = 1;

        spyOn(shape, 'update');

        scene.add(shape);
        scene.update(delta);

        expect(shape.update).toHaveBeenCalledWith(delta);
    });

    it("draws its' child objects", function () {
        var shape,
            context;

        shape = new Vectr.Shape();
        context = {
            canvas: {
                width: 0,
                height: 0
            },
            clearRect: jasmine.createSpy('clearRect')
        };

        spyOn(shape, 'draw');

        scene.add(shape);
        scene.draw(context);

        expect(shape.draw).toHaveBeenCalledWith(context, 0, 0);
    });

    it('tracks a camera target', function () {
        var shape;

        shape = new Vectr.Shape(100, 100);

        scene.target = shape;

        spyOn(shape, 'draw');

        scene.add(shape);
        scene.draw(context);

        expect(shape.draw).toHaveBeenCalledWith(context, scene.camera.viewport.width / 2 - shape.position.x, scene.camera.viewport.height / 2 - shape.position.y);
    });

    it('draws other child shapes offset by camera target', function () {
        var shape1,
            shape2;

        shape1 = new Vectr.Shape(100, 100);
        shape2 = new Vectr.Shape(200, 200);

        scene.add(shape1);
        scene.add(shape2);

        scene.target = shape1;

        spyOn(shape1, 'draw');
        spyOn(shape2, 'draw');

        scene.draw(context);

        expect(shape1.draw).toHaveBeenCalledWith(context, scene.camera.viewport.width / 2 - shape1.position.x, scene.camera.viewport.height / 2 - shape1.position.y);
        expect(shape2.draw).toHaveBeenCalledWith(context, scene.camera.viewport.width / 2 - shape1.position.x, scene.camera.viewport.height / 2 - shape1.position.y);
    });

    xit('draws static objects without camera offset', function () {
        var shape1,
            shape2;

        shape1 = new Vectr.Shape(100, 100);
        shape2 = new Vectr.Shape(200, 200);
        shape2.fixed = true;

        scene.add(shape1);
        scene.add(shape2);

        scene.target = shape1;

        spyOn(shape1, 'draw');
        spyOn(shape2, 'draw');

        scene.draw(context);

        expect(shape1.draw).toHaveBeenCalledWith(context, scene.camera.viewport.width / 2 - shape1.position.x, scene.camera.viewport.height / 2 - shape1.position.y);
        expect(shape2.draw).toHaveBeenCalledWith(context, 0, 0);
        expect(shape2.fixed).toBe(true);
    });
});