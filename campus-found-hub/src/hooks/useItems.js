import { useState, useEffect } from 'react'
import api from '../api/api'

const SEED = [
  {
    id: 'seed-1',
    type: 'lost',
    title: 'Blue North Face Backpack',
    category: 'Bags',
    description: 'Dark blue backpack with laptop compartment. Has a small keychain of a rubber duck attached. Lost near Library Block B.',
    location: 'Library Block B',
    date: '2024-03-10',
    contact: 'rahul.k@campus.edu',
    status: 'open',
    createdAt: '2024-03-10T09:30:00Z',
    tags: ['backpack', 'laptop bag', 'blue'],
  },
  {
    id: 'seed-2',
    type: 'found',
    title: 'iPhone 14 (Black)',
    category: 'Electronics',
    description: 'Found an iPhone 14 in a black case near the cafeteria. Screen has a small crack on top right. Dropped off at Security Office.',
    location: 'Cafeteria / Security Office',
    date: '2024-03-11',
    contact: 'security@campus.edu',
    status: 'open',
    createdAt: '2024-03-11T13:10:00Z',
    tags: ['phone', 'iphone', 'black'],
  },
  {
    id: 'seed-3',
    type: 'lost',
    title: 'Student ID Card — Priya Sharma',
    category: 'ID / Cards',
    description: 'Lost my student ID card. Student number is partially visible — begins with 2021. Please contact me if found!',
    location: 'Engineering Block',
    date: '2024-03-12',
    contact: 'priya.s@campus.edu',
    status: 'open',
    createdAt: '2024-03-12T11:00:00Z',
    tags: ['id card', 'student id'],
  },
  {
    id: 'seed-4',
    type: 'found',
    title: 'Set of Keys (3 keys + fob)',
    category: 'Keys',
    description: 'Found a set of 3 keys with a red lanyard near Hostel D entrance. Has a small Doraemon keychain.',
    location: 'Hostel D',
    date: '2024-03-09',
    contact: 'warden.d@campus.edu',
    status: 'resolved',
    createdAt: '2024-03-09T18:45:00Z',
    tags: ['keys', 'lanyard', 'hostel'],
  },
  {
    id: 'seed-5',
    type: 'lost',
    title: 'Scientific Calculator (Casio fx-991)',
    category: 'Stationery',
    description: 'Lost my Casio fx-991EX calculator during mid-sems. Name written on back in marker: "Arjun". Left in Exam Hall 3.',
    location: 'Exam Hall 3',
    date: '2024-03-08',
    contact: 'arjun.m@campus.edu',
    status: 'open',
    createdAt: '2024-03-08T16:00:00Z',
    tags: ['calculator', 'casio', 'stationery'],
  },
  {
    id: 'seed-6',
    type: 'found',
    title: 'Prescription Glasses (Round Frame)',
    category: 'Accessories',
    description: 'Found round-frame glasses with a brown case near the sports complex water cooler. Thin gold frames.',
    location: 'Sports Complex',
    date: '2024-03-13',
    contact: 'sports.office@campus.edu',
    status: 'open',
    createdAt: '2024-03-13T08:20:00Z',
    tags: ['glasses', 'spectacles', 'accessories'],
  },
]

const STORAGE_KEY = 'cfh_items'

function loadItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return SEED
}

function saveItems(items) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)) } catch {}
}

export function useItems() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchItems = async () => {
    try {
      const res = await api.get('/items');
      setItems(res.data.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems() }, [])

  const addItem = async (itemData) => {
    // Note: itemData should be FormData if it contains an image
    const config = {
      headers: { 'Content-Type': itemData instanceof FormData ? 'multipart/form-data' : 'application/json' }
    };
    const res = await api.post('/items', itemData, config);
    setItems((prev) => [res.data.data, ...prev]);
    return res.data.data._id;
  };

  const updateStatus = async (id, status) => {
    const res = await api.put(`/items/${id}`, { status });
    setItems((prev) => prev.map(i => i._id === id ? res.data.data : i));
  };

  const deleteItem = async (id) => {
    await api.delete(`/items/${id}`);
    setItems((prev) => prev.filter(i => i._id !== id));
  };

  const claimItem = async (id, message) => {
    // Note: This matches the new Claim API structure
    const res = await api.post('/claims', { itemId: id, message });
    return res.data;
  };

  return { items, loading, error, addItem, updateStatus, deleteItem, claimItem, refresh: fetchItems }
}
