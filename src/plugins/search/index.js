import React from 'react';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import Chip from 'material-ui/Chip';

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
                return this.update(null, '');
            }

            app.perform('search', {
                text: input,
                done: found => {
                    features = [].concat(features, found);
                    this.update(
                        _.groupBy(features, f => f.get('category')),
                        input);

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

        this.action('searchClear', () => this.update(null, ''));

    }

    update(results, input) {
        app.set({
            searchInput: input,
            searchResults: results
        });
    }
}

class Result extends React.Component {

    render() {
        let feature = this.props.feature;

        return (
            <div
                style={this.props.css.feature}
                onClick={() => app.perform('searchHighlight', {feature})}
            >
                {feature.get('text').split('\n').map(line => <div>{line}</div>)}
            </div>
        );
    }
}

class ResultsSection extends React.Component {
    render() {
        return (
            <div style={this.props.css.section}>
                <div style={this.props.css.title}>
                    {this.props.title}
                </div>
                {this.props.features.map(f => <Result
                    key={ol.getUid(f)}
                    css={this.props.css}
                    feature={f}
                />)}
            </div>
        )
    }

}

class Results extends React.Component {
    css() {
        return {
            container: {
                position: 'absolute',
                left: 0,
                right: 0,
                top: app.theme().toolbar.height,
                bottom: 0,
                overflow: 'auto',
                padding: '0 16px 16px 16px'
            },
            section: {
                margin: '16px 0'
            },
            title: {
                background: app.theme().palette.accent2Color,
                color: 'white',
                margin: '8px 0',
                padding: 8,
                borderRadius: 4,
                fontSize: 12,
                display: 'inline-block'
            },
            feature: {
                color: app.theme().palette.primary1Color,
                margin: '8px 0',
                cursor: 'pointer'
            }

        }
    }

    render() {
        if (!this.props.searchResults)
            return null;

        let titles = Object.keys(this.props.searchResults).sort();
        let css = this.css();

        return (
            <div style={css.container}>
                {
                    titles.map(t => <ResultsSection
                        key={t}
                        title={t}
                        features={this.props.searchResults[t]}
                        css={css}


                    />)
                }
            </div>
        );
    }


}

class Box extends React.Component {
    style() {
        return {
            flex: 1,
            marginLeft: 8,
            marginRight: 8,
        }
    }

    render() {
        return (
            <TextField
                style={this.style()}
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
                <MaterialIcon icon='backspace'/>
            </IconButton>
        );
    }

}

class Header extends React.Component {
    style() {
        return {
                position: 'absolute',
                left: 0,
                top: 0,
                right: 0,
                height: app.theme().toolbar.height,
                display: 'flex'
        }
    }

    render() {
        return (
            <div style={this.style()}>
                <Box {...this.props} />
                <ClearButton/>
            </div>
        )


    }
}


class Panel extends React.Component {
    render() {
        return (
            <div>
                <Header {...this.props} />
                <Results {...this.props} />
            </div>
        );
    }
}

export default {
    Plugin,
    Panel: app.connect(Panel, ['searchInput', 'searchResults'])
};
