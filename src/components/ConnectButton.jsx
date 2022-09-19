import React from "react";
import PageButton from "./PageButton";


export default function ConnectButton(props){

    const { isConnected, signerAddress, getSigner, provider } = props

    const Displayaddress = `${signerAddress?.substring(0,7)}...${signerAddress?.substring(38,42)}`;
    return (
       <>
       {isConnected() ?
        (<div className="buttonContainer">
            <PageButton name={Displayaddress} isBold={true}/>
        </div>) :
        (<div  className="btn my-2 connectButton" onClick={() => getSigner(provider)}>
            Connect Wallet
        </div>)}
        
        </>
    )
}