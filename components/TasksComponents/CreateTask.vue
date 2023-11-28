<template>
  <div class="create-task_wrapper">
    <div class="title_wrapper">
      <div class="title">Create a New Task</div>
      <div class="check-btn_wrapper">
        <div v-if="props.typeTask.id === 'on-chain'" class="type-label">
          <span class="check-btn_title">{{ props.typeTask.label }}</span>
        </div>
        <div v-if="props.typeTask.id === 'regular'" class="check-btn_title">Auto Check</div>
        <Switch
          v-if="props.typeTask.id === 'regular'"
          @checked="setIsCommunityActive"
          :checkedProp="isCommunityActive"
        />
      </div>
    </div>
    <div
      v-if="!isProjectOwner && !isProjectAdministrator && !isProjectManager"
      class="section_wrapper"
    >
      <div class="section_wrapper-title">Project</div>
      <div class="section_wrapper-subtitle">This is the project where your task will appear.</div>
      <TasksSelect
        filter
        :options="projects"
        @input="setProject($event)"
        type="create"
        :isError="validationErrors.projects.isError && validationErrors.projects.isTriggered"
        :errorText="validationErrors.projects.text"
        :default="projectDefault"
      />
    </div>
    <div v-if="isCommunityActive" class="section_wrapper">
      <div class="line"></div>
    </div>
    <div v-if="isCommunityActive" class="section_wrapper">
      <div class="section_wrapper-title">Community</div>
      <div class="w-1/2">
        <FilterToggle
          :buttons="communityOptions"
          :id="isShowCommunityId"
          @select="setIsShowCommunity($event)"
          isBig
        />
      </div>
    </div>
    <!-- <div
      v-if="isCommunityActive && isShowCommunityId === 0 && !isTelegramConnected"
      class="section_wrapper"
    >
      <ConnectSocialBtn name="Telegram" @click="router.push('/automations')" />
    </div> -->
    <div v-if="isCommunityActive && isShowCommunityId === 0" class="section_wrapper">
      <!-- <div
      v-if="isCommunityActive && isShowCommunityId === 0 && isTelegramConnected"
      class="section_wrapper"
    > -->
      <div class="section_wrapper-title">Telegram URL</div>
      <div class="section_wrapper-subtitle">
        1. Add bot {{ useRuntimeConfig().public.telegramBot }} to the channel admins and give it the
        rights to manage posts.
      </div>
      <div class="section_wrapper-subtitle">
        2. Enter the short address or channel ID if the the channel is private in the field below.
      </div>
      <!-- <Input v-model="telegramUrl" name="" placeholder="https://telegram.com/" /> -->
      <Input
        v-model="telegramUrl"
        @input="telegramValidation"
        name=""
        placeholder="https://telegram.com/"
        :isError="!isTelegramValid"
        :errorText="
          isNotValidPrivatLink
            ? 'For private channels, you must enter the channel ID, not the link'
            : 'Telegram is required'
        "
      />
      <span class="telegram-example">Example: durov, https://t.me/durov or -10011426151</span>
    </div>
    <div
      v-if="isCommunityActive && isShowCommunityId === 1 && !isDiscordConnected"
      class="section_wrapper"
    >
      <ConnectSocialBtn name="Discord" @click="loginSocial('discord_bot')" />
    </div>
    <div
      v-if="isCommunityActive && isShowCommunityId === 1 && isDiscordConnected"
      class="section_wrapper"
    >
      <div class="section_wrapper-title">Discord URL</div>
      <div class="section_wrapper-subtitle">
        1. Enter your server invite link that connected to Automations page.
      </div>
      <Input
        v-model="discordUrl"
        name=""
        @input="discordValidation"
        :isError="!isDiscordValid"
        errorText="Discord is required"
        placeholder="https://discord.com/"
      />
    </div>
    <div
      v-if="isCommunityActive && isShowCommunityId === 2 && !isTwitterConnected"
      class="section_wrapper"
    >
      <ConnectSocialBtn name="Twitter" @click="loginSocial('twitter')" />
    </div>
    <div
      v-if="isCommunityActive && isShowCommunityId === 2 && isTwitterConnected"
      class="section_wrapper"
    >
      <div class="section_wrapper-title">Actions</div>
      <FilterToggle
        :buttons="twitterActionsButtons"
        :id="0"
        @select="setTwitterActions($event)"
        isDivided
        type="checkbox"
        :selectedActionsIds="twitterActionsIds"
      />
      <span :class="{ 'd-block': !twitterActions.length }" class="error-msg">
        Minimun one action must be selected
      </span>
    </div>
    <div
      v-if="
        isCommunityActive &&
        isShowCommunityId === 2 &&
        isTwitterConnected &&
        twitterActions.includes('twitter_follow')
      "
      class="section_wrapper"
    >
      <div class="section_wrapper-title">Twitter Handle to Follow</div>
      <Input
        :isError="!usernameValid"
        v-model="userName"
        name=""
        placeholder="username"
        @input="debouncedUsernameValidation"
        symbol="@"
      />
      <span :class="{ 'd-block': !usernameValid }" class="error-msg">
        Username of Twitter account is invalid.
      </span>
    </div>
    <div
      v-if="
        (isCommunityActive &&
          isShowCommunityId === 2 &&
          isTwitterConnected &&
          twitterActions.includes('twitter_like')) ||
        (isCommunityActive &&
          isShowCommunityId === 2 &&
          isTwitterConnected &&
          twitterActions.includes('twitter_reply')) ||
        (isCommunityActive &&
          isShowCommunityId === 2 &&
          isTwitterConnected &&
          twitterActions.includes('twitter_retweet'))
      "
      class="section_wrapper"
    >
      <div class="section_wrapper-title">Tweet URL</div>
      <Input
        v-model="tweetUrl"
        name=""
        placeholder="https://twitter.com/"
        @input="debouncedTweetLinkValidation"
      />
      <span :class="{ 'd-block': !tweetValid }" class="error-msg"> Tweet link is invalid. </span>
    </div>
    <div
      v-if="
        isCommunityActive &&
        isShowCommunityId === 2 &&
        isTwitterConnected &&
        twitterActions.includes('twitter_reply')
      "
      class="section_wrapper"
    >
      <div class="section_wrapper-title">Default Reply</div>
      <div class="section_wrapper-subtitle">
        Enter the defalut reply that we will prefill for the users.
      </div>
      <TextArea v-model="tweetReply" name="" placeholder="Enter the default reply" />
    </div>
    <div
      v-if="
        isCommunityActive &&
        isShowCommunityId === 2 &&
        isTwitterConnected &&
        twitterActions.includes('twitter_tweet')
      "
      class="section_wrapper mb-7"
    >
      <div class="section_wrapper-title">Words to Include</div>
      <div class="section_wrapper-subtitle">
        Words they must include in their tweet. Start with @ for mention , # for hashtag, or put a
        URL to another tweet for quote tweet
      </div>
      <div v-if="words.length" class="selected-tags mt-3">
        <span v-for="(word, index) in words" :key="word + index" class="tag">
          {{ word }}
          <Icon class="remove-tag" @click.stop="removeWord(index)" icon="Cancel" :size="16"></Icon>
        </span>
      </div>
      <div class="tweeter-add-word">
        <Input class="w-full" v-model="tweetWord" withoutName placeholder="Add word" />
        <BaseButton text="Add" type="twitter" :disabled="!tweetWord" @click="addWords" />
      </div>
      <span :class="{ 'd-block': !tweetWordValid }" class="error-msg">
        Required minimun one word
      </span>
    </div>
    <div
      v-if="
        isCommunityActive &&
        isShowCommunityId === 2 &&
        isTwitterConnected &&
        twitterActions.includes('twitter_tweet')
      "
      class="section_wrapper"
    >
      <div class="section_wrapper-title">Default Tweet</div>
      <div class="section_wrapper-subtitle">
        Enter the example tweet that we will prefill for the users; it must contain the words to
        include chosen above
      </div>
      <TextArea
        v-model="tweetDefault"
        name=""
        placeholder="Enter the default tweet"
        @input="debouncedTweetDefaultValidation"
      />
      <span :class="{ 'd-block': !tweetDefaultValid }" class="error-msg">
        Default tweet is required
      </span>
    </div>
    <div
      v-if="
        isCommunityActive &&
        isShowCommunityId === 2 &&
        isTwitterConnected &&
        twitterActions.includes('twitter_space')
      "
      class="section_wrapper"
    >
      <div class="section_wrapper-title">Tweet Space URL</div>
      <div class="section_wrapper-subtitle">Link to the twitter space to listen.</div>
      <Input
        v-model="tweetSpaceUrl"
        name=""
        placeholder="https://twitter.com/"
        @input="debouncedSpaceLinkValidation"
        :isError="!spaceValid"
      />
      <span :class="{ 'd-block': !spaceValid }" class="error-msg">
        Tweet Space URL is invalid.
      </span>
    </div>
    <div v-if=" isCommunityActive && isShowCommunityId === 3" class="section_wrapper">
      <div class="section_wrapper-title">Number of Invites</div>
      <div class="section_wrapper-subtitle">
        Specify the number of friends to invite to the platform.
      </div>
      <NumberInput
        v-model="invitesAmount"
        name=""
        placeholder=""
        type="number"
        :isDisabled="isInvitesUnlimited"
      />
      <span
        :class="{
          'd-block':
            (!invitesAmount && !isInvitesUnlimited) ||
            (invitesAmount && +invitesAmount <= 0 && !isInvitesUnlimited),
        }"
        class="error-msg"
      >
        Number of Invites is requred and must be greater than 0
      </span>
      <CheckboxLabel
        @checked="setIsInvitesUnlimited"
        :checkedProp="isInvitesUnlimited"
        text="Unlimited"
        :isTooltipActive="false"
      />
    </div>
    <div
      v-if="isCommunityActive && isShowCommunityId === 3 && isInvitesUnlimited"
      class="section_wrapper"
    >
      <div class="section_wrapper-title">Number of Winners</div>
      <div class="section_wrapper-subtitle">Specify the number of talents will be the winners.</div>
      <NumberInput v-model="winnersAmount" name="" placeholder="" type="number" />
      <span
        :class="{ 'd-block': !winnersAmount || (winnersAmount && +winnersAmount <= 0) }"
        class="error-msg"
      >
        Number of Winners is requred and must be greater than 0
      </span>
    </div>
    <div v-if="isCommunityActive && isShowCommunityId === 4" class="section_wrapper">
      <div class="section_wrapper-title">Actions</div>
      <FilterToggle
        class="flex-wrap"
        :buttons="redditActionsButtons"
        :id="0"
        @select="setRedditActions($event)"
        isDivided
        type="checkbox"
        :selectedActionsIds="redditActionsIds"
      />
      <div class="section_wrapper mb-5" v-if="redditActions.includes('reddit_join_community')">
        <div class="section_wrapper-title">Community URL</div>
        <Input
          v-model="redditCommunityUrl"
          name=""
          placeholder="https://reddit.com/"
          @input="debounceRedditCommunityValidation"
          :isError="!communityValid"
        />
        <span :class="{ 'd-block': !communityValid }" class="error-msg">
          Reddit URL is invalid.
        </span>
      </div>
      <div class="section_wrapper mb-5" v-if="redditActions.includes('reddit_own_post')">
        <div class="section_wrapper-title">Words to Include</div>
        <div class="section_wrapper-subtitle">
          Words that talents should include in their tweet. Start with @ for a mention, # for a
          hashtag, or enter another tweet's URL for a quote tweet.
        </div>
        <div v-if="words.length" class="selected-tags mt-3">
          <span v-for="(word, index) in words" :key="word + index" class="tag">
            {{ word }}
            <Icon
              class="remove-tag"
              @click.stop="removeWord(index)"
              icon="Cancel"
              :size="16"
            ></Icon>
          </span>
        </div>
        <div class="tweeter-add-word">
          <Input class="w-full" v-model="tweetWord" withoutName placeholder="Add word" />
          <BaseButton text="Add" type="twitter" :disabled="!tweetWord" @click="addWords" />
        </div>
        <span :class="{ 'd-block': !tweetWordValid }" class="error-msg">
          Required minimum one word
        </span>
      </div>
      <div class="section_wrapper mb-5" v-if="redditActions.includes('reddit_own_post')">
        <div class="section_wrapper-title">Default Post</div>
        <div class="section_wrapper-subtitle">Text that we will prefill for the users.</div>
        <TextArea v-model="postDefault" name="" placeholder="Enter the default post" />
        <span :class="{ 'd-block': !postDefault }" class="error-msg">
          Default post is required
        </span>
      </div>
      <div
        class="section_wrapper mb-5"
        v-if="
          redditActions.includes('reddit_save_post') ||
          redditActions.includes('reddit_vote_post') ||
          redditActions.includes('reddit_comment_post')
        "
      >
        <div class="section_wrapper-title">Reddit Post URL</div>
        <div class="section_wrapper-subtitle">Talent are required to share this post.</div>
        <Input
          v-model="savePostUrl"
          name=""
          placeholder="https://reddit.com/"
          @input="debounceRedditPostValidation"
          :isError="!postValid"
        />
        <span :class="{ 'd-block': !postValid }" class="error-msg">
          Reddit Post URL is invalid.
        </span>
        <CheckboxLabel
          v-if="redditActions.includes('reddit_vote_post')"
          @checked="setUpvote"
          :checkedProp="upvote"
          text="Upvote"
          :isTooltipActive="false"
        />
      </div>
      <div class="section_wrapper mb-5" v-if="redditActions.includes('reddit_karma_score')">
        <div class="section_wrapper-title">Karma Score</div>
        <NumberInput v-model="karmaAmount" name="" placeholder="" type="number" />
        <span
          :class="{
            'd-block': karmaAmount && +karmaAmount <= 0,
          }"
          class="error-msg"
        >
          Karma Score is requred and must be greater than 0
        </span>
      </div>
      <div class="section_wrapper mb-5" v-if="redditActions.includes('reddit_trophies')">
        <MultiSelectActive
          :options="trophies"
          @selected-items="setTrophie"
          :selectedRewards="selectedTrophies"
          placeholder="Select trophies"
          name="Number of Trophies"
        />
      </div>
    </div>

    <div v-if="isCommunityActive" class="section_wrapper">
      <div class="line"></div>
    </div>

    <div class="section_wrapper">
      <div class="section_wrapper-title">Task Name</div>
      <Input
        v-model="taskName"
        :isError="validationErrors.taskName.isError && validationErrors.taskName.isTriggered"
        :errorText="validationErrors.taskName.text"
        name=""
        placeholder="Enter the task name"
      />
    </div>
    <div class="section_wrapper">
      <div class="section_wrapper-title">Description</div>
      <div class="section_wrapper-subtitle">These are the instructions to complete the task.</div>
      <Editor
        :description="description"
        @update="setDescription"
        :isError="validationErrors.description.isError && validationErrors.description.isTriggered"
        :errorText="validationErrors.description.text"
      />
      <div class="upload-requirements">
        Attach up to 3 files. PNG, JPEG, PDF. Minimum file size 10 KB, maximum 10 MB.
      </div>
      <CustomUpload
        @changeError="handleImageError"
        :imagesFiles="images"
        @images="images = $event"
      />
    </div>
    <div class="section_wrapper">
      <div class="line"></div>
    </div>
    <div v-if="props.typeTask.id === 'on-chain'" class="section_wrapper">
      <div class="section_wrapper-title">On-Chain Condition</div>
      <div class="section_wrapper-subtitle">Select on of the task execution conditions.</div>
      <TaskOnChain :values="onChainValues" @update-on-chain-value="(key, value) => changeOnChainValue(key, value)" :validationErrors="validationErrors"  :edit="false" :isDividerVisible="true"/>
    </div>
    <div class="section_wrapper">
      <div class="section_wrapper-title">Participants</div>
      <div class="section_wrapper-subtitle">Determine who will see this task.</div>
      <FilterToggle
        :buttons="[
          {
            title: `Filtered Amount`,
            id: 0,
            name: 'Filtered Amount',
          },
          {
            title: `Specific Talents Only`,
            id: 1,
            name: 'Specific Talents Only',
          },
        ]"
        :id="idParticipants"
        @select="setIsShowParticipants($event)"
        isBig
      />
    </div>
    <div v-if="idParticipants === 0" class="section_wrapper">
      <div class="section_wrapper-title">Amount of Talents</div>
      <NumberInput
        :isDisabled="isAmountOfTalantUnlimited"
        v-model="talentAmount"
        name=""
        placeholder="0"
        type="number"
      />
      <CheckboxLabel
        tooltipText="All talents of the selected level and role will see the task."
        text="Unlimited"
        @checked="setIsAmountOfTalantUnlimited"
        :checkedProp="isAmountOfTalantUnlimited"
      />
      <span
        :class="{
          'd-block':
            validationErrors.amountOfTalents.isError &&
            validationErrors.amountOfTalents.isTriggered,
        }"
        class="error-msg"
      >
        {{ validationErrors.amountOfTalents.text }}
      </span>
    </div>
    <div class="section_wrapper">
      <div class="line"></div>
    </div>
    <div v-if="props.typeTask.id === 'on-chain'" class="section_wrapper">
      <div class="icon-title_wrapper">
        <div class="section_wrapper-title">
          Gate
          <div class="custom-condition-select" :tabindex="tabindex" ref="selectContainer">
              <div class="selected" :class="{ open: gateConditionSelectOpened }" @click="toggleConditionTypeSelect">
                  {{ seletedGateConditionOption.name }}
                  <span class="arrow" :class="{ flipped: gateConditionSelectOpened }"></span>
              </div>
              <div class="items" :class="{ selectHide: !gateConditionSelectOpened }">
                  <div v-for="(option, i) in gateConditionOptions" :key="i"
                      @click.stop="onConditionTypeSelect(option)">
                      {{ option.name }}
                      <Icon v-if="seletedGateConditionOption.id === option.id" name="Tik" :size="20"
                          color="#38405B" />
                  </div>
              </div>
          </div>
        </div>
        <TooltipIcon tooltipText="Gate is rules that determine who can access the task." />
      </div>
      <div class="section_wrapper-subtitle">
        To pass a gate, the talent must meet the conditions you specify below.
      </div>
      <TaskGate
        :conditions="gateConditions"
        :onAddCondition="addCondition"
        :onRemoveCondition="removeCondition"
        :onConditionValueChanged="changeConditionValue"
        :validationErrors="validationErrors.gate"
      />
    </div>
    <div v-if="idParticipants === 0" class="section_wrapper">
      <div class="section_wrapper-title">Direction</div>
      <div class="direction_wrapper">
        <DirectionsToggle
          big
          :buttons="directionsTags"
          @selected-ids="handleSelectedDirections"
          :id="directionId"
        >
        </DirectionsToggle>
      </div>
    </div>
    <div v-if="idParticipants === 0" class="section_wrapper">
      <div class="section_wrapper-title">Levels</div>
      <div class="section_wrapper-subtitle">
        You can select multiple levels. If you don’t select level, the task will be available to
        all.
      </div>

      <div class="direction_wrapper">
        <LevelsToggle
          :buttons="levels"
          :selectedLevels="selectedLevels"
          @select="setIsShowLevels($event)"
        />
      </div>
    </div>
    <div v-if="idParticipants === 0" class="section_wrapper">
      <div class="icon-title_wrapper">
        <div class="section_wrapper-title">Discord Role</div>
        <TooltipIcon
          tooltipText="Select a Discord role from your server to filter users who can see this task based on its presence"
        />
      </div>
      <DiscordRoleSelect
        :options="discordRoles"
        @input="setDiscordRole($event)"
        :isDisabled="isDiscordRoleActive"
        :reduceLength="15"
        isBig
      />
    </div>
    <div v-if="idParticipants === 1" class="section_wrapper">
      <div class="section_wrapper-title">Specific Talents</div>
      <div class="section_wrapper-subtitle">Only selected talents can see the task.</div>
      <div class="talent-btns-wrapper">
        <TalentBtn
          v-for="talent in selectedTalents"
          :="talent"
          :key="talent.name + talent.id"
          @remove="handleRemoveTalents"
        />
        <AddTalentSelect
          :options="talents"
          @selected-item="handleSelectedTalents"
          :selectedItems="selectedTalents"
          :isScroll="false"
        />
      </div>
    </div>
    <div v-if="props.typeTask.id === 'on-chain'" class="section_wrapper">
      <div class="line"></div>
    </div>
    <div class="section_wrapper">
      <MultiSelectActive
        :options="rewards"
        @selected-items="handleSelectedRewards"
        :selectedRewards="selectedRewards"
        placeholder="Select rewards"
        name="Rewards"
        :filter="false"
        isTooltip
        tooltipText="Choose the reward type: one or multiple at once"
      />
    </div>
    <div v-if="isCoinRewardActive" class="section_wrapper">
      <div class="section_wrapper-title">Blockchain</div>
      <div class="section_wrapper-subtitle">
        Choose on which blockchain the reward will be listed.
      </div>
      <BlockchainSelect
        :options="blockChainOptionsArr"
        @input="setBlockchain($event)"
        type="create"
        :isError="validationErrors.blockchains.isError && validationErrors.blockchains.isTriggered"
        :errorText="validationErrors.blockchains.text"
        :default="defaultBlockchain"
      />
    </div>
    <div v-if="isCoinRewardActive" class="section_wrapper">
      <div class="icon-title_wrapper">
        <div class="section_wrapper-title">Coin Reward</div>
        <!-- <TooltipIcon tooltipText="Choose the reward type: one or multiple at once" /> -->
      </div>
      <div class="section_wrapper-subtitle">
        Choose the token and activate the level coefficient.
      </div>
      <div class="coins-reward-wrapper">
        <div v-if="coins && coins.length" class="coins-reward">
          <CoinRewardSelect
            @amountChange="setCoinsAmount($event)"
            :amount="coinAmount"
            @input="setCoinId"
            :options="coins"
            :isError="validationErrors.coins.isError && validationErrors.coins.isTriggered"
            :errorText="validationErrors.coins.text"
            :default="defaultCoin"
          />
          <CheckboxLabel
            @checked="setIsLevelCoeficient"
            :checkedProp="isLevelCoeficient"
            text="Level Coefficient"
            tooltipText="Higher levels will receive rewards with level-based coefficients"
          />
        </div>
        <EstimatedAmount
          :isUnactive="isAmountOfTalantUnlimited"
          :amount="estimatedAmount"
          :currency="coinSymbol"
        />
      </div>
    </div>
    <div v-if="isDiscordRewardActive" class="section_wrapper">
      <div class="icon-title_wrapper">
        <div class="section_wrapper-title">Discord Role Reward</div>
        <TooltipIcon tooltipText="Select the Discord role to reward users with" />
      </div>
      <div class="section_wrapper-subtitle">
        If some roles are not shown, the Talentum bot needs to be moved above them in the roles
        settings.
      </div>
      <FilterToggle
        :buttons="discordRewards"
        :id="0"
        @select="setDiscordRoleReward($event)"
        isDivided
      />
    </div>
    <div v-if="isNftRewardActive" class="section_wrapper">
      <div class="section_wrapper-title">NFT Reward</div>
      <div class="section_wrapper-subtitle">Upload an NFT image and name.</div>
      <Input v-model="nftName" name="" placeholder="Enter the NFT name" />
    </div>
    <!-- <div class="section_wrapper"> -->
    <div v-if="isCreditRewardActive" class="section_wrapper">
      <div class="icon-title_wrapper">
        <div class="section_wrapper-title">Credits</div>
        <TooltipIcon
          tooltipText="Credits are points that you can use to reward users and later exchange for a real reward"
        />
      </div>
      <div class="section_wrapper-subtitle">
        Enter the amount of credits you're supposed to award users
      </div>
      <CreditsRewardInput
        @amountChange="setCreditsAmount($event)"
        :amount="creditsAmount"
        :isError="validationErrors.credits.isError && validationErrors.credits.isTriggered"
        :errorText="validationErrors.credits.text"
      />
      <!-- <FilterToggle
        :buttons="discordRewards"
        :id="0"
        @select="setDiscordRoleReward($event)"
        isDivided
      /> -->
    </div>
    <div class="section_wrapper">
      <div class="line"></div>
    </div>
    <div class="section_wrapper">
      <div class="section_wrapper-title">Priority</div>
      <div class="priority-toggle-wrapper">
        <FilterToggle
          :buttons="priorityButtons"
          :id="priorityId"
          @select="setPriority($event)"
          isBig
          fixedWidth="240px"
        />
      </div>
    </div>

    <div class="section_wrapper last">
      <div class="section_item">
        <div class="section_wrapper-title">Start Date</div>
        <CustomDatePicker
          :defaultDate="transformDate(startDate)"
          :minDate="todayDate"
          :maxDate="transformDate(addDaysToDate(endDate, -1))"
          @selectedDate="setStartDate"
        />
      </div>
      <div class="section_item">
        <div class="section_wrapper-title">End Date</div>
        <CustomDatePicker
          :defaultDate="transformDate(endDate)"
          :minDate="transformDate(startDate)"
          @selectedDate="setEndDate"
        />
      </div>
    </div>
    <BaseButton text="Publish" type="action" @click="send" />
  </div>
  <Loader v-if="isLoading" />
