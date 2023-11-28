<template>
  <div class="w-auto" ref="index">
    <section class="section items-center">
      <div v-if="user" class="main-title">Hello, {{ capitalize(user.name) }}!</div>
      <!-- <div v-if="role" class="main-title">Hello, {{ capitalize(role) }}!</div> -->
      <div v-else class="main-title">Hello, user!</div>
      <button class="export-btn" @click="pageScreenToPdf">
        <span>Export as pdf</span>
        <img v-if="!loading" :src="downloadIcon" alt="" @click.stop="pageScreenToPdf" />
        <span v-else class="loader"></span>
      </button>
    </section>
    <section v-if="isSuperAdmin" class="section">
      <div class="overview">
        <div class="section-custom-title">
          <CustomTitle
            :loading="!getIsProjectOverviewLoaded && !dashboardOverviewArray.length"
            text="Overview"
          />
        </div>

        <div v-if="projectOverviewLoading || !dashboardOverviewArray.length" class="overview_items">
          <StatCardSkeleton size="large" v-for="i in 8" :key="i" />
        </div>
        <div v-else class="overview_items">
          <StatCardBig
            v-for="statCard in dashboardOverviewArray"
            :="statCard"
            :key="statCard.title"
            :isActive="statCard.title === 'pending claims'"
            @click="navigateToElement(statCard)"
            class="cursor-pointer"
          ></StatCardBig>
        </div>
      </div>
      <div class="short-section event">
        <div class="section-custom-title event">
          <CustomTitle :loading="!isEventsLoaded" text="Events" />
          <!--          <base-button-->
          <!--            :loading="eventsLoading && !isEventsLoaded"-->
          <!--            text="Create an Event"-->
          <!--          ></base-button>-->
        </div>
        <CalendarSkeleton v-if="eventsLoading || !isEventsLoaded" />
        <EventsCalendar v-else :events="events" />
      </div>
    </section>
    <section v-if="isSuperAdmin" class="section gap">
      <div v-if="isSuperAdmin" class="section-inner">
        <div class="section-custom-title">
          <CustomTitle :loading="!isPendingClaimsLoaded" text="Pending Claims" />
          <CustomLink
            :loading="pendingClaimsLoading || !isPendingClaimsLoaded"
            :text="`All ${totalPendingClaims ? totalPendingClaims : 0} Claims`"
            to="/"
          />
        </div>
        <TableSkeleton
          v-if="pendingClaimsLoading || !isPendingClaimsLoaded || !pendingClaimsRows.length"
        />
        <BaseTable
          v-else
          :columns="pendingClaimsColumns"
          :rows="pendingClaimsRows.slice(0, 5)"
          pointer
          title="You have no payment requests yet"
          icon="icons8-futurama-bender"
        />
      </div>
      <div v-if="isSuperAdmin" class="section-inner">
        <div class="section-custom-title">
          <CustomTitle :loading="!isLevelUpRequestsLoaded" text="Level Up Requests" />
          <CustomLink
            :loading="levelUpRequestsLoading || !isLevelUpRequestsLoaded"
            :text="`All ${totalLevelsUp} Requests`"
            to="/requests"
          />
        </div>
        <TableSkeleton v-if="levelUpRequestsLoading || !isLevelUpRequestsLoaded" />
        <BaseTable
          v-else
          title="You do not yet have requests to level up"
          icon="icons8-futurama-amy-wong"
          :columns="levelColumns"
          :rows="levelRows"
          pointer
          @clickFromComponent.stop="levelupRequest"
        />
      </div>
    </section>
    <section v-if="isSuperAdmin" class="section one">
      <div class="section-custom-title">
        <CustomTitle :loading="!isChartDataLoaded" text="Projects" />

        <div class="btns_wrapper">
          <CustomLink
            :loading="chartDataLoading || !isChartDataLoaded"
            :text="`All ${projectsCount} Projects `"
            to="/projects"
          />
          <base-button
            :loading="chartDataLoading && !isChartDataLoaded"
            text="Create a Project"
            @click="projectCreateWindow = true"
          ></base-button>
        </div>
      </div>
      <ProjectChart />
    </section>
    <div v-if="isSuperAdmin">
      <section v-if="isSuperAdmin" class="section gap">
        <div class="short-section">
          <div class="section-custom-title">
            <CustomTitle :loading="!isTopReviewersLoaded" text="Top 5 Reviewers" />
            <CustomLink
              :loading="topReviewersLoading || !isTopReviewersLoaded"
              :text="`All ${topReviewsTotal ? topReviewsTotal : 0} Managers`"
              to="/managers"
            />
          </div>
          <TableSkeleton v-if="topReviewersLoading || !isTopReviewersLoaded" />
          <BaseTable
            v-else
            title="You seem to be the only worker here"
            icon="icons8-futurama-fry"
            :columns="reviewColumns"
            :rows="reviewRows.slice(0, 5)"
            pointer
          />
        </div>
        <div class="section-inner">
          <div class="section-custom-title">
            <CustomTitle :loading="!isManagersEffectivenessLoaded" text="Managers Effectiveness" />
            <base-button
              :loading="!isManagersEffectivenessLoaded"
              text="Invite Manager"
              @click="showInvite = true"
            ></base-button>
          </div>
          <ManagersEffectivenessChart :projectId="project.id"></ManagersEffectivenessChart>
        </div>
      </section>
    </div>

    <section v-if="isSuperAdmin || isCatapultManager">
      <div
        v-if="isSuperAdmin || isCatapultManager"
        class="section one"
        :class="{ 'non-active': isCatapultManager }"
      >
        <template v-if="isSuperAdmin || isCatapultManager">
          <div class="section-custom-title">
            <CustomTitle :loading="!isPopularTasksLoaded" text="Popular Tasks" />
            <TypeTasksSelect
              v-if="!isProjectManager"
              text="Create a Task"
              :handleOpen="handleOpen"
              :isOpenMenu="isOpenMenu"
              :setIsOpenMenu="setIsClearMenu"
              :options="types"
              :reduceLength="14"
            />
          </div>
          <TableSkeleton v-if="popularTasksLoading || !isPopularTasksLoaded" />
          <BaseTable
            title="It seems your talents have nothing to do"
            icon="icons8-futurama-nibbler"
            v-else
            :columns="popularTasksColumns"
            :rows="popularTasksRows"
            pointer
          />
        </template>
      </div>
    </section>

    <section
      v-if="
        (isCatapultManager && projectOverviewLoading) ||
        (isCatapultManager && !dashboardOverviewArray.length)
      "
      class="section"
    >
      <StatCardSkeleton size="small" v-for="i in 6" :key="i" />
    </section>
    <section
      v-if="isCatapultManager && dashboardOverviewArray.length && !projectOverviewLoading"
      class="section"
    >
      <stat-card-small
        v-for="statCard in dashboardOverviewArray"
        :="statCard"
        :key="statCard.title"
        :isActive="statCard.title === 'pending directions'"
        @click="navigateToElement(statCard)"
        class="cursor-pointer"
      ></stat-card-small>
    </section>
    <section v-if="isCatapultManager" class="section gap">
      <div class="section-inner">
        <div class="section-custom-title">
          <CustomTitle :loading="!isLevelUpRequestsLoaded" text="Level Up Requests" />
          <CustomLink
            :loading="levelUpRequestsLoading || !isLevelUpRequestsLoaded"
            :text="`All ${totalLevelsUp ? totalLevelsUp : 0} Requests`"
            to="/requests"
          />
        </div>
        <TableSkeleton v-if="levelUpRequestsLoading || !isLevelUpRequestsLoaded" />
        <BaseTable
          title="You have no talent for the project and no one to raise the level"
          icon="icons8-futurama-amy-wong"
          v-else
          :columns="levelColumns"
          :rows="levelRows"
          pointer
        />
      </div>
      <div class="section-inner">
        <div class="section-custom-title">
          <CustomTitle :loading="!isChartProjectsLoaded" text="Projects" />
          <CustomLink
            :loading="talentProjectActivityLoading || !isChartProjectsLoaded"
            :text="`All ${dashboardOverview.projects} Projects `"
            to="/projects"
          />
        </div>
        <ProjectMembersChart></ProjectMembersChart>
      </div>
    </section>
    <hr v-if="isCatapultManager && userProjectId" class="mb-4" />
    <section
      v-if="(isCatapultManager && userProjectId) || isProjectAdministrator || isProjectManager"
      class="section gap"
    >
      <div v-if="isCatapultManager && userProjectId">
        <BtnSkeleton class="mb-7" v-if="projectLoading && !projects.length && !isProjectLoaded" />
        <ProjectSelect
          v-if="isCatapultManager && userProjectId && projects && projects.length"
          @input="getProjectOption"
          :options="projects"
        ></ProjectSelect>

        <div v-if="isCatapultManager && userProjectId" class="section margin-none gap">
          <div v-if="!isProjectLoaded || projectLoading || !project" class="section-inner">
            <ProjectCardSkeleton />
          </div>
          <div v-if="project && !projectLoading && isProjectLoaded" class="section-inner">
            <ProtocolCard
              :description="project.description"
              :protocol="project.name"
              :tags="project.tags"
              :bg="project.banner"
              :logo="project.logo"
            />
          </div>
          <div
            v-if="projectOverviewLoading || !dashboardOverviewByProject.length"
            class="short-section cards"
          >
            <StatCardSkeleton size="normal" v-for="i in 3" :key="i" />
          </div>
          <div v-else class="short-section cards">
            <stat-card
              v-for="statCard in dashboardOverviewByProject"
              :="statCard"
              :key="statCard.title"
              :isTimeActive="statCard.title === 'deadlines in 3 days'"
              @click="navigateToElement(statCard)"
              class="cursor-pointer"
            ></stat-card>
          </div>
        </div>
      </div>
      <div v-else-if="isProjectAdministrator || isProjectManager" class="section gap margin-none">
        <div v-if="!isProjectLoaded || projectLoading || !project" class="section-inner">
          <ProjectCardSkeleton />
        </div>
        <div v-if="project && !projectLoading && isProjectLoaded" class="section-inner">
          <ProtocolCard
            :description="project.description"
            :protocol="project.name"
            :tags="project.tags"
            :bg="project.banner"
            :logo="project.logo"
          />
        </div>
        <div
          v-if="projectOverviewLoading || !dashboardOverviewByProject.length"
          class="short-section cards"
        >
          <StatCardSkeleton size="normal" v-for="i in isProjectAdministrator ? 4 : 3" :key="i" />
        </div>
        <div v-else class="short-section cards" :class="{ isProjectManager }">
          <stat-card
            v-for="statCard in dashboardOverviewByProject"
            :="statCard"
            :key="statCard.title"
            :isTimeActive="statCard.title === 'deadlines in 3 days'"
            @click="navigateToElement(statCard)"
            class="cursor-pointer"
          ></stat-card>
        </div>
      </div>
    </section>
    <section v-if="isProjectOwner" class="section gap">
      <ProjectCardSkeleton size="small" v-if="!isProjectLoaded || projectLoading || !project" />
      <ProtocolCard
        v-if="project && !projectLoading && isProjectLoaded"
        type="small"
        :description="project.description"
        :protocol="project.name"
        :tags="project.tags"
        :bg="project.banner"
        :logo="project.logo"
      />
      <div class="overview">
        <div
          v-if="projectOverviewLoading || !dashboardOverviewArray.length"
          class="overview_items owner"
        >
          <StatCardSkeleton size="small" v-for="i in 8" :key="i" />
        </div>
        <div v-else class="overview_items owner">
          <stat-card-small
            v-for="statCard in dashboardOverviewArray"
            :="statCard"
            :key="statCard.title"
            :isActive="statCard.title === 'pending claims'"
            @click="navigateToElement(statCard)"
            class="cursor-pointer"
          ></stat-card-small>
        </div>
      </div>
    </section>
    <section
      v-if="(isCatapultManager && userProjectId) || isProjectOwner || isProjectAdministrator"
      :class="{ gap: isCatapultManager || isProjectOwner || isProjectAdministrator }"
      class="section"
    >
      <div class="overview">
        <div class="section-custom-title">
          <CustomTitle
            :loading="!isChartSocialNetworkDataLoaded"
            text="Social Networks Followers"
          />
        </div>
        <ChartSkeleton
          v-if="
            (socialNetworkChartLoading && !project.id) ||
            (!isChartSocialNetworkDataLoaded && !project.id) ||
            (projectLoading && !project.id)
          "
        />
        <SocialNetworksChart
          v-if="
            (!socialNetworkChartLoading && project.id) ||
            (isChartSocialNetworkDataLoaded && project.id) ||
            (!projectLoading && project.id)
          "
          :projectId="project.id"
        ></SocialNetworksChart>
      </div>
      <div class="short-section">
        <div class="section-custom-title event">
          <CustomTitle :loading="!isEventsLoaded" text="Events" />
          <!--          <base-button-->
          <!--            :loading="eventsLoading && !isEventsLoaded"-->
          <!--            text="Create an Event"-->
          <!--          ></base-button>-->
        </div>
        <CalendarSkeleton v-if="eventsLoading || !isEventsLoaded" />
        <EventsCalendar v-else :events="events" />
      </div>
    </section>
    <section v-if="isProjectOwner" class="section one">
      <div class="section-custom-title">
        <CustomTitle text="USDT Has Been Paid" />
        <CustomLink text="Project Wallet" :to="`/inner-wallet/${userProjectId}`"></CustomLink>
      </div>
      <USDTHasBeenPaidChart />
    </section>
    <section class="section one" v-if="isProjectOwner" id="portal-pending-claims">
      <div class="section-custom-title">
        <CustomTitle :loading="!isPendingClaimsLoaded" text="Pending Claims" />
        <CustomLink
          :loading="pendingClaimsLoading || !isPendingClaimsLoaded"
          :text="`All ${totalPendingClaims ? totalPendingClaims : 0} Claims`"
          @click="
            navigateToElement({ title: 'pending claims', link: `/inner-wallet/${userProjectId}` })
          "
          class="cursor-pointer"
        />
      </div>
      <TableSkeleton v-if="pendingClaimsLoading || !isPendingClaimsLoaded" />
      <BaseTable
        title="You have no payment requests yet"
        icon="icons8-futurama-bender"
        v-else
        :columns="pendingClaimsColumns"
        :rows="pendingClaimsRows.slice(0, 5)"
        pointer
      />
    </section>
    <section v-if="isProjectOwner" class="section gap">
      <div class="short-section">
        <div class="section-custom-title">
          <CustomTitle :loading="!isTopReviewersLoaded" text="Top 5 Reviewers" />
          <CustomLink
            :loading="topReviewersLoading || !isTopReviewersLoaded"
            :text="`All ${topReviewsTotal} Managers`"
            to="/managers"
          />
        </div>
        <TableSkeleton v-if="topReviewersLoading || !isTopReviewersLoaded" />
        <BaseTable
          title="You seem to be the only worker here"
          icon="icons8-futurama-fry"
          v-else
          :columns="reviewColumns"
          :rows="reviewRows.slice(0, 5)"
          pointer
        />
      </div>
      <div class="section-inner">
        <div class="section-custom-title">
          <CustomTitle
            :loading="!isManagersEffectivenessLoaded"
            :text="isSuperAdmin ? 'Talentum Managers Effectiveness' : 'Managers Effectiveness'"
          />
          <base-button
            :loading="!isManagersEffectivenessLoaded"
            text="Invite Manager"
            @click="showInvite = true"
          ></base-button>
        </div>
        <ManagersEffectivenessChart :projectId="project.id"></ManagersEffectivenessChart>
      </div>
    </section>

    <section
      v-if="
        (isCatapultManager && userProjectId) ||
        isProjectOwner ||
        isProjectAdministrator ||
        isProjectManager
      "
      class="section one"
    >
      <div class="section-custom-title">
        <CustomTitle :loading="!isChartTasksLoaded" text="Tasks" />
        <div class="flex gap-2">
          <CustomLink
            :loading="tasksActivityLoading || !isChartTasksLoaded"
            :text="`All ${tasksCount} Tasks`"
            to="/tasks"
          ></CustomLink>
          <TypeTasksSelect
            v-if="!isProjectManager"
            text="Create a Task"
            :handleOpen="handleOpen"
            :isOpenMenu="isOpenMenu"
            :setIsOpenMenu="setIsClearMenu"
            :options="types"
            :reduceLength="14"
          />
        </div>
      </div>
      <ChartSkeleton
        v-if="
          (tasksActivityLoading && !project.id) ||
          (!isChartTasksLoaded && !project.id) ||
          (projectLoading && !project.id)
        "
      />
      <TasksChart
        v-if="
          (!tasksActivityLoading && project.id) ||
          (isChartTasksLoaded && project.id) ||
          (!projectLoading && project.id)
        "
        :projectId="project.id"
      />
    </section>
    <section v-if="isProjectOwner" class="section gap" :class="{ 'non-active': isProjectOwner }">
      <div v-if="isProjectOwner" class="section-inner">
        <div class="section-custom-title">
          <CustomTitle :loading="!isPendingClaimsLoaded" text="Pending Claims" />
          <CustomLink
            :loading="pendingClaimsLoading || !isPendingClaimsLoaded"
            :text="`All ${totalPendingClaims ? totalPendingClaims : 0} Claims`"
            :to="`/inner-wallet/${userProjectId}`"
          />
        </div>
        <TableSkeleton v-if="pendingClaimsLoading || !isPendingClaimsLoaded" />
        <BaseTable
          v-else
          title="You have no payment requests yet"
          icon="icons8-futurama-bender"
          :columns="pendingClaimsColumns"
          :rows="pendingClaimsRows.slice(0, 5)"
          pointer
        />
      </div>
    </section>
    <section v-if="isSuperAdmin" class="section one">
      <div class="section-custom-title">
        <CustomTitle :loading="!isChartAllTasksLoaded" text="All Platform Tasks" />
        <CustomLink
          :loading="allTasksLoading || !isChartAllTasksLoaded"
          :text="`All ${allTasksCount} Tasks `"
          to="/tasks"
        ></CustomLink>
      </div>
      <AllTasksChart />
    </section>
    <section v-if="isProjectManager" class="section gap">
      <div class="section-inner">
        <div class="section-custom-title">
          <CustomTitle :loading="!isPendingReviewsLoaded" text="Pending Reviews" />
        </div>
        <TableSkeleton v-if="pendingReviewsLoading || !isPendingReviewsLoaded" />
        <BaseTable
          title="No task has yet been accomplished"
          icon="icons8-futurama-nibbler"
          v-else
          :columns="pendingReviewColumns"
          :rows="pendingReviewRows"
          pointer
        />
      </div>
      <div class="section-inner">
        <div class="section-custom-title">
          <CustomTitle
            :loading="!isPopularTasksLoaded"
            :text="isProjectManager ? 'Popular Tasks on the Project' : 'Popular Tasks'"
          />
        </div>
        <TableSkeleton v-if="popularTasksLoading || !isPopularTasksLoaded" />
        <BaseTable
          title="It seems your talents have nothing to do"
          icon="icons8-futurama-nibbler"
          v-else
          :columns="popularTasksColumns"
          :rows="popularTasksRows"
          pointer
        />
      </div>
    </section>
    <section v-if="isProjectOwner || isProjectAdministrator">
      <div v-if="isProjectOwner || isProjectAdministrator" class="section one">
        <div class="section-custom-title">
          <CustomTitle :loading="!isPopularTasksLoaded" text="Popular Tasks" />
        </div>

        <TableSkeleton v-if="popularTasksLoading || !isPopularTasksLoaded" />
        <BaseTable
          title="It seems your talents have nothing to do"
          icon="icons8-futurama-nibbler"
          v-else
          :columns="popularTasksColumns"
          :rows="popularTasksRows"
          pointer
        />
      </div>
    </section>
    <section v-if="(!isProjectManager && userProjectId) || isSuperAdmin" class="section gap">
      <div class="short-section">
        <div class="section-custom-title">
          <CustomTitle :loading="!isTopTalentsLoaded" text="Top 3 Talents" />
          <CustomLink
            class="cursor-pointer"
            :loading="topTalentsLoading || !isTopTalentsLoaded"
            text="Leaderboard"
            @click="navigateToElement({ title: 'Top 3 Talents', link: '/leaderboard' })"
          />
        </div>

        <div v-if="topTalentsLoading || !isTopTalentsLoaded" class="talents-cards">
          <TalentCardSkeleton v-for="i in 3" :key="i" />
        </div>
        <div v-else-if="topTalents.length > 0" class="talents-cards">
          <nuxt-link
            v-for="talent in topTalents"
            nuxt-link
            :key="talent.id"
            :to="`talent/${talent.id}`"
          >
            <AmbassadorCard
              :avatar="talent.avatar ? talent.avatar : ''"
              :name="talent.name"
              @click="router.push(`talent/${talent.id}`)"
            >
              <div class="ambassador-badges-wrapper">
                <div v-if="talent.activities && talent.activities.length" class="flex gap-2">
                  <badge
                    v-for="activity in talent.activities.slice(0, 2)"
                    :key="activity.id"
                    :text="activity.activity.name"
                    :type="getBadgeTypeByName(activity.activity.name)"
                  ></badge>
                </div>
                <div v-else>
                  <badge text="No Direction" type="disabled"></badge>
                </div>

                <div class="flex gap-2">
                  <badge :text="talent.level + ' level'" type="transparent"></badge>
                  <badge
                    :text="formatNumberAddComma(talent.total) + ' QP'"
                    type="transparent"
                  ></badge>
                </div>
              </div>
            </AmbassadorCard>
          </nuxt-link>
        </div>
        <div v-else class="w-full">
          <EmptyList
            title="No talent has yet joined you"
            icon="icons8-futurama-nibbler"
            style="height: 424px"
          />
        </div>
      </div>
      <div class="section-inner">
        <div class="section-custom-title">
          <CustomTitle :loading="!isTalentActivityLoaded" text="Talents Activity" />
          <CustomLink
            class="cursor-pointer"
            :loading="talentActivityLoading || !isTalentActivityLoaded"
            :text="`All ${talentsCount} Talents`"
            @click="navigateToElement({ title: 'all n talents', link: '/leaderboard' })"
          />
        </div>
        <TalentsActivityChart />
      </div>
    </section>

    <div v-if="isSuperAdmin">
      <section class="section one">
        <div class="section-custom-title" id="usdtpaid-block">
          <CustomTitle text="USDT Has Been Paid" />
          <CustomLink text="All 234 Claims" :to="`/inner-wallet/${userProjectId}`"></CustomLink>
        </div>
        <USDTHasBeenPaidChart :dates-chars="datesChars" />
      </section>
    </div>
  </div>
  <BaseModal
    :width="600"
    :top="10"
    :rightCustom="10"
    :bottom="10"
    customHeight="auto"
    @close="handleClose($event)"
    :visible="visible"
    btnLeft
    @openConfirmationModal="isConfirmModalOpen = true"
    isConfirm
  >
    <CreateTask :typeTask="typeTask" @close="handleClose(false)" />
  </BaseModal>
  <BaseModal
    isCloseBtnInvisible
    :width="480"
    customHeight="248px"
    @close="handleCloseConfirm($event)"
    :visible="isConfirmModalOpen"
  >
    <div class="confirm-modal">
      <div class="confirm-modal_title">Rejection of the Task Creation</div>
      <div class="confirm-modal_subtitle">
        Confirm that this decision if you dont want to complete the creation
      </div>

      <div class="confirm-modal_btns-wrapper">
        <BaseButton text="Cancel" type="secondary" @click="handleCloseConfirm(false)" />
        <BaseButton
          text="Reject"
          type="normal"
          @click="
            handleCloseConfirm(false);
            handleClose(false);
          "
        />
      </div>
    </div>
  </BaseModal>
  <BaseModal
    custom-height="95%"
    top="16"
    right-custom="16"
    :width="600"
    @close="projectCreateWindow = !projectCreateWindow"
    :visible="projectCreateWindow"
    btn-left
    @openConfirmationModal="isConfirmModalOpenProject = true"
    is-confirm
    bodyClasses="fullHeight"
  >
    <CreateProject @close="projectCreateWindow = !projectCreateWindow" />
  </BaseModal>
  <BaseModal
    isCloseBtnInvisible
    :width="480"
    customHeight="248px"
    @close="isConfirmModalOpenProject = false"
    :visible="isConfirmModalOpenProject"
  >
    <div class="confirm-modal">
      <div class="confirm-modal_title">Rejection of the Project Creation</div>
      <div class="confirm-modal_subtitle">
        Confirm that this decision if you dont want to complete the creation
      </div>

      <div class="confirm-modal_btns-wrapper">
        <BaseButton text="Cancel" type="secondary" @click="isConfirmModalOpenProject = false" />
        <BaseButton
          text="Reject"
          type="normal"
          @click="
            isConfirmModalOpenProject = false;
            projectCreateWindow = false;
          "
        />
      </div>
    </div>
  </BaseModal>

  <InviteNewManagerInProject
    :project="{ name: project.name, id: project.id }"
    v-if="showInvite && !isSuperAdmin && project"
    @close="showInvite = false"
  />
  <InviteToProjectNewManager v-if="showInvite && isSuperAdmin" @close="showInvite = false" />
  <Loader v-if="isScrennshotLoading" />
