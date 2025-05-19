const imagePaths = Array.from(
  { length: 25 },
  (_, i) => `/images/${i + 1}.avif`
);

const brands = [
  "NX Studio",
  "PixelCore",
  "NovaDigital",
  "CodeCraft",
  "Websmiths",
];
const projectNames = [
  "Portfolio Website",
  "E-Commerce Platform",
  "Landing Page",
  "Booking App",
  "Dashboard",
];
const experienceTypes = ["UX/UI", "Frontend", "Backend"];

const getRandomFromArray = (arr: string[]) =>
  arr[Math.floor(Math.random() * arr.length)];
const getRandomYear = () => Math.floor(Math.random() * 6) + 2020;

const getRandomExperience = () => {
  const count = Math.random() > 0.5 ? 2 : 3;
  const shuffled = [...experienceTypes].sort(() => 0.5 - Math.random());
  const d = shuffled.slice(0, count);

  return d;
};

export const jsonData = imagePaths.map((path) => ({
  image: path,
  brand: getRandomFromArray(brands),
  project: getRandomFromArray(projectNames),
  experience: getRandomExperience(),
  year: getRandomYear(),
}));
