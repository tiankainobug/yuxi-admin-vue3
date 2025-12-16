/**
 * 通用 localStorage 操作工具类
 */

/**
 * 存储数据到 localStorage
 * @param {string} key - 存储的键名
 * @param {any} value - 存储的值，可以是任意类型
 */
export function setStorage(key, value) {
  if (!key) {
    throw new Error('存储键名不能为空')
  }

  try {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value)
    window.localStorage.setItem(key, stringValue)
  } catch (error) {
    console.error('localStorage 存储失败:', error)
    throw error
  }
}

/**
 * 从 localStorage 读取数据
 * @param {string} key - 要读取的键名
 * @param {any} defaultValue - 默认值，当读取不到或解析失败时返回
 * @returns {any} 读取到的数据
 */
export function getStorage(key, defaultValue = null) {
  if (!key) {
    throw new Error('键名不能为空')
  }

  try {
    const item = window.localStorage.getItem(key)

    // 如果没有找到对应项，返回默认值
    if (item === null) {
      return defaultValue
    }

    // 尝试解析 JSON 字符串
    try {
      return JSON.parse(item)
    } catch {
      // 如果解析失败，说明存储的是普通字符串
      return item
    }
  } catch (error) {
    console.error('localStorage 读取失败:', error)
    return defaultValue
  }
}

/**
 * 从 localStorage 删除指定数据
 * @param {string} key - 要删除的键名
 */
export function removeStorage(key) {
  if (!key) {
    throw new Error('键名不能为空')
  }

  try {
    window.localStorage.removeItem(key)
  } catch (error) {
    console.error('localStorage 删除失败:', error)
    throw error
  }
}

/**
 * 清空 localStorage 所有数据
 */
export function clearStorage() {
  try {
    window.localStorage.clear()
  } catch (error) {
    console.error('localStorage 清空失败:', error)
    throw error
  }
}

/**
 * 检查 localStorage 是否支持
 * @returns {boolean} 是否支持 localStorage
 */
export function isStorageSupported() {
  try {
    const testKey = '__storage_test__'
    window.localStorage.setItem(testKey, testKey)
    window.localStorage.removeItem(testKey)
    return true
  } catch (e) {
    return false
  }
}
