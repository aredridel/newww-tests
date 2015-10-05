#!/usr/bin/env node -r babel/register
import tap from 'tap';
import urlOf from './lib/url';
import pass from './lib/pass';

tap.test("Sign up a user", async function(t) {
  try {
    var nemo = await require('./lib/sharedNemo');
    var desiredUsername = nemo.state.desiredUsername || 'test-' + Date.now();
    t.pass("Signing up " + desiredUsername);
    await nemo.driver.get(urlOf('/'));
    await nemo.view.nav.signupLink().click();
    await nemo.view.signup.usernameWaitVisible().sendKeys(desiredUsername);
    await nemo.view.signup.password().sendKeys('test123');
    await nemo.view.signup.verify().sendKeys('test123');
    await nemo.view.signup.email().sendKeys('blackhole+' + desiredUsername + '@npmjs.com');
    await nemo.view.signup.makeItSo().click();
    await nemo.view.page.h1WaitVisible();
    await nemo.view.page.h1TextEquals("edit your profile").then(t.pass);
    var text = await nemo.view.nav.username().getText();
    t.ok(text, 'username is shown');
    nemo.state.username = text;
    t.pass("signed up " + text);
  } catch (error) {
    t.error(error);
    t.bailout();
  }
  t.end();
});
