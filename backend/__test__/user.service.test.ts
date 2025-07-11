import { UserService } from '../services/user/user.service';

// On va simuler (mock) Prisma pour ne pas toucher à la vraie base de données
const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

jest.mock('../lib/generated/prisma', () => ({
  PrismaClient: jest.fn(() => mockPrisma),
  UserRoles: { USER: 'USER' },
}));

// On simule aussi l'envoi d'email
jest.mock('../mail/resend', () => ({
  sendVerificationEmail: jest.fn(),
}));

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
    jest.clearAllMocks(); // Réinitialise les mocks avant chaque test
  });

  it('crée un utilisateur si email et username sont libres', async () => {
    // Arrange : on simule qu'aucun user n'existe
    mockPrisma.user.findUnique.mockResolvedValueOnce(null); // email
    mockPrisma.user.findUnique.mockResolvedValueOnce(null); // username
    mockPrisma.user.create.mockResolvedValueOnce({
      id: 1,
      email: 'test@mail.com',
      username: 'testuser',
    });

    const userData = {
      email: 'test@mail.com',
      username: 'testuser',
      password: '123456',
    };

    // Act
    const user = await userService.createUser(userData as any);

    // Assert
    expect(user).toHaveProperty('id');
    expect(user.email).toBe('test@mail.com');
    expect(user.username).toBe('testuser');
  });
});
