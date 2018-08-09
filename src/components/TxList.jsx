import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tx from './Tx';
import './TxList.css';

export default class TxList extends Component {
  calculateTransaction(tx, i) {
    let currentAddrInputs = 0;
    let currentAddrOutputs = 0;
    const { current, currentBlockHeight } = this.props;
    const allInputs = tx.inputs.reduce((acc, val) => {
      let total = acc;
      if (val.prev_out.addr === current) {
        currentAddrInputs += val.prev_out.value;
      }
      total += val.prev_out.value;
      return total;
    }, 0);
    const allOutputs = tx.out.reduce((acc, val) => {
      let total = acc;
      if (val.addr === current) {
        currentAddrOutputs += val.value;
      }
      total += val.value;
      return total;
    }, 0);
    const fee = allInputs - allOutputs;
    const transactionAmount = currentAddrInputs > 0
      ? (currentAddrInputs - currentAddrOutputs) * -1
      : currentAddrOutputs;

    return (
      <Tx
        isReceiving={currentAddrInputs === 0}
        fee={fee}
        currentAddrInputs={currentAddrInputs}
        currentAddrOutputs={currentAddrOutputs}
        transactionAmount={transactionAmount}
        current={current}
        index={i}
        time={tx.time}
        out={tx.out}
        inputs={tx.inputs}
        hash={tx.hash}
        currentBlockHeight={currentBlockHeight}
        blockHeight={tx.block_height}
      />
    );
  }

  render() {
    const { txs } = this.props;
    return (
      <div className="transactions">
        <ul>
          {txs.map((tx, i) => this.calculateTransaction(tx, i))}
        </ul>
      </div>
    );
  }
}

TxList.propTypes = {
  current: PropTypes.string.isRequired,
  currentBlockHeight: PropTypes.number.isRequired,
  txs: PropTypes.arrayOf(PropTypes.object).isRequired,
};
