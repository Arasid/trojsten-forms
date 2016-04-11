import React from "react"
import ReactDOM from "react-dom"
import $ from 'jquery'
import cookie from 'cookies-js'
import {} from './druhy.js'

var Form = React.createClass({
    loadFormsFromServer: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function() {
        return {data: []};
    },
    componentDidMount: function() {
        this.loadFormsFromServer();
        //setInterval(this.loadFormsFromServer, this.props.pollInterval);
    },
    render: function() {
        return (
            <div className="form">
                <h1>{this.state.data.title}</h1>
                {this.state.data.structure}
            </div>
        );
    }
});

ReactDOM.render(
    <Form url={"/api/form/" + $("div#content").data('form-id')} pollInterval={0} />,
    document.getElementById('content')
);