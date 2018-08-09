import React from 'react';
import PropTypes from 'prop-types';
import './WalletSummary.css';

const WalletSummary = (props) => {
  const {
    address,
    hash160,
    totalTransactions,
    received,
    balance,
  } = props;
  return (
    <div className="summary-wrapper">
      <div className="summary-content">
        <h2 className="table-title">
          Summary
        </h2>
        <table className="summary-table">
          <tbody>
            <tr>
              <td>
                Address
              </td>
              <td>
                {address}
              </td>
            </tr>
            <tr>
              <td>
                Hash 160
              </td>
              <td>
                {hash160}
              </td>
            </tr>
            <tr>
              <td>
                No. Transactions
              </td>
              <td>
                {totalTransactions}
              </td>
            </tr>
            <tr>
              <td>
                Total Received
              </td>
              <td>
                {received}
              </td>
            </tr>
            <tr>
              <td>
                Final Balance
              </td>
              <td>
                {balance}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

WalletSummary.propTypes = {
  address: PropTypes.string.isRequired,
  hash160: PropTypes.string.isRequired,
  totalTransactions: PropTypes.number.isRequired,
  received: PropTypes.number.isRequired,
  balance: PropTypes.number.isRequired,
};

export default WalletSummary;
