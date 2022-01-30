import React, {Component} from 'react';


class Customers extends Component {
    constructor () {
        super();
        this.state = {
            customers: []
        }
    }

    componentsDidMount() {
        fetch('/api/customers')
            .then(res => res.json())
            .then(customers => this.setState({customers},() => console.log("hola",customers)));
    }

    render() {
        return (
            <div className='App'>
                <h1> Hello from react </h1>
                <p>{this.customers}</p>
            </div>
        )
    }
}
export default Customers;
