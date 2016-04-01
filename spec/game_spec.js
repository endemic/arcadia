var CANVAS_WIDTH = 100;
var CANVAS_HEIGHT = 100;

describe('Arcadia.Game', function () {
    var dummyScene;
    var game;

    beforeEach(function () {
        dummyScene = {
            onKeyDown: function () {},
            onKeyUp: function () {},
            onPointStart: function () {},
            onPointMove: function () {},
            onPointEnd: function () {},
            camera: {
                position: {x: 0, y:0}
            }
        };

        game = new Arcadia.Game({
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
            scene: function dummyConstructor() {},
            scaleToFit: true
        });
        game.activeScene = dummyScene;
        game.stop();
    });

    afterEach(function () {
        game = null;
    });

    it('creates a canvas element', function () {
        var container = document.getElementById('arcadia');
        expect(container.children[0].tagName).toBe('CANVAS');
    });

    it('correctly sizes the canvas element', function () {
        var canvas = document.getElementById('arcadia').children[0];
        expect(canvas.height).toBe(CANVAS_HEIGHT * Arcadia.PIXEL_RATIO);
        expect(canvas.width).toBe(CANVAS_WIDTH * Arcadia.PIXEL_RATIO);
    });

    describe('input events', function () {
        describe('#onKeyDown', function () {
            it('sends the key event into the active scene', function () {
                spyOn(dummyScene, 'onKeyDown');
                simulateKeyboardEvent('keydown', 'left');
                expect(dummyScene.onKeyDown).toHaveBeenCalledWith('left');
            });
        });

        describe('#onKeyUp', function () {
            it('sends the key event into the active scene', function () {
                spyOn(dummyScene, 'onKeyUp');
                simulateKeyboardEvent('keyup', 'right');
                expect(dummyScene.onKeyUp).toHaveBeenCalledWith('right');
            });
        });

        describe('#onPointStart', function () {
            it('sends the mouse event into the active scene', function () {
                var coords = {x: 1, y: 2};
                spyOn(dummyScene, 'onPointStart');
                simulateMouseEvent(game.element, 'mousedown', coords);
                expect(dummyScene.onPointStart).toHaveBeenCalledWith([{x: coords.x, y: coords.y}]);
            });
        });

        describe('#onPointMove', function () {
            it('sends the mouse event into the active scene', function () {
                var coords = {x: 1, y: 2};
                spyOn(dummyScene, 'onPointMove');
                simulateMouseEvent(game.element, 'mousedown', coords); // Need to start the mousedown first
                simulateMouseEvent(game.element, 'mousemove', coords);
                expect(dummyScene.onPointMove).toHaveBeenCalledWith([{x: coords.x, y: coords.y}]);
            });
        });

        describe('#onPointEnd', function () {
            it('sends the mouse event into the active scene', function () {
                var coords = {x: 1, y: 2};
                spyOn(dummyScene, 'onPointEnd');
                simulateMouseEvent(game.element, 'mouseup', coords);
                expect(dummyScene.onPointEnd).toHaveBeenCalledWith([{x: coords.x, y: coords.y}]);
            });
        });
    });
});

/* HELPER METHODS */
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

    var data = getScaleAndOffset();
    var offset = data.offset;
    var scale = data.scale;

    Object.defineProperty(event, 'pageX', {
        get: function () {
            return (coordinates.x + offset.x) * scale + CANVAS_WIDTH / 2;
        }
    });

    Object.defineProperty(event, 'pageY', {
        get: function () {
            return (coordinates.y + offset.y) * scale + CANVAS_HEIGHT / 2;
        }
    });
    element.dispatchEvent(event);
}

function getScaleAndOffset() {
    var height = window.innerHeight;
    var width = window.innerWidth;
    var orientation;
    var aspectRatio;

    if (width > height) {
        orientation = 'landscape';
        aspectRatio = CANVAS_WIDTH / CANVAS_HEIGHT;
    } else {
        orientation = 'portrait';
        aspectRatio = CANVAS_HEIGHT / CANVAS_WIDTH;
    }

    if (orientation === 'landscape') {
        if (width / aspectRatio > height) {  // Too wide
            width = height * aspectRatio;
        } else if (width / aspectRatio < height) {  // Too high
            height = width / aspectRatio;
        }
    } else if (orientation === 'portrait') {
        if (height / aspectRatio > width) {   // Too high
            height = width * aspectRatio;
        } else if (height / aspectRatio < width) {  // Too wide
            width = height / aspectRatio;
        }
    }

    var scale = height / CANVAS_HEIGHT;
    var offset = {
        x: (window.innerWidth - width) / 2,
        y: (window.innerHeight - height) / 2
    };
    return {
        scale: scale,
        offset: offset
    };
}

function simulateTouchEvent(type, coordinates) {

}
/* END HELPER METHODS */
