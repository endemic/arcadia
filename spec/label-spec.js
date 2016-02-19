describe('Arcadia.Label', function () {
    beforeEach(function () {
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.label = new Arcadia.Label({
            position: {
                x: 0,
                y: 0
            },
            text: 'Hey you guys!'
        });
    });

    afterEach(function () {
        this.label = null;
    });

    it('can draw itself', function () {
        var self = this;
        expect(function () {
            self.label.draw(self.context);
        }).not.toThrow();
    });

    xit('can get its height/width', function () {
        expect(this.label.size.width).toBe(94);
        expect(this.label.size.height).toBe(16);
    });
});
