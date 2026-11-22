import assert from 'node:assert/strict'
import test from 'node:test'
import { tutors } from '../fixtures/publicData.js'
import { filterTutors } from './filterTutors.js'

test('lọc gia sư theo môn học, khu vực và mức phí', () => {
  const result = filterTutors(tutors, {
    subject: 'Toan',
    location: 'Ha Noi',
    maxPrice: '220000',
  })

  assert.deepEqual(result.map((tutor) => tutor.id), ['tran-minh-quan'])
})

test('trả về danh sách rỗng khi không có hồ sơ phù hợp', () => {
  const result = filterTutors(tutors, {
    subject: 'Tieng Nhat',
    location: 'Da Nang',
  })

  assert.equal(result.length, 0)
})

test('fixture công khai không chứa trường liên hệ riêng tư', () => {
  const privateFields = ['phone', 'email', 'address', 'contact']

  for (const tutor of tutors) {
    for (const field of privateFields) {
      assert.equal(Object.hasOwn(tutor, field), false, `${tutor.id} không được có trường ${field}`)
    }
  }
})