</template>

<script setup>
import { inject, onMounted, reactive, ref, toRef } from 'vue';
import { useProjectsStore } from '~/store/projects';
import { useAmbassadorsStore } from '~/store/ambassadors';
import { useActivitiesStore } from '~/store/activities';

import {
  getBadgeTypeByName,
  getColorByClassName,
  dateToTimestamp,
  transformDate,
  addDaysToDate,
} from '@/util/helpers';

import { useCoinsStore } from '~/store/coins';
import { useTasksStore } from '~/store/tasks';
import { useDiscordStore } from '~/store/discord';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '~/store/auth';
import axios from 'axios';
import axiosService from '~~/service/axiosService';
import { useUserStore } from '~/store/user';
import { useDebounce } from '@/hooks/useDebounce';
import { useBlockchainsStore } from '~/store/blockchains';

import { getConditionDefaultValues } from '../Gate/utils';
import { validateByKey } from '../Gate/validate';
import {
  conditions,
  ON_CHAIN_CONDITION_PARTS,
  ON_CHAIN_CONDITION_PARTS_MAP,
  fieldInTheFormScope,
  ON_CHAIN_TASK,
  appendCreateOnchainTaskCondition,
  appendCreateOnchainTaskGate
} from '../OnChain/utils';
import { blockchains } from '~/util/onchain';

