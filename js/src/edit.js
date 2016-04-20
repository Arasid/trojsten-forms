import React from "react"
import ReactDOM from "react-dom"
import $ from 'jquery'
import cookie from 'cookies-js'
import { AutoAffix } from 'react-overlays'
import Waypoint from 'react-waypoint'
import { Glyphicon, ControlLabel, FormControl, FormGroup, HelpBlock, ButtonGroup, Well, Accordion, Button, ListGroupItem, ListGroup, Col, Row, PanelGroup, Panel } from 'react-bootstrap'
import { BigInput, SmallInput, Scaler } from './components.js'

class ScrollSpy extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <Waypoint
                onEnter = {this.props.handleBefore.bind(this)}
                onLeave = {this.props.handleAfter.bind(this)}
                threshold = {-0.02}
            />
        )
    }
}

class InputHeader extends React.Component{
    constructor(props) {
        super(props)
    }
    render(){
        return (
            <FormGroup>
                <SmallInput label={this.props.titleLabel} value={this.props.title}
                            placeholder={this.props.titlePlaceholder}
                            handleChange={this.props.handleChange.bind(this, "title")} />
                <SmallInput label={this.props.descriptionLabel} value={this.props.description}
                            placeholder={this.props.descriptionPlaceholder}
                            handleChange={this.props.handleChange.bind(this, "description")}
                            bsSize="small"/>
            </FormGroup>
        )
    }
}

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
            let node = <option key={i} value={i}>{i}</option>
            all_min.push(node)
        }
        for (let i=parseInt(this.props.scaler.min)+1; i<=hard_max; ++i) {
            let node = <option key={i} value={i}>{i}</option>
            all_max.push(node)
        }
        return (
            <Row>
                <Col md={3}>
                    <ControlLabel>from</ControlLabel>
                    <FormControl groupClassName="group-class" value={this.props.scaler.min} componentClass="select"
                                    onChange={(event)=>this.handleChange("min", event.target.value)}>
                        {all_min}
                    </FormControl>
                </Col>
                <Col md={3}>
                    <ControlLabel>to</ControlLabel>
                    <FormControl groupClassName="group-class" value={this.props.scaler.max} componentClass="select"
                                    onChange={(event)=>this.handleChange("max", event.target.value) }>
                        {all_max}
                    </FormControl>
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
                <InputHeader
                        title={this.props.data.title}
                        titleLabel="Question:"
                        titlePlaceholder="Untitled question"
                        description={this.props.data.description}
                        descriptionLabel="Question description:"
                        descriptionPlaceholder="Question description"
                        handleChange={this.handleDataChange.bind(this)}
                />
                {opt}
                {opt && <br/>}
                <Panel header="Preview:" collapsible={true} in={false}>
                    <ControlLabel>{this.props.data.title}</ControlLabel>
                    <HelpBlock>{this.props.data.description}</HelpBlock>
                    {ans}
                </Panel>
                <ListGroup fill={true}>
                    <ListGroupItem>
                        <Row>
                            <Col md={1}>
                                <Button>
                                    <Glyphicon glyph="trash" />
                                </Button>
                            </Col>
                            <Col md={4}>
                                <FormControl componentClass="select" value={this.props.data.q_type} 
                                                    placeholder="select" onChange={(event)=>this.handleTypeChange(event)}>
                                    <option value="S">Short answer</option>
                                    <option value="L">Long answer</option>
                                    <option value="MC">Multiple choice</option>
                                    <option value="S1T">Scale with text answer</option>
                                    <option value="S2T">Two scales with text answer</option>
                                </FormControl>
                            </Col>
                            <Col md={2} mdOffset={5}>
                                <ButtonGroup>
                                    <Button onClick={this.props.handlePosition.bind(this, -1)}>
                                        <Glyphicon glyph="chevron-up" />
                                    </Button>
                                    <Button onClick={this.props.handlePosition.bind(this, +1)}>
                                        <Glyphicon glyph="chevron-down" />
                                    </Button>
                                </ButtonGroup>
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
                <InputHeader
                        title={this.props.data.title}
                        titleLabel="Section name:"
                        titlePlaceholder="Untitled section"
                        description={this.props.data.description}
                        descriptionLabel="Section description:"
                        descriptionPlaceholder="Section description"
                        handleChange={this.handleChange.bind(this)}
                />
                <ListGroup fill={true}>
                    <ListGroupItem>
                        <Row>
                            <Col md={1}>
                                <Button>
                                    <Glyphicon glyph="trash" />
                                </Button>
                            </Col>
                            <Col md={2} mdOffset={9}>
                                <ButtonGroup>
                                    <Button onClick={this.props.handlePosition.bind(this, -1)}>
                                        <Glyphicon glyph="chevron-up" />
                                    </Button>
                                    <Button onClick={this.props.handlePosition.bind(this, +1)}>
                                        <Glyphicon glyph="chevron-down" />
                                    </Button>
                                </ButtonGroup>
                            </Col>
                        </Row>
                    </ListGroupItem>
                </ListGroup>
            </Panel>
        )
    }
}

