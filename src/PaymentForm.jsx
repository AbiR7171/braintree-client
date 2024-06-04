import React, {useEffect, useContext, useState} from 'react'
import 'react-bootstrap/dist/react-bootstrap'
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import { PaymentContext } from './PaymnetProvider';

export const PaymentForm = (props) =>
{
    const paymentContext = useContext(PaymentContext);
    const {tokenObject, paymentTransaction, isPaymentMade, setIsPaymentMade, transactionData, setTransactionData} = paymentContext;
    const [amount, setAmount] = useState(200);
    console.log(amount);
    
    useEffect(()=> {
        renderPayment();
        
    });

    const renderPayment = () => {
        let token = tokenObject;
        let authorization = token;
        var form = document.querySelector('#cardForm');
        window.braintree.client.create({
            authorization: authorization
        }, (err, clientInstance) => {
            if (err) {
                console.log(err);
                return;
            }
            createHostedFields(clientInstance, form);
        });

        const createHostedFields = (clientInstance, form) => {
            window.braintree.hostedFields.create({
                client: clientInstance,
                styles: {
                    'input': {
                        'font-size': '16px',
                        'font-family': 'courier, monospace',
                        'font-weight': 'lighter',
                        'color': '#ccc'
                    },
                    ':focus': {
                        'color': 'black'
                    },
                    '.valid': {
                        'color': '#8bdda8'
                    }
                },
                fields: {
                    number: {
                        selector: '#card-number',
                        placeholder: '4111 1111 1111 1111'
                    },
                    cvv: {
                        selector: '#cvv',
                        placeholder: '123'
                    },
                    expirationDate: {
                        selector: '#expiration-date',
                        placeholder: 'MM/YYYY'
                    },
                    postalCode: {
                        selector: '#postal-code',
                        placeholder: '11111'
                    }
                }
            }, function (err, hostedFieldsInstance) {
                var teardown = function (event) {
                    event.preventDefault();
                    var formIsInvalid = false;
                    var state = hostedFieldsInstance?.getState();
                    Object.keys(state.fields).forEach(function (field) {
                        if (!state.fields[field].isValid) {
                            $(state.fields[field].container).addClass('is-invalid');
                            formIsInvalid = true;
                        }
                    });

                    if (formIsInvalid) {
                        alert("Card input is not valid");
                        return;
                    }

                    hostedFieldsInstance.tokenize({
                        cardholderName: $('#cc-name').val()
                    }, function (err, payload) {
                        if (err) {
                            console.error(err);
                            return;
                        }

                        console.log(payload.nonce);
                        paymentTransaction({ nonce: payload.nonce, amount });
                    });
                };

                form.addEventListener('submit', teardown, false);
            });
        }
    };

    const onCancelPayment = () => {
        setIsPaymentMade(false);
        setTransactionData({});
    };

    const gotoPayment = () => {
        setIsPaymentMade(false);
        setTransactionData({});
    };

    //38520000009814  38520000009814

    return (
        <>
            {isPaymentMade ?
                <div className="demo-frame">
                    <h3>Server returns {transactionData?.success ? 'with success' : 'with failure'} with below data</h3>
                    <div>
                        Amount: {transactionData?.transaction !== undefined ? transactionData?.transaction.amount : 'N/A'} <br />
                        PaymentInstrumentType = {transactionData?.transaction !== undefined ? transactionData?.transaction.paymentInstrumentType : 'N/A'} <br />
                        Status = {transactionData?.transaction !== undefined ? transactionData?.transaction.status : 'N/A'} <br />
                        Transaction id = {transactionData?.transaction !== undefined ? transactionData?.transaction.id : 'N/A'} <br />
                    </div>
                    <div>
                        <a className="btn btn-primary" onClick={gotoPayment}>Go back to payment page</a>
                    </div>
                </div> :

                <div className="demo-frame">
                    <form method="post" id="cardForm">
                        <label className="hosted-fields--label" htmlFor="amount">Amount</label>
                        <input
                            type="text"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="form-control"
                        />
   <label className="hosted-fields--label" for="card-number">Card Number</label>
                        <div id="card-number" className="hosted-field"></div>

                        <label className="hosted-fields--label" for="expiration-date">Expiration Date</label>
                        <div id="expiration-date" className="hosted-field"></div>

                        <label className="hosted-fields--label" for="cvv">CVV</label>
                        <div id="cvv" className="hosted-field"></div>

                        <label className="hosted-fields--label" for="postal-code">Postal Code</label>
                        <div id="postal-code" className="hosted-field"></div>
                     


                        <div className="button-container">
                            <input style={{ marginRight: '2px' }} type="submit" className="btn btn-primary" value="Purchase" id="submit" />
                            &nbsp;<a style={{ marginRight: '2px' }} className="btn btn-warning" onClick={onCancelPayment}>Cancel</a>
                        </div>
                    </form>
                </div>
            }
        </>
    );
};
