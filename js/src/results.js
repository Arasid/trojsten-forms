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
        row_nodes.push(<th key={"user"}>User</th>)
        for (let i = 0; i<this.props.list.length; ++i) {
            let q = this.props.list[i]
            if (q.visible) {
                let question = this.props.data[q.id]
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
            row_nodes.push(<td key={"u"}>{user}</td>)
            for (let i = 0; i<this.props.question_list.length; ++i) {
                let q = this.props.question_list[i]
                if (q.visible) {
                    let question = this.props.questions_data[q.id]
                    let answer = answers[q.id]
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
        let firstPromise = $.ajax({
            url: "/api/questions/" + this.props.form_id + "/",
            dataType: 'json',
            cache: false,
        }).fail( function(xhr, status, err) {
            console.error("/api/questions/"+this.props.form_id+"/", status, err.toString());
        }.bind(this))
        let secondPromise = $.ajax({
            url: "/api/form/" + this.props.form_id,
            dataType: 'json',
            cache: false,
        }).fail( function(xhr, status, err) {
            console.error("/api/form/"+this.props.form_id+"/", status, err.toString());
        }.bind(this))
        let thirdPromise = $.ajax({
            url: "/api/answers/" + this.props.form_id + "/",
            dataType: 'json',
            cache: false,
        }).fail( function(xhr, status, err) {
            console.error("/api/answers/"+this.props.form_id+"/", status, err.toString());
        }.bind(this))

        $.when(firstPromise, secondPromise, thirdPromise).done(function(firstData, secondData, thirdData) {
            let data, question_list = [], answers_data = {}, questions_data = {}, users = {}

            //spravim si zoznam otazok podla poradia v ankete
            data = secondData[0].structure
            data = JSON.parse(data)
            for (let i = 0; i<data.length; ++i) {
                if (data[i].type === 'question') {
                    question_list.push({
                        id: data[i].id,
                        visible: true
                    })
                }
            }

            data = firstData[0]
            for (let i = 0; i<data.length; ++i) {
                let question = data[i]
                for (let j = 0; j<question.orgs.length; j++) {
                    users[question.orgs[j]] = true
                }
                questions_data[question.id] = {
                    title: question.title,
                    q_type: question.q_type,
                    orgs: new Set(question.orgs)
                }
            }

            data = thirdData[0]
            for (let i = 0; i<data.length; ++i) {
                let answer = data[i]
                answer.ans = JSON.parse(answer.ans)
                if (!(answer.user in answers_data)) {
                    answers_data[answer.user] = {}
                }
                answers_data[answer.user][answer.question] = answer.ans
            }

            let deferreds = []
            for (let org in users) {
                deferreds.push(
                    $.ajax({
                        url: "/api/user/"+org+"/",
                        dataType: "json",
                        cache: false,
                    }).fail(function(xhr, status, err) {
                        console.error("/api/user/"+org+"/", status, err.toString()) 
                    })
                )
            }
            $.when.apply(null, deferreds).done(function() {
                let all = arguments
                // problem ak deferreds ma jednu vec, tak arguments nebude pole velkosti jedna, ale rovno ten vysledok
                if (deferreds.length == 1) {
                    all = [arguments]
                }
                let orgs = []
                for (let i = 0; i < all.length; ++i) {
                    let user = all[i][0]
                    orgs.push({label: user.username, value: user.id})
                }
                this.setState({
                    questions_data: questions_data,
                    answers_data: answers_data,
                    question_list: question_list,
                    orgs: orgs,
                    loaded: true
                })
            }.bind(this))
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
            if (filter_org==="" || this.state.questions_data[q.id].orgs.has(filter_org)) {
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
                    <Select value={this.state.filter_org} placeholder="All" searchable={true} clearable={true}
                            options={this.state.orgs} onChange={this.handleOrgsChange.bind(this)} />
                    <br/>
                    <Results question_list={this.state.question_list} questions_data={this.state.questions_data}
                            answers_data={this.state.answers_data}/>
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