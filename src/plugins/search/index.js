import React from 'react';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';

import _ from 'lodash';

import app from 'app';
import ol from 'ol-all';

import MaterialIcon from 'components/MaterialIcon';

class Plugin extends app.Plugin {

    init() {
        let run = ({input}) => {
            let features = [];

            input = input.trim();
            if (!input) {
                return app.set({searchResults: []});
            }

            app.perform('search', {
                text: input,
                done: found => {
                    features = _.sortBy(
                        [].concat(features, found),
                        f => f.get('text'));
                    app.set({searchResults: features});
                }
            });
        };

        this.action('searchChanged', _.debounce(run, 500));

        this.action('searchHighlight', ({feature}) => {
            app.perform('markerMark', {
                features: [feature],
                pan: true
            })
        });

        //this.action('searchClear', () => this.update(null, ''));

    }
}

class ResultChip extends React.Component {
    style() {
        let th = app.theme().gbd.plugin.search.sources[this.props.feature.get('source')];
        return {
            float: 'right',
            marginRight: 6,
            padding: '2px',
            fontSize: 10,
            color: th.color,
            borderRadius: 6,
            background: th.background
        }
    }

    render() {
        return (
            <div style={this.style()}>{this.props.feature.get('source')}</div>
        );
    }


}

class Result extends React.Component {

    style() {
        let s = {
            padding: 16,
            cursor: 'pointer',
        }

        if (!this.props.odd) {
            s.backgroundColor = '#f9f9f9';
        }

        return s;

    }

    render() {
        let feature = this.props.feature;

        return (
            <div
                style={this.style()}
                onClick={() => app.perform('searchHighlight', {feature})}
            >
                <ResultChip feature={feature}/>
                {feature.get('text').split('\n').map(line => <div>{line}</div>)}
            </div>
        );
    }
}

class Results extends React.Component {
    style() {
        return {
            panel: {
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                top: app.theme().toolbar.height,
                overflow: 'auto',
            },
            box: {
                overflow: 'auto',
                maxHeight: 300,
                borderTopWidth: 1,
                borderTopStyle: 'solid',
                borderTopColor: app.theme().palette.borderColor
            }
        }
    }

    render() {
        let res = this.props.searchResults;

        if (!res || !res.length)
            return null;

        return (
            <div style={this.style()[this.props.mode]}>
                {res.map((f, i) => <Result key={ol.getUid(f)} feature={f} odd={i % 2}/>)}
            </div>
        );
    }


}

class Input extends React.Component {
    style() {
        return {
            flex: 1,
        }
    }

    render() {
        return (
            <TextField
                style={this.style()}
                underlineShow={false}
                hintText={__("searchHint")}
                onChange={(evt, input) => app.perform('searchChanged', {input})}
            />
        );
    }
}

class ClearButton extends React.Component {
    render() {
        return (
            <IconButton
                tooltip={__("searchClearTooltip")}
                tooltipPosition='bottom-left'
                onClick={() => app.perform('searchClear')}
            >
                <MaterialIcon
                    color={app.theme().palette.borderColor}
                    icon='cancel'

                />
            </IconButton>
        );
    }
}

class Header extends React.Component {
    style() {
        return {
            panel: {
                boxSizing: 'border-box',
                width: '100%',
                display: 'flex',
                padding: '4px 16px 0 16px',
                height: app.theme().toolbar.height,
                borderBottomWidth: 1,
                borderBottomStyle: 'solid',
                borderBottomColor: app.theme().palette.borderColor
            },
            box: {
                boxSizing: 'border-box',
                width: '100%',
                display: 'flex',
                padding: '0 16px 0 16px',
            }
        }
    }

    render() {
        return (
            <div style={this.style()[this.props.mode]}>
                <Input {...this.props} />
            </div>
        )
    }
}

class Panel extends React.Component {
    render() {
        return (
            <div>
                <Header {...this.props} mode="panel"/>
                <Results {...this.props} mode="panel"/>
            </div>
        );
    }
}

class Box extends React.Component {
    style() {
        return {
            position: 'relative',
            width: app.theme().gbd.ui.altbar.width,
            background: app.theme().gbd.ui.altbar.background
        }
    }

    render() {
        return (
            <Paper zDepth={2} style={this.style()}>
                <Header {...this.props} mode="box"/>
                <Results {...this.props} mode="box"/>
            </Paper>
        );
    }
}

export default {
    Plugin,
    Panel: app.connect(Panel, ['searchInput', 'searchResults']),
    Box: app.connect(Box, ['searchInput', 'searchResults']),
};