</template>

<script setup>
import { useRequestsStore } from '~/store/requests';
import { useUserStore } from '~/store/user';
import { useEventsStore } from '~/store/events';
import { useDashboardStore } from '~/store/dashboard';
import { useTasksStore } from '~/store/tasks';
import { useProjectsStore } from '~/store/projects';
import { useTopStore } from '~/store/top';
import { useTalentsStore } from '~/store/talents';
import { usePendingClaimsStore } from '~/store/pendingClaims';
import { inject, computed, onMounted, nextTick, ref } from 'vue';
import { useAuthStore } from '~/store/auth';
import {
  formatFutureDate,
  formatPastDate,
  formatDate,
  getBadgeTypeByName,
  formatNumber,
  formatNumberMore10K,
  formatNumberAddComma,
  getLinkPathByName,
  timestampToString,
} from '@/util/helpers';
import { OVERVIEWS_BY_ROLE, OVERVIEWS_BY_PROJECT, OVERVIEW_TITLES } from '@/constants/overviews';
import { useManagersStore } from '~/store/managers';
import EmptyList from '../components/EmptyList';
import SocialNetworksChart from '../components/ChartBlocks/SocialNetworksChart';
import TasksChart from '../components/ChartBlocks/TasksChart';
import AllTasksChart from '../components/ChartBlocks/AllTasksChart';
import ProjectMembersChart from '../components/ChartBlocks/ProjectMembersChart';
import BaseButton from '~/components/BaseButton.vue';
import TrasferPendingClaimBtn from '~/components/InnerWallet/TrasferPendingClaimBtn.vue';
import { LEVELUP_STATE } from '~/constants/levelup';
import { useAssetsStore } from '~/store';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import downloadIcon from '@/assets/icons/Download.svg';
import html2pdf from 'html2pdf.js';

