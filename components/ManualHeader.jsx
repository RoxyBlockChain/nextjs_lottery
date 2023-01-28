import { useMoralis } from "react-moralis"
import { useEffect } from "react"

export default function ManualHeader(){

    const {enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading } = useMoralis()
    
    //isWeb3Enabled will be rue if MetaMask Conected, otherwise it will be False.
    //useEffect having function with Dependent, if dependent value change, it will rerun funvtion and Render it.
    useEffect(() => {
        if(isWeb3Enabled) return
        if(typeof window !== "undefined"){
            if(window.localStorage.getItem("Connected"))
               enableWeb3()
        }
    }, [isWeb3Enabled])
    
    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            console.log(` Account changed to ${account}`)
            if (account == null){
                window.localStorage.removeItem("Connected")
                deactivateWeb3()
                console.log(" Null Account Connected")
            }
        })
    }, [])

    return(<div> 
        { account ? (<div> Connected to {account.slice(0,6)}...{account.slice(account.length-4)}</div>) : 
            (<button 
                onClick={async () => {
                    await enableWeb3()
                    if (typeof window !== "undefined"){
                    window.localStorage.setItem("Connected", "Injected")
                    }
                }}
                disabled = {isWeb3EnableLoading}
                >Connect</button>)
        }
        </div>)
}