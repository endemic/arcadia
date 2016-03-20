describe('Arcadia.Label', function () {
    var label;
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');

    beforeEach(function () {
        label = new Arcadia.Label({ text: 'Hey you guys!' });
    });

    afterEach(function () {
        label = null;
    });

    describe('#drawCanvasCache', function () {
        xit('creates an offscreen div to calculate text dimensions', function () {

        });
        xit('draws solid text', function () {

        });
        xit('draws outlined text', function () {

        });
        xit('resets the `dirty` flag', function () {

        });
    });

    describe('#font', function () {
        it('gets current font', function () {
            expect(label.font).toBe('10px monospace');
        });
        it('sets the internal font value', function () {
            label.font = '33px serif';
            expect(label._font).toEqual({ size: '33', family: 'serif' });
        });
        it('throws if bad value', function () {
            expect(function () {
                label.font = '10rem sans-serif';
            }).toThrowError('Use format "(size)px (font-family)" when setting Label font');
        });
        it('setting will trigger a re-draw', function () {
            label.font = '33px serif';
            expect(label.dirty).toBeTruthy();
        });
    });

    describe('#text', function () {
        it('gets current text', function () {
            expect(label.text).toBe('Hey you guys!');
        });
        it('sets the internal text value', function () {
            label.text = 'this is new text';
            expect(label._text).toBe('this is new text');
        });
        it('setting will trigger a re-draw', function () {
            label.text = 'oh hai guis';
            expect(label.dirty).toBeTruthy();
        });
    });

    describe('#alignment', function () {
        it('gets current alignment', function () {
            expect(label.alignment).toBe('center');
        });
        it('sets the internal alignment value', function () {
            label.alignment = 'left';
            expect(label._alignment).toBe('left');
        });
        it('throws if bad value', function () {
            expect(function () {
                label.alignment = 'bad value';
            }).toThrowError('Allowed alignment values: left, right, center, start, end');
        });
        it('setting will trigger a re-draw', function () {
            label.alignment = 'left';
            expect(label.dirty).toBeTruthy();
        });
    });
});
