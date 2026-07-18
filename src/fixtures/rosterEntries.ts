import type { RosterEntry } from '../lib/types'

export const rosterEntries: RosterEntry[] = [
  // Primary 3 — Sunflower Class
  { id: 'ros-1', parentName: 'Mrs. Amaka Adeyemi', phone: '0803 214 7765', pupilName: 'Zainab Adeyemi', classId: 'cls-sunflower', status: 'active', lastActive: 'Today' },
  { id: 'ros-2', parentName: 'Mr. & Mrs. Nwosu', phone: '0705 662 1190', pupilName: 'Chiamaka Nwosu', classId: 'cls-sunflower', status: 'active', lastActive: 'Today' },
  { id: 'ros-3', parentName: 'Alhaji Suleiman Bello', phone: '0812 340 5521', pupilName: 'Ibrahim Suleiman', classId: 'cls-sunflower', status: 'active', lastActive: 'Yesterday' },
  { id: 'ros-4', parentName: 'Mrs. Temitope Ogunleye', phone: '0908 774 3302', pupilName: 'Damilola Ogunleye', classId: 'cls-sunflower', status: 'active', lastActive: 'Yesterday' },
  { id: 'ros-5', parentName: 'Mr. Kelechi Okonkwo', phone: '0803 991 4487', pupilName: 'Kelechi Okonkwo Jr.', classId: 'cls-sunflower', status: 'inactive', lastActive: '3 weeks ago' },
  { id: 'ros-6', parentName: 'Mrs. Fatima Abubakar', phone: '0706 128 8890', pupilName: 'Amina Abubakar', classId: 'cls-sunflower', status: 'active', lastActive: '2 days ago' },
  { id: 'ros-7', parentName: 'Mr. Chukwuemeka Eze', phone: '0813 220 7761', pupilName: 'Chidinma Eze', classId: 'cls-sunflower', status: 'invited', lastActive: 'Never logged in' },
  { id: 'ros-8', parentName: 'Mrs. Grace Effiong', phone: '0902 341 6675', pupilName: 'Emmanuel Effiong', classId: 'cls-sunflower', status: 'active', lastActive: '3 days ago' },
  { id: 'ros-9', parentName: 'Mr. Segun Afolabi', phone: '0705 118 2290', pupilName: 'Tobi Afolabi', classId: 'cls-sunflower', status: 'active', lastActive: 'Today' },
  { id: 'ros-10', parentName: 'Mrs. Halima Mohammed', phone: '0816 552 0043', pupilName: 'Musa Mohammed', classId: 'cls-sunflower', status: 'invited', lastActive: 'Never logged in' },

  // Primary 1 — Skylark Class
  { id: 'ros-11', parentName: 'Mrs. Ruth Idowu', phone: '0803 442 9910', pupilName: 'David Idowu', classId: 'cls-skylark', status: 'active', lastActive: 'Today' },
  { id: 'ros-12', parentName: 'Mr. Abdullahi Yusuf', phone: '0908 213 6604', pupilName: 'Fatima Yusuf', classId: 'cls-skylark', status: 'active', lastActive: '2 days ago' },
  { id: 'ros-13', parentName: 'Mrs. Ngozi Chukwu', phone: '0813 771 2298', pupilName: 'Kelvin Chukwu', classId: 'cls-skylark', status: 'active', lastActive: 'Yesterday' },
  { id: 'ros-14', parentName: 'Mr. Musa Garba', phone: '0706 990 3312', pupilName: 'Zara Garba', classId: 'cls-skylark', status: 'inactive', lastActive: '1 month ago' },
  { id: 'ros-15', parentName: 'Mrs. Precious Anagor', phone: '0902 118 7743', pupilName: 'Chukwuebuka Anagor', classId: 'cls-skylark', status: 'active', lastActive: '4 days ago' },
  { id: 'ros-16', parentName: 'Mr. Yusuf Aliyu', phone: '0812 664 5521', pupilName: 'Sadiq Aliyu', classId: 'cls-skylark', status: 'invited', lastActive: 'Never logged in' },

  // Nursery 2 — Ladybird Class
  { id: 'ros-17', parentName: 'Mrs. Amaka Adeyemi', phone: '0803 214 7765', pupilName: 'Kanyinsola Adeyemi', classId: 'cls-ladybird', status: 'active', lastActive: 'Today' },
  { id: 'ros-18', parentName: 'Mr. & Mrs. Ojo', phone: '0705 331 8820', pupilName: 'Michael Ojo', classId: 'cls-ladybird', status: 'active', lastActive: 'Today' },
  { id: 'ros-19', parentName: 'Mrs. Blessing Etim', phone: '0813 552 9976', pupilName: 'Divine Etim', classId: 'cls-ladybird', status: 'active', lastActive: '2 days ago' },
  { id: 'ros-20', parentName: 'Mr. Emeka Umeh', phone: '0908 664 1120', pupilName: 'Adaeze Umeh', classId: 'cls-ladybird', status: 'invited', lastActive: 'Never logged in' },
  { id: 'ros-21', parentName: 'Mrs. Chioma Ibe', phone: '0706 218 7743', pupilName: 'Somtochukwu Ibe', classId: 'cls-ladybird', status: 'active', lastActive: 'Yesterday' },

  // Primary 5 — Falcon Class
  { id: 'ros-22', parentName: 'Mr. Tobiloba Akinyemi', phone: '0803 771 4432', pupilName: 'Simisola Akinyemi', classId: 'cls-falcon', status: 'active', lastActive: '3 days ago' },
  { id: 'ros-23', parentName: 'Mrs. Amina Lawal', phone: '0812 118 6675', pupilName: 'Bilkisu Lawal', classId: 'cls-falcon', status: 'active', lastActive: 'Yesterday' },
  { id: 'ros-24', parentName: 'Mr. David Chukwuma', phone: '0902 552 3391', pupilName: 'Chukwuma Jr.', classId: 'cls-falcon', status: 'inactive', lastActive: '5 weeks ago' },
  { id: 'ros-25', parentName: 'Mrs. Oluwaseun Bello', phone: '0705 442 8817', pupilName: 'Seun Bello', classId: 'cls-falcon', status: 'active', lastActive: 'Today' },
]

export const rosterForClass = (classId: string) =>
  rosterEntries.filter((entry) => entry.classId === classId)
