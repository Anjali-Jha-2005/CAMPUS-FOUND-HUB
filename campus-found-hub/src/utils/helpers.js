export const CATEGORIES = [
  'Electronics',
  'Bags',
  'Keys',
  'ID / Cards',
  'Accessories',
  'Clothing',
  'Books',
  'Stationery',
  'Sports',
  'Other',
]

export const LOCATIONS = [
  'Library Block A',
  'Library Block B',
  'Cafeteria',
  'Exam Hall 1',
  'Exam Hall 2',
  'Exam Hall 3',
  'Engineering Block',
  'Science Block',
  'Arts Block',
  'Admin Block',
  'Hostel A',
  'Hostel B',
  'Hostel C',
  'Hostel D',
  'Sports Complex',
  'Security Office',
  'Main Gate',
  'Parking Lot',
  'Other',
]

export function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

export function timeAgo(isoStr) {
  const diff = Date.now() - new Date(isoStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}
