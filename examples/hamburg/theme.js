let COLOR = require('material-ui/styles/colors');
let cm = require('material-ui/utils/colorManipulator');

let pal = {
    primary1Color: COLOR.lightBlue500,
    primary2Color: COLOR.lightBlue600,
    primary3Color: COLOR.blueGrey500,

    accent1Color: COLOR.pink500,
    accent2Color: COLOR.deepOrangeA200,
    accent3Color: COLOR.grey500,

    textColor: COLOR.blueGrey400,
    secondaryTextColor: COLOR.grey200,
    alternateTextColor: COLOR.white,

    borderColor: '#f5f5f5'
};

module.exports = {
    palette: pal,
    gbd: {
        ui: {
            gutter: 12,

            statusbar: {
                height: 30,
                padding: 8,
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
                toggle: {
                    background: pal.primary1Color,
                    color: COLOR.white,
                    borderColor: COLOR.white
                },

                header: {
                    height: 48,
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
            },

            section: {
                mobile: {
                    buttonSize: 44,
                    buttonIconSize: 24,
                },
                desktop: {
                    buttonSize: 36,
                    buttonIconSize: 20,
                },

                buttonSize: 44,
                buttonIconSize: 24,
                fontSize: 15,
                indent: 16,

                buttonColor: pal.primary1Color,
                textColor: pal.textColor,
                underlineWidth: 1,
                underlineColor: pal.borderColor
            }
        },

        plugin: {
            layers: {
                linkColor: {
                    normal: pal.textColor,
                    hidden: COLOR.grey300,
                    disabled: COLOR.grey300,
                    active: COLOR.white
                },
                buttonColor: {
                    normal: pal.primary1Color,
                    hidden: pal.primary1Color,
                    disabled: COLOR.grey300,
                    active: COLOR.pink500
                },
                background: {
                    active: COLOR.pink500
                }
            },
            scale: {
                sliderWidth: 200,
                barWidth: 100
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