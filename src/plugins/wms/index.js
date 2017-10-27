import axios from 'axios';

import app from 'app';
import ol from 'ol-all';


async function request(params) {
    let res = await axios.get(app.config.str('wms.server'), {params})
    return ol.xml.parse(res.data);
}

async function describe() {
    let descDoc = await request({
        'SERVICE': 'WMS',
        'VERSION': '1.3',
        request: 'GetCapabilities',
    });

    return descDoc;
}

function children(el, tag) {
    return [...el.childNodes].filter(e => e.nodeName === tag);
}

function child(el, tag) {
    let cn = children(el, tag);
    if (cn.length !== 1)
        return null;
    return cn[0];
}

function get(el, tags) {
    for (let tag of tags.match(/\w+/g)) {
        if (!el)
            return null;
        el = child(el, tag);
    }

    return el;
}


function getText(el, path) {
    el = get(el, path);
    return el && el.firstChild ? el.firstChild.nodeValue : '';
}


function imgLoad(image, src) {
    //let u = new URL(src), s = u.searchParams;
    //console.log('loading', `${s.get('LAYERS')} -- ${s.get('WIDTH')}x${s.get('HEIGHT')} -- ${s.get('BBOX')}`)
    image.getImage().src = src;
}

function parseLayer(el) {
    let opts = {
        name: getText(el, 'Title'),
        wmsName: getText(el, 'Name'),
        wmsLegendURL: getText(el, 'Style LegendURL OnlineResource')
    };

    let sub = children(el, 'Layer');

    if (sub.length) {
        return new ol.layer.Group({
            ...opts,
            type: 'WMSGroup',
            layers: sub.reverse().map(parseLayer)
        });
    }

    opts.source = new ol.source.ImageWMS({
        url: app.config.str('wms.server'),
        params: {
            LAYERS: opts.name
        },
        ratio: 1,
        preload: 0,
        imageLoadFunction: imgLoad
    });

    return new ol.layer.Image({
        ...opts,
        type: 'WMSImage'
    });
}

function parseLayers(doc) {
    let root,
        layers = children(child(doc, 'Capability'), 'Layer').map(parseLayer);


    if (!layers.length) {
        return null;
    }

    if (layers.length === 1) {
        root = layers[0];
    } else {
        root = new ol.layer.Group({
            name: 'WMS',
            layers
        });

    }

    root.set('type', 'WMSRoot');
    return root;
}


class Plugin extends app.Plugin {

    async init() {
        let descDoc = await describe();
        let root = parseLayers(descDoc.firstChild);
        if (root) {
            root.setZIndex(1);
            app.map().addLayer(root);
        }
    }
}

export default {
    Plugin

};
