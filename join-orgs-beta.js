var tap = require('tap');
var urlOf = require('./lib/url');
var P = require('bluebird');

require('./lib/sharedNemo').then(function(nemo) {
  nemo.state.desiredUsername = 'test-org-' + Date.now();

  require('./signup');
  require('./logout');

  tap.test('join beta', {
    bail: true
  }, async function(t) {
      try {
        await nemo.driver.get(urlOf('/orgs?join-beta'));
        await nemo.view.login.nameWaitVisible();
        await nemo.view.login.name().sendKeys(nemo.state.username);
        await nemo.view.login.password().sendKeys('test123');
        await nemo.view.login.loginButton().click();
        await nemo.view.nav.usernameWaitVisible();
        await nemo.view.org.bannerInfoTextEquals('Organizations are here!')
        t.ok();
      } catch (e) {
        t.error(e);
      }

      t.end();
  });
});