import { validationAddress, validationTokenId, validationAmount } from '../OnChain/validation';

const roles = inject('roles');
const {
  isProjectOwner,
  isSuperAdmin,
  isProjectAdministrator,
  isAdminSupport,
  isProjectManager,
  isCatapultManager,
} = roles;

const router = useRouter();

const props = defineProps({
  isTalents: { type: Boolean, default: false },
  currentSelectedTalents: { type: Array, default: [] },
  typeTask: {
    type: Object,
    required: true,
  },
  
});
//REDDIT
const redditCommunityUrl = ref(null);
const postDefault = ref(null);
const savePostUrl = ref(null);
const votePost = ref(null);
const upvote = ref(null);
const commentPostUrl = ref(null);
const karmaAmount = ref(1);
const trophiesAmount = ref(0);
const selectedTrophies = ref([]);
const trophies = computed(() => tasksStore.getTrophies);
// END

const nuxtApp = useNuxtApp();
const route = useRoute();
const authStore = useAuthStore();
const userStore = useUserStore();
const ambassadorsStore = useAmbassadorsStore();
const projectsStore = useProjectsStore();
const activityStore = useActivitiesStore();
const coinsStore = useCoinsStore();
const tasksStore = useTasksStore();
const discordStore = useDiscordStore();
const blockchainsStore = useBlockchainsStore();

const isLoading = ref(false);
const words = ref([]);
const defaultWords = ref([]);
const tweetWord = ref('');
const emit = defineEmits(['close']);

onMounted(async () => {
  if (localStorage.social && route.query) {
    axios
      .get(useRuntimeConfig().public.apiBase + `projects/auth/${localStorage.social}/callback/`, {
        params: new URLSearchParams(route.query),
        headers: {
          Authorization: `Bearer ${authStore.getToken()}`,
        },
      })
      .then(async (response) => {
        await projectsStore.getProjectsSocialProvidersAction(projectId.value);
        await nuxtApp.$alert.show(`User authorized using ${localStorage.social}`, {
          type: 'success',
          timeout: 5000,
        });
        localStorage.social = '';
      })
      .catch((e) => {
        console.log(e);
        console.log('e.response', e.response);
        if (e.response.status == 400) {
          nuxtApp.$alert.show(e.response.data.message, {
            type: 'error',
            timeout: 5000,
          });
        } else {
          nuxtApp.$alert.show(`User wasn't authorized using ${localStorage.social}`, {
            type: 'error',
            timeout: 5000,
          });
        }

        localStorage.social = '';
      });
  }
  if (
    isTalentsPropRef.value &&
    currentSelectedTalentsPropRef.value &&
    currentSelectedTalentsPropRef.value.length
  ) {
    idParticipants.value = 1;
    selectedTalents.value = currentSelectedTalentsPropRef.value;
  }
  await blockchainsStore.getBlockchainsAction();
  await tasksStore.getTrophiesAction();
  await projectsStore.getProjectsAction();
  await ambassadorsStore.getAmbassadorsAction({ levels: null, activity_id: null });
  await activityStore.getActivitiesAction();
  if (blockchainId.value) {
    await coinsStore.getCoinsAction(blockchainId.value);
  }
  if (coins.value && coins.value.length) {
    defaultCoin.value = coins.value[0];
  }
  if (localStorage.cachedTask) {
    const cachedTask = JSON.parse(localStorage.cachedTask);

    blockchainId.value = cachedTask.blockchainId;
    defaultCoin.value = cachedTask.defaultCoin;
    selectedTalents.value = cachedTask.selectedTalents;
    coinAmount.value = cachedTask.coinAmount;
    coinId.value = cachedTask.coinId;
    coinSymbol.value = cachedTask.coinSymbol;
    idParticipants.value = cachedTask.idParticipants;
    selectedItems.value = cachedTask.selectedItems;
    selectedRewards.value = cachedTask.selectedRewards;
    selectedLevels.value = cachedTask.selectedLevels;
    twitterActions.value = cachedTask.twitterActions;
    images.value = cachedTask.images;
    projectId.value = cachedTask.projectId;
    taskName.value = cachedTask.taskName;
    userName.value = cachedTask.userName;
    tweetUrl.value = cachedTask.tweetUrl;
    tweetSpaceUrl.value = cachedTask.tweetSpaceUrl;
    telegramUrl.value = cachedTask.telegramUrl;
    discordUrl.value = cachedTask.discordUrl;
    tweetReply.value = cachedTask.tweetReply;
    tweetDefault.value = cachedTask.tweetDefault;
    nftName.value = cachedTask.nftName;
    talentAmount.value = cachedTask.talentAmount;
    invitesAmount.value = cachedTask.invitesAmount;
    winnersAmount.value = cachedTask.winnersAmount;
    discordReward.value = cachedTask.discordReward;
    priority.value = cachedTask.priority;
    isCommunityActive.value = cachedTask.isCommunityActive;
    isInvitesUnlimited.value = cachedTask.isInvitesUnlimited;
    isLevelCoeficient.value = cachedTask.isLevelCoeficient;
    isAmountOfTalantUnlimited.value = cachedTask.isAmountOfTalantUnlimited;
    isShowCommunityId.value = cachedTask.isShowCommunityId;
    description.value = cachedTask.description;
    driver.value = cachedTask.driver;
    discordRole.value = cachedTask.discordRole;
    directionId.value = cachedTask.directionId;
    startDate.value = cachedTask.startDate;
    endDate.value = cachedTask.endDate;
    projectDefault.value = cachedTask.projectDefault;
    priorityId.value = cachedTask.priorityId;
    twitterActionsIds.value = cachedTask.twitterActionsIds;
    discordRewardId.value = cachedTask.discordRewardId;
    type.value = cachedTask.type;
    localStorage.removeItem('cachedTask');
  }

  if (
    (isProjectOwner.value && userProjectId.value) ||
    (isProjectAdministrator.value && userProjectId.value) ||
    (isProjectManager.value && userProjectId.value)
  ) {
    projectId.value = userProjectId.value;
    discordStore.getDiscordRolesAction(projectId.value);
  }
});

const blockChainOptionsArr = ref([{ id: 0, name: 'All Blockchains' }]);

const blockChainOptions = computed(() => [
  { id: 0, name: 'All Blockchains' },
  ...blockchainsStore.getBlockchains,
]);

