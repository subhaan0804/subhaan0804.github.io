export default [
  {
    ignores: ["assets/js/*.min.js", "assets/js/**/*.min.js"]
  },
  {
    files: ["assets/js/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
        fetch: "readonly",
        lottie: "readonly",
        gsap: "readonly",
        ScrollTrigger: "readonly",
        PortfolioRenderer: "readonly",
        Icons: "readonly",
        iconLink: "readonly",
        IntersectionObserver: "readonly",
        MutationObserver: "readonly",
        CustomEvent: "readonly",
        requestAnimationFrame: "readonly",
        cancelAnimationFrame: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
      "no-eval": "error",
      "no-implied-eval": "error",
      eqeqeq: ["error", "always"],
      "prefer-const": "warn",
    },
  },
];
