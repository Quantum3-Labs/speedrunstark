# 🚩 Challenge #2: 🏵 Token Vendor 🤖

![readme-2](https://raw.githubusercontent.com/Quantum3-Labs/speedrunstark/token-vendor/packages/nextjs/public/hero2.png)

🤖 Smart contracts are kind of like "always on" _vending machines_ that **anyone** can access. Let's make a decentralized, digital currency. Then, let's build an unstoppable vending machine that will buy and sell the currency. We'll learn about the "approve" pattern for ERC20s and how contract to contract interactions work.

🏵 Create `YourToken.cairo` smart contract that inherits the **ERC20** token standard from OpenZeppelin. Set your token to `_mint()` **1000** \* (10^18) tokens to the `recipient`. Then create a `Vendor.cairo` contract that sells your token using a `buy_tokens()` function.

🎛 Edit the frontend that invites the user to input an amount of tokens they want to buy. We'll display a preview of the amount of ETH it will cost with a confirm button.

🔍 It will be important to verify your token's source code in the block explorer after you deploy. Supporters will want to be sure that it has a fixed supply, and you can't just mint more.

🌟 The final deliverable is an app that lets users purchase your ERC20 token, transfer it, and sell it back to the vendor. Deploy your contracts on your public chain of choice and then `yarn vercel` your app to a public web server.

> 💬 Submit this challenge, meet other builders working on this challenge or get help in the [Builders telegram chat](https://t.me/+wO3PtlRAreo4MDI9)!

---

## Checkpoint 0: 📦 Environment 📚

Before you begin, you need to install the following tools:

- [Node (>= v18.17)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

### Compatible versions

- scarb - v2.5.4
- cairo - v2.5.4
- starknet - v2.5.4
- snforge - v0.23.0 // starknet foundry
- sierra - v1.4.0
- rpc - v0.5.1

Then download the challenge to your computer and install dependencies by running:

```sh
git clone https://github.com/Quantum3-Labs/speedrunstark.git --recurse-submodules token-vendor
cd token-vendor
git checkout token-vendor
yarn install
```

> in the same terminal, start your local network (a blockchain emulator in your computer):

2. Prepare your environment variables.

By defauly Scaffold-Stark 2 takes the first prefunded account from `starknet-devnet` as a deployer address, thus **you can skip this step!**. But if you want use the .env file anyway, you can fill the envs related to devnet with any other predeployed contract address and private key from starknet-devnet.

**Note:** In case you want to deploy on Sepolia, you need to fill the envs related to sepolia testnet with your own contract address and private key.

```bash
cp packages/snfoundry/.env.example packages/snfoundry/.env
```

3. Run a local network in the first terminal.

**Note:** You can skip this step if you want to use Sepolia Testnet.

```bash
yarn chain
```

> in a second terminal window, 🛰 deploy your contract (locally):

```sh
cd token-vendor
yarn deploy
```

> in a third terminal window, start your 📱 frontend:

```sh
cd token-vendor
yarn start
```

📱 Open http://localhost:3000 to see the app.

> 👩‍💻 Rerun `yarn deploy` whenever you want to deploy new contracts to the frontend. If you haven't made any contract changes, you can run `yarn deploy --reset` for a completely fresh deploy.

---

## Checkpoint 1: 🏵Your Token 💵

> 👩‍💻 Edit `YourToken.cairo` to inherit the **ERC20** token standard from OpenZeppelin

> Mint **1000** (\* 10 \*\* 18) to your frontend address using the `constructor()`.

(Your frontend address is the address in the top right of http://localhost:3000)

> You can `yarn deploy --reset` to deploy your contract until you get it right.

### 🥅 Goals

- [ ] Can you check the `balance_of()` your frontend address in the `Debug Contracts` tab? (**YourToken** contract)
- [ ] Can you `transfer()` your token to another account and check _that_ account's `balance_of`?

![debugContractsYourToken](https://raw.githubusercontent.com/Quantum3-Labs/speedrunstark/token-vendor/packages/nextjs/public/ch2-YourToken.png)

> 💬 Hint: Use an incognito window to create a new address and try sending to that new address. Can use the `transfer()` function in the `Debug Contracts` tab.

---

## Checkpoint 2: ⚖️ Vendor 🤖

> 👩‍💻 Edit the `Vendor.cairo` contract with a `buy_tokens()` function

Use a price variable named `tokensPerEth` set to **100**:

```cairo
const TokensPerEth: u256 = 100;
```

> 📝 The `buy_tokens()` function in `Vendor.cairo` should use `eth_amount_wei` and `tokensPerEth` to calculate an amount of tokens to `self.your_token.read().transfer()` to `recipient`.

> 📟 Emit **event** `BuyTokens(ContractAddress buyer, u256 eth_amount, u256 tokens_amount)` when tokens are purchased.

Edit `packages/snfoundry/scripts-ts/deploy.ts` to deploy the `Vendor` (uncomment Vendor deploy lines).

Uncomment the `Buy Tokens` sections in `packages/nextjs/app/token-vendor/page.tsx` to show the UI to buy tokens on the Token Vendor tab.

### 🥅 Goals

- [ ] When you try to buy tokens from the vendor, you should get an error: **'ERC20: transfer amount exceeds balance'**

⚠️ This is because the Vendor contract doesn't have any YourTokens yet!

⚔️ Side Quest: send tokens from your frontend address to the Vendor contract address and _then_ try to buy them.

> ✏️ We can't hard code the vendor address like we did above when deploying to the network because we won't know the vendor address at the time we create the token contract.

> ✏️ So instead, edit `YourToken.cairo` to mint the tokens to the `recipient` (deployer) in the **constructor()**.

> ✏️ Then, edit `packages/snfoundry/scripts-ts/deploy.ts` to transfer 1000 tokens to vendor address.

```js
await deployer.execute([
  {
    calldata: [
      "sender",
      vendor.address || "vendor_address",
      uint256.bnToUint256(1000n * 10n ** 18n),
    ],
    contractAddress: your_token.address || "address",
    entrypoint: "transfer_from",
  },
]);
```

> 🔎 Look in `packages/nextjs/app/token-vendor/page.tsx` for code to uncomment to display the Vendor ETH and Token balances.

> You can `yarn deploy --reset` to deploy your contract until you get it right.

![TokenVendorBuy](https://raw.githubusercontent.com/Quantum3-Labs/speedrunstark/token-vendor/packages/nextjs/public/ch2-TokenVendorBalance.png)

### 🥅 Goals

- [ ] Does the `Vendor` address start with a `balanceOf` **1000** in `YourToken` on the `Debug Contracts` tab?
- [ ] Can you buy **10** tokens for **0.1** ETH?
- [ ] Can you transfer tokens to a different account?

In `packages/snfoundry/scripts-ts/deploy.ts` you will need to call `transfer_ownership()` on the `Vendor` to make _your frontend address_ the `owner`:

```js
await deployer.execute([
  {
    calldata: ["new_owner_address"],
    contractAddress: vendor.address || "address",
    entrypoint: "transfer_ownership",
  },
]);
```

### 🥅 Goals

- [ ] Is your frontend address the `owner` of the `Vendor`?

> 📝 Finally, add a `withdraw()` function in `Vendor.cairo` that lets the owner withdraw all the ETH from the vendor contract.

### 🥅 Goals

- [ ] Can **only** the `owner` withdraw the ETH from the `Vendor`?

### ⚔️ Side Quests

- [ ] What if you minted **2000** and only sent **1000** to the `Vendor`?

---

## Checkpoint 3: 🤔 Vendor Buyback 🤯

👩‍🏫 The hardest part of this challenge is to build your `Vendor` to buy the tokens back.

🧐 The reason why this is hard is the `approve()` pattern in ERC20s.

😕 First, the user has to call `approve()` on the `YourToken` contract, approving the `Vendor` contract address to take some amount of tokens.

🤨 Then, the user makes a _second transaction_ to the `Vendor` contract to `sellTokens(amount_tokens: u256)`.

🤓 The `Vendor` should call ` fn transfer_from(ref self: ContractState, sender: ContractAddress, recipient: ContractAddress, amount: u256) -> bool` and if the user has approved the `Vendor` correctly, tokens should transfer to the `Vendor` and ETH should be sent to the user.

🤩 You can use `useScaffoldMultiWriteContract.ts` to call `approve` and `buy / sell tokens`

> 📝 Edit `Vendor.cairo` and add a `sellTokens(amount_tokens: u256)` function!

🔨 Use the `Debug Contracts` tab to call the approve and sellTokens() at first but then...

🔍 Look in the `packages/nextjs/app/token-vendor/page.tsx` for the extra approve/sell UI to uncomment!

![VendorBuyBack](https://raw.githubusercontent.com/Quantum3-Labs/speedrunstark/token-vendor/packages/nextjs/public/ch2-VendorBuySell.png)

### 🥅 Goal

- [ ] Can you sell tokens back to the vendor?
- [ ] Do you receive the right amount of ETH for the tokens?

### ⚔️ Side Quests

- [ ] Should we disable the `owner` withdraw to keep liquidity in the `Vendor`?
- [ ] It would be a good idea to display Sell Token Events. Create an **event**
      `struct SellTokens {
<<<<<<< HEAD
  #[key]
  seller: ContractAddress,
  tokens_amount: u256,
  eth_amount: u256,
  }`
      ======= #[key]
      seller: ContractAddress,
      tokens_amount: u256,
      eth_amount: u256,
      }`

  > > > > > > > dd0c131c980a69271916f445c51e132bdf840dfe

            and `emit` it in your `Vendor.sol` and uncomment `SellTokens Events` section in your `packages/nextjs/app/events/page.tsx` to update your frontend.

  ![Events](https://raw.githubusercontent.com/Quantum3-Labs/speedrunstark/2812ab21de5d261ef670b0ef5a211fdfbae3b8d8/packages/nextjs/public/events.png)

### ⚠️ Test it!

- Now is a good time to run `yarn test` to run the automated testing function. It will test that you hit the core checkpoints. You are looking for all green checkmarks and passing tests!

---

## Checkpoint 4: 💾 Deploy your contracts! 🛰

📡 Edit the `defaultNetwork` to your choice of Starknet networks in `packages/nextjs/scaffold.config.ts`

🔐 In devnet you can choose a burner wallet auto-generated

⛽️ You will need to send ETH to your deployer address with your wallet if not in devnet, or get it from a public faucet of your chosen network.

🚀 Run `yarn deploy` to deploy your smart contract to a public network (selected in `scaffold.config.ts`)

> 💬 Hint: For faster loading of your _"Events"_ page, consider updating the `fromBlock` passed to `useScaffoldEventHistory` in [`packages/nextjs/app/events/page.tsx`](https://github.com/Quantum3-Labs/speedrunstark/blob/token-vendor/packages/nextjs/app/events/page.tsx) to `blocknumber - 10` at which your contract was deployed. Example: `fromBlock: 3750241n` (where `n` represents its a [BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)). To find this blocknumber, search your contract's address on Etherscan and find the `Contract Creation` transaction line.

---

## Checkpoint 5: 🚢 Ship your frontend! 🚁

✏️ Edit your frontend config in `packages/nextjs/scaffold.config.ts` to change the `targetNetwork` to `chains.sepolia` or any other public network.

💻 View your frontend at http://localhost:3000 and verify you see the correct network.

📡 When you are ready to ship the frontend app...

📦 Run `yarn vercel` to package up your frontend and deploy.

> Follow the steps to deploy to Vercel. Once you log in (email, github, etc), the default options should work. It'll give you a public URL.

> If you want to redeploy to the same production URL you can run `yarn vercel --prod`. If you omit the `--prod` flag it will deploy it to a preview/test URL.

> 🦊 Since we have deployed to a public testnet, you will now need to connect using a wallet you own or use a burner wallet. By default, 🔥 `burner wallets` are only available on `devnet` . You can enable them on every chain by setting `onlyLocalBurnerWallet: false` in your frontend config (`scaffold.config.ts` in `packages/nextjs/`)

#### Configuration of Third-Party Services for Production-Grade Apps.

By default, 🏗 Scaffold-Stark provides predefined API keys for some services such as Infura. This allows you to begin developing and testing your applications more easily, avoiding the need to register for these services.
This is great to complete your SpeedRunStark.

For production-grade applications, it's recommended to obtain your own API keys (to prevent rate limiting issues). You can configure these at:

🔷 `RPC_URL_SEPOLIA` variable in `packages/snfoundry/.env` and `packages/nextjs/.env.local`. You can create API keys from the [Infura dashboard](https://www.infura.io/).

> 💬 Hint: It's recommended to store env's for nextjs in Vercel/system env config for live apps and use .env.local for local testing.

---

> 🏃 Head to your next challenge [here](https://github.com/Quantum3-Labs/speedrunstark/tree/dice-game).
> 💭 Problems, questions, comments on the stack? Post them to the [🏗 Scaffold-Stark developers chat](https://t.me/+wO3PtlRAreo4MDI9)
