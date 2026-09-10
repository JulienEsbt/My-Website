export const ROUTE_CATALOG = /** @type {const} */ ({
    home: {path: '/', seoKey: 'home', page: 'HomePage', namespace: 'home'},
    brunoPizzaCaseStudy: {
        path: '/projects/bruno-pizza',
        seoKey: 'brunoPizza',
        page: 'BrunoPizzaCaseStudyPage',
        namespace: 'projects',
    },
    myWebsiteCaseStudy: {
        path: '/projects/my-website',
        seoKey: 'myWebsite',
        page: 'MyWebsiteCaseStudyPage',
        namespace: 'projects',
    },
    resume: {path: '/resume', seoKey: 'resume', page: 'ResumePage', namespace: 'resume'},
    privacy: {path: '/privacy', seoKey: 'privacy', page: 'PrivacyPage', namespace: 'common'},
    web3: {path: '/web3', seoKey: 'web3', page: 'Web3Page', namespace: 'web3'},
    travel: {path: '/travel', seoKey: 'travel', page: 'TravelPage', namespace: 'travel'},
    reflections: {
        path: '/reflections',
        seoKey: 'reflections',
        page: 'ReflectionsPage',
        namespace: 'reflections',
    },
    reflectionArticle: {
        path: '/reflections/:slug',
        seoKey: 'reflection',
        page: 'ReflectionArticlePage',
        namespace: 'reflections',
    },
})
