import React from "react"
import ReactDOM from "react-dom"
import $ from 'jquery'
import cookie from 'cookies-js'
import { Input, Button, ButtonGroup } from 'react-bootstrap'

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
            <div className="form-group text-center">
                <label>{this.props.options.label_min}&nbsp;</label>
                <ButtonGroup>
                    {scaleNodes}
                </ButtonGroup>
                <label>&nbsp;{this.props.options.label_max}</label>
            </div>
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
            <Input type="text" value={this.props.value} placeholder={this.props.placeholder} 
                            disabled={this.props.disabled} label={this.props.label} help={this.props.help}
                            onChange={(event) => this.handleChange(event)}
                            bsSize={this.props.bsSize} bsStyle={this.props.bsStyle}/>
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
            <Input type="textarea" value={this.state.value} placeholder={this.props.placeholder} 
                            disabled={this.props.disabled} label={this.props.label} help={this.props.help}
                            onChange={(event) => this.handleChange(event)}
                            bsSize={this.props.bsSize} bsStyle={this.props.bsStyle}/>
        )
    }
}