class FormList extends React.Component{
    constructor(props) {
        super(props)
        this.updateActiveTopOrd = this.updateActiveTopOrd.bind(this)
        this.setActiveTopOrd = this.setActiveTopOrd.bind(this)
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
    handlePosition(ord, dir) {
        let form_data = {...this.props.form_data}
        let other = ord + dir
        if (other < 0) { return }
        if (other >= form_data.structure.length) { return }
        let help = form_data.structure[other]
        form_data.structure[other] = form_data.structure[ord]
        form_data.structure[ord] = help
        this.props.handleChange(form_data, this.props.questions_data)
    }
    setActiveTopOrd(ord) {
        let activeTopOrd = ord
        this.props.setTopOrd(ord)
    }
    updateActiveTopOrd(ord) {
        if (this.updateActiveTopOrdHandle != null) { return }
        this.updateActiveTopOrdHandle = setTimeout(() => {
            this.updateActiveTopOrdHandle = null
            this.setActiveTopOrd(ord)
        })
    }
    handleBefore(ord, event) {
        //idem smerom dole!
        if (event.previousPosition === "above") {
            this.updateActiveTopOrd(ord)
        }
    }
    handleAfter(ord, event) {
        //idem smerom dole!
        if (event.currentPosition === "above") {
            this.updateActiveTopOrd(ord+1)
        }
    }
    render() {
        let formNodes = []
        for (let key = 0; key<this.props.form_data.structure.length; key++) {
            let x = this.props.form_data.structure[key]
            let node = <ScrollSpy key={"spy"+key} ord={key}
                    handleAfter={this.handleAfter.bind(this, key)} handleBefore={this.handleBefore.bind(this, key)}/>
            formNodes.push(
                node
            )

            if (x.type==='question') {
                node = <Question key={key} data={this.props.questions_data[x.id]}
                                handleChange={this.handleQuestionChange.bind(this, x.id)}
                                handlePosition={this.handlePosition.bind(this, key)} />
            } else if (x.type==='section') {
                node = <Section key={key} data={x.data} 
                                handleChange={this.handleSectionChange.bind(this, key)}
                                handlePosition={this.handlePosition.bind(this, key)} />
            }
            formNodes.push(
                node
            )
        }
        return (
            <form className="form" role="form" onSubmit={this.props.handleSubmit}>
                <FormGroup>
                    <InputHeader
                            title={this.props.form_data.title}
                            titleLabel="Form title:"
                            titlePlaceholder="Untitled form"
                            description={this.props.form_data.description}
                            descriptionLabel="Form description:"
                            descriptionPlaceholder="Form description"
                            handleChange={this.handleHeaderChange.bind(this)}
                    />
                </FormGroup>
                {formNodes}
                <Button type="submit" bsStyle="primary" value="Save" bsSize="large"/>
            </form>
        )
    }
}

class SidePanel extends React.Component{
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <AutoAffix viewportOffsetTop={20} container={this.props.getMain}>
                <ButtonGroup vertical>
                    <Button bsStyle="primary" onClick={this.props.handleAdd.bind(this, "question")}>
                        <span className="glyphicon glyphicon-plus" aria-hidden="true"></span>&nbsp;Question
                    </Button>
                    <Button bsStyle="primary" onClick={this.props.handleAdd.bind(this, "section")}>
                        <span className="glyphicon glyphicon-plus" aria-hidden="true"></span>&nbsp;Section
                    </Button>
                </ButtonGroup>
            </AutoAffix>
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
            loaded: false,
            topOrd: 0,
            newQID: -1
        }
        this.getData = this.getData.bind(this)
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
    setTopOrd(ord) {
        this.setState({
            topOrd: ord
        })
    }
    addSomething(type) {
        let state = {...this.state}
        let new_something
        if (type === "section") {
            new_something = {
                type: "section",
                data: {
                    description: "",
                    title: ""
                } 
            }
        } else {
            new_something = {
                type: "question",
                id: state.newQID
            }
            let new_data = {
                title: "",
                description: "",
                orgs: [],
                options: {},
                q_type: "S",
                form: this.props.form_id
            }
            state.questions_data[state.newQID] = new_data
        }
        state.form_data.structure.splice(state.topOrd,0,new_something)
        state.newQID = state.newQID - 1
        this.setState(state)
    }
    handleChange(form_data, questions_data) {
        this.setState({
            form_data: form_data,
            questions_data: questions_data
        })
    }
    handleFormSubmit(event) {
        event.preventDefault();
        let questions_data = {}
        let form_data = {...this.state.form_data}
        let form_id = this.props.form_id
        let data, first = true
        for (let ord=0; ord<form_data.structure.length; ord++) {
            let thing = form_data.structure[ord]
            if (thing.type === "question") {
                let key = thing.id
                let question = this.state.questions_data[key]
                question.options = JSON.stringify(question.options)
                if (first) {
                    data = this.getData(key, question, questions_data, thing)
                    first = false
                } else {
                    (function (key, question) {
                        data = data.then(function() {
                            return this.getData(key, question, questions_data, thing)
                        }.bind(this))
                    }.bind(this)(key, question))
                }
            }
        }
        data.then(function() {
            form_data.structure = JSON.stringify(form_data.structure)
            return $.ajax({
                url: "/api/form/"+form_id+"/",
                dataType: 'json',
                type: 'PUT',
                data: JSON.stringify(form_data),
                headers: {
                    "X-CSRFToken": cookie.get('csrftoken'),
                    "Content-Type":"application/json; charset=utf-8",
                }
            }).done(function(data) {
                data.structure = JSON.parse(data.structure)
                form_data = data
            }).fail(function(xhr, status, err) {
                console.error("/api/form/"+form_id, status, err.toString());
            })
        }).then(function() {
            this.setState({ 
                form_data: form_data,
                questions_data: questions_data, 
                newQID: -1
            })
        }.bind(this))
    }
    getData(key, question, questions_data, thing) {
        if (key > 0) { return this.updateQuestion(key, question, questions_data) }
        else { return this.postNewQuestion(question, questions_data, thing) }
    }
    updateQuestion(id, question, questions_data) {
        return $.ajax({
            url: "/api/question/"+id+"/",
            dataType: 'json',
            type: 'PUT',
            data: JSON.stringify(question),
            headers: {
                "X-CSRFToken": cookie.get('csrftoken'),
                "Content-Type":"application/json; charset=utf-8",
            }
        }).done(function(data) {
            let new_question = data
            new_question.options = JSON.parse(new_question.options)
            questions_data[new_question.id] = new_question
        }).fail(function(xhr, status, err) {
            console.error("/api/question/"+id+"/", status, err.toString())
        })
    }
    postNewQuestion(question, questions_data, thing) {
        return $.ajax({
            url: "/api/question/",
            dataType: 'json',
            type: 'POST',
            data: JSON.stringify(question),
            headers: {
                "X-CSRFToken": cookie.get('csrftoken'),
                "Content-Type":"application/json; charset=utf-8",
            }
        }).done(function(data) {
            let new_question = data
            new_question.options = JSON.parse(new_question.options)
            questions_data[new_question.id] = new_question
            thing.id = new_question.id
        }).fail(function(xhr, status, err) {
            console.error("/api/question/", status, err.toString())
        })
    }
    setDefaultState() {
        let form_data = {
            "title": "Untitled form",
            "description": "",
            "structure": []
        }
        this.setState({
            form_data: form_data,
            questions_data: {},
            topOrd: 0,
            newQID: -1,
            loaded: true
        })
    }
    componentDidMount() {
        if (this.props.create) {
            this.setDefaultState()
        } else {
            this.loadFormFromServer()
        }
    }
    getMain() {
       return this.refs.main
    }
    render() {
        if (this.state.loaded) {
            return (
                <Row ref="main">
                    <Col md={10}>
                        <FormList form_data={this.state.form_data} questions_data={this.state.questions_data}
                            setTopOrd={this.setTopOrd.bind(this)}
                            handleChange={this.handleChange.bind(this)} handleSubmit={(event) => this.handleFormSubmit(event)}/>
                    </Col>
                    <Col md={2}>
                        <SidePanel getMain={this.getMain.bind(this)} handleAdd={this.addSomething.bind(this)}/>
                    </Col>
                </Row>
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