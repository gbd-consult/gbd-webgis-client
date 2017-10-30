import React from 'react';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';

import muiThemeable from 'material-ui/styles/muiThemeable';
import withWidth, {SMALL} from 'material-ui/utils/withWidth';

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
    toggleSidebar(){
        app.set( { sidebarVisible : !this.props.sidebarVisible });
    }
    render(){
        var style = {
            position: 'absolute',
            top: '0',
            left: '0',
            backgroundColor: this.props.muiTheme.palette.primary1Color,
            width: this.props.width == SMALL ? '100%' : '450px',
            zIndex: '1500',
        };
        var iconStyle = {
            color : this.props.muiTheme.palette.alternateTextColor,
        };
        return (
            <Toolbar style={style}>
                <ToolbarGroup firstChild={true}>
                    <IconButton
                        iconStyle={iconStyle}
                        iconClassName="material-icons"
                    >
                        menu
                    </IconButton>
                </ToolbarGroup>
                <ToolbarGroup>
                    <TextField
                        onChange={(evt, input) => app.perform('searchChanged', {input})}
                    />
                </ToolbarGroup>
                <ToolbarGroup lastChild={true}>
                    <IconButton
                        iconStyle={iconStyle}
                        iconClassName="material-icons"
                        onClick={() => app.perform('sidebarVisible', !this.props.sidebarVisible)}
                    >
                        { this.props.sidebarVisible ? 'expand_less' : 'expand_more' }
                    </IconButton>
                </ToolbarGroup>
            </Toolbar>
        );
    }
}

export default {
    Plugin,
    Searchbox: app.connect(withWidth()(muiThemeable()(Searchbox)),
        ['searchInput', 'searchResults', 'sidebarVisible'])
}
