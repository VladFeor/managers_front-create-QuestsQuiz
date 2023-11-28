<template>
  <div class="base-table">
    <div class="header-body">
      <div
        class="header-row"
        :style="{
          paddingLeft: isToggleChackboxActive ? '60px' : '20px',
        }"
      >
        <div class="row-checkbox" :class="{ active: isToggleChackboxActive }">
          <TableCheckbox
            :checked-prop="isRowChecked(0)"
            @checkboxChecked="handleCheckRow(0)"
            :checkedRows="checkedRows"
          />
        </div>
        <div
          v-for="(column, index) in columns"
          :key="index"
          class="header-cell"
          :class="{ empty: !rows.length, sort: isSorting }"
          :style="{ textAlign: column.justify || 'left', width: column.width || '100%' }"
          @click="sortByColumn(column.prop)"
        >
          {{ column.label }}
          <Sort
            v-if="column.label && isSorting"
            :direction="sortColumn === modifyStringSpaces(column.label) ? sortDirection : 'none'"
          />
        </div>
        <div class="toggle-checkbox-btn">
          <ToggleMenu @toggleCheckboxes="toggleCheckboxes" />
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
        <div class="row-checkbox" :class="{ active: isToggleChackboxActive }">
          <TableCheckbox
            :checked-prop="isRowChecked(row.itemId)"
            :row-id="row.itemId"
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

            <template
              v-else-if="
                checkIsPropertyExist(row[column.prop], 'component') &&
                checkIsPropertyExist(row[column.prop], 'isInvisible') &&
                !isToggleChackboxActive
              "
            >
              <component
                :is="row[column.prop].component"
                :="row[column.prop].props"
                @next="$emit('next')"
                @prev="$emit('prev')"
                @current="$emit('current', $event)"
              />
            </template>

            <template
              v-else-if="
                checkIsPropertyExist(row[column.prop], 'component') &&
                !checkIsPropertyExist(row[column.prop], 'isInvisible')
              "
            >
              <component
                :is="row[column.prop].component"
                :="row[column.prop].props"
                @next="$emit('next')"
                @prev="$emit('prev')"
                @current="$emit('current', $event)"
              />
            </template>

            <template v-else />
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

export default {
  name: 'BaseTable',
  data() {
    return {
      reduceStringLength,
      arrowRight,
      checkIsPropertyExist,
      modifyStringSpaces,
      sortColumn: null,
      sortDirection: 'none',
      isToggleChackboxActive: false,
      // checkedRows: [],
    };
  },
  mixins: [windowSizeMixin],
  props: {
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
    checkedRows: { type: Array, default: [] },
    updateCheckedRows: { type: Function, default: null },
    pointer: { type: Boolean, defalut: false },
    loading: { type: Boolean, defalut: false },
    loaded: { type: Boolean, defalut: false },
    sortFunction: {
      type: Function,
      default: null,
    },
    isSorting: { type: Boolean, default: false },
    isCollapse: { type: Boolean, default: false },
  },
  mounted() {
    if (
      this.sortFunction &&
      this.isSorting &&
      localStorage.sortDirection &&
      localStorage.sortColumn
    ) {
      this.sortFunction(this.sortByColumn(localStorage.sortColumn), localStorage.sortDirection);
    }
  },
  methods: {
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
    sortByColumn(column) {
      if (!this.isSorting) return;
      if (this.sortColumn === column) {
        if (this.sortDirection === 'asc') {
          this.sortDirection = 'desc';
          localStorage.sortDirection = this.sortDirection;
        } else if (this.sortDirection === 'desc') {
          this.sortDirection = 'none';
          localStorage.sortDirection = this.sortDirection;
        } else {
          this.sortDirection = 'asc';
          localStorage.sortDirection = this.sortDirection;
        }
        this.sortFunction(column, this.sortDirection);
      } else {
        this.sortColumn = column;
        localStorage.sortColumn = column;
        this.sortDirection = 'asc';
        localStorage.sortDirection = this.sortDirection;
        this.sortFunction(column, this.sortDirection);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.toggle-checkbox-btn {
  position: absolute;
  right: 20px;
  top: 15px;
}
.row-checkbox {
  display: none;
  position: absolute;
  left: 24px;
  top: 24px;
  &.active {
    display: block;
  }
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
  border: 1px solid $default-border;
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
  color: $header-text-list;
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
    margin-bottom: 10;
    padding: 0;
  }
}
</style>
