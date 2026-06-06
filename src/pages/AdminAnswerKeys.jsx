import AdminEntityManager from '../components/admin/AdminEntityManager'

const config = {
  title: 'Answer Keys Admin',
  entityLabel: 'Answer Key',
  resource: 'answer_keys',
  payloadKey: 'answer_key',
  detailKey: 'answer_key_detail',
  hasLinks: true,
}

const AdminAnswerKeys = () => <AdminEntityManager config={config} />

export default AdminAnswerKeys
