'use client'
import AdminEntityManager from '../../../components/admin/AdminEntityManager'

const config = {
  title: 'Syllabus Admin',
  entityLabel: 'Syllabus',
  resource: 'syllabus',
  payloadKey: 'syllabus',
  detailKey: 'syllabus_detail',
  hasLinks: true,
  extraFields: [{ name: 'exam', label: 'Exam' }],
  extraDetailFields: [
    { name: 'exam_pattern', label: 'Exam Pattern', type: 'textarea' },
    { name: 'subject_wise_syllabus', label: 'Subject-wise Syllabus', type: 'textarea' },
    { name: 'negative_marking', label: 'Negative Marking' },
    { name: 'exam_duration', label: 'Exam Duration' },
  ],
  hasFaqs: true,
}

export default function Page() {
  return <AdminEntityManager config={config} />
}
