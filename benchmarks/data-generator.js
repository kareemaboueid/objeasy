/**
 * Data generator utility for performance testing
 * Creates realistic user data for benchmarking objeasy functions
 */

const firstNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack'];
const lastNames = [
  'Smith',
  'Johnson',
  'Williams',
  'Brown',
  'Jones',
  'Garcia',
  'Miller',
  'Davis',
  'Rodriguez',
  'Martinez'
];
const departments = [
  'Engineering',
  'Marketing',
  'Sales',
  'HR',
  'Finance',
  'Operations',
  'Design',
  'Support',
  'Legal',
  'Research'
];
const roles = [
  'developer',
  'manager',
  'analyst',
  'designer',
  'specialist',
  'coordinator',
  'director',
  'assistant',
  'consultant',
  'intern'
];
const cities = [
  'New York',
  'Los Angeles',
  'Chicago',
  'Houston',
  'Phoenix',
  'Philadelphia',
  'San Antonio',
  'San Diego',
  'Dallas',
  'San Jose'
];
const countries = ['USA', 'Canada', 'UK', 'Germany', 'France', 'Japan', 'Australia', 'Brazil', 'India', 'China'];

/**
 * Generate a random user object
 * @param {number} id - User ID
 * @returns {Object} Generated user object
 */
function generateUser(id) {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

  return {
    id,
    name: `${firstName} ${lastName}`,
    firstName,
    lastName,
    age: Math.floor(Math.random() * 50) + 20, // 20-70 years old
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
    department: departments[Math.floor(Math.random() * departments.length)],
    role: roles[Math.floor(Math.random() * roles.length)],
    salary: Math.floor(Math.random() * 100000) + 30000, // 30k-130k
    city: cities[Math.floor(Math.random() * cities.length)],
    country: countries[Math.floor(Math.random() * countries.length)],
    isActive: Math.random() > 0.1, // 90% active
    joinDate: new Date(Date.now() - Math.floor(Math.random() * 365 * 5) * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    skills: generateSkills(),
    projects: generateProjects(),
    preferences: {
      theme: Math.random() > 0.5 ? 'dark' : 'light',
      language: Math.random() > 0.3 ? 'en' : 'es',
      notifications: Math.random() > 0.2,
      timezone: 'UTC' + (Math.floor(Math.random() * 24) - 12)
    }
  };
}

/**
 * Generate random skills array
 * @returns {string[]} Array of skills
 */
function generateSkills() {
  const allSkills = ['JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'AWS', 'Docker', 'Git', 'TypeScript'];
  const numSkills = Math.floor(Math.random() * 5) + 1;
  const skills = [];

  for (let i = 0; i < numSkills; i++) {
    const skill = allSkills[Math.floor(Math.random() * allSkills.length)];
    if (!skills.includes(skill)) {
      skills.push(skill);
    }
  }

  return skills;
}

/**
 * Generate random projects array
 * @returns {Object[]} Array of project objects
 */
function generateProjects() {
  const projectNames = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Phoenix', 'Nova', 'Quantum', 'Nexus'];
  const statuses = ['active', 'completed', 'on-hold', 'planning'];
  const numProjects = Math.floor(Math.random() * 3) + 1;
  const projects = [];

  for (let i = 0; i < numProjects; i++) {
    projects.push({
      name: `Project ${projectNames[Math.floor(Math.random() * projectNames.length)]}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      progress: Math.floor(Math.random() * 100),
      startDate: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0]
    });
  }

  return projects;
}

/**
 * Generate array of user objects for testing
 * @param {number} count - Number of users to generate
 * @returns {Object[]} Array of user objects
 */
function generateUsers(count) {
  const users = [];
  for (let i = 1; i <= count; i++) {
    users.push(generateUser(i));
  }
  return users;
}

/**
 * Generate large nested object for complex testing
 * @param {number} userCount - Number of users to include
 * @returns {Object} Large complex object
 */
function generateLargeDataset(userCount = 10000) {
  return {
    metadata: {
      totalUsers: userCount,
      generatedAt: new Date().toISOString(),
      version: '1.0.0',
      regions: countries.map(country => ({
        name: country,
        userCount: Math.floor(Math.random() * 1000) + 100,
        isActive: Math.random() > 0.1
      }))
    },
    users: generateUsers(userCount),
    departments: departments.map(dept => ({
      name: dept,
      budget: Math.floor(Math.random() * 5000000) + 100000,
      headCount: Math.floor(Math.random() * 200) + 10,
      locations: cities.slice(0, Math.floor(Math.random() * 5) + 1)
    })),
    statistics: {
      totalSalary: 0, // Will be calculated
      averageAge: 0, // Will be calculated
      skillDistribution: {},
      departmentDistribution: {}
    }
  };
}

module.exports = {
  generateUser,
  generateUsers,
  generateLargeDataset,
  firstNames,
  lastNames,
  departments,
  roles,
  cities,
  countries
};
