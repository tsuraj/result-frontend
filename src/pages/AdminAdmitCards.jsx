import AdminEntityManager from '../components/admin/AdminEntityManager'

const config = {
  title: 'Admit Cards Admin',
  entityLabel: 'Admit Card',
  resource: 'admit_cards',
  payloadKey: 'admit_card',
  detailKey: 'admit_card_detail',
  hasLinks: false,
}

const AdminAdmitCards = () => <AdminEntityManager config={config} />

export default AdminAdmitCards
