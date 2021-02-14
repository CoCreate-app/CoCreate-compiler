// ***********   define variables end ***************** /// 

import CoCreateSocket from "./socket.js"


const CoCreateCore = {
  socketInitFuncs: [],
  moduleSelectors: [],
  host: 'server.cocreate.app',
  
  init: function(host, namespace) {
    if (host) {
      this.host = host;
    }
    
    this.__setConfig()
    this.createGeneralSocket(host, namespace || config.organization_Id);
    this.initSocketListener();
    this.createUserSocket(host);
  },
  
  __setConfig: function() {
		let orgId = window.localStorage.getItem('organization_id');
		let securityKey = window.localStorage.getItem('securityKey');
		let apiKey = window.localStorage.getItem('apiKey');
		
		if (orgId)        config['organization_Id'] = orgId
		if (apiKey)       config['apiKey'] = apiKey
		if (securityKey)  config['securityKey'] = securityKey;
  },
  
  initSocketListener: function() {
    const self = this;
    
    CoCreateSocket.listen('connect', function (data, room) {
      
      if (room == CoCreateSocket.getGlobalScope()) {
        self.socketInitFuncs.forEach((func) => {
          func.initFunc.call(func.instance);
        })
      }
    })
    
    CoCreateSocket.listen('readDocument', function(data){
      const metadata = data.metadata;
      // if (metadata && metadata.type == 'crdt') {
      //   self.initRenderCrdtData(data);
      // } else {
      //   // self.renderModules(data)
      // }
      return data;
    })
    
    CoCreateSocket.listen('updateDocument', function(data) {
      // self.renderModules(data)
    })
    
    CoCreateSocket.listen('deletedDocument', function(data) {
      console.log(data);
    })
    
    CoCreateSocket.listen('sendMessage', function(data) {
      console.log(data);
    })
    
    this.listenMessage('downloadFileInfo', function(data) {
      CoCreateSocket.saveFileName = data.file_name;
    })
    
  },
  
  createUserSocket: function(host) {
    var user_id = window.localStorage.getItem('user_id');
    if (user_id) {
      CoCreateSocket.create({
        namespace: 'users',
        room: user_id,
        host: host
      })
    }
  },
  
  createGeneralSocket: function(host, namespace) {
    if (namespace) {
    	CoCreateSocket.create({
    	  namespace: namespace, 
    	  room: null,
    	  host: host
    	});
    	CoCreateSocket.setGlobalScope(namespace);
    } else {
    	CoCreateSocket.create({
    	  namespace: null, 
    	  room: null,
    	  host: host
    	});
    }
  },
  
  registerInit: function(initFunc, instance) {
    this.socketInitFuncs.push({
      initFunc,
      instance : instance || window
    });
  },
  // registerSelector: function(selector) {
  //   if (this.moduleSelectors.indexOf(selector) === -1) {
  //     this.moduleSelectors.push(selector);
  //   }
  // },
  
  // getSelectors: function(selector) {
  //   return this.moduleSelectors.join(",");
  // },

  listenMessage: function(message, fun) {
    CoCreateSocket.listen(message, fun);
  },
 
 createSocket: function(config) {
   CoCreateSocket.create(config);
 },
 
 destroySocket: function(config) {
   const {namespace, room} = config;
   const key = CoCreateSocket.getKey(namespace, room);
   let socket = CoCreateSocket.sockets.get(key);
   
   if (!socket) {
     return
   }
   CoCreateSocket.destroy(socket, key);
 },
}

export default CoCreateCore;

