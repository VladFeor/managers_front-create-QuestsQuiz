<template>
  <div class="task_wrapper">
    <BtnSkeleton v-if="taskLoading || !taskLoaded || !task" />
    <div v-else class="task-header-btns">
      <BackBtn :text="task.project.name" :img="task.project.logo" to="/tasks" />
      <div v-if="isEditingActive" class="check-btn_wrapper">
        <div class="check-btn_title">Auto Check</div>
        <Switch
          @checked="setIsCommunityActive"
          :checkedProp="isCommunityActive"
          :isDisabled="isUpdateTaskLoading"
        />
      </div>
    </div>
    <BtnSkeleton v-if="taskLoading || !taskLoaded || !task" />
    <InputName
      v-else-if="isEditingActive"
      v-model="taskName"
      :placeholder="task.name"
      @input="debouncedSetTaskName"
    >
    </InputName>
    <div v-else class="task-name">{{ task.name }}</div>
    <div class="task-body">
      <TableSkeleton v-if="taskLoading || !taskLoaded || !task" />
      <div v-else class="task-data">
        <div class="main-task-data">
          <div class="task-info_wrapper">
            <div class="task-info">
              <DirectionsSelect
                :options="directionsTags"
                v-if="isEditingActive"
                @input="handleSelectedDirections"
                :default="defaultDirection"
                isSmall
                :directionClass="getBadgeTypeByName(task.activity ? task.activity.name : 'All')"
              />
              <Badge
                v-else
                :text="task.activity ? task.activity.name : 'All'"
                :type="getBadgeTypeByName(task.activity ? task.activity.name : 'All')"
                :big="false"
              />
              <PrioritySelect
                :options="priorityOptions"
                v-if="isEditingActive"
                @input="handleSelectedPriority"
                :default="defaultPriority"
                isSmall
              />
              <div v-else class="task-priority">
                Priority
                <Priority :dots="task.priority" />
              </div>

              <div v-if="isEditingActive" class="task-date">
                <CustomDatePicker
                  :defaultDate="transformDate(timestampToString(task.started_at))"
                  :minDate="new Date()"
                  :maxDate="transformDate(addDaysToDate(timestampToString(task.safe_ended_at), -1))"
                  @selectedDate="setStartDate"
                  isSmall
                />
                <!-- <CustomDatePicker
                  :defaultDate="transformDate(timestampToString(task.started_at))"
                  :minDate="timestampToString(task.started_at)"
                  :maxDate="transformDate(timestampToString(task.safe_ended_at))"
                  @selectedDate="setStartDate"
                  isSmall
                /> -->
                <span>-</span>
                <CustomDatePicker
                  :defaultDate="transformDate(timestampToString(task.safe_ended_at))"
                  :minDate="transformDate(addDaysToDate(timestampToString(task.started_at), 1))"
                  @selectedDate="setEndDate"
                  isSmall
                />
              </div>
              <div v-else class="task-date">
                <Badge
                  :text="formatDate(timestampToString(task.started_at))"
                  type="transparent"
                  :big="false"
                />
                -
                <Badge
                  :text="formatDate(timestampToString(task.ended_at))"
                  type="transparent"
                  :big="false"
                />
              </div>
            </div>
            <div class="task-status">
              <Badge
                :text="getTaskStatus(task.status_by_dates)"
                isStatusIcon
                type="transparent"
                :big="false"
              />
              <!-- <Status :status="task.status_by_dates"></Status> -->
            </div>
          </div>
          <div v-if="isCommunityActive && isEditingActive" class="auto-tasks">
            <div v-if="isCommunityActive" class="section_wrapper">
              <div class="w-1/2 mb-7">
                <FilterToggle
                  :buttons="communityOptions"
                  :id="isShowCommunityId"
                  @select="setIsShowCommunity($event)"
                  bgLight
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
              <div class="section_wrapper-title-h2 telegram">
                Join Telegram to Complete the Task
              </div>
              <div class="section_wrapper-subtitle">
                1. Add bot {{ useRuntimeConfig().public.telegramBot }} to the channel admins and
                give it the rights to manage posts.
              </div>
              <div class="section_wrapper-subtitle">
                2. Enter the short address or channel ID if the the channel is private in the field
                below.
              </div>
              <Input
                v-model="telegramUrl"
                @input="telegramValidation"
                name=""
                placeholder="https://telegram.com/"
                :isError="!isTelegramValid ? true : false"
                errorText="Telegram is required"
              />
              <span class="telegram-example"
                >Example: durov, https://t.me/durov or -10011426151</span
              >
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
              <div class="section_wrapper-title-h2">Join Discord to Complete the Task</div>
              <Input
                v-model="discordUrl"
                name=""
                @input="discordValidation"
                :isError="!isDiscordValid ? true : false"
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
              <div
                v-if="
                  task.verifier_driver &&
                  task.verifier_driver === 'twitter' &&
                  task.verifier.twitter_follow
                "
                class="section_wrapper-title-h2"
              >
                Twitter Activities to Complete the Task
              </div>

              <div
                v-if="
                  task.verifier_driver &&
                  task.verifier_driver === 'twitter' &&
                  task.verifier.twitter_follow
                "
                class="edit-twitter-card mb-5"
              >
                <TwitterCard
                  small
                  :task="task"
                  :status="task.status_by_dates"
                  btnsDisabled
                  isFollow
                />
                <TwitterCard :task="task" :status="task.status_by_dates" btnsDisabled isPost />
                <TwitterCard
                  v-if="
                    task.verifier_driver &&
                    task.verifier_driver === 'twitter' &&
                    task.verifier.types.some((item) => item === 'twitter_space')
                  "
                  :task="task"
                  :status="task.status_by_dates"
                  isSpace
                />
              </div>

              <FilterToggle
                :buttons="twitterActionsButtons"
                :id="0"
                @select="setTwitterActions($event)"
                isDivided
                type="checkbox"
                :selectedActionsIds="twitterActionsIds"
                bgLight
              />
              <span :class="{ 'opacity-visible': !twitterActions.length }" class="error-msg">
                Minimun one action must be selected
              </span>
            </div>
            <div class="flex gap-y-3 flex-col mt-3">
              <div
                v-if="
                  isCommunityActive &&
                  isShowCommunityId === 2 &&
                  isTwitterConnected &&
                  twitterActionsIds.includes('0')
                "
                class="section_wrapper"
              >
                <div class="section_wrapper-title">Twitter Handle to Follow</div>
                <Input
                  :isError="!usernameValid ? true : false"
                  v-model="userName"
                  name=""
                  placeholder="username"
                  @input="debouncedUsernameValidation"
                  symbol="@"
                  type="small"
                />
                <span :class="{ 'opacity-visible': !usernameValid }" class="error-msg">
                  Username of Twitter account is invalid.
                </span>
              </div>
              <div
                v-if="
                  (isCommunityActive &&
                    isShowCommunityId === 2 &&
                    isTwitterConnected &&
                    twitterActionsIds.includes('1')) ||
                  (isCommunityActive &&
                    isShowCommunityId === 2 &&
                    isTwitterConnected &&
                    twitterActionsIds.includes('2')) ||
                  (isCommunityActive &&
                    isShowCommunityId === 2 &&
                    isTwitterConnected &&
                    twitterActionsIds.includes('3'))
                "
                class="section_wrapper"
              >
                <div class="section_wrapper-title">Tweet URL</div>
                <Input
                  v-model="tweetUrl"
                  name=""
                  placeholder="https://twitter.com/"
                  @input="debouncedTweetLinkValidation"
                  type="small"
                />
                <span :class="{ 'opacity-visible': !tweetValid }" class="error-msg">
                  Tweet link is invalid.
                </span>
              </div>
              <div
                v-if="
                  isCommunityActive &&
                  isShowCommunityId === 2 &&
                  isTwitterConnected &&
                  twitterActionsIds.includes('2')
                "
                class="section_wrapper mb-7"
              >
                <div class="section_wrapper-title">Default Reply</div>
                <div class="section_wrapper-subtitle">
                  Enter the default reply that we will prefill for the users.
                </div>
                <TextArea v-model="tweetReply" name="" placeholder="Enter the default reply" />
              </div>
              <div
                v-if="
                  isCommunityActive &&
                  isShowCommunityId === 2 &&
                  isTwitterConnected &&
                  twitterActionsIds.includes('4')
                "
                class="section_wrapper mb-7"
              >
                <div class="section_wrapper-title">Words to include</div>
                <div class="section_wrapper-subtitle">
                  Words they must include in their tweet. Start with @ for mention , # for hashtag,
                  or put a URL to another tweet for quote tweet
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
              </div>
              <div
                v-if="
                  isCommunityActive &&
                  isShowCommunityId === 2 &&
                  isTwitterConnected &&
                  twitterActionsIds.includes('4')
                "
                class="section_wrapper mb-7"
              >
                <div class="section_wrapper-title">Default Tweet</div>
                <div class="section_wrapper-subtitle">
                  Enter the example tweet that we will prefill for the users; it must contain the
                  words to include chosen above
                </div>
                <TextArea v-model="tweetDefault" name="" placeholder="Enter the default tweet" />
              </div>
              <div
                v-if="
                  isCommunityActive &&
                  isShowCommunityId === 2 &&
                  isTwitterConnected &&
                  twitterActionsIds.includes('5')
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
                  type="small"
                />
                <span :class="{ 'opacity-visible': !spaceValid }" class="error-msg">
                  Tweet Space URL is invalid.
                </span>
              </div>
              <BaseButton
                v-if="isCommunityActive && isShowCommunityId === 2 && isTwitterConnected"
                class="mt-5"
                text="Save"
                type="secondary"
                :disabled="isTwitterSaveDisabled"
                @click="editTwitter"
              />
            </div>
            <div
              v-if="isCommunityActive && isShowCommunityId === 3"
              class="section_wrapper invite mb-5"
            >
              <div class="social-driver_title">
                Invite Friends to Join the Project to Complete the Task
              </div>
              <TaskInvitesCard
                :description="task.project.description"
                :protocol="task.project.name"
                :tags="task.project.tags"
                :bg="task.project.banner"
                :logo="task.project.logo"
                :task="task"
                status="available"
              />
            </div>
            <div v-if="isCommunityActive && isShowCommunityId === 3" class="section_wrapper">
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
                tooltipText="All talents who meet the requirements will be able to take on the task"
              />
            </div>
            <div
              v-if="isCommunityActive && isShowCommunityId === 3 && isInvitesUnlimited"
              class="section_wrapper mt-5"
            >
              <div class="section_wrapper-title">Number of Winners</div>
              <div class="section_wrapper-subtitle">
                Specify the number of talents will be the winners.
              </div>
              <NumberInput v-model="winnersAmount" name="" placeholder="" type="number" />
              <span
                :class="{ 'd-block': !winnersAmount || (winnersAmount && +winnersAmount <= 0) }"
                class="opacity-visible error-msg"
              >
                Number of Winners is requred and must be greater than 0
              </span>
            </div>
            <BaseButton
              v-if="isCommunityActive && isShowCommunityId === 3"
              class="mt-5"
              text="Save"
              type="secondary"
              :disabled="isInvitesSaveDisabled"
              @click="editInvites"
            />
          </div>

          <div
            v-if="task.verifier_driver && task.verifier_driver === 'twitter' && !isEditingActive"
            class="social-driver_title"
          >
            Twitter Activities to Complete the Task
          </div>
          <div
            v-if="task.verifier_driver && task.verifier_driver === 'twitter' && !isEditingActive"
            class="edit-twitter-card mb-5"
          >
            <TwitterCard
              v-if="task.verifier_driver && task.verifier_driver === 'twitter' && !isEditingActive"
              small
              :task="task"
              :status="task.status_by_dates"
              isFollow
            />
            <TwitterCard
              v-if="task.verifier_driver && task.verifier_driver === 'twitter' && !isEditingActive"
              :task="task"
              :status="task.status_by_dates"
              isShowBtns
              btnsDisabled
              isPost
            />
            <TwitterCard
              v-if="
                task.verifier_driver &&
                task.verifier_driver === 'twitter' &&
                task.verifier.types.some((item) => item === 'twitter_tweet')
              "
              :task="task"
              :status="task.status_by_dates"
              isTweetLink
            />
            <TwitterCard
              v-if="
                task.verifier_driver &&
                task.verifier_driver === 'twitter' &&
                task.verifier.types.some((item) => item === 'twitter_space')
              "
              :task="task"
              :status="task.status_by_dates"
              isSpace
            />
          </div>
          <div
            v-if="task.verifier_driver && task.verifier_driver === 'discord' && !isEditingActive"
            class="social-driver_title"
          >
            Join Discord to Complete the Task
          </div>
          <DiscordCard
            v-if="task.verifier_driver && task.verifier_driver === 'discord' && !isEditingActive"
            :task="task"
            isDisabled
          />
          <div v-if="task.is_invite_friends && !isEditingActive" class="social-driver_title">
            Invite {{ task.number_of_invites }} Talents to the Project to Complete the Task.
          </div>
          <TaskInvitesCard
            v-if="task.is_invite_friends && !isEditingActive"
            :description="task.project.description"
            :protocol="task.project.name"
            :tags="task.project.tags"
            :bg="task.project.banner"
            :logo="task.project.logo"
            :task="task"
            :status="task.status_by_dates"
          />

          <div
            class="reddit-wrapper"
            v-if="isCommunityActive && isShowCommunityId === 4 && task.verifier"
          >
            <div class="social-driver_title mb-5">Reddit Activities to Complete the Task</div>
            <RedditPostCard
              v-if="
                redditActions.includes('reddit_comment_post') ||
                redditActions.includes('reddit_save_post') ||
                redditActions.includes('reddit_vote_post')
              "
              class="mb-5"
              :is-comment="redditActions.includes('reddit_vote_post')"
              :is-save="redditActions.includes('reddit_save_post')"
              :is-vote="redditActions.includes('reddit_vote_post')"
              :data="{ url: task.verifier.reddit_post, id: task.verifier.reddit_post_id }"
            ></RedditPostCard>
            <RedditCommunityCard
              v-if="
                redditActions.includes('reddit_join_community') ||
                redditActions.includes('reddit_own_post')
              "
              class="mb-5"
              :is-community="redditActions.includes('reddit_join_community')"
              :is-own-post="redditActions.includes('reddit_own_post')"
              :words="task.verifier.reddit_post_words"
              :post="task.verifier.reddit_default_post"
              :data="{ url: task.verifier.reddit_post, id: task.verifier.reddit_community_id }"
            ></RedditCommunityCard>
            <RedditKarmaCard
              class="mb-5"
              :karma="task.verifier.reddit_karma_score"
              v-if="redditActions.includes('reddit_karma')"
            ></RedditKarmaCard>
            <RedditTrophiesCard
              class="mb-5"
              :trophies="task.verifier.reddit_trophies"
              v-if="redditActions.includes('reddit_trophies')"
            ></RedditTrophiesCard>
          </div>
          <div
            v-if="isCommunityActive && isShowCommunityId === 4 && isEditingActive"
            class="flex gap-y-3 flex-col"
          >
            <FilterToggle
              :buttons="redditActionsButtons"
              :id="0"
              @select="setRedditActions($event)"
              isDivided
              type="checkbox"
              :selectedActionsIds="redditActionsIds"
              bgLight
              class="mb-5"
            />
            <div class="section_wrapper" v-if="redditActions.includes('reddit_join_community')">
              <div class="section_wrapper-title">Community URL</div>
              <Input
                :isError="!communityValid"
                v-model="redditCommunityUrl"
                @input="debounceRedditCommunityValidation"
                name=""
                placeholder="https://reddit.com/r"
              />
              <span :class="{ 'opacity-visible': !communityValid }" class="error-msg">
                Community URL is invalid.
              </span>
            </div>
            <div
              class="section_wrapper mb-7"
              v-if="
                redditActions.includes('reddit_save_post') ||
                redditActions.includes('reddit_comment_post') ||
                redditActions.includes('reddit_vote_post')
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
              <span v-if="!savePostUrl" class="error-msg"> Reddit post link is invalid. </span>
              <CheckboxLabel
                v-if="redditActions.includes('reddit_vote_post')"
                class="mt-2"
                text="Upvote"
                @checked="setUpvote"
                :checkedProp="upvote"
              />
            </div>
            <div class="section_wrapper mb-7" v-if="redditActions.includes('reddit_own_post')">
              <div class="section_wrapper-title">Words to include</div>
              <div class="section_wrapper-subtitle">
                Words to Include Words that talents should include in their post. Start with @ for a
                mention, # for a hashtag, or enter another post’s URL for a quote post.
              </div>
              <div v-if="redditWords.length" class="selected-tags mt-3">
                <span v-for="(word, index) in redditWords" :key="word + index" class="tag">
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
                <Input class="w-full" v-model="redditWord" withoutName placeholder="Add word" />
                <BaseButton text="Add" type="twitter" :disabled="!redditWord" @click="addWords" />
              </div>
            </div>
            <div class="section_wrapper mb-7" v-if="redditActions.includes('reddit_own_post')">
              <div class="section_wrapper-title">Default Post</div>
              <div class="section_wrapper-subtitle">
                Enter the example tweet that we will prefill for the users; it must contain the
                words to include chosen above
              </div>
              <TextArea v-model="postDefault" name="" placeholder="Enter the default post" />
            </div>
            <div class="section_wrapper mb-7" v-if="redditActions.includes('reddit_karma_score')">
              <div class="section_wrapper-title">Karma Score</div>
              <NumberInput v-model="karmaAmount" name="" placeholder="" type="number" />
            </div>
            <div class="section_wrapper mb-7" v-if="redditActions.includes('reddit_trophies')">
              <MultiSelectActive
                :options="trophies"
                @selected-items="setTrophie"
                :selectedRewards="selectedTrophies"
                placeholder="Select trophies"
                name="Trophies"
                isTooltip
                tooltipText="Choose the trophies: one or multiple at once"
              />
            </div>

            <BaseButton
              class="mt-5"
              text="Save"
              type="secondary"
              :disabled="isRedditSaveDisabled"
              @click="editReddit"
            />
          </div>
          <div v-if="isCommunityActive" class="section_wrapper">
            <div class="line"></div>
          </div>
          <Editor
            v-if="isEditingActive"
            :description="addLinksToText(description, false)"
            @update="debouncedsetDescription"
            isEdit
          />
          <div v-else class="task-content_wrapper">
            <div class="task-content" v-if="!hasHtml(task.text)">
              {{ task.text }}
            </div>
            <div
              v-else
              class="task-content html"
              :class="{ list: isTaskHasList(task.text), long: isTaskHasLongWord(task.text) }"
              v-html="addLinksToText(task.text)"
            ></div>
          </div>
        </div>
        <FileListViewer
          v-if="task.images.length && !isEditingActive"
          @zoomInImage="zoomInImage"
          :files="task.images"
        />
        <div v-else-if="isEditingActive" class="task-images">
          <CustomUpload
            :imagesFiles="images"
            @images="handleImagesEditing"
            @remove="handleRemoveImagesEditing"
          />
        </div>
        <TaskCondition 
          v-if="taskChainCondition" 
          :condition="taskChainCondition" 
          :isEditingActive = "isEditingActive"
          @toggleEditOnChainTaskModal="toggleEditOnChainTaskModal" 
        />
      </div>
      <CalendarSkeleton v-if="taskLoading || !taskLoaded || !task" />
      <div v-else class="task-sidebar">
        <div v-if="rewardsArray.length" class="task-sidebar-card">
          <div class="task-sidebar-card_header">
            <div class="task-sidebar-card_title">Rewards</div>

            <BlockchainSelectSmall
              :options="blockChainOptions"
              v-if="
                (isEditingActive && isShowCoinsEdit) ||
                (isEditingActive && rewardsArray.some((item) => item.type === 'coin'))
              "
              @input="handleSelectedBlockchain"
              :default="defaultBlockchainId"
              isSmall
              :isEdit="isShowCoinsEdit"
              @editAction="handleBlockchainEditActive"
            />
            <!-- <BlockchainSelectSmall
              :options="blockChainOptions"
              v-if="isEditingActive && rewardsArray.some((item) => item.type === 'coin')"
              @input="handleSelectedBlockchain"
              :default="defaultBlockchainId"
              isSmall
              :isEdit="isBlockchainEditActive"
              @editAction="handleBlockchainEditActive"
            /> -->
          </div>
          <div class="coins-reward" v-if="isShowCoinsEdit">
            <CoinRewardSelect
              @amountChange="debouncedSetCoinsReward($event)"
              :amount="coinsAmount"
              @input="setCoinId"
              :coinId="coinId"
              :options="coins"
              :isError="+coinsAmount <= 0"
              errorText="Coins amount must be greater then 0"
              isFull
              :default="defaultCoin"
              isOnTop
            />
            <div class="flex justify-between items-center">
              <CheckboxLabel
                @checked="debouncedSetIsLevelCoeficient"
                :checkedProp="isLevelCoeficient"
                text="Level Coefficient"
                tooltipText="Higher levels will receive rewards with level-based coefficients"
              />
              <EstimatedAmountTooltip
                :amount="estimatedAmount"
                :currency="coinSymbol || coins[0].symbol"
              />
            </div>
            <div v-if="isShowCoinsEdit" @click="handleBlockchainEdit" class="save-blockchain-btn">
              Save
            </div>
            <!-- <div
              v-if="isBlockchainEditActive"
              @click="handleBlockchainEdit"
              class="save-blockchain-btn"
            >
              Save
            </div> -->
          </div>

          <div
            v-if="rewardsArray.some((item) => item.type === 'coin')"
            class="reward-item_wrapper"
            :class="{
              margin:
                rewardsArray.some((item) => item.type === 'credits') ||
                rewardsArray.some((item) => item.type === 'discord'),
            }"
          >
            <div
              v-if="!isShowCoinsEdit"
              class="task-sidebar-card_reward"
              :class="{ editHover: isCoinsRewardHovered && isEditingActive }"
              @click="handleIsCoinsEdit"
              @mouseover="isCoinsRewardHovered = true"
              @mouseout="isCoinsRewardHovered = false"
            >
              <div class="task-sidebar-card_reward-amount">
                {{ getRewardByType('coin').rewardString }}
              </div>
              <img
                v-if="isCoinsRewardHovered && isEditingActive && rewardsArray.length > 1"
                class="reward-icon-img"
                @click.stop="
                  isEditingActive && rewardsArray.length > 1 ? (isShowRemoveCoins = true) : null
                "
                :src="deleteIcon"
                alt=""
              />
              <Coin
                v-else
                class="reward-icon"
                @click.stop="
                  isEditingActive && rewardsArray.length > 1 ? (isShowRemoveCoins = true) : null
                "
                :name="task.coin_type.symbol + '-Default'"
                :size="isDiscordRewardHovered && isEditingActive ? 22 : 35"
              />
            </div>
            <div v-if="isShowRemoveCoins" class="tooltip-confirmation-rewards">
              <div class="tooltip-arrow"></div>
              <span class="msg"
                >Confirm the removal <br />
                of this reward</span
              >
              <div class="contol-block mt-2">
                <div class="cancel" @click="isShowRemoveCoins = false">Cancel</div>
                <div class="confirm" @click="removeReward('coins', task)">Confirm</div>
              </div>
            </div>
          </div>

          <div
            v-if="rewardsArray.some((item) => item.type === 'credits')"
            class="reward-item_wrapper"
            :class="{ margin: rewardsArray.some((item) => item.type === 'discord') }"
          >
            <div v-if="isShowCreditsEdit">
              <CreditsRewardInput
                @amountChange="debouncedSetCreditsReward($event)"
                :amount="creditsAmount"
                :isError="+creditsAmount < 0 || +creditsAmount > 100"
                errorText="Credits Reward field is required and must be greater than 0 and not greater then 100"
                isFull
              />
            </div>

            <div
              v-if="!isShowCreditsEdit"
              class="task-sidebar-card_reward"
              :class="{ editHover: isCreditsRewardHovered && isEditingActive }"
              @click="handleIsCreditsEdit"
              @mouseover="isCreditsRewardHovered = true"
              @mouseout="isCreditsRewardHovered = false"
            >
              <div class="task-sidebar-card_reward-amount">
                {{ getRewardByType('credits').rewardString }}
              </div>
              <img
                v-if="isCreditsRewardHovered && isEditingActive && rewardsArray.length > 1"
                class="reward-icon-img"
                @click.stop="
                  isEditingActive && rewardsArray.length > 1 ? (isShowRemoveCredits = true) : null
                "
                :src="deleteIcon"
                alt=""
              />
              <img
                v-else
                class="reward-icon-img"
                @click.stop="
                  isEditingActive && rewardsArray.length > 1 ? (isShowRemoveCredits = true) : null
                "
                :src="creditsIcon"
                alt=""
              />
            </div>
            <div v-if="isShowRemoveCredits" class="tooltip-confirmation-rewards">
              <div class="tooltip-arrow"></div>
              <span class="msg"
                >Confirm the removal <br />
                of this reward</span
              >
              <div class="contol-block mt-2">
                <div class="cancel" @click="isShowRemoveCredits = false">Cancel</div>
                <div class="confirm" @click="removeReward('credits', task)">Confirm</div>
              </div>
            </div>
          </div>

          <div
            v-if="rewardsArray.some((item) => item.type === 'discord') && isDiscordConnected"
            class="reward-item_wrapper low"
          >
            <div v-if="isShowDiscordEdit && isDiscordConnected">
              <TasksSelect
                :options="discordRoles"
                @input="debouncedSetDiscordReward($event)"
                :reduceLength="15"
                isBig
                isFull
              />
            </div>
            <!-- <div v-else-if="isShowDiscordEdit && !isDiscordConnected">
              <ConnectSocialBtn name="Discord" @click="loginSocial('discord_bot')" />
            </div> -->
            <div
              v-else
              class="task-sidebar-card_reward"
              :class="{ editHover: isDiscordRewardHovered && isEditingActive }"
              @click="handleIsDiscordEdit"
              @mouseover="isDiscordRewardHovered = true"
              @mouseout="isDiscordRewardHovered = false"
            >
              <div class="task-sidebar-card_reward-amount">
                {{ reduceStringLength(getRewardByType('discord').rewardString, 14) }}
              </div>
              <img
                v-if="isDiscordRewardHovered && isEditingActive && rewardsArray.length > 1"
                class="reward-icon-img"
                @click.stop="
                  isEditingActive && rewardsArray.length > 1 ? (isShowRemoveReward = true) : null
                "
                :src="deleteIcon"
                alt=""
              />
              <Icon
                v-else
                class="reward-icon"
                @click.stop="
                  isEditingActive && rewardsArray.length > 1 ? (isShowRemoveReward = true) : null
                "
                :name="getRewardByType('discord').icon"
                :size="isDiscordRewardHovered && isEditingActive ? 22 : 35"
              />
              <!-- <Icon
                class="reward-icon"
                @click.stop="isEditingActive ? (isShowRemoveReward = true) : null"
                :name="
                  isDiscordRewardHovered && isEditingActive
                    ? 'Delete'
                    : getRewardByType('discord').icon
                "
                :size="isDiscordRewardHovered && isEditingActive ? 22 : 35"
              /> -->
            </div>
            <div v-if="isShowRemoveReward" class="tooltip-confirmation-rewards">
              <div class="tooltip-arrow"></div>
              <span class="msg"
                >Confirm the removal <br />
                of this reward</span
              >
              <div class="contol-block mt-2">
                <div class="cancel" @click="setIsShowReward">Cancel</div>
                <div class="confirm" @click="removeReward('discord', task)">Confirm</div>
              </div>
            </div>
          </div>

          <div v-else-if="isShowDiscordEdit && !isDiscordConnected">
            <ConnectSocialBtn name="Discord" @click="loginSocial('discord_bot')" />
          </div>

          <div v-else></div>
          <!--
          <AddRewardsSelect
            v-if="
              rewardsArray.every((item) => item.type !== 'coin') ||
              rewardsArray.every((item) => item.type !== 'discord')
            "
            class="mt-5"
            :options="rewards"
            @selected-item="handleSelectedRewards"
            :selectedItems="selectedRewards"
          /> -->

          <AddRewardsSelect
            v-if="
              (isEditingActive && selectedRewards.every((item) => item.name !== 'Coins')) ||
              (isEditingActive && selectedRewards.every((item) => item.name !== 'Discord Role')) ||
              (isEditingActive && selectedRewards.every((item) => item.name !== 'Credits'))
            "
            class="mt-5"
            :options="rewards"
            @selected-item="handleSelectedRewards"
            :selectedItems="rewardsArray"
          />
        </div>

        <!-- ====== -->

        <div v-if="isEditingActive" class="task-sidebar-card participants">
          <div class="task-sidebar-card_title participants">Participants</div>

          <div class="filter-title_wrapper">
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
              isSmall
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
          </div>

          <div v-if="idParticipants === 0" class="section_wrapper">
            <div class="section_wrapper-title">Levels</div>
            <div class="section_wrapper-subtitle">
              You can select multiple levels. If you don’t select level, the task will be available
              to all.
            </div>

            <div class="direction_wrapper">
              <LevelsToggle
                :buttons="levels"
                :selectedLevels="selectedLevels"
                @select="debouncedsetIsShowLevels($event)"
              />
            </div>
          </div>
          <div v-if="idParticipants === 0 && isDiscordConnected" class="section_wrapper">
            <div class="icon-title_wrapper">
              <div class="section_wrapper-title">Discord Role</div>
              <TooltipIcon
                tooltipText="Select a Discord role from your server to filter users who can see this task based on its presence"
              />
            </div>

            <TasksSelect
              :options="discordRoles"
              @input="debouncedSetDiscordRole($event)"
              :isDisabled="isDiscordRoleActive"
              :reduceLength="12"
              isBig
              :default="discordRoleDefault"
              isScroll
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
                isScroll
              />
            </div>
          </div>
        </div>
        <div v-else class="task-sidebar-card participants">
          <div class="task-sidebar-card_title participants">Participants</div>
          <div class="flex gap-4 items-center flex-wrap">
            <badge
              v-if="task.number_of_participants"
              :text="`Number of participants: ${task.number_of_participants} `"
            ></badge>
            <badge
              v-if="task.number_of_participants === 0"
              :text="`Unlimited number of participants`"
            ></badge>
            <badge
              v-if="task.number_of_invites"
              :text="`Number of invites: ${task.number_of_invites} `"
            ></badge>
            <badge
              v-if="task.number_of_winners"
              :text="`Number of winners: ${task.number_of_winners} `"
            ></badge>
            <badge
              v-if="discordRoleDefault"
              icon="Discord-Default"
              :text="discordRoleDefault.name"
            ></badge>
            <badge
              v-if="task.levels.length > 1"
              :text="`${formatLevels(task.levels)} levels`"
            ></badge>

            <badge v-if="task.levels.length === 1" :text="`${task.levels[0]}  level`"></badge>
          </div>
        </div>

        <div class="working-talents-card" v-if="task.status_by_dates !== 'upcoming'">
          <div class="working-talents-card_main-card-content">
            <div class="working-talents-card_title">{{ statusLabel }} Talents</div>
            <div v-if="workingTalents.length" class="working-talents-card_users">
              <div v-for="user in workingTalents" :key="user.id" class="working-talents-card_user">
                <nuxt-link :to="`/talent/${user.id}`">
                  <Talent :text="user.name" :img="user.avatar.original_url" :status="user.status" />
                </nuxt-link>
              </div>
            </div>
          </div>
          <div
            @click="visible = true"
            class="working-talents-card_btn"
          >
            View all {{ workingTalents.length ? workingTalents.length : 0 }} talents
          </div>
        </div>
        <div 
          v-if="task?.type_task ==='on-chain'" 
          :class="{ gatesIsOpen: open && !visible }"
          class="task-sidebar-card gate"
        >
          <div class="task-sidebar-card_title gate">
            <div class="flex gap-1">
              <span @click="toggle" v-if="!visible" :class="{ gatesIsOpen: open }" class="arrow toggle-gate"></span>
              Gates
              <TooltipIcon
                tooltipText="Gate is rules you set that determine who can access your project. To pass a gate, the talent must meet the conditions you specify below."
              />
            </div>
            <div v-if="taskGateConditions.length" class="custom-condition-select" :tabindex="tabindex" ref="selectContainer">
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
          <div class='w-full task-gate' v-if="taskGateConditions.length">
            <GateCondition
              v-for="condition in taskGateConditions"
              :condition="condition"
              :onUpdate="handleUpdateGateCondition"
              :onDelete="onDeleteGateCondition"
              class="gate-condition-wr"
              :readonly="!isEditingActive"
            />
          </div>
          <div v-else class="w-full empty-gate">
            <ProjectGateEmpty />
          </div>

          <button v-if="isEditingActive && haveAvailableGateOptions" class="btn task-gate-btn" @click="toggleAddGateConditionModal">
            Add Condition
            <img src="@/assets/icons/create-dark.svg" />
          </button>
        </div>

        <BaseButton
          v-if="
            task.status_by_dates !== 'available' &&
            task.status_by_dates !== 'finished' &&
            task.status_by_dates !== 'upcoming'
          "
          class="w-full"
          text="Approve"
          type="normal"
        />
      </div>
    </div>
  </div>
  <ZoomImage v-if="isOpenZoom" @close="closeZoomModal" :image="activeImage" />

  <BaseModal
    :width="taskChainCondition ? 600 : 900"
    maxHeight="608px"
    @close="handleClose($event)"
    :visible="visible"
  >
    <WorkingTalentsModal :taskId="taskId" :isOnChain="taskChainCondition" :statusByDates="task.status_by_dates" />
  </BaseModal>
  <BaseModal
    :width="400"
    :top="150"
    maxHeight="648px"
    @close="handleCloseProjectsModal($event)"
    :visible="isEditProjectVisible"
    isScrollOff
  >
    <EditProjectModal @update="handleProjectUpdate($event)" :projectId="projectId" />
  </BaseModal>
  <ScrollContainerBaseModal
    class="add-contition-modal"
    padding="32px"
    title="Adding a Condition"
    :width="480"
    customHeight="auto"
    @close="toggleAddGateConditionModal"
    :visible="addGateConditionModalOpened"
    :bottom="20"
  >
    <AddGateCondition
      :isLoading="isLoading"
      @close="toggleAddGateConditionModal"
      :onSave="onAddGateCondition"
      :availableOptions="availableGateOptions"
    />
  </ScrollContainerBaseModal>
  <ScrollContainerBaseModal
    class="edit-condition-modal"
    padding="32px 16px 32px 32px"
    title="Editing a Condition"
    :top="80"
    :bottom="10"
    :width="584"
    customHeight="auto"
    @close="toggleEditOnChainTaskModal"
    :visible="editOnChainTaskModalOpened"
  >
  <div v-if="isEditingActive && task.chain_conditions[0]" class="task-sidebar-card on-chain">
          <TaskOnChain
          :values="onChainValues" @update-on-chain-value="(key, value) => changeOnChainValue(key, value)"
            :handleIsOnChainEdit="handleIsOnChainEdit"
            :validationErrors="validationErrors"
            :edit="false"
            :isDividerVisible="true"
          />
          <div class="flex edit-condition-modal_buttons">
              <base-button class="button" type="secondary" text="Cancel" @click="toggleEditOnChainTaskModal">Cancel</base-button>

              <base-button class="button" type="normal" text="Save" @click="sendOnChain" :loading="isLoading" />
          </div>
        </div>
