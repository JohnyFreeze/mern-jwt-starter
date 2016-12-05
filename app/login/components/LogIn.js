import React from 'react';
import { Link } from 'react-router';

// API
import { logIn } from '../api/user';

// components
import Loading from './Loading.js';

class LogIn extends React.Component {
    constructor() {
        super();
        this.state = {
            errors: {},
            loading: false
        };
    }

    _emailValid(email) {
        // basic email format check
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    _handleFormSubmit(e) {
        e.preventDefault();
        let email = this.refs.email.value;
        let password = this.refs.password.value;
        // check for errors in form
        const ERRORS = {};
        if (!email || !this._emailValid(email)) {
            ERRORS.email = "You need to enter a valid email address";
        }
        if (!password || password.length < 8) {
            ERRORS.password = "Enter a password of at least 8 characters";
        }
        this.setState({
            errors: ERRORS
        });
        // if no errors then handle the form
        if (!ERRORS.email && !ERRORS.password) {
            this.setState({ loading: true });
            this.refs.email.value = '';
            this.refs.password.value = '';
            // send the log in data
            logIn(email, password)
                .then((response) => {
                    document.cookie = "jwt="+ response.token + ";expires="+response.age+";";
                    window.location.href = '/app';
                }, (error) => {
                    console.log("Error logging in");
                    this.setState({ loading: false });
                });
        }
    }

    render() {
        // if loading data show loading screen
        if (this.state.loading) {
            return <Loading message="Logging in" />;
        }
        let emailError = this.state.errors.email ? <div className="has-error"><p className="help-block">{this.state.errors.email}</p></div> : false ;
        let passwordError = this.state.errors.password ? <div className="has-error"><p className="help-block">{this.state.errors.password}</p></div> : false ;
        return (
            <div className="col-md-6 col-md-offset-3">
                <h1 className="page-title">Log In</h1>
                <form onSubmit={this._handleFormSubmit.bind(this)}>
                    <div className="form-group">
                      <label className="control-label" htmlFor="email">Email</label>
                      <input className="form-control" id="email" type="text" ref="email" placeholder="you@youremail.com" required/>
                      {emailError}
                    </div>
                    <div className="form-group">
                      <label className="control-label" htmlFor="password">Password</label>
                      <input className="form-control" id="password" ref="password" type="password" required/>
                      {passwordError}
                    </div>
                    <div className="form-group">
                        <br />
                        <input className="btn btn-default btn-block" type="submit" value="Log In" />
                    </div>
                </form>
                <p><small><Link to="/login/forgotten" activeClassName="active">Forgot your password?</Link></small></p>
                </div>
        );
    }
}

module.exports = LogIn;