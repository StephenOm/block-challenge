import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Tx.css';

class Tx extends Component {
  renderInputs() {
    const existingAddrs = {};
    const { isReceiving, inputs, current } = this.props;
    return isReceiving
      ? (
        <ul className="inputs">
          {inputs.reduce((acc, individualInput) => {
            const { addr } = individualInput.prev_out;
            if (!existingAddrs[addr]) {
              existingAddrs[addr] = true;
              acc.push(
                <li key={addr}>
                  <div>
                    {addr}
                  </div>
                </li>,
              );
            }
            return acc;
          }, [])}
        </ul>
      )
      : (
        <ul className="inputs">
          <li>
            {current}
          </li>
        </ul>
      );
  }

  renderOutputs() {
    const { out, isReceiving, current } = this.props;
    return (
      <ul className="outputs">
        {out.reduce((acc, individualOut) => {
          if (!isReceiving || individualOut.addr === current) {
            acc.push(
              <li key={individualOut.addr}>
                <div className="clearfix">
                  <div className="output-address">
                    {individualOut.addr}
                  </div>
                  <div className="output-value">
                    {individualOut.value / 100000000}
                  </div>
                </div>
              </li>,
            );
          }
          return acc;
        }, [])}
      </ul>
    );
  }

  render() {
    const {
      isReceiving,
      transactionAmount,
      index,
      time,
      hash,
      currentBlockHeight,
      blockHeight,
    } = this.props;
    const date = new Date(time * 1000);
    const timeString = `${date.toDateString()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

    const confirmations = blockHeight !== undefined
      ? currentBlockHeight - blockHeight + 1
      : null;
    return (
      <li className="transaction-item" key={index}>
        <div className="transaction-wrapper">
          <div className="transaction-id clearfix">
            <div className="transaction-hash">
              {hash}
            </div>
            <div className="transaction-date">
              {timeString}
            </div>
          </div>
          <div className="transaction-list">
            <div className="inputs-wrapper">
              {this.renderInputs()}
            </div>
            {isReceiving
              ? <img alt="green arrow" className="arrow" src="https://www.blockchain.com/Resources/arrow_right_green.png" />
              : <img alt="red arrow" className="arrow" src="https://www.blockchain.com/Resources/arrow_right_red.png" />}
            <div className="outputs-wrapper">
              {this.renderOutputs()}
            </div>
          </div>
          <div className="amount-wrapper clearfix">
            <div className={`transaction-amount ${isReceiving ? 'received' : 'sent'}`}>
              {transactionAmount / 100000000}
            </div>
            <div className="transaction-confirmations">
              {confirmations > 0 && confirmations < 101 ? confirmations : 'Unconfirmed'}
            </div>
          </div>
        </div>
      </li>
    );
  }
}

Tx.defaultProps = {
  blockHeight: undefined,
};

Tx.propTypes = {
  current: PropTypes.string.isRequired,
  isReceiving: PropTypes.bool.isRequired,
  out: PropTypes.arrayOf(PropTypes.object).isRequired,
  inputs: PropTypes.arrayOf(PropTypes.object).isRequired,
  transactionAmount: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  time: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  hash: PropTypes.string.isRequired,
  currentBlockHeight: PropTypes.number.isRequired,
  blockHeight: PropTypes.number,
};

export default Tx;
