import React from "react"
import ReactDOM from "react-dom"
import $ from 'jquery'
import cookie from 'cookies-js'
import { Form, FormGroup, ControlLabel, HelpBlock, Button} from 'react-bootstrap'
import { BigInput, SmallInput, Scaler } from './components.js'

class ShortAnswer extends React.Component{
    constructor(props) {
        super(props)
    }
    handleChange(text) {
        let answer = {...this.props.answer}
        answer.text = text
        this.props.handleChange(answer)
    }
    render() {
        return (        
            <SmallInput
                value={this.props.answer.text || ""}
                disabled={false}
                placeholder="Short-answer text"
                handleChange={this.handleChange.bind(this)}
            />
        )
    }
}

class LongAnswer extends React.Component{
    constructor(props) {
        super(props)
    }
    handleChange(text) {
        let answer = {...this.props.answer}
        answer.text = text
        this.props.handleChange(answer)
    }
    render() {
        return (        
            <BigInput
                value={this.props.answer.text || ""}
                disabled={false}
                placeholder="Long-answer text"
                handleChange={this.handleChange.bind(this)}
            />
        )
    }
}

class MultipleChoice extends React.Component{
    constructor(props) {
        super(props)
    }
    render() {
    }
}

class ScaleTextAnswer extends React.Component{
    constructor(props) {
        super(props)
    }
    handleChange(key, value) {
        let answer = {...this.props.answer}
        answer[key] = value
        this.props.handleChange(answer)
    }
    render() {
        return (
            <div>
                <Scaler
                    id={this.props.id}
                    active={this.props.answer.scaler1 || -1}
                    be_disabled={false}
                    options={this.props.options.scaler1}
                    handleChange={this.handleChange.bind(this,'scaler1')}
                />
                <BigInput
                    value={this.props.answer.text || ""}
                    disabled={false}
                    placeholder="Long-answer text"
                    handleChange={this.handleChange.bind(this,'text')}
                />
            </div>
        )
    }
}

class TwoScalesTextAnswer extends React.Component{
    constructor(props) {
        super(props)
    }
    handleChange(key, value) {
        let answer = {...this.props.answer}
        answer[key] = value
        this.props.handleChange(answer)
    }
    render() {
        return (
            <div>
                <Scaler
                    id={this.props.id}
                    active={this.props.answer.scaler1 || -1}
                    be_disabled={false}
                    options={this.props.options.scaler1}
                    handleChange={this.handleChange.bind(this,'scaler1')}
                />
                <Scaler 
                    id={this.props.id}
                    active={this.props.answer.scaler2 || -1}
                    be_disabled={false}
                    options={this.props.options.scaler2}
                    handleChange={this.handleChange.bind(this,'scaler2')}
                />
                <BigInput
                    value={this.props.answer.text || ""}
                    disabled={false}
                    placeholder="Long-answer text"
                    handleChange={this.handleChange.bind(this,'text')}
                />
            </div>
        )
    }
}

class Question extends React.Component{
    constructor(props) {
        super(props)
    }
    render() {
        let ans
        switch (this.props.data.q_type) {
            case "S":
                ans = <ShortAnswer
                            id={this.props.data.id}
                            answer={this.props.answer}
                            handleChange={this.props.handleChange.bind(this)}
                />
                break
            case "L":
                ans = <LongAnswer
                            id={this.props.data.id}
                            answer={this.props.answer}
                            handleChange={this.props.handleChange.bind(this)}
                />
                break
            case "MC":
                ans = <MultipleChoice
                            answer={this.props.answer}
                            id={this.props.data.id}
                            options={this.props.data.options}
                            handleChange={this.props.handleChange.bind(this)}
                />
                break
            case "S1T":
                ans = <ScaleTextAnswer
                            answer={this.props.answer}
                            id={this.props.data.id}
                            options={this.props.data.options} 
                            handleChange={this.props.handleChange.bind(this)}
                />
                break
            case "S2T":
                ans = <TwoScalesTextAnswer
                            answer={this.props.answer}
                            id={this.props.data.id}
                            options={this.props.data.options} 
                            handleChange={this.props.handleChange.bind(this)}
                />
                break
            default:
                console.error("Type of question " + this.props.data.q_type + " does not exist.")
        }
        return (
            <FormGroup>
                <ControlLabel>{this.props.data.title}</ControlLabel>
                <HelpBlock>{this.props.data.description}</HelpBlock>
                {ans}
                <hr/>
            </FormGroup>
        )
    }
}

