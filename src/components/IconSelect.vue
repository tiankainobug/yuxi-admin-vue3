<template>
  <div class="icon-select">
    <el-popover
      placement="bottom-start"
      :width="popoverWidth"
      trigger="click"
      popper-class="icon-select-popper"
    >
      <template #reference>
        <el-input
          v-model="selectedIcon"
          placeholder="点击选择图标"
          readonly
          class="icon-select-input"
        >
          <template #prefix>
            <el-icon v-if="selectedIcon">
              <component :is="selectedIcon" />
            </el-icon>
            <el-icon v-else>
              <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                <path fill="currentColor" d="M128 128v768h768V128H128zm0-64h768a64 64 0 0 1 64 64v768a64 64 0 0 1-64 64H128a64 64 0 0 1-64-64V128a64 64 0 0 1 64-64z"></path>
                <path fill="currentColor" d="M320 320h384v64H320v-64zm0 192h384v64H320v-64zm0 192h384v64H320v-64z"></path>
              </svg>
            </el-icon>
          </template>
          <template #suffix>
            <el-icon class="el-input__icon">
              <ArrowDown />
            </el-icon>
          </template>
        </el-input>
      </template>

      <div class="icon-select-content">
        <div class="icon-select-header">
          <el-input
            v-model="searchText"
            placeholder="搜索图标"
            clearable
            class="icon-search-input"
          >
            <template #prefix>
              <el-icon>
                <Search />
              </el-icon>
            </template>
          </el-input>
        </div>

        <div class="icon-list">
          <el-scrollbar height="300px">
            <ul class="icon-grid">
              <li
                v-for="icon in filteredIcons"
                :key="icon"
                :class="{ active: selectedIcon === icon }"
                @click="handleSelect(icon)"
              >
                <el-icon>
                  <component :is="icon" />
                </el-icon>
                <span class="icon-name">{{ icon }}</span>
              </li>
            </ul>
          </el-scrollbar>
        </div>

        <div class="icon-select-footer">
          <el-pagination
            small
            layout="prev, pager, next"
            :total="allIcons.length"
            :page-size="pageSize"
            :current-page="currentPage"
            @current-change="handlePageChange"
          />
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { ArrowDown, Search } from '@element-plus/icons-vue'

// 定义属性
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

// 定义事件
const emit = defineEmits(['update:modelValue'])

// 响应式数据
const selectedIcon = ref(props.modelValue)
const searchText = ref('')
const currentPage = ref(1)
const pageSize = ref(60)
const popoverWidth = ref(400)

// 获取所有图标名称
const allIcons = Object.keys(ElementPlusIconsVue)
console.log(allIcons)

// 过滤后的图标列表（支持搜索）
const filteredIcons = computed(() => {
  const filtered = searchText.value
    ? allIcons.filter(name =>
        name.toLowerCase().includes(searchText.value.toLowerCase())
      )
    : allIcons

  // 分页处理
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filtered.slice(start, end)
})

// 处理图标选择
const handleSelect = (icon) => {
  selectedIcon.value = icon
  emit('update:modelValue', icon)
}

// 处理分页变化
const handlePageChange = (page) => {
  currentPage.value = page
}

// 监听外部值的变化
watch(
  () => props.modelValue,
  (val) => {
    selectedIcon.value = val
  }
)

// 监听搜索文本变化时重置页码
watch(searchText, () => {
  currentPage.value = 1
})
</script>

<style lang="scss" scoped>
.icon-select {
  display: inline-block;
  width: 100%;
}

.icon-select-input {
  cursor: pointer;

  :deep(.el-input__wrapper) {
    cursor: pointer;
  }

  :deep(.el-input__prefix) {
    .el-icon {
      width: 16px;
      height: 16px;
    }
  }
}

.icon-select-content {
  .icon-select-header {
    margin-bottom: 12px;
  }

  .icon-search-input {
    width: 100%;
  }

  .icon-list {

    .icon-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 8px;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s;
        border: 1px solid var(--el-border-color);

        &:hover {
          background-color: var(--el-fill-color-light);
        }

        &.active {
          border-color: var(--el-color-primary);
          background-color: var(--el-color-primary-light-9);
        }

        .el-icon {
          font-size: 20px;
          margin-bottom: 4px;
        }

        .icon-name {
          font-size: 12px;
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 100%;
        }
      }
    }
  }

  .icon-select-footer {
    margin-top: 12px;
    display: flex;
    justify-content: center;
  }
}
</style>

<style lang="scss">
.icon-select-popper {
  padding: 12px !important;
}
</style>
