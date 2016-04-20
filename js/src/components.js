import React from "react"
import ReactDOM from "react-dom"
import $ from 'jquery'
import cookie from 'cookies-js'
import { FormGroup, HelpBlock, ControlLabel, FormControl, Button, ButtonGroup } from 'react-bootstrap'

export class Scaler extends React.Component {
    //bude stateless casom, ked budem robit fill
    constructor(props) {
        super(props);
        this.state = { activeNumber: -1 }
    }
    handleSelect(id, event) {
        this.setState({
            activeNumber: id
        })
    }
    render() {
        let scaleNodes = []
        for (let i = parseInt(this.props.options.min); i <= parseInt(this.props.options.max); i++) { 
            let node = (
                <Button key={i} active={this.state.activeNumber===i} onClick={this.handleSelect.bind(this, i)} 
                                disabled={this.props.be_disabled}>{i}</Button>
            )
            scaleNodes.push(node)
        }
        return (
            <FormGroup className="text-center">
                <label>{this.props.options.label_min}&nbsp;</label>
                <ButtonGroup>
                    {scaleNodes}
                </ButtonGroup>
                <label>&nbsp;{this.props.options.label_max}</label>
            </FormGroup>
        )
    }
}

export class SmallInput extends React.Component{
    constructor(props) {
        super(props);
    }
    handleChange(event) {
        this.props.handleChange(event.target.value)
    }
    render() {
        return (
            <div>
                {this.props.label && <ControlLabel>{this.props.label}</ControlLabel>}
                {this.props.description && <HelpBlock>{this.props.description}</HelpBlock>}
                <FormControl type="text" value={this.props.value} placeholder={this.props.placeholder} 
                            disabled={this.props.disabled} onChange={(event) => this.handleChange(event)}
                            bsSize={this.props.bsSize} bsStyle={this.props.bsStyle}/>
            </div>
        )
    }
}

export class BigInput extends React.Component{
    constructor(props) {
        super(props);
        this.state = {'value': props.value}
    }
    handleChange(event) {
        this.props.handleChange(event.target.value)
    }
    render() {
        return (
            <div>
                {this.props.label && <ControlLabel>{this.props.label}</ControlLabel>}
                {this.props.description && <HelpBlock>{this.props.description}</HelpBlock>}
                <FormControl componentClass="textarea" value={this.state.value} placeholder={this.props.placeholder} 
                            disabled={this.props.disabled} onChange={(event) => this.handleChange(event)}
                            bsSize={this.props.bsSize} bsStyle={this.props.bsStyle}/>
            </div>
        )
    }
}
