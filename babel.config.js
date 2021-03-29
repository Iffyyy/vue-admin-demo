module.exports = {
  presets: [
    '@vue/app'
  ],
  env: {
    production: {
      plugins: [[
        'transform-remove-console',
        {
          // 保留 console.error 与 console.warn
          exclude: ['error', 'warn']
        }
      ]]
    }
  }
}
