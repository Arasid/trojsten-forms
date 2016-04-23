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
            <SmallInput value={this.props.answer.text} disabled={false} placeholder="Short-answer text"
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
            <BigInput value={this.props.answer.text} disabled={false} placeholder="Long-answer text"
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
                <Scaler id={this.props.id} active={this.props.answer.scaler1} be_disabled={false} options={this.props.options.scaler1}
                            handleChange={this.handleChange.bind(this,'scaler1')}/>
                <BigInput value={this.props.answer.text} disabled={false} placeholder="Long-answer text"
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
                <Scaler id={this.props.id} active={this.props.answer.scaler1} be_disabled={false} options={this.props.options.scaler1}
                            handleChange={this.handleChange.bind(this,'scaler1')}/>
                <Scaler id={this.props.id} active={this.props.answer.scaler2} be_disabled={false} options={this.props.options.scaler2}
                            handleChange={this.handleChange.bind(this,'scaler2')}/>
                <BigInput value={this.props.answer.text} disabled={false} placeholder="Long-answer text"
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
        answers_data[id].ans = data
        this.props.handleChange(answers_data)
    }
    render() {
        let formNodes = []
        for (let key = 0; key<this.props.form_data.structure.length; key++) {
            let x = this.props.form_data.structure[key]
            let node
            if (x.type==='question') {
                node = <Question key={key} data={this.props.questions_data[x.id]} answer={this.props.answers_data[x.id].ans}
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

            data = firstData[0]
            for (let i = 0; i<data.length; ++i) {
                let question = data[i]
                question.options = JSON.parse(question.options)
                questions_data[question.id] = question
            }

            data = thirdData[0]
            for (let i = 0; i<data.length; ++i) {
                let answer = data[i]
                answer.ans = JSON.parse(answer.ans)
                answers_data[answer.question] = answer
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
        //FIXME
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