</ScrollContainerBaseModal>
  <InaccessibleLinkModal
    v-if="showErrorModal"
    title="Task Unavailable"
    text="The task you are trying to access is no longer available. It may have been completed or deleted. Please contact your project manager or administrator for further assistance."
    link="/tasks"
    button="Go to the List of Tasks"
  ></InaccessibleLinkModal>
</template>

<script setup>
import InputName from '~/components/Inputs/InputName.vue';
import {
  addDaysToDate,
  addLinksToText,
  dateToTimestamp,
  formatDate,
  getBadgeTypeByName,
  getTaskStatus,
  isTaskHasList,
  isTaskHasLongWord,
  reduceStringLength,
  timestampToString,
  transformDate,
} from '@/util/helpers';
import { useRoute, useRouter } from 'vue-router';
import { inject, onMounted, onUnmounted, ref } from 'vue';
import { useTasksStore } from '~/store/tasks';
import { useDiscordStore } from '~/store/discord';
import { useActivitiesStore } from '~/store/activities';
import { useDebounce } from '@/hooks/useDebounce';
import axios from 'axios';
import { useAuthStore } from '~/store/auth';
import { useProjectsStore } from '~/store/projects';
import { useAmbassadorsStore } from '~/store/ambassadors';
import axiosService from '@/service/axiosService';
import { useCoinsStore } from '~/store/coins';
import { useBlockchainsStore } from '~/store/blockchains';
import deleteIcon from '@/assets/icons/tasks/delete-icon.svg';
import creditsIcon from '@/assets/icons/Credits.svg';
import RedditCommunityCard from '~/components/Cards/RedditCommunityCard.vue';
import EstimatedAmountTooltip from '~/components/TasksComponents/EstimatedAmountTooltip.vue';

