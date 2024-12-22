import React, { useEffect, useState, useRef, useCallback } from "react";
import {
    Send,
    EditOutlined,
    Close,
    Done,
    CurrencyBitcoin,
} from "@mui/icons-material";
import { PinataSDK } from "pinata-web3";
import { Modal, ThemeProvider, Button } from "@gravity-ui/uikit";

import "@gravity-ui/uikit/styles/fonts.css";
import "@gravity-ui/uikit/styles/styles.css";

import "./MessageForm.css";

import { useChatMessage } from "../../../hooks";

interface MessageFormProps {
    submitFunc: (message: string) => void;
}

export function MessageForm(props: MessageFormProps): JSX.Element {
    const [message, setMessage] = useState<string>("");
    const [file, setFile] = useState("");
    const [open, toggleOpen] = useState(false);
    const [price, setPrice] = useState(undefined);
    const [assetId, setAssetId] = useState(undefined);
    const inputFileRef = useRef();
    const submitRef = useRef();

    const { editingMessage, setDeleteWindow, setEditingMessage } =
        useChatMessage();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setMessage(event.target.value);
    };

    const handleModalSubmit = useCallback(() => {
        console.log(file, price);
        props.submitFunc(`${file} ${price} ${assetId}`);
        toggleOpen(false);
    }, [file, price, assetId]);
    const handleSubmit = useCallback(
        (event: React.FormEvent<HTMLFormElement>): void => {
            event.preventDefault();
            console.log("here", message);
            props.submitFunc(message);
            setMessage("");
        },
        [message]
    );

    const handleCancel = (): void => {
        setEditingMessage(null);
        setMessage("");
    };

    const handleFileChange: React.ChangeEventHandler<
        HTMLInputElement
    > = async (event: { target: { files: FileList | null } }) => {
        const newFile = event.target.files[0];
        let fileLink;

        const pinata = new PinataSDK({
            pinataJwt:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJhYzFiMDA5My1mNDc3LTQwZjAtYmJhMS02NWFlMzA4MThjM2EiLCJlbWFpbCI6Im1pa2hhaWwuZEBtaWtpLmRpZ2l0YWwiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiNWFiOTE3ZGI1ZjJiODJiYzdiZjUiLCJzY29wZWRLZXlTZWNyZXQiOiJhYWYxYjZmZTU5MjMwNDU3MWFjM2NiYjc1NzYzNWVhMmUwZjk0YTJmNzA1ZDdlZWMyZjFmMmU1Yjg4MjQ2ZjM2IiwiZXhwIjoxNzY2NDM0NzAwfQ.oxA38OZrLXBhIWx0gOkUNAqVprdnFc3KUW-HCBwxo3k",
            pinataGateway: "fuchsia-rainy-kangaroo-898.mypinata.cloud",
        });

        //5ab917db5f2b82bc7bf5
        //aaf1b6fe592304571ac3cbb757635ea2e0f94a2f705d7eec2f1f2e5b88246f36
        const filePrefix =
            "https://fuchsia-rainy-kangaroo-898.mypinata.cloud/ipfs/";

        fileLink = await pinata.upload.file(newFile);
        console.log(fileLink);

        const assetId = "";

        // setAssetId(id);

        if (fileLink) {
            setFile(filePrefix + fileLink.IpfsHash);
            toggleOpen(true);
        }
    };

    useEffect(() => {
        if (editingMessage) {
            setMessage(editingMessage.text);
            setDeleteWindow(null);
        }
    }, [editingMessage]);

    return (
        <ThemeProvider theme="light">
            <form className="message-form" onSubmit={handleSubmit}>
                <div className="message-input">
                    {editingMessage && (
                        <div className="editing-message-preview">
                            <EditOutlined className="editing-message-icon" />
                            <div className="editing-message-text-wrapper">
                                <div className="editing-message-text">
                                    <p>Edit Message</p>
                                    <small>{editingMessage.text}</small>
                                </div>
                            </div>
                            <Close
                                className="editing-message-close-icon"
                                onClick={handleCancel}
                            />
                        </div>
                    )}
                    <input
                        type="text"
                        placeholder="Message"
                        value={message}
                        onChange={handleChange}
                    />
                </div>

                <button ref={submitRef} className="send-button" type="submit">
                    {editingMessage ? <Done /> : <Send />}
                </button>

                <button
                    className="nft-button"
                    onClick={() => inputFileRef.current.click()}
                >
                    <CurrencyBitcoin />
                </button>

                <input
                    accept=".jpg, .jpeg, .png, .webp"
                    className="hidden"
                    onChange={handleFileChange}
                    type="file"
                    ref={inputFileRef}
                />

                <Modal open={open}>
                    <input
                        type={"number"}
                        onChange={(e) => {
                            setPrice(e.target.value);
                        }}
                        placeholder="NFT price"
                    />
                    <Button view="action" onClick={handleModalSubmit}>
                        {"Send"}
                    </Button>
                </Modal>
            </form>
        </ThemeProvider>
    );
}
