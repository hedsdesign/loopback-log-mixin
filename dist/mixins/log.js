'use strict';
var _ = require('lodash');

const debug = (valor) => {
  //console.log(`log`, valor)
};
const warn = (options, message) => {
  if (!options.silenceWarnings) {
    console.warn(message);
  }
};

module.exports = (Model, bootOptions = {}) => {
  debug(`Mixin Log - ${Model.modelName}`);

  const options = Object.assign({
    dataCriacao: 'dataCriacao',
    usuarioCriacao: 'usuarioCriacao',
    usuarioCriacaoIp: 'usuarioCriacaoIp',
    dataAlteracao: 'dataAlteracao',
    usuarioAlteracao: 'usuarioAlteracao',
    usuarioAlteracaoIp: 'usuarioAlteracaoIp',
    inserirLog: true,
    tabelaLog: 'Log',
    tabelaTabela: 'tabela',
    tabelaItemId: 'itemId',
    tabelaData: 'data',
    tabelaAntes: 'antes',
    tabelaDepois: 'depois',
    tabelaMudancas: 'mudancas',
    tabelaUsuarioId: 'usuarioId',
    tabelaIp: 'ip',
    silenceWarnings: false,
  }, bootOptions);

  debug('options', options);

  //Define as propriedades
  Model.defineProperty(options.dataCriacao, {
    type: 'date'
  });
  Model.defineProperty(options.usuarioCriacao, {
    type: 'string'
  });
  Model.defineProperty(options.usuarioCriacaoIp, {
    type: 'string'
  });
  Model.defineProperty(options.dataAlteracao, {
    type: 'date'
  });
  Model.defineProperty(options.usuarioAlteracao, {
    type: 'string'
  });
  Model.defineProperty(options.usuarioAlteracaoIp, {
    type: 'string'
  });


  //Funções
  Model.getIp = (req) => {
    return req && req.ip || '0.0.0.0';
  }

  Model.getCurrentUserId = (req) => {
    return req && req.accessToken && req.accessToken.userId || 'anônimo';
  }

  Model.getAlteracoes = (o1, o2) => {
    o1 = JSON.parse(JSON.stringify(o1));
    o2 = JSON.parse(JSON.stringify(o2));
    var keys = _.union(_.keys(o1), _.keys(o2));
    var alteracoes = _.filter(keys, function (key) {
      return !_.eq(o1[key], o2[key]);
    })
    var alteracoes = _.remove(alteracoes, (x) => {
      return x != "id"
    });
    var alteracoes = _.remove(alteracoes, (x) => {
      return x != options.dataAlteracao
    });
    var alteracoes = _.remove(alteracoes, (x) => {
      return x != options.dataCriacao
    });
    var alteracoes = _.remove(alteracoes, (x) => {
      return x != options.usuarioCriacao
    });
    var alteracoes = _.remove(alteracoes, (x) => {
      return x != options.usuarioAlteracao
    });
    var alteracoes = _.remove(alteracoes, (x) => {
      return x != options.usuarioAlteracaoIp
    });
    var alteracoes = _.remove(alteracoes, (x) => {
      return x != options.usuarioCriacaoIp
    });
    return alteracoes;
  }

  Model.limpaPropriedades = (objeto) => {
    let obj = JSON.parse(JSON.stringify(objeto));
    delete obj[options.dataAlteracao];
    delete obj[options.dataCriacao];
    delete obj[options.usuarioAlteracao];
    delete obj[options.usuarioAlteracaoIp];
    delete obj[options.usuarioCriacao];
    delete obj[options.usuarioCriacaoIp];
    delete obj['id'];
    return obj;
  }

  //Events
  Model.observe('before save', (ctx, next) => {


    let ip = Model.getIp(ctx.options);
    let userId = Model.getCurrentUserId(ctx.options);

    if (ctx.instance) { //Novo Registro
      ctx.hookState.isNovo = true;
      // ctx.hookState.antes = Object.assign({}, ctx.instance);
      ctx.hookState.antes = JSON.parse(JSON.stringify(ctx.instance));
      ctx.instance[options.dataCriacao] = new Date();
      ctx.instance[options.dataAlteracao] = new Date();
      ctx.instance[options.usuarioCriacao] = userId;
      ctx.instance[options.usuarioAlteracao] = userId;
      ctx.instance[options.usuarioCriacaoIp] = ip;
      ctx.instance[options.usuarioAlteracaoIp] = ip;
      return next();

    } else { // Atualizando Registro
      ctx.hookState.isNovo = false;
      ctx.hookState.antes = JSON.parse(JSON.stringify(ctx.currentInstance));


      ctx.data[options.dataAlteracao] = new Date();
      ctx.data[options.usuarioAlteracao] = userId;
      ctx.data[options.usuarioAlteracaoIp] = ip;
      return next();

    }
  });

  Model.observe('after save', (ctx, next) => {
    // console.log('antes', ctx.hookState.isNovo, ctx.hookState.antes)

    if (options.inserirLog) {
      let registro = {};
      registro[options.tabelaData] = new Date();
      registro[options.tabelaAntes] = Model.limpaPropriedades(ctx.hookState.antes);
      registro[options.tabelaDepois] = Model.limpaPropriedades(ctx.instance);
      registro[options.tabelaIp] = Model.getIp(ctx.options);
      registro[options.tabelaItemId] = ctx.instance.id;
      registro[options.tabelaTabela] = Model.modelName;
      registro[options.tabelaUsuarioId] = Model.getCurrentUserId(ctx.options);
      registro[options.tabelaMudancas] = Model.getAlteracoes(ctx.hookState.antes, ctx.instance);

      Model.app.models[options.tabelaLog].create(registro, (err, obj) => {
        debug('Log Inserido');
        return next();
      })
      ctx.antes = ctx.instance;
    } else {
      return next();
    }

  });

};
