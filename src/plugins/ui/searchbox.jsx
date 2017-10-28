import React from 'react';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';

import app from 'app';

class Plugin extends app.Plugin {
    runSearch(input) {
        app.set({
            searchInput: input,
            searchResults: []
        });
        if (input.trim())
            app.perform('search', {input});
    }

    init() {
        this.timeout = 0;

        this.action('searchChanged', ({input}) => {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => this.runSearch(input), 500);
        });

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
                    right: 0
                }}
            >
                <TextField
                    onChange={(evt, input) => app.perform('searchChanged', {input})}
                />
                {
                    results.map((r, n) => <SearchResult key={n} value={r} />)
                }
            </Paper>
        )
    }
}

export default {
    Plugin,
    Searchbox: app.connect(Searchbox, ['searchInput', 'searchResults'])
}
