<script setup lang="ts">
import { onMounted, ref } from 'vue'
import axios from 'axios'
import * as nearAPI from 'near-api-js'
import { useRoute } from 'vue-router'
import SendIcon from '@/components/Icons/SendIcon.vue'
import ReceiveIcon from '@/components/Icons/ReceiveIcon.vue'
import TopUpIcon from '@/components/Icons/TopUpIcon.vue'
import NEARIcon from '@/components/Icons/NEARIcon.vue'
import InfoIcon from '@/components/Icons/InfoIcon.vue'

const route: any = useRoute()
let account_id = String(route.params.account)
let err_msg = ref('')
let near_price = ref(0)
let balance = ref(0)
let config = ref()
let near = ref()
let keyStore = ref()
let wallet = ref()
let account = ref()
let balance_tab_active = ref(true)

const formatUSD = (val: number) => '$' + parseFloat(String(val)).toFixed(2)
const getNEARPrice = async () => {
  try {
    let api = 'http://localhost:3333/near-for-notion/europe-west3/queryCoinMarketCap'
    if (import.meta.env.PROD) {
      api =
        'https://europe-west3-near-for-notion.cloudfunctions.net/queryCoinMarketCap'
    }
    let result = await axios.get(api)
    console.log('getNEARPrice result $', result?.data?.NEAR[0]?.quote?.USD?.price)
    return result?.data?.NEAR[0]?.quote?.USD?.price
  } catch (e) {
    return Promise.resolve(e)
  }
}
onMounted(async () => {
  try {
    getNEARPrice().then(price => {
      near_price.value = price
      console.log('getNEARPrice result2 $', near_price)
    })

    if (account_id) {
      if (account_id.indexOf('.near') === -1) {
        err_msg.value =
          'Provide a correct NEAR account_id\n' +
          `"${account_id}" is not valid\n` +
          '(ex.: /account_id/danail.near)'
      } else {
        config.value = {
          networkId: 'mainnet',
          nodeUrl: 'https://rpc.mainnet.near.org',
          contractName: account_id,
          walletUrl: 'https://wallet.near.org',
          helperUrl: 'https://helper.mainnet.near.org'
        }
        keyStore.value = new nearAPI.keyStores.BrowserLocalStorageKeyStore()
        console.log('BEOFRE Connect', keyStore.value)
        console.log('BEOFRE Connect config', config.value)

        near.value = await nearAPI.connect(
          Object.assign({ deps: { keyStore: keyStore.value } }, config.value)
        )
        // console.log('After Connect near', near.value)
        // @ts-ignore
        wallet.value = new nearAPI.WalletAccount(near.value)
        console.log('After Connect wallet', wallet.value)
        account.value = await near.value.account(account_id)
        balance.value = parseFloat(
          nearAPI.utils.format
            .formatNearAmount(
              (await account.value.getAccountBalance())?.available || '0'
            )
            .slice(0, 5)
        )
      }
    }
  } catch (e) {
    err_msg.value =
      'Provide an existing NEAR account_id\n' + `"${account_id}" is not valid\n`
    console.log('mounted err: ', e)
  }
})
</script>

