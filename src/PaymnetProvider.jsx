import React, {createContext, useEffect, useState} from 'react';
import {Urls} from './Urls';
import axios from 'axios';

export const PaymentContext = createContext();

export const PaymentProvider = props => {

    const[tokenObject, setTokenObject] = useState({});
    const[isPaymentMade, setIsPaymentMade] = useState(false);
    const[transactionData, setTransactionData] = useState({});

    useEffect(()=> {
        getToken();
    }, []);

    const getToken = async ()=> {
       let result = await axios.get(Urls.InitializeUrl, {withCredentials: true})
       console.log(result.data.data);
       const tokenObject = result.data.data;
       setTokenObject(tokenObject);
    }

    const paymentTransaction = async (data) => {
        console.log(data);
        console.log(Urls.ConfirmUrl);
        let result = await axios.post(Urls.ConfirmUrl, data, {withCredentials: true});
        console.log(result);
        setTransactionData(result.data.data);
        setIsPaymentMade(true);
        
    }

    return(
        <PaymentContext.Provider value={{tokenObject, paymentTransaction, isPaymentMade, setIsPaymentMade, transactionData, setTransactionData}}>
            {props.children}
        </PaymentContext.Provider>
    );
}