<template>
  <div class="base-table">
    <div class="header-body">
      <div class="header-row" :style="{ paddingLeft: isToggleChackboxActive ? '60px' : '20px' }">
        <div class="row-checkbox" v-if="isToggleChackboxActive && !isProjectAdministrator">
          <TableCheckbox
            :minus-icon="false"
            :checked-prop="isRowChecked(0)"
            :checkedRows="checkedRows"
            @checkboxChecked="handleCheckRow(0)"
          />
        </div>
        <div
          v-for="(column, index) in columns"
          :key="index"
          class="header-cell"
          :class="{ empty: !rows.length, sort: isSorting }"
          :style="{
            textAlign: column.justify || 'left',
            width: column.width || '100%',
          }"
          @click="sortByColumn(column.prop)"
        >
          {{ column.label }}
          <Sort
            v-if="column.label && isSorting"
            :direction="sortColumn === modifyStringSpaces(column.prop) ? sortDirection : 'none'"
          />
        </div>
        <div class="toggle-checkbox-btn" v-if="!isProjectAdministrator">
          <ToggleMenu v-if="!project" @toggleCheckboxes="toggleCheckboxes" />
        </div>
      </div>
    </div>

    <div v-if="rows.length > 0" class="body">
      <div
        v-for="(row, rowIndex) in rows"
        :key="rowIndex"
        class="row"
        :class="{ pointer }"
        :style="{
          justifyItems: row.justify || 'left',
          paddingLeft: isToggleChackboxActive ? '60px' : '20px',
        }"
      >
        <div class="row-checkbox" v-if="isToggleChackboxActive && !isProjectAdministrator">
          <TableCheckbox
            :checked-prop="isRowChecked(row.itemId)"
            :rowId="row.itemId"
            @checkboxChecked="handleCheckRow(row.itemId)"
          />
        </div>
        <div
          v-for="(column, columnIndex) in columns"
          :key="columnIndex"
          class="cell"
          :style="{ width: column.width || '100%', justifyContent: column.justify || 'left' }"
        >
          <div
            v-if="checkIsPropertyExist(row[column.prop], 'adjust') && row[column.prop].adjust"
            class="adjust"
          >
            <Icon name="Right-Arrow1" :size="20" class="arrow-color" />
          </div>
          <div
            v-if="
              checkIsPropertyExist(row[column.prop], 'adjustReturnBtn') &&
              row[column.prop].adjustReturnBtn
            "
            class="adjust-btn"
          >
            <ReturnBtn />
          </div>
          <div class="mobile-header-row">
            <div class="mobile-header-cell">
              {{ column.label }}
            </div>
            <template
              v-if="
                checkIsPropertyExist(row, column.prop) &&
                !checkIsPropertyExist(row[column.prop], 'component') &&
                checkIsPropertyExist(row[column.prop], 'content')
              "
            >
              <div class="table-text">
                {{
                  checkIsPropertyExist(row[column.prop], 'reduceLength') &&
                  row[column.prop].reduceLength
                    ? reduceStringLength(row[column.prop].content, row[column.prop].reduceLength)
                    : row[column.prop].content
                }}
              </div>
            </template>

            <div v-else-if="checkIsPropertyExist(row[column.prop], 'components')">
              <!-- <template v-for="item in row[column.prop].components" :key="item.id">
                <component :is="item.component" :="item.props" />
              </template> -->
            </div>

            <template
              v-else-if="
                checkIsPropertyExist(row, column.prop) &&
                !checkIsPropertyExist(row[column.prop], 'component')
              "
            >
              <div class="table-text">
                {{
                  checkIsPropertyExist(row[column.prop], 'reduceLength') &&
                  row[column.prop].reduceLength
                    ? reduceStringLength(row[column.prop], row[column.prop].reduceLength)
                    : row[column.prop]
                }}
              </div>
            </template>

            <template v-else-if="checkIsPropertyExist(row[column.prop], 'component')">
              <component :is="row[column.prop].component" :="row[column.prop].props" />
            </template>

            <template v-else />
          </div>
        </div>
        <div class="controller" v-if="!isProjectAdministrator">
          <div class="hovered">
            <TalentProfileModal :profile="row.profile" />
            <div
              class="btn more"
              :class="{ more__active: rowIndex === activeTooltipIndex }"
              @click="toggleTooltip(rowIndex)"
            >
              <Icon
                :class="{ 'active-icon': rowIndex === activeTooltipIndex }"
                icon="More"
                :size="24"
              ></Icon>
            </div>
            <div v-if="isTooltipActive(rowIndex)" id="tooltip-confirmation-links">
              <div class="tooltip-arrow"></div>
              <div class="menu">
                <div
                  class="link"
                  @click="
                    toggleTooltip(rowIndex);
                    $emit('invite', row.itemId);
                  "
                  v-if="row.status === 'revoked' || !row.status"
                >
                  Invite to the Project
                </div>
                <div
                  class="link"
                  @click="
                    toggleTooltip(rowIndex);
                    $emit('remove', row.itemId);
                  "
                  v-if="row.status === 'pending' && !isSuperAdmin"
                >
                  Disinvite
                </div>
                <div
                  class="link"
                  @click="
                    toggleTooltip(rowIndex);
                    $emit('remove', row.itemId);
                  "
                  v-if="row.status === 'accepted' && !isSuperAdmin && canRemove"
                >
                  Remove from the Project
                </div>
                <div
                  v-if="isSuperAdmin && canRemove"
                  class="link red"
                  @click="
                    toggleTooltip(rowIndex);
                    $emit('removeTalent', row.itemId);
                  "
                >
                  Remove from Talentum
                </div>
              </div>
            </div>
          </div>
          <div class="waiting">
            <div class="btn" v-show="row.status === 'pending' && !isSuperAdmin">
              <Icon icon="Clock" :size="24"></Icon>
            </div>
          </div>
        </div>
      </div>
    </div>
    <EmptyList v-else :title="title" :icon="icon" />
  </div>
