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
            <SmallInput value={this.props.answer.text || ""} disabled={false} placeholder="Short-answer text"
                        handleChange={this.handleChange.bind(this)}/>
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
            <BigInput value={this.props.answer.text || ""} disabled={false} placeholder="Long-answer text"
                        handleChange={this.handleChange.bind(this)}/>
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
                <Scaler id={this.props.id} active={this.props.answer.scaler1 || -1} be_disabled={false} options={this.props.options.scaler1}
                            handleChange={this.handleChange.bind(this,'scaler1')}/>
                <BigInput value={this.props.answer.text || ""} disabled={false} placeholder="Long-answer text"
                            handleChange={this.handleChange.bind(this,'text')}/>
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
                <Scaler id={this.props.id} active={this.props.answer.scaler1 || -1} be_disabled={false} options={this.props.options.scaler1}
                            handleChange={this.handleChange.bind(this,'scaler1')}/>
                <Scaler id={this.props.id} active={this.props.answer.scaler2 || -1} be_disabled={false} options={this.props.options.scaler2}
                            handleChange={this.handleChange.bind(this,'scaler2')}/>
                <BigInput value={this.props.answer.text || ""} disabled={false} placeholder="Long-answer text"
                            handleChange={this.handleChange.bind(this,'text')}/>
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
                ans = <ShortAnswer id={this.props.data.id} answer={this.props.answer} handleChange={this.props.handleChange.bind(this)}/>
                break
            case "L":
                ans = <LongAnswer id={this.props.data.id} answer={this.props.answer} handleChange={this.props.handleChange.bind(this)}/>
                break
            case "MC":
                ans = <MultipleChoice answer={this.props.answer} id={this.props.data.id} options={this.props.data.options}
                                handleChange={this.props.handleChange.bind(this)}/>
                break
            case "S1T":
                ans = <ScaleTextAnswer answer={this.props.answer} id={this.props.data.id} options={this.props.data.options} 
                                handleChange={this.props.handleChange.bind(this)}/>
                break
            case "S2T":
                ans = <TwoScalesTextAnswer answer={this.props.answer} id={this.props.data.id} options={this.props.data.options} 
                                handleChange={this.props.handleChange.bind(this)}/>
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

class Section extends React.Component{
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <FormGroup>
                <h3>{this.props.data.title}</h3>
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
                question: id,
                id: -1
            }
        }
        this.props.handleChange(answers_data)
    }
    render() {
        let formNodes = []
        for (let key = 0; key<this.props.form_data.structure.length; key++) {
            let x = this.props.form_data.structure[key]
            let node
            if (x.type==='question') {
                node = <Question key={key} data={this.props.questions_data[x.id]}
                                    answer={this.props.answers_data[x.id] ? this.props.answers_data[x.id].ans : {}}
                                    handleChange={this.handleChange.bind(this, x.id)}/>
            } else if (x.type==='section') {
                node = <Section key={key} data={x.data} />
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
            let data, form_data, answers_data = {}, questions_data = {}
            form_data = secondData[0]
            form_data.structure = JSON.parse(form_data.structure)

            data = thirdData[0]
            for (let i = 0; i<data.length; ++i) {
                let answer = data[i]
                answer.ans = JSON.parse(answer.ans)
                answers_data[answer.question] = answer
            }

            data = firstData[0]
            for (let i = 0; i<data.length; ++i) {
                let question = data[i]
                question.options = JSON.parse(question.options)
                questions_data[question.id] = question
            }

            this.setState({
                questions_data: questions_data,
                form_data: form_data,
                answers_data: answers_data,
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

        //rozdel odpovede na stare nove
        let old_answers = []
        let new_answers = []
        for (let key in this.state.answers_data) {
            let answer = this.state.answers_data[key]
            answer.ans = JSON.stringify(answer.ans)
            if (answer.id == -1) {
                new_answers.push(answer)
            } else {
                old_answers.push(answer)
            }
        }
        let deferreds = []
        for (let i = 0; i<old_answers.length; i++) {
            let answer = old_answers[i]
            deferreds.push(
                $.ajax({
                    url: "/api/answer/"+answer.id+"/",
                    type: 'PUT',
                    data: JSON.stringify(answer),
                    headers: {
                        "X-CSRFToken": cookie.get('csrftoken'),
                        "Content-Type":"application/json; charset=utf-8",
                    }
                }).fail(function(xhr, status, err) {
                    console.error("/api/answer/"+answer.id+"/", status, err.toString())
                })
            )
        }
        for (let i = 0; i<new_answers.length; i++) {
            let answer = new_answers[i]
            deferreds.push(
                $.ajax({
                    url: "/api/answer/",
                    type: 'POST',
                    data: JSON.stringify(answer),
                    headers: {
                        "X-CSRFToken": cookie.get('csrftoken'),
                        "Content-Type":"application/json; charset=utf-8",
                    }
                }).fail(function(xhr, status, err) {
                    console.error("/api/answer/", status, err.toString())
                })
            )
        }
        $.when.apply(null, deferreds).done(function() {
            let answers_data = {}
            for (let i = 0; i < arguments.length; ++i) {
                let answer = arguments[i][0]
                answer.ans = JSON.parse(answer.ans)
                answers_data[answer.question] = answer
            }
            this.setState({
                answers_data: answers_data
            })
        }.bind(this))
    }
    componentDidMount() {
        this.loadFormFromServer()
    }
    render() {
        if (this.state.loaded) {
            return (
                <FormList form_data={this.state.form_data} questions_data={this.state.questions_data}
                            answers_data={this.state.answers_data} handleSubmit={(event) => this.handleFormSubmit(event)}
                            handleChange={this.handleChange.bind(this)}/>
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