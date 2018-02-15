import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link,
    Redirect,
    withRouter
} from "react-router-dom";
// import Form from './Form.js';
// import ApiComponent from './ApiComponent.js';

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
            {/*<Route path="/login" component={Login} />*/}
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

class AuthButton  extends Component {

    constructor(props) {
        super(props);

        // this.state = {
        //     status:[]
        // }

        this.state = {
            error: null,
            isLoaded: false,
            data: []
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.findRepository = this.findRepository.bind(this);
    }

    login = () => {
        fakeAuth.authenticate(() => {
            this.setState({ redirectToReferrer: true });
        });
    }

    searchHandler = (event) => {
        event.preventDefault();
        console.log('try to find it: ' + this.state.searchVal);
    }

    inputHanler = (event) => {
        this.setState({ searchVal: event.target.value })
    }

    handleSubmit(event) {
        event.preventDefault();
        {
            const value = event.target.elements[0].value;
            console.log(value);
            window.localStorage.setItem('rr_login' + value, value);
            const loginInLocalStorage = window.localStorage.getItem('rr_login' + value);

            /* Check if a value exists in LocalStorage */
            if ( loginInLocalStorage == value ) {
                console.log("You registered.");
            }
        }
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    findRepository(event) {
        event.preventDefault();
        {
            const value = event.target.elements[0].value;
            console.log(value);

                fetch('https://api.github.com/users/' + value + '/repos')
                .then((response) => {
                        if (response.status !== 200) {
                            console.log('Looks like there was a problem. Status Code: ' +
                                response.status);
                            return;
                        }

                        // Examine the text in the response
                        response.json().then((data) => {
                            console.log(data);
                            this.setState({
                                isLoaded: true,
                                status:data
                            });
                        });
                    }
                )


                .catch(function(err) {
                    console.log('Fetch Error :-S', err);
                });
        }
    }

    render() {
        console.log(this.state);
        const { error, isLoaded, data } = this.state;
        // const answer = this.state.status;
        // console.log(answer);

        if (isLoaded) {
            return (
                <div>
                    { this.state.status.map( (el, key) => (
                        <li
                            key={key}
                            link={el.url}
                        >
                            {el.name}
                        </li>
                    ) ) }
                </div>
            );
        } else {
            return (
                fakeAuth.isAuthenticated ? (
                    <div>
                        Welcome!{" "}
                        <div className='col-md-12'>Найдите репозиторий по имени владельца:</div>
                        <form className='col-md-4' onSubmit={this.findRepository}>
                            <input type='text' placeholder='Enter name of owner' onChange={this.handleChange}/>
                            <button type='submit'>Enter</button>
                        </form>


                        {/*<ul>*/}
                        {/*{this.state.status[0].id}*/}
                        {/*</ul>*/}

                        <button onClick={() => {
                            location.reload();
                        }}
                        >
                            Sign out
                        </button>
                    </div>
                ) : (
                    <div>
                        <p>You are not logged in.</p>
                        <p>You must log in to view the protected page.</p>
                        <div className='row'>
                            <div className='col-md-12'>Please enter your login:</div>
                            <form className='col-md-4' onSubmit={this.handleSubmit}>
                                <input type='text' placeholder='Enter your login'/>
                                <button type='submit' onClick={this.login}>Enter</button>
                            </form>
                        </div>
                    </div>
                )
            );
        }
    }
}


export default AuthButton;