import { Doctor } from '../types/types';

const allDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Marcus Horizon',
    specialty: 'Cardiology',
    rating: 4.7,
    reviews: 5,
    image:
      'https://thumbs.dreamstime.com/b/indian-doctor-mature-male-medical-standing-inside-hospital-handsome-model-portrait-43992356.jpg',
    isOnline: true,
    isAI: true,
  },
  {
    id: '2',
    name: 'Dr. Maria Elena',
    specialty: 'Psychology',
    rating: 4.9,
    reviews: 10,
    image:
      'https://img.freepik.com/free-photo/pleased-young-female-doctor-wearing-medical-robe-stethoscope-around-neck-standing-with-closed-posture_409827-254.jpg',
    isAI: true,
  },
  {
    id: '3',
    name: 'Dr. Sarah Johnson',
    specialty: 'Gastroenterologist',
    rating: 4.8,
    reviews: 15,
    image:
      'https://img.freepik.com/free-photo/woman-doctor-wearing-lab-coat-with-stethoscope-isolated_1303-29791.jpg',
    isOnline: true,
  },
  {
    id: '4',
    name: 'Dr. James Wilson',
    specialty: 'Neurologist',
    rating: 4.6,
    reviews: 8,
    image:
      'https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg',
  },
  {
    id: '5',
    name: 'Dr. Emily Brown',
    specialty: 'General Surgery',
    rating: 4.9,
    reviews: 20,
    image:
      'https://img.freepik.com/free-photo/beautiful-young-female-doctor-looking-camera-office_1301-7807.jpg',
    isOnline: true,
  },
  {
    id: '6',
    name: 'Dr. Robert Taylor',
    specialty: 'Cardiologist',
    rating: 4.7,
    reviews: 12,
    image:
      'https://img.freepik.com/free-photo/doctor-offering-medical-teleconsultation_23-2149329007.jpg',
  },
];

export default allDoctors;
