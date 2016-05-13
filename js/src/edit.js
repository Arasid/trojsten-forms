import React from "react"
import ReactDOM from "react-dom"
import $ from 'jquery'
import cookie from 'cookies-js'
import Select from 'react-select'
import { Clearfix, Form, Glyphicon, ControlLabel, FormControl, FormGroup, HelpBlock, ButtonGroup, Well, Accordion, Button, ListGroupItem, ListGroup, Col, Row, PanelGroup, Panel } from 'react-bootstrap'
import { BigInput, SmallInput, Scaler } from './components.js'
import DateTimeField from "react-bootstrap-datetimepicker"
import 'react-bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css'
import 'react-select/dist/react-select.min.css'
import moment from 'moment'
import uuid from 'uuid'
import tv4 from 'tv4'

tv4.addFormat('datetime', function (data, schema) {
    let datetimeRegex = /^\d\d\d\d-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01])T(00|[0-9]|1[0-9]|2[0-3]):([0-9]|[0-5][0-9]):([0-9]|[0-5][0-9])Z$/
    if (typeof data !== 'string' || !datetimeRegex.test(data)) {
        // return error message
        return 'value must be string of the form: YYYY-MM-DD[T]HH:mm:ss[Z]'
    }
    return null
})
let structureSchema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "definitions": {
        "heading": {
            "type": "object",
            "properties": {
                "type": {
                    "type": "string",
                    "enum": ["section", "title"],
                },
                "q_uuid": {
                    "type": "string",
                    "pattern": "^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$"
                },
                "data": {
                    "type": "object",
                    "properties": {
                        "title": {
                            "type": "string",
                            "minLength": 1
                        },
                        "description": {
                            "type": "string"
                        }
                    },
                    "additionalProperties": false,
                    "required": ["title"]
                }
            },
            "additionalProperties": false,
            "required": ["type", "q_uuid", "data"]
        },
        "question": {
            "type": "object",
            "properties": {
                "type": {
                    "type": "string",
                    "enum": ["question"],
                },
                "q_uuid": {
                    "type": "string",
                    "pattern": "^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$"
                }
            },
            "additionalProperties": false,
            "required": ["type", "q_uuid"]
        }
    },

    "type": "array",
    "title": "structure",
    "items": {
        "oneOf": [
            { "$ref": "#/definitions/heading"},
            { "$ref": "#/definitions/question"}
        ]
    }
}
tv4.addSchema("structure.json", structureSchema)
let formDataSchema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "properties": {
        "id": {
            "type": "integer",
            "minimum": 1
        },
        "title": {
            "type": "string",
            "minLength": 1
        },
        "description": {
            "type": "string"
        },
        "deadline": {
            "type": "string",
            "format": "datetime"
        },
        "structure": {
            "$ref": "structure.json"
        },
        "can_edit": {
            "type": "array",
            "items": {
                "type": "integer",
                "minimum": 1
            },
            "uniqueItems": true
        }
    },
    "additionalProperties": false,
    "required": ["title", "description", "deadline", "structure"]
}

let question_schema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "question",
    "definitions": {
        "scaler": {
            "type": "object",
            "properties": {
                "label_min": { "type": "string" },
                "label_max": { "type": "string" },
                "min": { "type": "integer" },
                "max": { "type": "integer" }
            },
            "required": ["label_min", "label_max", "min", "max"],
            "additionalProperties": false
        },
        "checkActive": {
            "oneOf": [
                {
                    "properties": {
                        "active": { "type": "boolean", "enum": [true] },
                        "title": { "type": "string", "minLength": 1 }
                    }
                }, {
                    "properties": {
                        "active": { "type": "boolean", "enum": [false] },
                        "title": { "type": "string", "minLength": 0 }
                    }
                }
            ]
        },
        "checkAll": {
            "type": "object",
            "properties": {
                "id": { "type": "integer", "minimum": 1 },
                "form": { "type": "integer", "minimum": 1 },
                "q_uuid": {
                    "type": "string",
                    "pattern": "^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$"
                },
                "title": { "type": "string" },
                "description": { "type": "string" },
                "orgs": {
                    "type": "array",
                    "items": {
                        "type": "integer",
                        "minimum": 1
                    },
                    "uniqueItems": true
                },
                "active": { "type": "boolean" },
                "options": { "type": "object" },
                "q_type": { "type": "string", "enum": ["S", "L", "S1T", "S2T"] }
            },
            "required": ["q_uuid", "title", "description", "orgs", "q_type", "options", "active"],
            "additionalProperties": false
        },
        "checkOptions": {
            "oneOf": [
                {
                    "properties": {
                        "q_type": { "enum": ["S"] },
                        "options": { "additionalProperties": false }
                    }
                }, {
                    "properties": {
                        "q_type": { "enum": ["L"] },
                        "options": { "additionalProperties": false }
                    }
                }, {
                    "properties": {
                        "q_type": { "enum": ["S1T"] },
                        "options": {
                            "properties": {
                                "scaler1": { "$ref": "#/definitions/scaler" }
                            },
                            "required": ["scaler1"],
                            "additionalProperties": false
                        }
                    }
                }, {
                    "properties": {
                        "q_type": { "enum": ["S2T"] },
                        "options": {
                            "properties": {
                                "scaler1": { "$ref": "#/definitions/scaler" },
                                "scaler2": { "$ref": "#/definitions/scaler" }
                            },
                            "required": ["scaler1", "scaler2"],
                            "additionalProperties": false
                        }
                    }
                }
            ]
        }
    },
    "type": "object",
    "allOf": [
        { "$ref": "#/definitions/checkAll" },
        { "$ref": "#/definitions/checkOptions" },
        { "$ref": "#/definitions/checkActive" }
    ]
}
tv4.addSchema("question.json", question_schema)
let questionsDataSchema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "patternProperties": {
        "^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$": {
            "$ref": "question.json"
        }
    },
    "additionalProperties": false
}

