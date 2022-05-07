import React, { useEffect, useState, useRef } from "react";

import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faDiscord,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

import { connect } from "./redux/blockchain/blockchainActions";

import { fetchData } from "./redux/data/dataActions";

import * as s from "./styles/globalStyles";

import styled from "styled-components";

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: var(--secondary);
  padding: 10px;
  font-weight: bold;
  color: var(--secondary-text);
  width: 100px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    width: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px solid var(--secondary);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

const CONTAINER_BG = "#15162d";

export const Root = styled.div`
  background-color: #05061d;
`;

export const StyledSection = styled.section`
  min-height: 50vh;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 900px) {
    section h1 {
      font-size: 2rem;
      text-align: center;
    }
    section .text-container {
      flex-direction: column;
    }
  }
`;

export const HeaderSection = styled(StyledSection)`
  background-image: url(/config/images/background.jpg);
  background-repeat: no-repeat;
  min-height: 80vh;
  align-items: center;
  display: flex;

  @media (max-width: 800px) {
    flex-direction: column;
  }
`;

export const StyledContainer = styled.div`
  background-color: ${(props) => props.background};
  padding: 40px;
  width: 70%;

  @media (max-width: 800px) {
    padding: 10px;
    width: 90%;
  }
`;

export const ImagesContainer = styled(StyledContainer)`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  img {
    margin: 10px;
    width: 350px;
    width: calc(100% / 2.5);
  }

  @media (max-width: 480px) {
    img {
      width: 200px;
    }
  }
`;

export const LogoConainer = styled(StyledContainer)`
  text-align: center;
  img {
    min-width: 200px;
    max-width: 500px;
  }

  @media (max-width: 800px) {
    text-align: center;
    margin-top: 50px;
  }
`;

export const Navigation = styled.div`
  position: absolute;
  top: 0;
  padding: 1rem;
  width: 100%;
  background-color: rgba(1, 1, 1, 0.2);
  color: var(--accent-text);
  text-align: right;
`;

export const SocialLink = styled.a`
  margin-left: 16px;
  color: var(--accent-text);
`;

export const CoreTeamContainer = styled.div`
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
`;