const asset = useAssetsStore();

const isConfirmModalOpen = ref(false);
const projectCreateWindow = ref(false);
const visible = ref(false);
const isConfirmModalOpenProject = ref(false);
const handleClose = (value) => {
  visible.value = value;
};
const showInvite = ref(false);
const isScrennshotLoading = ref(false);
const index = ref(null);
const loading = ref(false);
const typeTask = ref(false);
const pageScreenToPdf = () => {
  loading.value = true;
  const style = document.createElement('style');
  document.head.appendChild(style);
  style.sheet?.insertRule('body > div:last-child img { display: inline-block; }');

  html2pdf(index.value, {
    filename: 'dashboard.pdf',
    image: { type: 'png', quality: 1 },
    enableLinks: false,
    pagebreak: { mode: 'css' },
    html2canvas: { dpi: 96, letterRendering: false, scale: 2, allowTaint: false, useCORS: true },
    jsPDF: { format: 'a2', orientation: 'p', unit: 'mm' },
  }).then(() => {
    style.remove();
    loading.value = false;
  });
};

const handleCloseConfirm = (value) => {
  isConfirmModalOpen.value = value;
};
const router = useRouter();

const handleOpen = (value, type) => {
  typeTask.value = type;
  visible.value = value;
};

const types = [
  {
    name: 'Regular Task',
    label: 'Regular',
    id: 'regular',
  },
  {
    name: 'On-Chain Task',
    label: 'On-Chain',
    id: 'on-chain',
  },
];

