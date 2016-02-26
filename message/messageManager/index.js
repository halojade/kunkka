var EventEmitter = require('events');
var util = require('util');

var novaMsgHandler = require('./nova');

function MessageManager () {
  EventEmitter.call(this);
  this.ignoreList = [
    'compute.instance.update',
    'scheduler.select_destinations.start',
    'scheduler.select_destinations.end'
  ];
}

util.inherits(MessageManager, EventEmitter);

MessageManager.prototype.msgDispatcher = function (ws, msg) {
  if (ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(msg));
  }
};

MessageManager.prototype.mqMessageListener = function (msg) {
  var msgContent = JSON.parse(msg.content.toString());
  if (this.isIgnoredMsg(msgContent)) {
    return;
  }
  var userId = msgContent._context_user_id;
  var projectId = msgContent._context_project_id;
  var formattedMsg = this.msgFormatter(msgContent);
  if (formattedMsg) {
    this.emit(userId + projectId, formattedMsg);
  }
};

MessageManager.prototype.msgFormatter = function (msg) {
  var ret;
  var eventTypeArray = msg.event_type.split('.');
  var type = eventTypeArray[0];
  switch (type) {
    case 'compute':
      ret = novaMsgHandler.formatter(msg, eventTypeArray);
      break;
    default:
      ret = null;
  }
  return ret;
};

MessageManager.prototype.isIgnoredMsg = function (msg) {
  if (this.ignoreList.indexOf(msg.event_type) > -1) {
    return true;
  } else {
    return false;
  }
};

module.exports = MessageManager;