function App() {
  const dispatch = useDispatch();

  const blockchain = useSelector((state) => state.blockchain);

  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);

  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);

  const [mintAmount, setMintAmount] = useState(1);

  const [balanceOfUser, setUserBalance] = useState(0);

  const [ownedTokens, setOwnedTokens] = useState([]);

  const [showMintPage, setShowMintPage] = useState(true);
  const [open, setOpen] = React.useState(false);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });
  const getOwnedTokens = async () => {
    if (blockchain.account === "" || blockchain.smartContract === null) {
    } else {
      try {
        const receipt = await blockchain.smartContract.methods
          .walletOfOwner(blockchain.account)
          .call();
        console.log(receipt);
        // window.alert(receipt)
        const baseURIOfNFT = await blockchain.smartContract.methods
          .baseURI()
          .call();
        const urls = await Promise.all(
          receipt.map(async (r) => {
            const requestOptions = { method: "GET" };
            const response = await fetch(
              `${baseURIOfNFT}${r}.json`,
              requestOptions
            );

            const json = await response.json();

            return json;
          })
        );
        setOwnedTokens(urls);
        // console.log(urls);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;

    let gasLimit = CONFIG.GAS_LIMIT;

    let totalCostWei = String(cost * mintAmount);

    let totalGasLimit = String(gasLimit * mintAmount);
    // console.log("Cost: ", totalCostWei);
    // console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(blockchain.account, mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 50) {
      newMintAmount = 50;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
    async function getBalance() {
      if (blockchain.account === "" || blockchain.smartContract === null) {
      } else {
        const bal = await blockchain.smartContract.methods
          .balanceOf(blockchain.account)
          .call();
        setUserBalance(bal);
      }
    }
    getBalance();
  }, [blockchain.account, blockchain.smartContract]);
  useEffect(() => {
    async function getBalance() {
      if (blockchain.account === "" || blockchain.smartContract === null) {
      } else {
        const bal = await blockchain.smartContract.methods
          .balanceOf(blockchain.account)
          .call();
        setUserBalance(bal);
      }
    }
    if (showMintPage === false) {
      getOwnedTokens();
    } else {
      getData();
      getBalance();
    }
  }, [showMintPage]);
  useEffect(() => {
    async function getBalance() {
      if (blockchain.account === "" || blockchain.smartContract === null) {
      } else {
        const bal = await blockchain.smartContract.methods

          .balanceOf(blockchain.account)

          .call();

        setUserBalance(bal);
      }
    }
    getBalance();
  }, [claimingNft]);

  return (
    <Root>
      <HeaderSection>
        <Navigation>
          <h1 className="main1">THE MALVERSE</h1>
          <br></br>
          <h1 className="main2"> BUYING VIRTUAL LAND THROUGH NFT </h1>
          <StyledButton
            onClick={(e) => {
              e.preventDefault();
              setShowMintPage(true);
            }}
            style={{
              margin: "5px",
            }}
          >
            Mint Page
          </StyledButton>   
          <StyledButton
            hidden={
              blockchain.account === "" || blockchain.smartContract === null
                ? 1
                : 0
            }
            onClick={(e) => {
              e.preventDefault();
              setShowMintPage(false);
            }}
            style={{
              margin: "5px",
            }}
          >
            Profile Page
          </StyledButton>
          <SocialLink href="#" target="_blank">
            <FontAwesomeIcon icon={faTwitter} size="lg" />
          </SocialLink>
          <SocialLink href="#" target="_blank">
            <FontAwesomeIcon icon={faDiscord} size="lg" />
          </SocialLink>
          <SocialLink
            href="#"
            target="_blank"
          >
            <FontAwesomeIcon icon={faYoutube} size="lg" />
          </SocialLink>
        </Navigation>
        <StyledContainer>
          <s.Screen>
            <s.Container flex={1} ai={"center"} style={{ padding: 24 }}>
              <s.SpacerSmall />
              <ResponsiveWrapper
                flex={1}
                style={{
                  padding: 50,
                  display: showMintPage === true ? "none" : "inherit",
                }}
                test
              >
                <s.Container
                  flex={2}
                  jc={"center"}
                  ai={"center"}
                  style={{
                    padding: 24,
                    borderRadius: 24,

                    backgroundColor: "rgba(2, 3, 11, 0.4)",
                    boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
                  }}
                >
                  <div
                    style={{
                      width: "80%",
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: "20px",
                    }}
                  >
                    {ownedTokens.map((ownedToken, index) => {
                      const { image, name } = ownedToken;
                      if (image) {
                        return (
                          <div>
                            <img
                              src={`${image}`}
                              width="100%"
                            />
                            <div
                              style={{ textAlign: "center", color: "white" }}
                            >
                              {" "}
                              {name}
                            </div>
                          </div>
                        );
                      }
                    })}
                  </div>
                </s.Container>
              </ResponsiveWrapper>
              <ResponsiveWrapper
                flex={1}
                style={{
                  padding: 24,
                  display: showMintPage === false ? "none" : "inherit",
                }}
                test
              >
                <s.SpacerLarge />
                <s.Container
                  flex={1}
                  jc={"center"}
                  ai={"center"}
                  style={{
                    backgroundColor: "rgba(2, 3, 11, 0.4)",
                    padding: 24,
                    borderRadius: 24,
                    // border: "4px solid var(--secondary)",
                    boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.5)",
                  }}
                >
                  <s.TextTitle
                    style={{
                      textAlign: "center",
                      fontSize: 50,
                      fontWeight: "bold",
                      color: "var(--accent-text)",
                    }}
                  >
                    {data.totalSupply} / {CONFIG.MAX_SUPPLY}
                  </s.TextTitle>
                  <s.TextDescription
                    style={{
                      textAlign: "center",
                      color: "var(--primary-text)",
                    }}
                  >
                    <StyledLink target={"_blank"} href={CONFIG.SCAN_LINK}>
                      <>
                        <h1>Contract Address Link Here </h1>
                      </>
                      {truncate(CONFIG.CONTRACT_ADDRESS, 15)}
                    </StyledLink>
                  </s.TextDescription>
                  <span
                    style={{
                      textAlign: "center",
                    }}
                  >
                    {/* <StyledButton
                style={{
                  margin: "5px",
                }}
                onClick={(e) => {
                  window.open(CONFIG.MARKETPLACE_LINK, "_blank");
                }}
              >
                {CONFIG.MARKETPLACE}
              </StyledButton> */}
                  </span>
                  <s.SpacerSmall />
                  {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
                    <>
                      <s.TextTitle
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                        The sale has ended.
                      </s.TextTitle>
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                        You can still find {CONFIG.NFT_NAME} on
                      </s.TextDescription>
                      <s.SpacerSmall />
                      <StyledLink
                        target={"_blank"}
                        href={CONFIG.MARKETPLACE_LINK}
                      >
                        {CONFIG.MARKETPLACE}
                      </StyledLink>
                    </>
                  ) : (
                    <>
                      <s.TextTitle
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                        1 {CONFIG.SYMBOL} costs {CONFIG.DISPLAY_COST}{" "}
                        {CONFIG.NETWORK.SYMBOL}.
                      </s.TextTitle>
                      <s.TextTitle
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                        {blockchain.account === "" ||
                        blockchain.smartContract === null
                          ? null
                          : "Total NFT Balance : " + balanceOfUser}
                      </s.TextTitle>
                      <s.SpacerXSmall />
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                        Excluding gas fees.
                      </s.TextDescription>
                      <s.SpacerSmall />
                      {blockchain.account === "" ||
                      blockchain.smartContract === null ? (
                        <s.Container ai={"center"} jc={"center"}>
                          <s.TextDescription
                            style={{
                              textAlign: "center",
                              color: "var(--accent-text)",
                            }}
                          >
                            Connect to the {CONFIG.NETWORK.NAME} network
                          </s.TextDescription>
                          <s.SpacerSmall />
                          <StyledButton
                            onClick={(e) => {
                              e.preventDefault();
                              dispatch(connect());
                              getData();
                            }}
                          >
                            CONNECT
                          </StyledButton>
                          {blockchain.errorMsg !== "" ? (
                            <>
                              <s.SpacerSmall />
                              <s.TextDescription
                                style={{
                                  textAlign: "center",
                                  color: "var(--accent-text)",
                                }}
                              >
                                {blockchain.errorMsg}
                              </s.TextDescription>
                            </>
                          ) : null}
                        </s.Container>
                      ) : (
                        <>
                          <s.TextDescription
                            style={{
                              textAlign: "center",
                              color: "var(--accent-text)",
                            }}
                          >
                            {feedback}
                          </s.TextDescription>
                          <s.SpacerMedium />
                          <s.Container ai={"center"} jc={"center"} fd={"row"}>
                            <StyledRoundButton
                              style={{ lineHeight: 0.4 }}
                              disabled={claimingNft ? 1 : 0}
                              onClick={(e) => {
                                e.preventDefault();
                                decrementMintAmount();
                              }}
                            >
                              -
                            </StyledRoundButton>
                            <s.SpacerMedium />
                            <s.TextDescription
                              style={{
                                textAlign: "center",
                                color: "var(--accent-text)",
                              }}
                            >
                              {mintAmount}
                            </s.TextDescription>
                            <s.SpacerMedium />
                            <StyledRoundButton
                              disabled={claimingNft ? 1 : 0}
                              onClick={(e) => {
                                e.preventDefault();
                                incrementMintAmount();
                              }}
                            >
                              +
                            </StyledRoundButton>
                          </s.Container>
                          <s.SpacerSmall />
                          <s.Container ai={"center"} jc={"center"} fd={"row"}>
                            <StyledButton
                              disabled={claimingNft ? 1 : 0}
                              onClick={(e) => {
                                e.preventDefault();
                                claimNFTs();
                                getData();
                              }}
                            >
                              {claimingNft ? "BUSY" : "BUY"}
                            </StyledButton>
                          </s.Container>
                        </>
                      )}
                    </>
                  )}
                  <s.SpacerMedium />
                </s.Container>
                <s.SpacerLarge />
              </ResponsiveWrapper>
              <s.SpacerMedium />
              <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
                <s.TextDescription
                  style={{
                    textAlign: "center",
                    color: "var(--primary-text)",
                  }}
                >
                  {/* please make sure you are connected to the right network (
            {CONFIG.NETWORK.NAME} Mainnet) and the correct address. Please note:
            Once you make the purchase, you cannot undo this action. */}
                </s.TextDescription>
                <s.SpacerSmall />
                <s.TextDescription
                  style={{
                    textAlign: "center",
                    color: "var(--primary-text)",
                  }}
                >
                  {/* We have set the gas limit to {CONFIG.GAS_LIMIT} for the contract to
            successfully mint your NFT. We recommend that you don't lower the
            gas limit. */}
                </s.TextDescription>
              </s.Container>
            </s.Container>
          </s.Screen>
        </StyledContainer>
        <LogoConainer className="land">
          <img src="/config/mahi1.png" width="70%" />
        </LogoConainer>
      </HeaderSection>

      <StyledSection>
        <StyledContainer
          background={CONTAINER_BG}
          className="reveal"
          style={{ color: "var(--primary-text)" }}
        >
          <s.TextTitle style={{ fontSize: 50 }}><h1 className="name">MALVERSE</h1></s.TextTitle>
          <s.SpacerLarge />
          <p className="proj">
          Malverse is a decentralized application(DAPP) where we have created a digital island named "MALVERSE".
          In our platform users can buy sandbox sub-land and view their land details. The sub-land will be
          represented in the form of NFT's.
          </p>
          <s.SpacerLarge />
          <s.SpacerLarge />
          <s.TextTitle style={{ fontSize: 50 }}>
          <h1 className="name">  WHY VIRTUAL LAND NFT'S? </h1>
          </s.TextTitle>
          <s.SpacerLarge />
          <p className="proj">
           Nowadays, people are more attracted to the alternate version of themselves in the virtual world. Buying
            digital assets, digital dress in the form of NFT's are getting attraction. After this, digital land comes into play. 
        
          </p>
          <s.SpacerLarge />
          <p className="proj">
            Currently, digital lands hold 22B+ Market Cap. It's getting increased at a huge rate and seems to get 10x
            Market Cap within few years. Companies like ADIDAS, SAMSUNG, ATARI are already part of virtual land.
          </p>
          <s.SpacerLarge />
          <s.TextTitle style={{ fontSize: 50 }}><h1 className="name">FEATURES</h1></s.TextTitle>
          <p className="proj">
            Set up your wallet. Connect the DAPP with your Metamask wallet. Choose the amount of lanf/NFT you want to buy.
            Click on buy button and confirm the transaction. You can now view your NFT on profile section.
          </p>
          <s.SpacerLarge />
          {/* <p>We are relentless.</p>
          <s.SpacerLarge />
          <p>We work as one.</p>
          <s.SpacerLarge />
          <p>We are Astar Degens.</p>
          <s.SpacerLarge />
          <p>
            70% of the funds raised from NFT minting will be moved to DAO wallet
            to start supporting the builders & projects from the ASTAR and the
            wider Polkadot ecosystem.
          </p> */}
        </StyledContainer>
      </StyledSection>
      <StyledSection>
        <StyledContainer
          background={CONTAINER_BG}
          className="reveal"
          style={{ color: "var(--primary-text)" }}
        >
          <s.TextTitle style={{ fontSize: 50 }}><h1 className="name">CORE TEAM</h1></s.TextTitle>
          <ImagesContainer style={{ padding: "0", margin: "0", width: "100%" }}>
            <img src="/config/images/unnamed.png" alt="Astar Degens NFT preview" />
            <img src="/config/images/milan.png" alt="Astar Degens NFT preview" />
            <img src="/config/images/cde.png" alt="Astar Degens NFT preview" />
            <img src="/config/images/qwe.png" alt="Astar Degens NFT preview" />
          </ImagesContainer>
         
        </StyledContainer>
      </StyledSection>
    </Root>
  );
}

export default App;
