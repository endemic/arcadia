var Options = function () {
    Arcadia.Scene.apply(this);

    var title = new Arcadia.Label({
        text: 'Options',
        font: '55px uni_05_53',
        color: '#fff',
        shadow: '0px 0px 10px #000'
    });
    title.position = {
        x: Arcadia.WIDTH / 2,
        y: 100
    };
    this.add(title);

    var backButton = new Arcadia.Button({
        position: { x: 65, y: 30 },
        size: { width: 100, height: 30 },
        border: '5px solid #000',
        color: '#665945',
        shadow: '5px 5px 0 #000',
        label: new Arcadia.Label({
            text: '< back',
            color: '#fff',
            font: '20px uni_05_53',
            position: { x: 0, y: -3 }
        }),
        action: function () {
            Arcadia.playSfx('button');
            Arcadia.changeScene(Title);
        }
    });
    this.add(backButton);

    var musicToggle = new Arcadia.Button({
        position: { x: Arcadia.WIDTH / 2, y: 400 },
        size: { width: 190, height: 40 },
        border: '5px solid #000',
        color: '#665945',
        shadow: '5px 5px 0 #000',
        label: new Arcadia.Label({
            text: (localStorage.getBoolean('playMusic') ? 'Music ON' : 'Music OFF'),
            color: '#fff',
            font: '30px uni_05_53',
            position: { x: 0, y: -3 }
        }),
        action: function () {
            Arcadia.playSfx('button');

            if (localStorage.getBoolean('playMusic')) {
                localStorage.setBoolean('playMusic', false);
                this.text = 'Music OFF';
                Arcadia.stopMusic();
            } else {
                localStorage.setBoolean('playMusic', true);
                this.text = 'Music ON';
                Arcadia.playMusic('bgm-one');
            }
        }
    });
    this.add(musicToggle);

    var sfxToggle = new Arcadia.Button({
        position: { x: Arcadia.WIDTH / 2, y: 470 },
        size: { width: 190, height: 40 },
        border: '5px solid #000',
        color: '#665945',
        shadow: '5px 5px 0 #000',
        label: new Arcadia.Label({
            text: (localStorage.getBoolean('playSfx') ? 'Sound ON' : 'Sound OFF'),
            color: '#fff',
            font: '30px uni_05_53',
            position: { x: 0, y: -3 }
        }),
        action: function () {
            Arcadia.playSfx('button');

            if (localStorage.getBoolean('playSfx')) {
                localStorage.setBoolean('playSfx', false);
                this.text = 'Sound OFF';
            } else {
                localStorage.setBoolean('playSfx', true);
                this.text = 'Sound ON';
            }
        }
    });
    this.add(sfxToggle);
};

Options.prototype = new Arcadia.Scene();
