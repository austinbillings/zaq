const zaq = require('../..');
console.log();
zaq.fatal('Universe-ending exception encountered.', { detail: 'someDetail', executionTime: 1200, sessionId: 'someSessionId_10101010' });

setTimeout(() => null, 5000);
