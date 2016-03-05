var CANVAS_WIDTH = 100;
var CANVAS_HEIGHT = 100;

function simulateKeyboardEvent(type, key) {
    var codes = {
        left: 37,
        up: 38,
        right: 39,
        down: 40,
        w: 87,
        a: 65,
        s: 83,
        d: 68,
        enter: 13,
        escape: 27,
        space: 32,
        control: 17,
        z: 90,
        x: 88
    };

    var event = new KeyboardEvent(type); // allowed: keydown, keyup

    Object.defineProperty(event, 'keyCode', {
        get: function () {
            return codes[key];
        }
    });

    document.dispatchEvent(event);
}

function simulateMouseEvent(element, type, coordinates) {
    var event = new MouseEvent(type);   // allowed mousedown, mousemove, mouseup

    Object.defineProperty(event, 'pageX', {
        get: function () {
            return coordinates.x * Arcadia.instance.scale + CANVAS_WIDTH / 2;
        }
    });

    Object.defineProperty(event, 'pageY', {
        get: function () {
            return coordinates.y * Arcadia.instance.scale + CANVAS_WIDTH / 2;
        }
    });

    element.dispatchEvent(event);
}

function simulateTouchEvent(type, coordinates) {

}

describe('Arcadia.Game', function () {
    var game;

    beforeEach(function () {
        game = new Arcadia.Game({
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
            scene: function dummyScene() {},
            scaleToFit: true
        });
        game.stop();
    });

    afterEach(function () {
        game = null;
    });

    it('creates a canvas element');

    it('correctly sizes the canvas element');

    describe('input events', function () {
        describe('#onKeyDown', function () {
            it('sends the key event into the active scene', function () {
                var sceneSpy = {onKeyDown: function () {}};
                spyOn(sceneSpy, 'onKeyDown');
                game.activeScene = sceneSpy;
                simulateKeyboardEvent('keydown', 'left');
                expect(sceneSpy.onKeyDown).toHaveBeenCalledWith('left');
            });
        });

        describe('#onKeyUp', function () {
            it('sends the key event into the active scene', function () {
                var sceneSpy = {onKeyUp: function () {}};
                spyOn(sceneSpy, 'onKeyUp');
                game.activeScene = sceneSpy;
                simulateKeyboardEvent('keyup', 'right');
                expect(sceneSpy.onKeyUp).toHaveBeenCalledWith('right');
            });
        });

        describe('#onPointStart', function () {
            it('sends the mouse event into the active scene', function () {
                var sceneSpy = {
                    onPointStart: function () {},
                    camera: {
                        position: {x: 0, y: 0}
                    }
                };
                var coords = {x: 1, y: 2};
                spyOn(sceneSpy, 'onPointStart');
                game.activeScene = sceneSpy;
                simulateMouseEvent(game.element, 'mousedown', coords);
                expect(sceneSpy.onPointStart).toHaveBeenCalledWith([{x: 1, y: 2}]);
            });
        });

    });
});
