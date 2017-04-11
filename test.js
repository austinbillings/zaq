var zaq = require('./zaq.js');

var sampleJSON = {
  propName: {
    value: true,
    count: 100,
    example: true
  },
  otherProp: "String LOL",
  thirdThing: null
};

zaq.space('I\'m a .space()');
zaq.win('I\'m a win!', sampleJSON);
zaq.err('Oh no! I\'m an error. :(', sampleJSON);
zaq.info('Some info here!', sampleJSON);
zaq.warn('WATCH OUT FOR THAT SHIT.', sampleJSON);
zaq.time('TIME TICKER', sampleJSON);
zaq.space('I\'m a .space()');
zaq.divider('I\'m a divider.');
zaq.space('I\'m a .space()');
zaq.divider('I\'m a CUSTOM DIVIDER!!!', '~*$');
zaq.space('I\'m a .space()');
zaq.obj(sampleJSON);
zaq.win('I\'m a win!');
zaq.err('Oh no! I\'m an error. :(');
zaq.info('Some info here!');
zaq.warn('WATCH OUT FOR THAT SHIT.');
zaq.info('Hopefully an undefined property', sampleJSON.amvadmb);
zaq.time('TIME TICKER');
zaq.divider("Check sizes...");
zaq.weight(__dirname, 'yarn.lock');
zaq.weight(__dirname, 'madeup.js');