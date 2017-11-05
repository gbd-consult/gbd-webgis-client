let conf = {
    'src_folders': [],
    'output_folder': './_test/reports',

    'selenium': {
        'start_process': false,
        'start_session': false
    },

    'test_settings': {
        'default': {},

        'unit': {},

        'func': {
            'selenium': {
                'start_process': false,
                'start_session': true
            },
            'selenium_port': 9515,
            'selenium_host': 'localhost',
            'default_path_prefix': '',
            'launch_url': 'http://localhost:8080',
            'screenshots': {
                'enabled': true,
                'path': './_test/img'
            },
            'desiredCapabilities': {
                'browserName': 'chrome',
                'chromeOptions': {
                    'args': ['--no-sandbox']
                },
                'acceptSslCerts': true
            }
        },

    }
};

module.exports = conf;

