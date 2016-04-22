import React from "react"
import ReactDOM from "react-dom"
import $ from 'jquery'
import cookie from 'cookies-js'
import { Form, FormGroup, ControlLabel, HelpBlock, Button} from 'react-bootstrap'
import { BigInput, SmallInput, Scaler } from './components.js'

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
    render() {
        return (
            <div>
                <Scaler id={this.props.id} be_disabled={false} options={this.props.options.scaler1}/>
                <BigInput value="" disabled={false} placeholder="Long-answer text"/>
            </div>
        )
    }
}

class TwoScalesTextAnswer extends React.Component{
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div>
                <Scaler id={this.props.id} be_disabled={false} options={this.props.options.scaler1}/>
                <Scaler id={this.props.id} be_disabled={false} options={this.props.options.scaler2}/>
                <BigInput value="" disabled={false} placeholder="Long-answer text"/>
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
                ans = <SmallInput value="" disabled={false} placeholder="Short-answer text"/>
                break
            case "L":
                ans = <BigInput value="" disabled={false} placeholder="Long-answer text"/>
                break
            case "MC":
                ans = <MultipleChoice id={this.props.data.id} options={this.props.data.options} />
                break
            case "S1T":
                ans = <ScaleTextAnswer id={this.props.data.id} options={this.props.data.options} />
                break
            case "S2T":
                ans = <TwoScalesTextAnswer id={this.props.data.id} options={this.props.data.options} />
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
    render() {
        let formNodes = []
        for (let key = 0; key<this.props.form_data.structure.length; key++) {
            let x = this.props.form_data.structure[key]
            let node
            if (x.type==='question') {
                node = <Question key={key} data={this.props.questions_data[x.id]} />
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

        $.when(firstPromise, secondPromise).done(function(firstData, secondData) {
            let data, form_data, questions_data = {}
            data = firstData[0]
            form_data = secondData[0]

            for (let i = 0; i<data.length; ++i) {
                let question = data[i]
                question.options = JSON.parse(question.options)
                questions_data[question.id] = question
            }
            form_data.structure = JSON.parse(form_data.structure)

            this.setState({
                questions_data: questions_data,
                form_data: form_data,
                loaded: true
            })
        }.bind(this))
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
                    handleSubmit={(event) => this.handleFormSubmit(event)}/>
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