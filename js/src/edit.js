import React from "react"
import ReactDOM from "react-dom"
import $ from 'jquery'
import cookie from 'cookies-js'
import { Well, Accordion, ButtonInput, Button, ListGroupItem, ListGroup, Col, Row, Input, PanelGroup, Panel } from 'react-bootstrap'
import { BigInput, SmallInput, Scaler } from './components.js'


class ShortAnswer extends React.Component{
    constructor(props) {
        super(props)
    }
    render() {
        return (        
            <SmallInput value="" disabled={true} placeholder="Short-answer text"/>
        )
    }
}

class LongAnswer extends React.Component{
    constructor(props) {
        super(props)
    }
    render() {
        return (        
            <BigInput value="" disabled={true} placeholder="Long-answer text"/>
        )
    }
}

class MultipleChoice extends React.Component{
    // Accordions -- react-bootstrap
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
                <Scaler id={this.props.id} be_disabled={true} options={this.props.options.scaler1}/>
                <BigInput value="" disabled={true} placeholder="Long-answer text"/>
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
                <Scaler id={this.props.id} be_disabled={true} options={this.props.options.scaler1}/>
                <Scaler id={this.props.id} be_disabled={true} options={this.props.options.scaler2}/>
                <BigInput value="" disabled={true} placeholder="Long-answer text"/>
            </div>
        )
    }
}

class ScalerOption extends React.Component{
    constructor(props) {
        super(props)
    }
    handleChange(key, value) {
        let scaler = {...this.props.scaler}
        scaler[key] = value
        this.props.handleChange(scaler) 
    }
    render(){
        let hard_max = 10
        let hard_min = 0
        let all_min = [], all_max=[]
        for (let i=hard_min; i<parseInt(this.props.scaler.max); ++i) {
            let node = <option className="form-group" key={i} value={i}>{i}</option>
            all_min.push(node)
        }
        for (let i=parseInt(this.props.scaler.min)+1; i<=hard_max; ++i) {
            let node = <option className="form-group" key={i} value={i}>{i}</option>
            all_max.push(node)
        }
        return (
            <Row>
                <Col md={3}>
                    <Input groupClassName="group-class" value={this.props.scaler.min} label="from" type="select"
                                    labelClassName="label-class inline"
                                    onChange={(event)=>this.handleChange("min", event.target.value)}>
                        {all_min}
                    </Input>
                </Col>
                <Col md={3}>
                    <Input groupClassName="group-class" value={this.props.scaler.max} label="to" type="select"
                                    labelClassName="label-class inline"
                                    onChange={(event)=>this.handleChange("max", event.target.value) }>
                        {all_max}
                    </Input>
                </Col>
                <Col md={3}>
                    <SmallInput value={this.props.scaler.label_min} placeholder="Label Min" disabled={false}
                                label={"Label for " + this.props.scaler.min} 
                                handleChange={this.handleChange.bind(this, 'label_min')}
                    />
                </Col>
                <Col md={3}>
                    <SmallInput value={this.props.scaler.label_max} placeholder="Label Max" disabled={false}
                                label={"Label for " + this.props.scaler.max}
                                handleChange={this.handleChange.bind(this, 'label_max')}
                    />
                </Col>
            </Row>
        )
    }
}

class OneScalerOption extends React.Component{
    constructor(props) {
        super(props)
    }
    handleChange(key, value) {
        let options = {...this.props.options}
        options[key] = value
        this.props.handleChange(options) 
    }
    render() {
        return (
            <div>
                <ScalerOption scaler={this.props.options.scaler1}
                        handleChange={this.handleChange.bind(this, 'scaler1')}
                />
            </div>
        )
    }
}

class TwoScalerOptions extends React.Component{
    constructor(props) {
        super(props)
    }
    handleChange(key, value) {
        let options = {...this.props.options}
        options[key] = value
        this.props.handleChange(options) 
    }
    render() {
        return (
            <div>
                <ScalerOption scaler={this.props.options.scaler1} handleChange={this.handleChange.bind(this, 'scaler1')}/>
                <ScalerOption scaler={this.props.options.scaler2} handleChange={this.handleChange.bind(this, 'scaler2')}/>
            </div>
        )
    }
}

