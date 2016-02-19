describe('Arcadia.Shape', function () {
    beforeEach(function () {
        this.shape = new Arcadia.Shape();
    });

    afterEach(function () {
        this.shape = null;
    });

    describe('updating drawable properties', function () {
        beforeEach(function () {
            this.canvas = document.createElement('canvas');
            this.context = this.canvas.getContext('2d');
        });

        describe('#color', function () {
            it('updates internal color value');
            it('redraws cache');
        })

        describe('#size', function () {
            it('updates internal cache', function () {
                spyOn(this.shape, 'drawCanvasCache');
                this.shape.size = {
                    width: 10,
                    height: 10
                };
                this.shape.draw(this.context);
                expect(this.shape.drawCanvasCache).toHaveBeenCalled();
            });
        });
    });

    xit('accepts a string for position', function () {
        this.shape.position = '-5px 10px';
        expect(this.shape.position.x).toBe(-5);
        expect(this.shape.position.y).toBe(10);
    });

    xit('accepts a string for size', function () {
        this.shape.size = '3px 10px';
        expect(this.shape.size.width).toBe(3);
        expect(this.shape.size.height).toBe(10);
    });
});

