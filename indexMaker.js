let { components } = require("./components");
const fs = require("fs");
let indexJs = '';
let nameList = [];

function toCamelCase(str) {
  let index = 0;
  do {
    index = str.indexOf("-", index);
    if (index !== -1) {
      let t = str.substring(0, index);
      t += String.fromCharCode(str.charCodeAt(index + 1) - 32);
      t += str.substr(index + 2);
      str = t;
    }
    else break;
  } while (true);
  return str;
}

function lowerCaseFirstChar(str) {
  return String.fromCharCode(str.charCodeAt(0) + 32) + str.substr(1);
}

for (let [name, path] of Object.entries(components)) {
  name = toCamelCase(name)
  if (name.startsWith('CoCreate')) {
    name = name.substr(8);
  }

  let componentName = toCamelCase(name);
  if (componentName.startsWith('CoCreate'))
    componentName = componentName.substr(8);

  if (componentName === componentName.toUpperCase())
    componentName = componentName.toLowerCase();
  else
    componentName = lowerCaseFirstChar(componentName);
  

  let libName = componentName ? componentName : 'CoCreate';

  if (componentName) {
    indexJs += `import ${libName} from '${path}';\r\n`
    nameList.push(libName)

  }
  else {
    indexJs += `import CoCreateJs from '${path}';\r\n`
    nameList.push('...CoCreateJs')
  }


}




indexJs += `

const CoCreate = { ${nameList.join(', ')} };
export default CoCreate;

`;


fs.writeFileSync('index.js', indexJs);
