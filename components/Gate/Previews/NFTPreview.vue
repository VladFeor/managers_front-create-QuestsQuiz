
<template>
    <NFTView :bordered="bordered" :isLoading="loading" :name="collectionName" :tokenId="tokenId"
        :contractAddress="contractAddress" :imageUrl="imageUrl" :error="error" />
</template>

<script setup>
import { ethers } from 'ethers';
import { blockchains, handleIPFSUrl } from '~/util/onchain';
import nftAbi from '@/web3/abi/nft';
import axios from 'axios';

const props = defineProps(['blockchain', 'contractAddress', 'tokenId', 'bordered'])
const emit = defineEmits(['update:nfName', 'update:imgUrl'])

const collectionName = ref('')
const imageUrl = ref('')
const loading = ref(false)
const error = ref('')

const resetState = (withErrors) => {
    collectionName.value = '';
    imageUrl.value = '';

    emit('update:nfName', '')
    emit('update:imgUrl', '')

    if (withErrors) {
        error.value = ''
    }

}
const getNftData = (blockchain, contractAddress, tokenId) => {
    if (!tokenId) tokenId = 1
    if (!contractAddress || !blockchain || !tokenId) return

    const provider = new ethers.providers.JsonRpcProvider(blockchains.find(b => b.name === props.blockchain)?.rpcUrl[0])
    const contract = new ethers.Contract(contractAddress, nftAbi, provider)

    loading.value = true;

    contract.tokenURI(tokenId).then(async (tokenUri) => {
        const nftUrl = handleIPFSUrl(tokenUri)
        const res = await axios.get(nftUrl);
        const { name } = res.data

        const image = res.data?.image || res.data?.image_url

        error.value = ''
        collectionName.value = name
        imageUrl.value = handleIPFSUrl(image)

        emit('update:nfName', name)
        emit('update:imgUrl', image)
    }).catch(e => {
        resetState()
        error.value = "Unable to get NFT data"
    }).finally(() => {
        loading.value = false
    })

}


watch(() => props.blockchain, (blockchain) => {
    getNftData(blockchain, props.contractAddress, props.tokenId)
})

watch(() => props.contractAddress, contractAddress => {
    if (!contractAddress) {
        resetState()
        return
    }
    getNftData(props.blockchain, contractAddress, props.tokenId)
})

watch(() => props.tokenId, (tokenId) => {
    if (!tokenId) {
        resetState()
        return
    }
    getNftData(props.blockchain, props.contractAddress, tokenId)
})

onMounted(() => {
    getNftData(props.blockchain, props.contractAddress, props.tokenId)
})

</script>