module.exports = {
    'plugins': ['plugins/markdown'],
    'recurseDepth': 10,
    'source': {
        'include': ['./src'],
        'includePattern': '\\.(js|jsdoc)$',
        'excludePattern': 'ol-all'
    },
    'sourceType': 'module',
    'tags': {
        'allowUnknownTags': true,
        'dictionaries': ['jsdoc']
    },
    'templates': {
        'cleverLinks': false,
        'monospaceLinks': false
    },
    'opts': {
        'template': 'node_modules/minami',
        'encoding': 'utf8',
        'destination': './doc/',
        'recurse': true,
        'readme': './README.md'
    }
    
};

