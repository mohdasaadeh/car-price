import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from './../src/app.module';

describe('Authentication Routes (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users/signup (POST)', () => {
    const email = 'test@test.com';

    return request(app.getHttpServer())
      .post('/users/signup')
      .send({ email, password: '123' })
      .expect(201)
      .then((res) => {
        expect(res.body.email).toEqual(email);
      });
  });
});