import optimism from '@/assets/images/optimism.svg';
import arbitrum from '@/assets/images/arbitrum.svg';
import avalanche from '@/assets/images/avalanche.svg';
import bnbSmart from '@/assets/images/bnbSmart.svg';
import ethereum from '@/assets/images/ethereum.svg';
import polygon from '@/assets/images/polygon.svg';
import fantom from '@/assets/images/fantom.svg';
import celo from '@/assets/images/celo.svg';
import cronos from '@/assets/images/cronos.svg';
import { useTaskGateStore } from '~/store/taskGates';
import { GATE_CONDITIONS } from '~/components/Gate/utils';
import {
  conditions,
  ON_CHAIN_CONDITION_PARTS,
  ON_CHAIN_CONDITION_PARTS_MAP,
  fieldInTheFormScope,
  ON_CHAIN_TASK,
} from '~/components/OnChain/utils';
import { blockchains } from '~/util/onchain';
import {
  validationAddress,
  validationTokenId,
  validationAmount,
} from '~/components/OnChain/validation';

const roles = inject('roles');
const showErrorModal = ref(false);
const {
  isProjectOwner,
  isSuperAdmin,
  isProjectAdministrator,
  isAdminSupport,
  isProjectManager,
  isCatapultManager,
} = roles;

const blockchainsStore = useBlockchainsStore();
const authStore = useAuthStore();
const nuxtApp = useNuxtApp();
const route = useRoute();
const router = useRouter();
const tasksStore = useTasksStore();
const discordStore = useDiscordStore();
const activityStore = useActivitiesStore();
const projectsStore = useProjectsStore();
const ambassadorsStore = useAmbassadorsStore();
const coinsStore = useCoinsStore();
const taskGateStore = useTaskGateStore();

const blockChainOptions = computed(() => {
  return [...blockchainsStore.getBlockchains];
  // return [{ id: 0, name: 'All Blockchains' }, ...blockchainsStore.getBlockchains];
});

const taskLoading = computed(() => tasksStore.getTaskLoading);
const taskLoaded = computed(() => tasksStore.getTaskLoaded);
const coinsList = computed(() => coinsStore.getCoins);

const coins = computed(
  () => {
    // console.log('coinsStore.getCoins', coinsStore.getCoins);
    const originalArray = coinsList.value;
    if (originalArray && originalArray.length) {
      return originalArray.map((item) => ({
        name: item.name,
        id: item.id,
        symbol: item.code || item.symbol,
        amount: Math.floor(Math.random()),
      }));
    }
  },
  { deep: true, instant: true, dependsOn: [coinsList] },
);
function formatLevels(arr) {
  let result = '';
  let currentRange = [arr[0]];

  for (let i = 1; i < arr.length; i++) {
    const currentNumber = arr[i];
    const previousNumber = arr[i - 1];

    if (currentNumber - previousNumber === 1) {
      currentRange.push(currentNumber);
    } else {
      result += formatRange(currentRange) + ', ';
      currentRange = [currentNumber];
    }
  }

  result += formatRange(currentRange);

  return result;
}

function formatRange(range) {
  if (range.length > 2) {
    return `${range[0]}-${range[range.length - 1]}`;
  } else {
    return range.join(', ');
  }
}
const task = computed(() => tasksStore.getTask);
const taskGateConditions = computed(() => tasksStore.getGate);
const taskChainCondition = computed(() => task?.value?.chain_conditions?.find(el => el.type === 'main'));
const statusLabel = computed(() => {
  return task?.value?.status_by_dates === 'available' ? 'Working' : 'Worked'
});


const directions = computed(() => activityStore.getActivities);

const talents = computed(() => {
  const originalArray = ambassadorsStore.getAmbassadors;
  return originalArray.map((item) => ({
    name: item.name,
    id: item.id,
    avatar: item.avatar ? item.avatar : '',
  }));
});

const discordRoles = computed(() => {
  const originalArray = discordStore.getDiscordRoles;
  if (originalArray && originalArray.length) {
    originalArray.unshift({ name: 'Any roles', id: 0, position: '0' });
    return originalArray;
  } else return [{ name: 'Any roles', id: 0 }];
});

const isEditingActive = computed(() => {
  const tasks = tasksStore.getTask;
  if (tasks.editing_not_available || isProjectManager.value) return false;
  else return true;
});

const handleIsOnChainEdit = () => {
  isShowOnChainBtns.value = true;
};

const directionsTags = computed(() => {
  const original = directions.value;
  if (original && original?.length) {
    let obj = original.map((i) => {
      return {
        title: i.name,
        id: i.id,
        name: i.name,
        type: getBadgeTypeByName(i.name),
      };
    });
    const allTags = [
      {
        title: 'All Directions',
        id: null,
        name: 'All Directions',
        type: 'transparent',
      },
    ].concat(obj);
    return allTags;
  }
});
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
const taskId = computed(() => tasksStore.getTask.id);

const socialProviders = computed(() => projectsStore.getSocialProviders);
const isTelegramConnected = computed(() => {
  if (projectsStore.getSocialProviders.some((item) => item.provider_name === 'telegram_bot'))
    return true;
  else return false;
});
const isDiscordConnected = computed(() => {
  if (projectsStore.getSocialProviders.some((item) => item.provider_name === 'discord_bot'))
    return true;
  else return false;
});
const isTwitterConnected = computed(() => {
  if (projectsStore.getSocialProviders.some((item) => item.provider_name === 'twitter'))
    return true;
  else return false;
});

// GATE -->
const hasAvailableOptions = (conditions) => !Object.values(GATE_CONDITIONS).map(key => conditions.some(c => c.type === key)).every(Boolean)
const getAvailableOptions = () => Object.values(GATE_CONDITIONS).filter(type => !taskGateConditions.value.some(c => c.type === type))

const haveAvailableGateOptions = computed(() => hasAvailableOptions(taskGateConditions.value))
const availableGateOptions = computed(() => getAvailableOptions());

const addGateConditionModalOpened = ref(false);
const toggleAddGateConditionModal = () => {
  addGateConditionModalOpened.value = !addGateConditionModalOpened.value;
};

const editOnChainTaskModalOpened = ref(false);
const toggleEditOnChainTaskModal = () => {
  editOnChainTaskModalOpened.value = !editOnChainTaskModalOpened.value;
};

const gateConditionOptions = computed(() => [
    { name: 'Any Conditions', id: 1 },
    { name: 'All Conditions', id: 0 },
])

const seletedGateConditionOption = ref(
  gateConditionOptions.value.find((condition) => condition.id == task.any) || gateConditionOptions.value[0],  
)
const gateConditionSelectOpened = ref(false)

const toggleConditionTypeSelect = () => {
    gateConditionSelectOpened.value = !gateConditionSelectOpened.value
}

const onConditionTypeSelect = (option) => {
    seletedGateConditionOption.value = option;
    toggleConditionTypeSelect();
    changeTaskGateType(task.value.id, option.id);
}

const changeTaskGateType = async (taskId, type) => {
  return await axiosService
    .post(useRuntimeConfig().public.apiBaseV2 + 'tasks/' + taskId + '/any', {
      _method: 'patch',
      any: type,
    })
    .then((res) => {
      this.getGateAction(taskId);
      return res.data;
    });
};

const onAddGateCondition = async (condition) => {
  return taskGateStore.addConditionAction(task.value.id, condition).then((res) => {
    if (res) {
      toggleAddGateConditionModal();
      tasksStore.getTaskAction(route.params.id);
      nuxtApp.$alert.show('Gate condition added', {
        type: 'success',
        timeout: 5000,
      });
    } else {
      nuxtApp.$alert.show(`Task was already taken in work. You can't edit it`, {
        type: 'error',
        timeout: 5000,
      });
    }
  });
};

const onDeleteGateCondition = (condition) => {
  taskGateStore.removeConditionAction(task.value.id, condition).then((res) => {
    if (res) {
      tasksStore.getTaskAction(route.params.id);
      nuxtApp.$alert.show('Gate condition removed', {
        type: 'success',
        timeout: 5000,
      });
    }
  });
};
// <-- GATE

const getImgSrc = () => {
  return selectedBlockchain?.value?.icon === 'optimism'
    ? optimism
    : selectedBlockchain?.value?.icon === 'arbitrum'
    ? arbitrum
    : selectedBlockchain?.value?.icon === 'avalanche'
    ? avalanche
    : selectedBlockchain?.value?.icon === 'bnbSmart'
    ? bnbSmart
    : selectedBlockchain?.value?.icon === 'ethereum'
    ? ethereum
    : selectedBlockchain?.value?.icon === 'polygon'
    ? polygon
    : selectedBlockchain?.value?.icon === 'fantom'
    ? fantom
    : selectedBlockchain?.value?.icon === 'celo'
    ? celo
    : selectedBlockchain?.value?.icon === 'cronos'
    ? cronos
    : null;
};
// Onchain condition -->
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

