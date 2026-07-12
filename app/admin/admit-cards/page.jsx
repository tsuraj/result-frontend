'use client'
import AdminEntityManager from '../../../components/admin/AdminEntityManager'

const config = {
  title: 'Admit Cards Admin',
  entityLabel: 'Admit Card',
  resource: 'admit_cards',
  payloadKey: 'admit_card',
  detailKey: 'admit_card_detail',
  hasLinks: true,
  hasJobLink: true,
}

export default function Page() {
  return <AdminEntityManager config={config} />
}