onMounted(() => {
  asset.getRolesAction();

  // if (isProjectOwner.value) {
  //   if (typeof window !== 'undefined' && getMetamaskProvider()) {
  //     getMetamaskProvider().on('accountsChanged', async (address) => {
  //       console.log('accountsChanged', address);
  //     });

  //     getMetamaskProvider().on('chainChanged', async (chainId) => {
  //       console.log('chainChanged', chainId);
  //     });
  //   }
  // }

  if (!isProjectManager.value) {
    // eventsStore.getEventsAction();
    if (!isCatapultManager.value && !isSuperAdmin.value && userProjectId.value) {
      topStore.getTopTalentsAction(userProjectId.value);
    }
  }

  if (
    !isSuperAdmin.value &&
    !isCatapultManager.value &&
    !isProjectManager.value &&
    userProjectId.value
  ) {
    eventsStore.getEventsAction(userProjectId.value);
  }

  if (isCatapultManager.value) {
    projectsStore.getProjectsAction();
    requestsStore.getRequestsAction({
      page: 1,
      levelupDirectionToggle: LEVELUP_STATE.level_up,
      dashboard: true,
    });
  }

  if (
    (isProjectAdministrator.value && userProjectId.value) ||
    (isProjectManager.value && userProjectId.value)
  ) {
    projectsStore.getProjectOverviewAction(userProjectId.value);
  }

  dashboardStore.getDashboardOverviewAction();

  pendingClaimsStore.getPendingClaimsAction(userProjectId.value || null);
  if (isSuperAdmin.value) {
    eventsStore.getEventsAction();
    dashboardStore.getDashboardAction();
    tasksStore.getPopularTasksAction();
    topStore.getTopTalentsAction();
    requestsStore.getRequestsAction({
      page: 1,
      levelupDirectionToggle: LEVELUP_STATE.level_up,
      dashboard: true,
    });
  }
  topStore.getTopReviewersAction();
  console.log('userProjectId.value', userProjectId.value);
  if (!isSuperAdmin.value && userProjectId.value) {
    // if (!isCatapultManager.value && !isSuperAdmin.value && userProjectId.value) {
    projectsStore.getProjectAction(userProjectId.value);
    tasksStore.getPopularTasksAction(userProjectId.value);
    projectsStore.getPendingReviewsAction(userProjectId.value);
  }
});
const convertDashboardOverview = (obj) => {
  return Object.keys(obj).map((key) => ({ title: key, value: obj[key] }));
};
const createEvent = () => {
  eventsStore.createEventAction();
};
const getTalentsActivity = async () => {
  await talentsStore.getTalentActivityAction(period.value);
};
const getProjectOption = (project) => {
  if (project && project.id) {
    tasksStore.getPopularTasksAction(project.id);
    topStore.getTopTalentsAction(project.id);
    projectsStore.getProjectOverviewAction(project.id);
    projectsStore.getProjectAction(project.id);
    projectsStore.getPendingReviewsAction(project.id);
    eventsStore.getEventsAction(project.id);
  }
};
const managersStore = useManagersStore();
const authStore = useAuthStore();
const eventsStore = useEventsStore();
const userStore = useUserStore();
const dashboardStore = useDashboardStore();
const topStore = useTopStore();
const tasksStore = useTasksStore();
const projectsStore = useProjectsStore();
const pendingClaimsStore = usePendingClaimsStore();
const talentsStore = useTalentsStore();
const requestsStore = useRequestsStore();
const nuxtApp = useNuxtApp();

