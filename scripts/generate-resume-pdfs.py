#!/usr/bin/env python3
"""Generate the two supplementary resume PDFs from the localized site data."""

import json
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path(__file__).resolve().parents[1]
FONT_DIR = Path('/System/Library/Fonts/Supplemental')
FONT_REGULAR = 'Helvetica'
FONT_BOLD = 'Helvetica-Bold'
BLUE = colors.HexColor('#4DB5FF')
NAVY = colors.HexColor('#071229')
INK = colors.HexColor('#17213A')
MUTED = colors.HexColor('#59647A')
PANEL = colors.HexColor('#F2F7FC')


def clean(value):
    return str(value).replace('—', '-').replace('–', '-').replace('‑', '-')


def register_fonts():
    global FONT_REGULAR, FONT_BOLD
    regular = FONT_DIR / 'Arial.ttf'
    bold = FONT_DIR / 'Arial Bold.ttf'
    if not regular.exists() or not bold.exists():
        return
    pdfmetrics.registerFont(TTFont('Resume', str(regular)))
    pdfmetrics.registerFont(TTFont('ResumeBold', str(bold)))
    FONT_REGULAR = 'Resume'
    FONT_BOLD = 'ResumeBold'


def styles():
    sheet = getSampleStyleSheet()
    return {
        'name': ParagraphStyle(
            'Name', parent=sheet['Title'], fontName=FONT_BOLD, fontSize=25,
            leading=28, textColor=NAVY, alignment=TA_CENTER, spaceAfter=3,
        ),
        'role': ParagraphStyle(
            'Role', fontName=FONT_BOLD, fontSize=12, leading=15,
            textColor=BLUE, alignment=TA_CENTER, spaceAfter=3,
        ),
        'focus': ParagraphStyle(
            'Focus', fontName=FONT_REGULAR, fontSize=9.5, leading=12,
            textColor=INK, alignment=TA_CENTER, spaceAfter=8,
        ),
        'summary': ParagraphStyle(
            'Summary', fontName=FONT_REGULAR, fontSize=9.2, leading=13,
            textColor=MUTED, alignment=TA_CENTER, spaceAfter=10,
        ),
        'section': ParagraphStyle(
            'Section', fontName=FONT_BOLD, fontSize=11, leading=13,
            textColor=NAVY, spaceBefore=5, spaceAfter=5,
        ),
        'title': ParagraphStyle(
            'EntryTitle', fontName=FONT_BOLD, fontSize=9.2, leading=11,
            textColor=INK, spaceAfter=1,
        ),
        'meta': ParagraphStyle(
            'Meta', fontName=FONT_REGULAR, fontSize=7.8, leading=10,
            textColor=BLUE, spaceAfter=2,
        ),
        'body': ParagraphStyle(
            'Body', fontName=FONT_REGULAR, fontSize=8.1, leading=10.4,
            textColor=MUTED, spaceAfter=2,
        ),
        'bullet': ParagraphStyle(
            'Bullet', fontName=FONT_REGULAR, fontSize=7.8, leading=10,
            textColor=INK, leftIndent=8, firstLineIndent=-5, bulletIndent=0, spaceAfter=1,
        ),
        'small': ParagraphStyle(
            'Small', fontName=FONT_REGULAR, fontSize=7.7, leading=9.5, textColor=MUTED,
        ),
        'small_bold': ParagraphStyle(
            'SmallBold', fontName=FONT_BOLD, fontSize=7.7, leading=9.5, textColor=INK,
        ),
    }


def section_heading(label, style):
    return Table(
        [[Paragraph(clean(label).upper(), style)]],
        colWidths=[None],
        style=TableStyle([
            ('LINEBELOW', (0, 0), (-1, -1), 1, BLUE),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ]),
    )


def entry_block(entry, style, include_bullets=True):
    content = [
        Paragraph(clean(entry.get('role') or entry.get('title') or entry.get('name')), style['title']),
        Paragraph(
            clean(' · '.join(filter(None, [entry.get('organization') or entry.get('school'), entry.get('period')]))),
            style['meta'],
        ),
    ]
    if entry.get('detail'):
        content.append(Paragraph(clean(entry['detail']), style['body']))
    if include_bullets:
        content.extend(
            Paragraph(clean(item), style['bullet'], bulletText='•') for item in entry.get('bullets', [])
        )
    if entry.get('skills'):
        content.append(Paragraph(f"<b>Skills:</b> {clean(entry['skills'])}", style['small']))
    if entry.get('thesis'):
        content.append(Paragraph(clean(entry['thesis']), style['small']))
    return KeepTogether(content + [Spacer(1, 3)])