</template>

<script>
import arrowRight from '@/assets/icons/arrow-right.svg';
import windowSizeMixin from '@/mixins/windowSizeMixin';
import { reduceStringLength, checkIsPropertyExist, modifyStringSpaces } from '@/util/helpers';
import AxiosService from '~/service/axiosService';
import { inject } from 'vue';

export default {
  name: 'TalentsTable',
  data() {
    return {
      reduceStringLength,
      arrowRight,
      checkIsPropertyExist,
      modifyStringSpaces,
      activeTooltipIndex: false,
      isToggleChackboxActive: false,
    };
  },
  mixins: [windowSizeMixin],
  props: {
    project: {
      type: Object,
      required: false,
    },
    canRemove: {
      type: Boolean,
      default: false,
    },
    columns: {
      type: Array,
      required: true,
    },
    rows: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    sortDirection: {
      type: String,
      default: '',
    },
    setSortDirection: {
      type: Function,
      default: null,
    },
    sortColumn: {
      type: String,
      default: '',
    },
    setSortColumn: {
      type: Function,
      default: null,
    },
    pointer: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    loaded: { type: Boolean, default: false },
    isMultiComponents: { type: Boolean, default: false },
    sortFunction: {
      type: Function,
      default: null,
    },
    isSorting: { type: Boolean, default: false },
    checkedRows: { type: Array, default: [] },
    updateCheckedRows: { type: Function, default: null },
  },
  mounted() {},
  methods: {
    toggleTooltip(index) {
      this.activeTooltipIndex = this.activeTooltipIndex === index ? null : index;
    },
    isTooltipActive(index) {
      return this.activeTooltipIndex === index;
    },
    toHandler(row) {
      if (this.checkIsPropertyExist(row, 'to')) {
        this.$router.push(row.to);
      }
    },
    sortByColumn(column) {
      if (!this.isSorting) return;
      if (this.sortColumn === column) {
        if (this.sortDirection === '') {
          this.setSortDirection('asc');
          this.sortFunction(column, 'asc');
        } else if (this.sortDirection === 'asc') {
          this.setSortDirection('desc');
          this.sortFunction(column, 'desc');
        } else {
          this.setSortDirection('');
          this.sortFunction(column, '');
        }
      } else {
        this.setSortColumn(column);
        this.setSortDirection('asc');
        this.sortFunction(column, 'asc');
      }
    },
    handleCheckRow(id) {
      if (id === 0 && !this.checkedRows.includes(id)) {
        const allRowsIds = this.rows.map((item) => item.itemId);
        allRowsIds.push(0);
        this.updateCheckedRows(allRowsIds);
        return;
      } else if (id === 0 && this.checkedRows.includes(id)) {
        this.updateCheckedRows([]);

        return;
      } else if (this.checkedRows.includes(id)) {
        let newCheckedRows = this.checkedRows.filter((item) => item !== id);

        if (newCheckedRows.length === 1 && newCheckedRows[0] === 0) {
          this.updateCheckedRows([]);
          return;
        }

        this.updateCheckedRows(newCheckedRows);

        return;
      } else {
        let newCheckedRows = JSON.parse(JSON.stringify(this.checkedRows));
        newCheckedRows.push(id);
        newCheckedRows.push(0);
        this.updateCheckedRows(newCheckedRows);
      }
    },
    isRowChecked(id) {
      return this.checkedRows.includes(id);
    },
    toggleCheckboxes() {
      this.isToggleChackboxActive = !this.isToggleChackboxActive;
      this.$emit('checkActive', this.isToggleChackboxActive);
    },
  },
  setup(props) {
    const roles = inject('roles');

    const { isSuperAdmin, isProjectAdministrator } = roles;

    const remove = (index) => {
      AxiosService.delete(
        useRuntimeConfig().public.apiBaseV2 +
          `ambassadors/${talent.value.id}/invites/${index.project.id}`,
      )
        .then(async () => {
          nuxtApp.$alert.show('Success', {
            type: 'success',
            timeout: 5000,
          });
        })
        .catch((e) => {
          nuxtApp.$alert.show(e.response.data.message, {
            type: 'error',
            timeout: 5000,
          });
        });
    };

    const kick = (index) => {
      AxiosService.delete(
        useRuntimeConfig().public.apiBaseV2 +
          `ambassadors/${talent.value.id}/projects/${index.project.id}`,
      )
        .then(async () => {
          nuxtApp.$alert.show('Success', {
            type: 'success',
            timeout: 5000,
          });
        })
        .catch((e) => {
          nuxtApp.$alert.show(e.response.data.message, {
            type: 'error',
            timeout: 5000,
          });
        });
    };

    const add = (index) => {
      AxiosService.post(
        useRuntimeConfig().public.apiBaseV2 +
          `ambassadors/${talent.value.id}/invites/${index.project.id}`,
        {},
      )
        .then(async () => {
          nuxtApp.$alert.show('Success', {
            type: 'success',
            timeout: 5000,
          });
        })
        .catch((e) => {
          nuxtApp.$alert.show(e.response.data.message, {
            type: 'error',
            timeout: 5000,
          });
        });
    };

    return {
      remove,
      kick,
      add,
      isSuperAdmin,
      isProjectAdministrator,
    };
  },
};
</script>