class Heading extends React.Component{
    constructor(props) {
        super(props)
    }
    render() {
        let h
        switch (this.props.type) {
            case "section":
                h = <h3>{this.props.data.title}</h3>
                break
            case "title":
                h = <h4>{this.props.data.title}</h4>
                break
            default:
                console.error("Type of heading " + this.props.type + " does not exist.")
        }
        return (
            <FormGroup>
                {h}
                <HelpBlock>{this.props.data.description}</HelpBlock>
                <hr/>
            </FormGroup>
        )
    }
}

class FormList extends React.Component{
    constructor(props) {
        super(props)
    }
    handleChange(id, data) {
        let answers_data = {...this.props.answers_data}
        if (id in answers_data) {
            answers_data[id].ans = data
        } else {
            answers_data[id] = {
                ans: data,
                question: id
            }
        }
        this.props.handleChange(answers_data)
    }
    render() {
        let formNodes = []
        for (let index = 0; index<this.props.form_data.structure.length; index++) {
            let x = this.props.form_data.structure[index]
            let node
            if (x.type==='question') {
                let q_data = this.props.questions_data[x.q_uuid]
                node = <Question
                            key={x.q_uuid}
                            data={q_data}
                            answer={this.props.answers_data[q_data.id] ? this.props.answers_data[q_data.id].ans : {}}
                            handleChange={this.handleChange.bind(this, q_data.id)}
                />
            } else if (x.type==='section' || x.type==='title') {
                node = <Heading key={x.q_uuid} data={x.data} type={x.type}/>
            }
            formNodes.push(
                node
            )
        }
        return (
            <Form onSubmit={this.props.handleSubmit}>
                <FormGroup>
                    <h1>{this.props.form_data.title}</h1>
                    <HelpBlock>{this.props.form_data.description}</HelpBlock>
                    <hr/>
                </FormGroup>
                {formNodes}
                <Button type="submit" bsStyle="primary" bsSize="large">Save</Button>
            </Form>
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

class MyForm extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            form_data: {},
            questions_data: {},
            answers_data: {},
            loaded: false
        }
    }
    loadFormFromServer() {
        let firstPromise = $.ajax({
            url: "/api/fill_form/" + this.props.form_id + "/",
            dataType: 'json',
            cache: false,
        }).fail( function(xhr, status, err) {
            console.error("/api/fill_form/"+this.props.form_id+"/", status, err.toString());
        }.bind(this)).done(function(data) {
            this.setState({
                questions_data: data.questions,
                form_data: data.form,
                answers_data: data.answers,
                loaded: true
            })
        }.bind(this))
    }
    handleChange(answers_data) {
        this.setState({
            answers_data: answers_data
        })
    }
    handleFormSubmit(event) {
        event.preventDefault()
        let state = {...this.state}

        $.ajax({
            url: "/api/fill_form/"+state.form_data.id+"/",
            type: 'PUT',
            data: JSON.stringify(state.answers_data),
            headers: {
                "X-CSRFToken": cookie.get('csrftoken'),
                "Content-Type":"application/json; charset=utf-8",
            }
        }).fail(function(xhr, status, err) {
            console.error("/api/fill_form/"+state.form_data.id+"/", status, err.toString())
        }).done(function(data) {
            this.setState({
                answers_data: data
            })
        }.bind(this))
    }
    componentDidMount() {
        this.loadFormFromServer()
    }
    render() {
        if (this.state.loaded) {
            return (
                <FormList
                    form_data={this.state.form_data}
                    questions_data={this.state.questions_data}
                    answers_data={this.state.answers_data}
                    handleSubmit={(event) => this.handleFormSubmit(event)}
                    handleChange={this.handleChange.bind(this)}
                />
            )
        } else {
            return (
                <Loading />
            )
        }
    }
}

ReactDOM.render(
    <MyForm form_id={$("div#content").data('form-id')}/>,
    document.getElementById('content')
)