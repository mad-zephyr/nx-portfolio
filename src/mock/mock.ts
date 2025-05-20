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

export const jsonData = imagePaths.map((path) => {
  const project = `${getRandomFromArray(brands)} ${getRandomFromArray(projectNames)}`;

  return {
    image: path,
    brand: getRandomFromArray(brands),
    project,
    experience: getRandomExperience(),
    year: getRandomYear(),
    url: generateProjectURL(project),
  };
});
