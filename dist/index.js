const deprecate = require('util');
const Log = require('./mixins/log');

export default deprecate(
  app => app.loopback.modelBuilder.mixins.define('Log', Log),
  'DEPRECATED: Use mixinSources, see https://github.com/jonathan-casarrubias/loopback-import-mixin#mixinsources'
);