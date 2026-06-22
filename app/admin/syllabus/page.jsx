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
}

export default function Page() {
  return <AdminEntityManager config={config} />
}
