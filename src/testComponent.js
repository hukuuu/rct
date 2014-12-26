var React = require('react');
console.log(2);
var Component = React.createClass({
  getInitialState: function() {
    return {
      world: 'world!'
    }
  },
  render: function() {
    return <div>Hello {this.state.world}</div>;
  }
})

module.exports = Component;
