import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto';

describe('App e2e tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // Set up global pipes, guards, etc. if needed
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // Automatically remove properties that do not have any decorators
      }),
    ); // Example of setting up a global validation
    await app.init();
    await app.listen(3000); // Start the application on port 3000
    prisma = app.get(PrismaService);
    // Optionally, you can clear the database or set up test data here
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3000'); // Set the base URL for Pactum requests
    console.log('E2E tests running on http://localhost:3000');
    console.log('Database cleaned for e2e tests');
  });

  afterAll(async () => {
    await app.close();
  });

  /// Place holder for Auth tests
  describe('Auth Module', () => {
    /// Describe a sign up test
    describe('Signup', () => {
      it('should throw if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withJson({ password: 'password' })
          .expectStatus(400);
      });

      it('should throw if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withJson({ email: 'test@example.com' })
          .expectStatus(400);
      });

      /// Throw if no body is provided
      it('should throw if no body is provided', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });

      it('should sign up a user', async () => {
        // Implement your test logic here
        // For example, you can use supertest to make HTTP requests to your application
        // and check the response.
        const dto: AuthDto = {
          email: 'test@example.com',
          password: 'password',
        };
        return pactum
          .spec()
          .post('/auth/signup')
          .withJson(dto)
          .expectStatus(201);
      });
    });

    /// Describe a sign in test
    describe('Signin', () => {
      it('should throw if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withJson({ password: 'password' })
          .expectStatus(400);
      });
      it('should throw if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withJson({ email: 'test@example.com' })
          .expectStatus(400);
      });

      /// Throw if no body is provided
      it('should throw if no body is provided', () => {
        return pactum.spec().post('/auth/signin').expectStatus(400);
      });

      /// Sign in a user
      it('should sign in a user', async () => {
        const dto: AuthDto = {
          email: 'test@example.com',
          password: 'password',
        };
        return pactum
          .spec()
          .post('/auth/signin')
          .withJson(dto)
          .expectStatus(200);
      });
    });

    /// Describe a sign in test
    describe('Signin', () => {
      it('should sign in a user', async () => {
        const dto: AuthDto = {
          email: 'test@example.com',
          password: 'password',
        };
        return pactum
          .spec()
          .post('/auth/signin')
          .withJson(dto)
          .expectStatus(200);
      });

      it('should return the current user', async () => {
        // Implement your test logic here
      });
    });
  });
});

/// Bookmark Module tests
describe('Bookmark Module', () => {
  it('should create a bookmark', async () => {
    // Implement your test logic here
  });

  it('should get all bookmarks', async () => {
    // Implement your test logic here
  });

  it('should update a bookmark', async () => {
    // Implement your test logic here
  });

  it('should delete a bookmark', async () => {
    // Implement your test logic here
  });
});

/// User Module tests
describe('User Module', () => {
  it('should get the current user', async () => {
    // Implement your test logic here
    // You can use supertest to make a GET request to the /users/me endpoint
    // and check if the response contains the expected user data.
  });
});
