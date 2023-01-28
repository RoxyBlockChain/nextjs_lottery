import { useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import {ethers} from "ethers"
import { useNotification } from "web3uikit"

export default function LotteryEntrance(){  
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()  // chainId in Hex
    console.log(parseInt(chainIdHex))    // convert to Int from Hex
    const chainId = parseInt(chainIdHex)
    const raffleAddress =  chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const {entranceFee, setEntranceFee} = useState("0")
    const {numPlayer, setNumPlayer} = useState("0")
    const {recentWinner, setRecentWinner} = useState("0")

    const dispatch = useNotification()

    const {runContractFunction: enterRaffle} = useWeb3Contract({
        abi: abi, 
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        parms:{},
        msgValue: entranceFee 
    })

    const {runContractFunction: getEnteranceFee} = useWeb3Contract({
        abi: abi, 
        contractAddress: raffleAddress,
        functionName: "getEnteranceFee",
        parms:{},
    })
    const {runContractFunction: getNumberOfPlayer} = useWeb3Contract({
        abi: abi, 
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayer",
        parms:{},
    })
    const {runContractFunction: getRecentWinner} = useWeb3Contract({
        abi: abi, 
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        parms:{},
    })
    
    async function updateUI(){
        const entranceFeeFromCall = (await getEnteranceFee()).toString()
        const numerOfPlayerFromCall = (await getNumberOfPlayer()).toString()
        const recentWinnerFromCall = (await getRecentWinner())
        setEntranceFee(entranceFeeFromCall)
        setNumPlayer(numerOfPlayerFromCall)
        setRecentWinner(recentWinnerFromCall)
        //setEntranceFee(ethers.utils.formatUnits(entranceFeeFromCall, "ether"))
        // console.log(entranceFee)  
    }
    
    useEffect(() => {
        if(isWeb3Enabled){
            //try to read raffle entrance Fee 
            updateUI()
        }   
    }, [isWeb3Enabled]) 

    const handleSuccess = async function (tx) {
        await tx.wait(1)
        handleNewNotification(tx)
        updateUI()
    }

    const handleNewNotification = function (){
        dispatch({
            type:"info",
            message:" Transaction Completed ",
            title:" Tx Notification ",
            position:"topR",
            icon: "bell",
        })
    }

    return (
        <div> 
        Hi from the Lottery Entrance 
        { raffleAddress ? (
        <div>
            <button onClick = { async function(){ 
                await enterRaffle({
                    onSuccess: handleSuccess,
                    onError: (error) => console.log(error),
                })
                }}
            > Enter Raffle </button>
            Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH
            Number of Playes: {numPlayer}
            Recent Winner: {recentWinner}
            </div>
            
        ) : (
        <div> No Raffle address detected </div>
        )}
        </div>
    )
}