const allTasksLoading = computed(() => projectsStore.getAllTasksChartLoading);
const isChartAllTasksLoaded = computed(() => projectsStore.getIsChartAllTasksLoaded);
const tasksActivityLoading = computed(() => projectsStore.getTasksChartLoading);
const isChartTasksLoaded = computed(() => projectsStore.getIsChartTasksLoaded);
const socialNetworkChartLoading = computed(() => projectsStore.getSocialNetworkChartLoading);
const isChartSocialNetworkDataLoaded = computed(
  () => projectsStore.getIsChartSocialNetworkDataLoaded,
);
const talentProjectActivityLoading = computed(() => projectsStore.getProjectsMembersChartLoading);
const isChartProjectsLoaded = computed(() => projectsStore.getIsChartProjectsLoaded);
const talentActivityLoading = computed(() => talentsStore.getTalentActivityLoading);
const isTalentActivityLoaded = computed(() => talentsStore.getIsTalentActivityLoaded);
const chartDataLoading = computed(() => projectsStore.getChartDataLoading);
const projectsCount = computed(() => projectsStore.getProjectsChart.total);
const talentsCount = computed(() => talentsStore.getTalentActivity.total);
const allTasksCount = computed(() => projectsStore.getAllTasksChart.total);
const tasksCount = computed(() => projectsStore.getTasksChart.total);
const isChartDataLoaded = computed(() => projectsStore.getIsChartDataLoaded);
const managersEffectivenessLoading = computed(() => managersStore.getManagersEffectivenessLoading);
const isManagersEffectivenessLoaded = computed(
  () => managersStore.getIsManagersEffectivenessLoaded,
);
const userProjectId = computed(() => userStore.getUserProjectId);
const levelUpRequests = computed(() => requestsStore.getRequests);
const levelUpRequestsLoading = computed(() => requestsStore.getRequestsLoading);
const isLevelUpRequestsLoaded = computed(() => requestsStore.getRequestsLoaded);
const projectOverview = computed(() => projectsStore.getProjectOverview);
const projectOverviewLoading = computed(() => projectsStore.getProjectOverviewLoading);
const getIsProjectOverviewLoaded = computed(() => projectsStore.getIsProjectOverviewLoaded);
const user = computed(() => userStore.getUser);
const events = computed(() => eventsStore.getEvents);
const eventsLoading = computed(() => eventsStore.getEventsLoading);
const isEventsLoaded = computed(() => eventsStore.getIsEventsLoaded);
const role = computed(() => {
  const userRoles = userStore.userRoles;
  if (userRoles && userRoles.length && userRoles[0].name) {
    return userRoles[0].name;
  }
  return null;
});
const pendingClaims = computed(() => pendingClaimsStore.getPendingClaims);
const pendingClaimsLoading = computed(() => pendingClaimsStore.getPendingClaimsLoading);
const isPendingClaimsLoaded = computed(() => pendingClaimsStore.getIsPendingClaimsLoaded);
const dashboard = computed(() => dashboardStore.getDashboard);
const dashboardOverview = computed(() => dashboardStore.getDashboardOverview);
const dashboardOverviewByProject = computed(() => {
  if (role) {
    const overviews = convertDashboardOverview(projectsStore.getProjectOverview)
      .filter((item) =>
        OVERVIEWS_BY_PROJECT[role.value].some((overview) => overview === item.title),
      )
      .sort((a, b) => {
        const aIndex = OVERVIEWS_BY_PROJECT[role.value].indexOf(a.title);
        const bIndex = OVERVIEWS_BY_PROJECT[role.value].indexOf(b.title);
        return aIndex - bIndex;
      })
      .map((item) => {
        if (OVERVIEW_TITLES[item.title]) {
          item.title = OVERVIEW_TITLES[item.title];
        }
        item.link = getLinkPathByName(item.title);

        return item;
      });
    return overviews;
  } else {
    return [];
  }
});
const dashboardOverviewArray = computed(() => {
  if (role) {
    const managersOverdueValue = dashboardStore.getDashboardOverview.overdueManagerTasks;

    const overviews = convertDashboardOverview(dashboardStore.getDashboardOverview)
      .map((item) => {
        if (item.title === 'overdueTasks') item.value = +item.value + managersOverdueValue;
        return item;
      })
      .filter((item) => OVERVIEWS_BY_ROLE[role.value].some((overview) => overview === item.title))
      .sort((a, b) => {
        const aIndex = OVERVIEWS_BY_ROLE[role.value].indexOf(a.title);
        const bIndex = OVERVIEWS_BY_ROLE[role.value].indexOf(b.title);
        return aIndex - bIndex;
      })
      .map((item) => {
        if (OVERVIEW_TITLES[item.title]) {
          item.title = OVERVIEW_TITLES[item.title];
        }
        if (role.value == 'Super Admin' && item.title === 'overdue tasks') {
          item.title = 'overdue';
        }
        item.link = getLinkPathByName(item.title);
        return item;
      });
    return overviews;
  } else {
    return [];
  }
});
const topTalents = computed(() => topStore.getTopTalents);
const topTalentsLoading = computed(() => topStore.getTopTalentsLoading);
const isTopTalentsLoaded = computed(() => topStore.getIsTopTalentsLoaded);
const topReviews = computed(() => topStore.getTopReviewers);
const topReviewsTotal = computed(() => topStore.getTopReviewers.total);
const topReviewersLoading = computed(() => topStore.getTopReviewersLoading);
const isTopReviewersLoaded = computed(() => topStore.getIsTopReviewersLoaded);
const popularTasks = computed(() => tasksStore.getPopularTasks);
const popularTasksLoading = computed(() => tasksStore.getPopularTasksLoading);
const isPopularTasksLoaded = computed(() => tasksStore.getIsPopularTasksLoaded);
const pendingReviews = computed(() => projectsStore.getPendingReviews);
const projects = computed(() => projectsStore.getProjects);
const projectsLoading = computed(() => projectsStore.getLoading);
const projectLoading = computed(() => projectsStore.getProjectLoading);
const isProjectLoaded = computed(() => projectsStore.getIsProjectLoaded);
const pendingReviewsLoading = computed(() => projectsStore.getPendingReviewsLoading);
const isPendingReviewsLoaded = computed(() => projectsStore.getIsPendingReviewsLoaded);
const talentsActivity = computed(() => talentsStore.getTalentActivity);
const project = computed(() => {
  console.log('projectsStore.getProject', projectsStore.getProject);
  // return { name: projectsStore.getProject.name, id: projectsStore.getProject.id };
  return projectsStore.getProject;
});
const reviewRows = computed(() => {
  const originalArray = topStore.getTopReviewers.data;
  if (!originalArray || (originalArray && !originalArray.length)) {
    return [];
  }
  return originalArray.map((item, i) => {
    return {
      to: `manager/${item.id}`,
      id: {
        component: Badge,
        props: {
          text: (i + 1).toString(),
          value: '',
          type: 'rounded',
          big: false,
        },
      },
      manager: { content: item.name, reduceLength: 10 },
      reviewed: formatNumberMore10K(+item.reviewed.toString()),
      overdue: formatNumberMore10K(item.overdue),
    };
  });
});
const popularTasksRows = computed(() => {
  const originalArray = tasksStore.getPopularTasks;
  console.log('popularTasksRows originalArray', originalArray);
  if (!originalArray.length) {
    return [];
  }
  return originalArray.map((item) => {
    return {
      to: `tasks/task/${item.id}`,
      task: {
        content: item.name,
        reduceLength: isCatapultManager.value || isProjectManager.value ? 33 : false,
      },
      project: {
        component: Talent,
        props: {
          text: item.project ? item.project.name : '',
          img: item.project ? item.project.logo : defaultBg,
          square: true,
        },
      },
      direction: {
        component: Badge,
        props: {
          text: item.activity ? item.activity.name : 'All',
          value: '',
          type: getBadgeTypeByName(item.activity ? item.activity.name : 'All'),
          big: false,
        },
      },
      deadline: {
        component: Badge,
        props: {
          text: formatDate(timestampToString(item.deadline)),
          value: '',
          type: 'transparent',
          big: false,
          futureDate: timestampToString(item.deadline),
        },
      },
      time: formatNumber(item.times_completed),
    };
  });
});
const pendingReviewRows = computed(
  () => {
    const originalArray = pendingReviews.value;
    if (!originalArray || (originalArray && !originalArray.length)) {
      return [];
    }
    return originalArray.map((item) => {
      return {
        to: `tasks/task/${item.task.id}`,
        task: { content: item.task.name, reduceLength: 23 },
        img: {
          component: Talent,
          props: {
            img: item.ambassador.avatar ? item.ambassador.avatar : defaultBg,
            isText: false,
          },
        },
        direction: {
          component: Badge,
          props: {
            text: item.task.activity ? item.task.activity.name : 'All',
            value: '',
            type: getBadgeTypeByName(item.task.activity ? item.task.activity.name : 'All'),
            big: false,
          },
        },
        deadline: {
          component: Badge,
          props: {
            text: formatFutureDate(item.task.ended_at),
            value: '',
            type: 'transparent',
            big: false,
            futureHours: item.task.ended_at,
          },
          adjustReturnBtn: item.returned,
        },
        priority: {
          component: Priority,
          props: {
            dots: item.task.priority,
          },
        },
      };
    });
  },
  { dependsOn: [pendingReviews] },
);
const totalPendingClaims = computed(() => pendingClaimsStore.getPendingClaims.total);
const pendingClaimsRows = computed(() => {
  const originalArray = pendingClaimsStore.getPendingClaims.data;
  if (!originalArray || (originalArray && !originalArray.length)) {
    return [];
  }
  return originalArray.map((item, index) => {
    return {
      to: `/inner-wallet/${item.project_id}?status=2`,
      talent: {
        component: Talent,
        props: {
          text: item.ambassador.name,
          img: item.ambassador.avatar ? item.ambassador.avatar : defaultBg,
        },
      },
      waiting: {
        component: Badge,
        props: {
          text: formatPastDate(item.created_at),
          value: '',
          type: 'transparent',
          big: false,
          pastDate: item.created_at,
        },
      },
      amount: {
        component: Amount,
        props: {
          amount: item.amount,
          currency: item.coin_type.symbol.toLowerCase(),
        },
      },
      blockchain: {
        component: Badge,
        props: {
          text: item.coin_type.blockchain.name ? item.coin_type.blockchain.name : 'Ethereum',
          value: '',
          type: 'transparent',
          big: false,
        },
      },
      btn: {
        component: TrasferPendingClaimBtn,
        props: {
          itemId: item.id,
          itemChainId: item.coin_type.blockchain.chain_id,
          index: index + 1,
          tokenAddress: item.coin_type.address,
          walletData: [
            {
              wallet: item.address,
              amount: item.amount,
              currency: item.coin_type.symbol.toLowerCase(),
              name: item.ambassador && item.ambassador.name ? item.ambassador.name : '',
              img: item.ambassador && item.ambassador.avatar ? item.ambassador.avatar : defaultBg,
              id: item.id,
            },
          ],
        },
      },
    };
  });
});
const totalLevelsUp = computed(() => requestsStore.getRequests?.total);
const levelRows = computed(() => {
  const originalArray = requestsStore.getRequests.data;
  if (!originalArray || (originalArray && !originalArray.length)) {
    return [];
  }
  return originalArray.map((item) => {
    return {
      to: `talent/${item.id}`,
      talent: {
        component: Talent,
        props: {
          text: item.name,
          img: item.avatar ? item.avatar : defaultBg,
        },
      },
      waiting: {
        component: Badge,
        props: {
          text: formatPastDate(item.level_up_request_at),
          value: '',
          type: 'transparent',
          big: false,
          pastDate: item.level_up_request_at,
        },
      },
      level: { content: item.current_level, adjust: true },
      up_to: { content: item.next_level, adjust: true },
      btn: {
        component: BaseButton,
        props: {
          id: item.id,
          text: 'Level Up',
          type: 'level',
        },
      },
    };
  });
});