def header_footer(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(NAVY)
    canvas.rect(0, A4[1] - 5 * mm, A4[0], 5 * mm, fill=1, stroke=0)
    canvas.setFont(FONT_REGULAR, 7)
    canvas.setFillColor(MUTED)
    canvas.drawString(18 * mm, 10 * mm, 'julien-esterbet.com')
    canvas.drawRightString(A4[0] - 18 * mm, 10 * mm, f'{doc.page}')
    canvas.restoreState()


def build(locale, source, output):
    data = json.loads(source.read_text(encoding='utf-8'))
    style = styles()
    doc = BaseDocTemplate(
        str(output), pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm,
        topMargin=15 * mm, bottomMargin=16 * mm,
        title=clean(data['meta']['title']), author='Julien Esterbet',
    )
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id='main')
    doc.addPageTemplates([PageTemplate(id='resume', frames=[frame], onPage=header_footer)])

    story = [
        Paragraph(clean(data['hero']['title']).upper(), style['name']),
        Paragraph(clean(data['hero']['role']), style['role']),
        Paragraph(clean(data['hero']['focus']), style['focus']),
        Paragraph(clean(data['hero']['summary']), style['summary']),
    ]

    contact = data['contact']
    contact_values = [
        contact['location'], contact['phone'], contact['email'], contact['linkedin'],
        contact['website'], contact['github'],
    ]
    story.append(
        Table(
            [[Paragraph(clean(item), style['small']) for item in contact_values[:3]],
             [Paragraph(clean(item), style['small']) for item in contact_values[3:]]],
            colWidths=[doc.width / 3] * 3,
            style=TableStyle([
                ('BACKGROUND', (0, 0), (-1, -1), PANEL),
                ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#C9D9EA')),
                ('INNERGRID', (0, 0), (-1, -1), 0.25, colors.HexColor('#DCE8F3')),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ('TOPPADDING', (0, 0), (-1, -1), 4),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
            ]),
        )
    )
    story.extend([Spacer(1, 7), section_heading(data['sections']['experience'], style['section'])])
    story.extend(entry_block(item, style) for item in data['experience'])

    story.append(PageBreak())
    story.append(section_heading(data['sections']['skills'], style['section']))
    skill_rows = []
    skills = data['skills']
    for index in range(0, len(skills), 2):
        row = []
        for item in skills[index:index + 2]:
            row.append(Paragraph(f"<b>{clean(item['name'])}</b><br/>{clean(item['detail'])}", style['body']))
        while len(row) < 2:
            row.append('')
        skill_rows.append(row)
    story.append(Table(skill_rows, colWidths=[doc.width / 2] * 2, style=TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), PANEL),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#C9D9EA')),
        ('INNERGRID', (0, 0), (-1, -1), 0.25, colors.HexColor('#DCE8F3')),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 7),
        ('RIGHTPADDING', (0, 0), (-1, -1), 7),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ])))

    story.extend([Spacer(1, 7), section_heading(data['sections']['education'], style['section'])])
    story.extend(entry_block(item, style, include_bullets=False) for item in data['education'])
    story.append(section_heading(data['sections']['projects'], style['section']))
    for project in data['projects']:
        story.append(KeepTogether([
            Paragraph(f"<b>{clean(project['name'])}</b> - {clean(project['status'])}", style['title']),
            Paragraph(clean(project['detail']), style['body']),
            Spacer(1, 4),
        ]))

    side_rows = [
        [Paragraph(data['sections']['certifications'], style['small_bold']), Paragraph(data['sections']['languages'], style['small_bold'])],
        [Paragraph('<br/>'.join(clean(item) for item in data['certifications']), style['small']),
         Paragraph('<br/>'.join(clean(item) for item in data['languages']), style['small'])],
    ]
    story.extend([Spacer(1, 6), Table(side_rows, colWidths=[doc.width / 2] * 2, style=TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), PANEL),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#C9D9EA')),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 7),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))])

    doc.build(story)


if __name__ == '__main__':
    register_fonts()
    targets = [
        ('fr', ROOT / 'src/i18n/fr/resume_fr.json', ROOT / 'src/assets/documents/Julien-Esterbet-CV-FR-2026.pdf'),
        ('en', ROOT / 'src/i18n/en/resume_en.json', ROOT / 'src/assets/documents/Julien-Esterbet-Resume-EN-2026.pdf'),
    ]
    for locale, source, output in targets:
        build(locale, source, output)
        print(f'Generated {output.relative_to(ROOT)}')
