import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

async function setupDatabase() {
  try {
    console.log('🔧 Setting up database...');
    
    // First, connect without specifying a database to create it
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '1234',
      port: 3306
    });

    // Create the database
    await connection.execute('CREATE DATABASE IF NOT EXISTS FabsiMB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    console.log('✅ Database FabsiMB created/verified');

    // Close connection and reconnect to the new database
    await connection.end();

    const dbConnection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '1234',
      database: 'FabsiMB',
      port: 3306
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
        } catch (error: any) {
          // Ignore "already exists" errors
          if (!error.message.includes('already exists')) {
            console.log('❌ Failed statement:', trimmed.substring(0, 100) + '...');
            console.error('Error:', error.message);
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
          } catch (error: any) {
            console.log('❌ Seed failed:', trimmed.substring(0, 50) + '...');
            console.error('Seed error:', error.message);
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