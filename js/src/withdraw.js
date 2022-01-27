"use strict";

const contractAbi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TotalWithdrawn","type":"event"},{"inputs":[{"internalType":"address","name":"wallet","type":"address"}],"name":"getWalletInfo","outputs":[{"internalType":"uint256","name":"totalAmount","type":"uint256"},{"internalType":"uint256","name":"alreadyWithdrawn","type":"uint256"},{"internalType":"uint256","name":"availableToWithdraw","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawAll","outputs":[],"stateMutability":"nonpayable","type":"function"}];

/**
 * Example JavaScript code that interacts with the page and Web3 wallets
 */

 // Unpkg imports
const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
const Fortmatic = window.Fortmatic;
const evmChains = window.evmChains;

// Web3modal instance
let web3Modal;
let web3;
let contract;

// Chosen wallet provider given by the dialog window
let provider;

// Address of the selected account
let selectedAccount;

// Withdraw variables
let total;
let withdrawn;
let available;

/**
 * Add comas for number
 */
function addSpaces(nStr) {
  nStr += '';
  var x = nStr.split('.');
  var x1 = x[0];
  var x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
          x1 = x1.replace(rgx, '$1' + ' ' + '$2');
  }
  return x1 + x2;
}

/**
 * Setup the orchestra
 */
function init() {
  // Check that the web page is run in a secure context,
  // as otherwise MetaMask won't be available
  if(location.protocol !== 'http:' && location.protocol !== 'https:') {
    // https://ethereum.stackexchange.com/a/62217/620
    const alert = document.querySelector("#alert-error-https");
    alert.style.display = "block";
    document.querySelector("#btn-connect").setAttribute("disabled", "disabled")
    return;
  }

  // Tell Web3modal what providers we have available.
  // Built-in web browser provider (only one can exist as a time)
  // like MetaMask, Brave or Opera is added automatically by Web3modal
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: "8043bb2cf99347b1bfadfb233c5325c0",
      }
    },

    fortmatic: {
      package: Fortmatic,
      options: {
        key: "pk_test_391E26A3B43A3350"
      }
    }
  };

  web3Modal = new Web3Modal({
    cacheProvider: true, // optional
    providerOptions, // required
    disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
    theme: {
      background: "#161618",
      main: "#FFFFFF",
      secondary: "rgba(255, 255, 255, 0.72);",
      border: "transparent",
      hover: "rgba(44, 43, 48, 0.48);"
    }
  });

  if (web3Modal.cachedProvider) {
    onConnect()
  }
}


/**
 * Kick in the UI action after Web3modal dialog has chosen a provider
 */
async function fetchAccountData() {

  // Get a Web3 instance for the wallet
  web3 = new Web3(provider);

  // Get connected chain id from Ethereum node
  const chainId = await web3.eth.getChainId();
  // Load chain information over an HTTP API
  const chainData = evmChains.getChain(chainId);

  // Get list of accounts of the connected wallet
  const accounts = await web3.eth.getAccounts();

  // MetaMask does not give you all accounts, only the selected account
  selectedAccount = accounts[0];

  // Set the contract
  contract = new web3.eth.Contract(
    contractAbi,
    '0x95a3C00D5d35aC0F125F9782838a086750103C21', {
      from: selectedAccount
    }
  );

  [...document.querySelectorAll(".selected-account")].map(item => item.textContent = 
    `${selectedAccount.substr(0, 6)}...${selectedAccount.substr(selectedAccount.length - 6, selectedAccount.length - 1)}`);

  // Get a handl
  const template = document.querySelector("#template-balance");


  // Get the account data
  try {
    // Get the withdraw values

    const { alreadyWithdrawn, availableToWithdraw, totalAmount } = await contract.methods.getWalletInfo(selectedAccount).call();
    total = (Number(totalAmount) / 10 ** 18).toFixed(4);
    withdrawn = (Number(alreadyWithdrawn) / 10 ** 18).toFixed(4);
    available = (Number(availableToWithdraw) / 10 ** 18).toFixed(4);

    // Display fully loaded UI for wallet data
    document.querySelector("#prepare").style.display = "none";
    document.querySelector("#connected").style.display = "block";

    document.querySelector("#total-tokens").textContent = addSpaces(total);
    document.querySelector("#withdrawn-tokens").textContent = addSpaces(withdrawn);
    document.querySelector("#available-tokens").textContent = addSpaces(available);

    document.querySelector("#withdrawn-tokens-percent").textContent = alreadyWithdrawn > 0 ? Math.round(Number(withdrawn) / Number(total) * 100) : 0;
    document.querySelector("#available-tokens-percent").textContent = availableToWithdraw > 0 ? Math.round(Number(available) / Number(total) * 100) : 0;

    setTimeout(function(){
      document.querySelector("#withdrawn-tokens-progress").style.width = Math.round(Number(withdrawn) / Number(total) * 100) + '%';
      document.querySelector("#available-tokens-progress").style.width = Math.round(Number(available) / Number(total) * 100) + '%';
    }, 100);

    // disable withdraw button if has no availible tokens
    if (available == 0) disableWithdraw();
  } catch (e) {
    console.log(e);
    document.querySelector("#error-modal").style.display = "flex";
    document.body.style.overflow = "hidden";
  }
}

