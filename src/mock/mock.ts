const imagePaths = Array.from(
  { length: 25 },
  (_, i) => `/images/${i + 1}.avif`
);

const brands = [
  'NX Studio',
  'PixelCore',
  'NovaDigital',
  'CodeCraft',
  'Websmiths',
];

const projectNames = [
  'Portfolio Website',
  'E-Commerce Platform',
  'Landing Page',
  'Booking App',
  'Dashboard',
];

const experienceTypes = ['UX/UI', 'Frontend', 'Backend'];

const getRandomFromArray = (arr: string[]) =>
  arr[Math.floor(Math.random() * arr.length)];

const getRandomYear = () => Math.floor(Math.random() * 6) + 2020;

const getRandomExperience = () => {
  const count = Math.random() > 0.5 ? 2 : 3;
  const shuffled = [...experienceTypes].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const generateProjectURL = (project: string) =>
  `/${project.toLowerCase().replace(/\s+/g, '-')}`;

// Модные пастельные и неоновые цвета
const trendyColors = [
  '#FF6B6B',
  '#4ECDC4',
  '#F7FFF7',
  '#FFE66D',
  '#1A535C',
  '#B388EB',
  '#FF9F1C',
  '#2EC4B6',
  '#E71D36',
  '#8D99AE',
  '#D7263D',
  '#3F88C5',
  '#FF6F59',
  '#06D6A0',
  '#EF476F',
];

const getReadableTextColor = (bgHex: string): string => {
  const hex = bgHex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // По формуле яркости (W3C)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 150 ? '#111111' : '#FFFFFF'; // тёмный или белый текст
};

export const jsonData = imagePaths.map((path) => {
  const brand = getRandomFromArray(brands);
  const projectType = getRandomFromArray(projectNames);
  const project = `${brand} ${projectType}`;
  const background = getRandomFromArray(trendyColors);
  const color = getReadableTextColor(background);

  return {
    image: path,
    brand,
    project,
    experience: getRandomExperience(),
    year: getRandomYear(),
    url: generateProjectURL(project),
    background,
    color,
  };
});
