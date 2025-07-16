import { UserService } from '../../services/user/user.service'
import bcrypt from 'bcrypt'

// On va simuler (mock) Prisma pour ne pas toucher à la vraie base de données
const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  session: {
    delete: jest.fn(),
  },
}

jest.mock('../../lib/generated/prisma', () => ({
  PrismaClient: jest.fn(() => mockPrisma),
  UserRoles: { USER: 'USER' },
}))

// On simule aussi l'envoi d'email
jest.mock('../../mail/resend', () => ({
  sendVerificationEmail: jest.fn(),
}))

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}))

//User create
describe('UserService', () => {
  let userService: UserService

  beforeEach(() => {
    userService = new UserService()
    jest.clearAllMocks() // Réinitialise les mocks avant chaque test
  })

  it('crée un utilisateur si email et username sont libres', async () => {
    // Arrange : on simule qu'aucun user n'existe
    mockPrisma.user.findUnique.mockResolvedValueOnce(null) // email
    mockPrisma.user.findUnique.mockResolvedValueOnce(null) // username
    mockPrisma.user.create.mockResolvedValueOnce({
      id: 1,
      email: 'test@mail.com',
      username: 'testuser',
    })

    const userData = {
      email: 'test@mail.com',
      username: 'testuser',
      password: '123456',
    }

    
    ;(bcrypt.hash as jest.Mock).mockResolvedValueOnce('hashedpassword')
    const user = await userService.createUser(userData as any)

    // Assert
    expect(user).toHaveProperty('id')
    expect(user.email).toBe('test@mail.com')
    expect(user.username).toBe('testuser')
  })
})

//User login
describe('UserService', () => {
  let userService: UserService

  beforeEach(() => {
    userService = new UserService()
    jest.clearAllMocks()
  })
  it('Se connecter avec un utilisateur', async () => {
    mockPrisma.user.findUnique.mockResolvedValueOnce({
      id: 1,
      email: 'test@mail.com',
      username: 'testuser',
      password: 'hashedpassword',
    })

    mockPrisma.user.findUnique.mockResolvedValueOnce({
      id: 1,
      email: 'test@mail.com',
      username: 'testuser',
      password: 'hashedpassword',
    })

    const loginData = {
      email: 'test@mail.com',
      password: 'hashedpassword',
    }

    ;(bcrypt.compare as jest.Mock).mockResolvedValueOnce(true)

    userService.createSession = jest.fn().mockResolvedValueOnce({ id: 'sessionid' })
    const result = await userService.login(
      { email: 'test@mail.com', password: 'hashedpassword' },
      {
        ipAdress: '127.0.0.1',
        userAgent: 'test-user-agent',
        deviceType: 'test-device-type',
        browser: 'test-browser',
        os: 'test-os',
        location: 'test-location',
      }
    )

    expect(result.user.email).toBe('test@mail.com')
    expect(result.user.username).toBe('testuser')
    expect(result.sessionId).toBe('sessionid')
  })
  it('doit echouere si le mot de passe est invalide', async () => {
    userService['prisma'].user.findUnique = jest.fn().mockResolvedValueOnce({
      id: 1,
      email: 'test@mail.com',
      username: 'testuser',
      password: 'hashedpassword',
    })

    ;(bcrypt.compare as jest.Mock).mockResolvedValueOnce(false)

    await expect(
      userService.login(
        { email: 'test@mail.com', password: 'hashedpassword' },
        {
          ipAdress: '127.0.0.1',
          userAgent: 'test-user-agent',
          deviceType: 'test-device-type',
          browser: 'test-browser',
          os: 'test-os',
          location: 'test-location',
        }
      )
    ).rejects.toThrow()
  })
})


//User logout
describe('UserService', () => {
  let userService: UserService

  beforeEach(() => {
    userService = new UserService()
    jest.clearAllMocks()
  })
  it('Se deconnecter avec un utilisateur', async () => {
    userService['prisma'].user.findUnique = jest.fn().mockResolvedValueOnce({
      id: 1,
      email: 'test@mail.com',
      username: 'testuser',
      password: 'hashedpassword',
    })
    userService['prisma'].session.delete = jest.fn().mockResolvedValueOnce({
      id: 'sessionid',
    })
  })
})

//User update
describe('UserService', () => {
  let userService: UserService

  beforeEach(() => {
    userService = new UserService()
    jest.clearAllMocks()
  })
  it('Mettre a jour un utilisateur', async () => {
    userService['prisma'].user.findUnique = jest.fn().mockResolvedValueOnce({
      id: 1,
      email: 'test@mail.com',
      username: 'testuser',
      password: 'hashedpassword',
    })
    userService['prisma'].user.update = jest.fn().mockResolvedValueOnce({
      id: 1,
      email: 'test@mail.com',
      username: 'testuser',
      password: 'hashedpassword',
    })
  })
})

//User delete
describe('UserService', () => {
  let userService: UserService

  beforeEach(() => {
    userService = new UserService()
    jest.clearAllMocks()
  })
  it('Supprimer un utilisateur', async () => {
    userService['prisma'].user.findUnique = jest.fn().mockResolvedValueOnce({
      id: 1,
      email: 'test@mail.com',
      username: 'testuser',
      password: 'hashedpassword',
    })
    userService['prisma'].user.delete = jest.fn().mockResolvedValueOnce({
      id: 1,
      email: 'test@mail.com',
      username: 'testuser',
      password: 'hashedpassword',
    })
  })
})


//getUserById
describe('UserService', () => {
  let userService: UserService

  beforeEach(() => {
    userService = new UserService()
    jest.clearAllMocks()
  })
  it('Obtenir un utilisateur par ID', async () => {
    userService['prisma'].user.findUnique = jest.fn().mockResolvedValueOnce({
      id: 1,
      email: 'test@mail.com',
      username: 'testuser',
      password: 'hashedpassword',
    })
  })
})

//getUserByUsername
describe('UserService', () => {
  let userService: UserService

  beforeEach(() => {
    userService = new UserService()
    jest.clearAllMocks()
  })
  it('Obtenir un utilisateur par username', async () => {
    userService['prisma'].user.findUnique = jest.fn().mockResolvedValueOnce({
      id: 1,
      email: 'test@mail.com',
      username: 'testuser',
      password: 'hashedpassword',
    })
  })
})
