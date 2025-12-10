import mongoose from 'mongoose';
import Par from './models/Par.js';

const data = [
  {
    func: 'y = x',
    slug: 'y=x',
    imageUrl: '/uploads/graph_y=x.svg',
    label: 'Функція y = x',
  },
  {
    func: 'y = x²',
    slug: 'y=x^2',
    imageUrl: '/uploads/graph_y=x^2.svg',
    label: 'Функція y = x²',
  },
  {
    func: 'y = x³',
    slug: 'y=x^3',
    imageUrl: '/uploads/graph_y=x^3.svg',
    label: 'Функція y = x³',
  },
  {
    func: 'y = √x',
    slug: 'y=sqrt(x)',
    imageUrl: '/uploads/graph_y=sqrt(x).svg',
    label: 'Функція y = √x',
  },
  {
    func: 'y = √(-x)',
    slug: 'y=sqrt(-x)',
    imageUrl: '/uploads/graph_y=sqrt(-x).svg',
    label: 'Функція y = √(-x)',
  },
  {
    func: 'y = |x|',
    slug: 'y=abs(x)',
    imageUrl: '/uploads/graph_y=abs(x).svg',
    label: 'Функція y = |x|',
  },
  {
    func: 'y = -x',
    slug: 'y=-x',
    imageUrl: '/uploads/graph_y=-x.svg',
    label: 'Функція y = -x',
  },
  {
    func: 'y = -x²',
    slug: 'y=-x^2',
    imageUrl: '/uploads/graph_y=-x^2.svg',
    label: 'Функція y = -x²',
  },
  {
    func: 'y = -x³',
    slug: 'y=-x^3',
    imageUrl: '/uploads/graph_y=-x^3.svg',
    label: 'Функція y = -x³',
  },
  {
    func: 'y = -√x',
    slug: 'y=-sqrt(x)',
    imageUrl: '/uploads/graph_y=-sqrt(x).svg',
    label: 'Функція y = -√x',
  },
  {
    func: 'y = -|x|',
    slug: 'y=-abs(x)',
    imageUrl: '/uploads/graph_y=-abs(x).svg',
    label: 'Функція y = -|x|',
  },
  {
    func: 'y = 1/x',
    slug: 'y=1divx',
    imageUrl: '/uploads/graph_y=1divx.svg',
    label: 'Функція y = 1/x',
  },
  {
    func: 'y = -1/x',
    slug: 'y=-1divx',
    imageUrl: '/uploads/graph_y=-1divx.svg',
    label: 'Функція y = -1/x',
  },
  {
    func: 'y = 2',
    slug: 'y=2',
    imageUrl: '/uploads/graph_y=2.svg',
    label: 'Функція y = 2',
  },
  {
    func: 'x = 2',
    slug: 'x=2',
    imageUrl: '/uploads/graph_x=2.svg',
    label: 'Функція x = 2',
  },
];


async function seedDB() {
  try {
    await mongoose.connect('mongodb+srv://arseniitkachuk_db_user:rashamon2009@cluster0.dcqg0py.mongodb.net/tichProject?appName=Cluster0');
    console.log('MongoDB connected');

    for (const item of data) {
      await Par.updateOne(
        { slug: item.slug },    // шукаємо по унікальному slug
        { $set: item },        // оновлюємо або вставляємо новий запис
        { upsert: true }
      );
    }

    console.log('Seed data added/updated successfully');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error seeding DB:', err);
    process.exit(1);
  }
}

seedDB();
