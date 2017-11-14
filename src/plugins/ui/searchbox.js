import React from 'react';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';

import muiThemeable from 'material-ui/styles/muiThemeable';
import withWidth, {SMALL} from 'material-ui/utils/withWidth';

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

class Searchbox extends React.Component {
    render(){
        let style = {
            position: 'absolute',
            top: '0',
            left: '0',
            backgroundColor: this.props.muiTheme.palette.primary1Color,
            width: this.props.width === SMALL ? '100%' : '450px',
            zIndex: '1500',
        };
        let iconStyle = {
            color : this.props.muiTheme.palette.alternateTextColor,
        };
        return (
            <Toolbar style={style}>
                <ToolbarGroup firstChild={true}>
                    <IconButton
                        iconStyle={iconStyle}
                        iconClassName="material-icons"
                        onClick={() => app.perform('navbarVisible', true)}
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
        ['searchInput', 'searchResults', 'sidebarVisible', 'navbarVisible'])
}