const userProjectId = computed(() => userStore.getUserProjectId);
const directions = computed(() => activityStore.getActivities);
const coins = computed(() => {
  const originalArray = coinsStore.getCoins;

  if (originalArray && originalArray.length) {
    return originalArray.map((item) => ({
      name: item.name,
      id: item.id,
      symbol: item.code || item.symbol,
      amount: Math.floor(Math.random()),
    }));
  }
});

watch(
  coins,
  (value) => {
    console.log('WATCH COINS', value);

    if (value && value.length) {
      defaultCoin.value = value[0];
      coinId.value = value[0].id;
      console.log('defaultCoin.value', defaultCoin.value);
    }
  },
  { deep: true, instant: true },
);

const directionsTags = computed(() => {
  const original = directions.value;
  if (original && original.length) {
    let obj = original.map((i) => {
      return {
        title: i.name,
        id: i.id,
        type: getBadgeTypeByName(i.name),
      };
    });
    const allTags = [
      {
        title: 'All',
        id: null,
        type: 'transparent',
      },
    ].concat(obj);
    return allTags;
  }
});

const talents = computed(() => {
  const originalArray = ambassadorsStore.getAmbassadors;
  return originalArray.map((item) => ({
    name: item.name,
    id: item.id,
    avatar: item.avatar ? item.avatar : '',
  }));
});

const priorityButtons = [
  {
    title: `Low`,
    id: 0,
    name: 'Low',
  },
  {
    title: `Middle`,
    id: 1,
    name: 'Medium',
  },
  {
    title: `High`,
    id: 2,
    name: 'High',
  },
];
const twitterActionsButtons = [
  {
    title: `Follow`,
    id: 0,
    name: 'twitter_follow',
  },
  {
    title: `Like`,
    id: 1,
    name: 'twitter_like',
  },
  {
    title: `Reply`,
    id: 2,
    name: 'twitter_reply',
  },
  {
    title: `Retweet`,
    id: 3,
    name: 'twitter_retweet',
  },
  {
    title: `Tweet`,
    id: 4,
    name: 'twitter_tweet',
  },
  {
    title: `Join Space`,
    id: 5,
    name: 'twitter_space',
  },
];
const redditActionsButtons = [
  {
    title: `Join a Community`,
    id: 0,
    name: 'reddit_join_community',
  },
  {
    title: `Write a Post`,
    id: 1,
    name: 'reddit_own_post',
  },
  {
    title: `Save a Post`,
    id: 2,
    name: 'reddit_save_post',
  },
  {
    title: `Vote`,
    id: 3,
    name: 'reddit_vote_post',
  },
  {
    title: `Comment`,
    id: 4,
    name: 'reddit_comment_post',
  },
  // {
  //   title: `Karma`,
  //   id: 5,
  //   name: 'reddit_karma_score',
  // },
  // {
  //   title: `Trophies`,
  //   id: 6,
  //   name: 'reddit_trophies',
  // },
  // {
  //   title: `Add Friends`,
  //   id: 7,
  //   name: 'add_friend',
  // },
  // {
  //   title: `Contribute to a Subreddit`,
  //   id: 8,
  //   name: 'contributor',
  // },
];

const communityOptions = [
  {
    title: `Telegram`,
    id: 0,
    name: 'Telegram',
  },
  {
    title: `Discord`,
    id: 1,
    name: 'Discord',
  },
  {
    title: `Twitter`,
    id: 2,
    name: 'Twitter',
  },
  {
    title: `Reddit`,
    id: 4,
    name: 'Reddit',
  },
  {
    title: `Invites`,
    id: 3,
    name: 'Invites',
  },
];
const levels = [
  {
    title: `0`,
    id: 0,
  },
  {
    title: `1`,
    id: 1,
  },
  {
    title: `2`,
    id: 2,
  },
  {
    title: `3`,
    id: 3,
  },
  {
    title: `4`,
    id: 4,
  },
  {
    title: `5`,
    id: 5,
  },
];
const selectedTalents = ref([]);

const coinAmount = ref(0);
const creditsAmount = ref(0);
const coinId = ref(null);
const coinSymbol = ref('');
const idParticipants = ref(0);
const selectedItems = ref([]);
const selectedRewards = ref([
  {
    name: 'Coins',
    id: 1,
  },
]);

const selectedLevels = ref([]);
const twitterActions = ref(['twitter_follow']);
const images = ref([]);
const projectId = ref(null);
const taskName = ref('');
const userName = ref('');
const tweetUrl = ref('');
const tweetSpaceUrl = ref('');
const telegramUrl = ref('');
const discordUrl = ref('');
const tweetReply = ref('');
const tweetDefault = ref('');
const nftName = ref('');
const talentAmount = ref('');
const invitesAmount = ref(1);
const winnersAmount = ref(0);
const discordReward = ref('');
const priority = ref('Low');
const isCommunityActive = ref(false);
const isInvitesUnlimited = ref(false);
const isLevelCoeficient = ref(false);
const isAmountOfTalantUnlimited = ref(true);
const isShowCommunityId = ref(2);
const description = ref('');
const driver = ref('twitter');
const discordRole = ref(null);
const directionId = ref(0);
const projectDefault = ref(null);
const isImagesError = ref(false);
const priorityId = ref(0);
const twitterActionsIds = ref(['0']);
const discordRewardId = ref(0);
const blockchainId = ref(0);
const defaultCoin = ref(null);
const defaultBlockchain = ref(null);
const type = ref(null);
const todayDate = new Date();
const twoDaysFromNow = new Date(todayDate);
const oneDayFromNow = new Date(todayDate);
oneDayFromNow.setDate(todayDate.getDate() + 1);
twoDaysFromNow.setDate(todayDate.getDate() + 2);
const startDate = ref(todayDate);
const endDate = ref(twoDaysFromNow);

watch(
  [() => blockChainOptions.value, () => blockchainId.value],
  ([blockChainOptions, blockchainId]) => {
    if (blockChainOptions && blockChainOptions.length && !blockchainId) {
      blockChainOptionsArr.value = blockChainOptions;
    } else if (blockChainOptions && blockChainOptions.length) {
      blockChainOptionsArr.value = [
        { id: 0, name: 'All Blockchains' },
        ...blockChainOptions.filter((item) => +item.id !== 0),
      ];
    }
  },
  { deep: true, instant: true, dependsOn: blockchainId },
);
const discordRoles = computed(() => {
  const originalArray = discordStore.getDiscordRoles;
  if (originalArray && originalArray.length) {
    return [{ name: 'Any roles', id: 0 }, ...originalArray];
  } else {
    return [{ name: 'Any roles', id: 0 }];
  }
});

const isDiscordRoleActive = computed(() => {
  console.log(discordRoles.value);
  return !(
    !!projectId.value &&
    !!discordRoles.value &&
    discordRoles.value.length &&
    discordRoles.value.length > 1
  );
});

watch(isDiscordRoleActive, (value) => {
  if (value) {
    selectedRewards.value = selectedRewards.value.filter((item) => item.name !== 'Discord Role');
    rewards.value = rewards.value.filter((item) => item.name !== 'Discord Role');
    if (!selectedRewards.value.length) {
      selectedRewards.value = [
        {
          name: 'Coins',
          id: 1,
        },
      ];
    }
    if (!rewards.value.length) {
      rewards.value = [
        {
          name: 'Coins',
          id: 1,
        },
      ];
    }
  }
});

const discordRewards = computed(() => {
  const originalArray = discordStore.getDiscordRoles;
  if (originalArray && originalArray.length)
    return originalArray.map((item) => ({
      title: item.name,
      id: item.id,
      name: item.name,
    }));
  else return [];
});

watch(discordRewards, (value) => {
  if (value && value.length && !discordRewardId.value) {
    discordRewardId.value = value[0].id;
  }
});

// GATE -->
const gateConditions = ref([]);

const gateConditionOptions = computed(() => [
    { name: 'Any', id: 1 },
    { name: 'All', id: 0 },
])

const seletedGateConditionOption = ref(
    gateConditionOptions.value[0]
)
const gateConditionSelectOpened = ref(false)

const toggleConditionTypeSelect = () => {
    gateConditionSelectOpened.value = !gateConditionSelectOpened.value
}

const onConditionTypeSelect = (option) => {
    seletedGateConditionOption.value = option
    toggleConditionTypeSelect()
}

const addCondition = ({ value, icon, name }) => {
  gateConditions.value.push({
    id: value,
    type: value,
    title: name,
    values: getConditionDefaultValues(value),
    icon,
  });
};

const removeCondition = (type) => {
  gateConditions.value = gateConditions.value.filter((v) => v.id !== type);
};

const changeConditionValue = (type, key, value) => {
  if (typeof value === 'string' || typeof value === 'number') {
    const index = gateConditions.value.findIndex((c) => c.type === type);
    gateConditions.value[index].values[key] = value;
    revalidateGateCondition(type, key, value);
  }
};

const setError = (type, key, error) => {
  if (!(type in validationErrors.gate)) {
    validationErrors.gate[type] = {};
  }
  const condition = validationErrors.gate[type];
  condition[key] = {
    isError: true,
    errorText: error,
  };
};

const clearError = (type, key) => {
  if (type in validationErrors.gate) {
    const condition = validationErrors.gate[type];
    if (key in condition) {
      condition[key] = {
        isError: false,
        errorText: '',
      };
    }
  }
};

const revalidateGateCondition = (type, key, value, options) => {
  const validationRes = validateByKey(key, value, options);
  if (typeof validationRes !== 'boolean') {
    setError(type, key, validationRes);
    return false
  } else if (validationRes) {
    clearError(type, key);
    return true
  }
};
// <-- GATE

//  OnChain Condition -->

const onChainValues = ref({
  selectedBlockchain:blockchains[0],
  selectedCondition: conditions[0],
  receiverAddress: '',
  contractAddress: '',
  currencyAddress: '',
  amountCondition: 0,
  senderAddress: '',
  conditions: '',
  tokenId: '',
  actionButtonTitle: '',
  actionButtonLink: '',
  tokenName:'',
  nftName:'',
  nftPreview:'',
  isNativeToken: false,
})

const changeOnChainValue = (key, value) => {
   onChainValues.value[key] = value;
   validationCheck(key)
}

// <-- OnChain Condition

const rewards = computed(() => {
  const isDiscordActive = isDiscordRoleActive.value;

  if (!isDiscordActive) {
    return [
      {
        name: 'Coins',
        id: 1,
      },
      {
        name: 'Discord Role',
        id: 2,
      },
      {
        name: 'Credits',
        id: 4,
      },
    ];
  } else
    return [
      {
        name: 'Coins',
        id: 1,
      },
      {
        name: 'Credits',
        id: 4,
      },
    ];
});

