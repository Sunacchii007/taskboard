   const test = require('node:test');
   const assert = require('node:assert');

   test('flaky: passes about 70% of the time', () => {
     assert.ok(Math.random() > 0.3, 'unlucky run');
   });