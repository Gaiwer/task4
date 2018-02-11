import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link,
    Redirect,
    withRouter
} from "react-router-dom";


class ApiComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            data: []
        };
    }

    componentDidMount() {
        fetch("https://reqres.in/api/users/2")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        data: result.data
                    });
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    render() {
        const { error, isLoaded, data } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <ul>

                    {Object.keys(data).map(dataId => (
                        <div key={dataId} className="card-panel">
                            {data[dataId]}
                        </div>
                    ))}



                    {/*{*/}
                        {/*data.map(data => (*/}
                        {/*<li>*/}
                            {/*{data.first_name} {data.last_name} {data.avatar}*/}
                        {/*</li>*/}
                    {/*))}*/}
                </ul>
            );
        }
    }
}

export default ApiComponent;