/**
 * Fetch account data for UI when
 * - User switches accounts in wallet
 * - User switches networks in wallet
 * - User connects wallet initially
 */
async function refreshAccountData() {

  // If any current data is displayed when
  // the user is switching acounts in the wallet
  // immediate hide this data
  document.querySelector("#connected").style.display = "none";
  document.querySelector("#prepare").style.display = "block";

  // Disable button while UI is loading.
  // fetchAccountData() will take a while as it communicates
  // with Ethereum node via JSON-RPC and loads chain data
  // over an API call.
  document.querySelector("#btn-connect").setAttribute("disabled", "disabled")
  await fetchAccountData(provider);
  document.querySelector("#btn-connect").removeAttribute("disabled")
}


/**
 * Show account window
 */
function onAccountClick() {
  document.querySelector("#wallet-modal").style.display = "flex";
  document.body.style.overflow = "hidden";
}

function disableWithdraw() {
  document.querySelector("#btn-withdraw").disabled = true;
  document.querySelector("#btn-withdraw").style.background = 'rgba(69, 160, 255, 0.5)';
  document.querySelector("#btn-withdraw").style.color = 'rgba(255, 255, 255, 0.5)';
}

/**
 * Connect wallet button pressed.
 */
async function onConnect() {
  try {
    provider = await web3Modal.connect();
  } catch(e) {
    console.log("Could not get a wallet connection", e);
    // show error
    return;
  }

  // Subscribe to accounts change
  provider.on("accountsChanged", (accounts) => {
    fetchAccountData();
  });

  // Subscribe to chainId change
  provider.on("chainChanged", (chainId) => {
    fetchAccountData();
  });

  // Subscribe to networkId change
  provider.on("networkChanged", (networkId) => {
    fetchAccountData();
  });

  await refreshAccountData();
}

/**
 * Disconnect wallet button pressed.
 */
async function onDisconnect(e) {
  e.target.closest('.global-modal').style.display = "none";

  // TODO: Which providers have close method?
  if(provider.close) {
    await provider.close();
    provider = null;
  }

  // If the cached provider is not cleared,
  // WalletConnect will default to the existing session
  // and does not allow to re-scan the QR code with a new wallet.
  // Depending on your use case you may want or want not his behavir.
  await web3Modal.clearCachedProvider();

  selectedAccount = null;

  // Set the UI back to the initial state
  document.querySelector("#prepare").style.display = "block";
  document.querySelector("#connected").style.display = "none";
}

/**
 * Interact to contract to withdraw the reward
 */
async function onWithdrawClick(e) {
  try {
    // interact to contract
    document.querySelector("#loader-modal").style.display = "flex";
    document.body.style.overflow = "hidden";
    const transaction = await contract.methods.withdrawAll().send();

    document.querySelector("#withdrawn-tokens").textContent = Number(withdrawn) + Number(available);
    document.querySelector("#withdrawn-tokens-percent").textContent = Math.round((Number(withdrawn) + Number(available)) / Number(total) * 100);
    document.querySelector("#withdrawn-tokens-progress").style.width = Math.round((Number(withdrawn) + Number(available)) / Number(total) * 100) + '%';
    document.querySelector("#available-tokens-progress").style.width = 0;
    document.querySelector("#available-tokens").textContent = 0;
    document.querySelector("#available-tokens-percent").textContent = 0;
    
    disableWithdraw();

    document.querySelector("#success-modal").style.display = "flex";
    document.body.style.overflow = "hidden";
  } catch (e) {
    console.log(e);
    document.querySelector("#error-modal").style.display = "flex";
    document.body.style.overflow = "hidden";
  }
  document.querySelector("#loader-modal").style.display = "none";
  document.body.style.overflow = "auto";
}


/**
 * Main entry point.
 */
window.addEventListener('load', async () => {
  init();
  document.querySelector("#btn-connect").addEventListener("click", onConnect);
  document.querySelector("#btn-disconnect").addEventListener("click", onDisconnect);
  document.querySelector("#selected-account").addEventListener("click", onAccountClick);
  document.querySelector("#btn-withdraw").addEventListener("click", onWithdrawClick);

  // Modals toggling
  [...document.querySelectorAll(".global-modal__close")].map(item => item.addEventListener("click", (e) => {
    e.target.closest('.global-modal').style.display = "none";
    document.body.style.overflow = "auto";
  }));

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("global-modal") && !e.target.classList.contains("global-modal--locked")) {
      e.target.style.display = "none";
      document.body.style.overflow = "auto";
    };
  });
});
