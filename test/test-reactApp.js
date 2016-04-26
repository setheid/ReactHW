var React = require('react');
var expect = require('chai').expect;
var enzyme = require('enzyme');
var shallow = enzyme.shallow;
var mount = enzyme.mount;
var render = enzyme.render;
var App = require('../build/app');

describe("A suite", function() {
  it("contains spec with an expectation", function() {
    expect(shallow(<App />).contains(<main className="reactApp" />)).to.equal(true);
  });

  it("contains spec with an expectation", function() {
    expect(shallow(<App />).is('.reactApp')).to.equal(true);
  });

  it("contains spec with an expectation", function() {
    expect(mount(<App />).find('.reactApp').length).to.equal(1);
  });
});