const datesChars = [
  { title: 'D', id: 'd' },
  { title: 'W', id: 'w' },
  { title: 'M', id: 'm' },
  { title: 'Q', id: 'm3' },
  { title: 'Y', id: 'y' },
];
const popularTasksColumns = computed(() => {
  if (isSuperAdmin.value) {
    return [
      { prop: 'task', label: 'Task', width: '150%' },
      {
        prop: 'project',
        label: 'Project',
        disabled: isSuperAdmin ? false : true,
        width: '80%',
      },
      {
        prop: 'direction',
        label: 'Direction',
        width: '60%',
      },
      {
        prop: 'deadline',
        label: 'Deadline',
        disabled: isSuperAdmin ? false : true,
        width: '60%',
      },
      { prop: 'time', label: 'Times Completed', justify: 'right', width: '30%' },
    ];
  } else if (isProjectOwner.value || isProjectAdministrator.value) {
    return [
      { prop: 'task', label: 'Task', width: '150%' },
      {
        prop: 'direction',
        label: 'Direction',
        width: '80%',
      },
      {
        prop: 'deadline',
        label: 'Deadline',
        disabled: isSuperAdmin ? false : true,
        width: '40%',
      },
      { prop: 'time', label: 'Times Completed', justify: 'right', width: '50%' },
    ];
  } else {
    return [
      { prop: 'task', label: 'Task', width: '160%' },
      {
        prop: 'direction',
        label: 'Direction',
        width: '80%',
      },
      { prop: 'time', label: 'Times Completed', justify: 'right', width: '30%' },
    ];
  }
});

