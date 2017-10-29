import React from 'react';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';

import _ from 'lodash';

import app from 'app';

function runSearch({input}) {
    app.set({
        searchInput: input,
        searchResults: []
    });
    if (input.trim())
        app.perform('search', {input});
}


class Plugin extends app.Plugin {

    init() {
        this.action('searchChanged', _.debounce(runSearch, 500));

        this.reducer('searchReturn', (state, {results}) => ({
            searchResults: [].concat(
                state.searchResults,
                results
            )
        }));

    }
}

class SearchResult extends React.Component {
    render() {
        return (
            <div
                onClick={() =>
                    app.perform('markerMark', {
                        geometries: [this.props.value.geometry],
                        pan: true
                    })
                }
            >
                <b>{this.props.value.category}</b>
                {this.props.value.text}
            </div>
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
                {
                    results.map((r, n) => <SearchResult key={n} value={r}/>)
                }
            </Paper>
        )
    }
}

export default {
    Plugin,
    Searchbox: app.connect(Searchbox, ['searchInput', 'searchResults'])
}