<template>
  <div class="wrapper">
    <div
      class="tab-balances"
      :class="{ active: balance_tab_active }"
      @click="balance_tab_active = !balance_tab_active"
    >
      Balances
    </div>
    <div
      class="tab-collectables"
      :class="{ active: !balance_tab_active }"
      @click="balance_tab_active = !balance_tab_active"
    >
      Collectables
    </div>

    <div class="body col-span-12">
      <div class="main-amount">
        <h4 class="whitespace-pre-wrap">
          {{ err_msg ? err_msg : formatUSD(near_price * balance) }}
        </h4>
      </div>

      <div class="sub-title">
        Available Balance
        <InfoIcon class="info-icon" />
      </div>

      <div class="buttons">
        <button class="dark-gray">
          <span>
            <sendIcon />
          </span>
          Send
        </button>
        <button class="dark-gray">
          <span>
            <receiveIcon />
          </span>
          Receive
        </button>
        <button class="dark-gray">
          <span>
            <TopUpIcon />
          </span>
          Top Up
        </button>
      </div>

      <div class="sub-title tokens">
        <span class="">Your Portfolio</span>
        <span>Token Balance</span>
      </div>
    </div>

    <div class="footer col-span-12">
      <div class="icon">
        <NEARIcon />
      </div>
      <div class="desc">
        <span class="symbol">NEAR</span>
        <span class="fiat-rate">{{ formatUSD(near_price) }}</span>
      </div>
      <div class="balance">
        <div class="near-amount">{{ balance }} NEAR</div>
        <div class="fiat-amount">≈ {{ formatUSD(near_price * balance) }} USD</div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.wrapper {
  @apply grid grid-cols-12 mx-auto justify-center align-middle text-center;
  border: 2px solid rgb(240, 240, 240);
  border-radius: 8px;
  max-width: 530px;
  max-height: 550px;
}
.tab-collectables,
.tab-balances {
  @apply grid col-span-6 text-center cursor-pointer;
  font-family: Inter, Lato, 'Lucida Grande', Tahoma, sans-serif;
  color: rgb(162, 162, 168);
  font-weight: 600;
  font-size: 16px;
  place-items: center;
  height: 15vh;
  line-height: 100%;
  min-height: 51px;
  max-height: 71px;
  transition: color 100ms ease 0s;
  border-bottom: 1px solid rgb(240, 240, 241);
  background-color: rgb(250, 250, 250);
  &.active {
    background-color: white;
    color: black;
    border: 0;
  }
  &:hover {
    color: black;
  }
}
.tab-balances:not(.active) {
  border-right: 1px solid rgb(240, 240, 241);
}
.tab-collectables:not(.active) {
  border-left: 1px solid rgb(240, 240, 241);
}
.footer {
  @apply align-left text-left;
  padding: 15px 20px;
  border-top: 1px solid rgb(240, 240, 241);
  & > .icon {
    @apply align-middle;
    display: inline-grid;
  }
  & > .desc {
    @apply grid-cols-1 align-middle;
    margin-left: 14px;
    display: inline-grid;
    & > .symbol {
      @apply near-black-font;
    }
  }
  & > .balance {
    @apply grid-cols-1 align-middle text-right;
    float: right; //hate using float ...
    display: inline-grid;
    margin-left: auto;
    & > .near-amount {
      @apply near-black-font;
    }
    & > .near-amount,
    .fiat-amount {
      white-space: nowrap;
    }
  }
}
.buttons {
  @apply grid grid-flow-row mx-auto my-8;
  grid-template-columns: auto auto auto auto;
  width: fit-content;

  & > button {
    display: inline-grid;
    width: fit-content;
    flex-direction: column;
    -webkit-box-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    align-items: center;
    height: auto;
    border: 0px;
    padding: 0px;
    color: rgb(63, 64, 69);
    font-weight: 400;
    font-size: 14px;
    margin: 20px;
    border-radius: 0px;
    background-color: transparent !important;
    & > span {
      font-family: Inter, Lato, 'Lucida Grande', Tahoma, sans-serif;
      cursor: pointer;
      word-break: keep-all;
      color: rgb(63, 64, 69);
      font-weight: 400;
      font-size: 14px;
      box-sizing: inherit;
      background-color: rgb(39, 39, 41);
      display: grid;
      -webkit-box-align: center;
      align-items: center;
      -webkit-box-pack: center;
      justify-content: center;
      min-height: 56px;
      height: 56px;
      min-width: 56px;
      width: 56px;
      border-radius: 20px;
      margin-bottom: 10px;
      transition: all 100ms ease 0s;
      & > svg {
        font-family: Inter, Lato, 'Lucida Grande', Tahoma, sans-serif;
        cursor: pointer;
        word-break: keep-all;
        color: rgb(63, 64, 69);
        font-weight: 400;
        font-size: 14px;
        fill: none;
        box-sizing: inherit;
        width: 22px !important;
        height: 22px !important;
        margin: 0px !important;

        & > path {
          stroke: white;
        }
      }
    }
  }
}

.dark-gray {
  border-color: rgb(39, 39, 41);
}

.near-black-font {
  font-family: Inter, Lato, 'Lucida Grande', Tahoma, sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: rgb(36, 39, 42);
}
.main-amount {
  @apply col-span-12;
  margin-top: 50px;
  font-family: Inter, Lato, 'Lucida Grande', Tahoma, sans-serif;
  font-weight: 600;
  text-align: center;
  color: rgb(36, 39, 42);
  font-size: 48px;
  box-sizing: inherit;
  white-space: nowrap;
  line-height: normal;
}
.sub-title {
  @apply col-span-12 text-center;
  font-family: Inter, Lato, 'Lucida Grande', Tahoma, sans-serif;
  box-sizing: inherit;
  font-weight: 400;
  font-size: 14px;
  margin-bottom: 10px;
  color: rgb(162, 162, 168);
  margin-top: 10px;
  -webkit-box-align: center;
  align-items: center;
}
.tokens {
  font-family: Inter, Lato, 'Lucida Grande', Tahoma, sans-serif;
  box-sizing: inherit;
  line-height: 150%;
  font-weight: 400;
  font-size: 14px;
  color: rgb(114, 114, 122);
  margin-top: 20px;
  margin-bottom: 15px;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  justify-content: space-between;
  width: 100%;
  max-width: unset;
  padding: 0px 20px;
}
.info-icon {
  @apply inline-grid cursor-pointer;
  width: 18px;
  &:hover > g > path {
    stroke: rgb(0, 114, 206);
  }
}
</style>
