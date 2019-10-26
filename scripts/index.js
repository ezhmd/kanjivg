/**
 * This script will extract selected properties of the svg to json
 * by Ezzat Chamudi
 */

const path = require('path');
const fs = require('fs');
const xml2json = require('xml2json');

let files = fs.readdirSync('./kanji/');
fs.mkdirSync('./json/', { recursive: true });

// Only svg files
files = files.filter((el) => el.slice(-3) === 'svg');

// Properties to be kept
const props = new Set(['g', 'kvg:element', 'kvg:original', 'kvg:variant', 'kvg:partial', 'kvg:radical', 'kvg:phon']);

// Delete unecessary props
function traverse(node) {
    Object.keys(node).forEach((key) => {
        if (!props.has(key)) {
            delete node[key];
        } else if (key.slice(0, 3) === 'kvg') {
            node[key.slice(4)] = node[key];
            delete node[key];
        }
    });

    if (node['g']) {
        node['g'].forEach(element => {
            traverse(element);
        });
    }

    return;
};

function deleteEmpties(node) {
    if (node.g) {
        // Delete empty object
        label_while:
        while (true) {

            label_for:
            for(let i = 0; i < node['g'].length; i++) {
                if(Object.keys(node['g'][i]).length === 0) {
                    node['g'].splice(i, 1);
                    continue label_while;
                }
            }

            break;
        }

        node['g'].forEach(element => {
            deleteEmpties(element);
        });

        if (node.g.length === 0) {
            delete node.g;
        }
    }

    return;
}


// Execute
files.forEach((fileNameSvg, index) => {
    const fileNameOnly = fileNameSvg.slice(0, fileNameSvg.length - 4);

    if (fileNameOnly.length !== 5) return;

    const data = fs.readFileSync(path.join('./kanji/', fileNameSvg), 'utf8');
    const svgObj = xml2json.toJson(data, {
        object: true,
        arrayNotation: true,
    });

    const root = svgObj.svg[0].g[0];
    traverse(root);
    deleteEmpties(root);

    // sort keys and convert to string
    let jsonString;
    if(root.g !== undefined) {
        jsonString = JSON.stringify(root.g[0], Object.keys(root.g[0]).sort(), 2);
    } else {
        jsonString = '{}';
    }

    fs.writeFileSync(path.join('./json/', fileNameOnly + '.json'), jsonString, function(err) {
        if (err) {
            console.log(err);
        }
    });
});

// '告'.charCodeAt().toString(16)
