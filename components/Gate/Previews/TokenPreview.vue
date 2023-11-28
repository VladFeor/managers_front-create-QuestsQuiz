
<template>
    <TokenAmountView :quantity="quantity" :tokenName="result" :blockchain="blockchain" />
</template>

<script setup>
import { ethers } from 'ethers';
import ERC20_ABI from '@/web3/abi/ERC20.json';
import { blockchains } from '~/util/onchain';

const props = defineProps(['blockchain', 'tokenAddress', 'name', 'quantity'])
const emit = defineEmits(['update:tokenName'])

const result = ref('')
const loading = ref(false)
const error = ref('')

const getTokenName = (address, blockchain) => {
    if (!address || !blockchain) return

    const provider = new ethers.providers.JsonRpcProvider(blockchains.find(b => b.name === props.blockchain).rpcUrl[0])
    const contract = new ethers.Contract(address, ERC20_ABI, provider)

    loading.value = true;

    contract.symbol().then((res) => {
        result.value = res
        emit('update:tokenName', res)
    }).catch(e => {
        error.value = "Token doesn't exist"
        result.value = '';
        emit('update:tokenName', "")
    }).finally(() =>
        loading.value = false)
}


watch(() => props.blockchain, (val) => {
    getTokenName(props.tokenAddress, val)
})

watch(() => props.tokenAddress, val => {
    getTokenName(val, props.blockchain)
})

onMounted(() => {
    getTokenName(props.tokenAddress, props.blockchain)
})

</script>