<style scoped lang="scss">
.toggle-checkbox-btn {
  width: 45%;
}
.row-checkbox {
  position: absolute;
  left: 24px;
  top: 24px;
}
.table-text {
  font-family: 'Basis Grotesque Pro';
  color: $default;
}
.adjust {
  position: absolute;
  top: 17px;
  right: -40px;
}
.arrow-color {
  filter: invert(77%) sepia(28%) saturate(391%) hue-rotate(204deg) brightness(86%) contrast(83%);
}
.adjust-btn {
  position: absolute;
  top: 19px;
  right: 20px;
}
.base-table {
  font-family: 'Basis Grotesque Pro';
  font-size: 14px;
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-columns: repeat(auto-fit, minmax(30px, 1fr));
  grid-gap: 8px;
  width: 100%;
}

.header-body {
  grid-row: 1;
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(30px, 1fr));
  width: 100%;
}

.header-row {
  width: 100%;
  position: relative;

  background: $default-badge-border;
  border-radius: 16px;
  display: flex;
  align-items: center;
  overflow: hidden;
  min-height: 64px;
  padding: 0 20px 0 60px;

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
  color: $header-text-list;
}

.header-cell {
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.014em;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  color: $section-title;
  &.sort {
    display: flex;
    gap: 3px;
    cursor: pointer;
  }
  &.empty {
    color: $secondary;
  }
}

