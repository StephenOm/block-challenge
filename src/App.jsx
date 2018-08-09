import React, { Component } from 'react';
import axios from 'axios';
import Websocket from 'react-websocket';
import WalletSummary from './components/WalletSummary';
import TxList from './components/TxList';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txs: [],
      currentAddress: '',
      hash160: null,
      totalTransactions: null,
      received: null,
      balance: null,
      currentBlockHeight: null,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const addressQuery = event.target[0].value;
    const self = this;

    axios.all([
      axios.get('https://blockchain.info/q/getblockcount'),
      axios.get(`https://cors-anywhere.herokuapp.com/https://blockchain.info/rawaddr/${addressQuery}`),
    ])
      .then(axios.spread((blockHeight, walletRes) => {
        const { data } = walletRes;
        self.setState({
          txs: data.txs,
          currentAddress: addressQuery,
          hash160: data.hash160,
          totalTransactions: data.n_tx,
          received: data.total_received,
          balance: data.final_balance,
          currentBlockHeight: blockHeight.data,
        });
      }));
  }

  handleData(data) {
    let parsedData = {};
    parsedData = JSON.parse(data);
    if (parsedData.op === 'utx') {
      this.setState(prevState => ({ txs: [parsedData.x, ...prevState.txs] }));
    }
  }

  subscribeToAddress() {
    const { currentAddress } = this.state;
    this.refWebSocket.state.ws.send(`{"op":"addr_sub", "addr":"${currentAddress}"}`);
  }

  render() {
    const {
      currentAddress,
      hash160,
      totalTransactions,
      received,
      balance,
      txs,
    } = this.state;
    return (
      <div>
        <nav className="clearfix">
          <div className="title">
            <img alt="Blockchain Logo" className="title-image" src="https://www.blockchain.com/Resources/white-blockchain.svg" />
          </div>
          <form className="search" onSubmit={this.handleSubmit}>
            <input type="text" name="search_text" placeholder="Enter a wallet address" />
          </form>
        </nav>
        {
          currentAddress.length
            ? [
              <Websocket
                url="wss://ws.blockchain.info/inv"
                onMessage={this.handleData.bind(this)}
                onOpen={this.subscribeToAddress.bind(this)}
                ref={(Websocket) => { this.refWebSocket = Websocket; }}
                />,
              <WalletSummary
                address={currentAddress}
                hash160={hash160}
                totalTransactions={totalTransactions}
                received={received}
                balance={balance}
                />,
              <div className="transactions-wrapper">
                {txs.length
                  ? (
                    <TxList
                      current={this.state.currentAddress}
                      txs={this.state.txs}
                      currentBlockHeight={this.state.currentBlockHeight}
                        />
                  )
                  : null}
              </div>,
            ]
            : null
        }
      </div>
    );
  }
}

export default App;
