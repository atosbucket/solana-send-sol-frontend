import { FC } from 'react'
import styles from '../styles/Home.module.css'
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'

export const SendSolForm: FC = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const sendSol = event => {
        event.preventDefault()
        console.log(`Send ${event.target.amount.value} SOL to ${event.target.recipient.value}`);

        const receiverAddress = event.target.recipient.value;
        const amount = parseFloat(event.target.amount.value);
        if(!receiverAddress || !amount) {
            return
        }
        const transaction = new Transaction();

        const sendSolInstruction = SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: new PublicKey(receiverAddress),
            lamports: amount * LAMPORTS_PER_SOL
        });
        transaction.add(sendSolInstruction);
        sendTransaction(transaction, connection).then((sig) => {
            console.log(sig);
        }).catch((err) => {
            console.error(err);
        });
    }

    return (
        <div>
            <form onSubmit={sendSol} className={styles.form}>
                <label htmlFor="amount">Amount (in SOL) to send:</label>
                <input id="amount" type="text" className={styles.formField} placeholder="e.g. 0.1" required />
                <br />
                <label htmlFor="recipient">Send SOL to:</label>
                <input id="recipient" type="text" className={styles.formField} placeholder="e.g. 4Zw1fXuYuJhWhu9KLEYMhiPEiqcpKd6akw3WRZCv84HA" required />
                <button type="submit" className={styles.formButton}>Send</button>
            </form>
        </div>
    )
}