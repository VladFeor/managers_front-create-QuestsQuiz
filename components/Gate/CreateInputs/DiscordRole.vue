<template>
    <div>
        <div class="name">Discord Role</div>
        <DiscordRoleSelect :options="discordRoles" @input="setDiscordRole($event)" :isDisabled="isDiscordRoleActive"
            :reduceLength="15" isBig />
    </div>
</template>

<script setup>
import { useDiscordStore } from '~/store/discord';

const isDiscordRoleActive = false;

const discordStore = useDiscordStore();
const discordRoles = computed(() => {
    const originalArray = discordStore.getDiscordRoles;
    if (originalArray && originalArray.length) {
        // originalArray.unshift({ name: 'options', id: 0 });
        return originalArray;
    } else return [{ name: 'options', id: 0 }];
    // } else return [{ name: 'options', id: 0 }];
});


</script>