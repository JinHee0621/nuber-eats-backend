import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

jest.mock('got', () => {
  return {
    post: jest.fn(),
  };
});

const GRAPHQL_ENDPOINT = '/graphql'

describe('UserModule (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const module : TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    const dataSource : DataSource = new DataSource({
      type: 'postgres',
      host: process.env.DB_HOST,
      //@ts-ignore
      port: process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    const connection : DataSource = await dataSource.initialize();
    await connection.dropDatabase();
    await connection.destroy();
    await app.close();
  })

  it.todo('createAccount');
  describe('createAccount', () => {
     const EMAIL = 'nico@las.com';
     it('should create account', () => {
       return request(app.getHttpServer())
         .post(GRAPHQL_ENDPOINT)
         .send({
           query: `
           mutation {
             createAccount(input: {
               email:"${EMAIL}",
               password:"12345",
               role:Owner
             }) {
               ok
               error
             }
           }
           `,
         })
         .expect(200)
         .expect(res => {
           expect(res.body.data.createAccount.ok).toBe(true);
           expect(res.body.data.createAccount.error).toBe(null);
         });
     });

    it('should fail if account already exists', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
          mutation {
            createAccount(input: {
              email:"${EMAIL}",
              password:"12345",
              role:Owner
            }) {
              ok
              error
            }
          }
        `,
        })
        .expect(200)
        .expect(res => {
          expect(res.body.data.createAccount.ok).toBe(false);
          expect(res.body.data.createAccount.error).toBe(
            'There is a user with that email already',
          );
        });
    });
  });

  it.todo('userProfile');
  it.todo('login');
  it.todo('me');
  it.todo('verifyEmail');
  it.todo('editProfile');

});

