/**
 * Created by jin
 * 2020-04-03
 */

const CoCreateUtils = {
  generateUUID: function (length = 36) {
    // if (length == 10) {
    //   var result           = '';
    //   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    //   var charactersLength = characters.length;
    //   for ( var i = 0; i < length; i++ ) {
    //     result += characters.charAt(Math.floor(Math.random() * charactersLength));
    //   }

    //   var dd = new Date().toTimeString();
    //   var random = dd.replace(/[\W_]+/g, "").substr(0,6);
    //   result += random;
    //   return result;
    // }

    let d = new Date().getTime();
    let d2 =
      (window.performance &&
        window.performance.now &&
        window.performance.now() * 1000) ||
      0;
    let pattern = "uxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";

    if (length <= pattern.length) {
      pattern = pattern.substr(0, length);
    } else {
      let add_len = length - pattern.length;
      let sub_pattern = "-xxxyyxxx";

      let group_n = Math.floor(add_len / sub_pattern.length);

      for (let i = 0; i < group_n; i++) {
        pattern += sub_pattern;
      }

      group_n = add_len - group_n * sub_pattern.length;
      pattern += sub_pattern.substr(0, group_n);
    }

    let uuid = pattern.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16;
      if (d > 0) {
        var r = (d + r) % 16 | 0;
        d = Math.floor(d / 16);
      } else {
        var r = (d2 + r) % 16 | 0;
        d2 = Math.floor(d2 / 16);
      }
      return (c == "x" ? r : (r & 0x7) | 0x8).toString(16);
    });
    return uuid;
  },

  isRealTime: function (element, parent_realTime) {
    let realtime = element.getAttribute("data-realtime") || parent_realTime;
    if (realtime === "false") {
      return false;
    }

    return true;
  },

  getParentFromElement: function (element, parent_class, attributes) {
    if (parent_class) {
      if (element.classList.contains(parent_class)) {
        return element;
      }

      let node = element.parentNode;
      while (node != null && node.classList) {
        if (node.classList.contains(parent_class)) {
          return node;
        }
        node = node.parentNode;
      }
    } else if (attributes) {
      if (attributes.every((attr) => element.attributes.hasOwnProperty(attr))) {
        return element;
      }

      let node = element.parentNode;
      while (node != null && node.attributes) {
        if (attributes.every((attr) => node.attributes.hasOwnProperty(attr))) {
          return node;
        }
        node = node.parentNode;
      }
    }

    return false;
  },

  isReadValue: function (element) {
    return element.getAttribute("data-read_value") != "false";
  },
  
  isUpdateValue: function(element) {
  	return element.getAttribute("data-update_value") != "false";
  },

  isJsonString: function (str_data) {
    try {
      let json_data = JSON.parse(str_data);
      if (typeof json_data === "object" && json_data != null) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  },

  getAttributes: function (element) {
    return element.getAttributeNames().reduce((attrMap, name) => {
      attrMap[name] = element.getAttribute(name);
      return attrMap;
    }, {});
  },

  checkValue: function (value) {
    if (!value) return false;
    if (/{{\s*([\w\W]+)\s*}}/g.test(value)) {
      return false;
    }

    return true;
  },
  // hosseins utills

  // function to go through all frames
  allFrame: function allFrame(callback) {
    let allFrames = [{ document, window }];
    for (let frame of document.querySelectorAll("iframe")) {
      let frameDocument = frame.contentDocument || frame.contentWindow.document;
      let frameWindow = frame.contentWindow;
      allFrames.push({
        document: frameDocument,
        window: frameWindow,
        frameElement: frame,
      });
    }
    let result = new Set();
    for (let frame of allFrames) {
      let callbackResult = callback(frame);
      if (
        callbackResult &&
        typeof callbackResult[Symbol.iterator] === "function"
      )
        callbackResult.forEach((el) => result.add(el));
      else if (callbackResult) result.add(callbackResult);
    }

    return Array.from(result);
  },

  cssPath: function cssPath(node) {
    let pathSplits = [];
    do {
      if (!node || !node.tagName) return false;
      let pathSplit = node.tagName.toLowerCase();
      if (node.id && node.tagName !== "BODY") pathSplit += "#" + node.id;

      if (node.classList.length && node.tagName !== "BODY") {
        node.classList.forEach((item) => {
          if (item.indexOf(":") === -1) pathSplit += "." + item;
        });
      }

      if (node.tagName !== "BODY" && node.parentNode) {
        let index = Array.prototype.indexOf.call(
          node.parentNode.children,
          node
        );
        pathSplit += `:nth-child(${index + 1})`;
      }

      pathSplits.unshift(pathSplit);
      node = node.parentNode;
    } while (node.tagName !== "HTML");

    return pathSplits.join(" > ");
  },

  getTopMostWindow: function getTopMostWindow() {
    let parentWindow = window;
    while (parentWindow !== window.parent) parentWindow = window.parent;
    return parentWindow;
  },

  findIframeFromElement: (windowObject, element) => {
    let frameElement;
    CoCreate.utils.allFrame((frame) => {
      if (frame.document.contains(element)) frameElement = frame.frameElement;
      // window.cc.findIframeFromElement(frame.window, element);
    });
    return frameElement;
  },

  getIframeFromPath: function getIframeFromPath(path) {
    let topWindow = CoCreate.utils.getTopMostWindow;

    path.forEach((selector) => {
      if (topWindow) topWindow = topWindow.querySelector(selector);
    });
    return topWindow;
  },
  // DO NOT REMOVE
  
  // configMatch: function* configMatch(elementConfig, element) {
  //   for (let config of elementConfig) {
  //     // if (!Array.isArray(config.selector))
  //     //   config.selector = [config.selector];

  //     if (config.selector && element.matches(config.selector)) yield config;
  //   }
  //   return;
  // },
  configMatch2: function configMatch(elementConfig, element) {
    let result = [];
    for (let config of elementConfig) {
      if (config.selector && element.matches(config.selector)) result.push(config);
    }
    return result;
  },
  
  // DO NOT REMOVE

  configExecuter: function configExecuter(element, key, success) {
    for (let config of CoCreate.utils.configMatch2(window.elementConfig, element))
      if (config[key] === true) return success(element, config);
      else if (config[key] === false) return false;
      else if (config[key] === undefined) continue;
      else if (CoCreate.utils.isValidSelector(config[key]))
        return success(element, config, true);
      else console.warn("builder: wrong element config ", config);

    return false;
  },

  UUID: function UUID(length = 10) {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    var d = new Date().toTimeString();
    var random = d.replace(/[\W_]+/g, "").substr(0, 6);
    result += random;
    return result;
  },

  parseTextToHtml: function parse(text) {
    let doc = new DOMParser().parseFromString(text, "text/html");
    if (doc.head.children[0]) return doc.head.children[0];
    else return doc.body.children[0];
  },

  splitBydelimiter: function parse(str, delimiter) {
    return str.split(delimiter).map((s) => s.trim());
  },

  joinBydelimiter: function parse(str, delimiter) {
    return str.map((s) => s.trim()).join(delimiter);
  },

  isValidSelector: (selector) => {
    try {
      document.createDocumentFragment().querySelector(selector);
    } catch (error) {
      return false;
    }
    return true;
  },

  getElementPath: function getElementPath(element, returnContext) {
    let path = [];

    let topWindow = window;
    let iframeElement = CoCreate.utils.findIframeFromElement(topWindow, element);
    let p = CoCreate.utils.cssPath(iframeElement);
    if (p) path.unshift(p);

    return returnContext ? { path, document: iframeElement || document } : path;
    //todo: support for nested iframe
    // while(iframeElement !== findIframeFromElement(topWindow,iframeElement))
    // {
    //   iframeElement = findIframeFromElement(topWindow,iframeElement);
    //   path.unshift(cssPath(iframeElement))
    // }
  },
};

export default CoCreateUtils;
