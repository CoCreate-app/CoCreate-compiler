// ***********   define variables end ***************** /// 

import CoCreateSocket from "./socket.js"
import {getCommonParams, getCommonParamsExtend, generateSocketClient} from "./common-fun.js"

const CoCreateCRUD = {

  /*
   
    CoCreate.readDcoumentList {
      collection: "modules",
      element: "xxxx",
      metadata: "",
      operator: {
        fetch: {
          name: 'xxxx',
          value: 'xxxxx'
        },
        filters: [{
          name: 'field1',
          operator: "contain | range | eq | ne | lt | lte | gt | gte | in | nin",
          value: [v1, v2, ...]
        }, {
          name: "_id",
          opreator: "in",
          value: ["id1"]
        }, {
          ....
        }],
        orders: [{
          name: 'field-x',
          type: 1 | -1
        }],
        search: {
          type: 'or | and',
          value: [value1, value2]
        },
        
        startIndex: 0 (integer),
        count: 0 (integer)
      },
      
      is_collection: true | false,
      //. case fetch document case
      created_ids : [id1, id2, ...],
      
      
      -------- additional response data -----------
      data: [] // array
    }
  */
  
  readDocumentList(info){
    if( !info ) return;
    let request_data = getCommonParams();
    
    if (!info.collection || !info.operator) {
      return;
    }
    
    request_data = {...request_data, ...info};
    
    CoCreateSocket.send('readDocumentList', request_data);
  },
  
  
  /*
  CoCreate.createDocument({
    namespace:'',
    room:'',
    broadcast: true/false, (default=ture)
    broadcast_sender: true/false, (default=true) 
    
    collection: "test123",
    data:{
    	name1:“hello”,
    	name2:  “hello1”
    },
    element: “xxxx”,
    metaData: "xxxx"
  }),
  */
  // data param needs organization_id field added to pass security check
  createDocument: function(info) {
    if (info === null) {
      return;
    }
    let request_data = getCommonParams()
    request_data['collection'] = info['collection'] || 'module_activities';
    
    let data = info.data || {};
    
    if (!data['organization_id']) {
      data['organization_id'] = config.organization_Id
    }
    if (info['data']) {
      data = {...data, ...info['data']}
    }
    request_data['data'] = data;
    if (info['metadata']) {
      request_data['metadata'] = info['metadata']
    }
    
    request_data['element'] = info['element'];
    
    /** socket parameters **/
    // if (info['broadcast'] === undefined) {
    //   request_data['broadcast'] = true;
    // }
    // if (info['broadcast_sender'] === undefined) {
    //   request_data['broadcast_sender'] = true;
    // }
    
    const room = generateSocketClient(info.namespace, info.room);
    CoCreateSocket.send('createDocument', request_data, room);
  },
  

  

  /*
  CoCreate.updateDocument({
    namespace: '',
    room: '',
    broadcast: true/false,
    broadcast_sender: true/false,
    
    collection: "test123",
    document_id: "document_id",
    data:{
    	name1:“hello”,
    	name2:  “hello1”
    },
    delete_fields:["name3", "name4"],
    element: “xxxx”,
    metaData: "xxxx"
  }),
  */
  updateDocument: function(info) {
    if( !info || !info['document_id'] ) return;
    
    let request_data = getCommonParamsExtend(info);
    
    request_data['collection'] = info['collection'] || 'module_activities';
    request_data['document_id'] = info['document_id'];
    
    if( typeof info['data'] === 'object' ) request_data['set'] = info['data'];
    if( Array.isArray(info['delete_fields']) ) request_data['unset'] = info['delete_fields'];
    
    if(!request_data['set'] && !request_data['unset']) return;
    
    request_data['element'] = info['element'];
    request_data['metadata'] = info['metadata'];
    
    if (info.upsert) {
      request_data['upsert'] = true;
    }
    
    if (info.broadcast === false) {
      request_data['broadcast'] = false;
    }
    
    /** socket parameters **/
    // if (info['broadcast'] === undefined) {
    //   request_data['broadcast'] = true;
    // }
    request_data['broadcast_sender'] = info.broadcast_sender;
    if (info['broadcast_sender'] === undefined) {
      request_data['broadcast_sender'] = true;
    }
    
    const room = generateSocketClient(info.namespace, info.room);
    CoCreateSocket.send('updateDocument', request_data, room);
  },
  
  
  /*
  CoCreate.readDocument({
    collection: "test123",
    document_id: "document_id",
    element: “xxxx”,
    metaData: "xxxx",
    exclude_fields: [] 
  }),
  */
  readDocument: function(info) {
    if (info === null) {
      return;
    }
    if (!info['document_id'] || !info) {
      return;
    }
    
    let request_data = getCommonParams();
    request_data['collection'] = info['collection'];
    request_data['document_id'] = info['document_id'];
    if (info['exclude_fields']) {
      request_data['exclude_fields'] = info['exclude_fields'];
    }
    
    if (info['element']) {
      request_data['element'] = info['element'];
    }
    
    request_data['metadata'] = info['metadata']
    CoCreateSocket.send('readDocument', request_data);
  },
  
  
  /*
  CoCreate.deleteDocument({
    namespace: '',
    room: '',
    broadcast: true/false,
    broadcast_sender: true/false,
    
    collection: "module",
    document_id: "",
    element: “xxxx”,
    metadata: "xxxx"
  }),
  */
  deleteDocument: function(info) {
    if (!info['document_id'] || !info) {
      return;
    }
    
    let request_data = getCommonParams();
    request_data['collection'] = info['collection'];
    request_data['document_id'] = info['document_id'];
    
    if (info['element']) {
      request_data['element'] = info['element'];
    }
    
    request_data['metadata'] = info['metadata']
    
    /** socket parameters **/
    // if (info['broadcast'] === undefined) {
    //   request_data['broadcast'] = true;
    // }
    // if (info['broadcast_sender'] === undefined) {
    //   request_data['broadcast_sender'] = true;
    // }
    
    const room = generateSocketClient(info.namespace, info.room);
    CoCreateSocket.send('deleteDocument', request_data, room);
  },


 /** export / import db functions **/
 
   /*
  readDocument({
    collection: "test123",
    element: “xxxx”,
    metaData: "xxxx",
  }),
  */
  exportCollection: function(info) {
    if (info === null) {
      return;
    }

    let request_data = getCommonParams();
    request_data['collection'] = info['collection'];
    request_data['export_type'] = info['export_type'];

    request_data['metadata'] = info['metadata']
    CoCreateSocket.send('exportDB', request_data);
  },
  
  /*
  readDocument({
    collection: "test123",
    file: file
  }),
  */
  importCollection: function(info) {
    const {file} = info;
    if (info === null || !(file instanceof File)) {
      return;
    }

    const extension = file.name.split(".").pop();
    
    if (!['json','csv'].some((item) => item === extension)) {
      return;
    }
    
    let request_data = getCommonParams()
    request_data['collection'] = info['collection']
    request_data['import_type'] = extension;
    CoCreateSocket.send('importDB', request_data)
    CoCreateSocket.sendFile(file);
  },
  
  
  //. message listener
  listenMessage: function(message, fun) {
    CoCreateSocket.listen(message, fun);
  },
  
  listenerReadDocument: function(fun) {
    CoCreateSocket.listen("readDocument", fun);
  },
  listenerCreateDocument: function(fun) {
    CoCreateSocket.listen("createDocument", fun);
  },
  listenerDeleteDocument: function(fun) {
    CoCreateSocket.listen("deleteDocument", fun);
  },
  listenerUpdateDocument: function(fun) {
    CoCreateSocket.listen("updateDocument", fun);
  },
  listenerReadDocumentList: function(fun) {
    CoCreateSocket.listen("readDocumentList", fun);
  },

}

export default CoCreateCRUD;

