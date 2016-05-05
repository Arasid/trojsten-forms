import React from "react"
import ReactDOM from "react-dom"
import $ from 'jquery'
import cookie from 'cookies-js'
import { Table } from 'react-bootstrap'
import Select from 'react-select'
import 'react-select/dist/react-select.min.css'

class TableHeader extends React.Component{
    constructor(props) {
        super(props)
    }
    render() {
        let row_nodes = []
        row_nodes.push(<th colSpan="2" key={"user"}>User</th>)
        for (let i = 0; i<this.props.list.length; ++i) {
            let q = this.props.list[i]
            if (q.visible) {
                let question = this.props.data[q.q_uuid]
                let node
                switch (question.q_type) {
                    case "S":
                        node = <th key={i}>{question.title}</th>
                        break
                    case "L":
                        node = <th key={i}>{question.title}</th>
                        break
                    case "MC":
                        node = <th key={i}>{question.title}</th>
                        break
                    case "S1T":
                        node = <th colSpan="2" key={i}>{question.title}</th>
                        break
                    case "S2T":
                        node = <th colSpan="3" key={i}>{question.title}</th>
                        break
                    default:
                        console.error("Type of question " + question.q_type + " does not exist.")
                }
                row_nodes.push(node)
            }
        }
        return (
            <thead>
                <tr>
                    {row_nodes}
                </tr> 
            </thead>
        )
    }
}

class Results extends React.Component{
    constructor(props) {
        super(props)
    }
    render() {
        let rows = []
        for (let user in this.props.answers_data) {
            let answers = this.props.answers_data[user]
            let row_nodes = []
            row_nodes.push(<td key={"u_first"}>{this.props.answer_users[user].first_name}</td>)
            row_nodes.push(<td key={"u_last"}>{this.props.answer_users[user].last_name}</td>)
            for (let i = 0; i<this.props.question_list.length; ++i) {
                let q = this.props.question_list[i]
                if (q.visible) {
                    let question = this.props.questions_data[q.q_uuid]
                    let answer = answers[question.id]
                    row_nodes.push(<td key={"t"+i}>{answer ? answer.text : ""}</td>)
                    switch (question.q_type) {
                        case "S1T":
                            row_nodes.push(<td key={"s1"+i}>{answer ? answer.scaler1 : ""}</td>)
                            break
                        case "S2T":
                            row_nodes.push(<td key={"s1"+i}>{answer ? answer.scaler1 : ""}</td>)
                            row_nodes.push(<td key={"s2"+i}>{answer ? answer.scaler2 : ""}</td>)
                            break
                    }
                }
            }
            let node = (
                <tr key={user}>{row_nodes}</tr>
            )
            rows.push(
                node
            )
        }
        return (
            <Table striped={true} bordered={true} condensed={true}>
                <TableHeader list={this.props.question_list} data={this.props.questions_data}/>
                <tbody>
                    {rows}
                </tbody>
            </Table>
        )
    }
}

class Loading extends React.Component{
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div className="loading">
                Loading...
            </div>
        )
    }
}

class FormResults extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            questions_data: {},
            answers_data: {},
            question_list: [],
            loaded: false,
            filter_org: ""
        }
    }
    loadFormFromServer() {
        $.ajax({
            url: "/api/results/" + this.props.form_id + "/",
            dataType: 'json',
            cache: false,
        }).done(function(data) {
            let question_list = [], orgs = []
            for (let i = 0; i<data.question_list.length; i++) {
                question_list.push({
                    q_uuid: data.question_list[i],
                    visible: true
                })
            }
            for (let i = 0; i<data.orgs.length; i++) {
                orgs.push({
                    label: data.orgs[i].username,
                    value: data.orgs[i].id
                })
            }
            this.setState({
                title: data.title,
                questions_data: data.questions_data,
                answers_data: data.answers_data,
                question_list: question_list,
                answer_users: data.answer_users,
                orgs: orgs,
                loaded: true
            })
        }.bind(this)).fail( function(xhr, status, err) {
            console.error("/api/results/"+this.props.form_id+"/", status, err.toString());
        }.bind(this))
    }
    componentDidMount() {
        this.loadFormFromServer()
    }
    handleOrgsChange(value) {
        let filter_org = value ? value.value : ""
        let question_list = this.state.question_list
        for (let i = 0; i<question_list.length; i++) {
            let q = question_list[i]
            if (filter_org==="" || this.state.questions_data[q.q_uuid].orgs.indexOf(filter_org) > -1) {
                q.visible = true
            } else {
                q.visible = false
            }
        }
        this.setState({
            filter_org: filter_org,
            question_list: question_list
        })
    }
    render() {
        if (this.state.loaded) {
            return (
                <div>
                    <h3>{this.state.title}</h3>
                    <Select
                        value={this.state.filter_org}
                        placeholder="All"
                        searchable={true}
                        clearable={true}
                        options={this.state.orgs}
                        onChange={this.handleOrgsChange.bind(this)}
                    />
                    <br/>
                    <Results
                        question_list={this.state.question_list}
                        questions_data={this.state.questions_data}
                        answers_data={this.state.answers_data}
                        answer_users={this.state.answer_users}
                    />
                </div>
            )
        } else {
            return (
                <Loading />
            )
        }
    }
}

ReactDOM.render(
    <FormResults form_id={$("div#content").data('form-id')}/>,
    document.getElementById('content')
)