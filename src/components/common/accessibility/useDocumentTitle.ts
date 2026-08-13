import {useEffect} from 'react'

const useDocumentTitle = (title: string | undefined): void => {
    useEffect(() => {
        if (!title) return undefined
        document.title = title
        return undefined
    }, [title])
}

export default useDocumentTitle
