// initialize kaboom context
kaboom({
    global: true, // so you don't have to use kaboom.loadSprite etc
    crisp: true, // for crisp pixel art
    width: 320, // width of canvas
    height: 240, // height of canvas
    scale: 2 // scales the game up
});


//////////////////////////////////////////////////////////
//                      SPRITES                         //
//////////////////////////////////////////////////////////
loadSprite('player', './data/game-assets/imgs/player/player_idle+walk+jump-4strip.png', {
    sliceX: 4,
    sliceY: 3,
    gridWidth: 4,
    gridHeight: 2,
    anims: {
        idle: {
            from: 0,
            to: 3
        },
        move: {
            from: 4,
            to: 7
        },
        jumpup: {
            from: 8,
            to: 8
        },
        jumpdown: {
            from: 9,
            to: 9
        }
    }
});

loadSprite('npc-idle', './data/game-assets/imgs/npc/npc-blue_idle-strip.png', {
    sliceX: 4,
    sliceY: 1,
    anims: {
        from: 0,
        to: 3
    }
});

loadSprite('sign', './data/game-assets/imgs/sign-16x16.png');

//////////////////////////////////////////////////////////
//                  BACKGROUND SPRITES                  //
//////////////////////////////////////////////////////////
loadSprite('icon', './data/game-assets/imgs/sbl-icon_transp.png');

loadSprite('brick-bot-mid', './data/game-assets/imgs/backgrounds/brick-bot.png');
loadSprite('brick-left', './data/game-assets/imgs/backgrounds/brick_left-bot-end.png');
loadSprite('brick-right', './data/game-assets/imgs/backgrounds/brick_right-top-end.png');
loadSprite('brick-one', './data/game-assets/imgs/backgrounds/brick_one.png');
loadSprite('lava-brick-one', './data/game-assets/imgs/backgrounds/lava-brick_one.png');

loadSprite('bg', './data/game-assets/imgs/backgrounds/bg.png');

//////////////////////////////////////////////////////////
//                  SOUNDS                              //
//////////////////////////////////////////////////////////
loadSound('blip', './data/game-assets/audio/blip.wav');
loadSound('hurt', './data/game-assets/audio/hurt.wav');
loadSound('hit', './data/game-assets/audio/hit.wav');

//////////////////////////////////////////////////////////
//                    SPLASH SCENE                      //
//////////////////////////////////////////////////////////
scene("splash", () => {
    // creates the order of the layers
    layers([
        'bg',
        'obj',
        'ui',
    ], 'obj'); // defaults as obj

    const bg = add([
        sprite('bg'),
        pos(0, 0),
        layer('bg')
    ]);

    const icon = add([
        sprite('icon'),
        pos(150, 100),
        layer('obj')
    ]);

    add([
        text(`
            A Damien Darko Game
        -Press Space to Continue-
        `, 10),
        pos(-50, 120),
        layer('ui'),
    ]);

    // on key press, switches scenes
    keyPress('space', () => {
        play('blip', {
            volume: 5.0
        });
        go('main', 0);
    });
});
//////////////////////////////////////////////////////////
//                      MENU SCENE                      //
//////////////////////////////////////////////////////////
scene("main", () => {
    // creates the order of the layers
    layers([
        'bg',
        'obj',
        'ui',
    ], 'obj'); // defaults as obj
    // add a text at position
    add([
        text(`
            -Controls-
        Start Game: 
            Space
        Movement: 
            WASD or Arrows
        Jump: 
            W, Space or Up
        Restart: 
            R
        Main Menu:
            Escape
        `, 10),
        pos(0, 50),
        layer('ui'),
    ]);

    const bg = add([
        sprite('bg'),
        pos(0, 0),
        layer('bg')
    ]);

    // on key press, switches scenes
    keyPress('space', () => {
        play('blip', {
            volume: 5.0
        });
        go('game', 0);
    });
});

