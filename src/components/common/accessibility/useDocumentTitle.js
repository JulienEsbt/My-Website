import {useEffect} from 'react'

const useDocumentTitle = (title) => {
    useEffect(() => {
        if (!title) return undefined

        document.title = title
        return undefined
    }, [title])
}

export default useDocumentTitle