const pendingClaimsColumns = computed(() => {
  if (isSuperAdmin.value) {
    return [
      { prop: 'talent', label: 'Talent', width: '150%' },
      {
        prop: 'waiting',
        label: 'Waiting',
        width: '50%',
      },
      { prop: 'amount', label: 'Amount', width: '150%' },
    ];
  } else if (isProjectOwner.value) {
    return [
      { prop: 'talent', label: 'Talent', width: '150%' },
      {
        prop: 'waiting',
        label: 'Waiting',
        width: '50%',
      },
      { prop: 'blockchain', label: 'Blockchain', width: '50%' },
      { prop: 'amount', label: 'Amount', width: '50%' },
      { prop: 'btn', label: '', width: '50%', justify: 'right' },
    ];
  } else {
    return [
      { prop: 'talent', label: 'Talent' },
      {
        prop: 'waiting',
        label: 'Waiting',
      },
      { prop: 'amount', label: 'Amount' },
    ];
  }
});

const pendingReviewColumns = [
  { prop: 'task', label: 'Task', width: '160%' },
  { prop: 'img', label: '', width: '50%' },
  {
    prop: 'direction',
    label: 'Direction',
    width: '100%',
  },
  { prop: 'deadline', label: 'Deadline in', width: '70%' },
  {
    prop: 'priority',
    label: 'Priority',
    width: '30%',
  },
];

const roles = inject('roles');

const navigateToElement = (statCard) => {
  let user = userStore.getUser;
  let title = statCard.title.toLowerCase();

  if (title === 'usdt paid' && isSuperAdmin.value) {
    let scrollDiv = document.getElementById('usdtpaid-block').offsetTop;
    scrollTo({ top: scrollDiv, behavior: 'smooth' });
  } else if (title === 'pending claims' && isProjectManager.value) {
    let scrollDiv = document.getElementById('usdtpaid-block').offsetTop;
    scrollTo({ top: scrollDiv, behavior: 'smooth' });
  } else if (title === 'pending directions') {
    router.push({
      path: `/requests`,
      query: { status: 1 },
    });
  } else if (title === 'usdt paid' && isProjectOwner.value) {
    router.push({
      path: `/inner-wallet/${user.projects[0].id}`,
      query: { status: 1 },
    });
  } else if (title === 'pending claims' && isProjectOwner.value) {
    router.push({
      path: `/inner-wallet/${user.projects[0].id}`,
      query: { status: 2 },
    });
  } else if (title === 'on revision' || title === 'deadlines in 3 days') {
    router.push({
      path: '/tasks',
      query: { status: 'on_revision' },
    });
  } else if (title === 'reviewed tasks') {
    router.push({
      path: '/tasks',
      query: { status: 'done' },
    });
  } else if (title === 'overdue tasks' || title === 'overdue') {
    router.push({
      path: '/tasks',
      query: { status: 'overdue_by_manager' },
    });
  } else if (
    (title === 'talents' || title === 'active talents' || title === 'all n talents') &&
    (isProjectOwner.value || isProjectAdministrator.value)
  ) {
    router.push({
      path: '/leaderboard',
      query: { status: 'my_projects' },
    });
  } else if (title === 'top 3 talents') {
    router.push({
      path: '/leaderboard',
      query: { status: 'leaderboard_my_projects' },
    });
  } else {
    router.push(statCard.link);
  }
};

