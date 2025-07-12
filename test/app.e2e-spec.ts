import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';

describe('App e2e tests', () => {
  let app: INestApplication;

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
  });

  /// Dummy test to pass
  it.todo('should pass a dummy test');

  afterAll(async () => {
    await app.close();
  });
});
