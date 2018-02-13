import React from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import app from 'app';

class Plugin extends app.Plugin {
    init() {
        app.set({
            gbdAuthForm: {
                login: '',
                password: '',
                error: false
            }
        });

        this.action('load', () => this.setUser(null));

        this.action('gbdAuthFormChange', p => app.update('gbdAuthForm', p));

        this.action('gbdAuthFormLogin', async () => {
            let form = app.get('gbdAuthForm');

            try {
                let user = await app.http.post(app.config.str('server.url'), {
                    'gbd_login': 1,
                    'gbd_auth_js': 1,
                    ...form
                });
                this.setUser(user);
            } catch (e) {
                app.update('gbdAuthForm', {error: true});
            }
        });

        this.action('gbdAuthFormLogout', async () => {
            await app.http.post(app.config.str('server.url'), {
                'gbd_logout': 1,
                'gbd_auth_js': 1
            });
            this.setUser(null);
        });

        this.action('gbdServerPost', async ({data, done}) => {
            let user = app.get('authUser'), ret = {};

            if (user)
                data.gbd_sid_js = user.sid;

            try {
                ret.response = await app.http.post(app.config.str('server.url'), data);
            } catch (e) {
                ret.error = e;
            }

            if (done)
                done(ret);
        });


        this.action('gbdServerGet', async ({data, done}) => {
            let ret = {};
            try {
                ret.response = await app.http.get(app.config.str('server.url'), data);
            } catch (e) {
                ret.error = e;
            }
            if (done)
                done(ret);
        });

    }

    setUser(user) {
        app.set({authUser: user});
        app.perform('authUserChanged', {user});
    }
}


class LoginForm extends React.Component {
    render() {
        return (
            <div>
                <TextField
                    id='login'
                    fullWidth={true}
                    value={this.props.gbdAuthForm.login}
                    onChange={(evt, val) => app.perform('gbdAuthFormChange', {login: val})}
                    hintText="Login"
                />
                <TextField
                    id='password'
                    fullWidth={true}
                    type="password"
                    value={this.props.gbdAuthForm.password}
                    onChange={(evt, val) => app.perform('gbdAuthFormChange', {password: val})}
                    hintText="Passwort"
                />
                <div style={{paddingTop: 16, textAlign: 'right'}}>
                    <RaisedButton
                        label="Einloggen"
                        onClick={() => app.perform('gbdAuthFormLogin')}

                    />
                </div>
                {this.props.gbdAuthForm.error && <div style={app.theme('gwc.plugin.gbd_server.error')}>
                    {__("gwc.plugin.gbd_server.loginError")}
                </div>}
            </div>
        );
    }
}

class UserInfo extends React.Component {
    render() {
        return (
            <div>
                {this.props.authUser.displayName}
                <div style={{paddingTop: 16, textAlign: 'right'}}>
                    <RaisedButton
                        label="Ausloggen"
                        onClick={() => app.perform('gbdAuthFormLogout')}

                    />
                </div>
            </div>
        );
    }
}


class AuthPanel extends React.Component {
    render() {
        return (
            <Paper zDepth={0} style={app.theme('gwc.plugin.gbd_server.panel')}>
                {this.props.authUser
                    ? <UserInfo {...this.props} />
                    : <LoginForm {...this.props} />}
            </Paper>
        );
    }
}

export default {
    Plugin,
    AuthPanel: app.connect(AuthPanel, ['authUser', 'gbdAuthForm'])
};