class InputHeader extends React.Component{
    constructor(props) {
        super(props)
    }
    render(){
        return (
            <FormGroup>
                <FormGroup validationState={this.props.title.length > 0 ? "success" : "error"}>
                    <SmallInput
                        label={this.props.titleLabel}
                        value={this.props.title}
                        placeholder={this.props.titlePlaceholder}
                        handleChange={this.props.handleChange.bind(this, "title")}
                    />
                </FormGroup>
                <SmallInput
                    label={this.props.descriptionLabel}
                    value={this.props.description}
                    placeholder={this.props.descriptionPlaceholder}
                    handleChange={this.props.handleChange.bind(this, "description")}
                    bsSize="small"
                />
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
        for (let i=hard_min; i<this.props.scaler.max; ++i) {
            let node = <option key={i} value={i}>{i}</option>
            all_min.push(node)
        }
        for (let i=this.props.scaler.min+1; i<=hard_max; ++i) {
            let node = <option key={i} value={i}>{i}</option>
            all_max.push(node)
        }
        return (
            <Row>
                <Col md={3}>
                    <ControlLabel>from</ControlLabel>
                    <FormControl
                        groupClassName="group-class"
                        value={this.props.scaler.min}
                        componentClass="select"
                        onChange={(event)=>this.handleChange("min", parseInt(event.target.value))}
                    >
                        {all_min}
                    </FormControl>
                </Col>
                <Col md={3}>
                    <ControlLabel>to</ControlLabel>
                    <FormControl
                        groupClassName="group-class"
                        value={this.props.scaler.max}
                        componentClass="select"
                        onChange={(event)=>this.handleChange("max", parseInt(event.target.value))}
                    >
                        {all_max}
                    </FormControl>
                </Col>
                <Col md={3}>
                    <SmallInput
                        value={this.props.scaler.label_min}
                        placeholder="Label Min"
                        disabled={false}
                        label={"Label for " + this.props.scaler.min} 
                        handleChange={this.handleChange.bind(this, 'label_min')}
                    />
                </Col>
                <Col md={3}>
                    <SmallInput
                        value={this.props.scaler.label_max}
                        placeholder="Label Max" 
                        disabled={false}
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
                <ScalerOption
                    scaler={this.props.options.scaler1}
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
                <ScalerOption
                    scaler={this.props.options.scaler1}
                    handleChange={this.handleChange.bind(this, 'scaler1')}
                />
                <ScalerOption
                    scaler={this.props.options.scaler2}
                    handleChange={this.handleChange.bind(this, 'scaler2')}
                />
            </div>
        )
    }
}

class FormItemControl extends React.Component{
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <ListGroupItem>
                <Clearfix>
                    <Button onClick={this.props.handleDelete.bind(this)} className="pull-left">
                        <Glyphicon glyph="trash" />
                    </Button>
                    <div className="pull-left">
                        {this.props.children}
                    </div>
                    <ButtonGroup className="pull-right">
                        <Button onClick={this.props.handlePosition.bind(this, -1)}>
                            <Glyphicon glyph="chevron-up" />
                        </Button>
                        <Button onClick={this.props.handlePosition.bind(this, +1)}>
                            <Glyphicon glyph="chevron-down" />
                        </Button>
                    </ButtonGroup>
                </Clearfix>
            </ListGroupItem>
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
            if (q_type==="S2T") {
                scalers.push("scaler2")
            } else {
                delete data.options.scaler2
            }
            for (let i=0; i<scalers.length; i++) {
                data.options[scalers[i]] = data.options[scalers[i]] || {}
                data.options[scalers[i]].min = data.options[scalers[i]].min || 1
                data.options[scalers[i]].max = data.options[scalers[i]].max || 10
                data.options[scalers[i]].label_min = data.options[scalers[i]].label_min || "Horrible"
                data.options[scalers[i]].label_max = data.options[scalers[i]].label_max || "Terrific"
            }
        }
        if (q_type==="S" || q_type==="L") {
            delete data.options.scaler1
            delete data.options.scaler2
        }
        this.props.handleChange(data)
    }
    handleDataChange(key, value) {
        let data = {...this.props.data}
        data[key] = value
        this.props.handleChange(data)
    }
    handleOrgsChange(all) {
        let data = {...this.props.data}
        let orgs = []
        for (let i = 0; i<all.length; i++) {
            orgs.push(all[i].value)
        }
        data.orgs = orgs
        this.props.handleChange(data)
    }
    render() {
        let ans
        let opt
        switch (this.props.data.q_type) {
            case "S":
                ans = <ShortAnswer/>
                break
            case "L":
                ans = <LongAnswer/>
                break
            case "MC":
                ans = <MultipleChoice
                            options={this.props.data.options}
                            handleChange={this.handleDataChange.bind(this, 'options')}
                />
                break
            case "S1T":
                ans = <ScaleTextAnswer options={this.props.data.options} />
                opt = <OneScalerOption
                            options={this.props.data.options}
                            handleChange={this.handleDataChange.bind(this, 'options')}
                />
                break
            case "S2T":
                ans = <TwoScalesTextAnswer options={this.props.data.options} />
                opt = <TwoScalerOptions
                            options={this.props.data.options}
                            handleChange={this.handleDataChange.bind(this, 'options')}
                />
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
                <Select
                    multi={true}
                    value={this.props.data.orgs}
                    placeholder="Select org(s)"
                    options={this.props.users}
                    onChange={this.handleOrgsChange.bind(this)}
                />
                <br/>
                {opt}
                {opt && <br/>}
                <Panel header="Preview:" collapsible={true} in={false}>
                    <ControlLabel>{this.props.data.title}</ControlLabel>
                    <HelpBlock>{this.props.data.description}</HelpBlock>
                    {ans}
                </Panel>
                <ListGroup fill={true}>
                    <FormItemControl
                        handleDelete={(event) => this.props.handleDelete()}
                        handlePosition={this.props.handlePosition.bind(this)}
                    >
                        <FormControl
                            componentClass="select"
                            value={this.props.data.q_type} 
                            placeholder="select"
                            onChange={(event)=>this.handleTypeChange(event)}
                        >
                            <option value="S">Short answer</option>
                            <option value="L">Long answer</option>
                            <option value="MC">Multiple choice</option>
                            <option value="S1T">Scale with text answer</option>
                            <option value="S2T">Two scales with text answer</option>
                        </FormControl>
                    </FormItemControl>
                </ListGroup>
            </Panel>
        )
    }
}

