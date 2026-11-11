import {render, screen} from '@testing-library/react'
import {beforeAll, describe, expect, it} from 'vitest'
import {loadNamespaces} from '../../i18n/i18n.js'
import {citizenResources} from '../../data/citizenResources/resources.js'
import ResourceCard from './ResourceCard.jsx'

beforeAll(() => loadNamespaces(['resources']))

describe('resource destinations', () => {
    it('opens the preview, visit, sources and preview credit in a separate tab', () => {
        render(
            <ResourceCard resource={citizenResources.find(({id}) => id === 'praxis')} number={3} />
        )
        const links = screen.getAllByRole('link', {hidden: true})
        expect(links.length).toBeGreaterThanOrEqual(4)
        for (const link of links) {
            expect(link).toHaveAttribute('target', '_blank')
            expect(link.rel.split(' ')).toEqual(expect.arrayContaining(['noopener', 'noreferrer']))
        }
    })
})
