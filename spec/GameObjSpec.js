/*jslint sloppy: true */
/*global describe: false, it: false, expect: false, beforeEach: false, afterEach: false, Vectr: false */

describe('Vectr.GameObject', function () {
    var gameobj;

    beforeEach(function () {
        gameobj = new Vectr.GameObject();
    });

    afterEach(function () {
        gameobj = null;
    });

    it('can set/get a color value', function () {
        gameobj.color = 'rgba(0, 0, 0, 1)';
        expect(gameobj.color).toBe('rgba(0, 0, 0, 1)');
    });

    it('can have Vectr objects added to it', function () {
        var shape = new Vectr.Shape(0, 0, 'circle', 25);
        gameobj.add(shape);
        expect(gameobj.children.length).toBe(1);
    });

    it("can't have non-Vectr objects added to it", function () {
        var obj = {
            property: "fgsfds"
        };

        expect(function () { gameobj.add(obj); }).toThrow();
    });

    it("updates its' active child objects", function () {
        var activeShape,
            inactiveShape;

        activeShape = new Vectr.Shape(0, 0, 'circle', 25);
        activeShape.velocity.x = 10;

        inactiveShape = new Vectr.Shape(0, 0, 'circle', 25);
        inactiveShape.velocity.x = 10;
        inactiveShape.active = false;

        gameobj.add(activeShape);
        gameobj.add(inactiveShape);

        gameobj.update(1);

        expect(activeShape.position.x).toBe(10);
        expect(inactiveShape.position.x).toBe(0);
    });

});
