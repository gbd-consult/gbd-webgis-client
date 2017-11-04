import React from 'react';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

import _ from 'lodash';

import app from 'app';


class Plugin extends app.Plugin {

    init() {
        let run = ({input}) => {
            let features = [];

            input = input.trim();
            if (!input) {
                return this.update([], '');
            }

            app.perform('search', {
                text: input,
                done: found => {
                    features = [].concat(features, found);
                    this.update(features, input);

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

        this.action('searchClear', () => this.update([], ''));
    }

    update(features, input) {
        app.set({
            searchInput: input,
            searchResults: features
        });
    }
}

class SearchResult extends React.Component {
    render() {
        return (
            <div
                onClick={() => app.perform('searchHighlight', {feature: this.props.feature})}
            >
                {this.props.feature.get('text')}
            </div>
        );
    }
}

class SearchClearButton extends React.Component {
    render() {
        return (
            <IconButton
                tooltip={__("searchClearTooltip")}
                onClick={() => app.perform('searchClear')}
            >
                <FontIcon className="material-icons"
                >close</FontIcon>
            </IconButton>
        );
    }

}

class SearchResults extends React.Component {
    render() {
        if (!this.props.results)
            return null;

        let byCat = _.groupBy(this.props.results, f => f.get('category'));

        return (
            <div>
                { Object.keys(byCat).sort().map(cat => (
                    <div key={cat}>
                        <h6>{cat}</h6>
                        { byCat[cat].map((feature, n) => <SearchResult key={n} feature={feature}/>) }
                    </div>
                ))}
            </div>
        );
    }
}

class Searchbox extends React.Component {
    render() {
        return (
            <Paper
                style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    width: 200
                }}
            >
                <TextField
                    onChange={(evt, input) => app.perform('searchChanged', {input})}
                />
                <SearchClearButton/>
                <SearchResults results={this.props.searchResults}/>
            </Paper>
        )
    }
}

export default {
    Plugin,
    Searchbox: app.connect(Searchbox, ['searchInput', 'searchResults'])
}
