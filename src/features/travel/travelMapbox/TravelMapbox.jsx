import React, {useEffect, useRef} from 'react'
import {useTranslation} from 'react-i18next'
import {createTravelMap} from '../../../services/mapbox/mapboxAdapter.js'
import 'mapbox-gl/dist/mapbox-gl.css'
import './TravelMapbox.css'

const TravelMapbox = ({
    expanded = false,
    trips = [],
    dreamDestinations = [],
    selectedLocation = null,
    resetSignal = 0,
}) => {
    const {t, i18n} = useTranslation('travel')
    const mapContainer = useRef(null)
    const mapRef = useRef(null)
    const initialExpanded = useRef(expanded)
    const selectedLocationRef = useRef(selectedLocation)
    selectedLocationRef.current = selectedLocation
    const language = i18n.resolvedLanguage?.startsWith('fr') ? 'fr' : 'en'

    useEffect(() => {
        if (!mapContainer.current || mapRef.current) return

        const initTimer = setTimeout(() => {
            mapRef.current = createTravelMap({
                container: mapContainer.current,
                expanded: initialExpanded.current,
                trips,
                dreamDestinations,
                language,
                dreamLabel: t('explorer.legend.dream'),
                navigationLabels: {
                    zoomIn: t('explorer.mapControls.zoomIn'),
                    zoomOut: t('explorer.mapControls.zoomOut'),
                    resetBearing: t('explorer.mapControls.resetBearing'),
                    closePopup: t('explorer.mapControls.closePopup'),
                },
            })
            if (selectedLocationRef.current) mapRef.current.focus(selectedLocationRef.current)
        }, 100)

        return () => {
            clearTimeout(initTimer)
            mapRef.current?.destroy()
            mapRef.current = null
        }
    }, [dreamDestinations, language, t, trips])

    useEffect(() => {
        if (!selectedLocation) return
        mapRef.current?.focus(selectedLocation)
    }, [selectedLocation])

    useEffect(() => {
        if (resetSignal === 0) return
        mapRef.current?.reset()
    }, [resetSignal])

    useEffect(() => {
        const resize = () => mapRef.current?.resize()

        resize()
        const t1 = setTimeout(resize, 150)
        const t2 = setTimeout(resize, 500)
        const t3 = setTimeout(resize, 1000)

        return () => {
            clearTimeout(t1)
            clearTimeout(t2)
            clearTimeout(t3)
        }
    }, [expanded])

    return (
        <div
            ref={mapContainer}
            className={`travel-mapbox ${expanded ? 'expanded' : ''}`}
            role="region"
            aria-label={t('explorer.mapAccessibleLabel')}
        />
    )
}

export default TravelMapbox
