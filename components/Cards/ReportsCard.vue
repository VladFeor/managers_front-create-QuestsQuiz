<template>
  <div v-if="reports && reports.length" class="reports-card">
    <div class="reports-card_header mb-[24px]">
      <div class="reports-card-title">Reports</div>
      <div class="check-btn_wrapper">
        <div class="check-btn_title">Full</div>
        <Switch @checked="setIsFullActive" :checkedProp="isFullActive" type="small" />
      </div>
    </div>

    <div v-if="isFullActive && created" class="reports-card_inner min">
      <div class="reports-card_inner_header">
        <div class="reports-card_inner-title">Task Created</div>
        <div class="reports-card_inner-date">{{ formatDate(created) }}</div>
      </div>
    </div>
    <div v-if="pendingReport && isFullActive" class="report-step-icon w-full">
      <Icon class="icon" name="Right-Arrow" :size="24" />
    </div>
    <div v-if="pendingReport" class="reports-card_inner">
      <div class="reports-card_inner_header">
        <div class="reports-card_inner-title">Sent for Review</div>
        <div class="reports-card_inner-date">
          {{ pendingReport.created_at ? formatDate(pendingReport.created_at) : '' }}
        </div>
      </div>
      <div v-if="pendingReport.userable" class="reports-card_inner_user">
        <Talent
          @click="goToProfile(pendingReport.userable.id)"
          :text="pendingReport.userable.name ? pendingReport.userable.name : ''"
          :img="pendingReport.userable.avatar ? pendingReport.userable.avatar : ''"
        />
      </div>
      <div v-if="pendingReport.comment" class="reports-card_inner_desc">
        {{ pendingReport.comment ? pendingReport.comment : '' }}
      </div>
      <div class="reports-card_inner_link-btns">
        <div v-if="pendingReport.link" class="reports-card_inner_link-btn">
          <a :href="pendingReport.link" target="_blank" class="reports-card_inner_link-btn_inner">
            <Icon name="Insert-Link" :size="24" />{{ reduceStringLength(pendingReport.link, 20) }}
          </a>
        </div>
        <div v-for="file in pendingReport.files" :key="file.id" class="reports-card_inner_link-btn">
          <a
            :href="file.url"
            target="_blank"
            class="reports-card_inner_link-btn_inner"
            v-if="isPdf(file)"
          >
            <Icon name="Copy" :size="24" />{{
              reduceStringLength(file.name ? file.name : 'file name', 20)
            }}
          </a>

          <div class="reports-card_inner_link-btn_inner" v-else @click="zoomInImage(file.url)">
            <Icon name="Copy" :size="24" />{{ reduceStringLength(file.url, 20) }}
          </div>
        </div>
      </div>
    </div>
    <div v-if="isFullActive && revisionReport" class="report-step-icon w-full">
      <Icon class="icon" name="Right-Arrow" :size="24" />
    </div>
    <div v-if="isFullActive && revisionReport" class="reports-card_inner min">
      <div class="reports-card_inner_header">
        <div class="reports-card_inner-title">Taken on Revision</div>
        <div class="reports-card_inner-date">{{ formatDate(revisionReport.created_at) }}</div>
      </div>
    </div>

    <div v-if="returnedReports && returnedReports.length" class="reports-card_inner_wrapper">
      <div v-for="(returnedReport, i) in reportsFiltered" :key="i">
        <div class="report-step-icon">
          <Icon class="icon" name="Right-Arrow" :size="24" />
        </div>
        <div class="reports-card_inner min">
          <div class="reports-card_inner_header">
            <div class="reports-card_inner-title">
              {{
                returnedReport.status === 'resent_for_review'
                  ? 'Recent for Review'
                  : 'Returned for Rework'
              }}
            </div>
            <div class="reports-card_inner-date">{{ formatDate(returnedReport.created_at) }}</div>
          </div>
          <div v-if="returnedReport.userable" class="reports-card_inner_user">
            <Talent
              @click="returnedReport(pendingReport.userable.id)"
              :text="returnedReport.userable.name ? returnedReport.userable.name : ''"
              :img="returnedReport.userable.avatar ? returnedReport.userable.avatar : ''"
            />
          </div>
          <div v-if="returnedReport.comment" class="reports-card_inner_desc">
            {{ returnedReport.comment ? returnedReport.comment : '' }}
          </div>

          <div class="reports-card_inner_link-btns">
            <div v-if="returnedReport.link" class="reports-card_inner_link-btn">
              <a
                :href="returnedReport.link"
                target="_blank"
                class="reports-card_inner_link-btn_inner"
              >
                <Icon name="Insert-Link" :size="24" />{{
                  reduceStringLength(returnedReport.link, 20)
                }}
              </a>
            </div>
            <div
              v-for="file in returnedReport.files"
              :key="file.id"
              class="reports-card_inner_link-btn"
            >
              <a
                :href="file.url"
                target="_blank"
                class="reports-card_inner_link-btn_inner"
                v-if="isPdf(file)"
              >
                <Icon name="Copy" :size="24" />{{
                  reduceStringLength(file.name ? file.name : 'file name', 20)
                }}
              </a>

              <div class="reports-card_inner_link-btn_inner" v-else @click="zoomInImage(file.url)">
                <Icon name="Copy" :size="24" />{{ reduceStringLength(file.url, 20) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--    <div v-if="recentReports && recentReports.length" class="reports-card_inner_wrapper">-->
    <!--      <div v-for="i in recentReports.length" :key="i" class="report-step-icon">-->
    <!--        <Icon class="icon" name="Right-Arrow" :size="24" />-->
    <!--      </div>-->
    <!--      <div v-for="(recentReport, i) in recentReports" :key="i" class="reports-card_inner">-->
    <!--        <div class="reports-card_inner_header">-->
    <!--          <div class="reports-card_inner-title">Recent for Review</div>-->
    <!--          <div class="reports-card_inner-date">{{ formatDate(recentReport.created_at) }}</div>-->
    <!--        </div>-->
    <!--        <div v-if="recentReport.userable" class="reports-card_inner_user">-->
    <!--          <Talent-->
    <!--            :text="recentReport.userable.name ? recentReport.userable.name : ''"-->
    <!--            :img="recentReport.userable.avatar ? recentReport.userable.avatar : ''"-->
    <!--          />-->
    <!--        </div>-->
    <!--        <div v-if="recentReport.comment" class="reports-card_inner_desc">-->
    <!--          {{ recentReport.comment ? recentReport.comment : '' }}-->
    <!--        </div>-->
    <!--        <div class="reports-card_inner_link-btns">-->
    <!--          <div v-if="recentReport.link" class="reports-card_inner_link-btn">-->
    <!--            <a :href="recentReport.link" target="_blank" class="reports-card_inner_link-btn_inner">-->
    <!--              <Icon name="Insert-Link" :size="24" />{{ reduceStringLength(recentReport.link, 20) }}-->
    <!--            </a>-->
    <!--          </div>-->
    <!--          <div-->
    <!--            v-for="file in recentReport.files"-->
    <!--            :key="file.id"-->
    <!--            class="reports-card_inner_link-btn"-->
    <!--          >-->
    <!--            <a-->
    <!--              :href="file.url"-->
    <!--              target="_blank"-->
    <!--              class="reports-card_inner_link-btn_inner"-->
    <!--              v-if="isPdf(file)"-->
    <!--            >-->
    <!--              <Icon name="Copy" :size="24" />{{-->
    <!--                reduceStringLength(file.name ? file.name : 'file name', 20)-->
    <!--              }}-->
    <!--            </a>-->

    <!--            <div class="reports-card_inner_link-btn_inner" v-else @click="zoomInImage(file.url)">-->
    <!--              <Icon name="Copy" :size="24" />{{ reduceStringLength(file.url, 20) }}-->
    <!--            </div>-->
    <!--          </div>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->
    <div
      class="report-step-icon w-full"
      v-if="(doneReport && isFullActive) || (pendingReport && doneReport)"
    >
      <Icon class="icon" name="Right-Arrow" :size="24" />
    </div>
    <div v-if="doneReport" class="reports-card_inner min">
      <div class="reports-card_inner_header">
        <div class="reports-card_inner-title">Task Accepted</div>
        <div class="reports-card_inner-date">{{ formatDate(doneReport.created_at) }}</div>
      </div>
      <div v-if="doneReport.userable" class="reports-card_inner_user">
        <Talent
          @click="doneReport(pendingReport.userable.id)"
          :text="doneReport.userable.name ? doneReport.userable.name : ''"
          :img="doneReport.userable.avatar ? doneReport.userable.avatar : ''"
        />
      </div>
      <div v-if="doneReport.comment" class="reports-card_inner_desc">
        {{ doneReport.comment ? doneReport.comment : '' }}
      </div>
      <Earned :rating="doneReport.rating" isRight isPoints />
    </div>
    <div class="report-step-icon w-full" v-if="rejectedReport">
      <Icon class="icon" name="Right-Arrow" :size="24" />
    </div>
    <div v-if="rejectedReport" class="reports-card_inner min">
      <div class="reports-card_inner_header">
        <div class="reports-card_inner-title">Task Rejected</div>
        <div class="reports-card_inner-date">{{ formatDate(rejectedReport.created_at) }}</div>
      </div>
      <div v-if="rejectedReport.userable" class="reports-card_inner_user">
        <Talent
          @click="doneReport(rejectedReport.userable.id)"
          :text="rejectedReport.userable.name ? rejectedReport.userable.name : ''"
          :img="rejectedReport.userable.avatar ? rejectedReport.userable.avatar : ''"
        />
      </div>
      <div v-if="rejectedReport.comment" class="reports-card_inner_desc">
        {{ rejectedReport.comment ? rejectedReport.comment : '' }}
      </div>
    </div>
  </div>
  <ZoomImage v-if="isOpenZoom" @close="closeZoomModal" :image="activeImage" />
</template>

<script setup>
import { formatDate, reduceStringLength } from '@/util/helpers';

const props = defineProps({
  reports: { type: Array, default: null },
  status: { type: String, default: '' },
  created: { type: String, default: '' },
});

const activeImage = ref(null);
const isOpenZoom = ref(false);

const status = ref(props.status);
const isFullActive = ref(false);

const closeZoomModal = () => {
  isOpenZoom.value = false;
  document.body.classList.remove('hide-scroll');
};

const zoomInImage = (image) => {
  activeImage.value = image;
  isOpenZoom.value = true;
  document.body.classList.add('hide-scroll');
};

const inProgressReport = computed(
  () => {
    if (props.reports) {
      const report = props.reports.find((item) => item.status === 'in_progress');
      return report;
    } else return null;
  },
  { dependsOn: [props.reports] },
);

const pendingReport = computed(
  () => {
    if (props.reports) {
      const report = props.reports.find((item) => item.status === 'waiting_for_review');
      return report;
    } else return null;
  },
  { dependsOn: [props.reports] },
);

const revisionReport = computed(
  () => {
    if (props.reports) {
      const report = props.reports.find((item) => item.status === 'on_revision');
      return report;
    } else return null;
  },
  { dependsOn: [props.reports] },
);

const recentReports = computed(
  () => {
    if (props.reports) {
      const report = props.reports.filter((item) => item.status === 'resent_for_review');
      // const report = props.reports.find((item) => item.status === 'resent_for_review');
      return report;
    } else return null;
  },
  { dependsOn: [props.reports] },
);
const rejectedReport = computed(
  () => {
    if (props.reports) {
      const report = props.reports.find((item) => item.status === 'rejected');
      return report;
    } else return null;
  },
  { dependsOn: [props.reports] },
);

const returnedReports = computed(
  () => {
    if (props.reports) {
      const report = props.reports.filter((item) => item.status === 'returned');
      // const report = props.reports.find((item) => item.status === 'returned');
      return report;
    } else return null;
  },
  { dependsOn: [props.reports] },
);
const reportsFiltered = computed(() => {
  const returnedReportsArray = returnedReports.value;
  const recentReportsArray = recentReports.value;

  const result = [];

  for (let i = 0; i < Math.max(returnedReportsArray.length, recentReportsArray.length); i++) {
    if (i < returnedReportsArray.length) {
      result.push(returnedReportsArray[i]);
    }
    if (i < recentReportsArray.length) {
      result.push(recentReportsArray[i]);
    }
  }

  return result;
});

const doneReport = computed(
  () => {
    if (props.reports) {
      const report = props.reports.find((item) => item.status === 'done');
      return report;
    } else return null;
  },
  { dependsOn: [props.reports] },
);
const router = useRouter();

const goToProfile = (id) => {
  console.log(id);
  router.push(`/talent/${id}`);
};
watch(pendingReport, (value) => {
  // console.log('pendingReport', value);
});

const setIsFullActive = (value) => {
  isFullActive.value = value;
};

const isPdf = (file) => {
  return file.mime_type.indexOf('pdf') !== -1;
};
</script>

<style lang="scss" scoped>
.reports-card_inner_link-btns {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.reports-card_inner_wrapper {
  display: flex;
  flex-direction: column;
}
.reports-card_inner {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 8px 12px 12px;
  gap: 8px;
  isolation: isolate;

  width: 328px;
  height: auto;
  background: #ffffff;
  border-radius: 8px;
  max-height: 300px;
  overflow: auto;
  &.min {
    height: auto;
    padding: 8px;
  }
  &_link-btn {
    width: fit-content;
    border: 1px solid $default-border;
    border-radius: 16px;
    padding: 3px 10px;

    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    text-align: right;
    letter-spacing: 0.014em;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: #38405b;
    cursor: pointer;
  }
  &_header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &-title {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    display: flex;
    align-items: center;
    letter-spacing: 0.014em;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: #1a1d29;
  }
  &-date {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    display: flex;
    align-items: center;
    text-align: right;
    letter-spacing: 0.014em;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: #1a1d29;
  }
  &_desc {
    width: 100%;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $section-title;
    word-wrap: break-word;
  }
}
.reports-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 16px;
  width: 360px;
  height: fit-content;

  background: $default-badge-border;

  border: 1px solid $default-border;
  border-radius: 16px;
  &_header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &-title {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    line-height: 24px;
    font-feature-settings: 'zero' on;
    color: $secondary;
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
    color: #38405b;
  }
}

.report-step-icon {
  display: flex;
  justify-content: center;
  height: 25px;
  .icon {
    transform: rotate(90deg);
  }
}
</style>
