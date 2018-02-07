[![NPM](https://nodei.co/npm/@hedsdesign/loopback-log-mixin.png?stars&downloads)](https://nodei.co/npm/@hedsdesign/loopback-log-mixin/)

Loopback Log Mixin
=============
Este módulo foi projetado para o framework [Strongloop Loopback](https://github.com/strongloop/loopback). Ele fornece funcionalidade de inserção de logs em uma tabela específica, além de adicionar as porpriedades no registro com informações de criação e alteração com data, horário e ip.

#### INSTALAÇÃO

```bash
  npm install --save @hedsdesign/loopback-log-mixin
```

#### ADICIONANDO MIXIN E MODELS
Com [loopback-boot@v2.8.0](https://github.com/strongloop/loopback-boot/) [mixinSources](https://github.com/strongloop/loopback-boot/pull/131) foram implementado de forma que permita carregar este mixin sem alterações no arquivo `server.js` previamente requerido.

Adicione as propriedade `sources` e `mixins` e a tabela de log no arquivo `server/model-config.json` como a seguir:

```js
{
  "_meta": {
    "sources": [
      ...
      "../node_modules/@hedsdesign/loopback-log-mixin/dist/models",
    ],
    "mixins": [
     ...
      "../node_modules/@hedsdesign/loopback-log-mixin/dist/mixins"      
    ]
  },....
  "Log": {
    "dataSource": "db",
    "public": false
  },
}
```

Note que você pode adapta-lo a sua solução, como definir um datasource diferente.

Outro ajuste necessário principalmente para o funcionamento da obtenção do endereço de IP precisa fazer um ajuste no boot da aplicação no arquivo `server.js`

```js
var bootOptions = {
  "appRootDir": __dirname,
  "bootDirs": [__dirname + '/../node_modules/@hedsdesign/loopback-log-mixin/dist/boot']
};

boot(app, bootOptions, function (err) {
   ...
});
```

IMPORTANDO O MIXIN
========

Você apenas deverá adicionar o mixin a sua tabela (model)  como o exemplo:

```js
"mixins": {
    "Log": true    
  }
```

ou ajustando com as opções disponíveis como no exemplo:

```js
"mixins": {
    "Log": {
        "dataCriacao": "dataCriacao",
        "usuarioCriacao": "usuarioCriacao",
        "usuarioCriacaoIp": "usuarioCriacaoIp",
        "dataAlteracao": "dataAlteracao",
        "usuarioAlteracao": "usuarioAlteracao",
        "usuarioAlteracaoIp": "usuarioAlteracaoIp",
        "inserirLog": true,
        "tabelaLog": "Log",
        "tabelaTabela": "tabela",
        "tabelaItemId": "itemId",
        "tabelaData": "data",
        "tabelaAntes": "antes",
        "tabelaDepois": "depois",
        "tabelaMudancas": "mudancas",
        "tabelaUsuarioId": "usuarioId",
        "tabelaIp": "ip",
        "silenceWarnings": false,
    }    
  }
```

LICENÇA
=============
[MTI](LICENSE)