.body {
  grid-row: 2;
  grid-column: 1 / -1;
  display: grid;
  grid-template-rows: repeat(auto-fit, minmax(30px, 1fr));
}

.row {
  position: relative;
  background: $white;
  border: 1px solid $default-border;
  border-radius: 16px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  overflow: inherit;
  min-height: 64px;
  padding: 0 20px 0 60px;

  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  text-align: right;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  color: $section-title;
  &.pointer {
    cursor: pointer;
    &:hover {
      border: 1px solid $default;
      .controller {
        .hovered {
          width: 100%;
        }
      }
      .status {
        display: none;
      }
    }
  }
}

.cell {
  font-family: 'Basis Grotesque Pro';
  display: flex;
  align-items: center;
  text-align: left;
  color: black;
  position: relative;
}

.mobile-header-cell {
  display: none;
}

@media (max-width: 768px) {
  .mobile-header-row {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .mobile-header-cell {
    display: block;
    background: $default-badge-border;
  }
  .cell {
    background: linear-gradient(to right, $default-badge-border 40%, $white 30%);
    padding: 10px;
    width: auto !important;
  }
  .base-table {
    font-size: 12px;
  }

  .header-row {
    display: none;
  }

  .body {
    grid-template-rows: repeat(auto-fit, minmax(100px, 1fr));
  }

  .row {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
    padding: 0;
  }
}
.controller {
  display: flex;
  gap: 16px;
  align-items: center;
  width: 80px;

  .waiting {
    width: 75px;
  }
  .hovered {
    display: flex;
    gap: 16px;
    align-items: center;
    width: 0;
    .btn {
      display: flex;
      width: 32px;
      height: 32px;
      padding: 4px;
      justify-content: center;
      align-items: center;
      gap: 8px;
      border-radius: 8px;
      background: #f5f5fd;
      &:hover {
        background: #eaeafb;
      }

      &.more {
        &__active {
          background: $default;
        }

        .active-icon {
          filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(46deg) brightness(104%)
            contrast(200%);
        }
      }
    }
    #tooltip-confirmation-links {
      position: absolute;
      height: fit-content;
      top: 55px;
      background: $white;
      margin-left: -90px;
      padding: 8px;
      box-shadow: 0px 4px 16px rgba(56, 64, 91, 0.24);
      border-radius: 8px;
      width: 190px;
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 500;
      font-size: 12px;
      line-height: 16px;
      letter-spacing: 0.014em;
      z-index: 99;
      font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
      .tooltip-arrow {
        position: absolute;
        top: -6px;
        left: 80%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-bottom: 6px solid $white;
      }
      .menu {
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        gap: 8px;
        .red {
          color: $red !important;
        }
        .link {
          font-family: 'Basis Grotesque Pro';
          font-style: normal;
          font-weight: 500;
          font-size: 12px;
          line-height: 16px;
          font-feature-settings: 'zero' on;
          color: $section-title;
          display: flex;
          flex-direction: row;
          align-items: center;
          padding: 3px 8px;
          width: 100%;
          height: 24px;
          background: $white;
          border-radius: 6px;
          &:hover {
            background: $default-bg;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
