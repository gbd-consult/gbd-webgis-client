let COLOR = require('material-ui/styles/colors');
let cm = require('material-ui/utils/colorManipulator');

let pal = {
    primary1Color: COLOR.lightBlue500,
    primary2Color: COLOR.lightBlue600,
    primary3Color: COLOR.blueGrey500,

    accent1Color: COLOR.deepPurpleA100,
    accent2Color: COLOR.deepOrangeA200,
    accent3Color: COLOR.grey500,

    textColor: COLOR.blueGrey500,
    secondaryTextColor: COLOR.grey200,
    alternateTextColor: COLOR.white,
};

module.exports = {
    palette: pal,
    gbd: {
        ui: {
            gutter: 12,

            statusbar: {
                height: 30,
                padding: 4,
                background: COLOR.blueGrey900,

                input: {
                    background: COLOR.blueGrey800,
                    color: COLOR.white,
                },

                label: {
                    background: 'transparent',
                    color: COLOR.blueGrey300,
                },

                link: {
                    color: COLOR.lightBlue50
                },

                separator: {
                    color: COLOR.blueGrey700
                }
            },

            sidebar: {
                largeWidth: 400,
                mediumWidth: 400,
                background: COLOR.white,
                shadow: '0 0 5px rgba(0, 0, 0, 0.3)',
                header: {
                    background: pal.primary1Color,
                    color: COLOR.white,
                    activeBackground: cm.darken(pal.primary1Color, 0.2),
                    activeColor: COLOR.white
                },
            },

            toolbar: {
                button: {
                    size: 45,

                    primaryBackground: COLOR.orange500,
                    primaryActiveBackground: COLOR.pink500,
                    secondaryBackground: COLOR.orange500,
                    secondaryActiveBackground: COLOR.pink500,

                    primaryColor: COLOR.white,
                    primaryActiveColor: COLOR.white,
                    secondaryColor: COLOR.white,
                    secondaryActiveColor: COLOR.white,

                    borderWidth: 2,
                    borderColor: COLOR.white,

                    shadow: '0 0 5px rgba(0, 0, 0, 0.3)'
                }
            },

            altbar: {
                background: COLOR.white,
                width: 300,
                shadow: '0 0 5px rgba(0, 0, 0, 0.3)'
            },

            overlay: {
                borderWidth: 2,
                borderColor: COLOR.pink400
            }
        },

        plugin: {
            scale: {
                sliderWidth: 200,
                barWidth: 150
            },

            marker: {
                fill: 'rgba(255,0,0,0.5)',
                strokeColor: COLOR.limeA100,
                strokeDash: 2,
                strokeWidth: 2
            },

            measure: {
                tooltip: {
                    background: COLOR.tealA200,
                    color: COLOR.teal800
                },
                strokeColor: COLOR.tealA200,
                strokeDash: 5,
                strokeWidth: 3
            },

            search: {
                sources: {
                    OSM: {
                        color: COLOR.white,
                        background: COLOR.pink700
                    },
                    ALKIS: {
                        color: COLOR.white,
                        background: COLOR.green700
                    }

                }


            }


        }

    }
}