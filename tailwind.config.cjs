/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        extend: {
            colors: {
                purple: {
                    600: '#311b92',
                }
            }
        }
    },
    plugins: [
        require('@tailwindcss/forms'),
    ]
};