//////////////////////////////////////////////////////////
//                      GAME SCENE                      //
//////////////////////////////////////////////////////////
scene('game', (levelIdx) => {
    // creates the order of the layers
    layers([
        'bg',
        'sign',
        'obj',
        'ui',
    ], 'obj'); // defaults as obj
    //                      CONTROLS                        //
    const left = ['a', 'left'];
    const right = ['d', 'right'];
    const jump = ['w', 'space', 'up'];

    const player = add([
        sprite('player'), // sprite being used
        pos(100, 100),
        scale(1),
        origin('center'),
        layer('obj'),
        body({ jumpForce: 260, }),
        'player', // tags
        'killable', // tags
        { speed: 160 },
    ]);

    const bg = add([
        sprite('bg'),
        pos(0, 0),
        'bg', // tag
        layer('bg') 
    ]);

    const signs = {
        'a': {
            sprite: 'sign',
            msg: `Hello, my name is Damien! \nAnd welcome to my portfolio site`
        },
        'b': {
            sprite: 'sign',
            msg: `I graduated from App Academy\nas a Full Stack Software\nEngineer`
        },
        'c': {
            sprite: 'sign',
            msg: `Walk to each sign to find\nout a little bit more about me!`
        },
        'd': {
            sprite: 'sign',
            msg: `You can also browse things \nI've worked on using the \nlinks above`
        },
        'e': {
            sprite: 'sign',
            msg: `Or take a look at my socials\nto the left including\na link to download my resume`
        },
        'f': {
            sprite: 'sign',
            msg: `I made this little game\nusing Kaboomjs`
        },
        'z': {
            sprite: 'sign',
            msg: `And I made all the sprites\nusing Aseprite`
        }
    };

    const levels = [
        [
            '=------------------]',
            '(                  )',
            '(   z              )',
            '(   (((            )',
            '(      f           )',
            '(      (((         )',
            '(         e        )',
            '(         (((      )',
            '(            d     )',
            '(            (((   )',
            '(                 c)',
            '(              b((()',
            '(           a(((   )',
            '(         (((      )',
            '=------------------]',
        ],
    ];

    addLevel(levels[levelIdx], {
        width: 16,
        height: 16,
        pos: vec2(0, 0),
        '=': [
            sprite('brick-left'),
            solid()
        ],
        '-': [
            sprite('brick-bot-mid'),
            solid()
        ],
        ']': [
            sprite('brick-right'),
            solid()
        ],
        '(': [
            sprite('brick-one'),
            solid()
        ],
        ')': [
            sprite('brick-one'),
            solid()
        ],
        any(s) {
            const sign = signs[s];
            if (sign) {
                return [
                    sprite(sign.sprite),
                    'sign',
                    {
                        msg: sign.msg
                    },
                ];
            }
        },
    });

    let talking = null;

    function talk(msg) {
        talking = add([
            text(msg, 7, {
                width: 200
            }),
            layer('ui'),
            pos(50, 130)
        ]);
    };

    overlaps('sign', 'player', (sign, player) => {
        readd(player);
        every('sign', (sign) => {
            sign.solid = false;
        });
        if (talking) {
            destroy(talking);
            talking = null;
        } else {
            talk(sign.msg);
        }
    });
    
    //////////////////////////////////////////////////////////
    //                      CONTROLS                        //
    /////////////////////////////////////////////////////////
    // restarts game
    keyPress('r', () => {
        play('blip', {
            volume: 1.0
        });
        go('game', 0);
    });
    // go to menu
    keyPress('escape', () => {
        play('blip', {
            volume: 1.0
        });
        go('main', 0);
    });

    keyDown([left, right], () => {
        if (player.grounded() && player.curAnim() !== 'move') {
            player.play('move');
        }
    });

    keyRelease([left, right], () => {
        if (!keyIsDown(right) && !keyIsDown(left)) {
            player.play('idle');
        }
    });

    keyDown(left, () => {
        player.flipX(-1);
        player.move(-player.speed, 0);
    });

    keyDown(right, () => {
        player.flipX(1);
        player.move(player.speed, 0);
    });

    // key is pressed, starts animation
    keyPress(jump, () => {
        if (player.grounded() && player.curAnim() !== 'jump') {
            play('hit', {
                volume: 1.0
            });
            player.play('jumpup');
            player.jump(player.jumpForce);
        }
    });

    // when key is released, stops animation
    keyRelease(jump, () => {
        if (!keyIsDown('space') && !keyIsDown('up') && !keyIsDown('w')) {
            player.play('idle');
        }
    });
});

// start the game
start("splash");