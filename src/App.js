import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link,
    Redirect,
    withRouter
} from "react-router-dom";
import Form from './Form.js';
import ApiComponent from './ApiComponent.js';


const AuthExample = () => (
    <Router>
        <div>
            <AuthButton />
            <ul>
                <li>
                    <Link to="/public">Public Page for User</Link>
                </li>
                <li>
                    <Link to="/protected">Protected Page for User</Link>
                </li>
            </ul>
            <Route path="/public" component={Public} />
            <Route path="/login" component={Login} />
            <PrivateRoute path="/protected" component={Protected} />
        </div>
    </Router>
);

const fakeAuth = {
    isAuthenticated: false,
    authenticate(cb) {
        this.isAuthenticated = true;
        setTimeout(cb, 100); // fake async
    },
    signout(cb) {
        this.isAuthenticated = false;
        setTimeout(cb, 100);
    }
};

const AuthButton = withRouter(
    ({ history }) =>
        fakeAuth.isAuthenticated ? (
            <div>
                Welcome!{" "}
                <div className='col-md-12'>Найдите репозиторий по имени владельца:</div>
                <form className='col-md-4' >
                    <input type='text' placeholder='Enter name of owner'/>
                    <button type='submit'>Enter</button>
                </form>
                <button onClick={() => {
                        fakeAuth.signout(() => history.push("/"));
                    }}
                >
                    Sign out
                </button>
            </div>
        ) : (
            <p>You are not logged in.</p>
        )
);

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            fakeAuth.isAuthenticated ? (
                <Component {...props} />
            ) : (
                <Redirect
                    to={{
                        pathname: "/login",
                        state: { from: props.location }
                    }}
                />
            )
        }
    />
);

const Public = () => <h3>Public page</h3>;
const Protected = () => <h3>Protected</h3>;


class Login extends Component {

    state = {
        redirectToReferrer: false
    };

    login = () => {
        fakeAuth.authenticate(() => {
            this.setState({ redirectToReferrer: true });
        });
    };

    handleSubmit(event) {
        event.preventDefault()
        {
            const value = event.target.elements[0].value;
            console.log(value);
            window.localStorage.setItem('rr_login' + value, value);
            const loginInLocalStorage = window.localStorage.getItem('rr_login' + value);

            /* Check if a value exists in LocalStorage */
            if ( loginInLocalStorage == value ) {
                /* Current url */
                // let url = location.pathname;
                // let mytest = url + "/TEST";
                // console.log(mytest);
                console.log("You registered.");
            }
        }
    }

    render() {
        const { from } = this.props.location.state || { from: { pathname: "/" } };
        const { redirectToReferrer } = this.state;

        if (redirectToReferrer) {
            return <Redirect to={'seach'} />;
        }

        return (
            <div>
                <p>You must log in to view the page at {from.pathname}</p>
                <div className='row'>
                    <div className='col-md-12'>Пожалуйста, введите Ваш логин:</div>
                    <form className='col-md-4' onSubmit={this.handleSubmit}>
                        <input type='text' placeholder='Enter your login'/>
                        <button type='submit' onClick={this.login}>Enter</button>
                        {this.props.data}
                    </form>
                </div>
            </div>
        );
    }
}

export default AuthExample;






