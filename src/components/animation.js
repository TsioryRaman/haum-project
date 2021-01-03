export const stagger = {
    hide: {opacity: 0, x: -30},
    show: {
        x: 0,
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },

    exit: {
        opacity: 0,
    }
}
export const fadeInUp = {
    hide: {
        y: 50,
        opacity: 0,
    },
    show: {
        opacity: 1,
        y: 0,

    },

    exit: {
        opacity: 0,
        x: 30
    }
};