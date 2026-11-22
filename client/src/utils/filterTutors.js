function normalize(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('vi')
    .trim()
}

export function filterTutors(tutorList, filters = {}) {
  const subject = normalize(filters.subject)
  const location = normalize(filters.location)
  const maxPrice = Number(filters.maxPrice) || 0

  return tutorList.filter((tutor) => {
    const subjectText = normalize([tutor.headline, ...tutor.subjects].join(' '))
    const locationText = normalize([tutor.area, tutor.city].join(' '))
    const matchesSubject = !subject || subjectText.includes(subject)
    const matchesLocation = !location || locationText.includes(location)
    const matchesPrice = !maxPrice || tutor.rate <= maxPrice

    return matchesSubject && matchesLocation && matchesPrice
  })
}
