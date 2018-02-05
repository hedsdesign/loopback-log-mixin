'use strict';

module.exports = function (app) {

  function injectIp(ctx, next) {
    var options = ctx.args.options || {};
    if (options && !options.ip) {
      options.ip = ctx.req.header('x-forwarded-for') || ctx.req.connection.remoteAddress;
      ctx.args.options = options;
    }
    next();
  }
  
  app.remotes().before('*.*', injectIp);

  app.remotes().before('*.prototype.*', function (ctx, instance, next) {
    if (typeof instance === 'function') next = instance;
    injectIp(ctx, next);
  });

};
