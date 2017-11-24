/**
 * @module plugins/mui_preview
 *
 * @desc
 *
 * Just display some mui elements to check your theme design.
 *
 */

import React from 'react';
import app from 'app';

import RaisedButton from 'material-ui/RaisedButton';
import {List, ListItem} from 'material-ui/List';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Slider from 'material-ui/Slider';
import Checkbox from 'material-ui/Checkbox';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import Toggle from 'material-ui/Toggle';
import TextField from 'material-ui/TextField';
import AppBar from 'material-ui/AppBar';


class Plugin extends app.Plugin {
}

class Panel extends React.Component {

    render() {
        return (
            <div style={{padding: 16}}>
                <div>
                    <AppBar
                        title="AppBar"
                        iconClassNameRight="muidocs-icon-navigation-expand-more"
                    />
                </div>

                <div>
                    <RaisedButton label="Default"/>
                    <RaisedButton label="Primary" primary={true}/>
                    <RaisedButton label="Secondary" secondary={true}/>
                    <RaisedButton label="Disabled" disabled={true}/>
                </div>

                <div>
                    <TextField hintText="Input"/>
                    <TextField disabled={true} hintText="Input Disabled"/>
                </div>

                <div>
                    <SelectField floatingLabelText="Select">
                        <MenuItem value={1} primaryText="Never"/>
                        <MenuItem value={2} primaryText="Every Night"/>
                        <MenuItem value={3} primaryText="Weeknights"/>
                        <MenuItem value={4} primaryText="Weekends"/>
                        <MenuItem value={5} primaryText="Weekly"/>
                    </SelectField>
                </div>

                <div>
                    <Slider/>
                </div>

                <div>
                    <Checkbox label="Simple"/>
                    <RadioButtonGroup name="shipSpeed" defaultSelected="not_light">
                        <RadioButton value="light" label="Simple"/>
                        <RadioButton value="not_light" label="Selected by default"/>
                    </RadioButtonGroup>
                    <Toggle label="Simple"/>
                    <Toggle disabled={true} label="Disabled"/>
                </div>

                <div>
                    <List>
                        <ListItem primaryText="Sent mail" leftIcon={<ActionGrade/>}/>
                        <ListItem primaryText="Drafts" leftIcon={<ActionGrade/>}/>
                        <ListItem
                            primaryText="Inbox"
                            leftIcon={<ActionGrade/>}
                            initiallyOpen={true}
                            primaryTogglesNestedList={true}
                            nestedItems={[
                                <ListItem
                                    key={1}
                                    primaryText="Starred"
                                    leftIcon={<ActionGrade/>}
                                />,
                                <ListItem
                                    key={2}
                                    primaryText="Sent Mail"
                                    leftIcon={<ActionGrade/>}
                                    disabled={true}
                                    nestedItems={[
                                        <ListItem key={1} primaryText="Drafts" leftIcon={<ActionGrade/>}/>,
                                    ]}
                                />,
                                <ListItem
                                    key={3}
                                    primaryText="Inbox"
                                    leftIcon={<ActionGrade/>}
                                    nestedItems={[
                                        <ListItem key={1} primaryText="Drafts" leftIcon={<ActionGrade/>}/>,
                                    ]}
                                />,
                            ]}
                        />
                    </List>

                </div>


            </div>
        )

    }
}

export default {
    Plugin,
    Panel
};

