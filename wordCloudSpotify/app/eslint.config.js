import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'

export default [
  {
    ignores: ['dist/**', 'node_modules/**']
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        // wordcloud renderiza no browser
        document: 'readonly',
        window: 'readonly',
        console: 'readonly'
      }
    },
    rules: {}
  }
]