class Heading extends React.Component{
    constructor(props) {
        super(props)
    }
    handleChange(key, value){
        let data = {...this.props.data}
        data[key] = value
        this.props.handleChange(data)
    }
    render() {
        let name, Name
        switch (this.props.type) {
            case "section":
                name = 'section'
                Name = 'Section'
                break
            case "title":
                name = 'title'
                Name = 'Ttitle'
                break
            default:
                console.error("Type of heading " + this.props.type + " does not exist.")
        }
        return (
            <Panel className="form-group">
                <InputHeader
                        title={this.props.data.title}
                        titleLabel={Name + " name:"}
                        titlePlaceholder={"Untitled " + name}
                        description={this.props.data.description}
                        descriptionLabel={Name + " description:"}
                        descriptionPlaceholder={Name + " description"}
                        handleChange={this.handleChange.bind(this)}
                />
                <ListGroup fill={true}>
                    <FormItemControl
                        handleDelete={this.props.handleDelete.bind(this)}
                        handlePosition={this.props.handlePosition.bind(this)}
                    />
                </ListGroup>
            </Panel>
        )
    }
}

class FormOptions extends React.Component{
    constructor(props) {
        super(props)
    }
    handleGroupsChange(all) {
        let list = []
        for (let i = 0; i<all.length; i++) {
            list.push(all[i].value)
        }
        this.props.handleChange('can_edit', list)
    }
    render() {
        return (
            <Panel className="form-group">
                <ControlLabel>Deadline:</ControlLabel>
                <DateTimeField
                    dateTime={this.props.deadline}
                    format={"YYYY-MM-DDTHH:mm:ssZ"}
                    viewMode={"date"}
                    inputFormat={"DD.MM.YYYY HH:mm"}
                    onChange={this.props.handleChange.bind(this, 'deadline')}
                />
                <br/>
                <ControlLabel>Groups allowed editing:</ControlLabel>
                <Select
                    multi={true}
                    value={this.props.can_edit}
                    placeholder="Select groups that can edit"
                    options={this.props.groups}
                    onChange={this.handleGroupsChange.bind(this)}
                />
            </Panel>
        )
    }
}

