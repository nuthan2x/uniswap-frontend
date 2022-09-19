/* eslint-disable no-unused-vars */

import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import '../css/App.css';
import ConnectButton from './ConnectButton';
import PageButton from './PageButton';
import {GearFill } from 'react-bootstrap-icons';
import ConfigModal from './ConfigModal';
import { BeatLoader } from 'react-spinners';
import CurrencyField from './currencyfield';
import {getWethContract , getDaiContract , getPrice , runSwap} from './AlphaRouterService';


function App() {

  const [provider, setprovider] = useState(undefined);
  const [signer, setsigner] = useState(undefined);
  const [signeraddress, setsigneraddress] = useState(undefined);

  const [slippageAmount, setslippageAmount] = useState(1);
  const [deadlineMinutes, setdeadlineMinutes] = useState(10);
  const [showModal , setshowModal ] = useState(undefined);

  const [inputAmount, setinputAmount] = useState(undefined);
  const [outputAmount, setoutputAmount] = useState(undefined);
  const [loading, setloading] = useState(undefined);
  const [ratio, setratio] = useState(undefined);
  const [transaction, settransaction] = useState(undefined);
  const [wethContract, setwethContract] = useState(undefined);
  const [daicontract, setdaicontract] = useState(undefined);
  const [wethAmount, setwethAmount] = useState(undefined);
  const [daiAmount, setdaiAmount] = useState(undefined);

  useEffect(() => {
      const onLoad = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setprovider(provider);
        setwethContract(getWethContract());
        setdaicontract(getDaiContract());
      }
      onLoad();
    
  }, []); 

  const getsigner = async (provider) => {
    provider.send("eth_requestAccounts",[]);
    const signer = await  provider.getSigner();
    setsigner(signer);
  }

  const isConnected = () => signer !== undefined ;

  const getWalletAddress = async () => {
    const account = await signer.getAddress()
    setsigneraddress(account);

    const wethAmount = await wethContract.balanceOf(account);
    setwethAmount(new ethers.utils.formatEther(wethAmount));

    const daiAmount = await daicontract.balanceOf(account);
    setdaiAmount(new ethers.utils.formatEther(daiAmount));
  }

  const getSwapPrice = async (inputAmount) => {
    inputAmount && setloading(true);
    setinputAmount(inputAmount);
    let deadline = (new Date().getTime() / 1000) + (deadlineMinutes * 60)
    const swap = await getPrice(inputAmount,slippageAmount,deadline,signeraddress);
    settransaction(swap[0]);
    setoutputAmount(swap[1]);
    setratio(swap[2])
    setloading(false);

  }



  if (signer !== undefined) {
    getWalletAddress()
  }

  return (
    <>
    <div className="App">
      <div className="appNav">
        <div className="my-2 buttonContainer buttonContainerTop">
          <PageButton name={"Swap"} isBold={true} />
          <PageButton name={"Pool"} />
          <PageButton name={"Vote"} />
          <PageButton name={"Charts"} />
        </div>

        <div className="rightNav">
          <div className="connectButtonContainer">
            <ConnectButton
              provider={provider}
              isConnected={isConnected}
              signerAddress={signeraddress}
              getSigner={getsigner}
            />
          </div>
          <div className="my-2 buttonContainer">
            <PageButton name={"..."} isBold={true} />
          </div>
        </div>
    </div>

    <div className="appBody">
        <div className="swapContainer">
          <div className="swapHeader">
            <span className="swapText">Swap</span>
            <span className='gearContainer' onClick={() => setshowModal(true)}>
              <GearFill  />
            </span>
            {showModal && (
              <ConfigModal
                onClose={() => setshowModal(false)}
                setDeadlineMinutes={setdeadlineMinutes}
                deadlineMinutes={deadlineMinutes}
                setSlippageAmount={setslippageAmount}
                slippageAmount={slippageAmount} />
            )}
         </div>

         <div className="swapBody">
            <CurrencyField
              field="input"
              tokenName="WETH"
              getSwapPrice={getSwapPrice}
              signer={signer}
              balance={wethAmount} />
            <CurrencyField
              field="output"
              tokenName="DAI"
              value={outputAmount}
              signer={signer}
              balance={daiAmount}
              spinner={BeatLoader}
              loading={loading} />
          </div>

          <div className="ratioContainer">
            {ratio && (
              <>
                {`1 UNI = ${ratio} WETH`}
              </>
            )}
          </div>

          <div className="swapButtonContainer">
            {isConnected() ? (
              <div
                onClick={() => runSwap(transaction, signer)}
                className="swapButton"
              >
                Swap
              </div>
            ) : (
              <div
                onClick={() => getsigner(provider)}
                className="swapButton"
              >
                Connect Wallet
              </div>
            )}
          </div>

        </div>

    </div>
    <div >
  
      <footer>
          <p>🚩  <span><a href="https://twitter.com/nuthan_2x" className='a' >@nuthan_2x</a></span>  🚩 {new Date().getFullYear()}</p>
      </footer>
            
    </div>






  </div>

  

  </>
  );
}

export default App;
