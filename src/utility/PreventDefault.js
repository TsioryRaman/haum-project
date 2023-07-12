export const prevent = (e,cb) => {
    e.preventDefault()
    return function(){
        cb()
    }
}