class Question extends React.Component{
    constructor(props) {
        super(props)
    }
    handleTypeChange(event) {
        let data = {...this.props.data}
        let q_type = event.target.value
        data.q_type = q_type
        if (q_type==="S1T" || q_type==="S2T") {
            let scalers = ["scaler1"]
            if (q_type==="S2T") scalers.push("scaler2")
            for (let i=0; i<scalers.length; i++) {
                data.options[scalers[i]] = data.options[scalers[i]] || {}
                data.options[scalers[i]].min = data.options[scalers[i]].min || 1
                data.options[scalers[i]].max = data.options[scalers[i]].max || 10
                data.options[scalers[i]].label_min = data.options[scalers[i]].label_min || "Horrible"
                data.options[scalers[i]].label_max = data.options[scalers[i]].label_max || "Terrific"
            }
        }
        this.props.handleChange(data)
    }
    handleDataChange(key, value) {
        let data = {...this.props.data}
        data[key] = value
        this.props.handleChange(data)
    }
    render() {
        let ans
        let opt
        switch (this.props.data.q_type) {
            case "S":
                ans = <ShortAnswer id={this.props.data.id}/>
                break
            case "L":
                ans = <LongAnswer id={this.props.data.id}/>
                break
            case "MC":
                ans = <MultipleChoice id={this.props.data.id} options={this.props.data.options}
                                    handleChange={this.handleDataChange.bind(this, 'options')}/>
                break
            case "S1T":
                ans = <ScaleTextAnswer id={this.props.data.id} options={this.props.data.options} />
                opt = <OneScalerOption options={this.props.data.options}
                                    handleChange={this.handleDataChange.bind(this, 'options')}
                                    />
                break
            case "S2T":
                ans = <TwoScalesTextAnswer id={this.props.data.id} options={this.props.data.options} />
                opt = <TwoScalerOptions options={this.props.data.options}
                                    handleChange={this.handleDataChange.bind(this, 'options')}/>
                break
            default:
                console.error("Type of question " + this.props.data.q_type + " does not exist.")
        }
        return (
            <Panel className="form-group">
                <SmallInput label="Question:" value={this.props.data.title} placeholder="Untitled question"
                            handleChange={this.handleDataChange.bind(this, "title")}/>
                <SmallInput label="Question description: " value={this.props.data.description} placeholder="Question description"
                            handleChange={this.handleDataChange.bind(this, "description")}/>
                <br/>
                {opt}
                <Panel header="Preview:" collapsible={true} in={false}>
                    <label class="control-label">{this.props.data.title}</label>
                    <span className="help-block">{this.props.data.description}</span>
                    {ans}
                </Panel>
                <ListGroup fill={true}>
                    <ListGroupItem>
                        <Row>
                            <Col md={1}>
                                <Button><span className="glyphicon glyphicon-trash" aria-hidden="true"></span></Button>
                            </Col>
                            <Col md={3}>
                                <Input type="select" value={this.props.data.q_type} 
                                                    placeholder="select" onChange={(event)=>this.handleTypeChange(event)}>
                                    <option value="S">Short answer</option>
                                    <option value="L">Long answer</option>
                                    <option value="MC">Multiple choice</option>
                                    <option value="S1T">Scale with text answer</option>
                                    <option value="S2T">Two scales with text answer</option>
                                </Input>
                            </Col>
                        </Row>
                    </ListGroupItem>
                </ListGroup>
            </Panel>
        )
    }
}

class Section extends React.Component{
    constructor(props) {
        super(props)
    }
    handleChange(key, value){
        let data = {...this.props.data}
        data[key] = value
        this.props.handleChange(data)
    }
    render() {
        return (
            <Panel className="form-group">
                <SmallInput label="Section name:" value={this.props.data.title} placeholder="Untitled section"
                        ref="sectionTitle"
                        handleChange={this.handleChange.bind(this, "title")}/>
                <SmallInput label="Section description:" value={this.props.data.description} placeholder="Section description"
                        ref="sectionDescription"
                        handleChange={this.handleChange.bind(this, "description")}/>
            </Panel>
        )
    }
}

