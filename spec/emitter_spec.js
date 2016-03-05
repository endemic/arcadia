describe('Arcadia.Emitter', function () {
    var emitter;
    var factory;
    var particleCount = 100;

    beforeEach(function () {
        factory = function () {
            var shape = new Arcadia.Shape();
            shape.reset = function () {
                this.shape = 'circle';
            };
            return shape;
        };

        emitter = new Arcadia.Emitter(factory, particleCount);
    });

    afterEach(function () {
        emitter = null;
        factory = null;
    });

    it('requires a factory function', function () {
        expect(function () {
            new Arcadia.Emitter();
        }).toThrow();

        expect(function () {
            new Arcadia.Emitter(factory);
        }).not.toThrow();
    });

    it('creates inactive particles', function () {
        var expectedParticleCount = 100;
        expect(emitter.children.inactive.length).toBe(expectedParticleCount);
    });

    it('tries to reset particles when starting', function () {
        var particle = emitter.children.inactive[0];
        spyOn(particle, 'reset');
        emitter.startAt(0, 0);
        expect(particle.reset).toHaveBeenCalled();
    });

    it('activates particles when starting', function () {
        var expectedParticleCount = 100;
        emitter.startAt(0, 0);
        expect(emitter.children.length).toBe(expectedParticleCount);
    });
});
