import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link,
    Redirect,
    withRouter
} from "react-router-dom";


class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {

        console.log('Text field value is: ' + this.state.value);

        // alert('Text field value is: ' + this.state.value);
    }

    render() {
        return (
            <div>
                <input type="text"
                       placeholder="Hello!"
                       value={this.state.value}
                       onChange={this.handleChange} />
                <button onClick={this.handleSubmit}>
                    Submit
                </button>
            </div>
        );
    }

}

export default Form;