const levelupRequest = async (id) => {
  const levelupDirectionToggle = {
    value: 'level-up',
  };
  const res = await requestsStore.levelupRequestAction({
    id,
    levelupDirectionToggle,
  });
  const { status } = res;
  if (status !== 204) {
    let { message } = res.response.data;
    nuxtApp.$alert.show(message, {
      type: 'error',
      timeout: 1000,
    });
  } else {
    nuxtApp.$alert.show('You have successfully increased the level of a talent', {
      type: 'success',
      timeout: 1000,
    });
    await requestsStore.getRequestsAction({
      page: 1,
      levelupDirectionToggle: LEVELUP_STATE.level_up,
      dashboard: true,
    });
  }
};

const options = ['1', '2', '3'];

const {
  isProjectOwner,
  isSuperAdmin,
  isProjectAdministrator,
  isAdminSupport,
  isProjectManager,
  isCatapultManager,
} = roles;
</script>

<script>
import Badge from '@/components/Badge.vue';
import Priority from '@/components/Priority/Priority.vue';
import Talent from '@/components/Talent.vue';
import Amount from '@/components/Amount.vue';
import BaseLineChart from '@/components/BaseLineChart';
import defaultBg from '@/assets/images/default-avatar.png';
import { getMetamaskProvider } from '~/util/web3';

export default {
  name: 'index',
  components: {
    BaseLineChart,
    Badge,
    Talent,
    Amount,
    BaseButton,
    Priority,
  },
  layout: 'app',
  data() {
    return {
      statCards: [
        {
          title: 'projects',
          value: '312',
        },
        {
          title: 'talents',
          value: '1,555',
        },
        {
          title: 'managers',
          value: '649',
        },
        {
          title: 'USDT paid',
          value: '10.9K',
        },
        {
          title: 'pending claims',
          value: '234',
        },
        {
          title: 'pending directions',
          value: '200',
        },
        {
          title: 'reviewed tasks',
          value: '2',
        },
        {
          title: '405',
          value: 'overdue tasks',
        },
      ],
      reviewColumns: [
        { prop: 'id', label: '#', width: '50%' },
        {
          prop: 'manager',
          label: 'Manager',
        },
        { prop: 'reviewed', label: 'Reviewed', justify: 'right', width: '70%' },
        {
          prop: 'overdue',
          label: 'Overdue',
          justify: 'right',
          width: '70%',
        },
      ],
      columns: [
        { prop: 'name', label: 'Name' },
        {
          prop: 'age',
          label: 'Age',
          width: '50%',
        },
        { prop: 'email', label: 'Email', justify: 'left', width: '150%' },
        {
          prop: 'test',
          label: 'sdivnFSUNouvn',
          justify: 'right',
        },
      ],
      rows: [
        {
          name: 'John Doe',
          age: 30,
          email: 'john.doe@example.com',
          test: {
            component: Badge,
            props: {
              text: '3qsfe',
              value: 'sfv',
              type: 'danger',
              big: false,
            },
          },
        },
        {
          name: 'John Doe',
          age: 30,
          email: 'john.doe@example.com',
          test: {
            component: Badge,
            props: {
              text: '3qsfe',
              value: 'sfv',
              type: 'danger',
              big: false,
            },
          },
        },
        {
          name: 'Jane Doe',
          age: 25,
          email: 'jane.doe@example.com',
          test: {
            component: Badge,
            props: {
              text: '3qsfe',
              value: 'sfv',
              type: 'danger',
              big: false,
            },
          },
        },
        {
          name: 'Jane Doe',
          age: 25,
          email: 'jane.doe@example.com',
          test: {
            component: Badge,
            props: {
              text: '3qsfe',
              value: 'sfv',
              type: 'danger',
              big: false,
            },
          },
        },
        {
          name: 'Jane Doe',
          age: 25,
          email: 'jane.doe@example.com',
          test: {
            component: Badge,
            props: {
              text: '3qsfe',
              value: 'sfv',
              type: 'danger',
              big: false,
            },
          },
        },
      ],
      levelColumns: [
        { prop: 'talent', label: 'Talent', width: '150%' },
        {
          prop: 'waiting',
          label: 'Waiting',
          width: '50%',
        },
        { prop: 'level', label: 'Current Level', width: '50%', justify: 'right' },
        { prop: 'up_to', label: 'Up to', width: '50%', justify: 'right' },
        { prop: 'btn', label: '', width: '70%', justify: 'right' },
      ],
    };
  },
  methods: {
    capitalize(str) {
      let words = str.split(' ');
      for (let i = 0; i < words.length; i++) {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
      }
      return words.join(' ');
    },
  },
};
</script>

<style scoped lang="scss">
.export-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 8px;
  cursor: pointer;
  padding: 4px 8px;
  height: fit-content;
  span {
    color: $default;
    font-variant-numeric: slashed-zero;
    font-family: Basis Grotesque Pro;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
  }
  &:hover {
    border-radius: 8px;
    background: $default-badge-border;
  }
}
.confirm-modal {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 32px;
  gap: 24px;
  &_title {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 24px;
    line-height: 40px;
    color: $section-title;
  }
  &_subtitle {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    display: flex;
    align-items: center;
    text-align: center;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $section-title;
  }
  &_btns-wrapper {
    width: 100%;
    display: flex;
    gap: 24px;
  }
}
.main-title {
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 350;
  font-size: 56px;
  line-height: 72px;
  color: $section-title;
}
.section-inner {
  width: 100%;
  &-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.section {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 1160px;
  margin: 0 auto;
  margin-bottom: 48px;
  &.margin-none {
    margin: 0;
  }
  &.gap {
    gap: 40px;
  }
  &.one {
    flex-direction: column;
  }
  &.non-active {
    display: none !important;
  }
  @media (max-width: 1300px) {
    flex-direction: column;
    gap: 30px;
  }
}
.section-custom-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  width: 100%;
}
.btns_wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}
.overview {
  width: 100%;
  max-width: 800px;
}
.overview_items {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding-top: 10px;
  &.talent {
    padding-top: 0;
  }
  &.owner {
    padding-top: 0;
    justify-content: space-between;
  }
}
.short-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 360px;
  &.isProjectManager {
    align-items: flex-start;
  }
  &.cards {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 16px;
    // margin-top: 80px;
  }
  &.event {
    gap: 10px;
  }
}
.talents-cards {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.controler {
  margin-bottom: 24px;
}

.loader {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  position: relative;
  animation: rotate 1s linear infinite;
}
.loader::before {
  content: '';
  box-sizing: border-box;
  position: absolute;
  inset: 0px;
  border-radius: 50%;
  border: 2px solid $default;
  animation: prixClipFix 2s linear infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes prixClipFix {
  0% {
    clip-path: polygon(50% 50%, 0 0, 0 0, 0 0, 0 0, 0 0);
  }
  25% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 0, 100% 0, 100% 0);
  }
  50% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 100% 100%, 100% 100%);
  }
  75% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 100%);
  }
  100% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 0);
  }
}
</style>
