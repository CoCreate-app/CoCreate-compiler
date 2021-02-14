import CoCreateSocket from "./socket.js"
import {getCommonParams, getCommonParamsExtend, generateSocketClient} from "./common-fun.js"

const CoCreateMessage = {

 /*
 CoCreate.sendMessage({
    namespace: '',
    room: '',
    broadcast: true/false,
    broadcast_sender: true/false
    
    rooms: [r1, r2],
    emit: {
      message': 'nice game',
      data': 'let's play a game ....'
    }
  })
 */
 send: function(data) {
    let request_data = getCommonParams();
    
    if (!data || !data.emit) {
      return;     
    }
    request_data = {...request_data, ...data}
    
    /** socket parameters **/
    // if (data['broadcast'] === undefined) {
    //   request_data['broadcast'] = true;
    // }
    // if (data['broadcast_sender'] === undefined) {
    //   request_data['broadcast_sender'] = true;
    // }
    const room = generateSocketClient(data.namespace, data.room);
    
    CoCreateSocket.send('sendMessage', request_data, room)
 },
 
 receive: function(message, fun) {
   CoCreateSocket.listen(message, fun);
 },
}

export default CoCreateMessage;

