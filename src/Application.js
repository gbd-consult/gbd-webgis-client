import React from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';

import app from 'app';

import withWidth, {SMALL} from 'material-ui/utils/withWidth';




/**
 * @class Application
 * @hideconstructor
 *
 * @desc
 *
 * Main application component.
 *
 */
class Application extends React.Component {
    constructor(props) {
        super(props);
        app.initStore();
        app.set({
            appTheme: getMuiTheme(this.props.theme),
            appWidth: props.width,
            appIsMobile: props.width === SMALL
        });
    }


    async componentDidMount() {
        let map = app.map();
        app.set(this.props.initState);
        this.props.plugins.forEach(p => p.init());
        await map.load('map-container')
        app.perform('identifyModeToggle', {})
    }

    componentWillUpdate(newProps) {
        app.set({
            appWidth: newProps.width,
            appIsMobile: newProps.width === SMALL
        });
    }

    render() {
        return (
            <ReactRedux.Provider store={app.store()}>
                <div id='app-wrap'>
                    <div id='map-container'/>
                    <MuiThemeProvider muiTheme={app.get('appTheme')}>
                        <div>
                            {this.props.ui}
                        </div>
                    </MuiThemeProvider>
                </div>
            </ReactRedux.Provider>
        )
    }
}

export default withWidth()(Application);