const validationErrors = reactive({
  projects: {
    isTriggered: false,
    isError: false,
    text: '',
  },
  taskName: {
    isTriggered: false,
    isError: false,
    text: '',
  },
  contractAddress: {
    isTriggered: false,
    isError: false,
    text: '',
  },
  receiverAddress: {
    isTriggered: false,
    isError: false,
    text: '',
  },
  amountCondition: {
    isTriggered: false,
    isError: false,
    text: '',
  },
  currencyAddress: {
    isTriggered: false,
    isError: false,
    text: '',
  },
  senderAddress: {
    isTriggered: false,
    isError: false,
    text: '',
  },
  tokenId: {
    isTriggered: false,
    isError: false,
    text: '',
  },
  actionButtonTitle: {
    isTriggered: false,
    isError: false,
    text: '',
  },
  actionButtonLink: {
    isTriggered: false,
    isError: false,
    text: '',
  },
  description: {
    isTriggered: false,
    isError: false,
    text: '',
  },
  coins: {
    isTriggered: false,
    isError: false,
    text: '',
  },
  amountOfTalents: {
    isTriggered: false,
    isError: false,
    text: '',
  },
  blockchains: {
    isTriggered: false,
    isError: false,
    text: '',
  },
  credits: {
    isTriggered: false,
    isError: false,
    text: '',
  },
  gate: {
    isTriggered: false,
    isError: false,
    text: '',
  },
});

const isTelegramValid = ref(true);
const isNotValidPrivatLink = ref(false);

function isValidTelegramLink(link) {
  const regex = /^https:\/\/t.me\/\+.*$/; // Matches links starting with https://t.me/+ and then followed by any characters
  return regex.test(link);
}

const telegramValidation = () => {
  isNotValidPrivatLink.value = false;
  if (!telegramUrl.value.trim()) {
    isTelegramValid.value = false;
    return false;
  }

  const isNotValidLink = isValidTelegramLink(telegramUrl.value);

  if (isNotValidLink && telegramUrl.value.includes('+')) {
    isTelegramValid.value = false;
    isNotValidPrivatLink.value = true;
    return;
  }

  // const discordRegex =
  //   /^(https?:\/\/)?(discord(?:(?:app)?\.com\/invite|\.gg)(?:\/invite)?)\/(?<code>[\w-]{2,255})/i;
  // const isValid = discordRegex.test(discordUrl.value);
  // if (!isValid) {
  //   isDiscordValid.value = false;
  //   return false;
  // }

  isTelegramValid.value = true;
  // const data = {
  //   telegram_invite: telegramUrl.value,
  //   // discord_invite: discordUrl.value,
  //   verifier_driver: driver.value,
  //   'verifier_types[]': twitterActions.value,
  // };
  // updateTask({ data });
  return true;
};

const addWords = () => {
  if (tweetWord.value) {
    words.value.push(tweetWord.value);
    tweetWord.value = '';
  }
  tweetWordValidation();
};

const removeWord = (id) => {
  words.value.splice(id, 1);
  tweetWordValidation();
};

const setStartDate = (event) => {
  const today = new Date();
  const eventDate = new Date(event);
  const isToday = eventDate.getTime() === today.getTime();
  const isTodayDate = eventDate.getDate() === today.getDate();
  if (isTodayDate) {
    startDate.value = todayDate;
  } else {
    startDate.value = event;
  }
};

const handleImageError = (event) => {
  console.log('handleImageError', event);
  isImagesError.value = event;
};

const setEndDate = (event) => {
  const today = new Date();
  const eventDate = new Date(event);
  const isToday = eventDate.getTime() === today.getTime();
  if (isToday) {
    endDate.value = todayDate;
  } else {
    endDate.value = event;
  }
};

const handleSelectedDirections = (event) => {
  directionId.value = event.id;
  if (selectedLevels.value && selectedLevels.value.length) {
    ambassadorsStore.getAmbassadorsAction({
      levels: selectedLevels.value,
      activity_id: event.id,
    });
  } else {
    ambassadorsStore.getAmbassadorsAction({ activity_id: event.id });
  }
};

const setBlockchain = (event) => {
  blockchainId.value = event.id;
  blockChainOptions.value.filter((item) => +item.id !== 0);
  defaultBlockchain.value = event;
  validationCheck('blockchains');
};

const setCoinId = (event) => {
  coinId.value = event.id;
  coinSymbol.value = event.symbol;
  defaultCoin.value = event;
};

const setDescription = (event) => {
  description.value = event;
  validationCheck('description');
};

const setDiscordRole = (event) => {
  discordRole.value = event.id;
};

const setDiscordRoleReward = (data) => {
  discordReward.value = data.name;
  discordRewardId.value = data.id;
};

const setCoinsAmount = (event) => {
  coinAmount.value = event;
  validationCheck('coins');
};

const setCreditsAmount = (event) => {
  creditsAmount.value = event;
  validationCheck('credits');
};

watch(blockchainId, (value) => {
  if (value) {
    coinsStore.getCoinsAction(value);
  }
});

watch(projectId, async (value) => {
  if (value) {
    discordStore.clearDiscordRoles();
    await projectsStore.getProjectsSocialProvidersAction(value);
    if (isDiscordConnected.value) {
      discordStore.getDiscordRolesAction(value);
    }
  }
});

watch(talentAmount, (value) => {
  if (value) {
    isAmountOfTalantUnlimited.value = false;
  }
  validationCheck('amountOfTalents');
});

watch(taskName, () => {
  validationCheck('taskName');
});

watch(gateConditions, () => {
  validationCheck('gate');
});

const estimateTimeout = ref(null);
const estimatedAmount = ref({ min: 0, max: 0, total: 0 });

watch(
  selectedTalents,
  (value) => {
    console.log('selectedTalents WATCH', value);
  },
  { deep: true, instant: true },
);

const isTalentsPropRef = toRef(props, 'isTalents');
const currentSelectedTalentsPropRef = toRef(props, 'currentSelectedTalents');

watch(
  [() => isTalentsPropRef.value, () => currentSelectedTalentsPropRef.value],
  ([isTalentsPropRef, currentSelectedTalentsPropRef]) => {
    if (isTalentsPropRef && currentSelectedTalentsPropRef && currentSelectedTalentsPropRef.length) {
      idParticipants.value = 1;
      selectedTalents.value = currentSelectedTalentsPropRef;
    }
  },
  { deep: true, instant: true },
);

watch(
  [
    () => selectedRewards.value,
    () => selectedLevels.value,
    () => directionId.value,
    () => selectedTalents.value,
    () => talentAmount.value,
    () => coinAmount.value,
    () => isLevelCoeficient.value,
  ],
  ([
    selectedRewards,
    selectedLevels,
    directionId,
    selectedTalents,
    talentAmount,
    coinAmount,
    isLevelCoeficient,
  ]) => {
    if ((+talentAmount > 0 && +coinAmount > 0) || (selectedTalents.length && +coinAmount > 0)) {
      clearTimeout(estimateTimeout.value);

      const rewards = selectedRewards.map((item) => ({
        type: item.name.split(' ').join('_').toLowerCase(),
        value: String(coinAmount),
      }));

      const selectedTalentsInt = selectedTalents.map((talent) => +talent.id);

      const estimateData = {
        rewards,
        levels: selectedLevels && selectedLevels.length ? selectedLevels : [],
        activity_id: directionId == 0 ? null : directionId,
        assign_user_ids: selectedTalentsInt,
        number_of_participants: talentAmount,
        level_coefficient: isLevelCoeficient,
      };

      estimateTimeout.value = setTimeout(async () => {
        const { data } = await axiosService.post(
          useRuntimeConfig().public.apiBase + `v2/tasks/estimated-amount`,
          estimateData,
        );
        estimatedAmount.value = data;
      }, 300);
    }
  },
  { immediate: true, deep: true },
);

const socialProviders = computed(() => projectsStore.getSocialProviders);

const isTelegramConnected = computed(() => {
  return !!projectsStore.getSocialProviders.some((item) => item.provider_name === 'telegram_bot');
});
const isDiscordConnected = computed(() => {
  return !!projectsStore.getSocialProviders.some((item) => item.provider_name === 'discord_bot');
});
const isTwitterConnected = computed(() => {
  return !!projectsStore.getSocialProviders.some((item) => item.provider_name === 'twitter');
});

const isCoinRewardActive = computed(
  () => {
    if (selectedRewards.value && selectedRewards.value.length) {
      return selectedRewards.value.some((item) => item.id === 1);
    } else return false;
  },
  { dependsOn: [selectedRewards] },
);
const isDiscordRewardActive = computed(
  () => {
    if (selectedRewards.value && selectedRewards.value.length) {
      return selectedRewards.value.some((item) => item.id === 2);
    } else return false;
  },
  { dependsOn: [selectedRewards] },
);
const isCreditRewardActive = computed(
  () => {
    if (selectedRewards.value && selectedRewards.value.length) {
      return selectedRewards.value.some((item) => item.id === 4);
    } else return false;
  },
  { dependsOn: [selectedRewards] },
);
const isNftRewardActive = computed(
  () => {
    if (selectedRewards.value && selectedRewards.value.length) {
      return selectedRewards.value.some((item) => item.id === 3);
    } else return false;
  },
  { dependsOn: [selectedRewards] },
);

const setIsAmountOfTalantUnlimited = (value) => {
  if (value) {
    talentAmount.value = '';
  }
  isAmountOfTalantUnlimited.value = value;
  validationCheck('amountOfTalents');
};

const setIsLevelCoeficient = (value) => {
  isLevelCoeficient.value = value;
};

const setIsInvitesUnlimited = (value) => {
  isInvitesUnlimited.value = value;
};
const setUpvote = (value) => {
  upvote.value = value;
};

watch(isInvitesUnlimited, (value) => {
  if (value) {
    invitesAmount.value = 0;
  }
});

const setIsCommunityActive = (value) => {
  isShowCommunityId.value = 2;
  twitterActions.value = ['twitter_follow'];
  isCommunityActive.value = value;
};

const handleRemoveTalents = (id) => {
  selectedTalents.value = selectedTalents.value.filter((item) => item.id !== id);
};

const handleSelectedTalents = (item) => {
  selectedTalents.value.push(item);
};

const handleSelectedRewards = (items) => {
  selectedRewards.value = items;
};

const setPriority = (data) => {
  priority.value = data.status;
  priorityId.value = data.id;
};

const setProject = (data) => {
  isAddInitialProject.value = false;
  projectId.value = data.id;
  projectDefault.value = data;
  if (projectId.value) {
    validationCheck('projects');
  }
};
const setTrophie = (data) => {
  selectedTrophies.value = data;
};

const setTwitterActions = (items) => {
  twitterActions.value = items.names;
  twitterActionsIds.value = items.checkedButtons;
};
const redditActions = ref(['reddit_join_community']);
const redditActionsIds = ref([0]);
const setRedditActions = (items) => {
  redditActions.value = items.names;
  redditActionsIds.value = items.checkedButtons;
};

const setIsShowLevels = (items) => {
  selectedLevels.value = items.checkedButtons;

  if (directionId.value) {
    ambassadorsStore.getAmbassadorsAction({
      levels: items.checkedButtons,
      activity_id: directionId.value,
    });
  } else {
    ambassadorsStore.getAmbassadorsAction({ levels: items.checkedButtons });
  }
};

