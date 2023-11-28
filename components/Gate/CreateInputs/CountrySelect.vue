<template>
    <div>
        <div class="flex gap-4">
            <div class="w-50%">

                <TagMultiSelect :name="'Countries'" :options="countries" @selected-items="handleSelectedCountries"
                    :placeholder="'Find countries...'" />
            </div>
            <div>
                <div class="name">What to do with the selected</div>
                <BaseSelect :options="actionOptions" />
            </div>
        </div>
    </div>
</template>

<script setup>
const countries = computed(() => [
    { name: "hello" }, { name: "world" }
].map((c, index) => ({ ...c, id: index })))

const handleSelectedCountries = (items) => {
    console.log(items)
}

const actionOptions = computed(() => [
    { id: 0, name: 'Block access', }
])
</script>