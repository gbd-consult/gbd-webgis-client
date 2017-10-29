/// provides the identification (point+click) map mode

import React from 'react';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import {blue500, red500} from 'material-ui/styles/colors';

import FeatureInfo from 'components/FeatureInfo';

import _ from 'lodash';

import app from 'app';
import ol from 'ol-all';

function getGeometry(result) {
    if (result.getGeometry)
        return result.getGeometry();
    return result.geometry;
}


function showResults(results) {
    app.perform('markerMark', {
        geometries: results.map(getGeometry).filter(g => g),
        clear: true,
        pan: false
    });

    app.perform('detailsShow', {
        content: <div>
            {results.map((r, n) => <FeatureInfo key={n} feature={r}/>)}
        </div>
    });
}

function clearResults() {
    app.perform('markerClear');
    app.perform('detailsShow', {
        content: null
    });
}

class Plugin extends app.Plugin {

    init() {

        this.uid = 0;
        this.results = [];

        let run = evt => app.perform('identifyCoordinate', {coordinate: evt.coordinate});

        this.action('identifyModeToggle', () => {
            if (app.get('mapMode') === 'identify')
                return app.perform('mapDefaultMode');

            app.perform('mapMode', {
                name: 'identify',
                cursor: 'help',
                interactions: [
                    new ol.interaction.Pointer({
                        handleDownEvent: run,
                        handleMoveEvent: _.debounce(evt => (evt.originalEvent.shiftKey) ? run(evt) : '', 500)
                    }),
                    new ol.interaction.DragPan(),
                    new ol.interaction.MouseWheelZoom()
                ]
            });
        });

        this.action('identifyCoordinate', ({coordinate}) => {
            this.results = [];
            clearResults();
            app.perform('identify', {uid: ++this.uid, coordinate});
        });

        this.action('identifyReturn', ({uid, results}) => {
            if (uid !== this.uid) {
                console.log('identify results arrived too late, discarding');
                return;
            }
            this.results = [].concat(results, this.results);
            showResults(this.results);
        });
    }
}


class Button extends React.Component {

    render() {
        let active = this.props.mapMode === 'identify';
        return (
            <IconButton
                onClick={() => app.perform('identifyModeToggle')}
            >
                <FontIcon className="material-icons"
                          color={active ? red500 : blue500}

                >my_location</FontIcon>
            </IconButton>
        );
    }
}


export default {
    Plugin,
    Button: app.connect(Button, ['mapMode'])
};
