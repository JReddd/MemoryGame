import React, {Component} from 'react';
import { Card } from 'antd';

class MyCard extends Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);

    }

    handleClick(){
        if (!this.props.flipped) {
            this.props.isMatch(this.props.value, this.props.id);
        }
    }

    render() {

        const backgroundColor = this.props.flipped? "green" : "orange";
        const textColor = this.props.flipped? "white" : "orange";

        const style = {
            width: '80px',
            height: '80px',
            margin: '10px auto',
            border: '1px solid yellow',
            textAlign: 'center',
            backgroundColor: backgroundColor
        };

        return (
            <Card style={style} onClick={this.handleClick}>
                <p style={{color: textColor}}>{this.props.value}</p>
            </Card>
        )
    }
}

export default MyCard;