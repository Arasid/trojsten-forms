import React from "react"
import ReactDOM from "react-dom"
import $ from 'jquery'
import cookie from 'cookies-js'
import {} from './druhy.js'

var Form = React.createClass({
    render: function() {
        return (
            <div className="form">
                <h2 className="formTitle">
                    {this.props.title}
                </h2>
                {this.props.children}
            </div>
        );
    }
});

var FormList = React.createClass({
    render: function() {
        var formNodes = this.props.data.map(function(form) {
            return (
                <Form title={form.title} key={form.id}>
                    {form.structure}
                </Form>
            );
        });
        return (
            <div className="formList">
                {formNodes}
            </div>
        );
    }
});

var FormBox = React.createClass({
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
        setInterval(this.loadFormsFromServer, this.props.pollInterval);
    },
    render: function() {
        return (
            <div className="formBox">
                <h1>Forms</h1>
                <FormList data={this.state.data} />
            </div>
        );
    }
});

ReactDOM.render(
    <FormBox url="/api/forms" pollInterval={2000} />,
    document.getElementById('content')
);