// <--Onchain condition 
const rewardsArray = ref([]);
const taskName = ref('');
const description = ref('');
const isCommunityActive = ref(false);
const directionId = ref(task.activity ? task.activity.id : 0);
const defaultDirection = ref(null);
const defaultPriority = ref(null);
const defaultBlockchainId = ref(0);
const isShowCommunityId = ref(3);
const driver = ref('');
const twitterActionsIds = ref(['0']);
const twitterActions = ref([]);
const defaultTwitterActions = ref([]);
const defaultRedditActions = ref([]);
const projectId = ref(null);
const userName = ref('');
const tweetUrl = ref('');
const discordUrl = ref('');
const telegramUrl = ref('');
const tweetReply = ref('');
const tweetDefault = ref('');
const tweetSpaceUrl = ref('');
const invitesAmount = ref(0);
const winnersAmount = ref(0);
const isInvitesUnlimited = ref(false);
const isEditProjectVisible = ref(false);
const idParticipants = ref(0);
const talentAmount = ref('');
const isAmountOfTalantUnlimited = ref(false);
const selectedTalents = ref([]);
const discordReward = ref('');
const discordRewardId = ref(0);
const discordRole = ref(null);
const selectedLevels = ref(['0']);
const discordRoleDefault = ref(null);
const discordRewardDefault = ref(null);
const activeImage = ref(null);
const isOpenZoom = ref(false);
const isCoinsRewardHovered = ref(false);
const isCreditsRewardHovered = ref(false);
const isDiscordRewardHovered = ref(false);
const isShowRemoveCoins = ref(false);
const isShowRemoveCredits = ref(false);
const isShowRemoveReward = ref(false);
const isShowCoinsEdit = ref(false);
const isShowDiscordEdit = ref(false);
const isShowCreditsEdit = ref(false);
const isLevelCoeficient = ref(false);
const isShowOnChainBtns = ref(false);
const coinId = ref(null);
const coinSymbol = ref('');
const coinsAmount = ref(0);
const creditsAmount = ref(0);
const images = ref([]);
const selectedRewards = ref([]);
const workingTalents = ref([]);
const isUpdateTaskLoading = ref(false);
const isBlockchainEditActive = ref(false);
const blockchainId = ref(null);
const tweetWord = ref('');
const redditWord = ref('');
const words = ref([]);
const redditWords = ref([]);
const defaultWords = ref([]);
const defaultRedditWords = ref([]);
const defaultCoin = ref(null);
const isSetDefaultCoin = ref(false);
const open = ref(true);
//REDDIT
const redditCommunityUrl = ref(null);
const postDefault = ref(null);
const savePostUrl = ref(null);
const votePost = ref(null);
const upvote = ref(false);
const commentPostUrl = ref(null);
const karmaAmount = ref(1);
const trophiesAmount = ref([]);
const redditActions = ref([]);
const redditActionsIds = ref([0]);
const communityValid = ref(true);
const selectedTrophies = ref([]);
const defTrophies = ref([]);

//END

const setTrophie = (data) => {
  selectedTrophies.value = data;
};
const isInvitesSaveDisabled = computed(
  () => {
    if (!+invitesAmount.value && !+winnersAmount.value) return true;
    if (+invitesAmount.value === +task.value.number_of_invites && !isInvitesUnlimited.value)
      return true;
    if (+winnersAmount.value === +task.value.number_of_winners && isInvitesUnlimited.value)
      return true;
    else return false;
  },
  {
    deep: true,
    instant: true,
    dependsOn: [invitesAmount, winnersAmount, task, isInvitesUnlimited],
  },
);

const isTwitterSaveDisabled = computed(
  () => {
    if (twitterActions.value && !twitterActions.value.length) {
      return true;
    }
    const tweeterObj = [
      {
        baseValue:
          task.value.verifier && task.value.verifier.twitter_follow
            ? task.value.verifier.twitter_follow
            : '',
        currentValue: userName.value,
        compare: ['twitter_follow'],
      },
      {
        baseValue:
          task.value.verifier && task.value.verifier.twitter_tweet
            ? task.value.verifier.twitter_tweet
            : '',
        currentValue: tweetUrl.value,
        compare: ['twitter_like', 'twitter_reply'],
      },
      {
        baseValue:
          task.value.verifier && task.value.verifier.default_tweet
            ? task.value.verifier.default_tweet
            : '',
        currentValue: tweetDefault.value,
        compare: ['twitter_tweet'],
      },
      {
        baseValue:
          task.value.verifier && task.value.verifier.default_reply
            ? task.value.verifier.default_reply
            : '',
        currentValue: tweetReply.value,
        compare: ['twitter_like', 'twitter_reply'],
      },
      {
        baseValue:
          task.value.verifier && task.value.verifier.twitter_space
            ? task.value.verifier.twitter_space
            : '',
        currentValue: tweetSpaceUrl.value,
        compare: ['twitter_space'],
      },
      {
        baseValue: true,
        currentValue: arraysAreEqual(task.value.verifier?.tweet_words || [], words.value),
        compare: ['twitter_tweet'],
      },
    ];
    console.log(task.value); //CHECK

    if (!arraysAreEqual(twitterActions.value, defaultTwitterActions.value)) {
      return false;
    }
    return !hasDifferences(tweeterObj);
  },
  {
    deep: true,
    instant: true,
    dependsOn: [defaultWords, words, defaultTwitterActions, twitterActions, tweetDefault],
  },
);

const isRedditSaveDisabled = computed(
  () => {
    if (redditActions.value && !redditActions.value.length) {
      return true;
    }
    const redditObj = [
      {
        baseValue:
          task.value.verifier && task.value.verifier.reddit_community
            ? task.value.verifier.reddit_community
            : '',
        currentValue: redditCommunityUrl.value || '',
        compare: ['reddit_join_community'],
      },
      {
        baseValue:
          task.value.verifier && task.value.verifier.reddit_default_post
            ? task.value.verifier.reddit_default_post
            : '',
        currentValue: postDefault.value || '',
        compare: ['reddit_own_post'],
      },
      {
        baseValue:
          task.value.verifier && task.value.verifier.reddit_post
            ? task.value.verifier.reddit_post
            : '',
        currentValue: savePostUrl.value || '',
        compare: ['reddit_save_post'],
      },
      {
        baseValue:
          task.value.verifier && task.value.verifier.reddit_post
            ? task.value.verifier.reddit_post
            : '',
        currentValue: votePost.value || '',
        compare: ['reddit_vote_post'],
      },
      {
        baseValue:
          task.value.verifier && task.value.verifier.reddit_upvote
            ? task.value.verifier.reddit_upvote
            : false,
        currentValue: upvote.value,
        compare: ['reddit_upvote'],
      },
      {
        baseValue:
          task.value.verifier && task.value.verifier.reddit_post
            ? task.value.verifier.reddit_post
            : '',
        currentValue: commentPostUrl.value || '',
        compare: ['reddit_comment_post'],
      },
      {
        baseValue:
          task.value.verifier && task.value.verifier.reddit_karma_score
            ? task.value.verifier.reddit_karma_score
            : 1,
        currentValue: karmaAmount.value,
        compare: ['reddit_karma_score'],
      },
      {
        baseValue: true,
        currentValue: arraysAreEqual(
          defTrophies.value.map((e) => e.id) || [],
          selectedTrophies.value.map((e) => e.id),
        ),
        compare: ['reddit_trophies'],
      },
      {
        baseValue: true,
        currentValue: arraysAreEqual(defaultRedditWords.value || [], redditWords.value),
        compare: ['reddit_post_words'],
      },
    ];

    console.log(defTrophies.value, selectedTrophies.value);
    if (!postValid.value || !communityValid.value) {
      return true;
    }

    console.log(redditObj); //CHECK
    if (!arraysAreEqual(redditActions.value, defaultRedditActions.value)) {
      return false;
    }
    console.log(!hasDifferences(redditObj));
    return !hasDifferences(redditObj);
  },
  {
    deep: true,
    instant: true,
    dependsOn: [
      redditCommunityUrl,
      redditWords,
      postDefault,
      redditActions,
      defaultRedditWords,
      defTrophies,
      votePost,
      upvote,
      karmaAmount,
      selectedTrophies,
      savePostUrl,
      commentPostUrl,
    ],
  },
);

function arraysAreEqual(arr1, arr2) {
  if (arr1 && arr2) {
    if (arr1.length !== arr2.length) {
      return false;
    }
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }
    return true;
  } else {
    return true;
  }
}
function hasDifferences(objects) {
  return objects.some((obj) => obj.baseValue !== obj.currentValue);
}

const priorityOptions = [
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
    title: `Invites`,
    id: 3,
    name: 'Invites',
  },
  {
    title: `Reddit`,
    id: 4,
    name: 'Reddit',
  },
];

const levels = Array.from({ length: 6 }, (_, id) => ({ title: `${id}`, id }));

onMounted(() => {
  if (route.params.id) {
    tasksStore.getTaskAction(route.params.id).catch((e) => (showErrorModal.value = true));
    tasksStore.getTrophiesAction();
  }
  projectsStore.getProjectsAction();
  activityStore.getActivitiesAction();
  getTalents();
  if (defaultBlockchainId.value && defaultBlockchainId.value.id) {
    coinsStore.getCoinsAction(defaultBlockchainId.value.id);
  }
  blockchainsStore.getBlockchainsAction();

  if (task.value && task.value.name && !taskName.value) {
    taskName.value = task.value.name;
  }

  if (task.value) {
    description.value = task.value.text;
    // taskName.value = task.value.name;
    images.value = task.value.images;
  }
});

const getTalents = async (status) => {
  const params = {};

  if (status) {
    params.status = status;
  }

  const { data } = await axiosService.get(
    useRuntimeConfig().public.apiBase + `tasks/${route.params.id}/talents-working`,
    params,
  );
  workingTalents.value = data.data;
};

const handleIsCoinsEdit = () => {
  if (!isEditingActive.value) return;
  isShowCoinsEdit.value = true;
};

const handleIsCreditsEdit = () => {
  if (!isEditingActive.value) return;
  isShowCreditsEdit.value = true;
};

