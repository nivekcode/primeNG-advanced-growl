export default {
    plugins: [
        commonjs({
            include: 'node_modules/**',
            namedExports: {
                // Add every import you need from primeng to the list
                'node_modules/primeng/primeng.js': ['GrowlModule']
            }
        })
    ]
}