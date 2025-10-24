import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Database configurations
const databaseConfigs = {
  local: {
    host: 'localhost',
    user: 'root',
    password: '1234',
    port: 3306
  },
  production: {
    host: 'SPMWSM02X3ZD.saipemnet.saipem.intranet',
    user: 'user',
    password: 'Fabsi@1234',
    port: 3306
  }
};

async function setupDatabase() {
  try {
    const dbEnvironment = process.env.DB_ENVIRONMENT || 'local';
    const config = databaseConfigs[dbEnvironment as keyof typeof databaseConfigs];
    
    console.log(`🔧 Setting up database for ${dbEnvironment} environment...`);
    console.log(`📍 Connecting to: ${config.host}:${config.port}`);
    
    // First, connect without specifying a database to create it
    const connection = await mysql.createConnection(config);

    // Create the database
    await connection.execute('CREATE DATABASE IF NOT EXISTS fmrb_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    console.log('✅ Database fmrb_db created/verified');

    // Close connection and reconnect to the new database
    await connection.end();

    const dbConnection = await mysql.createConnection({
      ...config,
      database: 'fmrb_db'
    });

    // Read and execute schema.sql
    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    // Clean up SQL and filter out problematic statements
    const cleanSQL = schemaSQL
      .replace(/CREATE DATABASE.*?;/gi, '') // Remove CREATE DATABASE
      .replace(/USE.*?;/gi, '') // Remove USE statements
      .replace(/--.*$/gm, '') // Remove comments
      .replace(/\/\*[\s\S]*?\*\//g, ''); // Remove block comments
    
    // Split by semicolons and execute each statement
    const statements = cleanSQL.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      const trimmed = statement.trim();
      if (trimmed && !trimmed.startsWith('--')) {
        try {
          await dbConnection.execute(trimmed);
          console.log('✅ Executed:', trimmed.substring(0, 50) + '...');
        } catch (error: unknown) {
          // Ignore "already exists" errors
          const errorMessage = error instanceof Error ? error.message : String(error);
          if (!errorMessage.includes('already exists')) {
            console.log('❌ Failed statement:', trimmed.substring(0, 100) + '...');
            console.error('Error:', errorMessage);
          }
        }
      }
    }
    
    console.log('✅ Database schema created');

    // Check if we should run seed data
    const seedPath = path.join(__dirname, 'database', 'seed.sql');
    if (fs.existsSync(seedPath)) {
      const seedSQL = fs.readFileSync(seedPath, 'utf8');
      
      // Clean up seed SQL
      const cleanSeedSQL = seedSQL
        .replace(/--.*$/gm, '') // Remove comments
        .replace(/\/\*[\s\S]*?\*\//g, ''); // Remove block comments
        
      const seedStatements = cleanSeedSQL.split(';').filter(stmt => stmt.trim());
      
      for (const statement of seedStatements) {
        const trimmed = statement.trim();
        if (trimmed && !trimmed.startsWith('--')) {
          try {
            await dbConnection.execute(trimmed);
            console.log('✅ Seed executed:', trimmed.substring(0, 50) + '...');
          } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.log('❌ Seed failed:', trimmed.substring(0, 50) + '...');
            console.error('Seed error:', errorMessage);
          }
        }
      }
      console.log('✅ Seed data inserted');
    }

    await dbConnection.end();
    console.log('🎉 Database setup complete!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();