const handleIsDiscordEdit = () => {
  if (!isEditingActive.value) return;
  isShowDiscordEdit.value = true;
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
      // setCachedTask();
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

const handleBlockchainEditActive = () => {
  isBlockchainEditActive.value = true;
  isShowCoinsEdit.value = true;
};

const handleBlockchainEdit = async () => {
  try {
    const params = {
      coins: coinsAmount.value,
      coin_type_id: coinId.value,
      blockchain_id: blockchainId.value,
      level_coefficient: isLevelCoeficient.value,
    };

    if (task.value.rewards.some((item) => item.type === 'credits')) {
      params.credits = creditsAmount.value;
    }
    const updatedTaskData = await tasksStore.editBlockchainsAction(params, route.params.id);
    getTaskRewards(updatedTaskData, discordRoles.value);
    isShowCreditsEdit.value = false;
    nuxtApp.$alert.show('Updated', {
      type: 'success',
      timeout: 5000,
    });

    window.dataLayer.push({
      event: 'project_task_update',
    });

    isBlockchainEditActive.value = false;
    isShowCoinsEdit.value = false;
  } catch (error) {
    nuxtApp.$alert.show(error, {
      type: 'error',
      timeout: 5000,
    });
  }
};

const addWords = () => {
  if (tweetWord.value && isShowCommunityId.value === 2) {
    words.value.push(tweetWord.value);
    tweetWord.value = '';
  }
  if (redditWord.value && isShowCommunityId.value === 4) {
    redditWords.value.push(redditWord.value);
    redditWord.value = '';
  }
};

const validationErrors = reactive({
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
});

const sendOnChain = async () => {
  const formData = new FormData();

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
  if (!isErrors) {
    formData.append('name', onChainValues.value?.selectedCondition);

    const getValuesOnChain = {
      [ON_CHAIN_CONDITION_PARTS.CONTRACT_ADDRESS]: onChainValues.value?.contractAddress,
      [ON_CHAIN_CONDITION_PARTS.BLOCKCHAIN]: onChainValues.value?.selectedBlockchain?.value,
      [ON_CHAIN_CONDITION_PARTS.SENDER_ADDRESS]: onChainValues.value?.senderAddress,
      [ON_CHAIN_CONDITION_PARTS.RECEIVER_ADDRESS]: onChainValues.value?.receiverAddress,
      [ON_CHAIN_CONDITION_PARTS.AMOUNT]: onChainValues.value?.amountCondition,
      [ON_CHAIN_CONDITION_PARTS.CURRENCY_ADDRESS]: onChainValues.value?.currencyAddress,
      [ON_CHAIN_CONDITION_PARTS.TOKEN_ID]: onChainValues.value?.tokenId,
      [ON_CHAIN_CONDITION_PARTS.TOKEN_NAME]: onChainValues.value?.conditionTokenName,
      [ON_CHAIN_CONDITION_PARTS.IS_NATIVE_TOKEN]: onChainValues.value?.isNativeToken,
      [ON_CHAIN_CONDITION_PARTS.LINK_TO_COMPLETION]:{
        actionButtonLink: onChainValues.value?.actionButtonLink,
        actionButtonTitle: onChainValues.value?.actionButtonTitle,
      },
      [ON_CHAIN_CONDITION_PARTS.NFT_PREVIEW]: {
          imgUrl: onChainValues.value?.nftPreview,
          nftName: onChainValues.value?.nftName,
        }
    };

    let conditionIndex = 0;
    ON_CHAIN_CONDITION_PARTS_MAP[onChainValues.value?.selectedCondition.value].forEach((key) => {
      const value = getValuesOnChain[key]
      if (value) {
        if(typeof value !== 'object') {
          formData.append(`fields[${conditionIndex}][name]`, key);
          formData.append(`fields[${conditionIndex}][value]`, value);
        } else {
          Object.keys(value).forEach((k)=> {
              if(value[k]) {
                formData.append(`fields[${conditionIndex}][name]`, k.toString());
                formData.append(`fields[${conditionIndex}][value]`, value[k].toString()); 
                conditionIndex++;
              }
            })
        }
        conditionIndex++;
      }
    });

    formData.append('name', onChainValues.value?.selectedCondition?.value);
    formData.append('type', 'main');
    formData.append('type_task', 'on-chain');

    formData.append('_method', 'patch');

    const data = await axiosService.post(
      useRuntimeConfig().public.apiBase + `v2/tasks/${task?.value?.id}/conditions/${task?.value?.chain_conditions[0].id}`,
      formData,
    )
    .then(
      () => {
        tasksStore.getTaskAction(route.params.id).catch((e) => (showErrorModal.value = true));
        toggleEditOnChainTaskModal();
      })
    .catch((error) => {
      nuxtApp.$alert.show(`Task was already taken in work. You can't edit it`, {
        type: 'error',
        timeout: 5000,
      });
    });

    if (data?.status === 200) {
      nuxtApp.$alert.show(`Task updated`, {
        type: 'success',
        timeout: 5000,
      });
    }

    isShowOnChainBtns.value = false;
  }
};

const validationCheck = (key, isTriggered) => {
  const field = validationErrors[key];
  const tokenIdValue = onChainValues.value?.tokenId;
  const selectedConditionValue = onChainValues.value?.selectedCondition;

  switch (key) {
    case 'contractAddress':
    if (!onChainValues.value?.isNativeToken && fieldInTheFormScope(ON_CHAIN_CONDITION_PARTS.CONTRACT_ADDRESS, selectedConditionValue)) {
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
      if (fieldInTheFormScope(ON_CHAIN_CONDITION_PARTS.RECEIVER_ADDRESS, selectedConditionValue)) {
        const { isError, text } = validationAddress(
          onChainValues.value?.receiverAddress,
          onChainValues.value?.senderAddress,
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
      if (fieldInTheFormScope(ON_CHAIN_CONDITION_PARTS.AMOUNT, selectedConditionValue)) {
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
      if (fieldInTheFormScope(ON_CHAIN_CONDITION_PARTS.CURRENCY_ADDRESS, selectedConditionValue)) {
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
      if (fieldInTheFormScope(ON_CHAIN_CONDITION_PARTS.SENDER_ADDRESS, selectedConditionValue)) {
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
      if (fieldInTheFormScope(ON_CHAIN_CONDITION_PARTS.TOKEN_ID, selectedConditionValue)) {
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
      default:
      break;
  }
};

const removeWord = (id) => {
  isShowCommunityId.value === 4 ? redditWords.value.splice(id, 1) : words.value.splice(id, 1);
};
const setUpvote = (value) => {
  upvote.value = value;
};
const handleSelectedRewards = (event) => {
  if (event.id === 1) {
    isShowCoinsEdit.value = true;
  }
  if (event.id === 2) {
    rewardsArray.value.push({
      rewardString: 'Discord reward',
      icon: 'Discord-Circle',
      type: 'discord',
    });
    isShowDiscordEdit.value = true;
  }
  if (event.id === 4) {
    rewardsArray.value.push({
      rewardString: 'Credits',
      icon: creditsIcon,
      type: 'credits',
    });
    isShowCreditsEdit.value = true;
    if (creditsAmount.value > 0) {
      setCreditsReward(creditsAmount.value);
    }
  }
  selectedRewards.value.push(event);
};

const setCoinId = (event) => {
  coinId.value = event.id;
  coinSymbol.value = event.symbol;
  return;

  if (isBlockchainEditActive.value) return;

  const discordReward = task.value.rewards.find((item) => item.type === 'discord_role');
  const coinsReward = task.value.rewards.find((item) => item.type === 'coins');
  let rewards = [];
  if (discordReward) {
    rewards.push({
      type: 'discord_role'.split(' ').join('_').toLowerCase(),
      value: discordReward.value,
    });
  }
  if (coinsReward) {
    rewards.push({
      type: coinsReward.type.split(' ').join('_').toLowerCase(),
      value: coinsReward.value,
    });
  }

  const formData = new FormData();

  for (let i = 0; i < rewards.length; i++) {
    for (let key of Object.keys(rewards[i])) {
      formData.append(`rewards[${i}][${key}]`, rewards[i][key]);
    }
  }

  formData.append('level_coefficient', isLevelCoeficient.value);

  formData.append('coin_type_id', event.id);

  formData.append('_method', 'patch');

  updateTask({
    data: formData,
    isAxios: true,
    func: () => {
      isShowCoinsEdit.value = false;
    },
  });
};

const setIsShowReward = () => {
  isShowRemoveReward.value = false;
};

function getCuttencyIcon(currency) {
  switch (currency) {
    case 'eth':
      return 'Ethereum-Circle';
    case 'bnb':
      return 'BNB-Circle';
    case 'btc':
      return 'Bitcoin-SV-Circle';
    case 'cplt':
      return 'USDT-Circle';
    case 'discord':
      return 'Discord-Circle';
    default:
      return 'USDD-Default';
  }
}

const getRewardByType = (type) => {
  return rewardsArray.value.find((item) => item.type === type);
};

const closeZoomModal = () => {
  isOpenZoom.value = false;
  document.body.classList.remove('hide-scroll');
};

const zoomInImage = (image) => {
  activeImage.value = image;
  isOpenZoom.value = true;
  document.body.classList.add('hide-scroll');
};

const setDiscordRoleReward = (data) => {
  discordReward.value = data.name;
  discordRewardId.value = data.id;
};

const setIsAmountOfTalantUnlimited = (value) => {
  if (value && isAmountOfTalantUnlimited.value !== value) {
    talentAmount.value = '';
    updateTalentsAmount('0');
  } else {
    // updateTalentsAmount('0');
  }
  isAmountOfTalantUnlimited.value = value;
};

const setIsShowParticipants = async (event) => {
  if (event.id === 1) {
    talentAmount.value = '';
    isAmountOfTalantUnlimited.value = false;
    selectedLevels.value = ['0'];
    setDiscordRole({ name: 'Any roles', id: 0, position: '0' });
    setIsShowLevels({ checkedButtons: [] });
    ambassadorsStore.getAmbassadorsAction({ levels: null, activity_id: null });
  }
  if (event.id === 0) {
    selectedTalents.value = [];
    updateSelectedTalents([]);
  }
  idParticipants.value = event.id;
};

const setIsInvitesUnlimited = (value) => {
  isInvitesUnlimited.value = value;
};

const setTwitterActions = (items) => {
  twitterActions.value = items.names;
  twitterActionsIds.value = items.checkedButtons;
};

const setRedditActions = (items) => {
  redditActions.value = items.names;
  redditActionsIds.value = items.checkedButtons;
};

const setIsShowLevels = (items) => {
  selectedLevels.value = items.checkedButtons;
  const formData = new FormData();
  if (selectedLevels.value && selectedLevels.value.length) {
    for (const level of selectedLevels.value) {
      formData.append('levels[]', level);
    }
  } else {
    formData.append('levels', null);
    // formData.append('levels[]', []);
  }

  formData.append('_method', 'patch');
  updateTask({ data: formData, isAxios: true });

  if (directionId.value) {
    ambassadorsStore.getAmbassadorsAction({
      levels: items.checkedButtons,
      activity_id: directionId.value,
    });
  } else {
    ambassadorsStore.getAmbassadorsAction({ levels: items.checkedButtons });
  }
};

const debouncedsetIsShowLevels = useDebounce(setIsShowLevels, 1000);
watch(
  isShowCommunityId,
  (value) => {
    switch (value) {
      case 0:
        driver.value = 'telegram';
        twitterActions.value = ['telegram_invite'];
        defaultTwitterActions.value = ['telegram_invite'];
        break;
      case 1:
        driver.value = 'discord';
        twitterActions.value = ['discord_invite'];
        defaultTwitterActions.value = ['discord_invite'];
        break;
      case 2:
        driver.value = 'twitter';
        if (
          task.value.verifier &&
          task.value.verifier.types.filter((e) => {
            return e.indexOf('twitter') !== -1;
          }).length
        ) {
          const taskTwitterActionsIds = twitterActionsButtons
            .filter((item) =>
              task.value.verifier.types.some(
                (type) => type.toLowerCase() === item.name.toLowerCase(),
              ),
            )
            .map((item) => String(item.id));
          twitterActions.value = task.value.verifier.types;
          defaultTwitterActions.value = task.value.verifier.types;
          twitterActionsIds.value = taskTwitterActionsIds;
        } else {
          twitterActions.value = ['twitter_follow'];
          defaultTwitterActions.value = ['twitter_follow'];
          twitterActionsIds.value = ['0'];
        }

        break;
      case 4:
        driver.value = 'reddit';
        if (
          task.value.verifier &&
          task.value.verifier.types.filter((e) => {
            return e.indexOf('reddit') !== -1;
          }).length
        ) {
          const taskRedditActionsIds = redditActionsButtons
            .filter((item) =>
              task.value.verifier.types.some(
                (type) => type.toLowerCase() === item.name.toLowerCase(),
              ),
            )
            .map((item) => String(item.id));
          redditActions.value = task.value.verifier.types;
          defaultRedditActions.value = task.value.verifier.types;
          twitterActionsIds.value = taskRedditActionsIds;
        } else {
          redditActions.value = ['reddit_join_community'];
          defaultRedditActions.value = ['reddit_join_community'];
          redditActionsIds.value = ['0'];
        }
        break;
      default:
        driver.value = '';
        twitterActions.value = [];
        defaultTwitterActions.value = [];
        break;
    }
  },
  { deep: true, instant: true },
);

const setIsShowCommunity = (event) => {
  isShowCommunityId.value = event.id;
  switch (event.id) {
    case 0:
      driver.value = 'telegram';
      twitterActions.value = ['telegram_invite'];
      defaultTwitterActions.value = ['telegram_invite'];
      break;
    case 1:
      driver.value = 'discord';
      twitterActions.value = ['discord_invite'];
      defaultTwitterActions.value = ['discord_invite'];
      break;
    case 2:
      driver.value = 'twitter';
      if (task.value.verifier && task.value.verifier.types.includes('twitter')) {
        twitterActions.value = task.value.verifier.types;
        defaultTwitterActions.value = task.value.verifier.types;
      } else {
        twitterActions.value = ['twitter_follow'];
        defaultTwitterActions.value = ['twitter_follow'];
      }

      break;
    case 4:
      driver.value = 'reddit';
      if (task.value.verifier && task.value.verifier.types.includes('reddit')) {
        redditActions.value = task.value.verifier.types;
        defaultRedditActions.value = task.value.verifier.types;
      } else {
        redditActions.value = ['reddit_join_community'];
        defaultRedditActions.value = ['reddit_join_community'];
      }
      break;

    default:
      driver.value = '';
      twitterActions.value = [];
      defaultTwitterActions.value = [];
      break;
  }
};

const getUrlList = (images) => {
  return images.map((item) => item.url);
};

const checkIfFilePdf = (file) => {
  return file.mime_type.indexOf('pdf') !== -1;
};

const handlePictureCardPreview = (image) => {
  if (checkIfFilePdf(image)) {
    window.open(image.url, '_blank');
    return;
  }
};

const visible = ref(false);

const handleClose = (value) => {
  visible.value = value;
};
const handleCloseProjectsModal = (value) => {
  isEditProjectVisible.value = value;
};

async function dataURLtoFile(dataurl, imageName) {
  const extension = dataurl.split('.').pop();
  let name = imageName;

  const response = await fetch(dataurl);
  const data = await response.blob();

  // if (dataurl.includes('https://')) {
  //   name = dataurl.replace('https://', '');
  // } else {
  //   name = dataurl.replace('http://', '');
  // }

  let metadata = {
    type: `image/${extension}`,
  };
  let file = new File([data], name, metadata);
  return file;
}

const updateTask = async ({
  data,
  isAxios,
  onChain,
  func = null,
  isShowSuccessMessage = true,
  successMessage = '',
}) => {
  try {
    isUpdateTaskLoading.value = true;

    await tasksStore.updateTaskAction(route.params.id, data, isAxios, onChain);

    window.dataLayer.push({
      event: 'project_task_update',
    });

    if (func) {
      func();
    }
    if (isShowSuccessMessage) {
      if (successMessage) {
        nuxtApp.$alert.show(successMessage, {
          type: 'success',
          timeout: 5000,
        });
      } else {
        nuxtApp.$alert.show(`Task updated`, {
          type: 'success',
          timeout: 5000,
        });
      }
    }

    isUpdateTaskLoading.value = false;
  } catch (error) {
    isUpdateTaskLoading.value = false;
    console.log('updateTask error', error);
    nuxtApp.$alert.show(error, {
      type: 'error',
      timeout: 5000,
    });
  }
};

const setIsCommunityActive = (value) => {
  if (
    (!value && isCommunityActive.value !== value && task.verifier_driver !== null) ||
    (!value && isCommunityActive.value !== value && task.is_invite_friends)
  ) {
    const formData = new FormData();

    formData.append('verifier_driver', null);

    formData.append('_method', 'patch');

    updateTask({ data: formData, isAxios: true });
  }

  isCommunityActive.value = value;
};

const toggle = () => {
  open.value = !open.value;
};

const debouncedSetIsCommunityActive = useDebounce(setIsCommunityActive, 1000);
const trophies = computed(() => tasksStore.getTrophies);

const removeReward = async (type, task) => {
  let rewards = [];

  const creditsReward = task.rewards.find((item) => item.type === 'credits');
  const coinsReward = task.rewards.find((item) => item.type === 'coins');
  const discordReward = task.rewards.find((item) => item.type === 'discord_role');

  if (type === 'credits') {
    rewards = createRewardsArray(coinsReward, discordReward);
  } else if (type === 'discord') {
    rewards = createRewardsArray(creditsReward, coinsReward);
  } else {
    rewards = createRewardsArray(discordReward, creditsReward);
  }

  const formData = createFormData(rewards);

  try {
    await updateTask({
      data: formData,
      isAxios: true,
      func: () => {
        handleUpdateTaskSuccess(type);
      },
    });
  } catch (error) {
    console.log('error', error);
    handleCloseModal(type);
  }
};

const createRewardsArray = (firstReward, secondReward) => {
  let rewards = [];

  if (firstReward && secondReward) {
    rewards = [
      { type: firstReward.type, value: firstReward.value },
      { type: secondReward.type, value: secondReward.value },
    ];
  } else if (firstReward) {
    rewards = [{ type: firstReward.type, value: firstReward.value }];
  } else if (secondReward) {
    rewards = [{ type: secondReward.type, value: secondReward.value }];
  }

  return rewards;
};

const createFormData = (rewards) => {
  const formData = new FormData();
  for (let i = 0; i < rewards.length; i++) {
    for (let key of Object.keys(rewards[i])) {
      formData.append(`rewards[${i}][${key}]`, rewards[i][key]);
    }
  }
  formData.append('_method', 'patch');
  return formData;
};

const handleUpdateTaskSuccess = (type) => {
  handleCloseModal(type);
  discordStore.getDiscordRolesAction(projectId.value);
  selectedRewards.value = selectedRewards.value.filter((item) => item.name !== getRewardName(type));
  rewardsArray.value = rewardsArray.value.filter((item) => item.type !== type);
};

const handleCloseModal = (type) => {
  const modalVariable = getModalVariable(type);
  modalVariable.value = false;
};

const getRewardName = (type) => {
  switch (type) {
    case 'credits':
      return 'Credits';
    case 'discord':
      return 'Discord Role';
    default:
      return 'Coins';
  }
};

const getModalVariable = (type) => {
  switch (type) {
    case 'credits':
      return isShowRemoveCredits;
    case 'discord':
      return isShowRemoveReward;
    default:
      return isShowRemoveCoins;
  }
};

const setCoinsReward = (event) => {
  coinsAmount.value = event;
  return;
  if (isBlockchainEditActive.value) return;
  if (+coinsAmount.value <= 0) return;

  if (
    !!+event &&
    task.value &&
    task.value.rewards &&
    task.value.rewards.length &&
    task.value.rewards.some((item) => item.type === 'coins')
  ) {
    let rewards = task.value.rewards.map((item) => ({
      type: item.type.split(' ').join('_').toLowerCase(),
      value: item.type == 'coins' ? event : item.type == 'credits' ? item.value : discordRole.value,
    }));

    const formData = new FormData();

    for (let i = 0; i < rewards.length; i++) {
      for (let key of Object.keys(rewards[i])) {
        formData.append(`rewards[${i}][${key}]`, rewards[i][key]);
      }
    }

    formData.append('level_coefficient', isLevelCoeficient.value);

    formData.append('coin_type_id', coinId.value);

    formData.append('_method', 'patch');

    updateTask({
      data: formData,
      isAxios: true,
      func: () => {
        isShowCoinsEdit.value = false;
        isShowDiscordEdit.value = false;
      },
    });
  } else if (!!+event) {
    const discordReward = task.value.rewards.find((item) => item.type === 'discord_role');
    const coinsReward = task.value.rewards.find((item) => item.type === 'coins');
    const creditsReward = task.value.rewards.find((item) => item.type === 'credits');
    if (!coinsReward) {
      let rewards;
      if (creditsReward && discordReward) {
        rewards = [
          {
            type: 'coins',
            value: event,
          },
          {
            type: 'credits',
            value: creditsReward.value,
          },
          {
            type: 'discord_role'.split(' ').join('_').toLowerCase(),
            value: discordReward.value,
          },
        ];
      } else if (discordReward) {
        rewards = [
          {
            type: 'coins',
            value: event,
          },
          {
            type: 'discord_role'.split(' ').join('_').toLowerCase(),
            value: discordReward.value,
          },
        ];
      } else if (creditsReward) {
        rewards = [
          {
            type: 'coins',
            value: event,
          },
          {
            type: 'credits',
            value: creditsReward.value,
          },
        ];
      } else {
        rewards = [
          {
            type: 'coins',
            value: event,
          },
        ];
      }

      const formData = new FormData();

      for (let i = 0; i < rewards.length; i++) {
        for (let key of Object.keys(rewards[i])) {
          formData.append(`rewards[${i}][${key}]`, rewards[i][key]);
        }
      }

      formData.append('level_coefficient', isLevelCoeficient.value);

      formData.append('_method', 'patch');

      updateTask({
        data: formData,
        isAxios: true,
        func: () => {
          isShowDiscordEdit.value = false;
          isShowCoinsEdit.value = false;
        },
      });
    }
  }
};

const debouncedSetCoinsReward = useDebounce(setCoinsReward, 1000);
const estimateTimeout = ref(null);

const estimatedAmount = ref({ min: 0, max: 0, total: 0 });
watch(
  [
    () => selectedRewards.value,
    () => selectedLevels.value,
    () => directionId.value,
    () => selectedTalents.value,
    () => talentAmount.value,
    () => coinsAmount.value,
    () => isLevelCoeficient.value,
  ],
  ([
    selectedRewards,
    selectedLevels,
    directionId,
    selectedTalents,
    talentAmount,
    coinsAmount,
    isLevelCoeficient,
  ]) => {
    if ((+talentAmount > 0 && +coinsAmount > 0) || (selectedTalents.length && +coinsAmount > 0)) {
      clearTimeout(estimateTimeout.value);

      const rewards = selectedRewards.map((item) => ({
        type: item.name.split(' ').join('_').toLowerCase(),
        value: String(coinsAmount),
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
const setCreditsReward = (event) => {
  creditsAmount.value = event;

  // if (isBlockchainEditActive.value) return;
  if (+creditsAmount.value <= 0 || +creditsAmount.value > 100) return;

  if (
    !!+event &&
    task.value &&
    task.value.rewards &&
    task.value.rewards.length &&
    task.value.rewards.some((item) => item.type === 'credits')
  ) {
    let rewards = task.value.rewards.map((item) => ({
      type: item.type.split(' ').join('_').toLowerCase(),
      value:
        item.type == 'credits'
          ? event
          : item.type == 'coins'
          ? coinsAmount.value
          : discordRole.value,
    }));

    const formData = new FormData();

    for (let i = 0; i < rewards.length; i++) {
      for (let key of Object.keys(rewards[i])) {
        formData.append(`rewards[${i}][${key}]`, rewards[i][key]);
      }
    }

    formData.append('level_coefficient', isLevelCoeficient.value);

    formData.append('coin_type_id', coinId.value);

    formData.append('_method', 'patch');

    updateTask({
      data: formData,
      isAxios: true,
      func: () => {
        isShowCoinsEdit.value = false;
        isShowDiscordEdit.value = false;
        isShowCreditsEdit.value = false;
      },
    });
  } else if (!!+event) {
    const discordReward = task.value.rewards.find((item) => item.type === 'discord_role');
    const coinsReward = task.value.rewards.find((item) => item.type === 'coins');
    // if (!coinsReward) {
    let rewards;
    if (discordReward && coinsReward) {
      rewards = [
        {
          type: 'coins',
          value: coinsReward.value,
        },
        {
          type: 'discord_role'.split(' ').join('_').toLowerCase(),
          value: discordReward.value,
        },
        {
          type: 'credits',
          value: event,
        },
      ];
    } else if (coinsReward && !discordReward) {
      rewards = [
        {
          type: 'coins',
          value: coinsReward.value,
        },
        {
          type: 'credits',
          value: event,
        },
      ];
    } else if (discordReward && !coinsReward) {
      rewards = [
        {
          type: 'discord_role'.split(' ').join('_').toLowerCase(),
          value: discordReward.value,
        },
        {
          type: 'credits',
          value: event,
        },
      ];
    } else {
      rewards = [
        {
          type: 'credits',
          value: event,
        },
      ];
    }

    const formData = new FormData();

    for (let i = 0; i < rewards.length; i++) {
      for (let key of Object.keys(rewards[i])) {
        formData.append(`rewards[${i}][${key}]`, rewards[i][key]);
      }
    }

    formData.append('level_coefficient', isLevelCoeficient.value);

    formData.append('_method', 'patch');

    updateTask({
      data: formData,
      isAxios: true,
      func: () => {
        isShowDiscordEdit.value = false;
        isShowCoinsEdit.value = false;
        isShowCreditsEdit.value = false;
      },
    });
    // }
  }
};

const debouncedSetCreditsReward = useDebounce(setCreditsReward, 1000);

const setDiscordReward = (event) => {
  discordRole.value = event.id;
  if (
    (event.id || event.id !== '') &&
    task.value.rewards &&
    task.value.rewards.length &&
    task.value.rewards.some((item) => item.type === 'discord_role')
  ) {
    const discordReward = task.value.rewards.find((item) => item.type === 'discord_role');
    if (+discordReward.value !== +event.id) {
      let rewards = task.value.rewards.map((item) => ({
        type: item.type.split(' ').join('_').toLowerCase(),
        value: item.type == 'coins' ? item.value : item.type == 'credits' ? item.value : event.id,
      }));

      const formData = new FormData();

      for (let i = 0; i < rewards.length; i++) {
        for (let key of Object.keys(rewards[i])) {
          formData.append(`rewards[${i}][${key}]`, rewards[i][key]);
        }
      }

      formData.append('_method', 'patch');

      updateTask({
        data: formData,
        isAxios: true,
        func: () => {
          isShowDiscordEdit.value = false;
        },
      });
    }
  } else if (event.id) {
    const discordReward = task.value.rewards.find((item) => item.type === 'discord_role');
    const coinsReward = task.value.rewards.find((item) => item.type === 'coins');
    const creditsReward = task.value.rewards.find((item) => item.type === 'credits');
    console.log('add discordReward', discordReward);
    if (!discordReward) {
      let rewards;
      if (creditsReward && coinsReward) {
        rewards = [
          {
            type: coinsReward.type.split(' ').join('_').toLowerCase(),
            value: coinsReward.value,
          },
          {
            type: 'discord_role'.split(' ').join('_').toLowerCase(),
            value: event.id,
          },
          {
            type: 'credits',
            value: creditsReward.value,
          },
        ];
      } else if (coinsReward) {
        rewards = [
          {
            type: coinsReward.type.split(' ').join('_').toLowerCase(),
            value: coinsReward.value,
          },
          {
            type: 'discord_role'.split(' ').join('_').toLowerCase(),
            value: event.id,
          },
        ];
      } else if (creditsReward) {
        rewards = [
          {
            type: 'credits',
            value: creditsReward.value,
          },
          {
            type: 'discord_role'.split(' ').join('_').toLowerCase(),
            value: event.id,
          },
        ];
      } else {
        rewards = [
          {
            type: 'discord_role'.split(' ').join('_').toLowerCase(),
            value: event.id,
          },
        ];
      }

      const formData = new FormData();

      for (let i = 0; i < rewards.length; i++) {
        for (let key of Object.keys(rewards[i])) {
          formData.append(`rewards[${i}][${key}]`, rewards[i][key]);
        }
      }

      formData.append('_method', 'patch');

      updateTask({
        data: formData,
        isAxios: true,
        func: () => {
          isShowDiscordEdit.value = false;
        },
      });
    }
  }
};

const debouncedSetDiscordReward = useDebounce(setDiscordReward, 1000);

const setDiscordRole = (event) => {
  // discordRole.value = event.id;
  if (event.id) {
    // if (event.id || event.id === 0) {
    const formData = new FormData();

    let conditions = [{ type: 'discord_role', value: event.id, operator: '=' }];
    for (let i = 0; i < conditions?.length; i++) {
      for (let key of Object.keys(conditions[i])) {
        formData.append(`conditions[${i}][${key}]`, conditions[i][key]);
      }
    }

    formData.append('_method', 'patch');

    updateTask({ data: formData, isAxios: true });
  } else if (event.id === 0) {
    const formData = new FormData();

    formData.append(`conditions`, null);
    formData.append('_method', 'patch');
    updateTask({ data: formData, isAxios: true });
  }
};

const debouncedSetDiscordRole = useDebounce(setDiscordRole, 1000);

const updateSelectedTalents = (talents) => {
  const formData = new FormData();
  if (!talents.length) {
    formData.append('assign_user_ids', null);
  } else {
    for (let talent of talents) {
      formData.append('assign_user_ids[]', talent.id);
    }
  }

  // formData.append('number_of_participants', 0);
  formData.append('_method', 'patch');
  updateTask({ data: formData, isAxios: true });
};

const debouncedUpdateSelectedTalents = useDebounce(updateSelectedTalents, 1000);

const handleRemoveTalents = (id) => {
  selectedTalents.value = selectedTalents.value.filter((item) => item.id !== id);
  debouncedUpdateSelectedTalents(selectedTalents.value);
};

const setIsLevelCoeficient = (value) => {
  if (!coinsAmount.value) return;
  if (isLevelCoeficient.value === value) return;
  isLevelCoeficient.value = value;
  return;
  const discordReward = task.value.rewards.find((item) => item.type === 'discord_role');
  const coinsReward = task.value.rewards.find((item) => item.type === 'coins');
  let rewards = [];
  if (discordReward) {
    rewards.push({
      type: 'discord_role'.split(' ').join('_').toLowerCase(),
      value: discordReward.id,
    });
  }
  if (coinsReward) {
    rewards.push({
      type: coinsReward.type.split(' ').join('_').toLowerCase(),
      value: coinsReward.value,
    });
  }

  const formData = new FormData();

  for (let i = 0; i < rewards.length; i++) {
    for (let key of Object.keys(rewards[i])) {
      formData.append(`rewards[${i}][${key}]`, rewards[i][key]);
    }
  }

  formData.append('level_coefficient', value);

  formData.append('coin_type_id', coinId.value);

  formData.append('_method', 'patch');

  updateTask({
    data: formData,
    isAxios: true,
    func: () => {
      isShowCoinsEdit.value = false;
    },
  });
};

const debouncedSetIsLevelCoeficient = useDebounce(setIsLevelCoeficient, 0);

const handleSelectedTalents = (item) => {
  selectedTalents.value.push(item);
  debouncedUpdateSelectedTalents(selectedTalents.value);
};

const updateTalentsAmount = (value) => {
  const formData = new FormData();
  // formData.append('assign_user_ids', []);
  formData.append('number_of_participants', value);
  formData.append('_method', 'patch');
  updateTask({ data: formData, isAxios: true });
};

const debouncedUpdateTalentsAmount = useDebounce(updateTalentsAmount, 1000);

watch(talentAmount, async (value) => {
  if (+value && +value > 0 && task.value && task.value.number_of_participants !== value) {
    isAmountOfTalantUnlimited.value = false;
    debouncedUpdateTalentsAmount(value);
  } else if (+value && +value === 0) {
    isAmountOfTalantUnlimited.value = true;
  }
});

const handleRemoveImagesEditing = async (value) => {
  const formData = new FormData();

  if (!value.id || !+value.id) return;

  formData.append('ids[]', +value.id);

  formData.append('_method', 'delete');

  try {
    const { data } = await axios.post(
      useRuntimeConfig().public.apiBase + `v2/tasks/${route.params.id}/files`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${authStore.getToken()}`,
        },
      },
    );
    await tasksStore.getTaskAction(route.params.id);
    nuxtApp.$alert.show(`Task updated`, {
      type: 'success',
      timeout: 5000,
    });
  } catch (error) {
    console.log('handleImagesEditing error', error);
    nuxtApp.$alert.show(`Task wasn't updated`, {
      type: 'error',
      timeout: 5000,
    });
  }
};

const handleImagesEditing = async (value) => {
  if (task.value.images?.length === value?.length) return;
  const newValue = value.filter((item) => !item.id);
  const formData = new FormData();
  for (let i of newValue) {
    let imageFile;
    if (!i.raw) {
      imageFile = await dataURLtoFile(i.url, i.name);
    }
    formData.append('files[]', i.raw ? i.raw : imageFile);
  }

  if (value?.length > task.value.images?.length) {
    formData.append('_method', 'post');
    try {
      const { data } = await axios.post(
        useRuntimeConfig().public.apiBase + `v2/tasks/${route.params.id}/files`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authStore.getToken()}`,
          },
        },
      );
      console.log('handleImagesEditing data', data);
      await tasksStore.getTaskAction(route.params.id);
      nuxtApp.$alert.show(`Task updated`, {
        type: 'success',
        timeout: 5000,
      });
    } catch (error) {
      console.log('handleImagesEditing error', error);
      nuxtApp.$alert.show(`Task wasn't updated`, {
        type: 'error',
        timeout: 5000,
      });
    }
  }
};

const setStartDate = (event) => {
  let date;
  const todayDate = new Date();
  const today = new Date();
  const eventDate = new Date(event);
  const isToday = eventDate.getTime() === today.getTime();
  if (isToday) {
    date = todayDate;
  } else {
    date = event;
  }
  const data = {
    started_at: +dateToTimestamp(date).toFixed(0),
  };
  updateTask({ data });
};

const setEndDate = (event) => {
  let date;
  const todayDate = new Date();
  const today = new Date();
  const eventDate = new Date(event);
  const isToday = eventDate.getTime() === today.getTime();
  if (isToday) {
    date = todayDate;
  } else {
    date = event;
  }
  const data = {
    started_at: task.value.started_at,
    ended_at: +dateToTimestamp(date).toFixed(0),
  };
  updateTask({ data });
};

const setTaskName = (value) => {
  const data = {
    name: taskName.value,
  };
  updateTask({ data });
};

const debouncedSetTaskName = useDebounce(setTaskName, 1000);

const setDescription = (value) => {
  if (!description.value !== value) {
    const data = {
      text: value,
    };
    updateTask({ data, isShowSuccessMessage: false });
  }
};

const debouncedsetDescription = useDebounce(setDescription, 1000);

const handleSelectedDirections = (event) => {
  if (event.id !== directionId.value) {
    const data = {
      activity_id: [event.id == 0 ? null : event.id],
    };
    updateTask({ data });
  }
};

const handleSelectedBlockchain = (event) => {
  blockchainId.value = event.id;
  // isSetDefaultCoin.value = true;
  if (!defaultBlockchainId.value) {
    defaultBlockchainId.value = event.id;
  }
  if (isBlockchainEditActive.value) return;
  // if (event.id !== defaultBlockchainId.value.id) {
  //   const data = {
  //     blockchain_id: event.id,
  //   };
  //   updateTask({ data });
  // }
};

const handleSelectedPriority = (event) => {
  if (event.name.toLowerCase() !== defaultPriority.value.name.toLowerCase()) {
    const data = {
      priority: event.name.toLowerCase(),
    };
    updateTask({ data });
  }
};

const handleProjectUpdate = (event) => {
  if (event === projectId.value) {
    nuxtApp.$alert.show(`Task already in this project. Choose another project`, {
      type: 'error',
      timeout: 5000,
    });
    return;
  }
  const data = {
    project_id: event,
  };
  isEditProjectVisible.value = false;
  updateTask({ data, successMessage: 'The Project was successfully changed.' });
};

const editTwitter = (event) => {
  if (isTwitterSaveDisabled.value) return;

  const formData = new FormData();
  if (twitterActions.value && twitterActions.value?.length) {
    for (const twitterAction of twitterActions.value) {
      formData.append('verifier_types[]', twitterAction); // Add each value to the array
    }
  }

  formData.append('verifier_driver', driver.value); // Add each value to the array

  if (twitterActions.value.includes('twitter_follow') && userName.value) {
    formData.append('twitter_follow', `@${userName.value}`);
  }
  if (
    (tweetUrl.value && twitterActions.value.includes('twitter_reply')) ||
    (tweetUrl.value && twitterActions.value.includes('twitter_like')) ||
    (tweetUrl.value && twitterActions.value.includes('twitter_retweet'))
  ) {
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
  if (words.value.length > 0 && twitterActions.value.includes('twitter_tweet')) {
    for (let word of words.value) {
      formData.append('tweet_words[]', word);
    }
  }
  // if (tweetUrl.value) {
  //   formData.append('twitter_like', tweetUrl.value);
  // }

  formData.append('_method', 'patch');

  updateTask({
    data: formData,
    isAxios: true,
    func: () => {
      if (
        !twitterActions.value.includes('twitter_like') &&
        !twitterActions.value.includes('twitter_reply') &&
        !twitterActions.value.includes('twitter_retweet')
      ) {
        tweetUrl.value = '';
      }
      if (!twitterActions.value.includes('twitter_follow')) {
        userName.value = '';
      }
      if (!twitterActions.value.includes('twitter_reply')) {
        tweetReply.value = '';
      }
      if (!twitterActions.value.includes('twitter_reply')) {
        tweetReply.value = '';
      }
      if (!twitterActions.value.includes('twitter_tweet')) {
        tweetDefault.value = '';
      }
      if (!twitterActions.value.includes('twitter_space')) {
        tweetSpaceUrl.value = '';
      }
    },
  });
};
const editReddit = (event) => {
  if (isRedditSaveDisabled.value) return;

  const formData = new FormData();
  if (redditActions.value && redditActions.value?.length) {
    for (const redditAction of redditActions.value) {
      formData.append('verifier_types[]', redditAction); // Add each value to the array
    }
  }

  formData.append('verifier_driver', driver.value); // Add each value to the array
  if (redditActions.value.includes('reddit_trophies') && selectedTrophies.value.length) {
    for (let trophie of selectedTrophies.value) {
      formData.append('reddit_trophies[]', trophie.id);
    }
  }
  if (
    redditActions.value.find(
      (e) => e === 'reddit_comment_post' || e === 'reddit_save_post' || e === 'reddit_vote_post',
    ) &&
    (commentPostUrl.value || votePost.value || savePostUrl.value)
  ) {
    formData.append('reddit_post', commentPostUrl.value || votePost.value || savePostUrl.value);
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
  if (redditActions.value.includes('reddit_vote_post') && upvote.value) {
    formData.append('reddit_upvote', upvote.value);
  }
  if (redditWords.value.length > 0 && redditActions.value.includes('reddit_own_post')) {
    for (let word of redditWords.value) {
      formData.append('reddit_post_words[]', word);
    }
  }

  formData.append('_method', 'patch');

  updateTask({
    data: formData,
    isAxios: true,
    func: () => {
      if (
        !redditActions.value.includes('reddit_comment_post') &&
        !redditActions.value.includes('reddit_save_post') &&
        !redditActions.value.includes('reddit_vote_post')
      ) {
        commentPostUrl.value = '';
        votePost.value = '';
        savePostUrl.value = '';
      }
      if (!redditActions.value.includes('reddit_join_community')) {
        redditCommunityUrl.value = '';
      }
      if (!redditActions.value.includes('reddit_post')) {
        postDefault.value = '';
      }
      if (!redditActions.value.includes('reddit_post_words')) {
        redditWords.value = [];
      }
      if (!redditActions.value.includes('reddit_trophies')) {
        selectedTrophies.value = [];
      }
      if (!redditActions.value.includes('reddit_karma_score')) {
        karmaAmount.value = 0;
      }
    },
  });
};
const editInvites = (event) => {
  if (isInvitesSaveDisabled.value) return;
  if (event === projectId.value) {
    nuxtApp.$alert.show(`Task already in this project. Choose another project`, {
      type: 'error',
      timeout: 5000,
    });
    return;
  }
  let data = {
    // verifier_driver: 'null',
  };
  if (isInvitesUnlimited.value && +winnersAmount.value) {
    data.number_of_winners = winnersAmount.value;
  } else {
    data.number_of_invites = invitesAmount.value;
  }

  updateTask({ data });
};

onUnmounted(() => {
  rewardsArray.value = [];
  taskName.value = '';
  description.value = '';
});

watch(
  [
    () => coins.value,
    () => defaultBlockchainId.value,
    () => blockchainId.value,
    () => isSetDefaultCoin.value,
  ],
  ([newCoins, defaultBlockchainId, blockchainId, isDefaultCoin]) => {
    if (newCoins && newCoins.length && defaultBlockchainId.id !== blockchainId && isDefaultCoin) {
      defaultCoin.value = newCoins[0];
      coinId.value = newCoins[0].id;
      isSetDefaultCoin.value = false;
    }
  },
  { deep: true, instant: true },
);

watch(blockchainId, async (value) => {
  if (value) {
    await coinsStore.getCoinsAction(value);
    isSetDefaultCoin.value = true;
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

watch(isDiscordConnected, (value) => {
  if (
    !value &&
    rewardsArray.value.length &&
    rewardsArray.value.some((item) => item.type === 'discord')
  ) {
    rewardsArray.value = rewardsArray.value.filter((item) => item.type !== 'discord');
  }
});

const isDiscordRoleActive = computed(() => {
  return !(
    (!!projectId.value && !!discordRoles.value && discordRoles.value?.length) ||
    isDiscordConnected
  );
});

watch(isDiscordRoleActive, (value) => {
  if (value) {
    selectedRewards.value = selectedRewards.value.filter((item) => item.name !== 'Discord Role');
    rewards.value = rewards.value.filter((item) => item.name !== 'Discord Role');
    if (!selectedRewards.value?.length) {
      selectedRewards.value = [
        {
          name: 'Coins',
          id: 1,
        },
      ];
    }
    if (!rewards.value?.length) {
      rewards.value = [
        {
          name: 'Coins',
          id: 1,
        },
      ];
    }
  }
});

watch([() => task.value, () => discordRoles.value], ([task, discordRoles]) => {
  if (discordRoles && discordRoles?.length && discordRoles.every((item) => !!item.position)) {
    getTaskRewards(task, discordRoles);
  }
  if (task && !discordRoles) {
    getTaskRewards(task, null);
  }
  if (
    task &&
    task.conditions &&
    task.conditions?.length &&
    discordRoles &&
    discordRoles?.length &&
    discordRoles.every((item) => !!item.position)
  ) {
    discordRoleDefault.value = discordRoles.find((item) => item.id === task.conditions[0].value);
  } else {
    discordRoleDefault.value = { name: 'Any roles', id: 0, position: '0' };
  }
});

watch(task, (value) => {
  console.log('WATCH TASK', value);

  if (!value) {
    return;
  }
  // getTaskRewards(value, discordRoles.value);
  if (
    isDiscordConnected.value &&
    discordRoles.value &&
    discordRoles.value.length &&
    discordRoles.value.every((item) => !!item.position)
  ) {
    getTaskRewards(value, discordRoles.value);
  } else {
    getTaskRewards(value);
  }
  isLevelCoeficient.value = value.level_coefficient;
  if (value.number_of_participants === 0) {
    isAmountOfTalantUnlimited.value = true;
  }
  if (value.coin_type && value.coin_type.id) {
    coinId.value = value.coin_type.id;
  }
  if (value.assigned_users && value.assigned_users.length && !selectedTalents.value.length) {
    selectedTalents.value = value.assigned_users;
    idParticipants.value = 1;
  }
  if (value.activity) {
    directionId.value = value.activity.id;
  }
  // if (value.number_of_invites) {
  invitesAmount.value = value.number_of_invites;
  // }
  if (+value.number_of_invites === 0 && +value.number_of_winners) {
    isInvitesUnlimited.value = true;
  }
  // if (value.number_of_winners) {
  winnersAmount.value = value.number_of_winners;
  // }
  defaultDirection.value = value.activity;
  if (!taskName.value) {
    // if (!taskName.value || (taskName.value && taskName.value !== value.name)) {
    taskName.value = value.name;
  }
  if (!description.value || (description.value && description.value !== value.text)) {
    description.value = value.text;
  }
  if (!images.value || (images.value && images.value.length !== value.images.length)) {
    images.value = value.images;
  }
  defaultBlockchainId.value = value.coin_type.blockchain;
  blockchainId.value = value.coin_type.blockchain.id;
  const findDefaultPriority = priorityOptions.find(
    (item) => item.name.toLowerCase() === value.priority,
  );
  defaultPriority.value = findDefaultPriority;
  projectId.value = value.project.id;
  if (value.levels) {
    selectedLevels.value = value.levels;
  }

  if (value.is_invite_friends) {
    isShowCommunityId.value = 3;
    isCommunityActive.value = true;
  } else {
    isCommunityActive.value = false;
  }

  if (value.autovalidate) {
    isCommunityActive.value = value.autovalidate;
  }

  talentAmount.value = value.number_of_participants;
  if (value.autovalidate) {
    isShowCommunityId.value = 3;
  }
  if (value.verifier_driver) {
    driver.value = value.verifier_driver;
  }
  if (value.verifier_driver && value.verifier_driver === 'discord') {
    discordUrl.value = value.verifier.invite_value;
    isShowCommunityId.value = 1;
  }
  if (value.verifier_driver && value.verifier_driver === 'telegram') {
    telegramUrl.value = value.verifier.invite_value;
    isShowCommunityId.value = 0;
  }
  if (value.verifier_driver && value.verifier_driver === 'twitter') {
    isShowCommunityId.value = 2;
    if (value.verifier.tweet_words && value.verifier.tweet_words.length) {
      words.value = JSON.parse(JSON.stringify(value.verifier.tweet_words));
      defaultWords.value = JSON.parse(JSON.stringify(value.verifier.tweet_words));
    }
    console.log('WATCH TASK VALUE');
    twitterActions.value = value.verifier.types;
    defaultTwitterActions.value = value.verifier.types;
    const taskTwitterActionsIds = twitterActionsButtons
      .filter((item) =>
        value.verifier.types.some((type) => type.toLowerCase() === item.name.toLowerCase()),
      )
      .map((item) => String(item.id));
    twitterActionsIds.value = taskTwitterActionsIds;
    if (value.verifier.twitter_follow) {
      userName.value = value.verifier.twitter_follow;
    }
    if (value.verifier.twitter_tweet) {
      tweetUrl.value = value.verifier.twitter_tweet;
    }
    if (value.verifier.default_reply) {
      tweetReply.value = value.verifier.default_reply;
    }
    if (value.verifier.default_tweet) {
      console.log('UPDATE tweetDefault.value', tweetDefault.value);
      tweetDefault.value = value.verifier.default_tweet;
    }
    if (value.verifier.twitter_space) {
      tweetSpaceUrl.value = value.verifier.twitter_space;
    }
  }
  if (value.verifier_driver && value.verifier_driver === 'reddit') {
    isShowCommunityId.value = 4;
    if (value.verifier.reddit_post_words && value.verifier.reddit_post_words.length) {
      redditWords.value = JSON.parse(JSON.stringify(value.verifier.reddit_post_words));
      defaultRedditWords.value = JSON.parse(JSON.stringify(value.verifier.reddit_post_words));
    }
    if (value.verifier.reddit_trophies && value.verifier.reddit_trophies.length) {
      defTrophies.value = JSON.parse(JSON.stringify(value.verifier.reddit_trophies));
    }

    // // getTaskRewards(value, discordRoles.value);
    // if (
    //   isDiscordConnected.value &&
    //   discordRoles.value &&
    //   discordRoles.value.length &&
    //   discordRoles.value.every((item) => !!item.position)
    // ) {
    //   getTaskRewards(value, discordRoles.value);
    // } else {
    //   getTaskRewards(value);
    // }

    console.log('WATCH TASK VALUE');
    redditActions.value = value.verifier.types;
    defaultRedditActions.value = value.verifier.types;
    const taskRedditActionsIds = redditActionsButtons
      .filter((item) =>
        value.verifier.types.some((type) => type.toLowerCase() === item.name.toLowerCase()),
      )
      .map((item) => String(item.id));
    redditActionsIds.value = taskRedditActionsIds;
    if (value.verifier.reddit_community) {
      redditCommunityUrl.value = value.verifier.reddit_community;
    }
    if (value.verifier.reddit_default_post) {
      postDefault.value = value.verifier.reddit_default_post;
    }
    if (value.verifier.reddit_post_words) {
      redditWords.value = value.verifier.reddit_post_words;
    }
    if (value.verifier.reddit_post) {
      savePostUrl.value = value.verifier.reddit_post;
    }
    if (value.verifier.reddit_post) {
      votePost.value = value.verifier.reddit_post;
    }
    if (value.verifier.reddit_post) {
      commentPostUrl.value = value.verifier.reddit_post;
    }
    if (value.verifier.reddit_karma_score) {
      karmaAmount.value = value.verifier.reddit_karma_score;
    }
    if (value.verifier.reddit_trophies) {
      selectedTrophies.value = value.verifier.reddit_trophies;
    }
    if (value.verifier.reddit_upvote) {
      upvote.value = value.verifier.reddit_upvote;
    }
  }
  const findConditionOnChain = value?.chain_conditions.find((el) => el.type === 'main');

  if (findConditionOnChain?.name) {
    const findConditionState = conditions.find((el) => {
      return el?.value === findConditionOnChain.name;
    });
    if (findConditionState) {
      onChainValues.value.selectedCondition = findConditionState;
    }
  }

  if (findConditionOnChain?.chain_condition_fields) {
    findConditionOnChain.chain_condition_fields?.forEach((el) => {
      if (el?.name === ON_CHAIN_CONDITION_PARTS.BLOCKCHAIN) {
        const findBlockchainsState = blockchains.find((blockchain) => {
          return blockchain?.value === el.value;
        });

        if (findBlockchainsState) {
          onChainValues.value.selectedBlockchain = findBlockchainsState;
        }
      }
      if (el?.name === ON_CHAIN_CONDITION_PARTS.RECEIVER_ADDRESS) {
        onChainValues.value.receiverAddress = el?.value;
      }
      if (el?.name === ON_CHAIN_CONDITION_PARTS.SENDER_ADDRESS) {
        onChainValues.value.senderAddress = el?.value;
      }
      if (el?.name === ON_CHAIN_CONDITION_PARTS.CONTRACT_ADDRESS) {
        onChainValues.value.contractAddress = el?.value;
      }
      if (el?.name === ON_CHAIN_CONDITION_PARTS.TOKEN_ID) {
        onChainValues.value.tokenId = el?.value;
      }
      if(el?.name === ON_CHAIN_CONDITION_PARTS.TOKEN_NAME) {
        onChainValues.value.tokenName = el?.value;
      }
      if (el?.name === ON_CHAIN_CONDITION_PARTS.CURRENCY_ADDRESS) {
        onChainValues.value.currencyAddress = el?.value;
      }
      if (el?.name === ON_CHAIN_CONDITION_PARTS.AMOUNT) {
        onChainValues.value.amountCondition = el?.value;
      }
      if(el?.name === ON_CHAIN_CONDITION_PARTS.ACTION_BUTTON_LINK) {
        onChainValues.value.actionButtonLink = el?.value
      }
      if(el?.name === ON_CHAIN_CONDITION_PARTS.ACTION_BUTTON_TITLE) {
        onChainValues.value.actionButtonTitle = el?.value
      }
      if (el?.name === ON_CHAIN_CONDITION_PARTS.IS_NATIVE_TOKEN) {
        onChainValues.value.isNativeToken = el?.value;
      }
      if (el?.name === ON_CHAIN_CONDITION_PARTS.NFT_NAME) {
        onChainValues.value.nftName = el?.value;
      }
      if (el?.name === ON_CHAIN_CONDITION_PARTS.NFT_IMAGE) {
        onChainValues.value.nftPreview = el?.value;
      }
    });
  }
});

const postValid = ref(true);
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
  const data = {
    discord_invite: discordUrl.value,
    verifier_driver: driver.value,
    'verifier_types[]': twitterActions.value,
  };
  updateTask({ data });
  return true;
};
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
    console.log(isValid);
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

const isTelegramValid = ref(true);
const debounceRedditPostValidation = useDebounce(redditPostValidation, 300);
const debounceRedditCommunityValidation = useDebounce(redditCommunityValidation, 300);

const telegramValidation = () => {
  if (!telegramUrl.value.trim()) {
    isTelegramValid.value = false;
    return false;
  }

  isTelegramValid.value = true;
  const data = {
    telegram_invite: telegramUrl.value,
    // discord_invite: discordUrl.value,
    verifier_driver: driver.value,
    'verifier_types[]': twitterActions.value,
  };
  updateTask({ data });
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
    // if (data.status !== 200) {
    //   usernameValid.value = false;
    //   return;
    // }
    if (data.data && !data.data.id) {
      usernameValid.value = false;
      return;
    }
    usernameValid.value = true;
    return true;
  } catch (error) {
    console.log('usernameValidation catch', error);
    usernameValid.value = false;
    return false;
  }
};

const debouncedUsernameValidation = useDebounce(usernameValidation, 300);

const tweetValid = ref(true);

const tweetLinkValidation = async () => {
  try {
    if (typeof tweetUrl.value === 'string' && tweetUrl.value === '') {
      tweetValid.value = true;
      return true;
    }
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
      /^https?:\/\/(www.)?(twitter|x)\.com\/i\/spaces?\/(?<space>[a-zA-Z0-9]{1,13})/i;
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

const debouncedSpaceLinkValidation = useDebounce(spaceLinkValidation, 300);

const getTaskRewards = (task, discordRoles = null) => {
  if (task && task.rewards && task.rewards?.length) {
    rewardsArray.value = [];
    const isCoinsExist = task.rewards.find((reward) => reward.type === 'coins');
    const isCreditsExist = task.rewards.find((reward) => reward.type === 'credits');
    const isDiscordExist = task.rewards.find((reward) => reward.type === 'discord_role');
    if (isCoinsExist) {
      coinsAmount.value = isCoinsExist.value;
      if (!selectedRewards.value.some((item) => item.name === 'Coins')) {
        selectedRewards.value.push({
          id: 1,
          name: 'Coins',
        });
      }

      if (rewardsArray.value.some((item) => item.type === 'coin')) {
        rewardsArray.value = rewardsArray.value.filter((item) => item.type !== 'coin');
      }
      const icon = getCuttencyIcon(task.coin_type.symbol.toLowerCase());
      const rewardString = `${isCoinsExist.value} ${
        task.coin_type.symbol.toUpperCase() || task.coin_type.name.toUpperCase()
      }`;
      rewardsArray.value.push({ rewardString, icon, type: 'coin' });
    }
    if (!isCoinsExist && rewardsArray.value.some((item) => item.type === 'coin')) {
      rewardsArray.value = rewardsArray.value.filter((item) => item.type !== 'coin');
    }
    if (isCreditsExist) {
      creditsAmount.value = isCreditsExist.value;
      if (!selectedRewards.value.some((item) => item.name === 'Credits')) {
        selectedRewards.value.push({
          id: 4,
          name: 'Credits',
        });
      }

      if (rewardsArray.value.some((item) => item.type === 'credits')) {
        rewardsArray.value = rewardsArray.value.filter((item) => item.type !== 'credits');
      }
      const icon = creditsIcon;
      const rewardString = `${isCreditsExist.value} Credits`;
      rewardsArray.value.push({ rewardString, icon, type: 'credits' });
    }
    if (!isCreditsExist && rewardsArray.value.some((item) => item.type === 'credits')) {
      rewardsArray.value = rewardsArray.value.filter((item) => item.type !== 'credits');
    }
    if (isDiscordExist && discordRoles) {
      if (!selectedRewards.value.some((item) => item.name === 'Discord Role')) {
        selectedRewards.value.push({
          id: 2,
          name: 'Discord Role',
        });
      }
      if (rewardsArray.value.some((item) => item.type === 'discord')) {
        rewardsArray.value = rewardsArray.value.filter((item) => item.type !== 'discord');
      }
      try {
        if (discordRoles && discordRoles.every((item) => !!item.position)) {
          const discordData = discordRoles.find((item) => item.id === isDiscordExist.value);
          discordRole.value = discordData.id;
          discordRewardDefault.value = discordData;
          rewardsArray.value.push({
            rewardString: discordData.name,
            icon: 'Discord-Circle',
            type: 'discord',
          });
        }
      } catch (error) {
        console.log('DISCORD ERROR', error);
      }
    }
    if (!isDiscordExist && rewardsArray.value.some((item) => item.type === 'discord')) {
      rewardsArray.value = rewardsArray.value.filter((item) => item.type !== 'discord');
    }
  }
};

const isPdf = (file) => {
  return file.mime_type.indexOf('pdf') !== -1;
};

const hasHtml = (value) => {
  const regex = /(<([^>]+)>)/gi;
  return regex.test(value);
};

const handleUpdateGateCondition = async ({ id, type, values }) => {
  return await taskGateStore
    .updateConditionAction(task.value.id, id, { type, values })
    .then((res) => {
      if (res) {
        tasksStore.getTaskAction(route.params.id);
        nuxtApp.$alert.show('Gate condition updated', {
          type: 'success',
          timeout: 5000,
        });
        return true;
      }
    });
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

.filter-title_wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
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

.tweeter-add-word {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.save-blockchain-btn {
  background: #eaeafb;
  border: 1px solid #f5f5fd;
  border-radius: 8px;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 1.5;
  padding: 4px 8px;
  width: 50px;
  height: 30px;
  color: #38405b;
}

.edit-twitter-card {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.coins-reward {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.tooltip-confirmation-rewards {
  position: absolute;
  z-index: 976;
  // top: 0;
  right: -3px;
  bottom: -90px;
  width: 192px;
  height: 89px;
  margin-top: 35px;
  background: $white;
  padding: 8px;
  box-shadow: 0px 4px 16px rgba(56, 64, 91, 0.24);
  border-radius: 8px;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.014em;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;

  .msg {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    font-feature-settings: 'zero' on;
    color: $default !important;
  }

  .contol-block {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 12px;

    .cancel {
      cursor: pointer;
      background: $white;
      border-radius: 6px;
      padding: 3px 20px;
      color: $default !important;

      &:hover {
        background: $default-bg;
      }
    }

    .confirm {
      cursor: pointer;
      background: $white;
      border-radius: 6px;
      padding: 3px 20px;
      color: #801100 !important;

      &:hover {
        background: $default-bg;
      }
    }
  }
}

.tooltip-arrow {
  position: absolute;
  top: -6px;
  /* половина высоты стрелки */
  left: 92%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  /* половина ширины стрелки */
  border-right: 6px solid transparent;
  /* половина ширины стрелки */
  border-bottom: 6px solid $white;
  /* цвет стрелки */
}

.talent-btns-wrapper {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.opacity-visible {
  opacity: 1 !important;
}

.icon-title_wrapper {
  display: flex;
  align-items: center;
  gap: 5px;
}

.auto-tasks {
  max-width: 600px;
}

.line {
  width: 100%;
  height: 1px;
  background: $default-border;
  margin-top: 28px;
}

.section_wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 100%;

  &.invite {
    gap: 24px;
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

    &-h2 {
      margin-bottom: 25px;
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 500;
      font-size: 18px;
      line-height: 24px;
      font-feature-settings: 'zero' on;
      color: $section-title;

      &.telegram {
        margin-bottom: 0;
      }
    }
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
    width: 100%;
    margin-top: -8px;
  }
}

.task-header-btns {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
}

.social-driver_title {
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 24px;
  font-feature-settings: 'zero' on;
  color: $section-title;
}

.working-talents-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px;
  gap: 24px;

  width: 360px;
  // min-height: 416px;
  height: fit-content;

  background: $white;

  border: 1px solid $default-border;
  border-radius: 16px;

  &_main-card-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  &_title {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    line-height: 24px;
    font-feature-settings: 'zero' on;
    color: $secondary;
  }

  &_users {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  &_user {
    width: fit-content;
    height: 40px;
    background: $white;

    border: 1px solid $default-badge-border;
    border-radius: 8px;
  }

  &_btn {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 4px 12px;
    gap: 8px;
    width: 139px;
    height: 32px;
    background: $transparent-active-bg;
    border-radius: 8px;
    cursor: pointer;

    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    font-feature-settings: 'zero' on;
    color: $secondary;
  }
}

.main-task-data {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.task-sidebar-card_reward-amount {
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 400;
  font-size: 32px;
  line-height: 28px;
  font-feature-settings: 'zero' on;
  color: $section-title;
  text-decoration: dashed;
  border-bottom: dashed 1px $default-badge-border;
}

.reward-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.reward-item_wrapper {
  position: relative;
  width: 100%;

  // z-index: 100;
  &.margin {
    margin-bottom: 16px;
  }

  &.low {
    z-index: 99;
  }
}

.task-sidebar-card_reward {
  // z-index: 880;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &.editHover {
    background: #f5f5fd;
    cursor: pointer;
  }

  // &:hover {
  //   background: #f5f5fd;
  //   cursor: pointer;
  // }
}

.reward-icon {
  display: block;
  position: relative;
  z-index: 901;

  &-img {
    width: 26px;
    height: 26px;
  }
}

.task-sidebar-card_title {
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 24px;
  font-feature-settings: 'zero' on;
  color: $secondary;

  // margin-bottom: 20px;
  &.participants {
    margin-bottom: 0;
  }
}

.task-sidebar-card.gate {
  transition: height 0.5s;

  height: 62px;
  min-height: 62px;
  .task-gate,
  .empty-gate,
  .task-gate-btn {
    display: none;
  }
}

.task-sidebar-card.gate.gatesIsOpen {
  height: fit-content;
  min-height: 40px;

  .task-gate,
  .empty-gate{
    display: block;
  }
  .task-gate-btn {
    display: flex;
  }
}

.task-sidebar-card_title.gate {
  position: relative;
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding: 0 40px 0 0;

  .toggle-gate {
    position: absolute;
    cursor: pointer;
    top: calc(50% - 12px);
    right: 0;
    width: 24px;
    height: 24px;
    border: none;
    transition: transform 0.2s;
    background: url('@/assets/images/select.svg');
    background-position: center;
    background-size: 12px 7px;
    background-repeat: no-repeat;
    transform: rotate(0);
  }
  .toggle-gate.gatesIsOpen {
    transform: rotate(180deg);
  }
  .custom-condition-select {
    .selected {
      position: relative;
      background: #F5F5FD;
      border: 1px solid #EAEAFB;
      width: 140px;

      .arrow {
        top: calc(50% - 8px);
        width: 16px;
        height: 16px;
        background-size: 7px 4px;
        background-position: center;
      }

      &.open {
        background: $white;
        border: 1px solid $default-badge-border;
        color: $default;

        .flipped {
          transform: rotate(180deg);
          background: url('@/assets/images/select.svg');
          background-position: center;
          background-repeat: no-repeat;
          background-size: 7px 4px;
        }
      }
    }

    .items {
      width: 160px;
    }
  }
}
.task-sidebar-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 16px;
  gap: 5px;

  width: 360px;
  min-height: 120px;
  height: fit-content;

  background: $white;

  border: 1px solid $default-border;
  border-radius: 16px;
  .on-chain-btns {
    display: flex;
    gap: 16px;
    width: 100%;
    margin-top: 32px;

    .clear {
      display: block;
      width: 50%;
      padding-top: 4px;
      padding-bottom: 4px;
      text-align: center;
      border-radius: 8px;
      color: #6a6d8f;
    }

    .apply {
      width: 50%;
      padding-top: 4px;
      padding-bottom: 4px;
      text-align: center;
      border-radius: 8px;
      display: block;
      background-color: #dad9f7;
      color: #000;
    }
  }

  .conditions-container {
    width: 100%;

    & > .custom-select-condition {
      padding-left: 8px;
    }
  }

  .conditions-container.edit {
    position: relative;
    z-index: 17;
    margin-top: 16px;

    .custom-select-condition {
      background-color: #eaeafb;
      outline: none;
    }

    .custom-select-condition.open {
      background-color: #fff;
      outline: 1px solid #dad9f7;
    }
  }

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
      width: 100%;

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

  &_header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    position: relative;
    z-index: 2000;

    &.participants {
      margin-bottom: 0;
    }
  }

  &.participants {
    gap: 32px;
  }
}

.task-images {
  display: flex;
  gap: 16px;
  cursor: pointer;
}

.task-sidebar-card.on-chain {
  width: 100%;
  padding: 0;
  background: transparent;
  border: none;
}

.task-img {
  width: 120px;
  height: 120px;
  background: $default-badge-border;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: $secondary;
}

.task-content {
  width: 712px;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 32px;
  hanging-punctuation: first last;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on, 'ordn' on, 'ss04' on;
  color: $section-title;
}

.task-priority {
  display: flex;
  align-items: center;
  gap: 5px;
  border: 1px solid $default-border;
  border-radius: 6px;
  padding: 0 5px;

  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  text-align: right;
  letter-spacing: 0.014em;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  color: $default;
}

.task-date {
  display: flex;
  align-items: center;
  gap: 5px;
  color: $section-title;
}

.task-info_wrapper {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.task-info {
  display: flex;
  gap: 8px;
}

.task_wrapper {
  position: relative;
  z-index: 90;
  // z-index: 90000;
  width: 1160px;
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 40px;
  margin: 0 auto;
}

.task-name {
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 350;
  font-size: 56px;
  line-height: 72px;
  font-feature-settings: 'zero' on;
  color: $section-title;
}

.task-body {
  width: 100%;
  display: flex;
  gap: 40px;
  margin-bottom: 40px;
}

.task-data {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px;
  gap: 24px;

  width: 760px;
  // min-height: 752px;
  height: fit-content;
  background: $white;

  border: 1px solid $default-border;
  border-radius: 16px;
}

.task-sidebar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  max-width: 360px;
  width: 100%;
  height: 100%;
}
.btn {
  width: 100%;
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
  border: 1px solid #eaeafb;
  border-radius: 8px;
  padding: 5px 8px;

  font-family: Basis Grotesque Pro;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: #38405b;
}

.modal-container {
  padding: 32px;
}
.d-block {
  display: block !important;
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

.task-condition {
    min-width: 600px;
    background-color: #F5F5FD;
    padding: 16px;
    border-radius: 8px;

    &_head {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;

        &_title {
            color: #6A6D8F;
            font-size: 18px;
            font-weight: 500;
            line-height: 24px;
            letter-spacing: 0em;
        }

        img {
            width: 40px;
        }
    }

    p {
        font-size: 20px;
        font-weight: 400;
        line-height: 32px;
        letter-spacing: 0em;
        text-align: left;
        color: #38405B;
        margin-bottom: 28px;
    }

    &_card {
        display: flex;
        height: 49px;
        font-size: 16px;
        font-weight: 500;
        line-height: 24px;
        letter-spacing: 0em;
        color: #38405B;


        &_title {
            width: calc(100% - 82px);
            height: 100%;
            background-color: #DAD9F7;
            margin-right: 2px;
            border-radius: 8px 0px 0px 8px;
            padding: 7px 12px 7px 12px;
            display: flex;
            align-items: center;

            img {
                margin-right: 8px;
            }
        }

        &_btn {
            width: 80px;
            height: 100%;
            background-color: #DAD9F7;
            border-radius: 0px 8px 8px 0px;
            display: flex;
            justify-content: center;
            align-items: center
        }
    }
}
.gate-condition-wr {
  width: 100%;
}

.edit-condition-modal {
  &_buttons {
    width: 100%;
    justify-content: space-between;

    .button {
      width: calc(50% - 12px);
    }
  }

  .conditions-container {
    width: 100%;
    margin-bottom: 12px;
  }
  .conditionsContainerEdit {
    margin-bottom: 12px;
  }
  .custom-select-condition {
    .edit{
      background-color: #fff;
    }
  }
}
.html {
  word-break: break-word;
}
</style>
