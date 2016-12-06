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

zaq.log('I\'m a log.');
zaq.win('I\'m a win!');
zaq.err('Oh no! I\'m an error. :(');
zaq.info('Some info here!');
zaq.warn('WATCH OUT FOR THAT SHIT.');
zaq.time('This thing took 10 seconds.');
zaq.divider('I\'m a divider.');
zaq.divider('I\'m a divider too!', '~');
zaq.json('I\'m JSON with a label', sampleJSON);

var cloq = new zaq.cloq('Timerunner');
cloq.lap('Nothing really');
setTimeout(function () {
  cloq.lap('still going!');
  setTimeout(function () {
    cloq.lap('another thing');
    cloq.done();
  }, 1404);
}, 3000);
