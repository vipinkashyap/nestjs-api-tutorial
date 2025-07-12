import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto, EditUserDto } from 'src/auth/dto';
import { CreateBookmarkDto } from 'src/bookmark/dto';

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
          .expectStatus(200)
          .stores('userAt', 'access_token'); // Store the access token for later use
      });

      it('should return the current user', async () => {
        // Implement your test logic here
      });
    });
  });
});

/// Bookmark Module tests
describe('Bookmark Module', () => {
  /// Get Empty Bookmarks
  it('should get empty bookmarks', () => {
    return pactum
      .spec()
      .get('/bookmarks')
      .withHeaders({ Authorization: 'Bearer $S{userAt}' })
      .expectStatus(200)
      .inspect()
      .expectJson([]);
  });

  it('should create a bookmark', async () => {
    const dto: CreateBookmarkDto = {
      title: 'Test Bookmark',
      link: 'https://example.com',
    };
    return pactum
      .spec()
      .post('/bookmarks')
      .withHeaders({ Authorization: 'Bearer $S{userAt}' })
      .withJson(dto)
      .expectStatus(201);
  });

  it('should get all bookmarks', async () => {
    // Implement your test logic here
    return pactum
      .spec()
      .get('/bookmarks')
      .withHeaders({ Authorization: 'Bearer $S{userAt}' })
      .expectStatus(200);
  });

  it('should update a bookmark', async () => {
    // Implement your test logic here
    const dto: CreateBookmarkDto = {
      title: 'Updated Bookmark',
      link: 'https://updated-example.com',
    };
    return pactum
      .spec()
      .patch('/bookmarks/1') // Assuming the bookmark ID is 1
      .withHeaders({ Authorization: 'Bearer $S{userAt}' })
      .withJson(dto)
      .expectStatus(200);
  });

  it('should delete a bookmark', async () => {
    // Implement your test logic here
    return pactum
      .spec()
      .delete('/bookmarks/1') // Assuming the bookmark ID is 1
      .withHeaders({ Authorization: 'Bearer $S{userAt}' })
      .expectStatus(204);
  });
});

/// User Module tests
describe('User Module', () => {
  it('should get the current user', async () => {
    // Implement your test logic here
    // You can use supertest to make a GET request to the /users/me endpoint
    // and check if the response contains the expected user data.
    // Describe GET /users/me endpoint
    describe('GET /users/me', () => {
      it('should return the current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200);
      });
      it('should return 401 if not authenticated', () => {
        return pactum.spec().get('/users/me').expectStatus(401);
      });
    });

    /// Describe PATCH /users/edit endpoint
    describe('PATCH /users/edit', () => {
      it('should edit the user', () => {
        const dto: EditUserDto = {
          email: 'new-email@example.com',
          firstName: 'New Name',
        };

        return pactum
          .spec()
          .patch('/users/edit')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody(dto)
          .expectStatus(200);
      });
      it('should return 401 if not authenticated', () => {
        return pactum.spec().patch('/users/edit').expectStatus(401);
      });

      it('should throw if email is empty', () => {
        return pactum
          .spec()
          .patch('/users/edit')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody({
            email: '',
            firstName: 'New Name',
          })
          .expectStatus(400);
      });
    });
  });
});