const setIsShowCommunity = (event) => {
  isShowCommunityId.value = event.id;
  twitterActions.value = [];
  redditActions.value = [];
  switch (event.id) {
    case 0:
      driver.value = 'telegram';
      twitterActions.value = ['telegram_invite'];
      twitterActionsIds.value = ['0'];
      invitesAmount.value = 0;
      break;
    case 1:
      driver.value = 'discord';
      twitterActions.value = ['discord_invite'];
      twitterActionsIds.value = ['0'];
      invitesAmount.value = 0;
      break;
    case 2:
      driver.value = 'twitter';
      twitterActions.value = ['twitter_follow'];
      twitterActionsIds.value = ['0'];
      invitesAmount.value = 0;
      break;
    case 4:
      driver.value = 'reddit';
      redditActions.value = ['reddit_join_community'];
      redditActionsIds.value = ['0'];
      invitesAmount.value = 0;
      break;
    default:
      driver.value = '';
      twitterActions.value = [];

      break;
  }

  console.log(driver.value, 'test');
};

const setIsShowParticipants = (event) => {
  if (event.id === 1) {
    talentAmount.value = '';
    isAmountOfTalantUnlimited.value = false;
  }
  if (event.id === 0) {
    selectedTalents.value = [];
  }
  idParticipants.value = event.id;
};

const getProjectsOptions = (projectsArray, isAddInitial = true) => {
  if (!projectsArray || (projectsArray && !projectsArray.length)) {
    if (isAddInitial) {
      return [
        {
          name: 'All Projects',
          id: '',
        },
      ];
    } else {
      return [];
    }
  }

  const projectsIds = projectsArray.map((item) => {
    return {
      id: item.id,
      name: item.name,
    };
  });

  if (isAddInitial) {
    const projectsOptions = [
      {
        name: 'All Projects',
        id: '',
      },
    ].concat(projectsIds);
    return projectsOptions;
  } else {
    return projectsIds;
  }
};

const isAddInitialProject = ref(true);

const projects = computed(
  () => {
    const projectsArray = projectsStore.getProjects;
    return getProjectsOptions(projectsArray, isAddInitialProject.value);
  },
  { dependsOn: [isAddInitialProject] },
);

const timeout = ref(null);

const isDiscordValid = ref(true);

const discordValidation = () => {
  if (!discordUrl.value.trim()) {
    isDiscordValid.value = false;
    return false;
  }
  const discordRegex =
    /^(https?:\/\/)?(discord(?:(?:app)?\.com\/invite|\.gg)(?:\/invite)?)\/(?<code>[\w-]{2,255})/i;
  const isValid = discordRegex.test(discordUrl.value);
  if (!isValid) {
    isDiscordValid.value = false;
    return false;
  }

  isDiscordValid.value = true;
  return true;
};

const usernameValid = ref(true);

const usernameValidation = async () => {
  try {
    if (!userName.value.trim()) {
      usernameValid.value = false;
      return false;
    }
    const titterFollowRegex = /(^|[^@\w])@(\w{1,15})\b/i;
    const isValid = titterFollowRegex.test('@' + userName.value);
    if (!isValid) {
      usernameValid.value = false;
      return false;
    }
    usernameValid.value = true;
    const data = await axiosService.get(
      useRuntimeConfig().public.apiBase + `twitter/user/${userName.value}`,
    );
    usernameValid.value = true;
    return true;
  } catch (error) {
    usernameValid.value = false;
    return false;
  }
};

const debouncedUsernameValidation = useDebounce(usernameValidation, 300);

const tweetWordValid = ref(true);

const tweetWordValidation = async () => {
  if (!words.value.length) {
    tweetWordValid.value = false;
    return false;
  }

  tweetWordValid.value = true;
  return true;
};

const debouncedTweetWordValidation = useDebounce(tweetWordValidation, 300);

const tweetDefaultValid = ref(true);

const tweetDefaultValidation = async () => {
  console.log(tweetDefault.value);
  if (!tweetDefault.value.trim()) {
    tweetDefaultValid.value = false;
    return false;
  }

  tweetDefaultValid.value = true;
  return true;
};

const debouncedTweetDefaultValidation = useDebounce(tweetDefaultValidation, 300);

const tweetValid = ref(true);

