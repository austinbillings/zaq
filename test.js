var zaq = require('./zaq.js')();

var sampleJSON = {
  propName: {
    value: true,
    count: 100
  },
  otherProp: "String LOL",
  thirdThing: null
};

var sampleJSONShort ={
  message: 'SeatAllocationOverflow',
  timeout: '3000ms'
}

// zaq.space('I\'m a .space()');
// zaq.win('I\'m a win!', sampleJSON);
// zaq.err('Oh no! I\'m an error. :(', sampleJSON);
// zaq.info('Some info here!', sampleJSON);
// zaq.warn('WATCH OUT FOR THAT SHIT.', sampleJSON);
// zaq.time('TIME TICKER', sampleJSON);
// zaq.space('I\'m a .space()');
// zaq.divider('I\'m a divider.');
// zaq.space('I\'m a .space()');
// zaq.divider('I\'m a CUSTOM DIVIDER!!!', '~*$');
// zaq.space('I\'m a .space()');
// zaq.obj(sampleJSON);
zaq.win('Fetching resources was successful.');
zaq.err('An Error Occurred in MyClass.js:', sampleJSONShort);
zaq.info('Recalculation of offset vector:', 41001284.4140014140000000);
zaq.warn('Possible corruption in files: ', ['_flush65286354.41589.flo', '_flush65485655.90508.flo']);
zaq.info('Hopefully an undefined property', sampleJSON.amvadmb);
zaq.time('50ms elapsed.');
zaq.debug('Some debug info...');
zaq.flag('lol test');
zaq.divider("Check sizes...", { space: 2, lineSymbol: ':', centered: true });
zaq.weight(__dirname, 'yarn.lock');
zaq.weight(__dirname, 'madeup.js');
