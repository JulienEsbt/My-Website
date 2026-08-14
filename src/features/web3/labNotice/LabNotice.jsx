import React from 'react'
import {FiAlertTriangle, FiCode, FiShield} from 'react-icons/fi'
import {useTranslation} from 'react-i18next'
import './LabNotice.css'

const POINTS = [
    {id: 'prototype', icon: <FiCode aria-hidden="true" />},
    {id: 'risk', icon: <FiShield aria-hidden="true" />},
    {id: 'advice', icon: <FiAlertTriangle aria-hidden="true" />},
]

export default function LabNotice() {
    const {t} = useTranslation('web3')

    return (
        <aside className="container web3-lab-notice" aria-labelledby="web3-lab-title">
            <div className="web3-lab-notice__heading">
                <span>{t('lab.kicker')}</span>
                <h2 id="web3-lab-title">{t('lab.title')}</h2>
                <p>{t('lab.description')}</p>
            </div>

            <ul>
                {POINTS.map((point) => (
                    <li key={point.id}>
                        <span className="web3-lab-notice__icon">{point.icon}</span>
                        <p>{t(`lab.points.${point.id}`)}</p>
                    </li>
                ))}
            </ul>
        </aside>
    )
}
