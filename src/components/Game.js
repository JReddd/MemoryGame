import React, {Component} from 'react';
import { Row, Col, Button, Radio } from 'antd';
import MyCard from './MyCard';
import initCards from '../utils/initCards';
const RadioGroup = Radio.Group;

class Game extends Component {

    constructor(props) {
        super(props);
        this.renderCards = this.renderCards.bind(this);
        this.isMatch = this.isMatch.bind(this);
        this.reset = this.reset.bind(this);
        this.onChange = this.onChange.bind(this);

        this.state = {
            cards: initCards(18), //initCard(32),
            lastCard: null,
            player1: true,
            p1MatchesTime: 0,
            p2MatchesTime: 0,
            hold: false,
            p1Time: 0,
            p2Time:0,
            bestScore:0,
            difficultyLevel: 18
        }
    }

    componentDidMount() {
        this.intervalID = setInterval(() => this.tick(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.intervalID);
    }

    tick() {
        let p1UsedTime = this.state.p1Time;
        let p2UsedTime = this.state.p2Time;
        this.setState({
            p1Time: this.state.player1? ++p1UsedTime : p1UsedTime,
            p2Time: this.state.player1? p2UsedTime : ++p2UsedTime
        });
    }

    isMatch(value, id) {

        if (this.state.hold) return;

        const cards = this.state.cards;
        cards[id].flipped = true;
        this.setState({cards, hold: true});
        const lastCard = this.state.lastCard;
        if (lastCard) {
            if (value === lastCard.value) {
                const lastP1MatchesTime = this.state.p1MatchesTime;
                const p1MatchesTime = this.state.player1? lastP1MatchesTime + 1 : lastP1MatchesTime;
                const lastP2MatchesTime = this.state.p2MatchesTime;
                const p2MatchesTime = this.state.player1? lastP2MatchesTime : lastP2MatchesTime + 1;
                const bestScore = this.state.bestScore;
                cards[id].matched = true;
                cards[lastCard.id].matched = true;
                cards[lastCard.id].flipped = true;
                this.setState({
                    cards,
                    lastCard: null,
                    hold: false,
                    p1MatchesTime: p1MatchesTime,
                    p2MatchesTime: p2MatchesTime,
                    bestScore: Math.max(p1MatchesTime, p2MatchesTime, bestScore)
                });
            } else {
                setTimeout(() => {
                    cards[id].flipped = false;
                    cards[lastCard.id].flipped = false;
                    this.setState({
                        cards,
                        lastCard: null,
                        hold: false,
                        player1: !this.state.player1
                    });
                }, 1000);
            }
        } else {
            this.setState({
                lastCard: {value, id},
                hold: false
            });
        }
    }

    reset() {
        this.setState({
            cards: initCards(18),
            lastCard: null,
            locked: false,
            player1: true,
            p1MatchesTime: 0,
            p2MatchesTime: 0,
            p1Time: 0,
            p2Time:0,
            difficultyLevel: 18
        });
    }

    renderCards(cards) {

        const span = this.state.difficultyLevel === 18? 4 : 3;

        const allCards = cards.map((card, i) => {
            return (
                <Col span={span} key={i} style={{}}>
                    <MyCard
                        value={card.value}
                        id={i}
                        matched={card.matched}
                        flipped={card.flipped}
                        isMatch={this.isMatch}/>
                </Col>
            )
        });

        return (
            <div><Row>{allCards}</Row></div>
        );
    }

    onChange(e) {
        const value =  e.target.value;
        this.setState({
            lastCard: null,
            locked: false,
            player1: true,
            p1MatchesTime: 0,
            p2MatchesTime: 0,
            p1Time: 0,
            p2Time:0,
            cards: initCards(value),
            difficultyLevel:value
        });
    }

    render() {

        const btnText = (this.state.p1MatchesTime + this.state.p2MatchesTime) === this.state.cards.length / 2 ? 'You win! Wanna play again?':'Reset';
        const player = this.state.player1 ? "player1's turn" : "player2's turn";

        return (
            <div style={ {padding: '20px', textAlign:'center'}}>
                <h1 style={{textAlign: 'center'}}>Memory Game</h1>
                Choose the difficulty level : {' '}
                <RadioGroup onChange={this.onChange} value={this.state.difficultyLevel}>
                    <Radio value={18}>6 * 6</Radio>
                    <Radio value={32}>8 * 8</Radio>
                </RadioGroup>
                <Row>
                    <Col span={12}>Player1's score: {this.state.p1MatchesTime} ; time: {this.state.p1Time}</Col>
                    <Col span={12}>Player2's score: {this.state.p2MatchesTime} ; time: {this.state.p2Time}</Col>
                </Row>
                <p>Best score: {this.state.bestScore}</p>
                <h3>{player}</h3>
                {this.renderCards(this.state.cards)}
                <Button type='danger' onClick={this.reset} style={{display: 'block', margin: '0 auto'}}>
                    {btnText}
                </Button>
            </div>

        )
    }
}

export default Game;