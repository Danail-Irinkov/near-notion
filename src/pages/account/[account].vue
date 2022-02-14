<script setup lang="ts">
import { onMounted, ref } from 'vue'
import axios from 'axios'
import * as nearAPI from 'near-api-js'
import { useRoute } from 'vue-router'
const route: any = useRoute()
let account_id = String(route.params.account)
let err_msg = ref('')
let near_price = ref(0)
let balance = ref(0)
let config = ref({})
let near = ref({})
let keyStore = ref({})
let wallet = ref({})
let account = ref({})

const formatUSD = val => '$' + parseFloat(val).toFixed(2)
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
        console.log(
          'BEOFRE Connect config2',
          Object.assign({ deps: { keyStore: keyStore.value } }, config.value)
        )
        near.value = await nearAPI.connect(
          Object.assign({ deps: { keyStore: keyStore.value } }, config.value)
        )
        // console.log('After Connect near', near.value)
        wallet.value = new nearAPI.WalletAccount(near.value)
        console.log('After Connect wallet', wallet.value)
        account.value = await near.value.account(account_id)
        balance.value = nearAPI.utils.format
          .formatNearAmount(
            (await account.value.getAccountBalance())?.available || '0'
          )
          .slice(0, 5)
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
  <div>
    <h4 v-if="err_msg" class="whitespace-pre-wrap">{{ err_msg }}</h4>
    <div v-else>
      Balance: {{ balance }}N
      <br />
      Price: {{ formatUSD(near_price) }}
      <br />
      Account: {{ account_id }}
    </div>
  </div>
</template>