class Plus extends React.Component{
    constructor(props) {
        super(props)
    }
    render(){
        return (
            <div>
                <ButtonGroup justified>
                    <Button href="#" bsStyle="info" bsSize="xsmall" onClick={this.props.handleAdd.bind(this, "question")}>
                        <Glyphicon glyph="plus" />&nbsp;Question
                    </Button>
                    <Button href="#" bsStyle="info" bsSize="xsmall" onClick={this.props.handleAdd.bind(this, "section")}>
                        <Glyphicon glyph="plus" />&nbsp;Section
                    </Button>
                    <Button href="#" bsStyle="info" bsSize="xsmall" onClick={this.props.handleAdd.bind(this, "title")}>
                        <Glyphicon glyph="plus" />&nbsp;Title
                    </Button>
                </ButtonGroup>
                <br/>
            </div>
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
        this.props.handleChange(this.props.form_data, questions_data)
    }
    handleQuestionDelete(index) {
        let form_data = {...this.props.form_data}
        let data = form_data.structure.splice(index, 1)[0]
        let questions_data = {...this.props.questions_data}
        questions_data[data.q_uuid].active = false
        this.props.handleChange(form_data, questions_data)
    }
    handleHeadingChange(key, data) {
        let form_data = {...this.props.form_data}
        form_data.structure[key].data = data
        this.props.handleChange(form_data, this.props.questions_data)
    }
    handleHeadingDelete(key) {
        let form_data = {...this.props.form_data}
        let data = form_data.structure.splice(key, 1)
        this.props.handleChange(form_data, this.props.questions_data)
    }
    handleHeaderChange(key, data){
        let form_data = {...this.props.form_data}
        form_data[key] = data
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
    render() {
        let formNodes = []
        let n = this.props.form_data.structure.length
        for (let index = 0; index<n; index++) {
            let x = this.props.form_data.structure[index]
            let node = <Plus key={"plus" + index} handleAdd={this.props.handleAdd.bind(this, index)}/>
            formNodes.push(node)

            if (x.type==='question') {
                node = <Question 
                            key={x.q_uuid}
                            data={this.props.questions_data[x.q_uuid]}
                            users={this.props.users}
                            handleChange={this.handleQuestionChange.bind(this, x.q_uuid)}
                            handlePosition={this.handlePosition.bind(this, index)}
                            handleDelete={this.handleQuestionDelete.bind(this, index)}
                />
            } else if (x.type==='section' || x.type==='title') {
                node = <Heading 
                            key={x.q_uuid} 
                            data={x.data} 
                            type={x.type}
                            q_uuid={x.q_uuid}
                            handleChange={this.handleHeadingChange.bind(this, index)}
                            handlePosition={this.handlePosition.bind(this, index)}
                            handleDelete={this.handleHeadingDelete.bind(this, index)}
                />
            }
            formNodes.push(
                node
            )
        }
        let node = <Plus key={"plus" + n} handleAdd={this.props.handleAdd.bind(this, n)}/>
        formNodes.push(node)
        return (
            <Form onSubmit={this.props.handleSubmit}>
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
                    <FormOptions
                        deadline={this.props.form_data.deadline}
                        can_edit={this.props.form_data.can_edit}
                        groups={this.props.groups}
                        handleChange={this.handleHeaderChange.bind(this)}
                    />
                </FormGroup>
                {formNodes}
                <Button type="submit" bsStyle="primary" bsSize="large" disabled={!this.props.valid}>Save</Button>
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
            users: [],
            groups: [],
            loaded: false,
            created: true,
            valid: true
        }
    }
    loadFormFromServer() {
        let formPromise = $.ajax({
            url: "/api/whole_form/"+this.props.form_id+"/",
            cache: false,
            dataType: 'json'
        }).fail(function(xhr, status, err) {
            console.error("/api/whole_form/"+this.props.form_id+"/", status, err.toString())
        }.bind(this))
        let userPromise = this.getUsersPromise()
        let groupPromise = this.getGroupsPromise()

        $.when(formPromise, userPromise, groupPromise).done(function(wholeFormData, userData, groupData) {
            let users = [], groups = []
            let questions_data = wholeFormData[0].questions
            let form_data = wholeFormData[0].form

            for (let i = 0; i<userData[0].length; i++) {
                users.push({label: userData[0][i].username, value: userData[0][i].id})
            }
            for (let i = 0; i<groupData[0].length; i++) {
                groups.push({label: groupData[0][i].name, value: groupData[0][i].id})
            }
            this.setState({
                questions_data: questions_data,
                form_data: form_data,
                users: users,
                groups: groups,
                loaded: true
            })
        }.bind(this))
    }
    addSomething(index, type) {
        let state = {...this.state}
        let new_something
        let new_id = uuid.v1()
        if (type === "section" || type === "title") {
            new_something = {
                type: type,
                q_uuid: new_id,
                data: {
                    description: "",
                    title: ""
                } 
            }
        } else {
            new_something = {
                type: "question",
                q_uuid: new_id
            }
            let new_data = {
                q_uuid: new_id,
                title: "",
                active: true,
                description: "",
                orgs: [],
                options: {},
                q_type: "S"
            }
            if (state.form_data.id) new_data.form = state.form_data.id
            state.questions_data[new_id] = new_data
        }
        state.form_data.structure.splice(index,0,new_something)
        this.handleChange(state.form_data, state.questions_data)
    }
    handleChange(form_data, questions_data) {
        let valid = tv4.validate(form_data, formDataSchema) 
        valid = valid && tv4.validate(questions_data, questionsDataSchema)
        this.setState({
            form_data: form_data,
            questions_data: questions_data,
            valid: valid
        })
    }
    handleFormSubmit(event) {
        event.preventDefault()
        let state = {...this.state}

        let url = "/api/whole_form/"
        if (state.created) {
            url += state.form_data.id + "/"
        }

        $.ajax({
            url: url,
            dataType: 'json',
            type: state.created ? "PUT" : "POST",
            data: JSON.stringify({
                form: state.form_data,
                questions: state.questions_data
            }),
            headers: {
                "X-CSRFToken": cookie.get('csrftoken'),
                "Content-Type":"application/json; charset=utf-8",
            }
        }).fail(function(xhr, status, err) {
            console.error(url, status, err.toString())
        }).done(function(wholeFormData) {
            let questions_data = wholeFormData.questions
            let form_data = wholeFormData.form
            this.setState({
                questions_data: questions_data,
                form_data: form_data,
                loaded: true,
                created: true
            })
        }.bind(this))
    }
    getUsersPromise() {
        return $.ajax({
            url: "/api/user/",
            dataType: 'json',
            cache: false,
        }).fail( function(xhr, status, err) {
            console.error("/api/user/", status, err.toString())
        })
    }
    getGroupsPromise() {
        return $.ajax({
            url: "/api/group/",
            dataType: 'json',
            cache: false,
        }).fail( function(xhr, status, err) {
            console.error("/api/group/", status, err.toString())
        })
    }
    setDefaultState() {
        let userPromise = this.getUsersPromise()
        let groupPromise = this.getGroupsPromise()
        $.when(userPromise, groupPromise).done(function(userData, groupData) {
            let deadline = moment().add(1, 'month')
            let form_data = {
                title: "Untitled form",
                description: "",
                structure: [],
                deadline: deadline.format("YYYY-MM-DD[T]HH:mm:ss[Z]")
            }
            let users = []
            for (let i = 0; i<userData.length; i++) {
                users.push({label: userData[i].username, value: userData[i].id})
            }
            let groups = []
            for (let i = 0; i<groupData.length; i++) {
                groups.push({label: groupData[i].name, value: groupData[i].id})
            }
            this.setState({
                form_data: form_data,
                questions_data: {},
                users: users,
                groups: groups,
                loaded: true,
                form_id: -1,
                created: false,
                valid: true
            })
        }.bind(this))

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
                <FormList
                    form_data={this.state.form_data}
                    questions_data={this.state.questions_data}
                    users={this.state.users}
                    groups={this.state.groups}
                    handleChange={this.handleChange.bind(this)}
                    handleSubmit={(event) => this.handleFormSubmit(event)}
                    handleAdd={this.addSomething.bind(this)}
                    valid={this.state.valid}
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
    <MyForm form_id={$("div#content").data('form-id')} create={$("div#content").data('create')} />,
    document.getElementById('content')
)