const tweetLinkValidation = async () => {
  try {
    if (!tweetUrl.value.trim()) {
      tweetValid.value = false;
      return false;
    }
    const twitterTweetRegex =
      /^(?:https?:\/\/)?(?:www\.|m\.|mobile\.)?(twitter|x)\.com\/(?:#!\/)?\w+\/status\/(\d+)/i;

    const isValid = twitterTweetRegex.test(tweetUrl.value);

    if (!isValid) {
      tweetValid.value = false;
      return false;
    }
    tweetValid.value = true;
    const data = await axiosService.get(
      useRuntimeConfig().public.apiBase + `twitter/tweet/${tweetUrl.value.split('status/')[1]}`,
    );
    tweetValid.value = true;
    return true;
  } catch (error) {
    tweetValid.value = false;
    return false;
  }
};

const debouncedTweetLinkValidation = useDebounce(tweetLinkValidation, 300);

const spaceValid = ref(true);

const spaceLinkValidation = async () => {
  try {
    if (!tweetSpaceUrl.value.trim()) {
      spaceValid.value = false;
      return false;
    }
    const titterSpaceRegex =
      /^https?:\/\/(www\.)?(twitter|x)\.com\/i\/spaces?\/(?<space>[a-zA-Z0-9]{1,13})/i;
    const isValid = titterSpaceRegex.test(tweetSpaceUrl.value);

    if (!isValid) {
      spaceValid.value = false;
      return false;
    }
    spaceValid.value = true;
    const data = await axiosService.get(
      useRuntimeConfig().public.apiBase +
        `twitter/space/${tweetSpaceUrl.value.split('spaces/')[1]}`,
    );
    spaceValid.value = true;
    return true;
  } catch (error) {
    spaceValid.value = false;
    return false;
  }
};
const postValid = ref(true);
const communityValid = ref(true);
const redditPostValidation = async () => {
  const post = commentPostUrl.value || votePost.value || savePostUrl.value;
  try {
    if (!post.trim() || !post) {
      postValid.value = false;
      return false;
    }
    const redditPostUrlRegex =
      /^https:\/\/www\.reddit\.com\/(r\/[а-яА-ЯёЁA-Za-z0-9_]+\/comments\/[а-яА-ЯёЁA-Za-z0-9_]+\/[а-яА-ЯёЁA-Za-z0-9_]+\/|user\/[а-яА-ЯёЁA-Za-z0-9_\-]+\/comments\/[а-яА-ЯёЁA-Za-z0-9_]+\/[а-яА-ЯёЁA-Za-z0-9_]+\/)?(\?utm_source=share&utm_medium=web2x&context=\d+)?(\/)?$/;
    const isValid = redditPostUrlRegex.test(post);

    if (!isValid) {
      postValid.value = false;
      return false;
    }
    postValid.value = true;
    return true;
  } catch (error) {
    postValid.value = false;
    return false;
  }
};
const redditCommunityValidation = async () => {
  const post = redditCommunityUrl.value;
  try {
    if (!post.trim() || !post) {
      communityValid.value = false;
      return false;
    }
    const redditPostUrlRegex = /^https:\/\/www\.reddit\.com\/r\/[A-Za-z0-9_]+\/?$/;

    const isValid = redditPostUrlRegex.test(post);

    if (!isValid) {
      communityValid.value = false;
      return false;
    }
    communityValid.value = true;
    return true;
  } catch (error) {
    communityValid.value = false;
    return false;
  }
};

const debouncedSpaceLinkValidation = useDebounce(spaceLinkValidation, 300);
const debounceRedditPostValidation = useDebounce(redditPostValidation, 300);
const debounceRedditCommunityValidation = useDebounce(redditCommunityValidation, 300);
const setCachedTask = () => {
  const cachedRaw = images.value.map((item) => {
    const cacheRaw = JSON.stringify(item.raw);
    item.raw = cacheRaw;
    return item;
  });
  localStorage.cachedTask = JSON.stringify({
    blockchainId: blockchainId.value,
    defaultCoin: defaultCoin.value,
    selectedTalents: selectedTalents.value,
    coinAmount: coinAmount.value,
    coinId: coinId.value,
    coinSymbol: coinSymbol.value,
    idParticipants: idParticipants.value,
    selectedItems: selectedItems.value,
    selectedRewards: selectedRewards.value,
    selectedLevels: selectedLevels.value,
    twitterActions: twitterActions.value,
    images: cachedRaw,
    projectId: projectId.value,
    taskName: taskName.value,
    userName: userName.value,
    tweetUrl: tweetUrl.value,
    tweetSpaceUrl: tweetSpaceUrl.value,
    telegramUrl: telegramUrl.value,
    discordUrl: discordUrl.value,
    tweetReply: tweetReply.value,
    tweetDefault: tweetDefault.value,
    nftName: nftName.value,
    talentAmount: talentAmount.value,
    invitesAmount: invitesAmount.value,
    winnersAmount: winnersAmount.value,
    discordReward: discordReward.value,
    priority: priority.value,
    isCommunityActive: isCommunityActive.value,
    isInvitesUnlimited: isInvitesUnlimited.value,
    isLevelCoeficient: isLevelCoeficient.value,
    isAmountOfTalantUnlimited: isAmountOfTalantUnlimited.value,
    isShowCommunityId: isShowCommunityId.value,
    description: description.value,
    driver: driver.value,
    discordRole: discordRole.value,
    directionId: directionId.value,
    startDate: startDate.value,
    endDate: endDate.value,
    projectDefault: projectDefault.value,
    priorityId: priorityId.value,
    twitterActionsIds: twitterActionsIds.value,
    discordRewardId: discordRewardId.value,
    type: props.typeTask,
  });
};

const loginSocial = (network) => {
  if (!projectId.value) {
    nuxtApp.$alert.show('Please select project', {
      type: 'error',
      timeout: 5000,
    });
    return;
  }
  axios
    .get(
      useRuntimeConfig().public.apiBase +
        `projects/auth/${network.toLowerCase()}/redirect?project_id=${projectId.value}&uri=/tasks`,
      {
        headers: {
          Authorization: `Bearer ${authStore.getToken()}`,
        },
      },
    )
    .then((response) => {
      setCachedTask();
      localStorage.social = network;
      localStorage.socialType = 'projects';
      localStorage.domen = 'create-task';
      window.location.href = response.data.redirect_url;
    })
    .catch((e) => {
      console.log(e);
    })
    .finally(() => projectsStore.getProjectsSocialProvidersAction(projectId.value));
};

const validationCheck = (key, isTriggered) => {
  const field = validationErrors[key];
  const isOnChain = props.typeTask.id === ON_CHAIN_TASK;
  const tokenIdValue = onChainValues.value?.tokenId;
  const selectedConditionValue = onChainValues.value?.selectedCondition;
  const isRewardsHasCoins = selectedRewards.value.some((item) => item.name === 'Coins');
  const isRewardsHasCredits = selectedRewards.value.some((item) => item.name === 'Credits');

  switch (key) {
    case 'projects':
      if (!projectId.value) {
        if (isTriggered) {
          field.isTriggered = isTriggered;
        }
        field.isError = true;
        field.text = 'Choose the project';
      } else {
        field.isError = false;
        field.text = '';
      }
      break;
    case 'blockchains':
      if (!blockchainId.value && isCoinRewardActive.value) {
        if (isTriggered) {
          field.isTriggered = isTriggered;
        }
        field.isError = true;
        field.text = 'Choose the blockchain';
      } else {
        field.isError = false;
        field.text = '';
      }
      break;
    case 'amountOfTalents':
      if (!+talentAmount.value && !isAmountOfTalantUnlimited.value && idParticipants.value === 0) {
        if (isTriggered) {
          field.isTriggered = isTriggered;
        }
        field.isError = true;
        field.text = 'Amount of talent must be greater then 0 or checked unlimited';
      } else {
        field.isError = false;
        field.text = '';
      }
      break;

    case 'taskName':
      const trimmedTaskName = taskName.value.trim();
      const taskNameLength = trimmedTaskName.length;

      if (!trimmedTaskName) {
        if (isTriggered) {
          field.isTriggered = isTriggered;
        }
        field.isError = true;
        field.text = 'Task name is required';
      } else if (taskNameLength > 43) {
        if (isTriggered) {
          field.isTriggered = isTriggered;
        }
        field.isError = true;
        field.text = 'Task name should not exceed 43 characters';
      } else if (taskNameLength < 3) {
        if (isTriggered) {
          field.isTriggered = isTriggered;
        }
        field.isError = true;
        field.text = 'Task name should be at least 3 characters';
      } else {
        field.isError = false;
        field.text = '';
      }
      break;

    case 'contractAddress':
      if (!onChainValues.value?.isNativeToken &&
        isOnChain &&
        fieldInTheFormScope(ON_CHAIN_CONDITION_PARTS.CONTRACT_ADDRESS, selectedConditionValue)
      ) {
        const { isError, text } = validationAddress(
          onChainValues.value?.contractAddress,
          onChainValues.value?.currencyAddress,
          ON_CHAIN_CONDITION_PARTS.CONTRACT_ADDRESS,
        );
        if (isTriggered) {
          field.isTriggered = isTriggered;
        }
        field.isError = isError;
        field.text = text;
      } else {
        field.isError = false;
        field.text = '';
      }
      break;
    case 'receiverAddress':
      if (
        isOnChain &&
        fieldInTheFormScope(ON_CHAIN_CONDITION_PARTS.RECEIVER_ADDRESS, selectedConditionValue)
      ) {
        const { isError, text } = validationAddress(
          receiverAddress.value,
          senderAddress.value,
          ON_CHAIN_CONDITION_PARTS.RECEIVER_ADDRESS,
        );
        if (isTriggered) {
          field.isTriggered = isTriggered;
        }
        field.isError = isError;
        field.text = text;
      } else {
        field.isError = false;
        field.text = '';
      }
      break;

    case 'amountCondition':
      const amountConditionValue = onChainValues.value?.amountCondition;
      if (
        isOnChain &&
        fieldInTheFormScope(ON_CHAIN_CONDITION_PARTS.AMOUNT, selectedConditionValue)
      ) {
        const { isError, text } = validationAmount(amountConditionValue, isTriggered);
        if (isTriggered) {
          field.isTriggered = isTriggered;
        }
        field.isError = isError;
        field.text = text;
      } else {
        field.isError = false;
        field.text = '';
      }
      break;

    case 'currencyAddress':
      if (
        isOnChain &&
        fieldInTheFormScope(ON_CHAIN_CONDITION_PARTS.CURRENCY_ADDRESS, selectedConditionValue)
      ) {
        const { isError, text } = validationAddress(
          onChainValues.value?.currencyAddress,
          onChainValues.value?.contractAddress,
          ON_CHAIN_CONDITION_PARTS.CURRENCY_ADDRESS,
        );
        if (isTriggered) {
          field.isTriggered = isTriggered;
        }
        field.isError = isError;
        field.text = text;
      } else {
        field.isError = false;
        field.text = '';
      }

      break;
    case 'senderAddress':
      if (
        isOnChain &&
        fieldInTheFormScope(ON_CHAIN_CONDITION_PARTS.SENDER_ADDRESS, selectedConditionValue)
      ) {
        const { isError, text } = validationAddress(
          onChainValues.value?.senderAddress,
          onChainValues.value?.receiverAddress,
          ON_CHAIN_CONDITION_PARTS.SENDER_ADDRESS,
        );
        if (isTriggered) {
          field.isTriggered = isTriggered;
        }
        field.isError = isError;
        field.text = text;
      } else {
        field.isError = false;
        field.text = '';
      }

      break;
    case 'tokenId':
      if (
        isOnChain &&
        fieldInTheFormScope(ON_CHAIN_CONDITION_PARTS.TOKEN_ID, selectedConditionValue)
      ) {
        const { isError, text } = validationTokenId(tokenIdValue);
        if (isTriggered) {
          field.isTriggered = isTriggered;
        }
        field.isError = isError;
        field.text = text;
      } else {
        field.isError = false;
        field.text = '';
      }
      break;
    case 'actionButtonLink':{
      const res = validateByKey('actionButtonLink', onChainValues.value?.actionButtonLink)
      if(typeof res === 'boolean') {
        field.isError = false
        field.text = ''
      } else {
        field.isError = true
        field.text = res
      }
      break;
    }
    case 'actionButtonTitle':{
      const res = validateByKey('actionButtonTitle', onChainValues.value?.actionButtonTitle)
      if(typeof res === 'boolean') {
        field.isError = false
        field.text = ''
      } else {
        field.isError = true
        field.text = res
      }
      break;
    }
      case 'description':
      const trimmedDescription = description.value.trim();
      const descriptionLength = trimmedDescription.length;

      if (!trimmedDescription) {
        if (isTriggered) {
          field.isTriggered = isTriggered;
        }
        field.isError = true;
        field.text = 'Description is required';
      } else if (descriptionLength > 3000) {
        if (isTriggered) {
          field.isTriggered = isTriggered;
        }
        field.isError = true;
        field.text = 'Description should not exceed 3000 characters and without images';
      } else if (descriptionLength < 10) {
        if (isTriggered) {
          field.isTriggered = isTriggered;
        }
        field.isError = true;
        field.text = 'Description should be at least 10 characters';
      } else {
        field.isError = false;
        field.text = '';
      }
      break;

    case 'coins':
      if (isRewardsHasCoins) {
        const coinAmountValue = coinAmount.value;

        if (!coinAmountValue || (coinAmountValue && +coinAmountValue <= 0)) {
          if (isTriggered) {
            field.isTriggered = isTriggered;
          }
          field.isError = true;
          field.text = 'Coin Reward field is required and must be greater than 0';
        } else {
          field.isError = false;
          field.text = '';
        }
      } else {
        field.isError = false;
        field.text = '';
      }

      break;
    case 'credits':
      if (isRewardsHasCredits) {
        const creditsAmountValue = creditsAmount.value;

        if (
          !creditsAmountValue ||
          (creditsAmountValue && +creditsAmountValue <= 0) ||
          (creditsAmountValue && +creditsAmountValue > 100)
        ) {
          if (isTriggered) {
            field.isTriggered = isTriggered;
          }
          console.log('CREDITS ERROR');
          field.isError = true;
          field.text =
            'Credits Reward field is required and must be greater than 0 and not greater then 100';
        } else {
          field.isError = false;
          field.text = '';
        }
      } else {
        field.isError = false;
        field.text = '';
      }

      break;
    case 'gate':
      const conditionKeys = gateConditions.value.map((c) => c.id);
      if (!conditionKeys.length) break;
      const valRes = conditionKeys.map((conditionKey) => {
        const condition = gateConditions.value.find((c) => c.id === conditionKey);
        return Object.keys(condition.values).map((valueKey) =>{
         return revalidateGateCondition(condition.id, valueKey, condition.values[valueKey], condition.values)
        }
        );
      });
      field.isError = !valRes.flat().every(Boolean)
      break;
    default:
      break;
  }
};

//make it global
const redirectToPath = (pathTo) => {
  const { href } = router.resolve({ path: `${pathTo}`, base: route.path });
  router.push(href);
};

const send = async () => {
  console.log(isCommunityActive.value);
  console.log(driver.value);
  console.log(twitterActions.value);
  try {
    for (const key in validationErrors) {
      if (Object.hasOwnProperty.call(validationErrors, key)) {
        validationCheck(key, true);
      }
    }

    let isErrors = false;

    for (const key in validationErrors) {
      if (Object.hasOwnProperty.call(validationErrors, key)) {
        const element = validationErrors[key];
        if (element.isError) isErrors = true;
      }
    }
    if (isCommunityActive.value) {
      if (driver.value === 'twitter' && twitterActions.value.includes('twitter_follow')) {
        const isValid = await usernameValidation();
        if (!isValid) isErrors = true;
      }
      if (driver.value === 'twitter' && twitterActions.value.includes('twitter_tweet')) {
        const isValid = await tweetDefaultValidation();
        const isValidWords = await tweetWordValidation();
        if (!isValid || !isValidWords) isErrors = true;
      }
      if (driver.value === 'twitter' && twitterActions.value.includes('twitter_space')) {
        const isValid = await spaceLinkValidation();
        if (!isValid) isErrors = true;
      }
      if (driver.value === 'twitter' && !twitterActions.value.length) {
        isErrors = true;
      }
      if (driver.value === 'discord') {
        const isValid = discordValidation();
        if (!isValid) isErrors = true;
      }
      if (driver.value === 'telegram') {
        const isValid = telegramValidation();
        if (!isValid) isErrors = true;
      }
    }
    // if (isImagesError.value) {
    //   isErrors = true;
    // }

    if (
      (!invitesAmount.value &&
        !isInvitesUnlimited.value &&
        isCommunityActive.value &&
        isShowCommunityId.value === 3) ||
      (invitesAmount.value &&
        +invitesAmount.value <= 0 &&
        !isInvitesUnlimited.value &&
        isCommunityActive.value)
    ) {
      isErrors = true;
    }

    if (isErrors) {
      nuxtApp.$alert.show('Fill all required fields', {
        type: 'error',
        timeout: 5000,
      });
      return;
    }

    // setCachedTask();

    // return;

    isLoading.value = true;

    const formData = new FormData();
    console.log(driver.value, 'driver');

    formData.append('name', taskName.value);

    formData.append('text', description.value);

    for (let i of images.value) {
      formData.append('images[]', i.raw);
    }
    for (let talent of selectedTalents.value) {
      formData.append('assign_user_ids[]', talent.id);
    }

    if (selectedLevels.value.length > 0) {
      for (let level of selectedLevels.value) {
        formData.append('levels[]', level);
      }
    }

    formData.append('autovalidate', isCommunityActive.value);
    if (talentAmount.value > 0) {
      formData.append('number_of_participants', talentAmount.value);
    }

    if (driver.value && isCommunityActive.value) {
      formData.append('verifier_driver', driver.value);
      if (driver.value !== 'reddit' && twitterActions.value && twitterActions.value.length) {
        for (let type of twitterActions.value) {
          formData.append('verifier_types[]', type);
        }
      }
      if (driver.value === 'reddit' && redditActions.value && redditActions.value.length) {
        for (let type of redditActions.value) {
          formData.append('verifier_types[]', type);
        }
      }
      if (driver.value === 'twitter' && isCommunityActive.value) {
        if (twitterActions.value.includes('twitter_follow') && userName.value) {
          formData.append('twitter_follow', `@${userName.value}`);
        }
        if (tweetUrl.value) {
          formData.append('twitter_tweet', tweetUrl.value);
        }
        if (twitterActions.value.includes('twitter_space') && tweetSpaceUrl.value) {
          formData.append('twitter_space', tweetSpaceUrl.value);
        }
        if (tweetDefault.value) {
          formData.append('default_tweet', tweetDefault.value);
        }
        if (twitterActions.value.includes('twitter_reply') && tweetReply.value) {
          formData.append('default_reply', tweetReply.value);
        }
        if (tweetUrl.value) {
          formData.append('twitter_like', tweetUrl.value);
        }
        // if (twitterActions.value.includes('twitter_like') && tweetUrl.value) {
        //   formData.append('twitter_reply', tweetUrl.value);
        // }
        // if (twitterActions.value.includes('twitter_like') && tweetUrl.value) {
        //   formData.append('twitter_retweet', tweetUrl.value);
        // }
        if (words.value.length > 0 && twitterActions.value.includes('twitter_tweet')) {
          for (let word of words.value) {
            formData.append('tweet_words[]', word);
          }
        }
        // if (this.words.length > 0) {
        //   for (let word of this.words) {
        //     formData.append('tweet_words[]', word);
        //   }
        // }
      } else if (driver.value === 'telegram' && isCommunityActive.value) {
        formData.append('telegram_invite', telegramUrl.value);
      } else if (driver.value === 'discord' && isCommunityActive.value) {
        formData.append('discord_invite', discordUrl.value);
      } else if (driver.value === 'reddit' && isCommunityActive.value) {
        if (redditActions.value.includes('reddit_trophies') && selectedTrophies.value.length) {
          for (let trophy of selectedTrophies.value) {
            formData.append('reddit_trophies[]', trophy.id);
          }
        }
        if (
          redditActions.value.find(
            (e) =>
              e === 'reddit_comment_post' || e === 'reddit_save_post' || e === 'reddit_vote_post',
          ) &&
          (commentPostUrl.value || votePost.value || savePostUrl.value)
        ) {
          formData.append(
            'reddit_post',
            commentPostUrl.value || votePost.value || savePostUrl.value,
          );
        }
        if (redditActions.value.includes('reddit_karma_score') && karmaAmount.value) {
          formData.append('reddit_karma_score', karmaAmount.value);
        }
        if (redditActions.value.includes('reddit_own_post') && postDefault.value) {
          formData.append('reddit_default_post', postDefault.value);
        }
        if (redditActions.value.includes('reddit_join_community') && redditCommunityUrl.value) {
          formData.append('reddit_community', redditCommunityUrl.value);
        }
        if (redditActions.value.includes('reddit_vote_post')) {
          formData.append('reddit_upvote', upvote.value);
        }
        if (words.value.length > 0 && redditActions.value.includes('reddit_own_post')) {
          for (let word of words.value) {
            formData.append('reddit_post_words[]', word);
          }
        }
      }
    }

    if (isCommunityActive.value && !driver.value) {
      if (winnersAmount.value) {
        formData.append('number_of_winners', winnersAmount.value);
      } else if (invitesAmount.value) {
        formData.append('number_of_invites', invitesAmount.value);
      }
    }

    let rewards = selectedRewards.value.map((item) => ({
      type: item.name.split(' ').join('_').toLowerCase(),
      value:
        item.id == 1
          ? coinAmount.value
          : item.id == 4
          ? creditsAmount.value
          : discordRewardId.value,
      // value: item.id == 1 ? coinAmount.value : item.id,
    }));

    formData.append('level_coefficient', isLevelCoeficient.value);
    for (let i = 0; i < rewards.length; i++) {
      for (let key of Object.keys(rewards[i])) {
        formData.append(`rewards[${i}][${key}]`, rewards[i][key]);
      }
    }

    if (discordRole.value) {
      let conditions = [{ type: 'discord_role', value: discordRole.value, operator: '=' }];
      for (let i = 0; i < conditions.length; i++) {
        for (let key of Object.keys(conditions[i])) {
          formData.append(`conditions[${i}][${key}]`, conditions[i][key]);
        }
      }
    }

    formData.append('project_id', projectId.value);
    formData.append('activity_id', [directionId.value == 0 ? null : directionId.value]);
    if (coinId.value) {
      formData.append('coin_type_id', coinId.value);
    } else {
      formData.append('coin_type_id', coins.value[0].id);
    }
    formData.append('started_at', +dateToTimestamp(startDate.value).toFixed(0));
    formData.append('ended_at', +dateToTimestamp(endDate.value).toFixed(0));
    formData.append('priority', priority.value.toLowerCase());

    if (props.typeTask.id === ON_CHAIN_TASK) {
      appendCreateOnchainTaskCondition(formData, onChainValues)
      if (gateConditions.value.length) {
        appendCreateOnchainTaskGate(formData, gateConditions)
        formData.append('any', seletedGateConditionOption.value.id);
      }
  }

    const { data } = await axiosService.post(
      useRuntimeConfig().public.apiBase + `v2/tasks`,
      formData,
    );
    if (data.id) {
      redirectToPath(`tasks/task/${data.id}`);
      emit('close');
    }
    isLoading.value = false;

    nuxtApp.$alert.show('Task created', {
      type: 'success',
      timeout: 5000,
    });

    window.dataLayer.push({
      event: 'project_task_creation',
    });

    if (data.id) {
      redirectToPath(`tasks/task/${data.id}`);
      emit('close');
    }
  } catch (error) {
    console.log('SEND ERROR', error);
    isLoading.value = false;

    if (error.response.data.errors) {
      const parseErrors = Object.values(error.response.data.errors);
      parseErrors.forEach((errorItem) => {
        nuxtApp.$alert.show(errorItem.join('\n'), {
          type: 'error',
          timeout: 5000,
        });
      });
    } else {
      nuxtApp.$alert.show(error.response.data.message, {
        type: 'error',
        timeout: 5000,
      });
    }
  }
};
</script>

<style lang="scss" scoped>
$name-font: 'Basis Grotesque Pro';

.telegram-example {
  color: $secondary;
  font-family: Basis Grotesque Pro;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
}

.tweeter-add-word {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.tag {
  display: flex;
  align-items: center;
  border: 1px solid $default-badge-border;
  border-radius: 8px;
  cursor: pointer;
  padding: 5px 8px;
  font-family: $name-font;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  font-feature-settings: 'zero' on;
  color: $default;
}

.icon-title_wrapper {
  display: flex;
  align-items: center;
  gap: 5px;
}

.error-msg {
  display: none;
  color: $error-text;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  margin-top: 8px;
  letter-spacing: 0.014em;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
}

.d-block {
  display: block;
}

.upload-requirements {
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.014em;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  color: $default;
}

.priority-toggle-wrapper {
  width: 240px;
}

.coins-reward-wrapper {
  display: flex;
  justify-content: space-between;
}

.coins-reward {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.direction_wrapper {
  display: flex;
  flex-wrap: wrap;
}

.talent-btns-wrapper {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.line {
  width: 100%;
  height: 1px;
  background: $default-border;
}

.create-task_wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 40px;
  gap: 32px;
}

.on-chain-container-titles {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.title_wrapper {
  display: flex;
  justify-content: space-between;

  .title {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 32px;
    line-height: 40px;
    font-feature-settings: 'zero' on;
    color: $section-title;
  }
}

.check-btn_wrapper {
  display: flex;
  align-items: center;
  gap: 8px;

  .check-btn_title {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    display: flex;
    align-items: center;
    font-feature-settings: 'zero' on;
    color: $default;
  }

  .type-label {
    background-color: #eaeafb;
    border-radius: 6px;
    padding: 3px 8px;

    & > span {
      font-family: 'Basis Grotesque Pro';
      font-size: 12px;
      font-style: normal;
      font-weight: 500;
      line-height: 133.333%;
      cursor: default;
      color: #6a6d8f;
    }
  }
}

.section_item {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.blockchain-items {
  width: 50%;
}

.section_wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .condition-setting {
    background-color: #eaeafb;
    padding: 16px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 16px;

    &-title {
      color: #6a6d8f;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 24px;
    }

    &-item {
      &-title {
        margin-bottom: 8px;
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: 142.857%;
        color: #1a1d29;
      }

      .blockchain-select {
        position: relative;
        width: 50%;

        &-icon {
          position: absolute;
          height: 100%;
          left: 0;
          width: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 20;
          border-right: 1px solid #dad9f7;
          border-radius: 8px 0 0 8px;
          background-color: #dad9f7;
          top: 0;

          & > svg {
            display: inline-block;
          }
        }
      }
    }
  }

  &.last {
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 48px;
  }

  &-title {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $section-title;
  }

  &-subtitle {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.014em;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $secondary;
    margin-top: -8px;
  }
}
.custom-condition-select {
    position: relative;
    width: fit-content;
    height: 32px;
    text-align: left;
    outline: none;
    z-index: 1000;
}

.custom-condition-select .selected {
    background: $default-border;
    border: 1px solid $default-border;
    border-radius: 8px;
    cursor: pointer;
    user-select: none;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 1.7;
    padding: 4px 8px;
    width: 60px;
    height: 32px;
    color: #38405b;
}

.custom-condition-select .selected.open {
    background:#38405B;
    border: 1px solid #38405B;
    cursor: pointer;
    user-select: none;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 1.7;
    color: $white;
    box-shadow: 0 0 0 3px $default-border;
}

.custom-condition-select .selected:after {
    position: absolute;
    content: '';
    top: 12px;
    right: 1em;
    width: 12px;
    height: 7px;
    border: none;
}

.custom-condition-select {

    .arrow {
        position: absolute;
        content: '';
        top: 12px;
        right: .5rem;
        width: 12px;
        height: 7px;
        border: none;
        transition: transform 0.2s;

        background: url('@/assets/images/select.svg');
        background-repeat: no-repeat;
    }

    .arrow.flipped {
        transform: rotate(360deg);
        background: url('@/assets/images/select-white.svg');
        background-repeat: no-repeat;
        background-size: 12px 7px;
    }
}

.custom-condition-select .items {
    background: $white;
    cursor: pointer;
    user-select: none;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    border-radius: 8px;
    margin-top: 10px;
    padding: 4px 8px;
    line-height: 20px;
    color: $default;
    max-height: 250px;
    overflow: auto;
    border: 1px solid $default-badge-border;
    position: absolute;
    left: 0;
    right: 0;
    z-index: 11;
    width: 80px;

    &.selectHide {
        display: none;
    }

    >div {
        padding: 5px 8px;
        display: flex;
        justify-content: space-between;
        &:hover {
            background: $default-badge-border;
            border-radius: 8px;
        }
    }
}
</style>
../OnChain/utils.оы