class FormList extends React.Component{
    constructor(props) {
        super(props)
    }
    handleQuestionChange(id, data) {
        let questions_data = {...this.props.questions_data}
        questions_data[id] = data
        this.props.handleChange(this.props.form_data,questions_data)
    }
    handleSectionChange(key, data) {
        let form_data = {...this.props.form_data}
        form_data.structure[key].data = data
        this.props.handleChange(form_data, this.props.questions_data)
    }
    handleHeaderChange(key, value){
        let form_data = {...this.props.form_data}
        form_data[key] = value
        this.props.handleChange(form_data, this.props.questions_data)
    }
    render() {
        let formNodes = []
        for (let key in this.props.form_data.structure) {
            let x = this.props.form_data.structure[key]
            let node
            if (x.type==='question') {
                node = <Question key={key} data={this.props.questions_data[x.id]}
                                handleChange={this.handleQuestionChange.bind(this, x.id)} />
            } else if (x.type==='section') {
                node = <Section key={key} data={x.data} 
                                handleChange={this.handleSectionChange.bind(this, key)}/>
            }
            formNodes.push(node)
        }
        return (
            <div className="form">
                <div className="form-group">
                    <SmallInput label="Form title:" value={this.props.form_data.title} placeholder="Untitled form"
                            handleChange={this.handleHeaderChange.bind(this, "title")}/>
                    <SmallInput label="Form description:" value={this.props.form_data.description} placeholder="Form description"
                            handleChange={this.handleHeaderChange.bind(this, "description")}/>
                </div>
                {formNodes}
            </div>
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
    loadQuestionsFromServer(form_data) {
        $.ajax({
            url: "/api/questions/" + this.props.form_id,
            dataType: 'json',
            cache: false,
            success: function(data) {
                let questions_data = {}
                for (let i = 0; i<data.length; ++i) {
                    let question = data[i]
                    question.options = JSON.parse(question.options)
                    questions_data[question.id] = question
                }
                console.log("<>",JSON.stringify(questions_data))
                this.setState({
                    form_data: form_data,
                    questions_data: questions_data, 
                    loaded: true
                })
            }.bind(this),
            error: function(xhr, status, err) {
                console.error("/api/questions/"+this.props.form_id, status, err.toString())
            }.bind(this)
        })
    }
    loadFormFromServer() {
        $.ajax({
            url: "/api/form/" + this.props.form_id,
            dataType: 'json',
            cache: false,
            success: function(form_data) {
                form_data.structure = JSON.parse(form_data.structure)
                this.loadQuestionsFromServer(form_data)
            }.bind(this),
            error: function(xhr, status, err) {
                console.error("/api/form/" + this.props.form_id, status, err.toString())
            }.bind(this)
        })
    }
    handleChange(form_data, questions_data) {
        this.setState({
            form_data: form_data,
            questions_data: questions_data,
            loaded: true
        })
    }
    handleFormSubmit() {
        //FIXME toto prosimta dokonci
        let form_data = this.state.form_data
        $.ajax({
            //nieco
        })
        let questions_data = this.state.questions_data
        //FIXME treba zmenit na pole !!! bude vobec fungovat?
        $.ajax({
            //nieco
        })
    }
    setDefaultState() {
        let form_data = {
            "title": "Untitled form",
            "description": "",
            "structure": {}
        }
        this.setState({form_data: form_data, questions_data: {}, loaded: true})
    }
    componentDidMount() {
        if (this.props.create) {
            this.setDefaultState()
        } else {
            this.loadFormFromServer()
        }
    }
    render() {
        if (this.state.loaded) {
            return (
                <form className="form" role="form">
                    <FormList form_data={this.state.form_data} questions_data={this.state.questions_data}
                                handleChange={this.handleChange.bind(this)}/>
                    <ButtonInput type="submit" bsStyle="primary" value="Save" bsSize="large" onSubmit={() => this.handleFormSubmit()}/>
                </form>
            )
        } else {
            return (
                <Loading />
            )
        }
    }
}

ReactDOM.render(
    <MyForm form_id={$("div#content").data('form-id')} create={$("div#content").data('create')} />,
    document.getElementById('content')
)