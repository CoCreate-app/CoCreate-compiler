import CoCreateJS from "../CoCreateJS/src/index.js"
import CoCreateObserver from "../CoCreate-components/CoCreate-observer/src/CoCreate-observer.js"
import CoCreateCSS from "../CoCreateCSS/src/CoCreateCSS.js"
import CoCreateAction from "./CoCreate-components/CoCreate-actions/src/CoCreate-actions.js"

// import CRDT from "./crdt.js"

const CoCreate = {
    socket: CoCreateSocket,
    crud:   CoCreateCRUD,
    utils:  CoCreateUtils,
    message: CoCreateMessage,
    observer: CoCreateObserver,
    action: CoCreateAction,
    
    
    addComponent: function(key, component) {
        this[key] = component;
    },
    removeComponent: function(key) {
        if (this[key]) {
            
        }
    }
}

// CoCreate.addComponent('crdt', CRDT);

CoCreate.core.init(window.config.host ? window.config.host : 'server.cocreate.app');

export default CoCreate;