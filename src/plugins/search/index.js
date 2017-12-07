import React from 'react';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';

import _ from 'lodash';

import app from 'app';
import ol from 'ol-all';

import MaterialIcon from 'components/MaterialIcon';

class Plugin extends app.Plugin {

    init() {
        let reset = () => app.set({
            searchInput: '',
            searchResults: []
        });

        let run = (input) => {
            let features = [];

            if(!input.trim()) {
                app.set({searchResults: []});
                return;
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

        reset();

        this.subscribe('searchInput', _.debounce(run, 500));

        this.action('searchHighlight', ({feature}) => {
            app.perform('markerMark', {
                features: [feature],
                zoom: true,
                animate: true
            })
        });

        this.action('searchClear', reset);

    }
}

class ResultChip extends React.Component {
    render() {
        let style = app.theme('gwc.plugin.search.chip' + this.props.feature.get('source'));
        return (
            <div style={style}>{this.props.feature.get('source')}</div>
        );
    }
}

class Result extends React.Component {

    render() {
        let feature = this.props.feature;
        let style = app.theme('gwc.plugin.search.result' +
            (this.props.even ? 'Even' : ''));

        return (
            <div
                style={style}
                onClick={() => app.perform('searchHighlight', {feature})}
            >
                <ResultChip feature={feature}/>
                {feature.get('text').split('\n').map((line, i) => <div key={i}>{line}</div>)}
            </div>
        );
    }
}

class Results extends React.Component {
    render() {
        let res = this.props.searchResults;

        if (_.isEmpty(res))
            return null;

        let style = app.theme('gwc.plugin.search.results' + this.props.mode);

        return (
            <div style={style}>
                {res.map((f, i) => <Result key={ol.getUid(f)} feature={f} even={i % 2 === 0}/>)}
            </div>
        );
    }


}

class Input extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: '',
        };
    }

    onChange(evt) {
        this.setState({
            value: evt.target.value
        });
    }

    componentDidUpdate() {
        app.set({searchInput: this.state.value});
    }

    componentWillReceiveProps(props) {
        this.setState({
            value: props.searchInput
        });
    }

    render() {
        return (
            <TextField
                style={app.theme('gwc.plugin.search.textField')}
                underlineShow={false}
                hintText={__("searchHint")}
                value={this.state.value}
                onChange={evt => this.onChange(evt)}
            />
        );
    }
}

class ClearButton extends React.Component {
    render() {
        let disabled = _.isEmpty(this.props.searchResults) && _.isEmpty(this.props.searchInput);

        return (
            <IconButton
                tooltip={__("searchClearTooltip")}
                tooltipPosition='bottom-left'
                onClick={() => app.perform('searchClear')}
                disabled={disabled}
            >
                <MaterialIcon
                    icon='cancel'
                    color={app.theme('gwc.plugin.search.buttonColor' + (disabled ? 'Disabled' : ''))}
                />
            </IconButton>
        );
    }
}

class Header extends React.Component {
    render() {
        let style = app.theme('gwc.plugin.search.header' + this.props.mode);

        return (
            <div style={style}>
                <Input {...this.props} />
                <ClearButton {...this.props} />
            </div>
        )
    }
}

class Panel extends React.Component {
    render() {
        return (
            <div>
                <Header {...this.props} mode="Panel"/>
                <Results {...this.props} mode="Panel"/>
            </div>
        );
    }
}

class Box extends React.Component {
    render() {
        return (
            <Paper style={app.theme('gwc.plugin.search.boxAlt')}>
                <Header {...this.props} mode="Alt"/>
                <Results {...this.props} mode="Alt"/>
            </Paper>
        );
    }
}

export default {
    Plugin,
    Panel: app.connect(Panel, ['searchInput', 'searchResults']),
    Box: app.connect(Box, ['searchInput', 'searchResults']),
};
