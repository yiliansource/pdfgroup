module.exports = {
    root: true,
    overrides: [
        {
            files: '**/*.ts',
            parser: '@typescript-eslint/parser',
            parserOptions: {
                ecmaVersion: 2018,
                project: ['./tsconfig.json'],
                sourceType: 'module',
            },
            plugins: ['@typescript-eslint', 'prettier', 'unused-imports'],
            extends: [
                'eslint:recommended',
                'plugin:@angular-eslint/recommended',
                'plugin:@typescript-eslint/recommended',
                'plugin:@typescript-eslint/strict',
                'plugin:prettier/recommended',
                'plugin:import/recommended',
                'plugin:import/typescript',
            ],
            rules: {
                '@typescript-eslint/no-unused-vars': 'off',
                '@typescript-eslint/no-useless-constructor': 'off',
                'unused-imports/no-unused-imports': 'error',
                '@typescript-eslint/no-extraneous-class': [
                    'error',
                    {
                        allowWithDecorator: true,
                    },
                ],
                'sort-imports': [
                    'error',
                    {
                        ignoreCase: false,
                        ignoreDeclarationSort: true, // don"t want to sort import lines, use eslint-plugin-import instead
                        ignoreMemberSort: false,
                        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
                        allowSeparatedGroups: true,
                    },
                ],
                // turn on errors for missing imports
                'import/no-unresolved': 'error',
                'import/order': [
                    'error',
                    {
                        groups: [
                            'builtin', // Built-in imports (come from NodeJS native) go first
                            'external', // <- External imports
                            'internal', // <- Absolute imports
                            ['sibling', 'parent'], // <- Relative imports, the sibling and parent types they can be mingled together
                            'index', // <- index imports
                            'unknown', // <- unknown
                        ],
                        'newlines-between': 'always',
                        alphabetize: {
                            /* sort in ascending order. Options: ["ignore", "asc", "desc"] */
                            order: 'asc',
                            /* ignore case. Options: [true, false] */
                            caseInsensitive: true,
                        },
                    },
                ],
            },
            settings: {
                'import/resolver': {
                    typescript: {
                        project: './tsconfig.json',
                    },
                },
            },
        },
    ],
};
