import React from 'react';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

import _ from 'lodash';

import app from 'app';


class Plugin extends app.Plugin {

    init() {
        this.uid = 0;
        this.results = [];

        let run = ({input}) => {
            this.results = [];
            this.input = input.trim();

            if (!this.input) {
                return this.showResults([], '');
            }

            app.perform('search', {uid: ++this.uid, input: this.input});
        };

        this.action('searchChanged', _.debounce(run, 500));

        this.action('searchReturn', ({uid, results}) => {
            if (uid !== this.uid) {
                return;
            }
            this.results = [].concat(this.results, results);
            this.showResults(this.results, this.input);
        });

        this.action('searchHighlight', ({result}) => {
            app.perform('markerMark', {
                geometries: [result.geometry],
                clear: true,
                pan: true
            })
        });

        this.action('searchClear', () => {
            this.results = [];
            this.showResults([], '');
        });
    }

    showResults(results, input) {
        app.set({
            searchInput: input,
            searchResults: results
        });
    }
}

class SearchResult extends React.Component {
    render() {
        return (
            <div
                onClick={() => app.perform('searchHighlight', {result: this.props.result})}
            >
                <b>{this.props.result.category}</b>
                {this.props.result.text}
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

class Searchbox extends React.Component {
    render() {
        let results = this.props.searchResults || [];

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
                <SearchClearButton />

                {
                    results.map((r, n) => <SearchResult key={n} result={r}/>)
                }
            </Paper>
        )
    }
}

export default {
    Plugin,
    Searchbox: app.connect(Searchbox, ['searchInput', 'searchResults'])
}
