/**
 * This script will extract selected properties of the svg to json
 * by Ezzat Chamudi
 */

const path = require('path');
const fs = require('fs');
const xml2json = require('xml2json');

let files = fs.readdirSync('./kanji/');

// Only svg files
files = files.filter((el) => el.slice(-3) === 'svg');

// Properties to be kept
const props = new Set(['g', 'kvg:element', 'kvg:original', 'kvg:variant', 'kvg:partial', 'kvg:radical', 'kvg:phon']);

// Traversing the json tree from xml2json
function traverse(node) {
    Object.keys(node).forEach((key) => {
        if(!props.has(key)) delete node[key];
    });

    if (node['g']) {
        node['g'].forEach(element => {
            traverseG(element);
        });
    } else {
        return;
    }
};

// Execute
files.forEach((fileName, index) => {
    const data = fs.readFileSync(path.join('./kanji/', fileName), 'utf8');
    const svgObj = xml2json.toJson(data, {
        object: true,
        arrayNotation: true,
    });

    const root = svgObj.svg[0].g[0];
    traverse(root);

    fs.writeFileSync(path.join('./json/', fileName + '.json'), JSON.stringify(root, null, 2), function(err) {
        if (err) {
            console.log(err);
        }
    });
});