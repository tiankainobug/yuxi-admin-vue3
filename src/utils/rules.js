export const mustRule ={ required: true, message: '必填哦！' }

export const startWithSlashRule = {
    validator: (value) => {
        return value.startsWith('/')
    },
    message: '路径必须以 / 开头'
}
