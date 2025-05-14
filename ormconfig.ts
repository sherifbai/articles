import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { dbConfig } from './src/common/config/app.config';

void ConfigModule.forRoot({
  isGlobal: true,
  load: [dbConfig],
});

const AppDataSource = new DataSource(dbConfig() as any);
export default AppDataSource;
