let zIndex = {
    dialog: 200,
    statusbar: 100,
    sidebar: 90,
    altbar: 80,
    overlayHandle: 70,
    toolbar: 60,
};

let muiDefaults = require('material-ui/styles/baseThemes/lightBaseTheme').default;
let cm = require('material-ui/utils/colorManipulator');

let COLOR = require('material-ui/styles/colors');

let GBD_BLUE = 'rgb(0, 125, 190)';
let GBD_GREEN = 'rgb(145, 185, 40)';

let PRIMARY = cm.lighten(GBD_BLUE, 0.3);


let palette = {
    ...muiDefaults.palette,

    primary1Color: PRIMARY,

    textColor: COLOR.grey700,

    dark: COLOR.blueGrey700,
    darker: COLOR.blueGrey800,
    darkest: COLOR.blueGrey900,
    textOnDark: COLOR.blueGrey400,
    accentOnDark: PRIMARY,

    light: '#f5f5f5',

    selectedBackground: COLOR.white,
    selectedColor: GBD_GREEN,

    toolbarColor: COLOR.white,
    toolbarBackground: GBD_GREEN,

    alternateBorderColor: COLOR.blueGrey50,
};

module.exports = {
    fontFamily: muiDefaults.fontFamily,
    palette,

    fontSize: {
        normal: 14,
        small: 13,
        smaller: 11,
        smallest: 9,
    },

    gwc: {
        ui: {

            gutter: 12,
            shadow: '0 0 5px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',

            altbar: {
                position: 'absolute',
                right: '{../gutter}',
                top: '{../gutter}',
                zIndex: zIndex.altbar,
            },

            sidebar: {

                headerInnerHeight: 48,

                container: {
                    backgroundColor: '{/palette/canvasColor}',
                    bottom: 0,
                    boxShadow: '{../../shadow}',
                    left: 0,
                    position: 'absolute',
                    top: 0,
                    transform: 'translate(-100%, 0)',
                    transition: '{../../transition}',
                    width: '100%',
                    zIndex: zIndex.sidebar
                },

                containerMedium: {
                    extend: '{../container}',
                    width: 400
                },

                containerLarge: {
                    extend: '{../container}',
                    width: 400
                },

                containerVisible: {
                    extend: '{../container}',
                    transform: 'translate(0, 0)',
                },

                containerMediumVisible: {
                    extend: '{../containerMedium}',
                    transform: 'translate(0, 0)',
                },

                containerLargeVisible: {
                    extend: '{../containerLarge}',
                    transform: 'translate(0, 0)',
                },

                openButton: {
                    backgroundColor: '{../header/backgroundColor}',
                    borderColor: '{../header/color}',
                    borderRadius: '0 8px 8px 0',
                    borderStyle: 'solid',
                    borderLeftStyle: 'none',
                    borderWidth: 2,
                    boxShadow: '{../../shadow}',
                    color: '{../header/color}',
                    height: '{../headerInnerHeight}',
                    left: 0,
                    padding: 0,
                    position: 'absolute',
                    top: '{../../gutter}',
                    width: 38,
                },

                header: {
                    backgroundColor: '{/palette/primary1Color}',
                    boxSizing: 'border-box',
                    color: '{/palette/alternateTextColor}',
                    display: 'flex',
                    height: '{../headerInnerHeight} + {../../gutter} * 2',
                    left: 0,
                    paddingBottom: '{../../gutter}',
                    paddingTop: '{../../gutter}',
                    position: 'absolute',
                    right: 0,
                    top: 0,
                },

                headerButton: {
                    borderRadius: '50%',
                    color: '{../header/color}',
                    height: 36,
                    marginRight: 16,
                    marginTop: 8,
                    padding: 0,
                    width: 36,
                },

                headerButtonActive: {
                    extend: '{../headerButton}',
                    backgroundColor: '{/palette/alternateTextColor}',
                    color: '{/palette/primary1Color}',
                },

                body: {
                    bottom: 0,
                    left: 0,
                    overflow: 'auto',
                    position: 'absolute',
                    right: 0,
                    top: '{../header/height}',
                },

                bodyDesktop: {
                    extend: '{../body}',
                    bottom: '{../../statusbar/height}'
                },
            },

            overlay: {
                box: {
                    borderColor: '{/palette/accent1Color}',
                    borderStyle: 'solid',
                    borderWidth: 2,
                    boxShadow: '0 0 0 4000px rgba(0,0,0,0.3)',
                    left: '50%',
                    pointerEvents: 'none',
                    position: 'absolute',
                    top: '50%',
                    transition: '{../../transition}',
                },

                handle: {
                    backgroundColor: '{../box/borderColor}',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    height: 16,
                    pointerEvents: 'auto',
                    position: 'absolute',
                    width: 16,
                    zIndex: zIndex.overlayHandle
                }
            },

            toolbar: {
                container: {
                    alignItems: 'flex-end',
                    bottom: '{../../statusbar/height} + {../../gutter}',
                    flexDirection: 'column',
                    position: 'absolute',
                    right: 0,
                    zIndex: zIndex.toolbar,
                },

                wrapper: {
                    boxSizing: 'border-box',
                    height: '{../button/height} + {../../gutter}',
                    paddingTop: '{../../gutter} / 2',
                    position: 'relative',
                },

                button: {
                    borderWidth: 2,
                    borderStyle: 'solid',
                    borderColor: '{/palette/alternateBorderColor}',
                    borderRadius: '50%',
                    boxShadow: '{../../shadow}',
                    display: 'inline',
                    height: 44,
                    marginRight: '{../../gutter}',
                    padding: 0,
                    width: 44,
                    minWidth: 44
                },

                buttonPrimary: {
                    extend: '{../button}',
                    backgroundColor: '{/palette/toolbarBackground}',
                    color: '{/palette/toolbarColor}'
                },

                buttonPrimaryActive: {
                    extend: '{../buttonPrimary}',
                    backgroundColor: '{/palette/selectedBackground}',
                    borderColor: '{/palette/toolbarBackground}',
                    color: '{/palette/selectedColor}',
                },

                buttonSecondary: {
                    extend: '{../buttonPrimary}',
                    borderWidth: 0,
                    height: 38,
                    width: 38,
                    minWidth: 38
                },

                buttonSecondaryActive: {
                    extend: '{../buttonSecondary}',
                    backgroundColor: '{/palette/selectedBackground}',
                    color: '{/palette/selectedColor}',

                },

                popover: {
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    borderRadius: '24px 0 0 24px',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'row',
                    height: '{../button/height} + {../../gutter}',
                    paddingBottom: '{../../gutter} / 2',
                    paddingLeft: '{../../gutter}',
                    paddingRight: '({../button/width}-{../buttonSecondary/width}) / 2',
                    paddingTop: '{../../gutter} / 2',
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    transform: 'translate(100%, 0)',
                    transition: '{../../transition}',
                    zIndex: zIndex.toolbar + 1,
                },

                popoverVisible: {
                    extend: '{../popover}',
                    transform: 'translate(0, 0)'
                }
            },

            statusbar: {
                height: 30,
                lineHeight: '18px',
                fontSize: '{/fontSize/smaller}',
                color: '{/palette/textOnDark}',

                container: {
                    backgroundColor: '{/palette/darker}',
                    alignItems: 'center',
                    bottom: 0,
                    boxSizing: 'border-box',
                    color: '{../color}',
                    display: 'flex',
                    height: '{../height}',
                    left: 0,
                    position: 'absolute',
                    right: 0,
                    zIndex: zIndex.statusbar,
                },

                group: {
                    paddingLeft: '{../../gutter} / 2',
                    paddingRight: '{../../gutter} / 2',
                    alignItems: 'center',
                    boxSizing: 'border-box',
                    display: 'inline-flex',
                    height: '100%',
                },

                input: {
                    backgroundColor: '{/palette/darkest}',
                    border: 'none',
                    borderRadius: 6,
                    boxSizing: 'border-box',
                    color: '{/palette/accentOnDark}',
                    cursor: 'default',
                    fontFamily: '{/fontFamily}',
                    fontSize: '{../fontSize}',
                    outline: 'none',
                    paddingLeft: 6,
                    textAlign: 'left',
                    width: 150,
                    padding: '2px 4px',
                },

                label: {
                    alignItems: 'center',
                    border: 'none',
                    boxSizing: 'border-box',
                    display: 'inline-flex',
                    fontFamily: '{/fontFamily}',
                    fontSize: '{../fontSize}',
                    fontWeight: 'bold',
                    padding: '0 4px',
                },

                link: {
                    color: '{/palette/accentOnDark}',
                    cursor: 'pointer',
                    fontFamily: '{/fontFamily}',
                    fontSize: '{../fontSize}',
                },

                separator: {
                    color: '{/palette/textOnDark}',
                    display: 'inline-flex',
                    lineHeight: '{../lineHeight}',
                    padding: '0 8px',
                },
                sliderContainer: {
                    display: 'inline-flex',
                    margin: '0 8px',
                    padding: 0
                },
                sliderStyle: {},
                sliderSliderStyle: {
                    width: 150,
                    margin: 0
                }
            },

            section: {
                indent: 12,
                buttonSize: 36,

                rowBox: {
                    alignItems: 'center',
                    display: 'flex',
                },

                buttonBox: {
                    height: '{../buttonSize}',
                    width: '{../buttonSize}',
                },

                contentBox: {
                    alignItems: 'center',
                    borderBottomColor: '{/palette/light}',
                    borderBottomStyle: 'solid',
                    borderBottomWidth: 1,
                    display: 'flex',
                    flex: 1,
                    fontSize: '{/fontSize/normal}',
                    minHeight: '{../buttonSize}',
                },

                toggle: {
                    height: '{../buttonSize}',
                    margin: 0,
                    padding: 0,
                    transform: 'rotate(0deg)',
                    transition: '{/gwc/ui/transition}',
                    width: '{../buttonSize}',
                },

                toggleOpen: {
                    extend: '{../button}',
                    transform: 'rotate(90deg)',
                },

                toggleIcon: {
                    color: '{/palette/textColor}',
                    fontSize: 18,
                    margin: 0,
                    padding: 0,
                },

                button: {
                    height: '{../buttonSize}',
                    margin: 0,
                    padding: 0,
                    width: '{../buttonSize}',
                },

                buttonIcon: {
                    color: '{/palette/primary1Color}',
                    fontSize: 18,
                    margin: 0,
                    padding: 0,
                }
            },


            dialog: {
                padding: 24,

                shadow: {
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.7)',
                    zIndex: zIndex.dialog
                },
                box: {
                    boxSizing: 'border-box',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: 0,
                    margin: 0,
                    paddingLeft: '{../padding}',
                    paddingTop: '{../padding} * 2.5',
                    paddingRight: 0,
                    paddingBottom: '{../padding}',
                },
                boxDesktop: {
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    paddingLeft: '{../padding} * 2',
                    paddingTop: '{../padding} * 2.5',
                    paddingRight: '{../padding}',
                    paddingBottom: '{../padding} * 2',
                },
                closeButton: {
                    position: 'absolute',
                    top: 8,
                    right: 8
                },
                container: {
                    boxSizing: 'border-box',
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden'
                },
                content: {
                    extend: '{../container}',
                    overflow: 'auto',
                    paddingRight: '{../padding}'
                }
            }
        }
    }
};

